require("dotenv").config();
const mongoose = require("mongoose");
const { Post } = require("./postModel.js");
const { seedPostsToDatabase } = require("./postModel");

const MONGO_URI = process.env.MONGO_URI;

const postsData = [
  {
    username: "petlover1",
    caption: "My adorable pet in the sunshine!",
    likes: 120,
  },
  {
    username: "animalfanatic",
    caption: "Playtime with my furry friend!",
    likes: 80,
  },
  {
    username: "petadventures",
    caption: "Exploring new places with my pet buddy!",
    likes: 200,
  },
  // Additional posts with captions
  // Add more mock posts as needed
];

const seedPostsToDatabase = async () => {
  try {
    console.log("Seeding posts...");
    await Post.create(postsData);
    console.log("Posts seeded successfully");
  } catch (error) {
    console.error("Error seeding posts:", error.message);
  }
};

module.exports = { Post, seedPostsToDatabase };
