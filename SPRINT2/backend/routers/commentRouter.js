const router = require("express").Router();
const { getAllComments, addComment, updateComment, deleteComment } = require("../controllers/commentController");
const requireAuth = require("../middleware/requireAuth");

// Require authentication for all routes
router.use(requireAuth);

// Route to get all comments
router.get("/", getAllComments);

// Route to create a new comment
router.post("/:id", addComment);

// Route to update a comment
router.patch("/:id", updateComment);

// Route to delete a comment
router.delete("/:id", deleteComment);

module.exports = router;
