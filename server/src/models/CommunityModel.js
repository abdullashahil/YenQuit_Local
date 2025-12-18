import { query } from '../db/index.js';

class CommunityModel {
  // Create a new community
  static async create(communityData) {
    const { name, description, avatar_url, created_by, is_private = false } = communityData;

    const sql = `
      INSERT INTO communities (name, description, avatar_url, created_by, is_private)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    try {
      const result = await query(sql, [name, description, avatar_url, created_by, is_private]);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating community:', error);
      throw error;
    }
  }

  // Get all communities with member count and online count
  static async findAll(userId = null) {
    const sql = `
      SELECT 
        c.*,
        cm.role as user_role,
        COALESCE(cm.unread_count, 0) as unread_count,
        (SELECT COUNT(*) FROM community_members WHERE community_id = c.id) as member_count,
        (SELECT COUNT(*) FROM chat_messages WHERE community_id = c.id) as message_count,
        (SELECT created_at FROM chat_messages WHERE community_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time
      FROM communities c
      LEFT JOIN community_members cm ON c.id = cm.community_id AND cm.user_id = $1
      WHERE c.is_private = false OR cm.user_id IS NOT NULL
      ORDER BY c.updated_at DESC
    `;

    try {
      const result = await query(sql, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching communities:', error);
      throw error;
    }
  }

  // Get community by ID with member details
  static async findById(communityId, userId = null) {
    const sql = `
      SELECT 
        c.*,
        cm.role as user_role,
        (SELECT COUNT(*) FROM community_members WHERE community_id = c.id) as member_count
      FROM communities c
      LEFT JOIN community_members cm ON c.id = cm.community_id AND cm.user_id = $2
      WHERE c.id = $1
    `;

    try {
      const result = await query(sql, [communityId, userId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching community:', error);
      throw error;
    }
  }

  // Join a community
  static async joinCommunity(communityId, userId, role = 'member') {
    const sql = `
      INSERT INTO community_members (community_id, user_id, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (community_id, user_id) DO NOTHING
      RETURNING *
    `;

    try {
      const result = await query(sql, [communityId, userId, role]);
      return result.rows[0];
    } catch (error) {
      console.error('Error joining community:', error);
      throw error;
    }
  }

  // Leave a community
  static async leaveCommunity(communityId, userId) {
    const sql = `
      DELETE FROM community_members
      WHERE community_id = $1 AND user_id = $2
      RETURNING *
    `;

    try {
      const result = await query(sql, [communityId, userId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error leaving community:', error);
      throw error;
    }
  }

  // Get community members
  static async getMembers(communityId) {
    const sql = `
      SELECT 
        cm.*,
        u.email,
        u.role,
        u.created_at,
        u.full_name,
        u.avatar_url
      FROM community_members cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.community_id = $1
      ORDER BY cm.joined_at ASC
    `;

    try {
      const result = await query(sql, [communityId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching community members:', error);
      throw error;
    }
  }

  // Update community
  static async update(communityId, updateData) {
    const { name, description, avatar_url } = updateData;

    const sql = `
      UPDATE communities
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          avatar_url = COALESCE($3, avatar_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;

    try {
      const result = await query(sql, [name, description, avatar_url, communityId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating community:', error);
      throw error;
    }
  }

  // Delete community
  static async delete(communityId) {
    const sql = `DELETE FROM communities WHERE id = $1 RETURNING *`;

    try {
      const result = await query(sql, [communityId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting community:', error);
      throw error;
    }
  }

  // Check if user is member
  static async isMember(communityId, userId) {
    const sql = `
      SELECT role FROM community_members
      WHERE community_id = $1 AND user_id = $2
    `;

    try {
      const result = await query(sql, [communityId, userId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error checking membership:', error);
      throw error;
    }
  }

  // Increment unread count for all members except sender
  static async incrementUnreadCount(communityId, excludeUserId) {
    const sql = `
      UPDATE community_members
      SET unread_count = unread_count + 1
      WHERE community_id = $1 AND user_id != $2
    `;

    try {
      await query(sql, [communityId, excludeUserId]);
    } catch (error) {
      console.error('Error incrementing unread count:', error);
      throw error;
    }
  }

  // Reset unread count for a user in a community
  static async resetUnreadCount(communityId, userId) {
    const sql = `
      UPDATE community_members
      SET unread_count = 0, last_read_at = CURRENT_TIMESTAMP
      WHERE community_id = $1 AND user_id = $2
    `;

    try {
      await query(sql, [communityId, userId]);
    } catch (error) {
      console.error('Error resetting unread count:', error);
      throw error;
    }
  }
}

export default CommunityModel;
