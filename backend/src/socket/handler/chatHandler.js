const chatService = require('../../services/chat.service');

const registerChatHandlers = (io, socket) => {
    const userId = socket.user?.id;
    if (!userId) return;

    // Join a specific conversation room
    socket.on('conversation:join', async ({ conversationId }, callback) => {
        try {
            await chatService.getConversationById(conversationId, userId);
            socket.join(`conversation:${conversationId}`);
            if (typeof callback === 'function') callback({ success: true });
        } catch (error) {
            if (typeof callback === 'function') callback({ success: false, error: error.message });
        }
    });

    // Leave a specific conversation room
    socket.on('conversation:leave', ({ conversationId }, callback) => {
        socket.leave(`conversation:${conversationId}`);
        if (typeof callback === 'function') callback({ success: true });
    });

    // Send a message
    socket.on('message:send', async ({ conversationId, content, clientMessageId }, callback) => {
        try {
            const { message, isDuplicate } = await chatService.createMessage(conversationId, userId, content, clientMessageId);
            
            if (!isDuplicate) {
                // Emit to everyone in the room
                io.to(`conversation:${conversationId}`).emit('message:new', message);
            }
            
            if (typeof callback === 'function') callback({ success: true, message, isDuplicate });
        } catch (error) {
            if (typeof callback === 'function') callback({ success: false, error: error.message });
        }
    });

    // Mark messages as read
    socket.on('messages:read', async ({ conversationId }, callback) => {
        try {
            const messageIds = await chatService.markMessagesAsRead(conversationId, userId);
            
            if (messageIds.length > 0) {
                io.to(`conversation:${conversationId}`).emit('messages:read_receipt', {
                    conversationId,
                    readBy: userId,
                    messageIds
                });
            }

            if (typeof callback === 'function') callback({ success: true });
        } catch (error) {
            if (typeof callback === 'function') callback({ success: false, error: error.message });
        }
    });
    
    // Typing indicators
    socket.on('typing:start', ({ conversationId }) => {
        socket.to(`conversation:${conversationId}`).emit('user:typing', {
            conversationId,
            userId,
            username: socket.user?.username
        });
    });

    socket.on('typing:stop', ({ conversationId }) => {
        socket.to(`conversation:${conversationId}`).emit('user:stop_typing', {
            conversationId,
            userId
        });
    });
};

module.exports = registerChatHandlers;
