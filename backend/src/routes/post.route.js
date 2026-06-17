const express = require('express');
const multer = require('multer');
const postController = require('../controller/post.controller');
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuthMiddleware = require('../middleware/optionalAuth');
const { toggleLike, getLikedUsers } = require('../controller/like.controller');
const { getCommentsByPost, createComment } = require('../controller/comment.controller');
const { toggleSave, getSavedPosts } = require('../controller/save.controller');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// ── Save routes (must be before /:id to avoid 'saved' matching as an ID) ──
router.get('/saved', authMiddleware, getSavedPosts);

// Routes
router.post('/create',
    authMiddleware,
    upload.single('image'),
    postController.createPost);

router.get('/', optionalAuthMiddleware, postController.getAllPosts);

router.get('/:id', optionalAuthMiddleware,
    postController.getPostById);
    
router.delete('/:id', authMiddleware,
    postController.deletePost);

router.post('/:id/like', authMiddleware, toggleLike);

router.get('/:id/likes', getLikedUsers);

router.get('/:id/comments', getCommentsByPost);

router.post('/:id/comments', authMiddleware, createComment);

router.post('/:id/save', authMiddleware, toggleSave);

module.exports = router;
