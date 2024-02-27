// userController oversees user-related operations in a social media application. It includes functionalities like
// user registration, login, and logout. The controller manages the generation of access tokens, allowing secure
// user authentication and session management. It also supports actions such as updating user profiles,
// following/unfollowing other users, and retrieving user-specific information. Error handling and token
// validation are integral parts of the controller to ensure the security and integrity of user interactions.

const bcrypt = require("bcrypt");
const Users = require("../models/userModel");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await Users.find().select("fullname username avatar");
      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  searchUsers: async (req, res) => {
    try {
      const users = await Users.find({
        username: { $regex: req.query.username },
      })
        .limit(10)
        .select("fullname username avatar");

      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id).select("-password");

      if (!user) {
        return res.status(400).json({ message: "This user doesn't exist" });
      }

      res.json({ user });
    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

 updateUser: async (req, res) => {
  try {
    const {
      body: { username, email, newPassword },
      user: { _id },
    } = req;

    if (!username) {
      return res.status(400).json({ message: "Please add your username." });
    }

    let hashedPassword = null;
    if (newPassword) {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    const updateFields = {
      username,
      email,
    };

    if (hashedPassword) {
      updateFields.password = hashedPassword;
    }

    await Users.findByIdAndUpdate(_id, updateFields);

    res.json({ message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
},

  friend: async (req, res) => {
    try {
      const { params: { id }, user: { _id } } = req;

      const userToFollow = await Users.findById(id);

      if (!userToFollow) {
        return res.status(400).json({ message: "User to follow not found" });
      }

      const isAlreadyFollowing = userToFollow.friends.includes(_id);

      if (isAlreadyFollowing) {
        return res.status(400).json({ message: "You are already following this user" });
      }

      await Users.findByIdAndUpdate(id, { $push: { friends: _id } }, { new: true });
      await Users.findByIdAndUpdate(_id, { $push: { following: id } }, { new: true });

      res.json({ message: "Friend added" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  unfriend: async (req, res) => {
    try {
      const { params: { id }, user: { _id } } = req;

      const userToUnfollow = await Users.findById(id);

      if (!userToUnfollow) {
        return res.status(400).json({ message: "User to unfollow not found" });
      }

      const isFollowing = userToUnfollow.friends.includes(_id);

      if (!isFollowing) {
        return res.status(400).json({ message: "You are not following this user" });
      }

      await Users.findByIdAndUpdate(id, { $pull: { friends: _id } }, { new: true });
      await Users.findByIdAndUpdate(_id, { $pull: { following: id } }, { new: true });

      res.json({ message: "Friend removed" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;

