const express = require("express");
const {
  createTutorial,
  getTutorialsByCourseSlug,
  getTutorialBySlug,
  updateTutorial,
  deleteTutorial,
} = require("../controllers/tutorialController");
const { adminAuth } = require("../middlewares/authMiddleware"); // ✅ FIXED: Import adminAuth

const router = express.Router();

router.post("/", adminAuth, createTutorial);
router.get("/:courseId", getTutorialsByCourse);
router.get("/tutorial/:id", getTutorialById);
router.put("/:id", adminAuth, updateTutorial);
router.delete("/:id",adminAuth, deleteTutorial);

module.exports = router;
