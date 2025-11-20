import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import {
  postRelevance,
  getRelevanceLatest,
  postRisks,
  getRisksLatest,
  postRewards,
  getRewardsLatest,
  postRoadblocks,
  getRoadblocksLatest,
  postRepetition,
  getRepetitionList,
} from '../controllers/fiveRController.js';

const router = express.Router();

router.use(authenticateJWT);

router.post('/relevance', postRelevance);
router.get('/relevance/latest', getRelevanceLatest);

router.post('/risks', postRisks);
router.get('/risks/latest', getRisksLatest);

router.post('/rewards', postRewards);
router.get('/rewards/latest', getRewardsLatest);

router.post('/roadblocks', postRoadblocks);
router.get('/roadblocks/latest', getRoadblocksLatest);

router.post('/repetition', postRepetition);
router.get('/repetition', getRepetitionList);

export default router;
