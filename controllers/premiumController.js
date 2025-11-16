

// controllers/premiumController.js
const User = require("../models/userModel");

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "totalExpense"],
      order: [["totalExpense", "DESC"]],
      limit: 50,
    });

    const leaderboard = users.map((u, index) => ({
      rank: index + 1,
      name: u.name,
      totalAmount: u.totalExpense || 0,
    }));

    res.json({ leaderboard });
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
