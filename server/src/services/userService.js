import { query } from '../db/index.js';

export async function findUserByEmail(email) {
  const res = await query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
}

export async function findUserById(id) {
  const res = await query('SELECT * FROM users WHERE id = $1', [id]);
  return res.rows[0];
}

export async function updateOnboardingStep(userId, step) {
  const completed = step >= 5;
  const res = await query(
    'UPDATE users SET onboarding_step = $2, onboarding_completed = $3, updated_at = NOW() WHERE id = $1 RETURNING id, email, role, onboarding_step, onboarding_completed',
    [userId, step, completed]
  );
  return res.rows[0];
}
