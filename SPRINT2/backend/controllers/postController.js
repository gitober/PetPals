const mongoose = require('mongoose');
const Posts = require('../models/postModel');

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Posts.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Add a new post
const addPost = async (req, res) => {
  const { content, images, postId } = req.body;

  try {
    const newPost = new Posts({ content, images, user: req.user._id, postId }); // Include postId when creating a new post
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get a post by ID
const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    // Fetch post from the database using postId
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post by id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Get posts by a specific user
const getUserPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const userPosts = await Posts.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(userPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Update a post by ID
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { content, images } = req.body;

  try {
    const post = await Posts.findByIdAndUpdate(id, { content, images }, { new: true });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Delete a post by ID
const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Posts.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Like a post
const likePost = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the post by ID and update its likes
    const post = await Posts.findByIdAndUpdate(id, { $addToSet: { likes: req.user._id } }, { new: true });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Unlike a post
const unlikePost = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the post by ID and update its likes
    const post = await Posts.findByIdAndUpdate(id, { $pull: { likes: req.user._id } }, { new: true });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getPosts,
  addPost,
  getPostById, // Adding getPostById function
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getUserPosts,
};
