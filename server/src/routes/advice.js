import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import { getAdvice } from '../controllers/adviceController.js';

const router = express.Router();

router.use(authenticateJWT);
router.get('/me', getAdvice);

export default router;
