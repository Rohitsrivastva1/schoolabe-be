const Course = require("../models/Course");

// Function to generate URL-friendly slugs
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^\w\-]+/g, "") // Remove special characters
    .replace(/\-\-+/g, "-"); // Replace multiple dashes with single one
};

// Create a Course with Slug
const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const slug = slugify(title);

    // Check if a course with the same slug exists
    const existingCourse = await Course.findOne({ where: { slug } });
    if (existingCourse) {
      return res.status(400).json({ success: false, message: "Course with this title already exists!" });
    }

    const course = await Course.create({ title, slug, description });
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Course by Slug
const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ where: { slug: req.params.slug } });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Course by Slug
const updateCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.findOne({ where: { slug: req.params.slug } });

    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    // Update slug if title is changed
    if (title && title !== course.title) {
      const newSlug = slugify(title);
      const existingCourse = await Course.findOne({ where: { slug: newSlug } });

      if (existingCourse && existingCourse.id !== course.id) {
        return res.status(400).json({ success: false, message: "Another course with this title already exists!" });
      }

      course.slug = newSlug;
    }

    // Update other fields
    if (description) course.description = description;

    await course.save();
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Course by Slug
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ where: { slug: req.params.slug } });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    await course.destroy();
    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createCourse, getCourses, getCourseBySlug, updateCourse, deleteCourse };
