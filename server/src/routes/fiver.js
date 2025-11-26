import express from 'express';
import {
  getRelevanceOptions,
  saveUserRelevanceSelections,
  getUserRelevanceSelections,
  getUser5RProgress
} from '../controllers/fiverController.js';

const router = express.Router();

// GET /api/fiver/relevance-options - Get all relevance options
router.get('/relevance-options', getRelevanceOptions);

// POST /api/fiver/relevance-selections - Save user relevance selections
router.post('/relevance-selections', saveUserRelevanceSelections);

// GET /api/fiver/relevance-selections/:userId - Get user relevance selections
router.get('/relevance-selections/:userId', getUserRelevanceSelections);

// GET /api/fiver/progress/:userId - Get user 5R progress
router.get('/progress/:userId', getUser5RProgress);

export default router;
