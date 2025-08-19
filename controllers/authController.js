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

    // Send OTP email (don't block if email fails)
    console.log(otp);
    try {
      await sendEmail(email, "Your OTP Code", emailContent);
      console.log("📧 Registration OTP email sent successfully");
    } catch (emailError) {
      console.log("⚠️ Email sending failed, but registration continues:", emailError.message);
    }

    // Respond to the request
    res.status(201).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User (Temporarily bypassing OTP)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', { email });
    
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // If user not found, return an error
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Invalid password for user:', email);
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    console.log('✅ Password verified for user:', email);

    // TEMPORARY: Skip OTP verification and directly issue JWT token
    console.log('⚠️ OTP verification temporarily disabled');

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.log('❌ JWT_SECRET not configured');
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error" 
      });
    }

    // Generate JWT Token directly
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    console.log('🎫 JWT Token generated successfully for user:', email);

    // Set Token in HTTP-Only Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to false for localhost development
      sameSite: "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days expiry
    });

    console.log('🍪 Cookie set successfully');

    // Respond with success and user data
    res.status(200).json({ 
      success: true, 
      role: user.role, 
      message: "Login successful (OTP bypassed)",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Verify OTP and Issue JWT
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log('🔍 OTP Verification attempt:', { email, otp });

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log('👤 User found:', user.email);
    console.log('📱 Stored OTP:', user.otp);
    console.log('⏰ OTP Expires:', user.otpExpiresAt);
    console.log('🔄 Current time:', new Date());

    // Validate OTP
    const isOtpValid = user.otp === otp;
    const isOtpExpired = new Date() > new Date(user.otpExpiresAt);
    
    console.log('✅ OTP Match:', isOtpValid);
    console.log('⏰ OTP Expired:', isOtpExpired);

    if (!isOtpValid || isOtpExpired) {
      console.log('❌ OTP validation failed');
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired OTP",
        debug: {
          otpMatch: isOtpValid,
          otpExpired: isOtpExpired,
          providedOtp: otp,
          storedOtp: user.otp
        }
      });
    }

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.log('❌ JWT_SECRET not configured');
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error" 
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    console.log('🎫 JWT Token generated successfully');

    // Clear OTP after successful login
    await user.update({ otp: null, otpExpiresAt: null });
    console.log('🧹 OTP cleared from database');

    // **Set Token in HTTP-Only Cookie**
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to false for localhost development
      sameSite: "Lax", // Changed from "None" for better compatibility
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days expiry
    });

    console.log('🍪 Cookie set successfully');

    res.status(200).json({ 
      success: true, 
      role: user.role, 
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ OTP verification error:', error);
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
