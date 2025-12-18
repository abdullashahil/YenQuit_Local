import express from 'express';
import UserInviteController from '../controllers/UserInviteController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// POST /api/user-invites/communities/:id - Send invites to users
router.post('/communities/:id', UserInviteController.sendInvites);

// GET /api/user-invites/pending - Get pending invites for current user
router.get('/pending', UserInviteController.getPendingInvites);

// POST /api/user-invites/:id/accept - Accept invite
router.post('/:id/accept', UserInviteController.acceptInvite);

// POST /api/user-invites/:id/reject - Reject invite
router.post('/:id/reject', UserInviteController.rejectInvite);

// DELETE /api/user-invites/:id - Cancel invite (by inviter)
router.delete('/:id', UserInviteController.cancelInvite);

// GET /api/user-invites/communities/:id - Get community invites
router.get('/communities/:id', UserInviteController.getCommunityInvites);

export default router;
