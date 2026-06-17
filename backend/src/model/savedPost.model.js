const mongoose = require('mongoose');

const savedPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
}, { timestamps: true });

// Ensure a user can only save a post once
savedPostSchema.index({ user: 1, post: 1 }, { unique: true });

// Index for fast "get all saved by user" queries (sorted by newest first)
savedPostSchema.index({ user: 1, createdAt: -1 });

const SavedPost = mongoose.model('SavedPost', savedPostSchema);

module.exports = SavedPost;
