import { query } from '../db/index.js';

// Relevance
export async function createRelevance(userId, goals = [], notes = null) {
  const res = await query(
    'INSERT INTO r_relevance (user_id, goals, notes) VALUES ($1, $2, $3) RETURNING *',
    [userId, goals && goals.length ? goals : null, notes]
  );
  return res.rows[0];
}
export async function latestRelevance(userId) {
  const res = await query('SELECT * FROM r_relevance WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]);
  return res.rows[0] || null;
}

// Risks
export async function createRisks(userId, risks = [], notes = null) {
  const res = await query(
    'INSERT INTO r_risks (user_id, risks, notes) VALUES ($1, $2, $3) RETURNING *',
    [userId, risks && risks.length ? risks : null, notes]
  );
  return res.rows[0];
}
export async function latestRisks(userId) {
  const res = await query('SELECT * FROM r_risks WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]);
  return res.rows[0] || null;
}

// Rewards
export async function createRewards(userId, rewards = [], estimatedMonthlySavings = null, notes = null) {
  const res = await query(
    'INSERT INTO r_rewards (user_id, rewards, estimated_monthly_savings, notes) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, rewards && rewards.length ? rewards : null, estimatedMonthlySavings, notes]
  );
  return res.rows[0];
}
export async function latestRewards(userId) {
  const res = await query('SELECT * FROM r_rewards WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]);
  return res.rows[0] || null;
}

// Roadblocks
export async function createRoadblocks(userId, barriers = [], strategies = [], notes = null) {
  const res = await query(
    'INSERT INTO r_roadblocks (user_id, barriers, strategies, notes) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, barriers && barriers.length ? barriers : null, strategies && strategies.length ? strategies : null, notes]
  );
  return res.rows[0];
}
export async function latestRoadblocks(userId) {
  const res = await query('SELECT * FROM r_roadblocks WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]);
  return res.rows[0] || null;
}

// Repetition
export async function createRepetition(userId, schedule, active = true) {
  const res = await query(
    'INSERT INTO r_repetition (user_id, schedule, active) VALUES ($1, $2, $3) RETURNING *',
    [userId, schedule, active]
  );
  return res.rows[0];
}
export async function listRepetition(userId) {
  const res = await query('SELECT * FROM r_repetition WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return res.rows;
}
