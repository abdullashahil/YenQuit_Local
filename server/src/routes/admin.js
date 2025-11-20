import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { putConfig, getConfigByKey, putContent, getContentBySlug, getOverview } from '../controllers/adminController.js';

const router = express.Router();

router.use(authenticateJWT, requireRole('admin', 'coadmin'));

// Configs
router.put('/configs', putConfig);
router.get('/configs/:key', getConfigByKey);

// Content
router.put('/content', putContent);
router.get('/content/:slug', getContentBySlug);

// Analytics overview
router.get('/analytics/overview', getOverview);

export default router;
