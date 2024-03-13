const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth"); // Import the requireAuth middleware
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
router.get("/users", getAllUsers);

// Get user by ID route
router.get("/users/:id", getUser);

// Update user profile route
router.put("/users/:id", updateUser);

// Follow user route
router.patch("/users/:id/follow", followUser);

// Unfollow user route
router.patch("/users/:id/unfollow", unfollowUser);

module.exports = router;
