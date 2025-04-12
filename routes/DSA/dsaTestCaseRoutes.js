const express = require("express");
const router = express.Router();
const testCaseController = require("../../controllers/DSA/dsaTestCaseController");

router.post("/", testCaseController.createTestCase);
router.get("/all/:questionId", testCaseController.getTestCasesByQuestion);
router.get("/public/:questionId", testCaseController.getPublicTestCases);

module.exports = router;
