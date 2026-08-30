const comment = require('../model/comment.model');

// Create a new comment
exports.createComment = async (req, res) => {
    try {
        const postId = req.params.postId || req.params.id || req.body.postId;
        const { text, parentCommentId } = req.body;
        const newComment = new comment({
            post: postId,
            user: req.user.id,
            text,
            parentComment: parentCommentId || null
        });
        await newComment.save();
        await newComment.populate('user', 'username displayname avatarUrl');
        res.status(201).json({ comment: newComment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCommentsByPost = async (req, res) => {
    try {
        const postId = req.params.postId || req.params.id;
        const comments = await comment.find({ post: postId, parentComment: null })
            .populate('user', 'username displayname avatarUrl')
            .sort({ createdAt: -1 })
            .lean();
        const commentsWithReplyCounts = await Promise.all(comments.map(async (item) => {
            const replyCount = await comment.countDocuments({ parentComment: item._id });
            return {
                ...item,
                replyCount
            };
        }));
        res.json({ comments: commentsWithReplyCounts });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const commentToDelete = await comment.findById(commentId).select('user').lean();

        if (!commentToDelete) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (commentToDelete.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to delete this comment' });
        }

        await comment.deleteMany({ parentComment: commentId });
        await comment.findByIdAndDelete(commentId);
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getrepliesToComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const replies = await comment.find({ parentComment: commentId })
            .populate('user', 'username displayname avatarUrl')
            .sort({ createdAt: -1 })
            .lean();
        res.json({ replies });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
