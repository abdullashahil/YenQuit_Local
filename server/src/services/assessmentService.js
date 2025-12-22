import { query } from '../db/index.js';

// Get assessment questions with filtering
export async function getAssessmentQuestions({ category, step, tobacco_category, include_inactive = false }) {
    try {
        let sql = `
      SELECT 
        id,
        category,
        question_text,
        question_type,
        options,
        display_order,
        is_required,
        is_active,
        metadata,
        created_at,
        updated_at
      FROM assessment_questions
      WHERE 1=1
    `;

        const params = [];
        let paramIndex = 1;

        // Filter by category (fivea or fagerstrom)
        if (category) {
            sql += ` AND category = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }

        // Filter by step (only for fivea category)
        if (step) {
            sql += ` AND metadata->>'step' = $${paramIndex}`;
            params.push(step);
            paramIndex++;
        }

        // Filter by tobacco_category
        if (tobacco_category) {
            sql += ` AND metadata->>'tobacco_category' = $${paramIndex}`;
            params.push(tobacco_category);
            paramIndex++;
        }

        // Filter by active status
        if (!include_inactive) {
            sql += ` AND is_active = true`;
        }

        sql += ` ORDER BY is_active DESC, display_order ASC, created_at ASC`;

        const result = await query(sql, params);
        return result.rows;
    } catch (error) {
        console.error('Error in getAssessmentQuestions service:', error);
        throw error;
    }
}

// Get a single question by ID
export async function getAssessmentQuestionById(id) {
    try {
        const result = await query(
            `SELECT 
        id,
        category,
        question_text,
        question_type,
        options,
        display_order,
        is_required,
        is_active,
        metadata,
        created_at,
        updated_at
      FROM assessment_questions
      WHERE id = $1`,
            [id]
        );

        return result.rows[0] || null;
    } catch (error) {
        console.error('Error in getAssessmentQuestionById service:', error);
        throw error;
    }
}

// Create a new assessment question
export async function createAssessmentQuestion({ question_text, question_type, options, step, tobacco_category, display_order, category }) {
    try {
        // Use category from request, or determine based on step if not provided (for backward compatibility)
        const questionCategory = category || (step ? 'fivea' : 'fagerstrom');

        // Build metadata object
        const metadata = {
            tobacco_category: tobacco_category || 'smoked'
        };

        // Add step only for fivea questions
        if (step) {
            metadata.step = step;
        }

        const result = await query(
            `INSERT INTO assessment_questions 
        (category, question_text, question_type, options, display_order, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
        id,
        category,
        question_text,
        question_type,
        options,
        display_order,
        is_required,
        is_active,
        metadata,
        created_at,
        updated_at`,
            [questionCategory, question_text, question_type, JSON.stringify(options || []), display_order || 1, JSON.stringify(metadata)]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Error in createAssessmentQuestion service:', error);
        throw error;
    }
}

// Update an assessment question
export async function updateAssessmentQuestion(id, updateData) {
    try {
        const existingQuestion = await getAssessmentQuestionById(id);
        if (!existingQuestion) return null;

        // Build update query dynamically
        const updates = [];
        const params = [];
        let paramIndex = 1;

        if (updateData.question_text !== undefined) {
            updates.push(`question_text = $${paramIndex}`);
            params.push(updateData.question_text);
            paramIndex++;
        }

        if (updateData.question_type !== undefined) {
            updates.push(`question_type = $${paramIndex}`);
            params.push(updateData.question_type);
            paramIndex++;
        }

        if (updateData.options !== undefined) {
            updates.push(`options = $${paramIndex}`);
            params.push(JSON.stringify(updateData.options));
            paramIndex++;
        }

        if (updateData.display_order !== undefined) {
            updates.push(`display_order = $${paramIndex}`);
            params.push(updateData.display_order);
            paramIndex++;
        }

        // Handle is_active field for toggle functionality
        if (updateData.is_active !== undefined) {
            updates.push(`is_active = $${paramIndex}`);
            params.push(updateData.is_active);
            paramIndex++;
        }

        // Update metadata if step or tobacco_category changed
        if (updateData.step !== undefined || updateData.tobacco_category !== undefined) {
            const newMetadata = { ...existingQuestion.metadata };
            if (updateData.step !== undefined) newMetadata.step = updateData.step;
            if (updateData.tobacco_category !== undefined) newMetadata.tobacco_category = updateData.tobacco_category;

            updates.push(`metadata = $${paramIndex}`);
            params.push(JSON.stringify(newMetadata));
            paramIndex++;
        }

        updates.push(`updated_at = NOW()`);

        if (updates.length === 1) { // Only updated_at
            return existingQuestion;
        }

        params.push(id);

        const sql = `
      UPDATE assessment_questions
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING 
        id,
        category,
        question_text,
        question_type,
        options,
        display_order,
        is_required,
        is_active,
        metadata,
        created_at,
        updated_at
    `;

        const result = await query(sql, params);
        return result.rows[0];
    } catch (error) {
        console.error('Error in updateAssessmentQuestion service:', error);
        throw error;
    }
}

// Soft delete (deactivate) a question
export async function softDeleteAssessmentQuestion(id) {
    try {
        const result = await query(
            `UPDATE assessment_questions
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
      RETURNING id`,
            [id]
        );

        return result.rows[0] || null;
    } catch (error) {
        console.error('Error in softDeleteAssessmentQuestion service:', error);
        throw error;
    }
}

// Permanently delete a question
export async function deleteAssessmentQuestion(id) {
    try {
        const result = await query(
            `DELETE FROM assessment_questions
      WHERE id = $1
      RETURNING id`,
            [id]
        );

        return result.rows[0] || null;
    } catch (error) {
        console.error('Error in deleteAssessmentQuestion service:', error);
        throw error;
    }
}
