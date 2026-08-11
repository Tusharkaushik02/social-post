const cookieParser = require('cookie-parser');

function cookieParserMiddleware(req, res, next) {
    const tokenSecret = process.env.JWT_SECRET;
    cookieParser(tokenSecret)(req, res, next);
}

module.exports = cookieParserMiddleware;