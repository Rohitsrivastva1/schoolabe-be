const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/connectdb");
const DsaQuestion = require("./DsaQuestion");

const DsaTestCase = sequelize.define("DsaTestCase", {
  input: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expectedOutput: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

// 👇 Relationship setup
DsaQuestion.hasMany(DsaTestCase, { foreignKey: "questionId" });
DsaTestCase.belongsTo(DsaQuestion, { foreignKey: "questionId" });

module.exports = DsaTestCase;
