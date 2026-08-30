const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

}, { timestamps: true });

postSchema.index({ User: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ 'likes.userId': 1 });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;