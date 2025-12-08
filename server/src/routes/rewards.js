import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import {
  getRewardsContent,
  getRewardsList,
  createRewardItem,
  updateRewardItem,
  deleteRewardItem
} from '../controllers/rewardsController.js';

const router = express.Router();

// Public routes for getting rewards content (no auth required)
router.get('/content', getRewardsContent);
router.get('/rewards', getRewardsList);

// Protected routes for CRUD operations (require authentication)
router.post('/rewards', authenticateJWT, createRewardItem);
router.put('/rewards/:id', authenticateJWT, updateRewardItem);
router.delete('/rewards/:id', authenticateJWT, deleteRewardItem);

export default router;
