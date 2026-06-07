const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    displayname: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;