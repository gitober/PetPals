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


module.exports = router;