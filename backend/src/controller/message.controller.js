const chatService = require('../services/chat.service');
const { getIO } = require('../socket/socket');

exports.getMessages = async (req, res) => {
    try {
        const { id: conversationId } = req.params;
        const { cursor, limit } = req.query;
        
        const result = await chatService.getMessages(conversationId, req.user.id, cursor, limit ? parseInt(limit, 10) : 50);
        
        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        if (error.message === 'Unauthorized' || error.message === 'Conversation not found') {
            return res.status(403).json({ success: false, error: 'Unauthorized to access this conversation' });
        }
        console.error('Error in getMessages:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { conversationId, content, clientMessageId } = req.body;
        const senderId = req.user.id;

        if (!conversationId || !content) {
            return res.status(400).json({ success: false, error: 'conversationId and content are required' });
        }

        const { message, isDuplicate, conversation } = await chatService.createMessage(conversationId, senderId, content, clientMessageId);
        
        if (!isDuplicate) {
            const io = getIO();
            if (io) {
                // Emit to the conversation room
                io.to(`conversation:${conversationId}`).emit('message:new', message);

                // Also emit to each participant's personal room
                if (conversation?.participants) {
                    conversation.participants.forEach(p => {
                        const pid = p._id ? p._id.toString() : p.toString();
                        io.to(`user:${pid}`).emit('message:new', message);
                    });
                }
            }
        }

        res.status(201).json({
            success: true,
            message
        });
    } catch (error) {
        if (error.message === 'Unauthorized' || error.message === 'Conversation not found') {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }
        console.error('Error in sendMessage:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;

        const messageIds = await chatService.markMessagesAsRead(conversationId, userId);
        
        if (messageIds.length > 0) {
            const io = getIO();
            if (io) {
                io.to(`conversation:${conversationId}`).emit('messages:read_receipt', {
                    conversationId,
                    readBy: userId,
                    messageIds
                });
            }
        }

        res.status(200).json({
            success: true,
            messageIds
        });
    } catch (error) {
        if (error.message === 'Unauthorized' || error.message === 'Conversation not found') {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }
        console.error('Error in markAsRead:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
