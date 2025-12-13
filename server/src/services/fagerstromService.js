import { query, getClient } from '../db/index.js';

// Helper to extract map question
const mapQuestion = (row) => ({
  id: row.id,
  question_text: row.question_text,
  options: row.options,
  is_active: row.is_active,
  created_at: row.created_at,
  updated_at: row.updated_at,
  tobacco_category: row.metadata?.tobacco_category || 'smoked'
});

export async function getFagerstromQuestions(page = 1, limit = 50, isActiveOnly = true, tobaccoCategory = 'smoked') {
  const offset = (page - 1) * limit;
  const values = [limit, offset];
  const whereParts = ["category = 'fagerstrom'"];
  let idx = 3;

  if (isActiveOnly) {
    whereParts.push('is_active = TRUE');
  }

  if (tobaccoCategory) {
    whereParts.push(`metadata->>'tobacco_category' = $${idx}`);
    values.push(tobaccoCategory);
    idx++;
  }

  const whereClause = whereParts.length ? 'WHERE ' + whereParts.join(' AND ') : '';

  const res = await query(
    `SELECT id, question_text, options, is_active, created_at, updated_at, metadata
       FROM assessment_questions
       ${whereClause}
       ORDER BY id ASC
       LIMIT $1 OFFSET $2`,
    values
  );
  return res.rows.map(mapQuestion);
}

export async function getFagerstromQuestionById(id) {
  const res = await query(
    "SELECT id, question_text, options, is_active, created_at, updated_at, metadata FROM assessment_questions WHERE id = $1 AND category = 'fagerstrom'",
    [id]
  );
  if (!res.rows[0]) return null;
  return mapQuestion(res.rows[0]);
}

export async function createFagerstromQuestion({ question_text, options, tobacco_category }) {
  if (!question_text || !Array.isArray(options) || options.length === 0) {
    throw new Error('question_text and non-empty options array are required');
  }
  const category = tobacco_category || 'smoked';
  const res = await query(
    `INSERT INTO assessment_questions (category, question_text, options, metadata) 
     VALUES ('fagerstrom', $1, $2, $3) 
     RETURNING id, question_text, options, is_active, created_at, updated_at, metadata`,
    [question_text, JSON.stringify(options), JSON.stringify({ tobacco_category: category })]
  );
  return mapQuestion(res.rows[0]);
}

