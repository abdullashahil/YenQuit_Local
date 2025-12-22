import { query } from '../db/index.js';

class UserProfileModel {
  // Get user profile by user ID (now using users table directly)
  static async findByUserId(userId) {
    const sql = `
      SELECT 
        id,
        full_name,
        phone,
        bio,
        age,
        gender,
        tobacco_type,
        fagerstrom_score,
        addiction_level,
        join_date,
        updated_at
      FROM users 
      WHERE id = $1
    `;

    try {
      const result = await query(sql, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user profile:', error);
      return null;
    }
  }

  // Create or update user profile (now updates users table directly)
  static async upsert(userId, profileData) {
    const { full_name, phone, bio, age, gender, tobacco_type, fagerstrom_score, addiction_level, join_date } = profileData;

    const sql = `
      UPDATE users 
      SET 
        full_name = COALESCE($2, full_name),
        phone = COALESCE($3, phone),
        bio = COALESCE($4, bio),
        age = COALESCE($5, age),
        gender = COALESCE($6, gender),
        tobacco_type = COALESCE($7, tobacco_type),
        fagerstrom_score = COALESCE($8, fagerstrom_score),
        addiction_level = COALESCE($9, addiction_level),
        join_date = COALESCE($10, join_date),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING 
        id,
        full_name,
        phone,
        bio,
        age,
        gender,
        tobacco_type,
        fagerstrom_score,
        addiction_level,
        join_date,
        updated_at
    `;

    try {
      const result = await query(sql, [userId, full_name, phone, bio, age, gender, tobacco_type, fagerstrom_score, addiction_level, join_date]);
      return result.rows[0];
    } catch (error) {
      console.error('Error upserting user profile:', error);
      throw error;
    }
  }

  // Get user profile with user info (now using users table directly)
  static async getProfileWithUser(userId) {
    const sql = `
      SELECT 
        id,
        email,
        role,
        status,
        created_at,
        full_name,
        phone,
        bio,
        age,
        gender,
        tobacco_type,
        fagerstrom_score,
        addiction_level,
        join_date,
        updated_at
      FROM users
      WHERE id = $1
    `;

    try {
      const result = await query(sql, [userId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting profile with user:', error);
      throw error;
    }
  }
}

export default UserProfileModel;
