import pool from '../db/index.js';

// Get all relevance options
export const getRelevanceOptions = async (req, res) => {
  try {
    const query = `
      SELECT id, option_key, label, description, icon_name 
      FROM relevance_options 
      WHERE is_active = true 
      ORDER BY id
    `;
    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching relevance options:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch relevance options'
    });
  }
};

// Save user relevance selections
export const saveUserRelevanceSelections = async (req, res) => {
  try {
    const { userId, selectedOptions } = req.body;
    
    if (!userId || !selectedOptions || !Array.isArray(selectedOptions)) {
      return res.status(400).json({
        success: false,
        message: 'userId and selectedOptions array are required'
      });
    }

    // Start transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Delete existing selections for this user
      await client.query(
        'DELETE FROM user_relevance_selections WHERE user_id = $1',
        [userId]
      );
      
      // Insert new selections
      for (const optionId of selectedOptions) {
        await client.query(
          'INSERT INTO user_relevance_selections (user_id, relevance_option_id) VALUES ($1, $2)',
          [userId, optionId]
        );
      }
      
      // Update or create 5R progress
      await client.query(`
        INSERT INTO user_5r_progress (user_id, current_step, updated_at)
        VALUES ($1, 'relevance', CURRENT_TIMESTAMP)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          current_step = 'relevance',
          updated_at = CURRENT_TIMESTAMP
      `, [userId]);
      
      await client.query('COMMIT');
      
      res.json({
        success: true,
        message: 'Relevance selections saved successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error saving relevance selections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save relevance selections'
    });
  }
};

// Get user relevance selections
export const getUserRelevanceSelections = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const query = `
      SELECT ro.id, ro.option_key, ro.label, ro.description, ro.icon_name
      FROM relevance_options ro
      INNER JOIN user_relevance_selections urs ON ro.id = urs.relevance_option_id
      WHERE urs.user_id = $1 AND ro.is_active = true
      ORDER BY ro.id
    `;
    
    const result = await pool.query(query, [userId]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching user relevance selections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user relevance selections'
    });
  }
};

// Get user 5R progress
export const getUser5RProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const query = `
      SELECT current_step, is_completed, started_at, completed_at, updated_at
      FROM user_5r_progress
      WHERE user_id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: null
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching user 5R progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user 5R progress'
    });
  }
};
