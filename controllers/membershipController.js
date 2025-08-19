const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Membership = require('../models/Membership');

// Initialize Razorpay (with fallback for missing env vars)
let razorpay;
let isTestMode = false;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay initialized with real credentials');
  } else {
    console.log('⚠️ Razorpay credentials not found, running in test mode');
    isTestMode = true;
    razorpay = null;
  }
} catch (error) {
  console.warn('Razorpay initialization failed:', error.message);
  razorpay = null;
  isTestMode = true;
}

// Membership plans configuration
const MEMBERSHIP_PLANS = {
  weekly: {
    name: "Weekly Plan",
    amount: 29900, // ₹299 in paise
    duration: 7, // days
    features: {
      codeEditor: true,
      premiumCourses: true,
      prioritySupport: true,
      advancedAnalytics: true
    }
  },
  monthly: {
    name: "Monthly Plan", 
    amount: 99900, // ₹999 in paise
    duration: 30, // days
    features: {
      codeEditor: true,
      premiumCourses: true,
      prioritySupport: true,
      advancedAnalytics: true
    }
  },
  yearly: {
    name: "Yearly Plan",
    amount: 999900, // ₹9999 in paise
    duration: 365, // days
    features: {
      codeEditor: true,
      premiumCourses: true,
      prioritySupport: true,
      advancedAnalytics: true
    }
  }
};

// Create subscription order
const createSubscriptionOrder = async (req, res) => {
  try {
    const { planType } = req.body;
    const userId = req.user.id;

    if (!MEMBERSHIP_PLANS[planType]) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan type"
      });
    }

    const plan = MEMBERSHIP_PLANS[planType];
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user already has an active subscription
    const activeMembership = await Membership.findOne({
      where: {
        userId: userId,
        status: 'active'
      }
    });

    if (activeMembership) {
      return res.status(400).json({
        success: false,
        message: "You already have an active subscription"
      });
    }

    // Create Razorpay order
    if (isTestMode) {
      // In test mode, create a mock order
      const mockOrder = {
        id: `order_test_${Date.now()}`,
        amount: plan.amount,
        currency: 'INR',
        receipt: `membership_${userId}_${Date.now()}`
      };
      
      res.status(200).json({
        success: true,
        order: mockOrder,
        plan: {
          name: plan.name,
          amount: plan.amount,
          duration: plan.duration,
          features: plan.features
        },
        testMode: true,
        message: "Test mode: Mock order created successfully"
      });
      return;
    }

    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: "Payment gateway not configured. Please contact support."
      });
    }

    let order;
    try {
      order = await razorpay.orders.create({
        amount: plan.amount,
        currency: 'INR',
        receipt: `membership_${userId}_${Date.now()}`,
        notes: {
          planType: planType,
          userId: userId.toString()
        }
      });
    } catch (razorpayError) {
      console.error('Razorpay order creation failed:', razorpayError);
      
      // Check if it's an authentication error
      if (razorpayError.statusCode === 401) {
        return res.status(500).json({
          success: false,
          message: "Payment gateway authentication failed. Please contact support."
        });
      }
      
      // For other Razorpay errors
      return res.status(500).json({
        success: false,
        message: "Payment gateway error. Please try again later."
      });
    }

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      plan: {
        name: plan.name,
        amount: plan.amount,
        duration: plan.duration,
        features: plan.features
      }
    });

  } catch (error) {
    console.error('Error creating subscription order:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create subscription order"
    });
  }
};

