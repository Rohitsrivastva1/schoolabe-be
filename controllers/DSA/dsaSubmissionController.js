const DsaSubmission = require("../../models/DSA/DsaSubmission");
const DsaQuestion = require("../../models/DSA/DsaQuestion");

// ✅ POST /api/dsa/submissions/submit
exports.submitSolution = async (req, res) => {
  try {
    const { code, language, output, questionId } = req.body;

    if (!questionId) {
      return res.status(400).json({ success: false, message: "questionId is required" });
    }

    const submission = await DsaSubmission.create({
      code,
      language,
      output,
      userId: req.user.id, // from requireAuth middleware
      DsaQuestionId: questionId,
    });

    res.status(201).json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET /api/dsa/submissions/user/:userId
exports.getUserSubmissions = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const submissions = await DsaSubmission.findAll({
      where: { userId },
      include: { model: DsaQuestion, attributes: ["title"] },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ (Optional) GET /api/dsa/submissions/question/:questionId
exports.getSubmissionsByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const submissions = await DsaSubmission.findAll({
      where: { DsaQuestionId: questionId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
