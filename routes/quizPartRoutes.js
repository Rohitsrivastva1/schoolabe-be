const express = require("express");
const { createQuizPart, getQuizParts, updateQuizPart, deleteQuizPart } = require("../controllers/quizPartController");
const router = express.Router();

router.post("/quizzes/:quizSlug/parts", createQuizPart);
router.get("/quizzes/:quizSlug/parts", getQuizParts);
router.put("/quiz-parts/:partId", updateQuizPart);
router.delete("/quiz-parts/:partId", deleteQuizPart);

module.exports = router;
