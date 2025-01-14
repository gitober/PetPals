const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

// Fetch all comments for a specific post
const getComments = async (postId) => {
  try {
    const comments = await Comment.find({ postId })
      .populate("user_id", "username")
      .exec();
    return comments;
  } catch (error) {
    console.error("Error in getComments:", error);
    throw error;
  }
};

// Add a comment for a specific post
const addComment = async (postId, content, userId) => {
  try {
    const comment = new Comment({
      postId,
      content,
      user_id: userId,
    });
    await comment.save();
    const savedComment = await Comment.findById(comment._id).populate("user_id", "username");
    return savedComment;
  } catch (error) {
    console.error("Error in addComment:", error);
    throw error;
  }
};

// Delete a comment by its ID
const deleteComment = async (commentId, loggedInUserId) => {
  try {
    const comment = await Comment.findById(commentId).populate("postId"); // Populate the postId to access the post owner
    if (!comment) {
      throw new Error("Comment not found");
    }

    const post = await Post.findById(comment.postId); // Fetch the post to check ownership
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if the logged-in user is the owner of the post
    if (post.user_id.toString() !== loggedInUserId.toString()) {
      throw new Error("Unauthorized: Only the post owner can delete comments");
    }

    // Delete the comment if the user is authorized
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      throw new Error("Failed to delete comment");
    }

    return deletedComment;
  } catch (error) {
    console.error("Error in deleteComment:", error.message);
    throw error;
  }
};


module.exports = { getComments, addComment, deleteComment };
