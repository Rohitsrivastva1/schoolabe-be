const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getQuestionsByCategory,
  getQuestionById
} = require("../../controllers/DSA/dsaQuestionController");

router.post("/", createQuestion);
router.get("/category/:categoryId", getQuestionsByCategory);
router.get("/:id", getQuestionById); // ✅ Add this line

module.exports = router;
