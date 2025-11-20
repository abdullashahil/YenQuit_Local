import { query } from '../db/index.js';

export async function getPlanByUserId(userId) {
  const res = await query('SELECT * FROM quit_plans WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1', [userId]);
  return res.rows[0] || null;
}

export async function upsertPlan(userId, { quitDate, triggers, strategies, supportContacts }) {
  const existing = await getPlanByUserId(userId);
  if (existing) {
    const res = await query(
      `UPDATE quit_plans
       SET quit_date = $1,
           triggers = $2,
           strategies = $3,
           support_contacts = $4,
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [quitDate || null, triggers || null, strategies || null, supportContacts || {}, existing.id]
    );
    return res.rows[0];
  }
  const res = await query(
    `INSERT INTO quit_plans (user_id, quit_date, triggers, strategies, support_contacts)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, quitDate || null, triggers || null, strategies || null, supportContacts || {}]
  );
  return res.rows[0];
}
