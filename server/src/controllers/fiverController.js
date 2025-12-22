import pool from '../db/index.js';

// Get all relevance options
export const getRelevanceOptions = async (req, res) => {
  try {
    const query = `
      SELECT id, metadata->>'option_key' as option_key, title as label, description, icon_name 
      FROM app_resources 
      WHERE type = 'relevance_option' AND is_active = true 
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

// Save user 5R selections (Relevance, Risks, Rewards, Roadblocks)
export const saveUser5RSelections = async (req, res) => {
  try {
    const { userId, step, selections } = req.body;

    if (!userId || !step || !selections) {
      return res.status(400).json({
        success: false,
        message: 'userId, step, and selections are required'
      });
    }

    // Start transaction
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Update or create 5R progress with JSONB merge
      // selections || jsonb_build_object($2, $3::jsonb) merges the new step data into the existing JSONB
      await client.query(`
        INSERT INTO user_5r_progress (user_id, current_step, selections, updated_at)
        VALUES ($1, $2::VARCHAR, jsonb_build_object($2::VARCHAR, $3::jsonb), CURRENT_TIMESTAMP)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          current_step = $2::VARCHAR,
          selections = COALESCE(user_5r_progress.selections, '{}'::jsonb) || jsonb_build_object($2::VARCHAR, $3::jsonb),
          updated_at = CURRENT_TIMESTAMP
      `, [userId, step, JSON.stringify(selections)]);

      await client.query('COMMIT');

      res.json({
        success: true,
        message: `${step} selections saved successfully`
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error saving 5R selections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save 5R selections'
    });
  }
};

// Get user 5R selections for a specific step
export const getUser5RSelections = async (req, res) => {
  try {
    const { userId, step } = req.params;

    // Get selections from the progress table
    const progressRes = await pool.query(
      'SELECT selections->>($2::VARCHAR) as step_selections FROM user_5r_progress WHERE user_id = $1',
      [userId, step]
    );

    if (progressRes.rows.length === 0 || !progressRes.rows[0].step_selections) {
      return res.json({
        success: true,
        data: []
      });
    }

    const selectionIds = JSON.parse(progressRes.rows[0].step_selections);

    if (!Array.isArray(selectionIds) || selectionIds.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Map IDs to full resource data from app_resources
    // Note: If you stored roadblocks as objects (id, title), you can adjust this logic
    const resourcesRes = await pool.query(
      `SELECT id, metadata->>'option_key' as option_key, title as label, description, icon_name, metadata->>'resolution' as resolution
       FROM app_resources 
       WHERE id = ANY($1::int[])`,
      [selectionIds]
    );

    res.json({
      success: true,
      data: resourcesRes.rows
    });
  } catch (error) {
    console.error('Error fetching user 5R selections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user 5R selections'
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
