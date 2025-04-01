const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connectdb");

const Quiz = sequelize.define("Quiz", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Array of content blocks (paragraph, heading, list)
  contentBlocks: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  // Quiz details page – multiple quiz parts
  quizzes: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
}, {
  tableName: "quizzes",
  timestamps: true,
});

module.exports = Quiz;
