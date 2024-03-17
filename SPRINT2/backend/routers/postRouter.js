const express = require('express');
const router = express.Router();
const { getPosts, addPost, getPost, deletePost, updatePost } = require('../controllers/postController');
const requireAuth = require('../middleware/requireAuth');

// Require auth for all post routes
router.use(requireAuth);

// GET all Posts
router.get('/', getPosts);

// POST a new Post
router.post('/', addPost);

// GET a single Post
router.get('/:id', getPost);

// DELETE a Post
router.delete('/:id', deletePost);

// Update Post using PUT
router.put('/:id', updatePost);

module.exports = router;
