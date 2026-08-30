const Conversation = require('../model/Conversation.model');
const Message = require('../model/message.model');
const User = require('../model/user.model');

// Helper to build deterministic dmKey
const getDMKey = (id1, id2) => {
    return [id1.toString(), id2.toString()].sort().join('_');
};

const chatService = {
    getOrCreateDMConversation: async (userId1, userId2) => {
        if (userId1.toString() === userId2.toString()) {
            throw new Error('Cannot create a conversation with yourself');
        }

        const dmKey = getDMKey(userId1, userId2);

        // Try to find an existing one
        let conversation = await Conversation.findOne({ dmKey }).populate('participants', 'username displayname avatarUrl');
        
        if (conversation) {
            return { conversation, created: false };
        }

        // Create new
        conversation = await Conversation.create({
            participants: [userId1, userId2],
            dmKey,
            unreadCount: { [userId1.toString()]: 0, [userId2.toString()]: 0 }
        });

        conversation = await conversation.populate('participants', 'username displayname avatarUrl');
        return { conversation, created: true };
    },

    getUserConversations: async (userId) => {
        const conversations = await Conversation.find({
            participants: userId
        })
        .populate('participants', 'username displayname avatarUrl')
        .sort({ 'lastMessage.createdAt': -1, updatedAt: -1 })
        .lean();

        return conversations.map(conv => {
            const uid = userId.toString();
            let unread = 0;
            if (conv.unreadCount) {
                unread = conv.unreadCount instanceof Map
                    ? (conv.unreadCount.get(uid) || 0)
                    : (conv.unreadCount[uid] || 0);
            }
            return {
                ...conv,
                unreadCount: unread
            };
        });
    },

    getConversationById: async (conversationId, userId) => {
        const conversation = await Conversation.findById(conversationId).populate('participants', 'username displayname avatarUrl');
        if (!conversation) {
            throw new Error('Conversation not found');
        }
        
        const isParticipant = conversation.participants.some(p => p._id.toString() === userId.toString() || p.toString() === userId.toString());
        if (!isParticipant) {
            throw new Error('Unauthorized');
        }

        return conversation;
    },

    getMessages: async (conversationId, userId, cursorStr, limit = 50) => {
        // Verify participation
        await chatService.getConversationById(conversationId, userId);

        let query = { conversationId };

        if (cursorStr) {
            try {
                const decoded = JSON.parse(Buffer.from(cursorStr, 'base64').toString('utf8'));
                if (decoded.createdAt && decoded.id) {
                    query.$or = [
                        { createdAt: { $lt: new Date(decoded.createdAt) } },
                        { createdAt: new Date(decoded.createdAt), _id: { $lt: decoded.id } }
                    ];
                }
            } catch (e) {
                // invalid cursor, ignore
            }
        }

        const fetchLimit = limit + 1;
        const messages = await Message.find(query)
            .sort({ createdAt: -1, _id: -1 })
            .limit(fetchLimit)
            .lean();

        const hasMore = messages.length > limit;
        const resultMessages = hasMore ? messages.slice(0, limit) : messages;
        
        let nextCursor = null;
        if (hasMore && resultMessages.length > 0) {
            const lastMsg = resultMessages[resultMessages.length - 1];
            nextCursor = Buffer.from(JSON.stringify({
                createdAt: lastMsg.createdAt,
                id: lastMsg._id
            })).toString('base64');
        }

        // Return them sorted oldest to newest for frontend easier display if needed, but for now we leave as newest first like typical cursors, then frontend reverses or handles it.
        // Actually, for messages, we typically want oldest at the top of the chat window, so reverse it
        resultMessages.reverse();

        return { messages: resultMessages, nextCursor, hasMore };
    },

    createMessage: async (conversationId, senderId, content, clientMessageId) => {
        const conversation = await chatService.getConversationById(conversationId, senderId);

        if (clientMessageId) {
            const existing = await Message.findOne({ clientMessageId, sender: senderId }).lean();
            if (existing) {
                return { message: existing, isDuplicate: true, conversation };
            }
        }

        const message = await Message.create({
            conversationId,
            sender: senderId,
            content,
            readBy: [senderId],
            status: 'sent',
            clientMessageId
        });

        conversation.lastMessage = {
            content,
            sender: senderId,
            createdAt: message.createdAt
        };

        conversation.participants.forEach(p => {
            const pid = p._id ? p._id.toString() : p.toString();
            if (pid !== senderId.toString()) {
                const currentCount = conversation.unreadCount.get(pid) || 0;
                conversation.unreadCount.set(pid, currentCount + 1);
            }
        });

        await conversation.save();
        return { message, isDuplicate: false, conversation };
    },

    markMessagesAsRead: async (conversationId, userId) => {
        const conversation = await chatService.getConversationById(conversationId, userId);

        const unreadMessages = await Message.find({
            conversationId,
            sender: { $ne: userId },
            readBy: { $ne: userId }
        }).select('_id').lean();

        const messageIds = unreadMessages.map(m => m._id);

        if (messageIds.length > 0) {
            await Message.updateMany(
                { _id: { $in: messageIds } },
                { 
                    $addToSet: { readBy: userId },
                    $set: { status: 'read' }
                }
            );
        }

        conversation.unreadCount.set(userId.toString(), 0);
        await conversation.save();

        return messageIds;
    }
};

module.exports = chatService;
