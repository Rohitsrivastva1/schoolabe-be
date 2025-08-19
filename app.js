const express = require("express");
const { connectDB, sequelize } = require("./config/connectdb");
const courseRoutes = require("./routes/courseRoutes");
const tutorialRoutes = require("./routes/tutorialRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const quizRoutes = require("./routes/quizRoutes");
const dsaCategoryRoutes = require("./routes/DSA/dsaCategoryRoutes");
const dsaQuestionRoutes = require("./routes/DSA/dsaQuestionRoutes");
const dsaTestCaseRoutes = require("./routes/DSA/dsaTestCaseRoutes");
const dsaSubmissionRoutes = require("./routes/DSA/dsaSubmissionRoutes");
const membershipRoutes = require("./routes/membershipRoutes");


const app = express();

app.use(express.json());
app.use(cookieParser()); // Enable reading cookies
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(cors({ 
  credentials: true,  
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Added OPTIONS
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",  // Added
    "Accept",            // Added
    "Origin"             // Added
  ], 
  exposedHeaders: ["Set-Cookie"], // Added
  origin: [ 
    "http://10.0.2.2:5000/", 
    "http://localhost:8081",
    "http://localhost:3000", 
    "http://localhost:19006",     // Added Expo dev server
    "exp://localhost:19000",      // Added Expo Go
    "https://www.schoolabe.com",
    "https://schoolabe.com"
  ]
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/tutorials", tutorialRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/dsa/categories", dsaCategoryRoutes);
app.use("/api/dsa/questions", dsaQuestionRoutes);
app.use("/api/dsa/testcases", dsaTestCaseRoutes);
app.use("/api/dsa/submissions", dsaSubmissionRoutes);
app.use("/api/membership", membershipRoutes);


// ✅ Root Route (For Basic API Health Check)
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API is running 🚀" });
});

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    // Test if User model is available
    const User = require('./models/User');
    const userCount = await User.count();
    res.status(200).json({ 
      success: true, 
      message: "Database connection working",
      userCount: userCount
    });
  } catch (error) {
    console.error("Database test failed:", error);
    res.status(500).json({ 
      success: false, 
      message: "Database test failed",
      error: error.message
    });
  }
});

// Test OTP verification (for debugging)
app.post("/test-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const User = require('./models/User');
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      user: {
        email: user.email,
        otp: user.otp,
        otpExpiresAt: user.otpExpiresAt,
        isExpired: new Date() > new Date(user.otpExpiresAt)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Test failed",
      error: error.message
    });
  }
});

// ✅ Start Server
const startServer = async () => {
  try {
    await connectDB();
    
    // Try to sync database, but don't fail if it doesn't work
    try {
      await sequelize.sync({ force: false });
      console.log("✅ Database synced successfully!");
    } catch (syncError) {
      console.log("⚠️  Database sync failed, but server will continue:", syncError.message);
    }
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1); // Stop the server if connection fails
  }
};

startServer();
