const express = require("express");
const router = express.Router();
const {
  loginUser,
  signupUser,
  getAllUsers,
  getUser,
  updateUser,
  followUser,
  unfollowUser,
} = require("../controllers/userController");

// Signup route (No authentication required)
router.post("/signup", signupUser);

// Login route (No authentication required)
router.post("/login", loginUser);
  
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
