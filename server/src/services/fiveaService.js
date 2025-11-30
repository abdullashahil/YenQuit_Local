import { query, getClient } from '../db/index.js';

export async function getQuestionsByStep(step) {
  const res = await query(
    'SELECT id, step, question_text, options, is_active, created_at, updated_at FROM fivea_questions WHERE step = $1 AND is_active = TRUE ORDER BY id ASC',
    [step]
  );
  return res.rows;
}

export async function getAllQuestions() {
  const res = await query(
    'SELECT id, step, question_text, options, is_active, created_at, updated_at FROM fivea_questions ORDER BY step, id ASC'
  );
  return res.rows;
}

export async function createQuestion({ step, question_text, options }) {
  const res = await query(
    'INSERT INTO fivea_questions (step, question_text, options) VALUES ($1, $2, $3) RETURNING id, step, question_text, options, is_active, created_at, updated_at',
    [step, question_text, options]
  );
  return res.rows[0];
}

export async function updateQuestion(id, { step, question_text, options, is_active }) {
  const fields = [];
  const values = [];
  let idx = 1;
  if (step !== undefined) { fields.push(`step = $${idx++}`); values.push(step); }
  if (question_text !== undefined) { fields.push(`question_text = $${idx++}`); values.push(question_text); }
  if (options !== undefined) { fields.push(`options = $${idx++}`); values.push(options); }
  if (is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }
  fields.push(`updated_at = NOW()`);
  values.push(id);
  const sql = `UPDATE fivea_questions SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, step, question_text, options, is_active, created_at, updated_at`;
  const res = await query(sql, values);
  return res.rows[0];
}

export async function deleteQuestion(id) {
  const res = await query('DELETE FROM fivea_questions WHERE id = $1 RETURNING id', [id]);
  return res.rows[0];
}

export async function softDeleteQuestion(id) {
  const res = await query(
    'UPDATE fivea_questions SET is_active = FALSE, updated_at = NOW() WHERE id = $1 RETURNING id, is_active, updated_at',
    [id]
  );
  return res.rows[0];
}

export async function getQuestionById(id) {
  const res = await query(
    'SELECT id, step, question_text, options, is_active, created_at, updated_at FROM fivea_questions WHERE id = $1',
    [id]
  );
  return res.rows[0];
}

export async function saveUserAnswers(userId, answers) {
  // Ensure userId is a valid UUID string
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId: must be a UUID string');
  }
  
  const client = await getClient();
  try {
    await client.query('BEGIN');
    for (const { question_id, answer } of answers) {
      await client.query(
        `INSERT INTO fivea_user_answers (user_id, question_id, answer_text) VALUES ($1::uuid, $2, $3)
         ON CONFLICT (user_id, question_id) DO UPDATE SET answer_text = EXCLUDED.answer_text, updated_at = NOW()
         RETURNING id, user_id, question_id, answer_text, created_at, updated_at`,
        [userId, question_id, answer]
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
  // Ensure userId is a valid UUID string
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId: must be a UUID string');
  }
  
  const res = await query(
    `SELECT a.id, a.question_id, a.answer_text, a.created_at, a.updated_at, q.step, q.question_text
       FROM fivea_user_answers a
       JOIN fivea_questions q ON a.question_id = q.id
       WHERE a.user_id = $1::uuid AND q.step = $2
       ORDER BY q.id ASC`,
    [userId, step]
  );
  return res.rows;
}

export async function getAllUserAnswersForUser(userId) {
  // Ensure userId is a valid UUID string
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId: must be a UUID string');
  }
  
  const res = await query(
    `SELECT a.id, a.question_id, a.answer_text, a.created_at, a.updated_at, q.step, q.question_text
       FROM fivea_user_answers a
       JOIN fivea_questions q ON a.question_id = q.id
       WHERE a.user_id = $1::uuid
       ORDER BY q.step, q.id ASC`,
    [userId]
  );
  return res.rows;
}

