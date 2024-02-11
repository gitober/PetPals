// Middleware for validating user access tokens. It checks the presence, validity, and user existence based on
// the access token. If valid, it attaches the user object to the request for further processing.
// Handles errors by returning appropriate responses for invalid or missing tokens.

const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(500).json({ message: "Not valid" });
    }

    const decoded = jwt.verify(token, process.env.ACCESSTOKENSECRET);

    if (!decoded) {
      return res.status(500).json({ message: "Not valid" });
    }

    const user = await Users.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

module.exports = authenticateUser;
