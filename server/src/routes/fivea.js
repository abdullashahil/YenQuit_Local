import express from 'express';
import * as fiveaController from '../controllers/fiveaController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// User/auth routes (require auth)
router.get('/questions/:step', authenticateJWT, fiveaController.getQuestionsByStep);
router.post('/ask/submit', authenticateJWT, fiveaController.submitAsk);
router.get('/advise', authenticateJWT, fiveaController.getAdvise);
router.post('/advise/complete', authenticateJWT, fiveaController.completeAdvise);
router.post('/answers', authenticateJWT, fiveaController.saveAnswers);
router.get('/answers/:step', authenticateJWT, fiveaController.getUserAnswers);
router.get('/answers', authenticateJWT, fiveaController.getAllUserAnswersForUser);

// Admin CRUD for questions
router.get('/admin/questions', authenticateJWT, fiveaController.getAllQuestions);
router.get('/admin/questions/:id', authenticateJWT, fiveaController.getQuestionById);
router.post('/admin/questions', authenticateJWT, fiveaController.createAdminQuestion);
router.put('/admin/questions/:id', authenticateJWT, fiveaController.updateAdminQuestion);
router.delete('/admin/questions/:id', authenticateJWT, fiveaController.softDeleteAdminQuestion);

// Admin view of all user answers
router.get('/admin/answers', authenticateJWT, fiveaController.getAllUserAnswers);

export default router;
