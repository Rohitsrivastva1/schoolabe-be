const { v4: uuidv4 } = require("uuid"); // Import UUID for unique IDs
const Tutorial = require("../models/Tutorial");

// Create a Tutorial for a Course
const createTutorial = async (req, res) => {
    try {
      let { title, content, courseId } = req.body;  // ✅ Use `let` instead of `const`
  
      console.log(content);
  
      // If content is a string, parse it
      if (typeof content === "string") {
        content = JSON.parse(content);
      }
  
      console.log(Array.isArray(content));
  
      // Validate that content is an array
      if (!Array.isArray(content)) {
        return res.status(400).json({ success: false, message: "Content must be an array of objects" });
      }
  
      // Assign unique IDs if not provided
      const formattedContent = content.map((item) => ({
        id: item.id || uuidv4(),
        type: item.type,
        text: item.text,
      }));
  
      console.log(formattedContent);
  
      // Save tutorial to database
      const tutorial = await Tutorial.create({ title, content: formattedContent, courseId });
  
      res.status(201).json({ success: true, tutorial });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Get All Tutorials for a Course
const getTutorialsByCourse = async (req, res) => {
  try {
    const tutorials = await Tutorial.findAll({ where: { courseId: req.params.courseId } });
    res.status(200).json({ success: true, tutorials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Tutorial
const getTutorialById = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByPk(req.params.id);
    if (!tutorial) return res.status(404).json({ success: false, message: "Tutorial not found" });

    res.status(200).json({ success: true, tutorial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};  

// Update Tutorial
const updateTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByPk(req.params.id);
    if (!tutorial) return res.status(404).json({ success: false, message: "Tutorial not found" });

    await tutorial.update(req.body);
    res.status(200).json({ success: true, tutorial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Tutorial
const deleteTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByPk(req.params.id);
    if (!tutorial) return res.status(404).json({ success: false, message: "Tutorial not found" });

    await tutorial.destroy();
    res.status(200).json({ success: true, message: "Tutorial deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createTutorial, getTutorialsByCourse, getTutorialById, updateTutorial, deleteTutorial };
