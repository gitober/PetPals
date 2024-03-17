const router = require('express').Router();
const { getComments, addComment } = require('../controllers/commentController');
const requireAuth = require('../middleware/requireAuth');

// Require auth for all comment routes
router.use(requireAuth);

// GET all comments for a specific post
router.get('/:postId/comments', getComments);

// POST a new comment to a specific post
router.post('/:postId/comments', addComment);

module.exports = router;
