import { query } from '../db/index.js';

// Get all questions for a specific step
export async function getFiveAQuestions(step, includeInactive = false) {
  const sql = `
    SELECT id, step, question_text, question_type, options, tobacco_category, content_type, content_data, is_active, created_at, updated_at
    FROM fivea_questions
    WHERE step = $1
    ${includeInactive ? '' : 'AND is_active = true'}
    ORDER BY created_at ASC, id ASC
  `;
  
  const result = await query(sql, [step]);
  
  return result.rows.map(row => ({
    ...row,
    options: row.options && row.options.length > 0 ? row.options : null
  }));
}

// Get a specific question by ID
export async function getFiveAQuestionById(id) {
  const sql = `
    SELECT id, step, question_text, question_type, options, tobacco_category, content_type, content_data, is_active, created_at, updated_at
    FROM fivea_questions
    WHERE id = $1
  `;
  
  const result = await query(sql, [id]);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const row = result.rows[0];
  return {
    ...row,
    options: row.options && row.options.length > 0 ? row.options : null
  };
}

// Create a new question
export async function createFiveAQuestion({ question_text, question_type, options, step, tobacco_category }) {
  const sql = `
    INSERT INTO fivea_questions (question_text, question_type, options, step, tobacco_category, is_active)
    VALUES ($1, $2, $3, $4, $5, true)
    RETURNING id, step, question_text, question_type, options, tobacco_category, content_type, content_data, is_active, created_at, updated_at
  `;
  
  const result = await query(sql, [
    question_text,
    question_type,
    question_type === 'radio' && options ? options : [],
    step,
    tobacco_category || 'smoked'
  ]);
  
  const row = result.rows[0];
  return {
    ...row,
    options: row.options && row.options.length > 0 ? row.options : null
  };
}

// Update an existing question
export async function updateFiveAQuestion(id, { question_text, question_type, options, tobacco_category }) {
  // Get current question to check if it exists
  const currentQuestion = await getFiveAQuestionById(id);
  if (!currentQuestion) {
    return null;
  }
  
  const sql = `
    UPDATE fivea_questions
    SET question_text = $1, question_type = $2, options = $3, tobacco_category = $4, updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING id, step, question_text, question_type, options, tobacco_category, content_type, content_data, is_active, created_at, updated_at
  `;
  
  const result = await query(sql, [
    question_text,
    question_type,
    question_type === 'radio' && options ? options : [],
    tobacco_category || currentQuestion.tobacco_category,
    id
  ]);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const row = result.rows[0];
  return {
    ...row,
    options: row.options && row.options.length > 0 ? row.options : null
  };
}

// Soft delete (deactivate) a question
export async function softDeleteFiveAQuestion(id) {
  const sql = `
    UPDATE fivea_questions
    SET is_active = false, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id
  `;
  
  const result = await query(sql, [id]);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return { message: 'Question deactivated successfully' };
}

// Reactivate a question
export async function reactivateFiveAQuestion(id) {
  const sql = `
    UPDATE fivea_questions
    SET is_active = true, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id
  `;
  
  const result = await query(sql, [id]);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return { message: 'Question reactivated successfully' };
}

// Permanently delete a question
export async function deleteFiveAQuestion(id) {
  // Check if question exists
  const question = await getFiveAQuestionById(id);
  if (!question) {
    return null;
  }
  
  // Delete the question
  await query('DELETE FROM fivea_questions WHERE id = $1', [id]);
  
  return { message: 'Question deleted successfully' };
}

