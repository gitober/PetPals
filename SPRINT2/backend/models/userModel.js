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
    following: [
      {
        user: { type: mongoose.Types.ObjectId, ref: "user" },
        username: String,
      },
    ],
    followers: [
      {
        user: { type: mongoose.Types.ObjectId, ref: "user" },
        username: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Static method to log in a user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
};

// Static method to sign up a user
userSchema.statics.signup = async function (email, password) {
  const user = await this.create({ email, password });
  return user;
};

module.exports = mongoose.model("user", userSchema);