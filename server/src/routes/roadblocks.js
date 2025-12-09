import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import {
  getRoadblocksContent,
  getRoadblocksList,
  createRoadblockItem,
  updateRoadblockItem,
  deleteRoadblockItem
} from '../controllers/roadblocksController.js';

const router = express.Router();

// Public routes for getting roadblocks content (no auth required)
router.get('/content', getRoadblocksContent);
router.get('/roadblocks', getRoadblocksList);

// Protected routes for CRUD operations (require authentication)
router.post('/roadblocks', authenticateJWT, createRoadblockItem);
router.put('/roadblocks/:id', authenticateJWT, updateRoadblockItem);
router.delete('/roadblocks/:id', authenticateJWT, deleteRoadblockItem);

export default router;
