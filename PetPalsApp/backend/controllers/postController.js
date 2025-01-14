const Post = require("../models/postModel");
const { formatImageUrl } = require("../utils/imageHelpers");

// Get all Posts (with like counts and liked status)
const getPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user_id", "username")
      .select("-__v");

    const formattedPosts = posts.map((post) => ({
      ...post.toObject(),
      image: formatImageUrl(req, post.image, "placeholder-image.png"), // Handle missing images
      likeCount: post.likes.length,
      isLiked: post.likes.includes(userId),
    }));

    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Add a Post
const addPost = async (req, res) => {
  try {
    const { content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Fixed image path

    if (!content && !image) {
      return res.status(400).json({ error: "Content or image is required" });
    }

    // Create the post
    let post = await Post.create({
      content,
      image,
      user_id: req.user._id,
    });

    // Populate the user data for the response
    post = await post.populate("user_id", "username");

    res.status(201).json({
      ...post.toObject(),
      image: formatImageUrl(req, post.image, "placeholder-image.png"),
    });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ error: "Failed to create post" });
  }
};


// Get Posts by Authenticated User
const getUserPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch posts created by the authenticated user
    const posts = await Post.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .populate("user_id", "username");

    // Map the posts to include likeCount and isLiked
    const formattedPosts = posts.map((post) => ({
      ...post.toObject(),
      image: formatImageUrl(req, post.image, "placeholder-image.png"),
      likeCount: post.likes.length,
      isLiked: post.likes.includes(userId),
    }));    

    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error("Error fetching user posts:", error.message);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
};

// Get a specific Post (with like counts and liked status)
const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // Get the logged-in user's ID

    const post = await Post.findById(id).populate("user_id", "username");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({
      ...post.toObject(),
      image: formatImageUrl(req, post.image, "placeholder-image.png"),
      likeCount: post.likes.length,
      isLiked: post.likes.includes(userId),
    });    
  } catch (error) {
    console.error("Error fetching post:", error.message);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};
// Delete Post by ID
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !req.user._id) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    const deletedPost = await Post.findOneAndDelete({ _id: id, user_id: req.user._id });

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

// Update Post by ID
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `uploads/${req.file.filename}`;
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id, user_id: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    res.status(200).json({
      ...updatedPost.toObject(),
      image: formatImageUrl(req, updatedPost.image, "placeholder-image.png"),
    });    
  } catch (error) {
    console.error("Error updating post:", error.message);
    res.status(500).json({ error: "Failed to update post" });
  }
};

// Toggle Like on a Post
const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      postId: post._id,
      likeCount: post.likes.length, // Updated like count
      isLiked: !isLiked, // New like status
    });
  } catch (error) {
    console.error("Error toggling like:", error.message);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};


module.exports = {
  getPosts,
  addPost,
  getUserPosts,
  getPost,
  deletePost,
  updatePost,
  toggleLike
};
