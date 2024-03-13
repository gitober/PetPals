const mongoose = require("mongoose"); // Import mongoose
const bcrypt = require("bcrypt");
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
    res.status(201).json({ username, email, token });
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
    const users = await User.find().select("username avatar");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ user: null, message: 'Internal Server Error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const {
      body: { username, email, newPassword, profilePicture }, // Added profilePicture
      user: { _id },
    } = req;

    if (!username || !email || !newPassword) {
      return res.status(400).json({ message: "Please provide username, email, and password." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user document with the new data
    const updateFields = { username, email, password: hashedPassword };
    if (profilePicture) {
      updateFields.profilePicture = profilePicture; // Add profilePicture if provided
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      updateFields,
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: `Profile updated for user ${username}` });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const followUser = async (req, res) => {
  try {
    const {
      params: { id },
      user: { _id, username },
    } = req;

    const userToFollow = await User.findById(id).populate('followers');

    if (!userToFollow) {
      return res.status(400).json({ message: "User to follow not found" });
    }

    const isAlreadyFollowing = userToFollow.followers.some((follower) =>
      follower.user.equals(_id)
    );

    if (isAlreadyFollowing) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    await User.findByIdAndUpdate(
      _id,
      {
        $push: {
          following: {
            user: id,
            username: userToFollow.username,
          },
        },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
  id,
  {
    $push: {
      followers: _id, // Push only the ObjectId
    },
  },
  { new: true }
);

    res.json({ message: "Followed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const {
      params: { id },
      user: { _id },
    } = req;

    // Find the user to unfollow and populate the followers field
    const userToUnfollow = await User.findById(id).populate('followers');

    // Check if the user to unfollow exists
    if (!userToUnfollow) {
      return res.status(400).json({ message: "User to unfollow not found" });
    }

    // Check if the logged-in user is following the user to unfollow
    const isFollowing = userToUnfollow.followers && userToUnfollow.followers.some((follower) =>
      follower.user && follower.user.equals && follower.user.equals(_id)
    );

    // If the logged-in user is not following, return an error
    if (!isFollowing) {
      return res.status(400).json({ message: "You are not following this user" });
    }

    // Remove the user from the logged-in user's following list
    await User.findByIdAndUpdate(
      _id,
      { $pull: { following: { user: id } } },
      { new: true }
    );

    // Remove the logged-in user from the user to unfollow's followers list
    await User.findByIdAndUpdate(
      id,
      { $pull: { followers: { user: _id } } },
      { new: true }
    );

    res.json({ message: "Unfollowed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signupUser, loginUser, getAllUsers, getUser, updateUser, followUser, unfollowUser };
