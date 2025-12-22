import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import {
    getAssessmentQuestionsController,
    getAssessmentQuestionController,
    createAssessmentQuestionController,
    updateAssessmentQuestionController,
    softDeleteAssessmentQuestionController,
    deleteAssessmentQuestionController
} from '../controllers/assessmentController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// Get questions with filtering (supports category, step, tobacco_category)
router.get('/questions', getAssessmentQuestionsController);

// Get a specific question by ID
router.get('/questions/:id', getAssessmentQuestionController);

// Create a new question (admin only)
router.post('/questions', requireAdmin, createAssessmentQuestionController);

// Update an existing question (admin only)
router.put('/questions/:id', requireAdmin, updateAssessmentQuestionController);

// Soft delete (deactivate) a question (admin only)
router.put('/questions/:id/soft-delete', requireAdmin, softDeleteAssessmentQuestionController);

// Permanently delete a question (admin only)
router.delete('/questions/:id', requireAdmin, deleteAssessmentQuestionController);

export default router;
