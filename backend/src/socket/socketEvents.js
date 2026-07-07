const onlineUsers = require('./OnlineUser');
const registerChatHandlers = require('./handler/chatHandler');
const registerPresenceHandlers = require('./handler/presenceHandler');

const registerSocketEvents = (io, socket) => {
    // 1. Authenticate user from socket (done in middleware, decoded in socket.user)
    const userId = socket.user?.id;
    if (!userId) return;

    // 2. Join personal room
    socket.join(`user:${userId}`);
    
    // 3. Register presence
    onlineUsers.addUser(userId, socket.id);
    
    // 4. Notify others that user is online
    // Wait for a short moment so the user itself can get the online users list if requested immediately
    setTimeout(() => {
        io.emit('user:online', { userId });
    }, 100);

    // 5. Register feature handlers
    registerPresenceHandlers(io, socket, onlineUsers);
    registerChatHandlers(io, socket);

    // 6. Handle disconnect
    socket.on('disconnect', () => {
        onlineUsers.removeUser(userId, socket.id);
        if (!onlineUsers.isOnline(userId)) {
            io.emit('user:offline', { userId });
        }
    });
};

module.exports = registerSocketEvents;
