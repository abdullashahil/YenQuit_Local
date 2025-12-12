import express from 'express';
import CommunityController from '../controllers/communityController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// GET /api/communities - Get all communities
router.get('/', CommunityController.getCommunities);

// GET /api/communities/:id - Get community by ID
router.get('/:id', CommunityController.getCommunity);

// POST /api/communities - Create new community
router.post('/', CommunityController.createCommunity);

// POST /api/communities/:id/join - Join community
router.post('/:id/join', CommunityController.joinCommunity);

// POST /api/communities/:id/leave - Leave community
router.post('/:id/leave', CommunityController.leaveCommunity);

// GET /api/communities/:id/members - Get community members
router.get('/:id/members', CommunityController.getCommunityMembers);

// PUT /api/communities/:id - Update community
router.put('/:id', CommunityController.updateCommunity);

// DELETE /api/communities/:id - Delete community
router.delete('/:id', CommunityController.deleteCommunity);

export default router;
