const jwt = require("jsonwebtoken");
const userModel = require('../model/user.model');

// Middleware to optionally authenticate - doesn't require token but will attach user if valid token is provided
async function optionalAuthMiddleware(req, res, next) {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        // No token provided, continue without user context
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ _id: decoded.id });
        
        if (user) {
            req.user = decoded;
        } else {
            req.user = null;
        }
        next();
    } catch (err) {
        // Invalid token, continue without user context
        req.user = null;
        next();
    }
}

module.exports = optionalAuthMiddleware;
