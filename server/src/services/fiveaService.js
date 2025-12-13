import { query, getClient } from '../db/index.js';

// Helper to map DB row to Service object format
const mapFiveAQuestion = (row) => ({
  id: row.id,
  step: row.metadata?.step,
  question_text: row.question_text,
  options: row.options,
  is_active: row.is_active,
  created_at: row.created_at,
  updated_at: row.updated_at,
  tobacco_category: row.metadata?.tobacco_category || 'smoked'
});

const mapAdvice = (row) => ({
  id: row.id,
  severity_level: row.metadata?.severity_level,
  video_url: row.metadata?.video_url,
  why_quitting_quote: row.metadata?.why_quitting_quote || row.description,
  ai_message_template: row.metadata?.ai_message_template
});

export async function getQuestionsByStep(step, tobaccoCategory) {
  const category = tobaccoCategory || 'smoked';

  const whereParts = ["category = 'fivea'", "is_active = TRUE", "metadata->>'step' = $1"];
  const params = [step];
  let idx = 2;

  // 'assess' step is common for all
  if (step !== 'assess') {
    whereParts.push(`metadata->>'tobacco_category' = $${idx}`);
    params.push(category);
  }

  const res = await query(
    `SELECT id, question_text, options, is_active, created_at, updated_at, metadata
     FROM assessment_questions
     WHERE ${whereParts.join(' AND ')}
     ORDER BY id`,
    params
  );

  return res.rows.map(mapFiveAQuestion);
}

export async function getAllQuestions() {
  const res = await query(
    "SELECT id, question_text, options, is_active, created_at, updated_at, metadata FROM assessment_questions WHERE category = 'fivea' ORDER BY metadata->>'step', id ASC"
  );
  return res.rows.map(mapFiveAQuestion);
}

export async function createQuestion({ step, question_text, options }) {
  const res = await query(
    `INSERT INTO assessment_questions (category, question_text, options, metadata) 
     VALUES ('fivea', $1, $2, $3) 
     RETURNING id, question_text, options, is_active, created_at, updated_at, metadata`,
    [question_text, JSON.stringify(options), JSON.stringify({ step, tobacco_category: 'smoked' })]
  );
  return mapFiveAQuestion(res.rows[0]);
}

