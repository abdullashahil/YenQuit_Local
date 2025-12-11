import { query, getClient } from '../db/index.js';

export async function getFagerstromQuestions(page = 1, limit = 50, isActiveOnly = true, tobaccoCategory = 'smoked') {
  const offset = (page - 1) * limit;
  const values = [limit, offset];
  const whereParts = [];
  let idx = 3;

  if (isActiveOnly) {
    whereParts.push('is_active = TRUE');
  }

  if (tobaccoCategory) {
    whereParts.push(`tobacco_category = $${idx}`);
    values.push(tobaccoCategory);
    idx++;
  }

  const whereClause = whereParts.length ? 'WHERE ' + whereParts.join(' AND ') : '';

  const res = await query(
    `SELECT id, question_text, options, is_active, created_at, updated_at, tobacco_category
       FROM fagerstrom_questions
       ${whereClause}
       ORDER BY id ASC
       LIMIT $1 OFFSET $2`,
    values
  );
  return res.rows;
}

export async function getFagerstromQuestionById(id) {
  const res = await query(
    'SELECT id, question_text, options, is_active, created_at, updated_at, tobacco_category FROM fagerstrom_questions WHERE id = $1',
    [id]
  );
  return res.rows[0];
}

export async function createFagerstromQuestion({ question_text, options, tobacco_category }) {
  if (!question_text || !Array.isArray(options) || options.length === 0) {
    throw new Error('question_text and non-empty options array are required');
  }
  const category = tobacco_category || 'smoked'; // Default to 'smoked' if not provided
  const res = await query(
    'INSERT INTO fagerstrom_questions (question_text, options, tobacco_category) VALUES ($1, $2, $3) RETURNING id, question_text, options, is_active, created_at, updated_at, tobacco_category',
    [question_text, JSON.stringify(options), category]
  );
  return res.rows[0];
}

export async function updateFagerstromQuestion(id, { question_text, options, is_active, tobacco_category }) {
  const fields = [];
  const values = [];
  let idx = 1;
  if (question_text !== undefined) { fields.push(`question_text = $${idx++}`); values.push(question_text); }
  if (options !== undefined) {
    if (!Array.isArray(options) || options.length === 0) throw new Error('options must be a non-empty array');
    fields.push(`options = $${idx++}`); values.push(JSON.stringify(options));
  }
  if (is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }
  if (tobacco_category !== undefined) {
    fields.push(`tobacco_category = $${idx++}`);
    values.push(tobacco_category);
  }
  fields.push(`updated_at = NOW()`);
  values.push(id);
  const sql = `UPDATE fagerstrom_questions SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, question_text, options, is_active, created_at, updated_at, tobacco_category`;
  const res = await query(sql, values);
  return res.rows[0];
}

export async function softDeleteFagerstromQuestion(id) {
  const res = await query(
    'UPDATE fagerstrom_questions SET is_active = FALSE, updated_at = NOW() WHERE id = $1 RETURNING id, is_active, updated_at',
    [id]
  );
  return res.rows[0];
}

export async function getFagerstromQuestionCount(isActiveOnly = true, tobaccoCategory = 'smoked') {
  const values = [];
  const whereParts = [];
  let idx = 1;

  if (isActiveOnly) {
    whereParts.push('is_active = TRUE');
  }

  if (tobaccoCategory) {
    whereParts.push(`tobacco_category = $${idx}`);
    values.push(tobaccoCategory);
    idx++;
  }

  const whereClause = whereParts.length ? 'WHERE ' + whereParts.join(' AND ') : '';
  const res = await query(`SELECT COUNT(*) as count FROM fagerstrom_questions ${whereClause}`, values);
  return parseInt(res.rows[0].count, 10);
}

export async function getFagerstromUserAnswers(userId, sessionId = null) {
  let queryText, queryParams;

  if (sessionId) {
    // Get answers for a specific session
    queryText = `SELECT question_id, answer_text, created_at, updated_at, session_ref
     FROM fagerstrom_user_answers
     WHERE user_id = $1 AND session_ref = $2
     ORDER BY question_id ASC`;
    queryParams = [userId, sessionId];
  } else {
    // Get answers from the most recent session
    queryText = `SELECT fua.question_id, fua.answer_text, fua.created_at, fua.updated_at, fua.session_ref
     FROM fagerstrom_user_answers fua
     INNER JOIN fagerstrom_sessions fs ON fua.session_ref = fs.id
     WHERE fua.user_id = $1
     AND fs.id = (
       SELECT id FROM fagerstrom_sessions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1
     )
     ORDER BY fua.question_id ASC`;
    queryParams = [userId];
  }

  const res = await query(queryText, queryParams);
  return res.rows;
}

export async function saveFagerstromAnswers(userId, answers) {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Create a new session for this test
    const sessionResult = await client.query(
      `INSERT INTO fagerstrom_sessions (user_id) VALUES ($1) RETURNING id`,
      [userId]
    );
    const sessionId = sessionResult.rows[0].id;

    // Calculate Fagerstrom score based on answers
    let score = 0;

    for (const answer of answers) {
      const { question_id, answer_text } = answer;

      // Insert answer linked to the session
      await client.query(
        `INSERT INTO fagerstrom_user_answers (user_id, question_id, answer_text, session_ref)
         VALUES ($1, $2, $3, $4)`,
        [userId, question_id, answer_text, sessionId]
      );

      // Calculate score based on standard Fagerstrom scoring
      // This is a simplified version - adjust based on your actual questions
      score += calculateAnswerScore(question_id, answer_text);
    }

    // Update the session with the calculated score
    await client.query(
      `UPDATE fagerstrom_sessions SET score = $1 WHERE id = $2`,
      [score, sessionId]
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

// Helper function to calculate score for each answer
function calculateAnswerScore(questionId, answerText) {
  // Standard Fagerstrom Test scoring
  // Adjust these mappings based on your actual question IDs and answer options
  const scoringMap = {
    1: { // How soon after waking do you smoke?
      'Within 5 minutes': 3,
      '6-30 minutes': 2,
      '31-60 minutes': 1,
      'After 60 minutes': 0
    },
    2: { // Do you find it difficult to refrain from smoking in places where it is forbidden?
      'Yes': 1,
      'No': 0
    },
    3: { // Which cigarette would you hate most to give up?
      'The first one in the morning': 1,
      'Any other': 0
    },
    4: { // How many cigarettes per day do you smoke?
      '10 or less': 0,
      '11-20': 1,
      '21-30': 2,
      '31 or more': 3
    },
    5: { // Do you smoke more frequently during the first hours after waking?
      'Yes': 1,
      'No': 0
    },
    6: { // Do you smoke if you are so ill that you are in bed most of the day?
      'Yes': 1,
      'No': 0
    }
  };

  const questionScoring = scoringMap[questionId];
  if (!questionScoring) return 0;

  return questionScoring[answerText] || 0;
}

// Get all sessions for a user with scores
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

// Get the latest session with score
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
