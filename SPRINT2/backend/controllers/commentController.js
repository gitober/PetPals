const mongoose = require('mongoose');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

// Get all comments
const getAllComments = async (req, res) => {
  const postId = req.params.id;
  try {
    const comments = await Comment.find({ postId });
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Create a new comment
const addComment = async (req, res) => {
  const { content, postId } = req.body;
  try {
    const user_id = req.user._id;
    const username = req.user.username;
    const newComment = new Comment({ content, postId, user_id, username });
    await newComment.save();
    const post = await Post.findById(postId);
    post.comments.push(newComment._id);
    await post.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Update a comment
const updateComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndUpdate
      (id,    { ...req.body },        { new: true });
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json(comment);
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  } 

}

// Delete a comment
const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndRemove(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

module.exports = { getAllComments, addComment, updateComment, deleteComment };