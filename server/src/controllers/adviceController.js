import { adviceFromScore, latestFagerstromScore } from '../services/adviceService.js';

export async function getAdvice(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const score = await latestFagerstromScore(userId);
    if (score == null) return res.status(404).json({ error: 'No assessment found' });
    const items = adviceFromScore(score);
    res.json({ score, advice: items });
  } catch (err) {
    next(err);
  }
}
