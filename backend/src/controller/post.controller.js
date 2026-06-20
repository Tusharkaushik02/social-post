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
//Pagination helper functions
function encodeCursor(createdAt, id) {
    return Buffer.from(
        JSON.stringify({
            createdAt,
            id,
        })
    ).toString("base64");
}

function decodeCursor(cursor) {
    if (!cursor) return null;

    try {
        const parsed = JSON.parse(
            Buffer.from(cursor, "base64").toString("utf8")
        );

        if (!parsed.createdAt || !parsed.id) return null;

        const createdAt = new Date(parsed.createdAt);
        if (Number.isNaN(createdAt.getTime())) return null;

        return {
            createdAt,
            id: parsed.id
        };
    } catch {
        return null;
    }
}

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
        const limit = Math.min(
            Math.min(Number(req.query.limit) || 4, 4),
            50
        );
        const fetchLimit = limit + 1;
        const cursor = decodeCursor(req.query.cursor);

        const cursorFilter = cursor
            ? {
                $or: [
                    {
                        createdAt: {
                            $lt: cursor.createdAt
                        }
                    },
                    {
                        createdAt: cursor.createdAt,
                        _id: {
                            $lt: cursor.id
                        }
                    }
                ]
            }
            : {};

        const sortByNewest = {
            createdAt: -1,
            _id: -1
        };

        let posts = [];

        // Guest feed
        if (!req.user) {
            posts = await Post.find(cursorFilter)
                .populate("User", "username displayname avatarUrl")
                .sort(sortByNewest)
                .limit(fetchLimit);
        } else {
            const currentUser = await User.findById(req.user.id).select("following");
            const followingIds = currentUser?.following || [];

            const [followingPosts, explorePosts] = await Promise.all([
                Post.find({
                    User: { $in: followingIds },
                    ...cursorFilter
                })
                    .populate("User", "username displayname avatarUrl")
                    .sort(sortByNewest)
                    .limit(fetchLimit),
                Post.find({
                    User: {
                        $nin: [...followingIds, req.user.id]
                    },
                    ...cursorFilter
                })
                    .populate("User", "username displayname avatarUrl")
                    .sort(sortByNewest)
                    .limit(fetchLimit)
            ]);

            posts = [...followingPosts, ...explorePosts]
                .sort((a, b) => {
                    const createdAtDiff = b.createdAt - a.createdAt;
                    if (createdAtDiff !== 0) return createdAtDiff;

                    return b._id.toString().localeCompare(a._id.toString());
                })
                .slice(0, fetchLimit);
        }

        const hasMore = posts.length > limit;
        const pagePosts = hasMore ? posts.slice(0, limit) : posts;
        const last = pagePosts[pagePosts.length - 1];

        const nextCursor = hasMore && last
            ? encodeCursor(
                last.createdAt,
                last._id
            )
            : null;

        // Get saved post IDs for current user
        const postIds = pagePosts.map(p => p._id.toString());
        const savedPostIds = req.user
            ? await getSavedPostIds(req.user.id, postIds)
            : new Set();

        // Add likesCount, commentsCount, isLiked, isSaved...
        const transformedPosts = await Promise.all(
            pagePosts.map(post =>
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
            nextCursor,
            hasMore
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
