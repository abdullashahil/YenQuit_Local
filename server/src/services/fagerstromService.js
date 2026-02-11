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

  // Validate/Format options
  const formattedOptions = options.map(opt => {
    if (typeof opt === 'string') return { text: opt, score: 0 };
    if (typeof opt === 'object' && opt.text) return { text: opt.text, score: parseInt(opt.score) || 0 };
    throw new Error('Invalid option format: must be string or object with text property');
  });

  const category = tobacco_category || 'smoked';
  const res = await query(
    `INSERT INTO assessment_questions (category, question_text, options, metadata) 
     VALUES ('fagerstrom', $1, $2, $3) 
     RETURNING id, question_text, options, is_active, created_at, updated_at, metadata`,
    [question_text, JSON.stringify(formattedOptions), JSON.stringify({ tobacco_category: category })]
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

    // Validate/Format options
    const formattedOptions = options.map(opt => {
      if (typeof opt === 'string') return { text: opt, score: 0 };
      if (typeof opt === 'object' && opt.text) return { text: opt.text, score: parseInt(opt.score) || 0 };
      throw new Error('Invalid option format: must be string or object with text property');
    });

    fields.push(`options = $${idx++}`); values.push(JSON.stringify(formattedOptions));
  }
  if (is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }

  let newMetadata = { tobacco_category: current.tobacco_category };
  if (tobacco_category !== undefined) {
    newMetadata.tobacco_category = tobacco_category;
  }

  // Ensure metadata is updated if changed or if we need to set it (when other fields change but metadata relies on current)
  // Actually, we only update metadata if tobacco_category changes.
  if (tobacco_category !== undefined) {
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
  // normalize response_data (handle both string and JSON formats)
  return res.rows.map(r => ({
    ...r,
    answer_text: typeof r.answer_text === 'string' ?
      (r.answer_text.startsWith('"') || r.answer_text.startsWith('[') || r.answer_text.startsWith('{') ?
        JSON.parse(r.answer_text) : r.answer_text) :
      r.answer_text
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
      const answerScore = await calculateAnswerScore(question_id, answer_text);
      score += answerScore;
    }

    // 1b. Calculate Maximum Possible Score
    const questionIds = answers.map(a => a.question_id);
    const maxScore = await calculateMaxScore(questionIds);

    // 2. Save Session Record (History of attempts) -> NOW USING fivea_history
    // We store stage='fagerstrom' and history_data={ score: score, maxScore: maxScore }
    const sessionResult = await client.query(
      `INSERT INTO fivea_history (user_id, stage, history_data, created_at) 
       VALUES ($1, 'fagerstrom', $2, NOW()) 
       RETURNING id`,
      [userId, JSON.stringify({ score, maxScore })]
    );
    const sessionId = sessionResult.rows[0].id;

    // 3. Save Answers (Current State)
    for (const answer of answers) {
      const { question_id, answer_text } = answer;
      // We upsert answers to reflect current status
      await client.query(
        `INSERT INTO user_assessment_responses (user_id, question_id, response_data, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         ON CONFLICT (user_id, question_id, assessment_context) 
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
    return { success: true, sessionId, score, maxScore };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Dynamic scoring function that fetches scores from the database
async function calculateAnswerScore(questionId, answerText) {
  try {
    // Fetch the question's options from the database
    const res = await query(
      'SELECT options FROM assessment_questions WHERE id = $1',
      [questionId]
    );

    if (!res.rows[0] || !res.rows[0].options) {
      console.warn(`No options found for question ID ${questionId}`);
      return 0;
    }

    // Parse the options JSONB data
    const options = res.rows[0].options;

    // Find the matching option by text and return its score
    const matchingOption = options.find(opt => opt.text === answerText);

    if (matchingOption && matchingOption.score !== undefined) {
      return parseInt(matchingOption.score) || 0;
    }

    console.warn(`No matching option found for question ID ${questionId} with answer "${answerText}"`);
    return 0;
  } catch (error) {
    console.error(`Error calculating score for question ${questionId}:`, error);
    return 0;
  }
}

// Calculate the maximum possible score from a set of questions
async function calculateMaxScore(questionIds) {
  try {
    if (!questionIds || questionIds.length === 0) {
      return 0;
    }

    // Fetch all questions' options in one query
    const res = await query(
      'SELECT id, options FROM assessment_questions WHERE id = ANY($1)',
      [questionIds]
    );

    let maxScore = 0;
    for (const row of res.rows) {
      if (row.options && Array.isArray(row.options)) {
        // Find the maximum score among all options for this question
        const questionMaxScore = Math.max(...row.options.map(opt => parseInt(opt.score) || 0));
        maxScore += questionMaxScore;
      }
    }

    return maxScore;
  } catch (error) {
    console.error('Error calculating max score:', error);
    return 0;
  }
}

export async function getFagerstromSessionHistory(userId) {
  const res = await query(
    `SELECT id, (history_data->>'score')::int as score, created_at, updated_at
     FROM fivea_history
     WHERE user_id = $1 AND stage = 'fagerstrom'
     ORDER BY created_at DESC`,
    [userId]
  );
  return res.rows;
}

export async function getLatestFagerstromSession(userId) {
  const res = await query(
    `SELECT id, (history_data->>'score')::int as score, created_at, updated_at
     FROM fivea_history
     WHERE user_id = $1 AND stage = 'fagerstrom'
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );
  return res.rows[0] || null;
}
