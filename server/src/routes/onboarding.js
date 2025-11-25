import express from 'express';
import * as onboardingController from '../controllers/onboardingController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.patch('/progress', authenticateJWT, onboardingController.updateProgress);

export default router;
