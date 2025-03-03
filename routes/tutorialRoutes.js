const express = require("express");
const {
  createTutorial,
  getTutorialsByCourse,
  getTutorialById,
  updateTutorial,
  deleteTutorial,
} = require("../controllers/tutorialController");

const router = express.Router();

router.post("/", createTutorial);
router.get("/:courseId", getTutorialsByCourse);
router.get("/tutorial/:id", getTutorialById);
router.put("/:id", updateTutorial);
router.delete("/:id", deleteTutorial);

module.exports = router;
