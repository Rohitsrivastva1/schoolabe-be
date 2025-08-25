const express = require("express");
const { registerUser, loginUser, verifyOTP, me, logoutUser, changePassword, forgotPassword, verifyResetOtp, resetPassword } = require("../controllers/authController");

const router = express.Router();
const sendEmail = require("../utils/mailer"); // Import mailer

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.get("/me", me);
router.post("/logout", logoutUser);  // New Logout API
router.post("/change-password", changePassword); // New Change Password API
router.post("/forgot-password", forgotPassword); // Forgot Password API
router.post("/verify-reset-otp", verifyResetOtp); // Verify Reset OTP API
router.post("/reset-password", resetPassword); // Reset Password API


router.get("/test-email", async (req, res) => {
  console.log("test email route");
    try {
      await sendEmail("rohit.managers@gmail.com", "Test Email", "This is a test email.");
      res.json({ success: true, message: "Email sent!" });
    } catch (error) {
      res.json({ success: false, message: "Email sending failed", error: error.message });
    }
  });



module.exports = router;
