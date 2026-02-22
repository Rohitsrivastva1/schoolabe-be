const { sequelize } = require('../config/connectdb');

const addMembershipColumns = async () => {
  try {
    console.log('🔧 Adding membership columns to User table...');
    
    // Add isPremium column
    await sequelize.query(`
      ALTER TABLE "Users" 
      ADD COLUMN IF NOT EXISTS "isPremium" BOOLEAN DEFAULT false
    `);
    console.log('✅ Added isPremium column');
    
    // Add premiumExpiresAt column
    await sequelize.query(`
      ALTER TABLE "Users" 
      ADD COLUMN IF NOT EXISTS "premiumExpiresAt" TIMESTAMP
    `);
    console.log('✅ Added premiumExpiresAt column');
    
    // Add currentPlan column
    await sequelize.query(`
      ALTER TABLE "Users" 
      ADD COLUMN IF NOT EXISTS "currentPlan" VARCHAR(10) DEFAULT 'free'
    `);
    console.log('✅ Added currentPlan column');
    
    console.log('🎉 All membership columns added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding columns:', error);
    process.exit(1);
  }
};

addMembershipColumns();
