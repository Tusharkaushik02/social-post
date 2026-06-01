const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const Post = require('./model/post.model');

dotenv.config();

const app = express();

app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/create-post', upload.single('image'), async (req, res) => {
    try {
        const { caption } = req.body;

        // Validation
        if (!caption) {
            return res.status(400).json({ error: 'Caption is required' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }

        // Create and save post
        const post = new Post({
            image: req.file.buffer.toString('base64'), // or store image URL if uploading to cloud
            caption
        });

        await post.save();

        res.status(201).json({
            message: 'Post created successfully',
            post
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

module.exports = app;