const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../config/db");

exports.addExpense = async (req, res) => {
  const t = await sequelize.transaction(); // START transaction

  try {
    const { amount, category, description } = req.body;
    const userId = req.user.id;

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
        category,
        description,
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
    const expenses = await Expense.findAll({
      where: { userId: userId }
    });

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ message: "Error fetching expenses" });
  }
};
