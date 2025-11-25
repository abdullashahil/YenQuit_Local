import { query, getClient } from '../db/index.js';

export async function getFagerstromQuestions(page = 1, limit = 50, isActiveOnly = true) {
  const offset = (page - 1) * limit;
  const whereClause = isActiveOnly ? 'WHERE is_active = TRUE' : '';
  const res = await query(
    `SELECT id, question_text, options, is_active, created_at, updated_at
       FROM fagerstrom_questions
       ${whereClause}
       ORDER BY id ASC
       LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return res.rows;
}

export async function getFagerstromQuestionById(id) {
  const res = await query(
    'SELECT id, question_text, options, is_active, created_at, updated_at FROM fagerstrom_questions WHERE id = $1',
    [id]
  );
  return res.rows[0];
}

export async function createFagerstromQuestion({ question_text, options }) {
  if (!question_text || !Array.isArray(options) || options.length === 0) {
    throw new Error('question_text and non-empty options array are required');
  }
  const res = await query(
    'INSERT INTO fagerstrom_questions (question_text, options) VALUES ($1, $2) RETURNING id, question_text, options, is_active, created_at, updated_at',
    [question_text, JSON.stringify(options)]
  );
  return res.rows[0];
}

export async function updateFagerstromQuestion(id, { question_text, options, is_active }) {
  const fields = [];
  const values = [];
  let idx = 1;
  if (question_text !== undefined) { fields.push(`question_text = $${idx++}`); values.push(question_text); }
  if (options !== undefined) {
    if (!Array.isArray(options) || options.length === 0) throw new Error('options must be a non-empty array');
    fields.push(`options = $${idx++}`); values.push(JSON.stringify(options));
  }
  if (is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }
  fields.push(`updated_at = NOW()`);
  values.push(id);
  const sql = `UPDATE fagerstrom_questions SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, question_text, options, is_active, created_at, updated_at`;
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

export async function getFagerstromQuestionCount(isActiveOnly = true) {
  const whereClause = isActiveOnly ? 'WHERE is_active = TRUE' : '';
  const res = await query(`SELECT COUNT(*) as count FROM fagerstrom_questions ${whereClause}`);
  return parseInt(res.rows[0].count, 10);
}
