const chatService = require('../services/chat.service');

exports.createOrGetConversation = async (req, res) => {
    try {
        const { participantId } = req.body;
        const currentUserId = req.user.id;

        if (!participantId) {
            return res.status(400).json({ success: false, error: 'participantId is required' });
        }

        const { conversation, created } = await chatService.getOrCreateDMConversation(currentUserId, participantId);
        
        const responseConv = conversation.toObject();
        responseConv.unreadCount = conversation.unreadCount ? (conversation.unreadCount.get(currentUserId.toString()) || 0) : 0;

        res.status(created ? 201 : 200).json({
            success: true,
            conversation: responseConv
        });
    } catch (error) {
        if (error.message === 'Cannot create a conversation with yourself') {
            return res.status(400).json({ success: false, error: error.message });
        }
        console.error('Error in createOrGetConversation:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const conversations = await chatService.getUserConversations(req.user.id);
        res.status(200).json({
            success: true,
            conversations
        });
    } catch (error) {
        console.error('Error in getConversations:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
