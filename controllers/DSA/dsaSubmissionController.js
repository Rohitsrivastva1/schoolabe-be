const { runCodeWithInput } = require("../../services/judge0Service");
const { DsaTestCase } = require("../../models/DSA/DsaTestCase");

const runSubmission = async (req, res) => {
  const { code, language, testCases, customTestCase } = req.body;

  console.log("Code:", code);
  try {
    const results = [];

    const allTestCases = testCases.length
      ? testCases
      : customTestCase
      ? [{ input: customTestCase, expectedOutput: null }]
      : [];

    for (const testCase of allTestCases) {
      const result = await runCodeWithInput(code, language, testCase.input);

      results.push({
        input: testCase.input,
        output: result.stdout,
        expected: testCase.expectedOutput,
        status: result.status.description,
        success: testCase.expectedOutput
          ? result.stdout?.trim() === testCase.expectedOutput.trim()
          : true,
      });
    }

    const overallSuccess = results.every((r) => r.success);
    const finalOutput = results.map((r) => {
      return `Input:\n${r.input}\nExpected:\n${r.expected}\nGot:\n${r.output}\nStatus: ${r.status}\nSuccess: ${r.success}\n`;
    }).join("\n");

    res.json({
      output: finalOutput,
      success: overallSuccess,
    });
  } catch (err) {
    console.error("Run error:", err.message);
    res.status(500).json({ error: "Error running code" });
  }
};

module.exports = { runSubmission };
