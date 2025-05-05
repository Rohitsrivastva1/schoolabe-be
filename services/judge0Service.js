const axios = require("axios");

const JUDGE0_BASE_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_HEADERS = {
  "Content-Type": "application/json",
  "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
};

const languageMapping = {
  python: 71,
  cpp: 54,
  java: 62,
  javascript: 63,
};

const runCodeWithInput = async (sourceCode, language, input) => {
  const response = await axios.post(
    `${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`,
    {
      source_code: sourceCode,
      stdin: input,
      language_id: languageMapping[language],
    },
    { headers: JUDGE0_HEADERS }
  );
  return response.data;
};

module.exports = { runCodeWithInput };
