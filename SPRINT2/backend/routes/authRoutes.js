// authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Define your authentication routes
router.get("/", (req, res) => {
  res.send("Hello from authentication route!");
});

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

module.exports = router;
