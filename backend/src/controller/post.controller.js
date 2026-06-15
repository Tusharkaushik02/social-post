const Post = require('../model/post.model');
const { uploadImage } = require('../services/storage.service');

// Helper function to transform post with likes info
const transformPostWithLikes = (post, currentUserId) => {
    const postObj = post.toObject ? post.toObject() : post;
    return {
        ...postObj,
        likesCount: postObj.likes ? postObj.likes.length : 0,
        isLiked: currentUserId && postObj.likes ? postObj.likes.includes(currentUserId) : false
    };
};

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
            image: result,
            User: req.user.id
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
        const posts = await Post.find().populate('User', 'username displayname avatarUrl').sort({ createdAt: -1 });
        
        // Transform posts to include likesCount and isLiked
        const transformedPosts = posts.map(post => 
            transformPostWithLikes(post, req.user ? req.user.id : null)
        );
        
        res.status(200).json({
            success: true,
            posts: transformedPosts
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
        const post = await Post.findById(id).populate('User', 'username displayname avatarUrl');

        if (!post) {
            return res.status(404).json({ 
                success: false,
                error: 'Post not found' 
            });
        }

        // Transform post to include likesCount and isLiked
        const transformedPost = transformPostWithLikes(post, req.user ? req.user.id : null);

        res.status(200).json({
            success: true,
            post: transformedPost
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
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ 
                success: false,
                error: 'Post not found' 
            });
        }
        if (post.User.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false,
                error: 'Unauthorized to delete this post' 
            });
        }

        await Post.findByIdAndDelete(id);

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
