const express = require("express");
const { registerUser, loginUser, verifyOTP,me ,logoutUser , changePassword} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.get("/me", me);
router.post("/logout", logoutUser);  // New Logout API
router.post("/change-password", changePassword); // New Change Password API

module.exports = router;
