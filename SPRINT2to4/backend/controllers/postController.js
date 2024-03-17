const mongoose = require('mongoose');
const Post = require('../models/postModel');

// Get all Posts
const getPosts = async (req, res) => {
  const user_id = req.user._id;

  try {
    const posts = await Post.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Add one Post
const addPost = async (req, res) => {
  const { content, image } = req.body;

  try {
    const user_id = req.user._id;
    const newPost = new Post({ content, image, user_id });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get Post by ID
const getPost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such post' });
  }

  try {
    const user_id = req.user._id;
    const post = await Post.findById(id).where('user_id').equals(user_id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Delete Post by ID
const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const user_id = req.user._id;
    const post = await Post.findByIdAndDelete({ _id: id, user_id: user_id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Update Post by ID
const updatePost = async (req, res) => {
  const { id } = req.params;
  try {
    const user_id = req.user._id;
    const post = await Post.findOneAndUpdate(
      { _id: id, user_id: user_id },
      { ...req.body },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
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
  getPost,
  deletePost,
  updatePost,
};
