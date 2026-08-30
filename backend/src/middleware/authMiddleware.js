const jwt= require("jsonwebtoken");
const userModel = require('../model/user.model');
// Middleware to protect routes
async function authMiddleware(req, res, next) {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized' 
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        const user = await userModel.findOne({ _id: decoded.id }).select('_id').lean();
        if(!user){
            return res.status(401).json({
                success: false,
                error: 'Unauthorized' 
            });
        }
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: 'Invalid token' 
        });
    }
}

module.exports = authMiddleware;