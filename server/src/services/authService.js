import { getClient } from '../db/index.js';
import bcrypt from 'bcrypt';

export async function registerUserWithProfile({ email, password, role, profile }) {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    const password_hash = await bcrypt.hash(password, 10);

    // Add logic to handle first/last name if only full_name provided or vice versa
    let fullName = profile.full_name;
    let firstName = profile.first_name;
    let lastName = profile.last_name;

    if (!fullName && firstName && lastName) {
      fullName = `${firstName} ${lastName}`.trim();
    }

    const userInsertText = `
      INSERT INTO users (
        email, password_hash, role, onboarding_step, onboarding_completed,
        full_name, first_name, last_name, phone, age, gender, tobacco_type,
        profile_metadata
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
      RETURNING 
        id, email, role, onboarding_step, onboarding_completed, created_at, updated_at,
        full_name, first_name, last_name, phone, age, gender, tobacco_type, profile_metadata
    `;

    const userRes = await client.query(userInsertText, [
      email,
      password_hash,
      role || 'user',
      0,
      false,
      fullName || null,
      firstName || null,
      lastName || null,
      profile.phone || null,
      profile.age || null,
      profile.gender || null,
      profile.tobacco_type || null,
      profile.metadata || {}
    ]);

    const user = userRes.rows[0];
    await client.query('COMMIT');

    // Return structured object assuming consumer expects "profile" property mostly as convenience
    // or we flatten it.
    // For backward compatibility with controllers that might destructure { user, profile }
    // we can return the user object as 'profile' too, or just clean user object.

    return { user, profile: user };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
