const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connectdb");
const Quiz = require("./Quiz");

const Question = sequelize.define("Question", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  quizId: {  // ✅ Ensure quizId is correctly linked
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Quizzes",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  options: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  correctAnswers: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
});

// ✅ FIX: Associate Question directly with Quiz
Quiz.hasMany(Question, { foreignKey: "quizId", as: "questions" });
Question.belongsTo(Quiz, { foreignKey: "quizId", as: "quiz" });

module.exports = Question;
