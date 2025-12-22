import { query, getClient } from '../db/index.js';
import { createUserIdWhereClause, createUserIdValuesClause } from '../utils/userIdHelper.js';

// Coping Strategies (Now in app_resources)
export async function getCopingStrategies(isActiveOnly = true) {
  const whereClause = isActiveOnly ? "AND is_active = TRUE" : "";
  const res = await query(
    `SELECT id, title as name, description, is_active, created_at, updated_at
       FROM app_resources
       WHERE type = 'coping_strategy' ${whereClause}
       ORDER BY is_active DESC, id ASC`
  );
  return res.rows;
}

export async function getCopingStrategyById(id) {
  const res = await query(
    `SELECT id, title as name, description, is_active, created_at, updated_at 
     FROM app_resources 
     WHERE id = $1 AND type = 'coping_strategy'`,
    [id]
  );
  return res.rows[0];
}

export async function createCopingStrategy({ name, description }) {
  if (!name) {
    throw new Error('name is required');
  }
  const res = await query(
    `INSERT INTO app_resources (type, title, description, metadata) 
     VALUES ('coping_strategy', $1, $2, '{}') 
     RETURNING id, title as name, description, is_active, created_at, updated_at`,
    [name, description || null]
  );
  return res.rows[0];
}

export async function updateCopingStrategy(id, { name, description, is_active }) {
  const fields = [];
  const values = [];
  let idx = 1;
  if (name !== undefined) { fields.push(`title = $${idx++}`); values.push(name); }
  if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
  if (is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }
  fields.push(`updated_at = NOW()`);
  values.push(id);
  const sql = `UPDATE app_resources SET ${fields.join(', ')} WHERE id = $${idx} AND type = 'coping_strategy' RETURNING id, title as name, description, is_active, created_at, updated_at`;
  const res = await query(sql, values);
  return res.rows[0];
}

export async function softDeleteCopingStrategy(id) {
  const res = await query(
    `UPDATE app_resources SET is_active = FALSE, updated_at = NOW() WHERE id = $1 AND type = 'coping_strategy' RETURNING id, is_active, updated_at`,
    [id]
  );
  return res.rows[0];
}

// Notification Templates (Assuming this table still exists - checked in verification list: YES)
export async function getNotificationTemplates(isActiveOnly = true) {
  const whereClause = isActiveOnly ? 'WHERE is_active = TRUE' : '';
  const res = await query(
    `SELECT id, key, title, default_time, is_active, created_at, updated_at
       FROM notification_templates
       ${whereClause}
       ORDER BY id ASC`
  );
  return res.rows;
}

export async function getNotificationTemplateById(id) {
  const res = await query(
    'SELECT id, key, title, default_time, is_active, created_at, updated_at FROM notification_templates WHERE id = $1',
    [id]
  );
  return res.rows[0];
}

export async function createNotificationTemplate({ key, title, default_time }) {
  if (!key || !title) {
    throw new Error('key and title are required');
  }
  const res = await query(
    'INSERT INTO notification_templates (key, title, default_time) VALUES ($1, $2, $3) RETURNING id, key, title, default_time, is_active, created_at, updated_at',
    [key, title, default_time || null]
  );
  return res.rows[0];
}

export async function updateNotificationTemplate(id, { key, title, default_time, is_active }) {
  const fields = [];
  const values = [];
  let idx = 1;
  if (key !== undefined) { fields.push(`key = $${idx++}`); values.push(key); }
  if (title !== undefined) { fields.push(`title = $${idx++}`); values.push(title); }
  if (default_time !== undefined) { fields.push(`default_time = $${idx++}`); values.push(default_time); }
  if (is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }
  fields.push(`updated_at = NOW()`);
  values.push(id);
  const sql = `UPDATE notification_templates SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, key, title, default_time, is_active, created_at, updated_at`;
  const res = await query(sql, values);
  return res.rows[0];
}

export async function softDeleteNotificationTemplate(id) {
  const res = await query(
    'UPDATE notification_templates SET is_active = FALSE, updated_at = NOW() WHERE id = $1 RETURNING id, is_active, updated_at',
    [id]
  );
  return res.rows[0];
}

// User Assist Plan
export async function getUserAssistPlan(userId) {
  // Ensure userId is provided
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Updated to join app_resources instead of coping_strategies
  const res = await query(
    `SELECT 
       ap.id, ap.quit_date, ap.triggers, ap.created_at, ap.updated_at,
       COALESCE(
         json_agg(
           json_build_object(
             'strategy_id', ucs.strategy_id,
             'strategy_name', cs.title,
             'strategy_description', cs.description
           )
         ) FILTER (WHERE ucs.strategy_id IS NOT NULL), 
         '[]'::json
       ) as strategies
     FROM fivea_assist_plans ap
     LEFT JOIN user_coping_strategies ucs ON ap.user_id = ucs.user_id
     LEFT JOIN app_resources cs ON ucs.strategy_id = cs.id
     WHERE ap.user_id = $1
     GROUP BY ap.id, ap.quit_date, ap.triggers, ap.created_at, ap.updated_at
     ORDER BY ap.created_at DESC
     LIMIT 1`,
    [userId]
  );
  return res.rows[0];
}

