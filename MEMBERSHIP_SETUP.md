# Membership System Setup Guide

## Overview
This guide will help you set up the Razorpay membership system for Schoolabe platform with 3 subscription plans: Weekly, Monthly, and Yearly.

## Features Implemented

### 👑 Membership Plans
- **Weekly Plan**: ₹299/week
- **Monthly Plan**: ₹999/month  
- **Yearly Plan**: ₹9999/year

### 🎯 Premium Features
- Advanced Code Editor (Monaco Editor)
- Premium Course Access
- Priority Support
- Advanced Analytics

### 💳 Payment Processing
- Razorpay integration
- Secure payment processing
- Payment verification
- Subscription management

## Setup Instructions

### 1. Environment Variables
Add these variables to your `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_test_key_here
RAZORPAY_KEY_SECRET=your_test_secret_here

# Database Configuration (if not already set)
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name

# JWT Secret (if not already set)
JWT_SECRET=your_jwt_secret_here
```

### 2. Razorpay Account Setup
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your test API keys from the dashboard
3. Replace the placeholder keys in your `.env` file
4. For production, switch to live keys

### 3. Database Setup
The system will automatically create the required tables:
- `Users` table (updated with premium fields)
- `Memberships` table (new)

### 4. Install Dependencies
```bash
cd schoolabe-be
npm install razorpay
```

### 5. Run Database Migrations
```bash
npm run dev
```

### 6. Seed Test Data (Optional)
```bash
node seeders/runSeeder.js
```

## API Endpoints

### Public Endpoints
```
GET /api/membership/plans - Get available membership plans
```

### Protected Endpoints (Require Authentication)
```
POST /api/membership/create-order - Create subscription order
POST /api/membership/verify-payment - Verify payment and activate subscription
GET /api/membership/status - Get user's membership status
POST /api/membership/cancel - Cancel subscription
GET /api/membership/premium-access - Check premium access for code editor
```

## Frontend Integration

### 1. Environment Variables (Frontend)
Add to your frontend `.env` file:
```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_test_key_here
REACT_APP_API_BASE_URL=http://localhost:5000
```

### 2. Routes Added
- `/membership` - Membership plans page
- Premium access check for `/code` (Monaco Editor)

### 3. Components Created
- `MembershipPlans.jsx` - Display subscription plans
- `MembershipApi.js` - API service for membership
- Updated `MonacoEditor.js` - Premium access control
- Updated `PaymentService.js` - Membership payment processing

## Usage Examples

### Creating a Subscription
```javascript
import MembershipApi from '../api/membershipApi';
import PaymentService from '../services/paymentService';

const handleSubscribe = async (planType) => {
  try {
    // Create order
    const orderResponse = await MembershipApi.createSubscriptionOrder(planType);
    
    // Process payment
    const result = await PaymentService.processMembershipPayment(orderData, user);
    
    if (result.success) {
      console.log('Subscription activated!');
    }
  } catch (error) {
    console.error('Subscription failed:', error);
  }
};
```

### Checking Premium Access
```javascript
import MembershipApi from '../api/membershipApi';

const checkAccess = async () => {
  try {
    const response = await MembershipApi.checkPremiumAccess();
    if (response.hasPremiumAccess) {
      // User has premium access
    }
  } catch (error) {
    console.error('Error checking access:', error);
  }
};
```

## Testing

### Test Cards (Razorpay Test Mode)
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **Expiry**: Any future date
- **CVV**: Any 3 digits

### Test UPI
- Use any valid UPI ID in test mode

## Security Considerations

1. **Never expose your secret key** in frontend code
2. **Always verify payments** on the backend
3. **Use HTTPS** in production
4. **Validate all inputs** before processing
5. **Implement proper error handling**
6. **Check premium status** before allowing access to premium features

## Production Deployment

1. Switch to live Razorpay keys
2. Update `REACT_APP_API_BASE_URL` to production URL
3. Ensure HTTPS is enabled
4. Set up webhook endpoints for payment notifications
5. Implement proper logging and monitoring
6. Set up automated subscription renewal handling

## Troubleshooting

### Common Issues

1. **Payment fails**: Check if Razorpay keys are correct
2. **Access denied**: Verify user authentication
3. **Premium not working**: Check membership status in database
4. **API errors**: Verify backend endpoints are working

### Debug Mode
Enable debug logging by adding this to your browser console:
```javascript
localStorage.setItem('debug', 'membership:*');
```

## Database Schema

### Users Table (Updated)
```sql
ALTER TABLE Users ADD COLUMN isPremium BOOLEAN DEFAULT FALSE;
ALTER TABLE Users ADD COLUMN premiumExpiresAt TIMESTAMP NULL;
ALTER TABLE Users ADD COLUMN currentPlan ENUM('free', 'weekly', 'monthly', 'yearly') DEFAULT 'free';
```

### Memberships Table (New)
```sql
CREATE TABLE Memberships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  planType ENUM('weekly', 'monthly', 'yearly') NOT NULL,
  status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
  razorpaySubscriptionId VARCHAR(255),
  razorpayPaymentId VARCHAR(255),
  startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  endDate TIMESTAMP NOT NULL,
  amount INT NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  autoRenew BOOLEAN DEFAULT TRUE,
  features JSON,
  FOREIGN KEY (userId) REFERENCES Users(id)
);
```

## Support

For issues related to:
- **Razorpay**: Contact Razorpay support
- **Frontend**: Check browser console for errors
- **Backend**: Verify API endpoints and database connections
- **Database**: Check Sequelize logs and database connectivity
