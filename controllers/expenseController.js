import Expense from "../models/expenseModel.js";
import User from "../models/userModel.js";
import sequelize from "../config/db.js";
import makeCategory from "../config/gimini-category.js";

export const addExpense = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { amount, category, description, note } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId, { transaction: t });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    const expense = await Expense.create(
      {
        amount,
        category,
        description,
        note,
        userId: userId,
      },
      { transaction: t }
    );

    await user.update(
      {
        totalExpense: user.totalExpense + Number(amount),
      },
      { transaction: t }
    );

    await t.commit();

    res.status(200).json({
      message: "Expense added successfully",
      expenseId: expense.id,
    });
  } catch (error) {
    console.error("Add expense error:", error);

    await t.rollback();

    res.status(500).json({ message: "Error adding expense" });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1; // page = which page user wants
    const limit = parseInt(req.query.limit) || 5; // how many items per page
    const offset = (page - 1) * limit; // how many rows to skip

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

export const deleteExpense = async (req, res) => {
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

export const suggestCategory = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || description.trim() === "") {
      return res.status(400).json({
        message: "Description is required",
        category: "",
      });
    }

    // Call the AI function to generate category
    const category = await makeCategory(description);

    res.status(200).json({
      success: true,
      category: category,
    });
  } catch (error) {
    console.error("Category suggestion error:", error);
    res.status(500).json({
      success: false,
      message: "Error suggesting category",
      category: "other",
    });
  }
};
