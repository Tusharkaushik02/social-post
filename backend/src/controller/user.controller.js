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

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Error fetching user:", error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch user"
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
            updateData.displayName = displayName;
        }

        if (bio !== undefined) {
            updateData.bio = bio;
        }

        if (avatar !== undefined) {
            updateData.avatar = avatar;
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
