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
router.get("/:courseSlug", getTutorialsByCourseSlug);
router.get("/courseSlug/:tutorialSlug", getTutorialBySlug);
router.put("/:courseSlug/:tutorialSlug",adminAuth, updateTutorial);
router.delete("/:courseSlug/:tutorialSlug",adminAuth, deleteTutorial);

module.exports = router;

