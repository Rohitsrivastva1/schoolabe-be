const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false, // Disable logging queries in the console
  //   dialectOptions: {
  //     ssl: {
  //       require: true,
  //       rejectUnauthorized: false,
  //   },
  // },
}
);

const connectDB = async () => {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connected successfully!");
    } catch (error) {
      console.error("❌ Error connecting to the database:", error);
      process.exit(1); // Stop the server if DB fails
    }
  };
  

module.exports = { sequelize, connectDB };
