const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const upload = require("../utils/multerConfig");
const User = require("../models/userModel");
const rateLimit = require("express-rate-limit");

const {
  loginUser,
  signupUser,
  validateField,
  getAllUsers,
  getUserByUsername,
  updateUserByUsername,
  updatePasswordByUsername,
  updateProfilePicture,
  followUser,
  unfollowUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  validatePassword,
} = require("../controllers/userController");
const { refreshAccessToken } = require("../utils/authHelpers");

const router = express.Router();

// ==============================
// Rate-Limiting Middleware
// ==============================
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { error: "Too many password reset requests. Please try again later." },
});

// ==============================
// Authentication Routes
// ==============================
router.post("/login", loginUser); // Log in a user
router.post("/signup", signupUser); // Sign up a new user
router.post("/refresh-token", refreshAccessToken); // Refresh authentication token
router.post("/logout", logoutUser); // Log out a user

// ==============================
// Password Reset Routes
// ==============================
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword); // Request a password reset
router.post("/reset-password", resetPassword); // Reset password using a token

// ==============================
// Validation Routes
// ==============================
router.post("/validate", validateField); // Validate username or email availability
router.post("/validate-password", requireAuth, validatePassword); // Validate current password
router.post("/check", async (req, res) => {
  // Inline validation for username or email
  const { username, email } = req.body;

  try {
    if (username) {
      const usernameExists = await User.findOne({
        username: { $regex: `^${username}$`, $options: "i" }, // Case-insensitive match
      });
      if (usernameExists) {
        return res.status(400).json({ error: "Username is already in use" });
      }
    }

    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: "Email is already in use" });
      }
    }

    res.status(200).json({ message: "Valid input" });
  } catch (error) {
    console.error("Error during validation check:", error.message);
    res.status(500).json({ error: "An error occurred during validation. Please try again." });
  }
});

// ==============================
// User Management Routes
// ==============================
router.get("/", getAllUsers); // Get all users
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "username email createdAt profilePicture"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in /users/me:", error.message);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

// ==============================
// Individual User Routes
// ==============================
router.get("/:username", getUserByUsername); // Get a user's details by username
router.patch("/:username", requireAuth, updateUserByUsername); // Update user details
router.patch("/:username/password", requireAuth, updatePasswordByUsername); // Update user's password
router.patch(
  "/:username/profile-picture",
  requireAuth,
  upload.single("profilePicture"), // Multer middleware for profile picture uploads
  updateProfilePicture // Update a user's profile picture
);

// ==============================
// Follow/Unfollow Routes
// ==============================
router.post("/:username/follow", requireAuth, followUser); // Follow a user
router.delete("/:username/follow", requireAuth, unfollowUser); // Unfollow a user

module.exports = router;
