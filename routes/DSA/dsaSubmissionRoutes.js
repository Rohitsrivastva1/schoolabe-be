const express = require("express");
const router = express.Router();
const submissionController = require("../../controllers/DSA/dsaSubmissionController");
const { requireAuth } = require("../../middlewares/authMiddleware");

router.post("/submit", requireAuth, submissionController.submitSolution);
router.get("/user/:userId", requireAuth, submissionController.getUserSubmissions);
router.get("/question/:questionId", submissionController.getSubmissionsByQuestion); // Optional

module.exports = router;
