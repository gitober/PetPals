const mongoose = require('mongoose');
const Post = require('../models/postModel');

// Create a new post
const addPost = async (req, res) => {
   const { content, images } = req.body;

    try {
    const user_id = req.user._id;
    const newPost = new Post({ content, images, user_id });
    await newPost.save();
    res.status(201).json(newPost);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Get all posts
const getAllPosts = async (req, res) => {
  const user_id = req.user._id

  try {
    const posts = await Post.find({user_id}).sort({createdAt: -1})
    res.status(200).json(posts)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}
  
// Get a post by ID
  const getPostById = async (req, res) => {
    const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'Post not found'});
  }

  try {
    const user_id = req.user._id;
    const posts = await Post.findById(id).where('user_id').equals(user_id);
    if (!posts) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Update a post
const updatePost = async (req, res) => {
  const { id } = req.params;
  try {
    const user_id = req.user._id;
    const posts = await Post.findOneAndUpdate(
      { _id: id, user_id: user_id },
      { ...req.body },
      { new: true }
    );
    if (!posts) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const user_id = req.user._id;
    const posts = await Post.findOneAndDelete({ _id: id, user_id });
    if (!posts) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Like a post
 const likePost = async (req, res) => {
  const { id } = req.params;
    try {
    const user_id = req.user._id;
    const posts = await Post.findById(id);
    if (!posts) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (posts.likes.includes(user_id)) {
      return res.status(400).json({ message: 'Post already liked' });
    }
    posts.likes.push(user_id);
    await posts.save();
    res.status(200).json({ message: 'Post liked successfully' });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Unlike a post
 const unlikePost = async (req, res) => {
  const { id } = req.params;

  try {
    const user_id = req.user._id;
    const posts = await Post.findById(id);
    if (!posts) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (!posts.likes.includes(user_id)) {
      return res.status(400).json({ message: 'Post not liked' });
    }
    posts.likes = posts.likes.filter((id) => id !== user_id);
    await posts.save();
    res.status(200).json({ message: 'Post unliked successfully' });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}



module.exports = { addPost, getAllPosts, getPostById, updatePost, deletePost, likePost, unlikePost }
