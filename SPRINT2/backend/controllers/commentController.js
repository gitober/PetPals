const Comments = require("../models/commentModel");
const Posts = require("../models/postModel");

const commentController = {
  // Create a aew comment for a post
  createComment: async (req, res) => {
    try {
      // Extract comment details from request body
      const { content, postId, tag, reply, postUserId } = req.body;

      // Find the post by postId
      const post = await Posts.findById(postId);

      // Check if the post exists
      if (!post) return res.status(400).json({ message: "No posts found" });

      // Create a new comment
      const newComment = await new Comments({
        user: req.user._id,
        content,
        tag,
        reply,
        postUserId,
        postId,
      });

      // Update the post with the new comment
      await Posts.findOneAndUpdate(
        { _id: postId },
        {
          $push: { comments: newComment._id },
        }
      );

      // Save the new comment
      await newComment.save();

      // Respond with the new comment
      return res.json({ newComment });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // Update the content of a comment
  updateComment: async (req, res) => {
    try {
      // Extract updated content from request body
      const { content } = req.body;

      // Update the comment with the new content
      await Comments.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { content }
      );

      // Respond with success message
      return res.json({ message: "Updated successfully" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // Like a comment
  likeComment: async (req, res) => {
    try {
      // Check if the user has already liked the comment
      const comment = await Comments.find({
        _id: req.params.id,
        likes: req.user._id,
      });

      // Return error if the comment has already been liked
      if (comment.length > 0)
        return res
          .status(400)
          .json({ message: "You have already liked this comment" });

      // Like the comment and respond with success message
      await Comments.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );

      return res.json({ message: "Liked comment" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // Unlike a previously liked comment
  unlikeComment: async (req, res) => {
    try {
      // Unlike the comment and respond with success message
      await Comments.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );

      return res.json({ message: "Comment unliked" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // Delete a comment if the user is the owner or post owner
  deleteComment: async (req, res) => {
    try {
      // Find and delete the comment based on user and post ownership
      const comment = await Comments.findOneAndDelete({
        _id: req.params.id,
        $or: [{ postUserId: req.user._id }, { user: req.user._id }],
      });

      // Update the post by removing the comment reference
      const post = await Posts.findOneAndUpdate(
        { _id: comment.postId },
        {
          $pull: { comments: req.params.id },
        }
      );

      // Respond with success message
      res.json({ message: "Comment deleted successfully!" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = commentController;
