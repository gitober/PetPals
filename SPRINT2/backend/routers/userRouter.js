const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {
  loginUser,
  signupUser,
  getAllUsers,
  getUser,
  updateUser,
  followUser,
  unfollowUser,
} = require("../controllers/userController");

// Signup route
router.post("/signup", signupUser);

// Login route
router.post("/login", loginUser);

// Apply the requireAuth middleware to the following routes
router.use(requireAuth);
  
// Get all users route
router.get("/", getAllUsers);

// Get user by ID route
router.get("/:id", getUser);

// Update user profile route
router.put("/:id", updateUser);

// Follow user route
router.patch("/:id/follow", followUser);

// Unfollow user route
router.patch("/:id/unfollow", unfollowUser);

module.exports = router;
