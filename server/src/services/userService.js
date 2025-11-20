import { query } from '../db/index.js';

export async function findUserByEmail(email) {
  const res = await query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
}

export async function updateLastLogin(userId) {
  await query('UPDATE users SET last_login = NOW() WHERE id = $1', [userId]);
}
