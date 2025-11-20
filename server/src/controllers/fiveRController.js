import {
  createRelevance,
  latestRelevance,
  createRisks,
  latestRisks,
  createRewards,
  latestRewards,
  createRoadblocks,
  latestRoadblocks,
  createRepetition,
  listRepetition,
} from '../services/fiveRService.js';

// Relevance
export async function postRelevance(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { goals, notes } = req.body || {};
    const record = await createRelevance(userId, goals || [], notes || null);
    res.status(201).json({ relevance: record });
  } catch (err) { next(err); }
}
export async function getRelevanceLatest(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const record = await latestRelevance(userId);
    res.json({ relevance: record });
  } catch (err) { next(err); }
}

// Risks
export async function postRisks(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { risks, notes } = req.body || {};
    const record = await createRisks(userId, risks || [], notes || null);
    res.status(201).json({ risks: record });
  } catch (err) { next(err); }
}
export async function getRisksLatest(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const record = await latestRisks(userId);
    res.json({ risks: record });
  } catch (err) { next(err); }
}

// Rewards
export async function postRewards(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { rewards, estimatedMonthlySavings, notes } = req.body || {};
    const record = await createRewards(userId, rewards || [], estimatedMonthlySavings ?? null, notes || null);
    res.status(201).json({ rewards: record });
  } catch (err) { next(err); }
}
export async function getRewardsLatest(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const record = await latestRewards(userId);
    res.json({ rewards: record });
  } catch (err) { next(err); }
}

// Roadblocks
export async function postRoadblocks(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { barriers, strategies, notes } = req.body || {};
    const record = await createRoadblocks(userId, barriers || [], strategies || [], notes || null);
    res.status(201).json({ roadblocks: record });
  } catch (err) { next(err); }
}
export async function getRoadblocksLatest(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const record = await latestRoadblocks(userId);
    res.json({ roadblocks: record });
  } catch (err) { next(err); }
}

// Repetition
export async function postRepetition(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { schedule, active } = req.body || {};
    if (!schedule) return res.status(400).json({ error: 'schedule is required' });
    const record = await createRepetition(userId, schedule, active !== undefined ? !!active : true);
    res.status(201).json({ repetition: record });
  } catch (err) { next(err); }
}
export async function getRepetitionList(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const rows = await listRepetition(userId);
    res.json({ repetition: rows });
  } catch (err) { next(err); }
}
