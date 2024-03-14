const express = require("express");
const router = express.Router();
const {
  getPosts,
  addPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getUserPosts,
  getPostById,
} = require("../controllers/postController");
const requireAuth = require("../middleware/requireAuth");

// Require authentication for all routes
router.use(requireAuth);

// Get all posts
router.get("/posts", getPosts);

// Add a new post
router.post("/posts", addPost);

// Update a post by ID
router.patch("/posts/:id", updatePost);

// Delete a post by ID
router.delete("/posts/:id", deletePost);

// Like a post
router.patch("/posts/:id/like", likePost);

// Unlike a post
router.patch("/posts/:id/unlike", unlikePost);

// Get posts by a specific user
router.get("/user_posts/:id", getUserPosts);

// Get a post by ID
router.get("/posts/:id", getPostById);

module.exports = router;
