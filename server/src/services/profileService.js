import { query } from '../db/index.js';

export async function getUserById(userId) {
  const res = await query('SELECT id, email, role, created_at, updated_at FROM users WHERE id = $1', [userId]);
  return res.rows[0];
}

export async function getProfileByUserId(userId) {
  const res = await query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
  return res.rows[0];
}

export async function updateProfileByUserId(userId, profile) {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key of Object.keys(profile)) {
    fields.push(`${key} = $${idx}`);
    values.push(profile[key]);
    idx++;
  }
  if (!fields.length) return null;
  values.push(userId);
  const sql = `UPDATE profiles SET ${fields.join(', ')}, updated_at = NOW() WHERE user_id = $${idx} RETURNING *`;
  const res = await query(sql, values);
  return res.rows[0];
}
