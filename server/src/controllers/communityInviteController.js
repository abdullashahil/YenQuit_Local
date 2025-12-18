import { query } from '../db/index.js';

class CommunityInviteController {
  static async initialize() {
    // Initialize community invites table if needed
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS community_invites (
          id SERIAL PRIMARY KEY,
          code VARCHAR(10) UNIQUE NOT NULL,
          community_id INTEGER NOT NULL,
          created_by INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP,
          max_uses INTEGER DEFAULT 1,
          used_count INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true
        )
      `);
      console.log('Community invites table initialized');
    } catch (error) {
      console.error('Error initializing community invites table:', error);
    }
  }

  static async getAllInvites(req, res, next) {
    try {
      const result = await query('SELECT * FROM community_invites WHERE is_active = true ORDER BY created_at DESC');
      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  }

  static async getInviteByCode(req, res, next) {
    try {
      const { code } = req.params;
      const result = await query(
        'SELECT * FROM community_invites WHERE code = $1 AND is_active = true AND (expires_at IS NULL OR expires_at > NOW())',
        [code]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Invite not found or expired' });
      }
      
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  static async createInvite(req, res, next) {
    try {
      const { community_id, created_by, expires_at, max_uses = 1 } = req.body;
      
      // Generate unique code
      let code;
      let attempts = 0;
      do {
        code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const existing = await query('SELECT id FROM community_invites WHERE code = $1', [code]);
        if (existing.rows.length === 0) break;
        attempts++;
      } while (attempts < 10);
      
      if (attempts >= 10) {
        return res.status(500).json({ success: false, message: 'Failed to generate unique code' });
      }
      
      const result = await query(
        'INSERT INTO community_invites (code, community_id, created_by, expires_at, max_uses) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [code, community_id, created_by, expires_at, max_uses]
      );
      
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  static async updateInvite(req, res, next) {
    try {
      const { id } = req.params;
      const { expires_at, max_uses, is_active } = req.body;
      
      const result = await query(
        'UPDATE community_invites SET expires_at = COALESCE($1, expires_at), max_uses = COALESCE($2, max_uses), is_active = COALESCE($3, is_active) WHERE id = $4 RETURNING *',
        [expires_at, max_uses, is_active, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Invite not found' });
      }
      
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  static async deleteInvite(req, res, next) {
    try {
      const { id } = req.params;
      
      const result = await query('DELETE FROM community_invites WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Invite not found' });
      }
      
      res.json({ success: true, message: 'Invite deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default CommunityInviteController;
