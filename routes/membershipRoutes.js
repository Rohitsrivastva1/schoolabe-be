const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authMiddleware');
const {
  createSubscriptionOrder,
  verifyPayment,
  getMembershipStatus,
  getAvailablePlans,
  cancelSubscription,
  checkPremiumAccess
} = require('../controllers/membershipController');

// Public routes
router.get('/plans', getAvailablePlans);

// Test endpoint (temporary - remove in production)
router.get('/test', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Membership API is working",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Test endpoint failed",
      error: error.message
    });
  }
});

// Protected routes (everything after this line requires authentication)
router.use(requireAuth);

router.post('/create-order', createSubscriptionOrder);
router.post('/verify-payment', verifyPayment);
router.get('/status', getMembershipStatus);
router.post('/cancel', cancelSubscription);
router.get('/premium-access', checkPremiumAccess);

module.exports = router;
