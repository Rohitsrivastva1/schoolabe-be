const { connectDB } = require('../config/connectdb');
const User = require('../models/User');
const Membership = require('../models/Membership');

const seedMembershipData = async () => {
  try {
    console.log("🌱 Seeding membership data...");
    
    // Connect to database
    await connectDB();
    
    // Create test premium user
    const testUser = await User.findOne({ where: { email: 'test@example.com' } });
    
    if (testUser) {
      // Create a test membership for the user
      const testMembership = await Membership.create({
        userId: testUser.id,
        planType: 'monthly',
        status: 'active',
        razorpayPaymentId: 'test_payment_123',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        amount: 99900, // ₹999 in paise
        currency: 'INR',
        features: {
          codeEditor: true,
          premiumCourses: true,
          prioritySupport: true,
          advancedAnalytics: true
        }
      });

      // Update user to premium
      await testUser.update({
        isPremium: true,
        premiumExpiresAt: testMembership.endDate,
        currentPlan: 'monthly'
      });

      console.log("✅ Test premium user created:", testUser.email);
      console.log("✅ Test membership created:", testMembership.id);
    }

    console.log("✅ Membership seeder completed successfully!");
  } catch (error) {
    console.error("❌ Membership seeder failed:", error);
    throw error;
  }
};

module.exports = { seedMembershipData };
