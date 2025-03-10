const express = require("express");
const { createCourse, getCourses, getCourseBySlug, updateCourse, deleteCourse } = require("../controllers/courseController");

const router = express.Router();
const { adminAuth } = require("../middlewares/authMiddleware"); // ✅ FIXED: Import adminAuth

router.post("/",adminAuth, createCourse);
router.get("/",  getCourses);
router.get("/:slug", getCourseBySlug);
router.put("/:slug", adminAuth,updateCourse);
router.delete("/:slug", adminAuth, deleteCourse);

module.exports = router;


