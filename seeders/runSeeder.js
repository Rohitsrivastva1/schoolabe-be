const { seedDsaData } = require('./dsaDummyData');
const { connectDB } = require('../config/connectdb');

const runSeeder = async () => {
  try {
    console.log("🚀 Starting seeder...");
    
    // Connect to database
    await connectDB();
    
    // Run DSA seeder
    await seedDsaData();
    
    console.log("✅ Seeder completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeder failed:", error);
    process.exit(1);
  }
};

runSeeder(); 