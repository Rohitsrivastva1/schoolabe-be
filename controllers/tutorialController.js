const { v4: uuidv4 } = require("uuid"); // Import UUID for unique IDs
const Tutorial = require("../models/Tutorial");
const Course = require("../models/Course");

// Function to generate URL-friendly slugs
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^\w\-]+/g, "") // Remove special characters
    .replace(/\-\-+/g, "-"); // Replace multiple dashes with a single one
};

// ✅ Create a Tutorial for a Course (Now Uses Slugs)
const createTutorial = async (req, res) => {
  try {
    let { title, content, courseSlug } = req.body;

    // Get course by slug
    const course = await Course.findOne({ where: { slug: courseSlug } });
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Convert content to JSON if it's a string
    if (typeof content === "string") {
      content = JSON.parse(content);
    }

    // Validate content format
    if (!Array.isArray(content)) {
      return res.status(400).json({ success: false, message: "Content must be an array of objects" });
    }

    // Assign unique IDs if not provided
    const formattedContent = content.map((item) => ({
      id: item.id || uuidv4(),
      type: item.type,
      text: item.text,
    }));

    // Generate unique slug
    let slug = slugify(title);
    let existingTutorial = await Tutorial.findOne({ where: { slug, courseId: course.id } });

    if (existingTutorial) {
      return res.status(400).json({ success: false, message: "Tutorial with this title already exists!" });
    }

    // Save tutorial to database
    const tutorial = await Tutorial.create({ title, slug, content: formattedContent, courseId: course.id });

    res.status(201).json({ success: true, tutorial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Tutorials for a Course (Using Course Slug)
const getTutorialsByCourseSlug = async (req, res) => {
  try {
    const course = await Course.findOne({ where: { slug: req.params.courseSlug } });
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const tutorials = await Tutorial.findAll({ where: { courseId: course.id } });
    res.status(200).json({ success: true, tutorials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Single Tutorial by Slug
const getTutorialBySlug = async (req, res) => {
  try {
    const tutorial = await Tutorial.findOne({ where: { slug: req.params.tutorialSlug } });
    if (!tutorial) return res.status(404).json({ success: false, message: "Tutorial not found" });

    res.status(200).json({ success: true, tutorial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Tutorial by Slug
const updateTutorial = async (req, res) => {
  try {
    const { title, content } = req.body;
    const tutorial = await Tutorial.findOne({ where: { slug: req.params.tutorialSlug } });

    if (!tutorial) return res.status(404).json({ success: false, message: "Tutorial not found" });

    // Update slug if title is changed
    if (title && title !== tutorial.title) {
      let newSlug = slugify(title);
      const existingTutorial = await Tutorial.findOne({ where: { slug: newSlug, courseId: tutorial.courseId } });

      if (existingTutorial && existingTutorial.id !== tutorial.id) {
        return res.status(400).json({ success: false, message: "Another tutorial with this title already exists!" });
      }

      tutorial.slug = newSlug;
    }

    // Update other fields
    if (content) tutorial.content = content;

    await tutorial.save();
    res.status(200).json({ success: true, tutorial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Tutorial by Slug
const deleteTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findOne({ where: { slug: req.params.tutorialSlug } });
    if (!tutorial) return res.status(404).json({ success: false, message: "Tutorial not found" });

    await tutorial.destroy();
    res.status(200).json({ success: true, message: "Tutorial deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createTutorial, getTutorialsByCourseSlug, getTutorialBySlug, updateTutorial, deleteTutorial };
