const { registerUser } = require('./register.controller');
const { loginUser } = require('./login.controller');
const userModel = require('../model/user.model');

async function getMe(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        return res.json({ success: true, user });
    } catch (error) {
        console.error('Error fetching current user:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch user' });
    }
}

function logoutUser(req, res) {
    res.clearCookie('token');
    return res.json({ success: true, message: 'Logged out successfully' });
}

module.exports = { registerUser, loginUser, getMe, logoutUser };