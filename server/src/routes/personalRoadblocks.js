import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import {
  getPersonalRoadblockQuestionsContent,
  getUserPersonalRoadblocksContent,
  saveUserPersonalRoadblockResponse,
  deleteUserPersonalRoadblockResponse,
  getPersonalRoadblockQuestionsList,
  createPersonalRoadblockQuestionItem,
  updatePersonalRoadblockQuestionItem,
  deletePersonalRoadblockQuestionItem
} from '../controllers/personalRoadblocksController.js';

const router = express.Router();

// Public routes for getting questions (no auth required)
router.get('/questions', getPersonalRoadblockQuestionsContent);

// Protected routes for user responses (require authentication)
router.get('/responses', authenticateJWT, getUserPersonalRoadblocksContent);
router.post('/responses', authenticateJWT, saveUserPersonalRoadblockResponse);
router.delete('/responses/:questionId', authenticateJWT, deleteUserPersonalRoadblockResponse);

// Protected routes for CRUD operations on questions (require authentication)
router.get('/questions-list', authenticateJWT, getPersonalRoadblockQuestionsList);
router.post('/questions', authenticateJWT, createPersonalRoadblockQuestionItem);
router.put('/questions/:id', authenticateJWT, updatePersonalRoadblockQuestionItem);
router.delete('/questions/:id', authenticateJWT, deletePersonalRoadblockQuestionItem);

export default router;
