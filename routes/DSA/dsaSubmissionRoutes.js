const express = require("express");
const { runSubmission } = require("../../controllers/DSA/dsaSubmissionController");
const router = express.Router();

router.post("/run", runSubmission);

module.exports = router;
