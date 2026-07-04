const express = require('express');
const router = express.Router();
const messageController = require('../controller/message.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', messageController.sendMessage);
router.patch('/:conversationId/read', messageController.markAsRead);

module.exports = router;
