import { query } from '../db/index.js';

class UserInviteModel {
    // Create invite
    static async create(communityId, inviterId, inviteeId) {
        const sql = `
      INSERT INTO user_community_invites (community_id, inviter_id, invitee_id, status)
      VALUES ($1, $2, $3, 'pending')
      ON CONFLICT (community_id, invitee_id) 
      DO UPDATE SET status = 'pending', created_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

        try {
            const result = await query(sql, [communityId, inviterId, inviteeId]);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating invite:', error);
            throw error;
        }
    }

    // Get pending invites for user
    static async getPendingInvites(userId) {
        const sql = `
      SELECT 
        uci.*,
        c.name as community_name,
        c.description as community_description,
        c.avatar_url as community_avatar,
        u.email as inviter_email,
        u.full_name as inviter_name
      FROM user_community_invites uci
      JOIN communities c ON uci.community_id = c.id
      JOIN users u ON uci.inviter_id = u.id
      WHERE uci.invitee_id = $1 AND uci.status = 'pending'
      ORDER BY uci.created_at DESC
    `;

        try {
            const result = await query(sql, [userId]);
            return result.rows;
        } catch (error) {
            console.error('Error fetching pending invites:', error);
            throw error;
        }
    }

    // Get invites for community
    static async getCommunityInvites(communityId) {
        const sql = `
      SELECT 
        uci.*,
        u.email as invitee_email,
        u.full_name as invitee_name
      FROM user_community_invites uci
      JOIN users u ON uci.invitee_id = u.id
      WHERE uci.community_id = $1
      ORDER BY uci.created_at DESC
    `;

        try {
            const result = await query(sql, [communityId]);
            return result.rows;
        } catch (error) {
            console.error('Error fetching community invites:', error);
            throw error;
        }
    }

    // Accept invite
    static async acceptInvite(inviteId, userId) {
        const sql = `
      UPDATE user_community_invites
      SET status = 'accepted', responded_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND invitee_id = $2 AND status = 'pending'
      RETURNING *
    `;

        try {
            const result = await query(sql, [inviteId, userId]);
            return result.rows[0];
        } catch (error) {
            console.error('Error accepting invite:', error);
            throw error;
        }
    }

    // Reject invite
    static async rejectInvite(inviteId, userId) {
        const sql = `
      UPDATE user_community_invites
      SET status = 'rejected', responded_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND invitee_id = $2 AND status = 'pending'
      RETURNING *
    `;

        try {
            const result = await query(sql, [inviteId, userId]);
            return result.rows[0];
        } catch (error) {
            console.error('Error rejecting invite:', error);
            throw error;
        }
    }

    // Cancel invite (by inviter)
    static async cancelInvite(inviteId, inviterId) {
        const sql = `
      UPDATE user_community_invites
      SET status = 'cancelled', responded_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND inviter_id = $2 AND status = 'pending'
      RETURNING *
    `;

        try {
            const result = await query(sql, [inviteId, inviterId]);
            return result.rows[0];
        } catch (error) {
            console.error('Error cancelling invite:', error);
            throw error;
        }
    }

    // Check if user has pending invite
    static async hasPendingInvite(communityId, userId) {
        const sql = `
      SELECT id FROM user_community_invites
      WHERE community_id = $1 AND invitee_id = $2 AND status = 'pending'
    `;

        try {
            const result = await query(sql, [communityId, userId]);
            return result.rows.length > 0;
        } catch (error) {
            console.error('Error checking pending invite:', error);
            throw error;
        }
    }
}

export default UserInviteModel;