export async function getAllUserAnswers() {
  const res = await query(
    `SELECT a.id, a.user_id, a.question_id, a.answer_text, a.created_at, a.updated_at, q.step, q.question_text
       FROM fivea_user_answers a
       JOIN fivea_questions q ON a.question_id = q.id
       ORDER BY a.user_id, q.step, q.id`
  );
  return res.rows;
}

export async function saveAskAnswers(userId, answers) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    // Save each answer
    for (const [questionId, answerText] of Object.entries(answers)) {
      await client.query(
        `INSERT INTO fivea_user_answers (user_id, question_id, answer_text) VALUES ($1, $2, $3)
         ON CONFLICT (user_id, question_id) DO UPDATE SET answer_text = EXCLUDED.answer_text, updated_at = NOW()
         RETURNING id, user_id, question_id, answer_text, created_at, updated_at`,
        [userId, Number(questionId), answerText]
      );
    }
    // Calculate severity
    const severity = calculateSeverity(answers);
    // Store severity
    await client.query(
      `INSERT INTO fivea_severity_assessment (user_id, severity_level, score) VALUES ($1::uuid, $2, $3)
       ON CONFLICT (user_id) DO UPDATE SET severity_level = EXCLUDED.severity_level, score = EXCLUDED.score, created_at = NOW()`,
      [userId, severity.level, severity.score]
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

export async function getSeverityForUser(userId) {
  // Ensure userId is a valid UUID string
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId: must be a UUID string');
  }
  
  const res = await query('SELECT severity_level, score, created_at FROM fivea_severity_assessment WHERE user_id = $1::uuid', [userId]);
  return res.rows[0];
}

export async function getAdviseContent(severityLevel) {
  const res = await query(
    'SELECT id, severity_level, video_url, why_quitting_quote, ai_message_template FROM advise_content_library WHERE severity_level = $1 LIMIT 1',
    [severityLevel]
  );
  return res.rows[0];
}

export async function createAdminQuestion({ step, question_text, options }) {
  if (!step || !question_text) throw new Error('step and question_text are required');
  if (options !== undefined && !Array.isArray(options)) throw new Error('options must be an array');
  const res = await query(
    'INSERT INTO fivea_questions (step, question_text, options) VALUES ($1, $2, $3) RETURNING id, step, question_text, options, is_active, created_at, updated_at',
    [step, question_text, options]
  );
  return res.rows[0];
}

export async function updateAdminQuestion(id, payload) {
  const { step, question_text, options, is_active } = payload;
  const fields = [];
  const values = [];
  let idx = 1;
  if (step !== undefined) { fields.push(`step = $${idx++}`); values.push(step); }
  if (question_text !== undefined) { fields.push(`question_text = $${idx++}`); values.push(question_text); }
  if (options !== undefined) {
    if (!Array.isArray(options)) throw new Error('options must be an array');
    fields.push(`options = $${idx++}`); values.push(options);
  }
  if (is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }
  fields.push(`updated_at = NOW()`);
  values.push(id);
  const sql = `UPDATE fivea_questions SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, step, question_text, options, is_active, created_at, updated_at`;
  const res = await query(sql, values);
  return res.rows[0];
}

export async function saveAdviseHistory(userId, { severity_level, selected_video, selected_quote, ai_message }) {
  const res = await query(
    `INSERT INTO fivea_advise_history (user_id, severity_level, selected_video, selected_quote, ai_message)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id) DO UPDATE SET severity_level = EXCLUDED.severity_level, selected_video = EXCLUDED.selected_video, selected_quote = EXCLUDED.selected_quote, ai_message = EXCLUDED.ai_message, created_at = NOW()
     RETURNING user_id, severity_level, selected_video, selected_quote, ai_message, created_at`,
    [userId, severity_level, selected_video, selected_quote, ai_message]
  );
  return res.rows[0];
}

export async function softDeleteAdminQuestion(id) {
  const res = await query(
    'UPDATE fivea_questions SET is_active = FALSE, updated_at = NOW() WHERE id = $1 RETURNING id, is_active, updated_at',
    [id]
  );
  return res.rows[0];
}
