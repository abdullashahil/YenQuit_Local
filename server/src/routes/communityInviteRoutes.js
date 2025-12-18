import express from 'express';
import CommunityInviteController from '../controllers/communityInviteController.js';

const router = express.Router();

// Get all community invites
router.get('/', CommunityInviteController.getAllInvites);

// Get invite by code
router.get('/:code', CommunityInviteController.getInviteByCode);

// Create new invite
router.post('/', CommunityInviteController.createInvite);

// Update invite
router.put('/:id', CommunityInviteController.updateInvite);

// Delete invite
router.delete('/:id', CommunityInviteController.deleteInvite);

export default router;
