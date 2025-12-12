import { query } from '../db/index.js';

class ChatMessageModel {
  // Create a new message
  static async create(messageData) {
    const { community_id, user_id, content, message_type = 'text', file_url = null, reply_to = null } = messageData;
    
    const sql = `
      INSERT INTO chat_messages (community_id, user_id, content, message_type, file_url, reply_to)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    try {
      const result = await query(sql, [community_id, user_id, content, message_type, file_url, reply_to]);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  // Get messages for a community with pagination
  static async getMessages(communityId, page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    
    const sql = `
      SELECT 
        cm.*,
        u.email,
        u.role,
        p.full_name,
        p.avatar_url,
        reply_message.content as reply_content,
        reply_user.email as reply_author_email,
        reply_profile.full_name as reply_author_name,
        reply_profile.avatar_url as reply_author_avatar
      FROM chat_messages cm
      JOIN users u ON cm.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN chat_messages reply_message ON cm.reply_to = reply_message.id
      LEFT JOIN users reply_user ON reply_message.user_id = reply_user.id
      LEFT JOIN profiles reply_profile ON reply_user.id = reply_profile.user_id
      WHERE cm.community_id = $1
      ORDER BY cm.created_at ASC
      LIMIT $2 OFFSET $3
    `;
    
    try {
      const result = await query(sql, [communityId, limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Get latest messages for a community
  static async getLatestMessages(communityId, limit = 50) {
    const sql = `
      SELECT 
        cm.*,
        u.email,
        u.role,
        p.full_name,
        p.avatar_url,
        reply_message.content as reply_content,
        reply_user.email as reply_author_email,
        reply_profile.full_name as reply_author_name,
        reply_profile.avatar_url as reply_author_avatar
      FROM chat_messages cm
      JOIN users u ON cm.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN chat_messages reply_message ON cm.reply_to = reply_message.id
      LEFT JOIN users reply_user ON reply_message.user_id = reply_user.id
      LEFT JOIN profiles reply_profile ON reply_user.id = reply_profile.user_id
      WHERE cm.community_id = $1
      ORDER BY cm.created_at DESC
      LIMIT $2
    `;
    
    try {
      const result = await query(sql, [communityId, limit]);
      return result.rows.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error fetching latest messages:', error);
      throw error;
    }
  }

  // Edit a message
  static async editMessage(messageId, userId, newContent) {
    const sql = `
      UPDATE chat_messages
      SET content = $1,
          is_edited = true,
          edited_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND user_id = $3
      RETURNING *
    `;
    
    try {
      const result = await query(sql, [newContent, messageId, userId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  // Delete a message
  static async deleteMessage(messageId, userId) {
    const sql = `
      DELETE FROM chat_messages
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    
    try {
      const result = await query(sql, [messageId, userId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Add reaction to message
  static async addReaction(messageId, userId, emoji) {
    const sql = `
      INSERT INTO message_reactions (message_id, user_id, emoji)
      VALUES ($1, $2, $3)
      ON CONFLICT (message_id, user_id, emoji) DO NOTHING
      RETURNING *
    `;
    
    try {
      const result = await query(sql, [messageId, userId, emoji]);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }

  // Remove reaction from message
  static async removeReaction(messageId, userId, emoji) {
    const sql = `
      DELETE FROM message_reactions
      WHERE message_id = $1 AND user_id = $2 AND emoji = $3
      RETURNING *
    `;
    
    try {
      const result = await query(sql, [messageId, userId, emoji]);
      return result.rows[0];
    } catch (error) {
      console.error('Error removing reaction:', error);
      throw error;
    }
  }

  // Get reactions for a message
  static async getReactions(messageId) {
    const sql = `
      SELECT 
        mr.*,
        u.email,
        u.role,
        p.full_name,
        p.avatar_url
      FROM message_reactions mr
      JOIN users u ON mr.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE mr.message_id = $1
      ORDER BY mr.created_at ASC
    `;
    
    try {
      const result = await query(sql, [messageId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching reactions:', error);
      throw error;
    }
  }

  // Track user as online in community
  static async trackOnlineUser(communityId, userId, socketId) {
    const sql = `
      INSERT INTO community_online_users (community_id, user_id, socket_id, last_seen)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (community_id, user_id) 
      DO UPDATE SET 
        socket_id = EXCLUDED.socket_id,
        last_seen = EXCLUDED.last_seen
      RETURNING *
    `;
    
    try {
      const result = await query(sql, [communityId, userId, socketId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error tracking online user:', error);
      throw error;
    }
  }

  // Remove user from online tracking
  static async removeOnlineUser(communityId, userId) {
    const sql = `
      DELETE FROM community_online_users
      WHERE community_id = $1 AND user_id = $2
      RETURNING *
    `;
    
    try {
      const result = await query(sql, [communityId, userId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error removing online user:', error);
      throw error;
    }
  }

  // Get online users for community
  static async getOnlineUsers(communityId) {
    const sql = `
      SELECT 
        cou.*,
        u.email,
        u.role,
        p.full_name,
        p.avatar_url
      FROM community_online_users cou
      JOIN users u ON cou.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE cou.community_id = $1
      ORDER BY cou.last_seen DESC
    `;
    
    try {
      const result = await query(sql, [communityId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching online users:', error);
      throw error;
    }
  }

  // Clean up stale online users (older than 5 minutes)
  static async cleanupStaleUsers() {
    const sql = `
      DELETE FROM community_online_users
      WHERE last_seen < CURRENT_TIMESTAMP - INTERVAL '5 minutes'
      RETURNING *
    `;
    
    try {
      const result = await query(sql);
      return result.rows;
    } catch (error) {
      console.error('Error cleaning up stale users:', error);
      throw error;
    }
  }

  // Get message by ID
  static async findById(messageId) {
    const sql = `
      SELECT 
        cm.*,
        u.email,
        u.role,
        p.full_name,
        p.avatar_url
      FROM chat_messages cm
      JOIN users u ON cm.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE cm.id = $1
    `;
    
    try {
      const result = await query(sql, [messageId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error;
    }
  }
}

export default ChatMessageModel;
