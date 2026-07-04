const express = require('express');
const router = express.Router();
const conversationController = require('../controller/conversation.controller');
const messageController = require('../controller/message.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', conversationController.createOrGetConversation);
router.get('/', conversationController.getConversations);
router.get('/:id/messages', messageController.getMessages);

module.exports = router;
