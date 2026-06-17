const Post = require('../model/post.model');
const User = require('../model/user.model');

exports.getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username })
            .select("-passwordHash");

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        const followersCount = user.followers.length;
        const followingCount = user.following.length;
        
        let isFollowing =false;

         if (req.user) {
            isFollowing = user.followers.some(
                followerId => followerId.toString() === req.user.id
            );
        }

        res.status(200).json({
            success: true,
            user,
            followersCount,
            followingCount,
            isFollowing
        });

    } catch (error) {
        console.error("Error fetching user:", error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch user"
        });
    }
};

exports.getSuggestions = async (req, res) => {
    try {
        const limit = Math.min(Number(req.query.limit) || 4, 12);
        const currentUser = await User.findById(req.user.id).select("following");

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        const excludedIds = [currentUser._id, ...currentUser.following];
        const suggestions = await User.aggregate([
            { $match: { _id: { $nin: excludedIds } } },
            { $sample: { size: limit } },
            {
                $project: {
                    username: 1,
                    displayname: 1,
                    avatarUrl: 1,
                    bio: 1,
                    followersCount: {  $size: {
                        $ifNull: ["$followers", []]
                    } },
                    followingCount: { $size: {
                        $ifNull: ["$following", []]
                    } }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            users: suggestions
        });
    } catch (error) {
        console.error("Error fetching user suggestions:", error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch user suggestions"
        });
    }
};

exports.
getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
        const posts = await Post.find({ User: user._id }).populate('User', 'username displayname avatarUrl').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch user posts"
        }); 
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { displayName, bio, avatar } = req.body;

        const updateData = {};

        if (displayName !== undefined) {
            updateData.displayname = displayName;
        }

        if (bio !== undefined) {
            updateData.bio = bio;
        }

        if (avatar !== undefined) {
            updateData.avatarUrl = avatar;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).select("-passwordHash");

        res.status(200).json({
            success: true,
            user: updatedUser
        });

    } catch (error) {
        console.error("Error updating profile:", error);

        res.status(500).json({
            success: false,
            error: "Failed to update profile"
        });
    }
};
