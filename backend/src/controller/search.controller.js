const User = require('../model/user.model');
const Post = require('../model/post.model');

/**
 * Search users and posts.
 * GET /api/search?q=term&type=all|users|posts
 *
 * Searches:
 * - Users: username, displayname, bio (case-insensitive regex)
 * - Posts: caption (case-insensitive regex)
 *
 * Returns: { success, users: [...], posts: [...] }
 */
exports.search = async (req, res) => {
    try {
        const { q, type = 'all' } = req.query;

        if (!q || !q.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }

        const term = q.trim();
        // Escape special regex characters for safe user input
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'i');

        const limit = Math.min(parseInt(req.query.limit) || 20, 50);
        let users = [];
        let posts = [];

        // Search users
        if (type === 'all' || type === 'users') {
            users = await User.find({
                $or: [
                    { username: regex },
                    { displayname: regex },
                    { bio: regex }
                ]
            })
                .select('username displayname avatarUrl bio followers following')
                .limit(limit)
                .lean();

            // Add computed counts
            users = users.map(user => ({
                ...user,
                followersCount: user.followers ? user.followers.length : 0,
                followingCount: user.following ? user.following.length : 0,
                // Remove the actual arrays from response to save bandwidth
                followers: undefined,
                following: undefined
            }));
        }

        // Search posts
        if (type === 'all' || type === 'posts') {
            posts = await Post.find({ caption: regex })
                .populate('User', 'username displayname avatarUrl')
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();

            // Add computed fields
            posts = posts.map(post => ({
                ...post,
                likesCount: post.likes ? post.likes.length : 0,
                // Remove the likes array from response to save bandwidth
                likes: undefined
            }));
        }

        res.status(200).json({
            success: true,
            users,
            posts,
            query: term
        });

    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({
            success: false,
            error: 'Search failed'
        });
    }
};
