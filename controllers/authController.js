const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
const { getOTPEmailTemplate } = require('./emailTemplate');
const { getLoginOTPEmailTemplate } = require('./emailTemplate');
// Helper function to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const sendEmail = require("../utils/mailer"); // Import mailer

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, company } = req.body;
    console.log("👀 New user:", req.body);

    // Check if the user already exists
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ success: false, message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 mins

    // Create the new user
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      company,
      otp,
      otpExpiresAt,
    });

    // Generate email content using the template
    const emailContent = getOTPEmailTemplate(name, otp);

    // Send OTP email
    console.log(otp);
    await sendEmail(email, "Your OTP Code", emailContent);

    // Respond to the request
    res.status(201).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // If user not found, return an error
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    // Generate OTP and set expiration time
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Update the user with the generated OTP and its expiration time
    await user.update({ otp, otpExpiresAt });
    console.log(otp);
    
    // Get the user's name from the user object
    const name = user.name;

    // Generate email content using the template
    const emailContent = getLoginOTPEmailTemplate(name, otp);

    // Send OTP email
    await sendEmail(email, "Your OTP Code", emailContent);
    
    // Respond with success
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
      { expiresIn: "30d" }
    );

    // Clear OTP after successful login
    await user.update({ otp: null, otpExpiresAt: null });

    // **Set Token in HTTP-Only Cookie**
    res.cookie("token", token, {
      httpOnly: true,       // JavaScript cannot access this cookie
      secure: true, // Use secure cookies in production
      sameSite: "None",    // Prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000,       // 30 days expiry
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
