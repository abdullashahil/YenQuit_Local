import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import {
  getFiveAQuestionsByStep,
  getFiveAQuestion,
  createFiveAQuestionController,
  updateFiveAQuestionController,
  softDeleteFiveAQuestionController,
  reactivateFiveAQuestionController,
} from '../controllers/fiveAAdminController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// Get questions for a specific step
router.get('/questions', getFiveAQuestionsByStep);

// Get a specific question by ID
router.get('/questions/:id', getFiveAQuestion);

// Create a new question (admin only)
router.post('/questions', requireAdmin, createFiveAQuestionController);

// Update an existing question (admin only)
router.put('/questions/:id', requireAdmin, updateFiveAQuestionController);

// Soft delete (deactivate) a question (admin only)
router.patch('/questions/:id/deactivate', requireAdmin, softDeleteFiveAQuestionController);

// Reactivate a question (admin only)
router.patch('/questions/:id/activate', requireAdmin, reactivateFiveAQuestionController);

// Permanently delete a question (admin only)
// router.delete('/questions/:id', requireAdmin, deleteFiveAQuestionController);

// Reorder questions (admin only)
// router.patch('/questions/reorder', requireAdmin, reorderFiveAQuestionsController);

export default router;
