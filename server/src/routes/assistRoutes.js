import express from 'express';
import * as assistController from '../controllers/assistController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Public/User Routes (require auth)
router.get('/strategies', authenticateJWT, assistController.getCopingStrategies);
router.get('/notification-templates', authenticateJWT, assistController.getNotificationTemplates);

// User-specific routes
router.get('/users/me/assist', authenticateJWT, assistController.getUserAssistPlan);
router.post('/users/me/assist', authenticateJWT, assistController.createOrUpdateUserAssistPlan);
router.post('/users/me/assist/complete', authenticateJWT, assistController.completeAssistPlan);

router.get('/users/me/notifications', authenticateJWT, assistController.getUserNotifications);
router.post('/users/me/notifications', authenticateJWT, assistController.upsertUserNotifications);

// Admin Routes
router.post('/admin/assist/strategies', authenticateJWT, assistController.createCopingStrategy);
router.put('/admin/assist/strategies/:id', authenticateJWT, assistController.updateCopingStrategy);
router.delete('/admin/assist/strategies/:id', authenticateJWT, assistController.softDeleteCopingStrategy);

router.post('/admin/assist/notification-templates', authenticateJWT, assistController.createNotificationTemplate);
router.put('/admin/assist/notification-templates/:id', authenticateJWT, assistController.updateNotificationTemplate);
router.delete('/admin/assist/notification-templates/:id', authenticateJWT, assistController.softDeleteNotificationTemplate);

router.get('/admin/assist/history', authenticateJWT, assistController.getAssistHistory);

export default router;
