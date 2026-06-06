const express = require('express');
const multer = require('multer');
const postController = require('../controller/post.controller');
const authMiddleware = require('../middleware/authMiddleware');

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

module.exports = router;
