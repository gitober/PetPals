const router = require("express").Router();
const requireAuth = require("../middleware/requireAuth");
const { createComment, updateComment, deleteComment } = require("../controllers/commentController");

// Require authentication for all routes
router.use(requireAuth);

// Route to create a new comment
router.post("/comment/:id", createComment);

// Route to update a comment
router.patch("/comment/:id", updateComment);

// Route to delete a comment
router.delete("/comment/:id", deleteComment);

module.exports = router;
