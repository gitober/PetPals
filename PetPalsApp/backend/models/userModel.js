const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [15, "Username must be less than 15 characters long"],
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Excludes password by default in queries
    },
    profilePicture: {
      type: String,
      default: "placeholder-image.png",
    },
    bioText: {
      type: String,
      trim: true,
      maxlength: 25, // Optional limit to bio length
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Static signup method
userSchema.statics.signup = async function (username, email, password) {
  if (!username || !email || !password) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Invalid email format");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password must include at least 8 characters, an uppercase letter, a number, and a special character"
    );
  }

  const usernameExists = await this.findOne({ username: username.toLowerCase() });
  if (usernameExists) {
    throw Error("Username already in use");
  }

  const emailExists = await this.findOne({ email: email.toLowerCase() });
  if (emailExists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password: hash,
  });

  return user;
};

// Static login method
userSchema.statics.login = async function (username, password) {
  if (!username || !password) {
    throw Error("All fields must be filled");
  }

  // Use case-insensitive regex for login
  const user = await this.findOne({ username: { $regex: `^${username}$`, $options: "i" } }).select("+password");

  if (!user) {
    throw Error("Invalid username or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw Error("Invalid username or password");
  }

  return user;
};


module.exports = mongoose.model("User", userSchema);
