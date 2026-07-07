const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const dotenv = require("dotenv");
dotenv.config();

const socketAuth = (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    const authToken = socket.handshake.auth?.token;
    const authorization = socket.handshake.headers.authorization;

    let token = authToken;

    if (!token && authorization?.startsWith("Bearer ")) {
      token = authorization.slice(7);
    }

    if (!token && cookieHeader) {
      const cookies = cookie.parse(cookieHeader);
      token = cookies.token;
      if (token) {
          console.log(`[Socket] Auth fallback to cookie for socket ${socket.id}`);
      }
    }

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    console.error(`[Socket] Auth failed for socket ${socket.id}: ${error.message}`);
    next(new Error("Invalid or expired token"));
  }
};

module.exports = socketAuth;
