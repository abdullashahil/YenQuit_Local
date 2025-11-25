import express from 'express';
import * as fagerstromController from '../controllers/fagerstromController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Public or user routes (require auth)
router.get('/', authenticateJWT, fagerstromController.getFagerstromQuestions);
router.get('/:id', authenticateJWT, fagerstromController.getFagerstromQuestionById);

// Admin CRUD
router.post('/', authenticateJWT, fagerstromController.createFagerstromQuestion);
router.put('/:id', authenticateJWT, fagerstromController.updateFagerstromQuestion);
router.delete('/:id', authenticateJWT, fagerstromController.softDeleteFagerstromQuestion);

export default router;
