const express = require("express");
const router = express.Router();
const { loginUser, signupUser, getAllUsers, getUserByUsername, updateUserByUsername } = require("../controllers/userController");

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// Get all users
router.get("/", getAllUsers);

// Get a user by username
router.get("/:username", getUserByUsername);

// Update a user
router.patch("/:username", updateUserByUsername);

module.exports = router;