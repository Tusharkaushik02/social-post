const express = require('express');
const commentController = require('../controller/comment.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Routes
router.delete('/:commentId', authMiddleware, commentController.deleteComment);
router.get('/:commentId/replies', commentController.getrepliesToComment);
router.delete('/delete/:commentId', authMiddleware, commentController.deleteComment);
router.get('/replies/:commentId', commentController.getrepliesToComment);

module.exports = router;

