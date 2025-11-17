const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ForgotPasswordRequests = sequelize.define("ForgotPassword", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = ForgotPasswordRequests;
