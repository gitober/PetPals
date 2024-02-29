// Mongoose schema for the structure of a user document, including fields such as username, fullname, email, 
// password, address, gender, website, phone, avatar, story, friends, following, and saved. Each user has 
// associated timestamps indicating the creation and last update times. The schema defines relationships with 
// other users through the friends, following, and saved arrays, utilizing references to other user documents 
// via their MongoDB ObjectId.

const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      maxlength: 30,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    story: {
      type: String,
      default: "",
      maxlength: 250,
    },
    following: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    username: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
