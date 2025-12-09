import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import { getUserLearningProgress, addContentToProgress, getLearningProgressCount } from '../controllers/learningProgressController.js';

const router = express.Router();

// Get user's learning progress (last 3 visited items)
router.get('/', authenticateJWT, getUserLearningProgress);

// Get user's learning progress count for milestone tracking
router.get('/count', authenticateJWT, getLearningProgressCount);

// Add content to user's learning progress
router.post('/', authenticateJWT, addContentToProgress);

export default router;
