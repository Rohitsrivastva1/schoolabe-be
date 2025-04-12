const jwt = require("jsonwebtoken");
require("dotenv").config();


const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies.token; // Read token from cookies
    if (!token) return res.status(401).json({ success: false, message: "Access Denied. No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // User is authenticated
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// Middleware to verify JWT and check if the user is an admin
const adminAuth = (req, res, next) => {
  try {
    const token = req.cookies.token; // Read token from cookies
    if (!token) return res.status(401).json({ success: false, message: "Access Denied. No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access Denied. Admins only." });
    }

    next(); // Continue to next middleware/route

  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { requireAuth,adminAuth };
