const express = require("express");
const { connectDB, sequelize } = require("./config/connectdb");
const courseRoutes = require("./routes/courseRoutes");
const tutorialRoutes = require("./routes/tutorialRoutes");
const cors = require("cors"); // Import CORS

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

app.use(express.json());

app.use("/courses", courseRoutes);
app.use("/tutorials", tutorialRoutes);

const startServer = async () => {
  await connectDB();
  await sequelize.sync();
  app.listen(5000, () => console.log("🚀 Server running on port 5000"));
};

startServer();
