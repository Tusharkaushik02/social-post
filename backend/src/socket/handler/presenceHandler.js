const registerPresenceHandlers = (io, socket, onlineUsers) => {
    socket.on('presence:get_online_users', (callback) => {
        const users = onlineUsers.getAllOnlineUserIds();
        if (typeof callback === 'function') {
            callback(users);
        } else {
            socket.emit('users:online', users);
        }
    });
};

module.exports = registerPresenceHandlers;
