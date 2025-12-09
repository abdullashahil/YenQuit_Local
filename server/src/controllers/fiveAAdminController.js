import {
  getFiveAQuestions,
  getFiveAQuestionById,
  createFiveAQuestion,
  updateFiveAQuestion,
  softDeleteFiveAQuestion,
  reactivateFiveAQuestion,
  deleteFiveAQuestion
} from '../services/fiveAAdminService.js';

// Get all questions for a specific step
export async function getFiveAQuestionsByStep(req, res, next) {
  try {
    const { step } = req.query;
    const { include_inactive = false } = req.query;
    const userId = req.user?.userId;
    
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    
    const questions = await getFiveAQuestions(step, include_inactive === 'true');
    
    res.json({
      questions
    });
  } catch (err) {
    next(err);
  }
}

// Get a specific question by ID
export async function getFiveAQuestion(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    
    const question = await getFiveAQuestionById(parseInt(id));
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(question);
  } catch (err) {
    next(err);
  }
}

// Create a new question
export async function createFiveAQuestionController(req, res, next) {
  try {
    const userId = req.user?.userId;
    
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    
    const { question_text, question_type, options, step, tobacco_category } = req.body;
    
    if (!question_text || !question_type || !step) {
      return res.status(400).json({ error: 'Question text, type, and step are required' });
    }
    
    if (!['ask', 'advise', 'assess', 'assist', 'arrange'].includes(step)) {
      return res.status(400).json({ error: 'Invalid step. Must be one of: ask, advise, assess, assist, arrange' });
    }
    
    if (!['radio', 'text', 'textarea', 'checkbox'].includes(question_type)) {
      return res.status(400).json({ error: 'Invalid question type. Must be one of: radio, text, textarea, checkbox' });
    }
    
    if (question_type === 'radio' && (!options || options.length < 2)) {
      return res.status(400).json({ error: 'Radio questions must have at least 2 options' });
    }
    
    const question = await createFiveAQuestion({
      question_text: question_text.trim(),
      question_type,
      options: question_type === 'radio' ? options.filter(o => o.trim()) : null,
      step,
      tobacco_category: tobacco_category || 'smoked'
    });
    
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
}

// Update an existing question
export async function updateFiveAQuestionController(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    
    const { question_text, question_type, options, tobacco_category } = req.body;
    
    if (!question_text || !question_type) {
      return res.status(400).json({ error: 'Question text and type are required' });
    }
    
    if (!['radio', 'text', 'textarea', 'checkbox'].includes(question_type)) {
      return res.status(400).json({ error: 'Invalid question type. Must be one of: radio, text, textarea, checkbox' });
    }
    
    if (question_type === 'radio' && (!options || options.length < 2)) {
      return res.status(400).json({ error: 'Radio questions must have at least 2 options' });
    }
    
    const question = await updateFiveAQuestion(parseInt(id), {
      question_text: question_text.trim(),
      question_type,
      options: question_type === 'radio' ? options.filter(o => o.trim()) : null,
      tobacco_category
    });
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(question);
  } catch (err) {
    next(err);
  }
}

// Soft delete (deactivate) a question
export async function softDeleteFiveAQuestionController(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    
    const result = await softDeleteFiveAQuestion(parseInt(id));
    
    if (!result) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Reactivate a question
export async function reactivateFiveAQuestionController(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    
    const result = await reactivateFiveAQuestion(parseInt(id));
    
    if (!result) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Permanently delete a question
export async function deleteFiveAQuestionController(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    
    const result = await deleteFiveAQuestion(parseInt(id));
    
    if (!result) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(result);
  } catch (err) {
    next(err);
  }
}

