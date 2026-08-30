const post = require('../model/post.model');
const user = require('../model/user.model');

exports.toggleLike = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const postToToggle = await post.findById(postId);

        if (!postToToggle) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        const likeIndex = postToToggle.likes.indexOf(userId);
        let liked;

        if (likeIndex > -1) {
            // Unlike: remove user from likes
            postToToggle.likes.splice(likeIndex, 1);
            liked = false;
        } else {
            // Like: add user to likes
            postToToggle.likes.push(userId);
            liked = true;
        }

        await postToToggle.save();
        res.json({ 
            success: true, 
            liked, 
            likesCount: postToToggle.likes.length 
        });

    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ success: false, error: 'Failed to toggle like' });
    }
};

exports.getLikedUsers = async (req, res) => {
    try {
        const postId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const postWithLikes = await post
            .findById(postId)
            .populate({
                path: 'likes',
                model: 'User',
                select: 'username displayname avatarUrl',
                options: { skip, limit }
            })
            .lean();

        if (!postWithLikes) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        const totalLikes = postWithLikes.likes.length;
        const totalPages = Math.ceil(totalLikes / limit);

        res.json({
            success: true,
            users: postWithLikes.likes,
            pagination: {
                page,
                limit,
                total: totalLikes,
                totalPages
            }
        });

    } catch (error) {
        console.error('Error fetching liked users:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch liked users' });
    }
};