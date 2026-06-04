const express = require('express');
const multer = require('multer');
const postController = require('../controller/post.controller');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Routes
router.post('/create', upload.single('image'), postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.delete('/:id', postController.deletePost);

module.exports = router;
