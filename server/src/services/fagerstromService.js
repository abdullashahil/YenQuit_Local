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

export async function getFagerstromUserAnswers(userId) {
  const res = await query(
    `SELECT question_id, answer_text, created_at, updated_at
     FROM fagerstrom_user_answers
     WHERE user_id = $1
     ORDER BY question_id ASC`,
    [userId]
  );
  return res.rows;
}

export async function saveFagerstromAnswers(userId, answers) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    
    for (const answer of answers) {
      const { question_id, answer_text } = answer;
      
      // Insert or update answer
      await client.query(
        `INSERT INTO fagerstrom_user_answers (user_id, question_id, answer_text)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, question_id) 
         DO UPDATE SET answer_text = EXCLUDED.answer_text, updated_at = NOW()`,
        [userId, question_id, answer_text]
      );
    }
    
    await client.query('COMMIT');
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
