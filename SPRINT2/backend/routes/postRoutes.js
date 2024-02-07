const express = require("express");
const { Post } = require("./postModel"); // Adjust the path as needed
const { authenticateUser } = require("./middleware"); // Assuming you have authentication middleware

const router = express.Router();

// Get all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new post
router.post("/posts", authenticateUser, async (req, res) => {
  try {
    const { username, caption, image, comments } = req.body;

    const newPost = await Post.create({
      username,
      caption,
      image,
      comments,
    });

    res.status(201).json({ post: newPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific post by ID
router.get("/posts/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a post by ID
router.patch("/posts/:postId", authenticateUser, async (req, res) => {
  try {
    const postId = req.params.postId;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: req.body },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a post by ID
router.delete("/posts/:postId", authenticateUser, async (req, res) => {
  try {
    const postId = req.params.postId;

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
