// userModel.js
require("dotenv").config();
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    name: { type: String },
    bio: { type: String },
    profileImage: { type: String },
  },
});

module.exports = mongoose.model("User", userSchema);

const User = mongoose.model("User", userSchema);

const seedUsersToDatabase = async () => {
  try {
    // Implementation to seed users to the database
    // ...
    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Error seeding users:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

module.exports = { User, seedUsersToDatabase };