export async function createOrUpdateUserAssistPlan(userId, { quitDate, triggers, selectedStrategyIds }) {
  // Validate userId
  if (!userId) {
    throw new Error('User ID is required');
  }



  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Check if plan exists for this user
    const userWhereClause = createUserIdWhereClause();
    const existingPlanRes = await client.query(
      `SELECT id FROM fivea_assist_plans WHERE ${userWhereClause}`,
      [userId]
    );

    let planId;
    if (existingPlanRes.rows.length > 0) {
      // Update existing plan
      const updateRes = await client.query(
        `UPDATE fivea_assist_plans SET quit_date = $1, triggers = $2, updated_at = NOW() WHERE ${userWhereClause} RETURNING id, quit_date, triggers, created_at, updated_at`,
        [quitDate || null, triggers || null, userId]
      );
      planId = updateRes.rows[0].id;
    } else {
      // Insert new plan
      const insertRes = await client.query(
        `INSERT INTO fivea_assist_plans (user_id, quit_date, triggers) VALUES ($1, $2, $3) RETURNING id, quit_date, triggers, created_at, updated_at`,
        [userId, quitDate || null, triggers || null]
      );
      planId = insertRes.rows[0].id;
    }

    // Delete existing strategy selections for this user
    await client.query(`DELETE FROM user_coping_strategies WHERE ${createUserIdWhereClause()}`, [userId]);

    // Insert new strategy selections
    if (selectedStrategyIds && selectedStrategyIds.length > 0) {
      // Create VALUES clause for multiple strategy insertions
      const strategyValues = selectedStrategyIds.map((_, index) =>
        `($1, $${index + 2})`
      ).join(', ');

      await client.query(
        `INSERT INTO user_coping_strategies (user_id, strategy_id) 
         VALUES ${strategyValues}`,
        [userId, ...selectedStrategyIds]
      );
    }

    // Also update the quit_date in the users table
    if (quitDate) {
      await client.query(
        'UPDATE users SET quit_date = $1, updated_at = NOW() WHERE id = $2',
        [quitDate, userId]
      );
    }

    await client.query('COMMIT');

    // Return the complete plan with strategies
    return await getUserAssistPlan(userId);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// User Notifications
export async function getUserNotifications(userId) {
  // Ensure userId is provided
  if (!userId) {
    throw new Error('User ID is required');
  }

  const res = await query(
    `SELECT 
       un.id, un.enabled, un.time, un.created_at, un.updated_at,
       nt.id as template_id, nt.key, nt.title, nt.default_time
     FROM user_notifications un
     JOIN notification_templates nt ON un.template_id = nt.id
     WHERE un.user_id = $1
     ORDER BY nt.id ASC`,
    [userId]
  );
  return res.rows;
}

export async function upsertUserNotifications(userId, notifications) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const results = [];

    for (const notification of notifications) {
      const { template_id, enabled, time } = notification;

      const res = await client.query(
        `INSERT INTO user_notifications (user_id, template_id, enabled, time)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, template_id)
         DO UPDATE SET 
           enabled = EXCLUDED.enabled,
           time = EXCLUDED.time,
           updated_at = NOW()
         RETURNING id, user_id, template_id, enabled, time, created_at, updated_at`,
        [userId, template_id, enabled !== false, time || null]
      );

      results.push(res.rows[0]);
    }

    await client.query('COMMIT');
    return results;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Complete Assist (snapshot to history)
export async function completeAssistPlan(userId) {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Get current assist plan
    const currentPlan = await getUserAssistPlan(userId);
    if (!currentPlan) {
      throw new Error('No assist plan found for user');
    }

    // Get user notifications
    const userNotifications = await getUserNotifications(userId);

    // Create snapshot in fivea_history w/ stage='assist'
    // Previous columns: plan_id, coping_strategies, triggers, notifications
    const historyData = {
      plan_id: currentPlan.id,
      coping_strategies: currentPlan.strategies.map(s => s.strategy_name),
      triggers: currentPlan.triggers,
      notifications: userNotifications
    };

    const historyRes = await client.query(
      `INSERT INTO fivea_history 
       (user_id, stage, history_data, created_at)
       VALUES ($1, 'assist', $2, NOW())
       RETURNING id`,
      [
        userId,
        JSON.stringify(historyData)
      ]
    );

    // Update user onboarding step - Mark as completed after assist (step 4)
    await client.query(
      'UPDATE users SET onboarding_step = 4, onboarding_completed = true, updated_at = NOW() WHERE id = $1',
      [userId]
    );

    await client.query('COMMIT');
    return historyRes.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Admin: Get Assist History
export async function getAssistHistory(page = 1, limit = 50) {
  // Queries fivea_history where stage='assist'
  const offset = (page - 1) * limit;
  const res = await query(
    `SELECT 
       ah.id, ah.user_id, ah.created_at,
       ah.history_data->>'plan_id' as plan_id,
       ah.history_data->'coping_strategies' as coping_strategies,
       ah.history_data->>'triggers' as triggers,
       ah.history_data->'notifications' as notifications,
       u.email, u.full_name as first_name -- using full_name from users
     FROM fivea_history ah
     LEFT JOIN users u ON ah.user_id = u.id
     WHERE ah.stage = 'assist'
     ORDER BY ah.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const totalRes = await query("SELECT COUNT(*) as count FROM fivea_history WHERE stage = 'assist'");
  const total = parseInt(totalRes.rows[0].count, 10);

  return {
    history: res.rows,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}
