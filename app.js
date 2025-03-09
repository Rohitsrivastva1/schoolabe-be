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
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // Allow frontend requests with cookies

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/tutorials", tutorialRoutes);

const startServer = async () => {
  await connectDB();
  await sequelize.sync();
  app.listen(5000, () => console.log("🚀 Server running on port 5000"));
};

startServer();
