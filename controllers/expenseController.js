const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../config/db");
const makeCategory = require("../config/gimini-category");

exports.addExpense = async (req, res) => {
  const t = await sequelize.transaction();  

  try {
    const { amount, category, description, note } = req.body;
    const userId = req.user.id;

    let finalCategory =
      category && category.trim() !== ""
        ? category
        : await makeCategory(description);

    // Fetch real Sequelize user instance
    const user = await User.findByPk(userId, { transaction: t });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    // Create expense inside transaction
    const expense = await Expense.create(
      {
        amount,
        category: finalCategory,
        description,
        note,
        userId: userId,
      },
      { transaction: t }
    );

    // Update user total expense inside same transaction
    await user.update(
      {
        totalExpense: user.totalExpense + Number(amount),
      },
      { transaction: t }
    );

    // Commit transaction
    await t.commit();

    res.status(200).json({
      message: "Expense added successfully",
      expenseId: expense.id,
    });
  } catch (error) {
    console.error("Add expense error:", error);

    // Rollback if any error occurs
    await t.rollback();

    res.status(500).json({ message: "Error adding expense" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Read page number from query (default = 1)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const { count, rows } = await Expense.findAndCountAll({
      where: { userId },
      limit: limit,
      offset: offset,
      order: [["id", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      expenses: rows,
      currentPage: page,
      totalPages,
      totalItems: count,
      limit,
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ message: "Error fetching expenses" });
  }
};

exports.deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const expId = req.params.id;
    const userId = req.user.id;

    // Find the expense
    const expense = await Expense.findOne({
      where: { id: expId, userId },
      transaction: t,
    });

    if (!expense) {
      await t.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }

    // Find the user
    const user = await User.findByPk(userId, { transaction: t });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    // Update user.totalExpense
    const newTotal = Number(user.totalExpense) - Number(expense.amount);

    await user.update({ totalExpense: newTotal }, { transaction: t });

    // Delete the expense
    await expense.destroy({ transaction: t });

    await t.commit();

    res.status(200).json({ message: "Expense deleted and total updated" });
  } catch (error) {
    await t.rollback();
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};
