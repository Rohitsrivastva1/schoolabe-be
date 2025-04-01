const QuizPart = require("../models/QuizPart");
// const Quiz = require("../models/Quiz");

// ✅ Create a Quiz Part
const createQuizPart = async (req, res) => {
  try {
    const { title } = req.body;
    const quiz = await Quiz.findOne({ where: { slug: req.params.slug } });

    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    const quizPart = await QuizPart.create({ title, quizId: quiz.id });
    res.status(201).json({ success: true, quizPart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Quiz Parts by Quiz Slug
const getQuizParts = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ where: { slug: req.params.slug }, include: "parts" });

    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    res.status(200).json({ success: true, parts: quiz.parts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createQuizPart, getQuizParts };
