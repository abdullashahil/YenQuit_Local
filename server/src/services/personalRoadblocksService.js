import { query } from '../db/index.js';

export async function getPersonalRoadblockQuestions() {
  const result = await query(
    `SELECT id, question_text, placeholder, question_type, display_order
     FROM personal_roadblock_questions
     WHERE is_active = TRUE
     ORDER BY display_order ASC, id ASC`
  );
  return result.rows;
}

export async function getUserPersonalRoadblocks(userId) {
  const result = await query(
    `SELECT upr.id, upr.question_id, upr.response, prq.question_text, prq.question_type
     FROM user_personal_roadblocks upr
     JOIN personal_roadblock_questions prq ON upr.question_id = prq.id
     WHERE upr.user_id = $1 AND prq.is_active = TRUE
     ORDER BY prq.display_order ASC, prq.id ASC`,
    [userId]
  );
  return result.rows;
}

export async function saveUserPersonalRoadblock(userId, questionId, response) {
  const result = await query(
    `INSERT INTO user_personal_roadblocks (user_id, question_id, response)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, question_id) 
     DO UPDATE SET response = $3, updated_at = CURRENT_TIMESTAMP
     RETURNING id, user_id, question_id, response, created_at, updated_at`,
    [userId, questionId, response]
  );
  return result.rows[0];
}

export async function deleteUserPersonalRoadblock(userId, questionId) {
  const result = await query(
    `DELETE FROM user_personal_roadblocks 
     WHERE user_id = $1 AND question_id = $2
     RETURNING id, user_id, question_id, response, created_at, updated_at`,
    [userId, questionId]
  );
  return result.rows[0];
}

// Admin functions for managing questions
export async function createPersonalRoadblockQuestion(questionData) {
  const { question_text, placeholder, question_type, display_order = 0 } = questionData;
  const result = await query(
    `INSERT INTO personal_roadblock_questions (question_text, placeholder, question_type, display_order)
     VALUES ($1, $2, $3, $4)
     RETURNING id, question_text, placeholder, question_type, display_order, is_active, created_at, updated_at`,
    [question_text, placeholder, question_type, display_order]
  );
  return result.rows[0];
}

export async function updatePersonalRoadblockQuestion(id, questionData) {
  const { question_text, placeholder, question_type, display_order, is_active } = questionData;
  const result = await query(
    `UPDATE personal_roadblock_questions 
     SET question_text = $1, placeholder = $2, question_type = $3, display_order = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING id, question_text, placeholder, question_type, display_order, is_active, created_at, updated_at`,
    [question_text, placeholder, question_type, display_order, is_active, id]
  );
  return result.rows[0];
}

export async function deletePersonalRoadblockQuestion(id) {
  const result = await query(
    `UPDATE personal_roadblock_questions 
     SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id, question_text, placeholder, question_type, display_order, is_active, created_at, updated_at`,
    [id]
  );
  return result.rows[0];
}
