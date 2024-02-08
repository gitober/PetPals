const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticateUser } = require("../middleware"); // Adjust the path if necessary

router.get("/posts", postController.getAllPosts);
router.post("/posts", authenticateUser, postController.createPost);
router.get("/posts/:postId", postController.getPostById);
router.patch("/posts/:postId", authenticateUser, postController.updatePostById);
router.delete("/posts/:postId", authenticateUser, postController.deletePostById);

module.exports = router;

