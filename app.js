const express = require("express");
const { connectDB, sequelize } = require("./config/connectdb");
const courseRoutes = require("./routes/courseRoutes");
const tutorialRoutes = require("./routes/tutorialRoutes");
const cors = require("cors"); // Import CORS

const app = express();

// ✅ CORS Configuration (More Secure)
app.use(cors({ 
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"] 
}));

// ✅ Middleware
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// ✅ API Routes
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
