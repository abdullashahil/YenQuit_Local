import { query } from '../db/index.js';

// Helper to format JSON response
const sendResponse = (res, data) => res.json(data);

// 1. User Details Report
// 1. User Details Report
export const getUserDetailsReport = async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        u.id, u.email, u.role, 
        u.onboarding_step, u.onboarding_completed, u.fagerstrom_score, 
        u.created_at, u.updated_at,
        u.full_name, u.age, u.gender, 
        u.phone,
        u.tobacco_type, 
        u.quit_date, u.join_date,
        u.profile_metadata
      FROM users u
      ORDER BY u.id ASC
    `;
    const result = await query(sql);
    sendResponse(res, result.rows);
  } catch (err) {
    next(err);
  }
};

// Helper for 5A (Assessment) Reports
const getAsReport = async (res, next, type) => {
  try {
    const tobaccoCategory = type === 'smokeless' ? 'smokeless' : 'smoked';

    // 1. Fetch Questions (Category = 'fivea')
    // We fetch all 'fivea' questions to ensure consistent columns.
    // If needed we can filter by metadata, but 'fivea' category seems to be the main identifier for "As"
    const questionsSql = `
      SELECT id, question_text 
      FROM assessment_questions 
      WHERE category = 'fivea' 
      ORDER BY id
    `;
    const questionsRes = await query(questionsSql);
    const questions = questionsRes.rows;

    // 2. Fetch User Answers & Plan Data
    const userTypeFilter = tobaccoCategory === 'smoked'
      ? "(u.tobacco_type = 'smoked' OR u.tobacco_type IS NULL)"
      : "u.tobacco_type = 'smokeless'";

    const answersSql = `
      SELECT 
        u.id as user_id, 
        COALESCE(u.full_name, u.email) as user_identifier,
        TO_CHAR(fap.quit_date, 'YYYY-MM-DD') as quit_date,
        fap.triggers,
        uar.question_id, 
        uar.response_data
      FROM users u
      JOIN user_assessment_responses uar ON u.id = uar.user_id
      JOIN assessment_questions aq ON uar.question_id = aq.id
      LEFT JOIN fivea_assist_plans fap ON u.id = fap.user_id
      WHERE ${userTypeFilter}
      AND aq.category = 'fivea'
      ORDER BY u.id, aq.id
    `;
    const answersRes = await query(answersSql);

    // 3. Construct Matrix
    const userMap = {};

    answersRes.rows.forEach(row => {
      if (!userMap[row.user_id]) {
        const userObj = {
          "User Name": row.user_identifier,
          "Current Quit Date": row.quit_date || '-',
          "Triggers": row.triggers || '-'
        };
        // Initialize all question columns to empty
        questions.forEach(q => {
          userObj[q.question_text] = '-';
        });
        userMap[row.user_id] = userObj;
      }

      // Parse answer
      let val = row.response_data;
      if (typeof val === 'string') {
        try {
          const trimmed = val.trim();
          if (trimmed.startsWith('"') || trimmed.startsWith('[') || trimmed.startsWith('{')) {
            val = JSON.parse(val);
          }
        } catch (e) { }
      }
      // If array, join it
      if (Array.isArray(val)) val = val.join(', ');

      // Assign to correct column
      const q = questions.find(q => q.id === row.question_id);
      if (q) {
        userMap[row.user_id][q.question_text] = val;
      }
    });

    const report = Object.values(userMap);
    sendResponse(res, report);

  } catch (err) {
    next(err);
  }
};

// 2. Smokeless As Report
export const getSmokelessAsReport = (req, res, next) => getAsReport(res, next, 'smokeless');

// 3. Smoked As Report
export const getSmokedAsReport = (req, res, next) => getAsReport(res, next, 'smoked');

// Helper for Fagerstrom Reports
const getFagerstromReport = async (res, next, type) => {
  try {
    const tobaccoCategory = type === 'smokeless' ? 'smokeless' : 'smoked';

    // 1. Fetch Questions
    const questionsSql = `
      SELECT id, question_text 
      FROM assessment_questions 
      WHERE category = 'fagerstrom' 
      AND metadata->>'tobacco_category' = $1
      ORDER BY id
    `;
    const questionsRes = await query(questionsSql, [tobaccoCategory]);
    const questions = questionsRes.rows;

    if (questions.length === 0) {
      return sendResponse(res, []);
    }

    // 2. Fetch User Answers
    const userTypeFilter = tobaccoCategory === 'smoked'
      ? "(u.tobacco_type = 'smoked' OR u.tobacco_type IS NULL)"
      : "u.tobacco_type = 'smokeless'";

    const answersSql = `
      SELECT 
        u.id as user_id, 
        COALESCE(u.full_name, u.email) as user_identifier,
        uar.question_id, 
        uar.response_data
      FROM users u
      JOIN user_assessment_responses uar ON u.id = uar.user_id
      JOIN assessment_questions aq ON uar.question_id = aq.id
      WHERE ${userTypeFilter}
      AND aq.category = 'fagerstrom'
      AND aq.metadata->>'tobacco_category' = $1
      ORDER BY u.id, aq.id
    `;
    const answersRes = await query(answersSql, [tobaccoCategory]);

    // 3. Construct Matrix
    const userMap = {};

    answersRes.rows.forEach(row => {
      if (!userMap[row.user_id]) {
        const userObj = { "User Name": row.user_identifier };
        // Initialize all question columns to empty
        questions.forEach(q => {
          userObj[q.question_text] = '-';
        });
        userMap[row.user_id] = userObj;
      }

      // Parse answer
      let val = row.response_data;
      if (typeof val === 'string') {
        try {
          const trimmed = val.trim();
          if (trimmed.startsWith('"') || trimmed.startsWith('[') || trimmed.startsWith('{')) {
            val = JSON.parse(val);
          }
        } catch (e) { }
      }
      // If array, join it
      if (Array.isArray(val)) val = val.join(', ');

      // Assign to correct column
      const q = questions.find(q => q.id === row.question_id);
      if (q) {
        userMap[row.user_id][q.question_text] = val;
      }
    });

    const report = Object.values(userMap);
    sendResponse(res, report);

  } catch (err) {
    next(err);
  }
};

// 4. Smokeless Fagerstrom Report
export const getSmokelessFagerstromReport = (req, res, next) => getFagerstromReport(res, next, 'smokeless');

// 5. Smoked Fagerstrom Report
export const getSmokedFagerstromReport = (req, res, next) => getFagerstromReport(res, next, 'smoked');

// Helper for Generic Pivot Reports (Efficacy and Feedback)
const getGenericPivotReport = async (res, next, categoryFilter, contextFilter = null) => {
  try {
    // 1. Fetch Questions
    let questionsSql = `
      SELECT id, question_text 
      FROM assessment_questions 
      WHERE category = $1
      ORDER BY id
    `;
    const questionsRes = await query(questionsSql, [categoryFilter]);
    const questions = questionsRes.rows;

    if (questions.length === 0) {
      return sendResponse(res, []);
    }

    // 2. Fetch User Answers
    let answersSql = `
      SELECT 
        u.id as user_id, 
        COALESCE(u.full_name, u.email) as user_identifier,
        uar.question_id, 
        uar.response_data
      FROM users u
      JOIN user_assessment_responses uar ON u.id = uar.user_id
      JOIN assessment_questions aq ON uar.question_id = aq.id
      WHERE aq.category = $1
    `;

    const params = [categoryFilter];

    if (contextFilter) {
      answersSql += ` AND uar.assessment_context = $2`;
      params.push(contextFilter);
    }

    answersSql += ` ORDER BY u.id, aq.id`;

    const answersRes = await query(answersSql, params);

    // 3. Construct Matrix
    const userMap = {};

    answersRes.rows.forEach(row => {
      if (!userMap[row.user_id]) {
        const userObj = { "User Name": row.user_identifier };
        questions.forEach(q => {
          userObj[q.question_text] = '-';
        });
        userMap[row.user_id] = userObj;
      }

      let val = row.response_data;
      if (typeof val === 'string') {
        try {
          const trimmed = val.trim();
          if (trimmed.startsWith('"') || trimmed.startsWith('[') || trimmed.startsWith('{')) {
            val = JSON.parse(val);
          }
        } catch (e) { }
      }
      if (Array.isArray(val)) val = val.join(', ');

      const q = questions.find(q => q.id === row.question_id);
      if (q) {
        userMap[row.user_id][q.question_text] = val;
      }
    });

    const report = Object.values(userMap);
    sendResponse(res, report);

  } catch (err) {
    next(err);
  }
};


// 6. Pre Efficacy Report
export const getPreEfficacyReport = (req, res, next) => getGenericPivotReport(res, next, 'quit_tracker', 'pre');

// 7. Post Efficacy Report
export const getPostEfficacyReport = (req, res, next) => getGenericPivotReport(res, next, 'quit_tracker', 'post');

// 8. Feedback Report
export const getFeedbackReport = (req, res, next) => getGenericPivotReport(res, next, 'quit_tracker_feedback');

// 9. Rs Report (5R Progress)
export const getRsReport = async (req, res, next) => {
  try {
    // We want to show:
    // User | Current Step | Status | Coping Strategies Selected (concatenated)

    const sql = `
      SELECT 
        u.id as user_id,
        COALESCE(u.full_name, u.email) as user_identifier,
        rp.current_step, 
        rp.is_completed, 
        TO_CHAR(rp.started_at, 'YYYY-MM-DD') as started_at,
        TO_CHAR(rp.completed_at, 'YYYY-MM-DD') as completed_at,
        
        -- Aggregate Coping Strategies
        (
          SELECT STRING_AGG(ar.title, ', ')
          FROM user_coping_strategies ucs
          JOIN app_resources ar ON ucs.strategy_id = ar.id
          WHERE ucs.user_id = u.id
        ) as coping_strategies

      FROM user_5r_progress rp
      JOIN users u ON rp.user_id = u.id
      ORDER BY u.id
    `;
    const result = await query(sql);
    sendResponse(res, result.rows);
  } catch (err) {
    next(err);
  }
};

// 10. Daily Logs Report
export const getDailyLogsReport = async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        u.id as user_id,
        COALESCE(u.full_name, u.email) as user_identifier,
        TO_CHAR(dl.log_date, 'YYYY-MM-DD') as log_date, 
        dl.smoked,
        dl.cigarettes_count, 
        dl.cravings_level, 
        dl.mood, 
        dl.notes,
        dl.created_at
      FROM daily_logs dl
      JOIN users u ON dl.user_id = u.id
      ORDER BY dl.log_date DESC
    `;
    const result = await query(sql);
    sendResponse(res, result.rows);
  } catch (err) {
    next(err);
  }
};

// 11. Content Seekings Report
export const getContentSeekingsReport = async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        u.id as user_id,
        COALESCE(u.full_name, u.email) as user_identifier,
        lp.content_ids,
        -- Calculate length of JSON array if it is an array
        CASE 
          WHEN jsonb_typeof(lp.content_ids) = 'array' THEN jsonb_array_length(lp.content_ids)
          ELSE 0 
        END as items_consumed_count,
        lp.updated_at as last_activity
      FROM user_learning_progress lp
      JOIN users u ON lp.user_id = u.id
      ORDER BY u.id
    `;
    const result = await query(sql);
    // Format content_ids to be readable string if needed, or keep as array
    const rows = result.rows.map(row => ({
      ...row,
      content_ids: Array.isArray(row.content_ids) ? row.content_ids.join(', ') : JSON.stringify(row.content_ids)
    }));
    sendResponse(res, rows);
  } catch (err) {
    next(err);
  }
};
