const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Helper function to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const sendEmail = require("../utils/mailer"); // Import mailer

// Register User
const registerUser = async (req, res) => {
    try {
      const { name, email, password, company } = req.body;
      let user = await User.findOne({ where: { email } });
      if (user) return res.status(400).json({ success: false, message: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 mins
  
      user = await User.create({
        name, email, password: hashedPassword, company, otp, otpExpiresAt,
      });
  
      // Send OTP Email
      console.log(otp);
      
      await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);
  
      res.status(201).json({ success: true, message: "OTP sent to email" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Login User
const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });
  
      const otp = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await user.update({ otp, otpExpiresAt });
      console.log(otp);
      
      // Send OTP Email
      // await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);
  
      res.status(200).json({ success: true, message: "OTP sent to email" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };


// Verify OTP and Issue JWT
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Validate OTP
    if (user.otp !== otp || new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Clear OTP after successful login
    await user.update({ otp: null, otpExpiresAt: null });

    // **Set Token in HTTP-Only Cookie**
    res.cookie("token", token, {
      httpOnly: true,       // JavaScript cannot access this cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "Strict",    // Prevent CSRF attacks
      maxAge: 3600000,       // 1 hour expiry
    });

    res.status(200).json({ success: true, role: user.role, message: "Login successful" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const me = async (req, res) => {
  try {
    const token = req.cookies.token; // Read token from HTTP-only cookie
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user in DB
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "email", "role"], // Send only required fields
    });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });

  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
};


const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) }); // Clear cookie
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};


const changePassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Validate OTP
    if (user.otp !== otp || new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    await user.update({ password: hashedPassword, otp: null, otpExpiresAt: null });

    res.status(200).json({ success: true, message: "Password changed successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




module.exports = { registerUser, loginUser, verifyOTP,me,logoutUser,changePassword };
