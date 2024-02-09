// postModel.js
require("dotenv").config();
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  username: { type: String, required: true },
  caption: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

const Post = mongoose.model("Post", postSchema);

const seedPostsToDatabase = async () => {
  try {
    // Implementation to seed posts to the database
    // ...
    console.log("Posts seeded successfully");
  } catch (error) {
    console.error("Error seeding posts:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

module.exports = { Post, seedPostsToDatabase };
