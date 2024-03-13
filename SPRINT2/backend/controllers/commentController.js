const mongoose = require('mongoose');
const Posts = require('../models/postModel');
const Comments = require('../models/commentModel');

// Create a new comment for a post
const createComment = async (req, res) => {
  try {
    const { content, postId, reply, postUserId } = req.body;

    // Check if the provided post ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    const post = await Posts.findById(postId);
    if (!post) return res.status(400).json({ message: "No posts found" });

    const newComment = await new Comments({
      user: req.user._id,
      content,
      reply,
      postUserId,
      postId,
    });

    await Posts.findOneAndUpdate({ _id: postId }, { $push: { comments: newComment._id } });
    await newComment.save();

    return res.json({ newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Update the content of a comment
const updateComment = async (req, res) => {
  try {
    const { content } = req.body;

    await Comments.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { content });

    return res.json({ message: "Updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Delete a comment if the user is the owner or post owner
const deleteComment = async (req, res) => {
  try {
    const comment = await Comments.findOneAndDelete({
      _id: req.params.id,
      $or: [{ postUserId: req.user._id }, { user: req.user._id }],
    });

    await Posts.findOneAndUpdate({ _id: comment.postId }, { $pull: { comments: req.params.id } });

    res.json({ message: "Comment deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};
