const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/connectdb");

const DsaCategory = sequelize.define("DsaCategory", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // ✅ Prevent duplicate names

  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = DsaCategory;
