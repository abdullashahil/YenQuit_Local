import { query, getClient } from '../db/index.js';

// Get all active questionnaire questions
export async function getQuestions() {
  const res = await query(`
    SELECT id, question_text, question_type, options, is_required, display_order
    FROM assessment_questions
    WHERE category = 'quit_tracker' AND is_active = true
    ORDER BY display_order ASC
  `);
  return res.rows;
}

// Updated to use user_assessment_responses with context='pre'
export async function getPreSelfEfficacyResponses(userId) {
  const res = await query(`
    SELECT uar.id, uar.question_id, uar.response_data as response_value, uar.created_at,
           q.question_text, q.question_type, q.options
    FROM user_assessment_responses uar
    JOIN assessment_questions q ON uar.question_id = q.id
    WHERE uar.user_id = $1 
      AND q.category = 'quit_tracker'
      AND uar.assessment_context = 'pre'
    ORDER BY q.display_order ASC
  `, [userId]);

  return res.rows.map(r => ({
    ...r,
    response_value: typeof r.response_value === 'string' ? JSON.parse(r.response_value) : r.response_value
  }));
}

// Updated to use user_assessment_responses with context='post'
export async function getPostSelfEfficacyResponses(userId) {
  const res = await query(`
    SELECT uar.id, uar.question_id, uar.response_data as response_value, uar.created_at,
           q.question_text, q.question_type, q.options
    FROM user_assessment_responses uar
    JOIN assessment_questions q ON uar.question_id = q.id
    WHERE uar.user_id = $1 
      AND q.category = 'quit_tracker'
      AND uar.assessment_context = 'post'
    ORDER BY q.display_order ASC
  `, [userId]);

  return res.rows.map(r => ({
    ...r,
    response_value: typeof r.response_value === 'string' ? JSON.parse(r.response_value) : r.response_value
  }));
}

// Save user's pre self-efficacy responses
export async function savePreSelfEfficacyResponses(userId, responses) {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // Upsert logic instead of Delete + Insert for better concurrency handling
    for (const response of responses) {
      const { questionId, value } = response;
      await client.query(`
        INSERT INTO user_assessment_responses (user_id, question_id, response_data, assessment_context, created_at, updated_at)
        VALUES ($1, $2, $3, 'pre', NOW(), NOW())
        ON CONFLICT (user_id, question_id, assessment_context)
        DO UPDATE SET response_data = EXCLUDED.response_data, updated_at = NOW()
      `, [userId, questionId, JSON.stringify(value)]);
    }

    // Update user's join_date when completing pre-self-efficacy
    await client.query(`
      UPDATE users 
      SET join_date = NOW(), updated_at = NOW() 
      WHERE id = $1
    `, [userId]);

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Save user's post self-efficacy responses
export async function savePostSelfEfficacyResponses(userId, responses) {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    for (const response of responses) {
      const { questionId, value } = response;
      await client.query(`
        INSERT INTO user_assessment_responses (user_id, question_id, response_data, assessment_context, created_at, updated_at)
        VALUES ($1, $2, $3, 'post', NOW(), NOW())
        ON CONFLICT (user_id, question_id, assessment_context)
        DO UPDATE SET response_data = EXCLUDED.response_data, updated_at = NOW()
      `, [userId, questionId, JSON.stringify(value)]);
    }

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Check if user has completed pre self-efficacy questionnaire
export async function hasUserCompletedPreSelfEfficacy(userId) {
  const res = await query(`
    SELECT COUNT(DISTINCT uar.question_id) as completed_count
    FROM user_assessment_responses uar
    JOIN assessment_questions q ON uar.question_id = q.id
    WHERE uar.user_id = $1 
      AND q.category = 'quit_tracker' 
      AND q.is_active = true
      AND uar.assessment_context = 'pre'
  `, [userId]);

  const totalQuestions = await query(`
    SELECT COUNT(*) as total_count
    FROM assessment_questions
    WHERE category = 'quit_tracker' AND is_active = true
  `);

  return parseInt(res.rows[0].completed_count) >= parseInt(totalQuestions.rows[0].total_count);
}

// Check if user has completed post self-efficacy questionnaire
export async function hasUserCompletedPostSelfEfficacy(userId) {
  const res = await query(`
    SELECT COUNT(DISTINCT uar.question_id) as completed_count
    FROM user_assessment_responses uar
    JOIN assessment_questions q ON uar.question_id = q.id
    WHERE uar.user_id = $1 
      AND q.category = 'quit_tracker' 
      AND q.is_active = true
      AND uar.assessment_context = 'post'
  `, [userId]);

  const totalQuestions = await query(`
    SELECT COUNT(*) as total_count
    FROM assessment_questions
    WHERE category = 'quit_tracker' AND is_active = true
  `);

  return parseInt(res.rows[0].completed_count) >= parseInt(totalQuestions.rows[0].total_count);
}

// Legacy functions for backward compatibility
export async function getUserResponses(userId) {
  return getPreSelfEfficacyResponses(userId);
}

export async function saveUserResponses(userId, responses) {
  return savePreSelfEfficacyResponses(userId, responses);
}

export async function hasUserCompletedQuestionnaire(userId) {
  return hasUserCompletedPreSelfEfficacy(userId);
}

// Get all active feedback questions
export async function getFeedbackQuestions() {
  const res = await query(`
    SELECT id, question_text, options, display_order
    FROM assessment_questions
    WHERE category = 'quit_tracker_feedback' AND is_active = true
    ORDER BY display_order ASC
  `);
  return res.rows;
}

// Save user's feedback responses
export async function saveUserFeedback(userId, responses) {
  // responses is { qId: answer, ... }
  // We save individual items with assessment_context = 'feedback'
  const client = await getClient();
  try {
    await client.query('BEGIN');
    for (const response of responses) {
      const { questionId, value } = response;
      await client.query(`
        INSERT INTO user_assessment_responses (user_id, question_id, response_data, assessment_context, created_at, updated_at)
        VALUES ($1, $2, $3, 'feedback', NOW(), NOW())
        ON CONFLICT (user_id, question_id, assessment_context)
        DO UPDATE SET response_data = EXCLUDED.response_data, updated_at = NOW()
      `, [userId, questionId, JSON.stringify(value)]);
    }
    await client.query('COMMIT');
    return { success: true };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// Check if user has provided feedback
export async function hasUserProvidedFeedback(userId) {
  const res = await query(`
    SELECT COUNT(*) as completed_count
    FROM user_assessment_responses uar
    WHERE user_id = $1 AND assessment_context = 'feedback'
  `, [userId]);

  return parseInt(res.rows[0].completed_count) > 0;
}

// Get user's quit tracker settings
// Table 'quit_tracker_settings' has been removed. Returning default values.
export async function getUserSettings(userId) {
  return {
    goal_days: 30,
    daily_reminder_time: '09:00:00',
    is_tracking_enabled: true,
    created_at: new Date(),
    updated_at: new Date()
  };
}

// Update user's quit tracker settings
// Mock update since table is removed
export async function updateUserSettings(userId, settings) {
  const { goalDays, reminderTime, isTrackingEnabled } = settings;

  return {
    goal_days: goalDays || 30,
    daily_reminder_time: reminderTime || '09:00:00',
    is_tracking_enabled: isTrackingEnabled !== undefined ? isTrackingEnabled : true,
    updated_at: new Date()
  };
}
