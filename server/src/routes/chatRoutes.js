import express from 'express';
import ChatController from '../controllers/chatController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// GET /api/chat/:communityId/messages - Get messages for a community
router.get('/:communityId/messages', ChatController.getMessages);

// GET /api/chat/:communityId/messages/latest - Get latest messages for a community
router.get('/:communityId/messages/latest', ChatController.getLatestMessages);

// POST /api/chat/:communityId/messages - Send a message
router.post('/:communityId/messages', ChatController.sendMessage);

// PUT /api/chat/messages/:messageId - Edit a message
router.put('/messages/:messageId', ChatController.editMessage);

// DELETE /api/chat/messages/:messageId - Delete a message
router.delete('/messages/:messageId', ChatController.deleteMessage);

// POST /api/chat/messages/:messageId/reactions - Add reaction to message
router.post('/messages/:messageId/reactions', ChatController.addReaction);

// DELETE /api/chat/messages/:messageId/reactions - Remove reaction from message
router.delete('/messages/:messageId/reactions', ChatController.removeReaction);

// GET /api/chat/messages/:messageId/reactions - Get reactions for a message
router.get('/messages/:messageId/reactions', ChatController.getReactions);

// GET /api/chat/:communityId/online-users - Get online users for a community
router.get('/:communityId/online-users', ChatController.getOnlineUsers);

export default router;
