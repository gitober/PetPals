// LEARN JWT!! Express Middleware for Token-Based Authentication and User Authorization using JWTs.

const jwt = require("jsonwebtoken");

// Middleware to check if the request has a valid token
const authenticateUser = (req, res, next) => {
  // Get the token from the request headers, cookies, or wherever you store it
  const token = req.headers.authorization || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Missing token" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, "your-secret-key"); // Replace with your actual secret key

    // Attach user information to the request
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

module.exports = { authenticateUser };
