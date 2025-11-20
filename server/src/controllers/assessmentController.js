import { computeFagerstromScore, createFagerstrom, getLatestFagerstrom, createReadiness } from '../services/assessmentService.js';

export async function postFagerstrom(req, res, next) {
  try {
    const userId = req.user?.userId;
    const { answers } = req.body;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!answers || typeof answers !== 'object') return res.status(400).json({ error: 'answers is required' });
    const score = computeFagerstromScore(answers);
    const record = await createFagerstrom(userId, answers, score);
    res.status(201).json({ assessment: record });
  } catch (err) {
    next(err);
  }
}

export async function getLatestFagerstromHandler(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const record = await getLatestFagerstrom(userId);
    res.json({ assessment: record });
  } catch (err) {
    next(err);
  }
}

export async function postReadiness(req, res, next) {
  try {
    const userId = req.user?.userId;
    const { readinessScore, notes } = req.body;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const scoreNum = Number(readinessScore);
    if (Number.isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      return res.status(400).json({ error: 'readinessScore must be between 0 and 10' });
    }
    const record = await createReadiness(userId, scoreNum, notes);
    res.status(201).json({ assessment: record });
  } catch (err) {
    next(err);
  }
}
