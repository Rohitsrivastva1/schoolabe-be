const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connectdb");
const Quiz = require("./Quiz");

const QuizPart = sequelize.define("QuizPart", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quizId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Quizzes",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Quiz.hasMany(QuizPart, { foreignKey: "quizId", as: "parts" });
QuizPart.belongsTo(Quiz, { foreignKey: "quizId", as: "quiz" });

module.exports = QuizPart;
