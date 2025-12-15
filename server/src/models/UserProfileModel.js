import { query } from '../db/index.js';

class UserProfileModel {
  // Get user profile by user ID (now using users table directly)
  static async findByUserId(userId) {
    const sql = `
      SELECT 
        id,
        full_name,
        avatar_url,
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
    const { full_name, avatar_url, phone, bio, age, gender, tobacco_type, fagerstrom_score, addiction_level, join_date } = profileData;
    
    const sql = `
      UPDATE users 
      SET 
        full_name = COALESCE($2, full_name),
        avatar_url = COALESCE($3, avatar_url),
        phone = COALESCE($4, phone),
        bio = COALESCE($5, bio),
        age = COALESCE($6, age),
        gender = COALESCE($7, gender),
        tobacco_type = COALESCE($8, tobacco_type),
        fagerstrom_score = COALESCE($9, fagerstrom_score),
        addiction_level = COALESCE($10, addiction_level),
        join_date = COALESCE($11, join_date),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING 
        id,
        full_name,
        avatar_url,
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
      const result = await query(sql, [userId, full_name, avatar_url, phone, bio, age, gender, tobacco_type, fagerstrom_score, addiction_level, join_date]);
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
        avatar_url,
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
