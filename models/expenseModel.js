const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel");

const Expense = sequelize.define(
  "Expense",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
  },
  {
    tableName: "Dailyexp",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Expense;

// const db = require("../config/db");

// const Expense = {
//   add: (amount, category, description, userId, callback) => {
//     const sql =
//       "INSERT INTO Dailyexp (amount, category, description, user_id) VALUES (?, ?, ?, ?)";
//     db.query(sql, [amount, category, description, userId], callback);
//   },

//   getAll: (userId, callback) => {
//     const sql = "SELECT * FROM Dailyexp WHERE user_id = ?";
//     db.query(sql, [userId], callback);
//   },
// };

// module.exports = Expense;
