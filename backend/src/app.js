const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const Post = require('./model/post.model');
const {uploadImage} = require('./services/storage.service');

dotenv.config();

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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
       const result = await uploadImage(req.file.buffer);

        const post = new Post({
            caption,
            image: result
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

app.get('/posts', async (req, res) => {
    try {
        const posts =await Post.find().sort({ createdAt: -1 });
        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

app.get('/' , async (req, res) => {
    res.send("Welcome to the Instagram Clone API");
});
console.log("App routes loaded");

module.exports = app;