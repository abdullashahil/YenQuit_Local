import { query } from '../db/index.js';

// Very simple content mapping for demo; in production, source from CMS/config tables
const ADVICE_BY_DEPENDENCE = [
  { max: 2, items: ['Low dependence: reinforce quitting now', 'Consider setting a quit date within a week'] },
  { max: 5, items: ['Moderate dependence: consider NRT and coping strategies', 'Practice stimulus control and identify triggers'] },
  { max: 10, items: ['High dependence: combine counseling + pharmacotherapy', 'Arrange close follow-up and support'] },
];

export function adviceFromScore(score) {
  for (const band of ADVICE_BY_DEPENDENCE) {
    if (score <= band.max) return band.items;
  }
  return ADVICE_BY_DEPENDENCE[ADVICE_BY_DEPENDENCE.length - 1].items;
}

export async function latestFagerstromScore(userId) {
  const res = await query(
    'SELECT score FROM fagerstrom_assessments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
    [userId]
  );
  return res.rows[0]?.score ?? null;
}
