import * as fagerstromService from '../services/fagerstromService.js';
import UserModel from '../models/UserModel.js';

export async function getFagerstromQuestions(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 200);
    const isActiveOnly = req.query.active !== 'false';
    
    // Get user's tobacco type for filtering
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const profile = await UserModel.getProfileByUserId(userId);
    const tobaccoType = profile?.tobacco_type || 'smoked'; // Default to 'smoked' if no profile
    
    // Map tobacco_type to tobacco_category
    // - smokeless -> smokeless
    // - smoked, both, null, anything else -> smoked
    const tobaccoCategory = tobaccoType === 'smokeless' ? 'smokeless' : 'smoked';
    
    const questions = await fagerstromService.getFagerstromQuestions(page, limit, isActiveOnly, tobaccoCategory);
    const total = await fagerstromService.getFagerstromQuestionCount(isActiveOnly, tobaccoCategory);
    res.json({
      questions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    next(err);
  }
}

export async function getFagerstromQuestionById(req, res, next) {
  try {
    const { id } = req.params;
    const question = await fagerstromService.getFagerstromQuestionById(id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
  } catch (err) {
    next(err);
  }
}

export async function createFagerstromQuestion(req, res, next) {
  try {
    const { question_text, options, tobacco_category } = req.body;
    if (!question_text || !Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ error: 'question_text and non-empty options array are required' });
    }
    const created = await fagerstromService.createFagerstromQuestion({ question_text, options, tobacco_category });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function updateFagerstromQuestion(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const updated = await fagerstromService.updateFagerstromQuestion(id, payload);
    if (!updated) return res.status(404).json({ error: 'Question not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function softDeleteFagerstromQuestion(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await fagerstromService.softDeleteFagerstromQuestion(id);
    if (!deleted) return res.status(404).json({ error: 'Question not found' });
    res.json({ message: 'Question soft-deleted', id: deleted.id, is_active: deleted.is_active });
  } catch (err) {
    next(err);
  }
}

export async function getFagerstromUserAnswers(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const answers = await fagerstromService.getFagerstromUserAnswers(userId);
    res.json({ answers });
  } catch (err) {
    next(err);
  }
}

export async function saveFagerstromAnswers(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const { answers } = req.body;
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'answers array is required' });
    }
    
    const result = await fagerstromService.saveFagerstromAnswers(userId, answers);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
