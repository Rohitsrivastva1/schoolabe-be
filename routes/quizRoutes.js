const express = require("express");
const router = express.Router();
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quizController");

// Create a new quiz/course
router.post("/", createQuiz);

// Get all quizzes/courses
router.get("/", getAllQuizzes);

// Get a single quiz/course by ID
router.get("/:id", getQuizById);

// Update a quiz/course by ID
router.put("/:id", updateQuiz);

// Delete a quiz/course by ID
router.delete("/:id", deleteQuiz);

module.exports = router;
