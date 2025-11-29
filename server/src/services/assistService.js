import { query, getClient } from '../db/index.js';
import { createUserIdWhereClause, createUserIdValuesClause } from '../utils/userIdHelper.js';

// Coping Strategies
export async function getCopingStrategies(isActiveOnly = true) {
  const whereClause = isActiveOnly ? 'WHERE is_active = TRUE' : '';
  const res = await query(
    `SELECT id, name, description, is_active, created_at, updated_at
       FROM coping_strategies
       ${whereClause}
       ORDER BY id ASC`
  );
  return res.rows;
}

export async function getCopingStrategyById(id) {
  const res = await query(
    'SELECT id, name, description, is_active, created_at, updated_at FROM coping_strategies WHERE id = $1',
    [id]
  );
  return res.rows[0];
}

export async function createCopingStrategy({ name, description }) {
  if (!name) {
    throw new Error('name is required');
  }
  const res = await query(
    'INSERT INTO coping_strategies (name, description) VALUES ($1, $2) RETURNING id, name, description, is_active, created_at, updated_at',
    [name, description || null]
  );
  return res.rows[0];
}

export async function updateCopingStrategy(id, { name, description, is_active }) {
  const fields = [];
  const values = [];
  let idx = 1;
  if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name); }
  if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
  if (is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }
  fields.push(`updated_at = NOW()`);
  values.push(id);
  const sql = `UPDATE coping_strategies SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, name, description, is_active, created_at, updated_at`;
  const res = await query(sql, values);
  return res.rows[0];
}

export async function softDeleteCopingStrategy(id) {
  const res = await query(
    'UPDATE coping_strategies SET is_active = FALSE, updated_at = NOW() WHERE id = $1 RETURNING id, is_active, updated_at',
    [id]
  );
  return res.rows[0];
}

// Notification Templates
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
  
  // Since we're joining tables with user_id columns, we need to be specific
  // We'll filter on the main table (fivea_assist_plans) and let the JOIN handle the rest
  const res = await query(
    `SELECT 
       ap.id, ap.quit_date, ap.triggers, ap.created_at, ap.updated_at,
       COALESCE(
         json_agg(
           json_build_object(
             'strategy_id', ucs.strategy_id,
             'strategy_name', cs.name,
             'strategy_description', cs.description
           )
         ) FILTER (WHERE ucs.strategy_id IS NOT NULL), 
         '[]'::json
       ) as strategies
     FROM fivea_assist_plans ap
     LEFT JOIN user_coping_strategies ucs ON ap.user_id = ucs.user_id
     LEFT JOIN coping_strategies cs ON ucs.strategy_id = cs.id
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
  
  console.log('Creating/updating assist plan for userId:', userId);
  
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
    
    // Also update the quit_date in the profiles table
    if (quitDate) {
      await client.query(
        'UPDATE profiles SET quit_date = $1, updated_at = NOW() WHERE user_id = $2',
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
  
  // Simple query without complex joins to avoid ambiguity
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
  // Ensure userId is provided
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
    
    // Create snapshot in history
    const historyRes = await client.query(
      `INSERT INTO fivea_assist_history 
       (user_id, plan_id, coping_strategies, triggers, notifications)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, plan_id, coping_strategies, triggers, notifications, created_at`,
      [
        userId,
        currentPlan.id,
        currentPlan.strategies.map(s => s.strategy_name),
        currentPlan.triggers,
        JSON.stringify(userNotifications)
      ]
    );
    
    // Update user onboarding step
    await client.query(
      'UPDATE users SET onboarding_step = 4, updated_at = NOW() WHERE id = $1',
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
  const offset = (page - 1) * limit;
  const res = await query(
    `SELECT 
       ah.id, ah.user_id, ah.plan_id, ah.coping_strategies, ah.triggers, ah.notifications, ah.created_at,
       u.email, u.first_name, u.last_name
     FROM fivea_assist_history ah
     LEFT JOIN users u ON ah.user_id = u.id
     ORDER BY ah.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  
  const totalRes = await query('SELECT COUNT(*) as count FROM fivea_assist_history');
  const total = parseInt(totalRes.rows[0].count, 10);
  
  return {
    history: res.rows,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}
