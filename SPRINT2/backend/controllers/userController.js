// userController oversees user-related operations in a social media application. It includes functionalities like
// user registration, login, and logout. The controller manages the generation of access tokens, allowing secure
// user authentication and session management. It also supports actions such as updating user profiles,
// following/unfollowing other users, and retrieving user-specific information. Error handling and token
// validation are integral parts of the controller to ensure the security and integrity of user interactions.

const bcrypt = require("bcrypt");
const Users = require("../models/userModel");

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await Users.find().select("fullname username avatar");
      res.json({ users });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Search users by username
  searchUsers: async (req, res) => {
    try {
      const users = await Users.find({
        username: { $regex: req.query.username },
      })
        .limit(10)
        .select("fullname username avatar");

      res.json({ users });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Get user details by user ID
  getUser: async (req, res) => {
    try {
      const user = await Users.findOne({ _id: req.params.id }).select(
        "-password"
      );

      if (!user) {
        return res.status(400).json({ message: "This user doesn't exist" });
      }

      res.json({ user });
    } catch (error) {
      console.error("Error retrieving user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Update user profile information (including password)
  updateUser: async (req, res) => {
    try {
      const { website, fullname, story, phone, address, newPassword } =
        req.body;

      if (!fullname) {
        return res.status(400).json({ message: "Please add your full name." });
      }

      // If newPassword is provided, hash the new password
      let hashedPassword = null;
      if (newPassword) {
        hashedPassword = await bcrypt.hash(newPassword, 10);
      }

      const updateFields = {
        website,
        fullname,
        story,
        phone,
        address,
      };

      // Include hashed password in the update if provided
      if (hashedPassword) {
        updateFields.password = hashedPassword;
      }

      // Update the user profile in the database
      await Users.findOneAndUpdate({ _id: req.user._id }, updateFields);

      res.json({ message: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating user profile:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Follow or Unfollow a User
  friend: async (req, res) => {
    try {
      const userToFollow = await Users.findOne({
        _id: req.params.id,
      });

      if (!userToFollow) {
        return res.status(400).json({ message: "User to follow not found" });
      }

      const isAlreadyFollowing = userToFollow.friends.includes(req.user._id);

      if (isAlreadyFollowing) {
        return res
          .status(400)
          .json({ message: "You are already following this user" });
      }

      // Update the user being followed
      await Users.findByIdAndUpdate(
        req.params.id,
        { $push: { friends: req.user._id } },
        { new: true }
      );

      // Update the current user's following list
      await Users.findByIdAndUpdate(
        req.user._id,
        { $push: { following: req.params.id } },
        { new: true }
      );

      res.json({ message: "Friend added" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Unfollow a User
  unfriend: async (req, res) => {
    try {
      const userToUnfollow = await Users.findOne({
        _id: req.params.id,
      });

      if (!userToUnfollow) {
        return res.status(400).json({ message: "User to unfollow not found" });
      }

      const isFollowing = userToUnfollow.friends.includes(req.user._id);

      if (!isFollowing) {
        return res
          .status(400)
          .json({ message: "You are not following this user" });
      }

      // Update the user being unfollowed
      await Users.findByIdAndUpdate(
        req.params.id,
        { $pull: { friends: req.user._id } },
        { new: true }
      );

      // Update the current user's following list
      await Users.findByIdAndUpdate(
        req.user._id,
        { $pull: { following: req.params.id } },
        { new: true }
      );

      res.json({ message: "Friend removed" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
