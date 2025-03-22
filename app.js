const express = require("express");
const { connectDB, sequelize } = require("./config/connectdb");
const courseRoutes = require("./routes/courseRoutes");
const tutorialRoutes = require("./routes/tutorialRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser()); // Enable reading cookies
// app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(cors({ credentials: true,  methods: ["GET", "POST", "PUT", "DELETE"], allowedHeaders: ["Content-Type", "Authorization"], origin: [ "http://localhost:3000", "https://www.schoolabe.com","https://schoolabe.com"]})); // Allow frontend requests with cookies

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/tutorials", tutorialRoutes);

// ✅ Root Route (For Basic API Health Check)
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API is running 🚀" });
});

// ✅ Start Server
const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync(); // Sync database (if needed)
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1); // Stop the server if connection fails
  }
};

startServer();
