const express = require("express");
const { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } = require("../controllers/courseController");

const router = express.Router();
const { adminAuth } = require("../middlewares/authMiddleware"); // ✅ FIXED: Import adminAuth

router.post("/",adminAuth, createCourse);
router.get("/",  getCourses);
router.get("/:id", getCourseById);
router.put("/:id", adminAuth,updateCourse);
router.delete("/:id", adminAuth,deleteCourse);

module.exports = router;
