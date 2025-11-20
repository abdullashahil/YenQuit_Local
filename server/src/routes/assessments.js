import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import { postFagerstrom, getLatestFagerstromHandler, postReadiness } from '../controllers/assessmentController.js';

const router = express.Router();

router.use(authenticateJWT);

// Fagerström Test for Nicotine Dependence
router.post('/fagerstrom', postFagerstrom);
router.get('/fagerstrom/latest', getLatestFagerstromHandler);

// Readiness assessment (0-10 scale)
router.post('/readiness', postReadiness);

export default router;
