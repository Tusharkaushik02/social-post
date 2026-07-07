const { Server } = require("socket.io");
const socketAuth = require("./socketAuth");
const registerSocketEvents = require('./socketEvents');

let io = null;

const initializeSocket = (server) => {

    const allowedOrigins = [
        process.env.CORS_ORIGIN,
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ].filter(Boolean);

    io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            credentials: true
        }
    });

    io.use(socketAuth);

    io.engine.on("connection_error", (error) => {
        console.error("Socket connection error:", error.message);
    });

    io.on("connection", (socket) => {
        console.log("New User Connected:", socket.id);
        registerSocketEvents(io, socket);
    });

    return io;

};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO is not initialized.");
    }
    return io;
};

module.exports = {
    initializeSocket,
    getIO
};

