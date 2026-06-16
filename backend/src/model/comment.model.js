const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    post:      { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text:      { type: String, required: true, maxlength: 500 },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    // null = top-level comment, ObjectId = reply to another comment
}, { timestamps: true });
// Index for fast queries
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

module.exports = mongoose.model('Comment', commentSchema);