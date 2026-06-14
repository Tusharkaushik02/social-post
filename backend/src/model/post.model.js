const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }]
    
}, { timestamps: true });

const Post = mongoose.model('Post' ,postSchema);

module.exports = Post;