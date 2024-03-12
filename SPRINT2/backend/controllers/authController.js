require("dotenv").config();
const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      console.log("Received login request with username:", username);

      // Find user by username
      const user = await Users.findOne({ username });

      console.log("User found:", user);

      // Check if user exists
      if (!user) {
        console.log("User not found");
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Compare input password with hashed password
      const isMatch = await authController.comparePassword(password, user.password);

      console.log("Password match:", isMatch);

      if (!isMatch) {
        console.log("Password does not match");
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate and send an access token
      const access_token = authController.generateAccessToken(user._id);
      const refresh_token = authController.generateRefreshToken(user._id);
      res.cookie("refreshtoken", refresh_token, {
  httpOnly: true,
  path: "/api/refresh_token",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days valid
  secure: process.env.NODE_ENV === 'production', // Set to true in production
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Set to 'None' in production
});

      // Log without sensitive information
      console.log("Login successful for username:", username, "Password: [Hidden]");

      // Respond with success message and user details
      res.json({
        message: "Login Successful!",
        access_token,
        refreshToken: refresh_token,
        user: {
          ...user._doc,
          password: "[Hidden]",
        },
      });
    } catch (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  register: async (req, res) => {
    try {
      // Extract user details from request body
      const { username, email, password } = req.body;

      // Check if user is already logged in
      if (req.user) {
        return res.status(200).json({
          message: "You are already logged in.",
          status: "success",
        });
      }

      console.log("Received registration request with username:", username);

      // Generate a unique username and check for duplicates
      const newUsername = (username || "").toLowerCase().replace(/ /g, "");
      const userWithUsername = await Users.findOne({ username: newUsername });
      if (userWithUsername) {
        return res.status(400).json({
          message: "Username already exists",
          field: "username",
        });
      }

      // Check for duplicate email
      const userWithEmail = await Users.findOne({ email });
      if (userWithEmail) {
        return res.status(400).json({
          message: "Email already exists",
          field: "email",
        });
      }

      // Validate password length
      if (!password) {
        return res.status(400).json({
          message: "Password is missing or undefined",
          field: "password",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long",
          field: "password",
        });
      }

      // Hash the password
      const passwordHash = await authController.hashPassword(password);

      // Create a new user
      const newUser = new Users({
        username: newUsername,
        email,
        password: passwordHash,
      });

      // Create and set cookies for tokens
      const access_token = authController.generateAccessToken(newUser._id);
      const refresh_token = authController.generateRefreshToken(newUser._id);
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days valid
        secure: true, // Send only over HTTPS in a secure context
        sameSite: "none", // Allow cross-site requests
      });

      // Log without sensitive information
      console.log("Registration successful for username:", username, "Password: [Hidden]");

      // Save the new user
      await newUser.save();

      // Respond with success message and user details
      res.json({
        message: "Registration Successful!",
        access_token,
        user: {
          ...newUser._doc,
          password: "[Hidden]",
        },
      });
    } catch (err) {
      console.error(`Error in registration: ${err.message}`);
      return res.status(500).json({ message: err.message });
    }
  },

  logout: async (req, res) => {
    try {
      console.log("Received logout request");

      // Clear refresh token cookie
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      res.json({ message: "Logged out" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  refreshToken: async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshtoken;

    // Check if there is a refresh token
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESHTOKENSECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Generate a new access token
      const newAccessToken = authController.generateAccessToken(user.userId);

      // Respond with the new access token
      res.json({ access_token: newAccessToken });
    });
  } catch (err) {
    console.error("Error during token refresh:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
},

  generateAccessToken: (userId) => {
    return jwt.sign({ userId }, process.env.ACCESSTOKENSECRET, {
      expiresIn: "1h",
    });
  },

  generateRefreshToken: (userId) => {
    const refreshToken = jwt.sign({ userId }, process.env.REFRESHTOKENSECRET, {
      expiresIn: "30d",
    });
    return refreshToken;
  },

  hashPassword: async (password) => {
    return await bcrypt.hash(password, 13);
  },

  comparePassword: async (inputPassword, hashedPassword) => {
    return await bcrypt.compare(inputPassword, hashedPassword);
  },
};

module.exports = authController;