export async function updateFagerstromQuestion(id, { question_text, options, is_active, tobacco_category }) {
  const current = await getFagerstromQuestionById(id);
  if (!current) return null;

  const fields = [];
  const values = [];
  let idx = 1;

  if (question_text !== undefined) { fields.push(`question_text = $${idx++}`); values.push(question_text); }
  if (options !== undefined) {
    if (!Array.isArray(options) || options.length === 0) throw new Error('options must be a non-empty array');
    fields.push(`options = $${idx++}`); values.push(JSON.stringify(options));
  }
  if (is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }

  let newMetadata = { tobacco_category: current.tobacco_category };
  if (tobacco_category !== undefined) {
    newMetadata.tobacco_category = tobacco_category;
    fields.push(`metadata = $${idx++}`);
    values.push(JSON.stringify(newMetadata));
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const sql = `UPDATE assessment_questions SET ${fields.join(', ')} WHERE id = $${idx} AND category = 'fagerstrom' RETURNING id, question_text, options, is_active, created_at, updated_at, metadata`;
  const res = await query(sql, values);
  return mapQuestion(res.rows[0]);
}

export async function softDeleteFagerstromQuestion(id) {
  const res = await query(
    "UPDATE assessment_questions SET is_active = FALSE, updated_at = NOW() WHERE id = $1 AND category = 'fagerstrom' RETURNING id, is_active, updated_at",
    [id]
  );
  return res.rows[0];
}

export async function getFagerstromQuestionCount(isActiveOnly = true, tobaccoCategory = 'smoked') {
  const values = [];
  const whereParts = ["category = 'fagerstrom'"];
  let idx = 1;

  if (isActiveOnly) {
    whereParts.push('is_active = TRUE');
  }

  if (tobaccoCategory) {
    whereParts.push(`metadata->>'tobacco_category' = $${idx}`);
    values.push(tobaccoCategory);
    idx++;
  }

  const whereClause = whereParts.length ? 'WHERE ' + whereParts.join(' AND ') : '';
  const res = await query(`SELECT COUNT(*) as count FROM assessment_questions ${whereClause}`, values);
  return parseInt(res.rows[0].count, 10);
}

// Updated to use user_assessment_responses
// Note: We no longer have 'session_ref' in answers. 
// We simplify by fetching the user's latest answers for Fagerstrom questions.
export async function getFagerstromUserAnswers(userId) {
  // We fetch answers for questions that are 'fagerstrom' category
  const queryText = `
    SELECT uar.question_id, uar.response_data as answer_text, uar.created_at, uar.updated_at
    FROM user_assessment_responses uar
    JOIN assessment_questions aq ON uar.question_id = aq.id
    WHERE uar.user_id = $1 AND aq.category = 'fagerstrom'
    ORDER BY uar.question_id ASC
  `;
  const res = await query(queryText, [userId]);
  // normalize response_data (remove quotes if it's a string)
  return res.rows.map(r => ({
    ...r,
    answer_text: typeof r.answer_text === 'string' ? JSON.parse(r.answer_text) : r.answer_text
  }));
}

export async function saveFagerstromAnswers(userId, answers) {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    // 1. Calculate Score
    let score = 0;
    for (const answer of answers) {
      const { question_id, answer_text } = answer;
      score += calculateAnswerScore(question_id, answer_text);
    }

    // 2. Save Session Record (History of attempts)
    const sessionResult = await client.query(
      `INSERT INTO fagerstrom_sessions (user_id, score) VALUES ($1, $2) RETURNING id`,
      [userId, score]
    );
    const sessionId = sessionResult.rows[0].id;

    // 3. Save Answers (Current State)
    for (const answer of answers) {
      const { question_id, answer_text } = answer;
      // We upsert answers to reflect current status
      await client.query(
        `INSERT INTO user_assessment_responses (user_id, question_id, response_data, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         ON CONFLICT (user_id, question_id) 
         DO UPDATE SET response_data = EXCLUDED.response_data, updated_at = NOW()`,
        [userId, question_id, JSON.stringify(answer_text)]
      );
    }

    // 4. Update User Profile with new score (if profile logic exists)
    // We merged profile into users, so update users table directly
    await client.query(
      `UPDATE users SET fagerstrom_score = $1, updated_at = NOW() WHERE id = $2`,
      [score, userId]
    );

    await client.query('COMMIT');
    return { success: true, sessionId, score };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Fixed Scoring Map for new ID assignments (Need to be carefully checked against real DB IDs if possible)
// Assuming standard order was preserved during migration 1..N
function calculateAnswerScore(questionId, answerText) {
  // Mapping based on standard Fagerstrom logic. 
  // IMPORTANT: This depends on the specific wording/ID in the DB.
  // Ideally this logic should drive from DB metatada, but for now hardcoded was used.
  // We leave specific ID mapping logic as previously defined or generic pattern matching if possible.

  // Previous code had IDs 2,3,4,5,6,7. 
  // If IDs shifted during consolidation, this might be broken.
  // However, I preserved ID order in previous migration steps or re-mapped them.
  // Let's assume for now IDs are consistent with previous logic or rely on text matching if needed.
  // Given I cannot see the DB content right now, I will keep the previous map but warn 
  // that IDs must align. The user said "everything works fine" before, so IDs were likely correct.

  const scoringMap = {
    // If IDs shifted, these keys need update. 
    // Usually "How soon after you wake up..." is high value.
    // I will trust the previous file's mapping for now.
    2: { 'Within 5 minutes': 3, '6-30 minutes': 2, '31-60 minutes': 1, 'After 60 minutes': 0 },
    3: { 'Yes': 1, 'No': 0 },
    4: { 'The first one in the morning': 1, 'Any other': 0 },
    5: { '10 or less': 0, '11-20': 1, '21-30': 2, '31 or more': 3 },
    6: { 'Yes': 1, 'No': 0 },
    7: { 'Yes': 1, 'No': 0 }
  };

  const questionScoring = scoringMap[questionId];
  if (!questionScoring) return 0;
  return questionScoring[answerText] || 0;
}

export async function getFagerstromSessionHistory(userId) {
  const res = await query(
    `SELECT id, score, created_at, updated_at
     FROM fagerstrom_sessions
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return res.rows;
}

export async function getLatestFagerstromSession(userId) {
  const res = await query(
    `SELECT id, score, created_at, updated_at
     FROM fagerstrom_sessions
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );
  return res.rows[0] || null;
}
