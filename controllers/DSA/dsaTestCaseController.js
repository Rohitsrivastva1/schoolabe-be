const DsaTestCase = require("../../models/DSA/DsaTestCase");

exports.createTestCase = async (req, res) => {
    try {
      const { input, expectedOutput, isHidden, questionId } = req.body;
  
      if (!questionId) {
        return res.status(400).json({ error: "questionId is required" });
      }
  
      const testCase = await DsaTestCase.create({
        input,
        expectedOutput,
        isHidden,
        questionId, // 🔥 Make sure this is being passed!
      });
  
      res.status(201).json(testCase);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
exports.getTestCasesByQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const testCases = await DsaTestCase.findAll({ where: { questionId } });
    console.log(testCases);
    console.log(questionId);
    
    
    res.status(200).json(testCases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPublicTestCases = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const testCases = await DsaTestCase.findAll({
      where: {
        questionId, 
        isPublic: true,
      },
    });

    res.status(200).json(testCases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
