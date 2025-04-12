const DsaQuestion = require("../../models/DSA/DsaQuestion");

// ✅ Create a question
exports.createQuestion = async (req, res) => {
  try {
    const question = await DsaQuestion.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all questions by category
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const questions = await DsaQuestion.findAll({
      where: { DsaCategoryId: categoryId },
    });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ NEW: Get question by ID (for solving the question)
exports.getQuestionById = async (req, res) => {
  try {
    const id = req.params.id;
    const question = await DsaQuestion.findByPk(id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
