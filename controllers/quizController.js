const Quiz = require("../models/quiz");

// Create a new quiz/course
const createQuiz = async (req, res) => {
  try {
    const { title, description, contentBlocks, quizzes } = req.body;
    const newQuiz = await Quiz.create({ title, description, contentBlocks, quizzes });
    res.status(201).json({ success: true, quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all quizzes/courses
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single quiz/course by ID
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a quiz/course by ID
const updateQuiz = async (req, res) => {
  try {
    const { title, description, contentBlocks, quizzes } = req.body;
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.contentBlocks = contentBlocks || quiz.contentBlocks;
    quiz.quizzes = quizzes || quiz.quizzes;
    await quiz.save();
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a quiz/course by ID
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    await quiz.destroy();
    res.json({ success: true, message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createQuiz, getAllQuizzes, getQuizById, updateQuiz, deleteQuiz };
