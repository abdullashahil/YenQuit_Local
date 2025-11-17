import { getClient } from '../db/index.js';
import bcrypt from 'bcrypt';

export async function registerUserWithProfile({ email, password, role, profile }) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const password_hash = await bcrypt.hash(password, 10);
    const userInsertText = `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at, updated_at`;
    const userRes = await client.query(userInsertText, [email, password_hash, role || 'user']);
    const user = userRes.rows[0];
    const profileInsertText = `INSERT INTO profiles (user_id, full_name, first_name, last_name, phone, age, gender, tobacco_type, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
    const profileRes = await client.query(profileInsertText, [
      user.id,
      profile.full_name || null,
      profile.first_name || null,
      profile.last_name || null,
      profile.phone || null,
      profile.age || null,
      profile.gender || null,
      profile.tobacco_type || null,
      profile.metadata || {},
    ]);
    await client.query('COMMIT');
    delete user.password_hash;
    return { user, profile: profileRes.rows[0] };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
