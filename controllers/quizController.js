const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

// Function to generate slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// ✅ Create a Quiz
const createQuiz = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const slug = slugify(title);

    // Check if quiz exists
    const existingQuiz = await Quiz.findOne({ where: { slug } });
    if (existingQuiz) {
      return res.status(400).json({ success: false, message: "Quiz with this title already exists!" });
    }

    const quiz = await Quiz.create({ title, slug, description, category });
    res.status(201).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Quizzes
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Quiz by Slug
const getQuizBySlug = async (req, res) => {
  try {
    console.log("sss");
    
    const quiz = await Quiz.findOne({
      where: { slug: req.params.slug },
      include: [{ model: Question, as: "questions" }],
    });

    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    res.status(200).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update a Quiz
const updateQuiz = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const quiz = await Quiz.findOne({ where: { slug: req.params.slug } });

    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    if (title && title !== quiz.title) {
      const newSlug = slugify(title);
      const existingQuiz = await Quiz.findOne({ where: { slug: newSlug } });

      if (existingQuiz && existingQuiz.id !== quiz.id) {
        return res.status(400).json({ success: false, message: "Another quiz with this title already exists!" });
      }
      quiz.slug = newSlug;
    }

    if (description) quiz.description = description;
    if (category) quiz.category = category;

    await quiz.save();
    res.status(200).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete a Quiz
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ where: { slug: req.params.slug } });

    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    await quiz.destroy();
    res.status(200).json({ success: true, message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Add Questions to a Quiz
const addQuestion = async (req, res) => {
  try {
    console.log("Received Params:", req.params); // 🔹 Check incoming params
    console.log("Request Body:", req.body); // 🔹 Check incoming body

    const { questionText, options, correctAnswers } = req.body;

    // 🔹 Find Quiz by Slug
    const quiz = await Quiz.findOne({ where: { slug: req.params.slug } });

    if (!quiz) {
      console.log("❌ Quiz Not Found for Slug:", req.params.slug);
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    // 🔹 Create Question linked to Quiz
    const question = await Question.create({
      quizId: quiz.id, // ✅ Use quiz ID instead of part ID
      questionText,
      options,
      correctAnswers,
    });

    res.status(201).json({ success: true, question });
  } catch (error) {
    console.error("❌ Error:", error.message); // 🔹 Log error
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ Update a Question
const updateQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswers } = req.body;
    const question = await Question.findByPk(req.params.questionId);

    if (!question) return res.status(404).json({ success: false, message: "Question not found" });

    if (questionText) question.questionText = questionText;
    if (options) question.options = options;
    if (correctAnswers) question.correctAnswers = correctAnswers;

    await question.save();
    res.status(200).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete a Question
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.questionId);

    if (!question) return res.status(404).json({ success: false, message: "Question not found" });

    await question.destroy();
    res.status(200).json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizBySlug,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
};
