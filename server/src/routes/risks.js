import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import {
  getRisksContent,
  getHealthRisksList,
  createHealthRiskItem,
  updateHealthRiskItem,
  deleteHealthRiskItem,
  getWarningBannersList,
  createWarningBannerItem,
  updateWarningBannerItem,
  deleteWarningBannerItem
} from '../controllers/risksController.js';

const router = express.Router();

// Public routes for getting risks content (no auth required)
router.get('/content', getRisksContent);
router.get('/health-risks', getHealthRisksList);
router.get('/warning-banners', getWarningBannersList);

// Protected routes for CRUD operations (require authentication)
router.post('/health-risks', authenticateJWT, createHealthRiskItem);
router.put('/health-risks/:id', authenticateJWT, updateHealthRiskItem);
router.delete('/health-risks/:id', authenticateJWT, deleteHealthRiskItem);

router.post('/warning-banners', authenticateJWT, createWarningBannerItem);
router.put('/warning-banners/:id', authenticateJWT, updateWarningBannerItem);
router.delete('/warning-banners/:id', authenticateJWT, deleteWarningBannerItem);

export default router;
