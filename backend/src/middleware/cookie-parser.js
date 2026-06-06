const cookieParser = require('cookie-parser');

const tokenSecret = process.env.JWT_SECRET;

function cookieParserMiddleware(req, res, next) {
    cookieParser(tokenSecret)(req, res, next);
}

module.exports = cookieParserMiddleware;