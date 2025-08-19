const { Sequelize } = require("sequelize");
require("dotenv").config();

// Use environment variables if available, otherwise use config.json defaults
const dbConfig = {
  database: process.env.DB_NAME || "database_development",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || null,
  host: process.env.DB_HOST || "127.0.0.1",
  dialect: process.env.DB_DIALECT || "mysql",
  port: process.env.DB_PORT || 3306,
  logging: false, // Disable logging queries in the console
};

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    logging: dbConfig.logging,
  }
);

const connectDB = async () => {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connected successfully!");
    } catch (error) {
      console.error("❌ Error connecting to the database:", error.message);
      console.log("⚠️  Server will continue without database connection for testing purposes");
      // Don't exit the process, let the server run for testing
    }
  };
  

module.exports = { sequelize, connectDB };
