const User = require('../model/user.model');

exports.togglefollow = async (req,res) => {
    try {
        const userId = req.user.id;
        const targetUserId = req.params.userId;

        if(userId === targetUserId) {
            return res.status(400).json({ success: false, error: 'You cannot follow yourself' });
        }
        const currentUser = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);
    
        if(!currentUser || !targetUser){
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        const isFollowing = currentUser.following.some(
            followedId => followedId.toString() === targetUser._id.toString()
        );

        if (isFollowing) {
            currentUser.following.pull(targetUser._id);
            targetUser.followers.pull(currentUser._id);
        } else {
            currentUser.following.addToSet(targetUser._id);
            targetUser.followers.addToSet(currentUser._id);
        }
        await Promise.all([currentUser.save(), targetUser.save()]);

        res.status(200).json({
            success: true,
            following: !isFollowing,
            followersCount: targetUser.followers.length,
            followingCount: currentUser.following.length
        });
    }
    catch (error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getFollowers = async (req,res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const user = await User.findById(req.params.userId)
            .populate({
                path: "followers",
                select: "username displayname avatarUrl",
                options: {
                    skip: (page - 1) * limit,
                    limit
                }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            totalFollowers: user.followers.length,
            followers: user.followers
        });
    }
    catch (error){
          res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getfollowing =async (req,res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const user =await User.findById(req.params.userId)
            .populate({
                path: "following",
                select: "username displayname avatarUrl",
                options: {
                    skip: (page -1)*limit,
                    limit
                }
            })
             if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            totalFollowing: user.following.length,
            following: user.following
        });
    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};
