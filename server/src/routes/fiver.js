import express from 'express';
import {
  getRelevanceOptions,
  saveUser5RSelections,
  getUser5RSelections,
  getUser5RProgress
} from '../controllers/fiverController.js';

const router = express.Router();

// GET /api/fiver/relevance-options - Get all relevance options
router.get('/relevance-options', getRelevanceOptions);

// POST /api/fiver/selections - Save user 5R selections (generic)
router.post('/selections', saveUser5RSelections);

// GET /api/fiver/selections/:userId/:step - Get user 5R selections for a specific step
router.get('/selections/:userId/:step', getUser5RSelections);

// GET /api/fiver/progress/:userId - Get user 5R progress
router.get('/progress/:userId', getUser5RProgress);

export default router;
