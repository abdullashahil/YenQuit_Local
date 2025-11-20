import { upsertPlan, getPlanByUserId } from '../services/quitPlanService.js';

export async function getMyPlan(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const plan = await getPlanByUserId(userId);
    res.json({ plan });
  } catch (err) {
    next(err);
  }
}

export async function saveMyPlan(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { quitDate, triggers, strategies, supportContacts } = req.body;
    const plan = await upsertPlan(userId, { quitDate, triggers, strategies, supportContacts });
    res.status(201).json({ plan });
  } catch (err) {
    next(err);
  }
}
