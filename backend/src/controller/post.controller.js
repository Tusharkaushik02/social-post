const Post = require('../model/post.model');
const Comment = require('../model/comment.model');
const { uploadImage } = require('../services/storage.service');
const User = require('../model/user.model');
const { getSavedPostIds } = require('./save.controller');

// Helper function to transform post with likes/comments/save info
const transformPostWithCounts = async (post, currentUserId, savedPostIds) => {
    const postObj = post.toObject ? post.toObject() : post;
    const commentsCount = await Comment.countDocuments({ post: postObj._id });
    return {
        ...postObj,
        likesCount: postObj.likes ? postObj.likes.length : 0,
        commentsCount,
        isLiked: currentUserId && postObj.likes ? postObj.likes.some((id) => id.toString() === currentUserId) : false,
        isSaved: savedPostIds ? savedPostIds.has(postObj._id.toString()) : false
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
        let imageUrl;
        try {
            imageUrl = await uploadImage(req.file.buffer, req.file.mimetype);
        } catch (error) {
            if (process.env.NODE_ENV === 'production') {
                throw error;
            }
            console.warn('[createPost] Image upload failed; using local data URL fallback:', error.message);
            imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }

        // Create and save post
        const post = new Post({
            caption,
            image: imageUrl,
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let posts = [];
        let total = 0;

        // Guest Feed
        if (!req.user) {
            posts = await Post.find()
                .populate("User", "username displayname avatarUrl")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            total = await Post.countDocuments();
        } else {

            const currentUser = await User.findById(req.user.id)
                .select("following");

            const followingIds = currentUser.following;

            const followingLimit = Math.ceil(limit * 0.7);
            const exploreLimit = limit - followingLimit;

            // Posts from followed users
            const followingPosts = await Post.find({
                User: { $in: followingIds }
            })
                .populate("User", "username displayname avatarUrl")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(followingLimit);

            // Popular posts from other users
            const popularPostsAgg = await Post.aggregate([
                {
                    $match: {
                        User: {
                            $nin: [...followingIds, currentUser._id]
                        }
                    }
                },
                {
                    $addFields: {
                        likesCount: {
                             $size: {
                                    $ifNull: ["$likes", []]
                                }
                        }
                    }
                },
                {
                    $sort: {
                        likesCount: -1,
                        createdAt: -1
                    }
                },
                {
                    $limit: exploreLimit
                }
            ]);

            // Populate User manually after aggregation
            const popularPosts = await Post.populate(popularPostsAgg, {
                path: "User",
                select: "username displayname avatarUrl"
            });

            posts = [...followingPosts, ...popularPosts];

            // Slight shuffle
            posts.sort(() => Math.random() - 0.5);

            total = await Post.countDocuments();
        }

        // Get saved post IDs for current user
        const postIds = posts.map(p => (p._id || p).toString());
        const savedPostIds = req.user
            ? await getSavedPostIds(req.user.id, postIds)
            : new Set();

        // Add likesCount, commentsCount, isLiked, isSaved...
        const transformedPosts = await Promise.all(
            posts.map(post =>
                transformPostWithCounts(
                    post,
                    req.user ? req.user.id : null,
                    savedPostIds
                )
            )
        );

        res.status(200).json({
            success: true,
            posts: transformedPosts,
            page,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total
        });

    } catch (error) {
        console.error("Error fetching posts:", error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch posts"
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

        // Check if saved by current user
        const savedPostIds = req.user
            ? await getSavedPostIds(req.user.id, [post._id.toString()])
            : new Set();

        // Transform post to include likesCount, isLiked, and isSaved
        const transformedPost = await transformPostWithCounts(post, req.user ? req.user.id : null, savedPostIds);

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
