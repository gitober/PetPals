const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout);

// Separate route for refreshing the token
router.post("/refresh_token", (req, res) => {
  const refreshToken = authController.generateRefreshToken(/* provide userId */);
  res.json({ refreshToken });
});

module.exports = router;
