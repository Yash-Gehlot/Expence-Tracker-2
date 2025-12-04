import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Expense from "./expenseModel.js";
import ForgotPassword from "./forgotPassModel.js";

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
    freezeTableName: true,  
  }
);

User.hasMany(Expense, { foreignKey: "userId" });
Expense.belongsTo(User, { foreignKey: "userId" });

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

export default User;
