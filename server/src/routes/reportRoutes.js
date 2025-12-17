import express from 'express';
// Assuming we have middleware to verify token, or admin status
// Since user is admin sidebar, we should protect it.
// I'll use the same auth middleware used in other routes, typically 'verifyToken' or similar.
// I'll check 'middleware/auth.js' or similar usage in 'routes/user.js'
import { authenticateJWT } from '../middleware/auth.js';
import * as reportController from '../controllers/reportController.js';

const router = express.Router();

// Apply auth middleware
router.use(authenticateJWT);

router.get('/user_details', reportController.getUserDetailsReport);
router.get('/smokeless_as', reportController.getSmokelessAsReport);
router.get('/smoked_as', reportController.getSmokedAsReport);
router.get('/smokeless_fagerstrom', reportController.getSmokelessFagerstromReport);
router.get('/smoked_fagerstrom', reportController.getSmokedFagerstromReport);
router.get('/pre_efficacy', reportController.getPreEfficacyReport);
router.get('/post_efficacy', reportController.getPostEfficacyReport);
router.get('/feedback', reportController.getFeedbackReport);
router.get('/rs', reportController.getRsReport);
router.get('/daily_logs', reportController.getDailyLogsReport);
router.get('/content_seekings', reportController.getContentSeekingsReport);

export default router;
