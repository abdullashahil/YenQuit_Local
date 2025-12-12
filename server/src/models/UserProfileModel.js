import { query } from '../db/index.js';

class UserProfileModel {
  // Get user profile by user ID
  static async findByUserId(userId) {
    const sql = `
      SELECT * FROM user_profiles 
      WHERE user_id = $1
    `;
    
    try {
      const result = await query(sql, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user profile:', error);
      return null;
    }
  }

  // Create or update user profile
  static async upsert(userId, profileData) {
    const { full_name, avatar_url, phone, bio } = profileData;
    
    const sql = `
      INSERT INTO user_profiles (user_id, full_name, avatar_url, phone, bio)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, user_profiles.avatar_url),
        phone = COALESCE(EXCLUDED.phone, user_profiles.phone),
        bio = COALESCE(EXCLUDED.bio, user_profiles.bio),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    
    try {
      const result = await query(sql, [userId, full_name, avatar_url, phone, bio]);
      return result.rows[0];
    } catch (error) {
      console.error('Error upserting user profile:', error);
      throw error;
    }
  }

  // Get user profile with user info
  static async getProfileWithUser(userId) {
    const sql = `
      SELECT 
        u.id,
        u.email,
        u.role,
        u.status,
        u.created_at,
        up.full_name,
        up.avatar_url,
        up.phone,
        up.bio,
        up.updated_at as profile_updated_at
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = $1
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
