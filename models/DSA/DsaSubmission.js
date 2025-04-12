const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/connectdb");
const DsaQuestion = require("./DsaQuestion");

const DsaSubmission = sequelize.define("DsaSubmission", {
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  output: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

DsaQuestion.hasMany(DsaSubmission);
DsaSubmission.belongsTo(DsaQuestion);

module.exports = DsaSubmission;
