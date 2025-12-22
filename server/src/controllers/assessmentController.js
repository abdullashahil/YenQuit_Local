import {
    getAssessmentQuestions,
    getAssessmentQuestionById,
    createAssessmentQuestion,
    updateAssessmentQuestion,
    softDeleteAssessmentQuestion,
    deleteAssessmentQuestion
} from '../services/assessmentService.js';

// Get assessment questions with filtering
export async function getAssessmentQuestionsController(req, res, next) {
    try {
        const { category, step, tobacco_category, include_inactive = 'false' } = req.query;
        const userId = req.user?.userId;

        if (!userId) return res.status(401).json({ error: 'User not authenticated' });

        const questions = await getAssessmentQuestions({
            category,
            step,
            tobacco_category,
            include_inactive: include_inactive === 'true'
        });

        res.json({
            success: true,
            questions
        });
    } catch (err) {
        console.error('Error in getAssessmentQuestionsController:', err);
        next(err);
    }
}

// Get a specific question by ID
export async function getAssessmentQuestionController(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) return res.status(401).json({ error: 'User not authenticated' });

        const question = await getAssessmentQuestionById(parseInt(id));

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json(question);
    } catch (err) {
        console.error('Error in getAssessmentQuestionController:', err);
        next(err);
    }
}

// Create a new question
export async function createAssessmentQuestionController(req, res, next) {
    try {
        const userId = req.user?.userId;

        if (!userId) return res.status(401).json({ error: 'User not authenticated' });

        const { question_text, question_type, options, step, tobacco_category, display_order, category } = req.body;

        if (!question_text || !question_type) {
            return res.status(400).json({ error: 'Question text and type are required' });
        }

        if (!['multiple_choice', 'checkboxes', 'short_text', 'long_text'].includes(question_type)) {
            return res.status(400).json({ error: 'Invalid question type. Must be one of: multiple_choice, checkboxes, short_text, long_text' });
        }

        if ((question_type === 'multiple_choice' || question_type === 'checkboxes') && (!options || options.length < 1)) {
            return res.status(400).json({ error: 'Multiple choice and checkbox questions must have at least 1 option' });
        }

        // Handle options - they can be strings (5A) or objects with text and score (Fagerström)
        let processedOptions = [];
        if (question_type === 'multiple_choice' || question_type === 'checkboxes') {
            processedOptions = options.filter(o => {
                // If option is a string, check if it's not empty
                if (typeof o === 'string') return o.trim();
                // If option is an object, check if text is not empty
                if (typeof o === 'object' && o.text) return o.text.trim();
                return false;
            });
        }

        const question = await createAssessmentQuestion({
            question_text: question_text.trim(),
            question_type,
            options: processedOptions,
            step,
            tobacco_category: tobacco_category || 'smoked',
            display_order: display_order || 1,
            category: category  // Pass category to service
        });

        res.status(201).json(question);
    } catch (err) {
        console.error('Error in createAssessmentQuestionController:', err);
        next(err);
    }
}

// Update an existing question
export async function updateAssessmentQuestionController(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) return res.status(401).json({ error: 'User not authenticated' });

        const { question_text, question_type, options, step, tobacco_category, display_order, is_active } = req.body;

        const updateData = {};

        if (question_text) updateData.question_text = question_text.trim();
        if (question_type) {
            if (!['multiple_choice', 'checkboxes', 'short_text', 'long_text'].includes(question_type)) {
                return res.status(400).json({ error: 'Invalid question type' });
            }
            updateData.question_type = question_type;
        }
        if (options !== undefined) updateData.options = options.filter(o => o.trim());
        if (step) updateData.step = step;
        if (tobacco_category) updateData.tobacco_category = tobacco_category;
        if (display_order !== undefined) updateData.display_order = display_order;
        if (is_active !== undefined) updateData.is_active = is_active;

        const question = await updateAssessmentQuestion(parseInt(id), updateData);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json(question);
    } catch (err) {
        console.error('Error in updateAssessmentQuestionController:', err);
        next(err);
    }
}

// Soft delete (deactivate) a question
export async function softDeleteAssessmentQuestionController(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) return res.status(401).json({ error: 'User not authenticated' });

        const result = await softDeleteAssessmentQuestion(parseInt(id));

        if (!result) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json({ success: true, message: 'Question deactivated successfully' });
    } catch (err) {
        console.error('Error in softDeleteAssessmentQuestionController:', err);
        next(err);
    }
}

// Permanently delete a question
export async function deleteAssessmentQuestionController(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) return res.status(401).json({ error: 'User not authenticated' });

        const result = await deleteAssessmentQuestion(parseInt(id));

        if (!result) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json({ success: true, message: 'Question deleted successfully' });
    } catch (err) {
        console.error('Error in deleteAssessmentQuestionController:', err);
        next(err);
    }
}
