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
      require: true,
    },
    fullname: {
      type: String,
      trim: true,
      required: true,
      maxlength: 30,
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
    address: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default:
        "https://fakeimg.pl/600x400/1dd4de/170707?text=sample+pic&font=bebas",
    },
    story: {
      type: String,
      default: "",
      maxlength: 250,
    },
    friends: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    following: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    saved: [{ type: mongoose.Types.ObjectId, ref: "user" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
