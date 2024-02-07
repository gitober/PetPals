// userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Unique identifier (MongoDB ObjectId)
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
      name: { type: String },
      bio: { type: String },
      profileImage: { type: String },
      location: { type: String },
      website: { type: String },
      // Add other user-related fields as needed
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Reference to user's posts
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Reference to followers
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Reference to users being followed
  },
  { timestamps: true } // Enable timestamps
);

const User = mongoose.model("User", userSchema);

module.exports = User;
