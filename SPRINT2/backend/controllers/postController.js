// controllers/postController.js
const { mockPosts } = require("../utils/mockData");

exports.getAllPosts = (req, res) => {
  res.json(mockPosts);
};

exports.getPostById = (req, res) => {
  const { postId } = req.params;
  const post = mockPosts.find((post) => post.postId === parseInt(postId));
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
};
