const express = require("express");
const router = express.Router();
const {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/userController");
const { authenticateUser } = require("../middleware/authMiddleware");

// Route to create a new user
router.post("/", createUser);

// Route to get user details by ID
router.get("/:id", getUserById);

// Route to update user details by ID
router.put("/:id", authenticateUser, updateUserById);

// Route to delete user by ID
router.delete("/:id", authenticateUser, deleteUserById);

module.exports = router;
