import { query, getClient } from '../db/index.js';

// Get all active questionnaire questions
export async function getQuestions() {
  const res = await query(`
    SELECT id, question_text, question_type, options, is_required, display_order
    FROM quit_tracker_questions
    WHERE is_active = true
    ORDER BY display_order ASC
  `);
  return res.rows;
}

// Get user's pre self-efficacy responses
export async function getPreSelfEfficacyResponses(userId) {
  const res = await query(`
    SELECT qr.id, qr.question_id, qr.response_value, qr.created_at,
           q.question_text, q.question_type, q.options
    FROM pre_self_efficacy qr
    JOIN quit_tracker_questions q ON qr.question_id = q.id
    WHERE qr.user_id = $1
    ORDER BY q.display_order ASC
  `, [userId]);
  return res.rows;
}

// Get user's post self-efficacy responses
export async function getPostSelfEfficacyResponses(userId) {
  const res = await query(`
    SELECT qr.id, qr.question_id, qr.response_value, qr.created_at,
           q.question_text, q.question_type, q.options
    FROM post_self_efficacy qr
    JOIN quit_tracker_questions q ON qr.question_id = q.id
    WHERE qr.user_id = $1
    ORDER BY q.display_order ASC
  `, [userId]);
  return res.rows;
}

// Save user's pre self-efficacy responses
export async function savePreSelfEfficacyResponses(userId, responses) {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // Delete existing responses for this user
    await client.query('DELETE FROM pre_self_efficacy WHERE user_id = $1', [userId]);

    // Insert new responses
    for (const response of responses) {
      const { questionId, value } = response;
      await client.query(`
        INSERT INTO pre_self_efficacy (user_id, question_id, response_value)
        VALUES ($1, $2, $3)
      `, [userId, questionId, value]);
    }


    // Update profiles join_date when completing pre-self-efficacy
    // This marks the user's official start of the journey
    await client.query(`
      UPDATE profiles 
      SET join_date = NOW(), updated_at = NOW() 
      WHERE user_id = $1
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

    // Delete existing responses for this user
    await client.query('DELETE FROM post_self_efficacy WHERE user_id = $1', [userId]);

    // Insert new responses
    for (const response of responses) {
      const { questionId, value } = response;
      await client.query(`
        INSERT INTO post_self_efficacy (user_id, question_id, response_value)
        VALUES ($1, $2, $3)
      `, [userId, questionId, value]);
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
    SELECT COUNT(*) as completed_count
    FROM pre_self_efficacy qr
    JOIN quit_tracker_questions q ON qr.question_id = q.id
    WHERE qr.user_id = $1 AND q.is_active = true
  `, [userId]);

  const totalQuestions = await query(`
    SELECT COUNT(*) as total_count
    FROM quit_tracker_questions
    WHERE is_active = true
  `);

  return res.rows[0].completed_count === totalQuestions.rows[0].total_count;
}

// Check if user has completed post self-efficacy questionnaire
export async function hasUserCompletedPostSelfEfficacy(userId) {
  const res = await query(`
    SELECT COUNT(*) as completed_count
    FROM post_self_efficacy qr
    JOIN quit_tracker_questions q ON qr.question_id = q.id
    WHERE qr.user_id = $1 AND q.is_active = true
  `, [userId]);

  const totalQuestions = await query(`
    SELECT COUNT(*) as total_count
    FROM quit_tracker_questions
    WHERE is_active = true
  `);

  return res.rows[0].completed_count === totalQuestions.rows[0].total_count;
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
    FROM quit_tracker_feedback_questions
    WHERE is_active = true
    ORDER BY display_order ASC
  `);
  return res.rows;
}

// Save user's feedback responses
export async function saveUserFeedback(userId, responses) {
  const res = await query(`
    INSERT INTO quit_tracker_user_feedback (user_id, responses)
    VALUES ($1, $2)
    RETURNING id
  `, [userId, JSON.stringify(responses)]);

  return res.rows[0];
}

// Check if user has provided feedback
export async function hasUserProvidedFeedback(userId) {
  const res = await query(`
    SELECT COUNT(*) as completed_count
    FROM quit_tracker_user_feedback
    WHERE user_id = $1
  `, [userId]);

  return parseInt(res.rows[0].completed_count) > 0;
}

// Get user's quit tracker settings
export async function getUserSettings(userId) {
  const res = await query(`
    SELECT goal_days, daily_reminder_time, is_tracking_enabled, created_at, updated_at
    FROM quit_tracker_settings
    WHERE user_id = $1
  `, [userId]);

  if (res.rows.length === 0) {
    // Create default settings
    await query(`
      INSERT INTO quit_tracker_settings (user_id, goal_days, daily_reminder_time, is_tracking_enabled)
      VALUES ($1, 30, '09:00:00', true)
    `, [userId]);

    return {
      goal_days: 30,
      daily_reminder_time: '09:00:00',
      is_tracking_enabled: true,
      created_at: new Date(),
      updated_at: new Date()
    };
  }

  return res.rows[0];
}

// Update user's quit tracker settings
export async function updateUserSettings(userId, settings) {
  const { goalDays, reminderTime, isTrackingEnabled } = settings;

  const res = await query(`
    UPDATE quit_tracker_settings
    SET goal_days = $1, daily_reminder_time = $2, is_tracking_enabled = $3, updated_at = NOW()
    WHERE user_id = $4
    RETURNING goal_days, daily_reminder_time, is_tracking_enabled, updated_at
  `, [goalDays, reminderTime, isTrackingEnabled, userId]);

  return res.rows[0];
}
