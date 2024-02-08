const mongoose = require('mongoose');
const connectDB = require('../config/db'); // Assuming your database connection logic is in this file
const Post = require('../models/Post'); // Assuming you have a Post model defined
const User = require('../models/User'); // Assuming you have a User model defined

// Connect to MongoDB Atlas
connectDB();

// Create sample data
const samplePosts = [
  {
    username: 'user1',
    caption: 'Sample caption 1',
    // Other fields...
  },
  {
    username: 'user2',
    caption: 'Sample caption 2',
    // Other fields...
  },
  // More sample posts...
];

// Insert sample posts
Post.insertMany(samplePosts)
  .then(posts => {
    console.log('Sample posts inserted:', posts);
    // Do something after insertion if needed
  })
  .catch(error => {
    console.error('Error inserting sample posts:', error);
  });

// Similarly, you can insert sample users or other data as needed

