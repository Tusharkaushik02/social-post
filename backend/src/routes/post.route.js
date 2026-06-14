const express = require('express');
const multer = require('multer');
const postController = require('../controller/post.controller');
const authMiddleware = require('../middleware/authMiddleware');
const {toggleLike,getLikedUsers} = require('../controller/like.controller');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Routes
router.post('/create',
    authMiddleware,
    upload.single('image'),
    postController.createPost);

router.get('/', postController.getAllPosts);

router.get('/:id', authMiddleware,
    postController.getPostById);
    
router.delete('/:id', authMiddleware,
    postController.deletePost);

router.post('/:id/like', authMiddleware, toggleLike);

router.get('/:id/likes', getLikedUsers);

module.exports = router;
