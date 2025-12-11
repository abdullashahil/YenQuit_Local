import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import {
  getProgress,
  createOrUpdateLog,
  updateLog,
  deleteLog,
  getLogs,
  updateQuitDate,
  getQuestionnaire,
  getUserQuestionnaireResponses,
  saveQuestionnaireResponses,
  savePostSelfEfficacyResponsesHandler,
  getSettings,
  updateSettings,
  getAllLogs,

  getAdminUserProgress,
  getFeedbackQuestions,
  saveUserFeedbackHandler
} from '../controllers/quitTrackerController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Progress endpoints
router.get('/progress', getProgress);
router.get('/admin/user/:userId/progress', getAdminUserProgress);

// Questionnaire endpoints
router.get('/questionnaire', getQuestionnaire);
router.get('/questionnaire/responses', getUserQuestionnaireResponses);
router.post('/questionnaire/responses', saveQuestionnaireResponses);
router.post('/post-self-efficacy/responses', savePostSelfEfficacyResponsesHandler);

// Feedback endpoints
router.get('/feedback/questions', getFeedbackQuestions);
router.post('/feedback', saveUserFeedbackHandler);

// Settings endpoints
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Log endpoints
router.post('/log', createOrUpdateLog);
router.put('/log/:id', updateLog);
router.delete('/log/:id', deleteLog);
router.get('/logs', getLogs);
router.get('/all-logs', getAllLogs); // New endpoint for modal view

// Quit date endpoint
router.put('/quit-date', updateQuitDate);

export default router;
