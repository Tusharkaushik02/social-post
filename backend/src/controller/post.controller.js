const Post = require('../model/post.model');
const { uploadImage } = require('../services/storage.service');

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { caption } = req.body;

        // Validation
        if (!caption) {
            return res.status(400).json({ 
                success: false,
                error: 'Caption is required' 
            });
        }

        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                error: 'Image is required' 
            });
        }

        // Upload image
        const result = await uploadImage(req.file.buffer);

        // Create and save post
        const post = new Post({
            caption,
            image: result
        });

        await post.save();

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to create post' 
        });
    }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch posts' 
        });
    }
};

// Get post by ID
exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ 
                success: false,
                error: 'Post not found' 
            });
        }

        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch post' 
        });
    }
};

// Delete post
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            return res.status(404).json({ 
                success: false,
                error: 'Post not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to delete post' 
        });
    }
};
