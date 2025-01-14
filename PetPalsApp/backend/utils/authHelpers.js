const jwt = require("jsonwebtoken");

// Helper function to create a JWT token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Helper function to create a refresh token
const createRefreshToken = (_id) => {
  return jwt.sign({ _id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
};

// Refresh Access Token
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  try {
    // Verify the refresh token
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // Generate a new access token
    const newAccessToken = createToken(payload._id);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error refreshing access token:", error.message);
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

module.exports = {
  createToken,
  createRefreshToken,
  refreshAccessToken,
};