export async function updateQuestion(id, { step, question_text, options, is_active }) {
  const fields = [];
  const values = [];
  let idx = 1;

  const currentRes = await query("SELECT metadata FROM assessment_questions WHERE id = $1", [id]);
  const currentMeta = currentRes.rows[0]?.metadata || {};

  if (step !== undefined) {
    currentMeta.step = step;
    fields.push(`metadata = $${idx++}`); values.push(JSON.stringify(currentMeta));
  }

  if (question_text !== undefined) { fields.push(`question_text = $${idx++}`); values.push(question_text); }
  if (options !== undefined) { fields.push(`options = $${idx++}`); values.push(JSON.stringify(options)); }
  if (is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const sql = `UPDATE assessment_questions SET ${fields.join(', ')} WHERE id = $${idx} AND category = 'fivea' RETURNING id, question_text, options, is_active, created_at, updated_at, metadata`;
  const res = await query(sql, values);
  return res.rows[0] ? mapFiveAQuestion(res.rows[0]) : null;
}

export async function deleteQuestion(id) {
  const res = await query("DELETE FROM assessment_questions WHERE id = $1 AND category = 'fivea' RETURNING id", [id]);
  return res.rows[0];
}

export async function softDeleteQuestion(id) {
  const res = await query(
    "UPDATE assessment_questions SET is_active = FALSE, updated_at = NOW() WHERE id = $1 AND category = 'fivea' RETURNING id, is_active, updated_at",
    [id]
  );
  return res.rows[0];
}

export async function getQuestionById(id) {
  const res = await query(
    "SELECT id, question_text, options, is_active, created_at, updated_at, metadata FROM assessment_questions WHERE id = $1 AND category = 'fivea'",
    [id]
  );
  return res.rows[0] ? mapFiveAQuestion(res.rows[0]) : null;
}

// User Answers
export async function saveUserAnswers(userId, answers) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId: must be a UUID string');
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');
    for (const { question_id, answer } of answers) {
      await client.query(
        `INSERT INTO user_assessment_responses (user_id, question_id, response_data, created_at, updated_at)
         VALUES ($1::uuid, $2, $3, NOW(), NOW())
         ON CONFLICT (user_id, question_id, assessment_context) 
         DO UPDATE SET response_data = EXCLUDED.response_data, updated_at = NOW()`,
        // Note: assessment_context defaults to 'default'. 
        // For general 5A, we probably want 'default' or a specific tag. 
        // Assuming 'default' matches the constraint in fix-se-constraint.js for unique key if not specified.
        // Wait, the constraint is (user_id, question_id, assessment_context).
        // If we don't supply it, it uses default.
        // In ask step, we might re-answer questions.
        // Let's rely on default 'default' context for standard assessment answers.
        [userId, question_id, JSON.stringify(answer)]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getUserAnswers(userId, step) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId: must be a UUID string');
  }

  const res = await query(
    `SELECT uar.id, uar.question_id, uar.response_data as answer_text, uar.created_at, uar.updated_at, q.metadata->>'step' as step, q.question_text
       FROM user_assessment_responses uar
       JOIN assessment_questions q ON uar.question_id = q.id
       WHERE uar.user_id = $1::uuid AND q.metadata->>'step' = $2
       ORDER BY q.id ASC`,
    [userId, step]
  );
  return res.rows;
}

export async function getAllUserAnswersForUser(userId) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId: must be a UUID string');
  }

  const res = await query(
    `SELECT uar.id, uar.question_id, uar.response_data as answer_text, uar.created_at, uar.updated_at, q.metadata->>'step' as step, q.question_text
       FROM user_assessment_responses uar
       JOIN assessment_questions q ON uar.question_id = q.id
       WHERE uar.user_id = $1::uuid AND q.category = 'fivea'
       ORDER BY q.metadata->>'step', q.id ASC`,
    [userId]
  );
  return res.rows;
}

export async function getAllUserAnswers() {
  const res = await query(
    `SELECT uar.id, uar.user_id, uar.question_id, uar.response_data as answer_text, uar.created_at, uar.updated_at, q.metadata ->> 'step' as step, q.question_text
       FROM user_assessment_responses uar
       JOIN assessment_questions q ON uar.question_id = q.id
       WHERE q.category = 'fivea'
       ORDER BY uar.user_id, q.metadata ->> 'step', q.id`
  );
  return res.rows;
}

// Updated Ask Logic (Severity Calculation)
export async function saveAskAnswers(userId, answers) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    for (const [questionId, answerText] of Object.entries(answers)) {
      await client.query(
        `INSERT INTO user_assessment_responses(user_id, question_id, response_data, created_at, updated_at) 
         VALUES($1, $2, $3, NOW(), NOW())
         ON CONFLICT(user_id, question_id, assessment_context) 
         DO UPDATE SET response_data = EXCLUDED.response_data, updated_at = NOW()`,
        [userId, Number(questionId), JSON.stringify(answerText)]
      );
    }

    // Save Severity Assessment to consolidated history
    const severity = calculateSeverity(answers);

    // Insert into fivea_history with stage='assess'
    // This replaces fivea_severity_assessment
    await client.query(
      `INSERT INTO fivea_history(user_id, stage, history_data, created_at)
       VALUES($1, 'assess', $2, NOW())
       RETURNING id`,
      [userId, JSON.stringify({ severity_level: severity.level, score: severity.score })]
    );

    await client.query('COMMIT');
    return severity;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

function calculateSeverity(answers) {
  let score = 0;
  for (const key in answers) {
    const ans = answers[key];
    if (ans.includes("More than") || ans.includes("Heavy") || ans.includes("31-60") || ans.includes("After 60")) score += 3;
    else if (ans.includes("Moderate") || ans.includes("Daily") || ans.includes("6-30") || ans.includes("11-20")) score += 2;
    else score += 1;
  }
  let level = "low";
  if (score >= 12) level = "high";
  else if (score >= 7) level = "medium";
  return { level, score };
}

