# Razorpay Setup Guide

## 🔑 **Steps to Create Razorpay API Keys**

### **Step 1: Create Razorpay Account**
1. Go to [https://razorpay.com](https://razorpay.com)
2. Click **"Sign Up"** or **"Get Started"**
3. Fill in your business details:
   - Business name
   - Email address
   - Phone number
   - Business type
4. Verify your email and phone number

### **Step 2: Complete KYC (Know Your Customer)**
1. **Business Verification:**
   - Upload business registration documents
   - Provide business address proof
   - Submit PAN card details

2. **Bank Account Verification:**
   - Add your business bank account
   - Upload cancelled cheque or bank statement
   - Verify account details

3. **Personal Verification:**
   - Upload Aadhaar card or PAN card
   - Complete video KYC (if required)

### **Step 3: Access Dashboard**
1. Login to your Razorpay Dashboard
2. Navigate to **Settings** → **API Keys**
3. You'll see two types of keys:
   - **Test Mode Keys** (for development)
   - **Live Mode Keys** (for production)

### **Step 4: Get Test API Keys**
1. In the API Keys section, you'll find:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (starts with `rzp_test_`)

2. **Copy both keys** - you'll need them for your application

### **Step 5: Configure Environment Variables**

Create a `.env` file in your `schoolabe-be` directory with the following content:

```env
# Database Configuration
DB_NAME=database_development
DB_USER=root
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_DIALECT=mysql

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_test_key_id_here
RAZORPAY_KEY_SECRET=your_test_key_secret_here

# Server Configuration
PORT=5000
```

### **Step 6: Test Your Integration**

1. **Start the server:**
   ```bash
   cd schoolabe-be
   npm start
   ```

2. **Test the membership endpoints:**
   - Visit `http://localhost:3000/membership` in your browser
   - Try creating a subscription order
   - The system will now use real Razorpay integration

### **Step 7: Go Live (Production)**

When ready for production:

1. **Complete KYC verification** (required for live mode)
2. **Switch to Live Mode** in Razorpay dashboard
3. **Update environment variables** with live keys:
   ```env
   RAZORPAY_KEY_ID=rzp_live_your_live_key_id_here
   RAZORPAY_KEY_SECRET=your_live_key_secret_here
   ```

## 🔒 **Security Best Practices**

1. **Never commit API keys to version control**
2. **Use environment variables** for all sensitive data
3. **Keep your key secret secure** - don't share it
4. **Use test keys for development**
5. **Monitor your Razorpay dashboard** for transactions

## 📞 **Support**

- **Razorpay Support:** [https://razorpay.com/support](https://razorpay.com/support)
- **Documentation:** [https://razorpay.com/docs](https://razorpay.com/docs)
- **API Reference:** [https://razorpay.com/docs/api](https://razorpay.com/docs/api)

## 🧪 **Test Mode vs Live Mode**

### **Test Mode (Development)**
- Use test API keys
- No real money transactions
- Perfect for development and testing
- Test cards available in dashboard

### **Live Mode (Production)**
- Use live API keys
- Real money transactions
- Requires completed KYC
- Real payment processing

## 💳 **Test Cards (for Development)**

Use these test card numbers in test mode:

- **Success:** 4111 1111 1111 1111
- **Failure:** 4000 0000 0000 0002
- **Expiry:** Any future date
- **CVV:** Any 3 digits
- **Name:** Any name

## 🎯 **Next Steps**

1. Create your Razorpay account
2. Complete KYC verification
3. Get your test API keys
4. Update your `.env` file
5. Test the membership system
6. Go live when ready!
