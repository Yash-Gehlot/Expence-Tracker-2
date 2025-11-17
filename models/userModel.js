const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Expense = require("./expenseModel");
const ForgotPassword = require("./forgotPassModel");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    totalExpense: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "users",
    timestamps: false, // Disabled to match existing database schema
    freezeTableName: true, // Prevent Sequelize from pluralizing table name
  }
);

User.hasMany(Expense, { foreignKey: "userId" });
Expense.belongsTo(User, { foreignKey: "userId" });

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

module.exports = Expense;
module.exports = User;

// const db = require("../config/db");

// const User = {
//   findByEmail: (email, callback) => {
//     const sql = "SELECT * FROM users WHERE email = ?";
//     db.query(sql, [email], callback);
//   },

//   create: (name, email, hashedPassword, callback) => {
//     const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
//     db.query(sql, [name, email, hashedPassword], callback);
//   },
// };

// module.exports = User;
