import express from 'express';
import * as fagerstromController from '../controllers/fagerstromController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Public or user routes (require auth)
router.get('/', authenticateJWT, fagerstromController.getFagerstromQuestions);

// Answer routes (must come before /:id)
router.get('/answers', authenticateJWT, fagerstromController.getFagerstromUserAnswers);
router.post('/answers', authenticateJWT, fagerstromController.saveFagerstromAnswers);

// Session history routes
router.get('/sessions/history', authenticateJWT, fagerstromController.getFagerstromSessionHistory);
router.get('/sessions/latest', authenticateJWT, fagerstromController.getLatestFagerstromSession);

// Question by ID (must come after /answers and /sessions)
router.get('/:id', authenticateJWT, fagerstromController.getFagerstromQuestionById);

// Admin CRUD
router.post('/', authenticateJWT, fagerstromController.createFagerstromQuestion);
router.put('/:id', authenticateJWT, fagerstromController.updateFagerstromQuestion);
router.delete('/:id', authenticateJWT, fagerstromController.softDeleteFagerstromQuestion);

export default router;

