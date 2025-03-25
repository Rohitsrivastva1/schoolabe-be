const express = require("express");
const {
  createQuiz,
  getQuizzes,
  getQuizBySlug,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/quizController");

const  { createQuizPart, getQuizParts } =   require("../controllers/quizPartController");
const router = express.Router();
const { adminAuth } = require("../middlewares/authMiddleware");

// ✅ Quiz Routes
router.post("/quizzes", createQuiz);
router.get("/quizzes", getQuizzes);
router.get("/quizzes/:slug", getQuizBySlug);
router.put("/quizzes/:slug", updateQuiz);  // ✅ Added missing update route
router.delete("/quizzes/:slug", deleteQuiz);

// ✅ Question Routes
router.post("/quizzes/:slug/questions", addQuestion);
router.put("/quizzes/:slug/questions/:questionId", updateQuestion);  // ✅ Added update question route
router.delete("/quizzes/:slug/questions/:questionId", deleteQuestion);  // ✅ Added delete question route
router.post("/quizzes/:slug/parts", createQuizPart);
router.get("/quizzes/:slug/parts", getQuizParts);

module.exports = router;
