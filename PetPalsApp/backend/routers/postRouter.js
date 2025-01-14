const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const upload = require("../utils/multerConfig");
const { formatImageUrl } = require("../utils/imageHelpers");
const User = require("../models/userModel");
const Post = require("../models/postModel");

const router = express.Router();

// Add Post Route
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!req.body.content && !imagePath) {
      return res.status(400).json({ error: "Content or image is required" });
    }

    const postData = {
      content: req.body.content || "",
      image: imagePath,
      user_id: req.user._id,
    };

    const savedPost = await Post.create(postData);

    // Populate user data in the response
    const populatedPost = await savedPost.populate("user_id", "username");

    res.status(201).json({
      ...populatedPost.toObject(),
      image: formatImageUrl(req, imagePath),
    });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ error: "Failed to add post" });
  }
});

// Get All Posts Route
router.get("/", requireAuth, async (req, res) => {
  try {
    console.log("Fetching all posts...");

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user_id", "username") // Populate user details
      .select("-__v");

    const sanitizedPosts = posts.map((post) => ({
      ...post.toObject(),
      image: formatImageUrl(req, post.image),
      likeCount: post.likes.length,
      isLiked: post.likes.includes(req.user._id),
      comments: [], // Ensure the comments field exists even if empty
    }));

    res.status(200).json(sanitizedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Get Posts by Authenticated User
router.get("/user/:username", requireAuth, async (req, res) => {
  try {
    const { username } = req.params;

    console.log(`Fetching posts for username: ${username}`);

    const user = await User.findOne({ username });
    if (!user) {
      console.error(`User not found: ${username}`);
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ user_id: user._id }).sort({ createdAt: -1 });

    const sanitizedPosts = posts.map((post) => ({
      ...post.toObject(),
      image: formatImageUrl(req, post.image),
      likeCount: post.likes.length,
      isLiked: post.likes.includes(req.user._id),
    }));

    res.status(200).json(sanitizedPosts);
  } catch (error) {
    console.error("Error fetching user posts:", error.message);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
});

// Update Post by ID
router.put("/:postId", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.postId, user_id: req.user._id },
      updatedData,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    res.status(200).json({
      ...updatedPost.toObject(),
      image: formatImageUrl(req, updatedPost.image),
    });
  } catch (error) {
    console.error("Error updating post:", error.message);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// Get Specific Post by ID
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({
      ...post.toObject(),
      image: formatImageUrl(req, post.image),
    });
  } catch (error) {
    console.error("Error fetching post:", error.message);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Delete Post by ID
router.delete("/:postId", requireAuth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.postId,
      user_id: req.user._id,
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// Like a Post
router.post("/:postId/like", requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      console.error(`Post with ID ${postId} not found.`);
      return res.status(404).json({ error: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike the post by removing the user ID
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
      console.log(`User ${userId} unliked post ${postId}`);
    } else {
      // Like the post by adding the user ID
      post.likes.push(userId);
      console.log(`User ${userId} liked post ${postId}`);
    }

    await post.save();

    // Respond with the updated like count and like status
    res.status(200).json({
      postId: post._id,
      likesCount: post.likes.length, // Updated count
      isLiked: !isLiked, // Reflect the new like status
    });
  } catch (error) {
    console.error("Error toggling like:", error.message);
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

// Get Likes for a Post
router.get("/:postId/likes", requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    res.status(200).json({
      postId: post._id,
      likesCount: post.likes.length,
      isLiked,
    });
  } catch (error) {
    console.error("Error fetching likes:", error.message);
    res.status(500).json({ error: "Failed to fetch likes" });
  }
});

// Unlike a Post
router.delete("/:postId/like", requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Remove user ID from likes array if it exists
    const isLiked = post.likes.includes(userId);

    if (!isLiked) {
      // Change this message to make it clearer
      return res.status(400).json({ error: "User has not liked this post" });
    }

    // Proceed to remove the like
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());

    await post.save();

    res.status(200).json({
      postId: post._id,
      likesCount: post.likes.length,
      isLiked: false,
    });
  } catch (error) {
    console.error("Error unliking post:", error.message);
    res.status(500).json({ error: "Failed to unlike post" });
  }
});

module.exports = router;
