const express = require("express");
const { registerUser, loginUser, verifyOTP,me } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.get("/me", me);
module.exports = router;
