const express = require("express");
const { createCourse, getCourses, getCourseBySlug, updateCourse, deleteCourse } = require("../controllers/courseController");

const router = express.Router();
const { adminAuth } = require("../middlewares/authMiddleware"); // ✅ FIXED: Import adminAuth

router.post("/", createCourse);
router.get("/",  getCourses);
router.get("/:slug", getCourseBySlug);
router.put("/:slug",updateCourse);
router.delete("/:slug", deleteCourse);


  
module.exports = router;