// Verify payment and activate subscription
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      planType
    } = req.body;

    const userId = req.user.id;

    // Handle test mode
    if (isTestMode) {
      // In test mode, skip signature verification
      console.log('🧪 Test mode: Skipping payment verification');
    } else {
      // Verify signature for real payments
      if (!process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({
          success: false,
          message: "Payment gateway not configured"
        });
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment signature"
        });
      }
    }

    const plan = MEMBERSHIP_PLANS[planType];
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan type"
      });
    }

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    // Create membership record
    const membership = await Membership.create({
      userId: userId,
      planType: planType,
      razorpayPaymentId: razorpay_payment_id,
      startDate: startDate,
      endDate: endDate,
      amount: plan.amount,
      currency: 'INR',
      features: plan.features
    });

    // Update user premium status
    await User.update(
      {
        isPremium: true,
        premiumExpiresAt: endDate,
        currentPlan: planType
      },
      {
        where: { id: userId }
      }
    );

    res.status(200).json({
      success: true,
      message: "Subscription activated successfully",
      membership: {
        id: membership.id,
        planType: membership.planType,
        startDate: membership.startDate,
        endDate: membership.endDate,
        features: membership.features
      }
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment"
    });
  }
};

// Get user's current membership status
const getMembershipStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting membership status for user:', userId);

    // Check if User model is available
    if (!User) {
      console.error('User model not found');
      return res.status(500).json({
        success: false,
        message: "Database models not loaded"
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    console.log('User found:', user.email);

    // Check if Membership model is available
    if (!Membership) {
      console.error('Membership model not found');
      return res.status(500).json({
        success: false,
        message: "Membership model not loaded"
      });
    }

    const activeMembership = await Membership.findOne({
      where: {
        userId: userId,
        status: 'active'
      },
      order: [['createdAt', 'DESC']]
    });

    console.log('Active membership:', activeMembership ? 'Found' : 'Not found');

    // Check if premium has expired
    if (user.isPremium && user.premiumExpiresAt && new Date() > user.premiumExpiresAt) {
      await User.update(
        {
          isPremium: false,
          currentPlan: 'free'
        },
        {
          where: { id: userId }
        }
      );
      user.isPremium = false;
      user.currentPlan = 'free';
    }

    res.status(200).json({
      success: true,
      membership: {
        isPremium: user.isPremium,
        currentPlan: user.currentPlan,
        premiumExpiresAt: user.premiumExpiresAt,
        activeMembership: activeMembership ? {
          id: activeMembership.id,
          planType: activeMembership.planType,
          startDate: activeMembership.startDate,
          endDate: activeMembership.endDate,
          features: activeMembership.features
        } : null
      }
    });

  } catch (error) {
    console.error('Error getting membership status:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get membership status",
      error: error.message
    });
  }
};

// Get available plans
const getAvailablePlans = async (req, res) => {
  try {
    const plans = Object.keys(MEMBERSHIP_PLANS).map(planType => ({
      type: planType,
      ...MEMBERSHIP_PLANS[planType]
    }));

    res.status(200).json({
      success: true,
      plans: plans
    });

  } catch (error) {
    console.error('Error getting available plans:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get available plans"
    });
  }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const activeMembership = await Membership.findOne({
      where: {
        userId: userId,
        status: 'active'
      }
    });

    if (!activeMembership) {
      return res.status(400).json({
        success: false,
        message: "No active subscription found"
      });
    }

    // Update membership status
    await activeMembership.update({
      status: 'cancelled',
      autoRenew: false
    });

    // Update user status
    await User.update(
      {
        isPremium: false,
        currentPlan: 'free'
      },
      {
        where: { id: userId }
      }
    );

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully"
    });

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel subscription"
    });
  }
};

// Check premium access for code editor
const checkPremiumAccess = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if premium has expired
    if (user.isPremium && user.premiumExpiresAt && new Date() > user.premiumExpiresAt) {
      await User.update(
        {
          isPremium: false,
          currentPlan: 'free'
        },
        {
          where: { id: userId }
        }
      );
      user.isPremium = false;
      user.currentPlan = 'free';
    }

    res.status(200).json({
      success: true,
      hasPremiumAccess: user.isPremium,
      currentPlan: user.currentPlan,
      premiumExpiresAt: user.premiumExpiresAt
    });

  } catch (error) {
    console.error('Error checking premium access:', error);
    res.status(500).json({
      success: false,
      message: "Failed to check premium access"
    });
  }
};

module.exports = {
  createSubscriptionOrder,
  verifyPayment,
  getMembershipStatus,
  getAvailablePlans,
  cancelSubscription,
  checkPremiumAccess
};