// Updated to use fivea_history
export async function getSeverityForUser(userId) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId: must be a UUID string');
  }
  // Get latest assess history
  const res = await query(
    `SELECT history_data ->> 'severity_level' as severity_level,
    (history_data ->> 'score'):: int as score,
    created_at 
       FROM fivea_history 
       WHERE user_id = $1:: uuid AND stage = 'assess' 
       ORDER BY created_at DESC 
       LIMIT 1`,
    [userId]
  );
  return res.rows[0];
}

export async function getAdviseContent(severityLevel) {
  const res = await query(
    `SELECT id, title, description, metadata 
     FROM app_resources 
     WHERE type = 'advice' AND metadata ->> 'severity_level' = $1 
     LIMIT 1`,
    [severityLevel]
  );
  return res.rows[0] ? mapAdvice(res.rows[0]) : null;
}

export async function createAdminQuestion({ step, question_text, options, tobacco_category }) {
  const category = tobacco_category || 'smoked';
  const res = await query(
    `INSERT INTO assessment_questions(category, question_text, options, metadata)
     VALUES('fivea', $1, $2, $3)
     RETURNING id, question_text, options, is_active, created_at, updated_at, metadata`,
    [question_text, JSON.stringify(options || []), JSON.stringify({ step, tobacco_category: category })]
  );
  return mapFiveAQuestion(res.rows[0]);
}

export async function updateAdminQuestion(id, payload) {
  const { step, question_text, options, is_active, tobacco_category } = payload;
  const currentRes = await query("SELECT metadata FROM assessment_questions WHERE id = $1", [id]);
  const currentMeta = currentRes.rows[0]?.metadata || {};
  const fields = [];
  const values = [];
  let idx = 1;

  if (step !== undefined) currentMeta.step = step;
  if (tobacco_category !== undefined) currentMeta.tobacco_category = tobacco_category;

  if (step !== undefined || tobacco_category !== undefined) {
    fields.push(`metadata = $${idx++} `);
    values.push(JSON.stringify(currentMeta));
  }
  if (question_text !== undefined) { fields.push(`question_text = $${idx++} `); values.push(question_text); }
  if (options !== undefined) { fields.push(`options = $${idx++} `); values.push(JSON.stringify(options)); }
  if (is_active !== undefined) { fields.push(`is_active = $${idx++} `); values.push(is_active); }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const sql = `UPDATE assessment_questions SET ${fields.join(', ')} WHERE id = $${idx} AND category = 'fivea' RETURNING id, question_text, options, is_active, created_at, updated_at, metadata`;
  const res = await query(sql, values);
  return res.rows[0] ? mapFiveAQuestion(res.rows[0]) : null;
}

// Updated to use fivea_history for Advise
export async function saveAdviseHistory(userId, { severity_level, selected_video, selected_quote, ai_message }) {
  const res = await query(
    `INSERT INTO fivea_history(user_id, stage, history_data, created_at)
VALUES($1, 'advise', $2, NOW())
     RETURNING user_id, history_data ->> 'severity_level' as severity_level, history_data ->> 'selected_video' as selected_video, history_data ->> 'selected_quote' as selected_quote, history_data ->> 'ai_message' as ai_message, created_at`,
    [userId, JSON.stringify({ severity_level, selected_video, selected_quote, ai_message })]
  );
  return res.rows[0];
}

// Updated to use fivea_history
export async function getAdviseHistory(userId) {
  const res = await query(
    `SELECT user_id,
  history_data ->> 'severity_level' as severity_level,
  history_data ->> 'selected_video' as selected_video,
  history_data ->> 'selected_quote' as selected_quote,
  history_data ->> 'ai_message' as ai_message,
  created_at
     FROM fivea_history
     WHERE user_id = $1 AND stage = 'advise'
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );
  return res.rows[0];
}

export async function softDeleteAdminQuestion(id) {
  return softDeleteQuestion(id);
}
