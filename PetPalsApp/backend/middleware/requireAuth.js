const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ error: "Malformed Authorization header" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET); // Verify and decode the token
    const user = await User.findById(decoded._id).select("_id username");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // Attach the user object to the request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired, please refresh" });
    }

    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = requireAuth;
