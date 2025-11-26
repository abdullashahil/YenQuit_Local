import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import {
  getProgress,
  createOrUpdateLog,
  updateLog,
  deleteLog,
  getLogs,
  updateQuitDate
} from '../controllers/quitTrackerController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// GET /api/quit-tracker/progress - Get user's quit tracker progress
router.get('/progress', getProgress);

// POST /api/quit-tracker/log - Create or update daily log
router.post('/log', createOrUpdateLog);

// PUT /api/quit-tracker/log/:id - Update a specific log
router.put('/log/:id', updateLog);

// DELETE /api/quit-tracker/log/:id - Delete a specific log
router.delete('/log/:id', deleteLog);

// GET /api/quit-tracker/logs - Get logs with pagination
router.get('/logs', getLogs);

// PUT /api/quit-tracker/quit-date - Update quit date
router.put('/quit-date', updateQuitDate);

export default router;
