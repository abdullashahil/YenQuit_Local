import express from 'express';
import * as profileController from '../controllers/profileController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', authenticateJWT, profileController.getMe);
router.put('/me/profile', authenticateJWT, profileController.updateMyProfile);

export default router;
