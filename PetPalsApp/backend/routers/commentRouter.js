const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middleware/requireAuth");
const { getComments, addComment, deleteComment } = require("../controllers/commentController");

const router = express.Router();

// Require authentication for all comment routes
router.use(requireAuth);

// Helper function to validate object IDs
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all comments for a specific post
router.get("/", async (req, res) => {
  const { postId } = req.query;

  if (!postId || !isValidObjectId(postId)) {
    return res.status(400).json({ error: "Invalid or missing postId" });
  }

  try {
    const comments = await getComments(postId);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Add a new comment for a specific post
router.post("/", async (req, res) => {
  const { postId, content } = req.body;

  if (!postId || !content) {
    return res.status(400).json({ error: "Post ID and content are required" });
  }

  if (!isValidObjectId(postId)) {
    return res.status(400).json({ error: "Invalid postId format" });
  }

  try {
    const newComment = await addComment(postId, content, req.user._id);
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Delete a comment by its ID
router.delete("/:commentId", requireAuth, async (req, res) => {
  const { commentId } = req.params;

  // Validate the format of the comment ID
  if (!isValidObjectId(commentId)) {
    return res.status(400).json({ error: "Invalid commentId format" });
  }

  try {
    // Attempt to delete the comment
    const deletedComment = await deleteComment(commentId, req.user._id);

    // Respond with success if deletion was successful
    res.status(200).json({ message: "Comment deleted successfully", deletedComment });
  } catch (error) {
    // Handle errors, such as unauthorized access or other issues
    if (error.message === "Unauthorized: Only the post owner can delete comments") {
      return res.status(403).json({ error: error.message });
    }

    console.error("Error deleting comment:", error.message);
    res.status(500).json({ error: error.message || "Failed to delete comment" });
  }
});

module.exports = router;
