const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connectdb");

const Membership = sequelize.define("Membership", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  planType: {
    type: DataTypes.ENUM("weekly", "monthly", "yearly"),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "expired", "cancelled"),
    defaultValue: "active",
  },
  razorpaySubscriptionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  razorpayPaymentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER, // Amount in paise
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: "INR",
  },
  autoRenew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: {
      codeEditor: true,
      premiumCourses: true,
      prioritySupport: true,
      advancedAnalytics: true
    }
  }
});

module.exports = Membership;
