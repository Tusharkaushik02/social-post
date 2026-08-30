const SavedPost = require('../model/savedPost.model');
const Post = require('../model/post.model');

/**
 * Toggle save/unsave a post.
 * POST /api/posts/:id/save
 *
 * If the user already saved this post → unsave it.
 * If not → save it.
 */
exports.toggleSave = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        // Check if the post exists
        const post = await Post.findById(postId).select('_id').lean();
        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found'
            });
        }

        // Check if already saved
        const existingSave = await SavedPost.findOne({
            user: userId,
            post: postId
        }).select('_id').lean();

        if (existingSave) {
            // Already saved → unsave
            await SavedPost.findByIdAndDelete(existingSave._id);

            return res.status(200).json({
                success: true,
                saved: false,
                message: 'Post unsaved'
            });
        }

        // Not saved → save
        await SavedPost.create({
            user: userId,
            post: postId
        });

        res.status(200).json({
            success: true,
            saved: true,
            message: 'Post saved'
        });

    } catch (error) {
        console.error('Error toggling save:', error);

        // Handle duplicate key error gracefully (race condition)
        if (error.code === 11000) {
            return res.status(200).json({
                success: true,
                saved: true,
                message: 'Post already saved'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to toggle save'
        });
    }
};

/**
 * Get all saved posts for the current user.
 * GET /api/posts/saved
 *
 * Returns paginated saved posts sorted by when they were saved (newest first).
 * Each saved post is populated with the full Post document and its User reference.
 */
exports.getSavedPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const savedEntries = await SavedPost.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'post',
                populate: {
                    path: 'User',
                    select: 'username displayname avatarUrl'
                }
            })
            .lean();

        const total = await SavedPost.countDocuments({ user: userId });

        // Extract the posts from saved entries, filter out any with deleted posts
        const posts = savedEntries
            .filter(entry => entry.post != null)
            .map(entry => {
                const postObj = entry.post.toObject ? entry.post.toObject() : entry.post;
                return {
                    ...postObj,
                    isSaved: true,
                    likesCount: postObj.likes ? postObj.likes.length : 0,
                    isLiked: postObj.likes
                        ? postObj.likes.some(id => id.toString() === userId)
                        : false,
                    savedAt: entry.createdAt
                };
            });

        res.status(200).json({
            success: true,
            posts,
            page,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total
        });

    } catch (error) {
        console.error('Error fetching saved posts:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch saved posts'
        });
    }
};

/**
 * Check which posts from a list are saved by the current user.
 * Used internally by post.controller to add `isSaved` field to posts.
 *
 * @param {string} userId - The user's ID
 * @param {string[]} postIds - Array of post IDs to check
 * @returns {Set<string>} Set of post IDs that are saved
 */
exports.getSavedPostIds = async (userId, postIds) => {
    if (!userId || !postIds || postIds.length === 0) {
        return new Set();
    }

    const savedEntries = await SavedPost.find({
        user: userId,
        post: { $in: postIds }
    }).select('post').lean();

    return new Set(savedEntries.map(entry => entry.post.toString()));
};
