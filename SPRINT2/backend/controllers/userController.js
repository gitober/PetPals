const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.MY_SECRET_KEY, { expiresIn: "3d" });
};

const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.signup(username, email, password);
    const token = createToken(user._id);
    res.status(200).json({ username, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.status(200).json({ username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { bioText } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { bioText },
      { new: true }
    );
    if (!updatedUser) {
      throw new Error("User not found");
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const followUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found");
    }
    // Implement logic to follow user
    user.following.push(req.body.userId); 
    await user.save();
    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}
const unfollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found");
    }
    // Implement logic to unfollow user
    user.following = user.following.filter(id => id !== req.body.userId);
    await user.save();
    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser, getAllUsers, getUser, updateUser, followUser, unfollowUser };
