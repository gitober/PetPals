// This script sets up an Express router for user authentication, utilizing the authController for registration, login,
// logout, and token refreshing. Routes are defined for each operation: /register, /login, /logout, and /refresh_token.
// The authController handles the associated logic for authentication tasks.

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout);
router.post("/refresh_token", authController.generateRefreshToken);

module.exports = router;
