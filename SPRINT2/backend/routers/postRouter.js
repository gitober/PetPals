// This script sets up an Express router for handling various post-related operations, including creation, 
// retrieval, update, deletion, liking, unliking, saving, unsaving, and fetching saved posts. Authentication 
// middleware (authMiddleware) is used to secure certain routes, and the router is connected to corresponding 
// functions in the postController for implementing the logic.

const express = require("express");
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/posts")
  .post(authMiddleware, postController.createPost)
  .get(postController.getPost);

router
  .route("/posts/:id")
  .patch(authMiddleware, postController.updatePost)
  .get(authMiddleware, postController.getSinglePost)
  .delete(authMiddleware, postController.deletePost);

router.patch("/posts/:id/like", authMiddleware, postController.likePost);
router.patch("/posts/:id/unlike", authMiddleware, postController.unlikePost);
router.get("/user_posts/:id", authMiddleware, postController.getUserPosts);
router.patch("/save_post/:id", authMiddleware, postController.savePost);
router.patch("/unsave_post/:id", authMiddleware, postController.unsavePost);
router.get("/savedpost", authMiddleware, postController.getsavedPost);

module.exports = router;