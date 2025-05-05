 // templates/emailTemplate.js

const getOTPEmailTemplate = (name, otp) => {
    return `
      Dear ${name},
  
      We have received a request to register your account. Please use the following OTP (One-Time Password) to verify your email and complete your registration:
  
      **OTP Code**: ${otp}
  
      This OTP will expire in 10 minutes. If you did not request this, please ignore this email.
  
      Thank you for choosing us.
  
      Best regards,
      Schoolabe Team
    `;
  };
  
  module.exports = { getOTPEmailTemplate };
  