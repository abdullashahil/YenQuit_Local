import pool from '../db/index.js';

/**
 * Get all helplines from app_resources
 */
export const getHelplines = async (req, res) => {
    try {
        const query = `
      SELECT id, title, description, metadata->>'phone_number' as phone_number, icon_name, display_order, is_active
      FROM app_resources
      WHERE type = 'helpline'
      ORDER BY display_order ASC, created_at DESC
    `;
        const result = await pool.query(query);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching helplines:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch helplines' });
    }
};

/**
 * Create a new helpline entry
 */
export const createHelpline = async (req, res) => {
    try {
        const { title, description, phone_number, display_order } = req.body;

        if (!title || !phone_number) {
            return res.status(400).json({ success: false, message: 'Title and phone number are required' });
        }

        const query = `
      INSERT INTO app_resources (type, title, description, metadata, icon_name, display_order, is_active)
      VALUES ('helpline', $1, $2, $3, 'phone', $4, true)
      RETURNING id, title, description, metadata->>'phone_number' as phone_number, icon_name, display_order, is_active
    `;
        const metadata = JSON.stringify({ phone_number });
        const result = await pool.query(query, [title, description || '', metadata, display_order || 0]);
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating helpline:', error);
        res.status(500).json({ success: false, message: 'Failed to create helpline' });
    }
};

/**
 * Update an existing helpline
 */
export const updateHelpline = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, phone_number, display_order, is_active } = req.body;

        if (!title || !phone_number) {
            return res.status(400).json({ success: false, message: 'Title and phone number are required' });
        }

        const query = `
      UPDATE app_resources
      SET title = $1, description = $2, metadata = $3, display_order = $4, is_active = $5, updated_at = NOW()
      WHERE id = $6 AND type = 'helpline'
      RETURNING id, title, description, metadata->>'phone_number' as phone_number, icon_name, display_order, is_active
    `;
        const metadata = JSON.stringify({ phone_number });
        const result = await pool.query(query, [title, description || '', metadata, display_order || 0, is_active !== false, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Helpline not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating helpline:', error);
        res.status(500).json({ success: false, message: 'Failed to update helpline' });
    }
};

/**
 * Delete a helpline entry
 */
export const deleteHelpline = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM app_resources WHERE id = $1 AND type = 'helpline' RETURNING id", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Helpline not found' });
        }
        res.json({ success: true, message: 'Helpline deleted successfully' });
    } catch (error) {
        console.error('Error deleting helpline:', error);
        res.status(500).json({ success: false, message: 'Failed to delete helpline' });
    }
};
