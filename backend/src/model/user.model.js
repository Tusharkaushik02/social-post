const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, default:null },
    displayname: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    following:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
     provider:{
        type:String,
        enum:["local","google","apple"],
        default:"local"
    },

    googleId: {
        type: String,
        default: null,
        unique: true,
        sparse: true
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;