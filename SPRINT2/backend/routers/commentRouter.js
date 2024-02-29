// This script configures an Express router to handle various comment-related operations, such as creating, 
// updating, liking, unliking, and deleting comments. The routes are protected by authentication middleware 
// (authMiddleware), and the router is linked to the corresponding functions in the commentController 
// for implementing the logic.

const router = require("express").Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/comment/:id", authMiddleware, commentController.createComment);
router.patch("/comment/:id", authMiddleware, commentController.updateComment);
router.patch("/comment/:id/like", authMiddleware, commentController.likeComment);
router.patch("/comment/:id/unlike", authMiddleware, commentController.unlikeComment);
router.delete("/comment/:id", authMiddleware, commentController.deleteComment);

module.exports = router;