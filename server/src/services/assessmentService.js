import { query } from '../db/index.js';

export async function createFagerstrom(userId, answers, score) {
  const res = await query(
    'INSERT INTO fagerstrom_assessments (user_id, answers, score) VALUES ($1, $2, $3) RETURNING *',
    [userId, answers, score]
  );
  return res.rows[0];
}

export async function getLatestFagerstrom(userId) {
  const res = await query(
    'SELECT * FROM fagerstrom_assessments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
    [userId]
  );
  return res.rows[0] || null;
}

export async function createReadiness(userId, readinessScore, notes) {
  const res = await query(
    'INSERT INTO readiness_assessments (user_id, readiness_score, notes) VALUES ($1, $2, $3) RETURNING *',
    [userId, readinessScore, notes || null]
  );
  return res.rows[0];
}

export function computeFagerstromScore(answers) {
  // Expecting an object with numeric values per question; sum defensively
  if (!answers || typeof answers !== 'object') return 0;
  return Object.values(answers).reduce((acc, v) => acc + (Number(v) || 0), 0);
}
