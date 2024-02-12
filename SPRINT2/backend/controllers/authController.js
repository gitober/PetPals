const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  // Register a new user
  register: async (req, res) => {
    try {
      // Extract user details from request body
      const { fullname, username, email, password, gender } = req.body;

      // Check if user is already logged in
      if (req.user) {
        return res.status(200).json({
          message: "You are already logged in.",
          status: "success",
        });
      }

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
      const passwordHash = await bcrypt.hash(password, 13);

      // Create a new user
      const newUser = new Users({
        fullname,
        username: newUsername,
        email,
        password: passwordHash,
        gender,
      });

      // Create and set cookies for tokens
      const access_token = createAccessToken({ id: newUser._id });
      const refresh_token = createRefreshToken({ id: newUser._id });
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 24 * 30 * 60 * 60 * 1000, // 30 days valid
      });

      // Save the new user
      await newUser.save();

      // Respond with success message and user details
      res.json({
        message: "Registration Successful!",
        access_token,
        user: {
          ...newUser._doc,
          password: "",
        },
      });
    } catch (err) {
      console.error(`Error in registration: ${err.message}`);
      return res.status(500).json({ message: err.message });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      // Check if user is already logged in
      if (req.user) {
        return res.status(200).json({
          message: "You are already logged in.",
          status: "success",
        });
      }

      // Extract login credentials from request body
      const { email, password } = req.body;

      // Find user by email and populate friends and following
      const user = await Users.findOne({ email }).populate(
        "friends following",
        "-password"
      );

      // Check if user exists
      if (!user)
        return res.status(404).json({
          message: "User not found",
          field: "email",
        });

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({
          message: "Incorrect password",
          field: "password",
        });

      // Generate tokens and set cookies
      const access_token = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 24 * 30 * 60 * 60 * 1000, // 30 days valid
      });

      // Respond with success message and user details
      res.json({
        message: "Login Successful!",
        access_token,
        user: {
          ...user._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // Logout user
  logout: async (req, res) => {
    try {
      const requestData = req.body;

      if (Object.keys(requestData).length === 0) {
        console.log("Logout request received with no additional data.");
      } else {
        console.log("Logout request received. Additional data:", requestData);
      }

      // Clear refresh token cookie
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      res.json({ message: "Logged out" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // Generate access token using refresh token
  generateAccessToken: async (req, res) => {
    try {
      // Get refresh token from cookies
      const rf_token = req.cookies.refreshtoken;

      // Check if refresh token exists
      if (!rf_token) return res.status(400).json({ message: "Please login" });

      // Verify refresh token and generate new access token
      jwt.verify(
        rf_token,
        process.env.REFRESHTOKENSECRET,
        async (err, result) => {
          if (err) return res.status(400).json({ message: "Please login" });

          // Find user by ID, exclude password, and populate friends and following
          const user = await Users.findById(result.id)
            .select("-password")
            .populate("friends following");

          // Check if user exists
          if (!user)
            return res.status(400).json({ message: "User does not exist" });

          // Generate new access token
          const access_token = createAccessToken({ id: result.id });

          // Respond with new access token and user details
          res.json({
            access_token,
            user,
          });
        }
      );
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

// Function to create access token
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESSTOKENSECRET, { expiresIn: "1d" });
};

// Function to create refresh token
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESHTOKENSECRET, {
    expiresIn: "30d",
  });
};

module.exports = authController;

