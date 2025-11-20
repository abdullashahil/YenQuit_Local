import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import { getMyPlan, saveMyPlan } from '../controllers/quitPlanController.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/me', getMyPlan);
router.put('/me', saveMyPlan);

export default router;
