// Middleware for validating user access tokens. It checks the presence, validity, and user existence based on
// the access token. If valid, it attaches the user object to the request for further processing.
// Handles errors by returning appropriate responses for invalid or missing tokens.

const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    console.log("Received token:", token);

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    if (token.startsWith("Bearer ")) {
      // Extract the token from the header
      const accessToken = token.split(" ")[1];

      console.log("Extracted Access Token:", accessToken);

      try {
        // Verify the access token
        const tokenData = jwt.verify(accessToken, process.env.ACCESSTOKENSECRET, {
          expiresIn: "3h",
        });

        console.log("Decoded Token Data:", tokenData);

        // Check if the token is valid
        if (!tokenData || !tokenData.userId) {
          // If not valid, try refreshing the token using the refresh token
          const refreshToken = req.cookies.refreshtoken;

          console.log("Received Refresh Token:", refreshToken);

          if (!refreshToken) {
            return res.status(401).json({ message: "Invalid or missing token" });
          }

          const decoded = jwt.verify(refreshToken, process.env.REFRESHTOKENSECRET);

          console.log("Decoded Refresh Token Data:", decoded);

          // Additional checks if needed
          
          // Generate a new access token
          const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESSTOKENSECRET, {
            expiresIn: "3h",
          });

          console.log("Generated New Access Token:", newAccessToken);

          // Attach the new access token to the request
          req.user = { userId: decoded.userId, newAccessToken };
          return next();
        }

        // Token is valid, find the user
        const user = await Users.findById(tokenData.userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Attach the user object to the request
        req.user = { userId: tokenData.userId, user };
        next();
      } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
      }
    } else {
      return res.status(401).json({ message: "Invalid token format" });
    }
  } catch (error) {
    console.error("Authentication error:", error.message);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authenticateUser;