const mongoose = require('mongoose');
const Comment = require('../models/commentModel');

// GET all comments for a specific post
const getComments = async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comment.find({ post_id: postId });
  res.json(comments);
};

// POST a new comment to a specific post
const addComment = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id; // Assuming the authenticated user's ID is available in req.user.id
  const { username, content } = req.body;
  const newComment = new Comment({ post_id: postId, user_id: userId, username, content });
  await newComment.save();
  res.status(201).json(newComment);
};

module.exports = { getComments, addComment };
