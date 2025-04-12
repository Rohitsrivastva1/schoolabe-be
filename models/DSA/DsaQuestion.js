const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/connectdb");
const DsaCategory = require("./DsaCategory");

const DsaQuestion = sequelize.define("DsaQuestion", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.JSONB, // Rich content (h1, h2, code, list, etc.)
    allowNull: false,
  },
  questionVideoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  solutionVideoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

DsaCategory.hasMany(DsaQuestion);
DsaQuestion.belongsTo(DsaCategory);

module.exports = DsaQuestion;
