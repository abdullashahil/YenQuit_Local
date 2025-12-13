import { query } from '../db/index.js';

const mapQuestion = (row) => ({
  id: row.id,
  question_text: row.question_text,
  placeholder: row.metadata?.placeholder,
  question_type: row.question_type,
  display_order: row.display_order,
  is_active: row.is_active,
  created_at: row.created_at,
  updated_at: row.updated_at
});

export async function getPersonalRoadblockQuestions() {
  const result = await query(
    `SELECT id, question_text, question_type, display_order, is_active, created_at, updated_at, metadata
     FROM assessment_questions
     WHERE category = 'personal_roadblock' AND is_active = TRUE
     ORDER BY display_order ASC, id ASC`
  );
  return result.rows.map(mapQuestion);
}

// Updated to use user_assessment_responses
export async function getUserPersonalRoadblocks(userId) {
  const result = await query(
    `SELECT uar.id, uar.question_id, uar.response_data as response, prq.question_text, prq.question_type, prq.metadata->>'placeholder' as placeholder
     FROM user_assessment_responses uar
     JOIN assessment_questions prq ON uar.question_id = prq.id
     WHERE uar.user_id = $1 AND prq.category = 'personal_roadblock' AND prq.is_active = TRUE
     ORDER BY prq.display_order ASC, prq.id ASC`,
    [userId]
  );
  // normalize response (remove quotes if needed)
  return result.rows.map(r => ({
    ...r,
    response: typeof r.response === 'string' ? JSON.parse(r.response) : r.response
  }));
}

// Updated to use user_assessment_responses
export async function saveUserPersonalRoadblock(userId, questionId, response) {
  const result = await query(
    `INSERT INTO user_assessment_responses (user_id, question_id, response_data, created_at, updated_at)
     VALUES ($1, $2, $3, NOW(), NOW())
     ON CONFLICT (user_id, question_id) 
     DO UPDATE SET response_data = $3, updated_at = NOW()
     RETURNING id, user_id, question_id, response_data, created_at, updated_at`,
    [userId, questionId, JSON.stringify(response)]
  );
  return result.rows[0];
}

// Updated to use user_assessment_responses
export async function deleteUserPersonalRoadblock(userId, questionId) {
  const result = await query(
    `DELETE FROM user_assessment_responses 
     WHERE user_id = $1 AND question_id = $2
     RETURNING id, user_id, question_id, response_data, created_at, updated_at`,
    [userId, questionId]
  );
  return result.rows[0];
}

// Admin functions for managing questions
export async function createPersonalRoadblockQuestion(questionData) {
  const { question_text, placeholder, question_type, display_order = 0 } = questionData;
  const result = await query(
    `INSERT INTO assessment_questions (category, question_text, question_type, display_order, metadata)
     VALUES ('personal_roadblock', $1, $2, $3, $4)
     RETURNING id, question_text, question_type, display_order, is_active, created_at, updated_at, metadata`,
    [question_text, question_type, display_order, JSON.stringify({ placeholder })]
  );
  return mapQuestion(result.rows[0]);
}

export async function updatePersonalRoadblockQuestion(id, questionData) {
  const { question_text, placeholder, question_type, display_order, is_active } = questionData;

  const fields = [];
  const values = [];
  let idx = 1;
  const metaUpdates = {};

  if (question_text !== undefined) { fields.push(`question_text = $${idx++}`); values.push(question_text); }
  if (question_type !== undefined) { fields.push(`question_type = $${idx++}`); values.push(question_type); }
  if (display_order !== undefined) { fields.push(`display_order = $${idx++}`); values.push(display_order); }
  if (is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }

  if (placeholder !== undefined) metaUpdates.placeholder = placeholder;

  if (Object.keys(metaUpdates).length > 0) {
    fields.push(`metadata = metadata || $${idx++}`);
    values.push(JSON.stringify(metaUpdates));
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await query(
    `UPDATE assessment_questions 
     SET ${fields.join(', ')}
     WHERE id = $${idx} AND category = 'personal_roadblock'
     RETURNING id, question_text, question_type, display_order, is_active, created_at, updated_at, metadata`,
    values
  );
  return result.rows[0] ? mapQuestion(result.rows[0]) : null;
}

export async function deletePersonalRoadblockQuestion(id) {
  const result = await query(
    `UPDATE assessment_questions 
     SET is_active = FALSE, updated_at = NOW()
     WHERE id = $1 AND category = 'personal_roadblock'
     RETURNING id, question_text, question_type, display_order, is_active, created_at, updated_at, metadata`,
    [id]
  );
  return result.rows[0] ? mapQuestion(result.rows[0]) : null;
}
