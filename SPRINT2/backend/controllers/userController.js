const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Signup a user
const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.signup(username, email, password);

    // Create a token
    const token = createToken(user._id);

    res.status(200).json({ username: user.username, email: user.email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);

    // Create a token
    const token = createToken(user._id);

    res.status(200).json({ username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("username email");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get a user by username
const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("username email");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json(user);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update a user by username
const updateUserByUsername = async (req, res) => {
  const { username } = req.params;
  const { email } = req.body;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      username
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.email = email;
    user.password = password;
    await user.save();

    res.status(200).json(user);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { signupUser, loginUser, getAllUsers, getUserByUsername, updateUserByUsername };