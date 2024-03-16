const express = require("express");
const router = express.Router();
const {
  addPost,
  getAllPosts,
  getPostById,
  updatePost,
  likePost,
  unlikePost,
  deletePost,
} = require("../controllers/postController");
const requireAuth = require("../middleware/requireAuth");

// Require authentication for all routes
router.use(requireAuth);

// Add a new post
router.post("/", addPost);

// Get all posts
router.get("/", getAllPosts);

// Get a post by POST id
router.get("/:id", getPostById);

// Update a post by ID
router.patch("/:id", updatePost);

// Like a post
router.patch("/:id/like", likePost);

// Unlike a post
router.patch("/:id/unlike", unlikePost);

// Delete a post by ID
router.delete("/:id", deletePost);

module.exports = router;
