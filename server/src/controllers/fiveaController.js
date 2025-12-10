import * as fiveaService from '../services/fiveaService.js';
import * as userService from '../services/userService.js';
import UserModel from '../models/UserModel.js';
import axios from 'axios';

export async function getQuestionsByStep(req, res, next) {
  try {
    const { step } = req.params;
    if (!step) return res.status(400).json({ error: 'step is required' });

    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const profile = await UserModel.getProfileByUserId(userId);
    const tobaccoType = profile?.tobacco_type || 'smoked';

    let tobaccoCategory;
    if (tobaccoType === 'smokeless') {
      tobaccoCategory = 'smokeless';
    } else {
      tobaccoCategory = 'smoked';
    }

    const questions = await fiveaService.getQuestionsByStep(step, tobaccoCategory);
    res.json({ questions, tobacco_type: tobaccoType });
  } catch (err) {
    next(err);
  }
}

export async function getAllQuestions(req, res, next) {
  try {
    const questions = await fiveaService.getAllQuestions();
    res.json({ questions });
  } catch (err) {
    next(err);
  }
}

export async function createQuestion(req, res, next) {
  try {
    const { step, question_text, options } = req.body;
    if (!step || !question_text || !Array.isArray(options)) {
      return res.status(400).json({ error: 'step, question_text, and options (array) are required' });
    }
    const created = await fiveaService.createQuestion({ step, question_text, options });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function updateQuestion(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const updated = await fiveaService.updateQuestion(Number(id), payload);
    if (!updated) return res.status(404).json({ error: 'Question not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteQuestion(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await fiveaService.deleteQuestion(Number(id));
    if (!deleted) return res.status(404).json({ error: 'Question not found' });
    res.json({ message: 'Question deleted', id: deleted.id });
  } catch (err) {
    next(err);
  }
}

export async function saveAnswers(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { answers } = req.body;
    if (!Array.isArray(answers) || !answers.length) {
      return res.status(400).json({ error: 'answers array is required' });
    }
    const invalid = answers.find(a => !a.question_id || a.answer === undefined);
    if (invalid) return res.status(400).json({ error: 'Each answer must include question_id and answer' });
    await fiveaService.saveUserAnswers(userId, answers);
    res.json({ message: 'Answers saved' });
  } catch (err) {
    next(err);
  }
}

export async function getUserAnswers(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { step } = req.params;
    if (!step) return res.status(400).json({ error: 'step is required' });
    const answers = await fiveaService.getUserAnswers(userId, step);
    res.json({ answers });
  } catch (err) {
    next(err);
  }
}

export async function getAllUserAnswersForUser(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const answers = await fiveaService.getAllUserAnswersForUser(userId);
    res.json({ success: true, data: answers });
  } catch (err) {
    next(err);
  }
}

export async function getAllUserAnswers(req, res, next) {
  try {
    const answers = await fiveaService.getAllUserAnswers();
    res.json({ answers });
  } catch (err) {
    next(err);
  }
}

export async function submitAsk(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { answers } = req.body;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'answers object is required' });
    }
    const severity = await fiveaService.saveAskAnswers(userId, answers);
    // Update onboarding step to 1 (ask completed)
    await userService.updateOnboardingStep(userId, 1);
    res.json({ success: true, severity_level: severity.level, severity_score: severity.score });
  } catch (err) {
    next(err);
  }
}

export async function getAdvise(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const severity = await fiveaService.getSeverityForUser(userId);
    if (!severity) return res.status(404).json({ error: 'Severity assessment not found. Please complete ASK step first.' });
    const content = await fiveaService.getAdviseContent(severity.severity_level);
    if (!content) return res.status(404).json({ error: 'Advise content not found for this severity level.' });

    // Check if we already have a cached AI message in the database
    const existingHistory = await fiveaService.getAdviseHistory(userId);

    // If we have existing history with the same severity level, use the cached AI message
    if (existingHistory && existingHistory.severity_level === severity.severity_level && existingHistory.ai_message) {
      return res.json({
        severity: severity.severity_level,
        video: existingHistory.selected_video || content.video_url,
        quote: existingHistory.selected_quote || content.why_quitting_quote,
        ai_message: existingHistory.ai_message,
        cached: true
      });
    }

    // Fetch user profile and ASK answers
    const profile = await UserModel.getProfileByUserId(userId);
    const userAge = profile?.age || 25;
    const tobaccoType = profile?.tobacco_type || 'smoked';
    const askAnswers = await fiveaService.getUserAnswers(userId, 'ask');

    // Generate AI-powered personalized advice
    let aiMessage = content.ai_message_template.replace('{{age}}', userAge.toString());

    try {
      // Build context from user answers
      const answersContext = askAnswers.map(a =>
        `Q: ${a.question_text}\nA: ${a.answer_text}`
      ).join('\n\n');

      const prompt = `You are a compassionate tobacco cessation counselor. Generate a short, personalized motivational message (2-3 sentences) for a user who wants to quit tobacco.

USER PROFILE:
- Age: ${userAge}
- Tobacco type: ${tobaccoType}
- Severity level: ${severity.severity_level}
- Severity score: ${severity.score}

USER'S RESPONSES TO ASSESSMENT:
${answersContext}

INSTRUCTIONS:
- Write 2-3 sentences maximum
- Be warm, encouraging, and specific to their situation
- Mention relevant health benefits based on their age and usage pattern
- Include a motivating statistic or fact if relevant
- Sound human and supportive, not robotic
- Do NOT use phrases like "I'm here to help" or "As an AI"
- Focus on their specific situation and the positive impact of quitting

Generate only the personalized message, nothing else.`;

      const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_BASE_URL}/yenquit-chat`, {
        message: prompt,
        history: [],
        summary: null,
        skipStorage: true
      });

      const generatedMessage = response.data?.reply || response.data?.message;
      if (generatedMessage) {
        // Clean up the message - remove INTENT and SUMMARY lines if present
        const lines = generatedMessage.split('\n').filter(line =>
          !line.startsWith('INTENT:') && !line.startsWith('SUMMARY:')
        );
        aiMessage = lines.join('\n').trim();
      }

      // Cache the generated AI message immediately
      await fiveaService.saveAdviseHistory(userId, {
        severity_level: severity.severity_level,
        selected_video: content.video_url,
        selected_quote: content.why_quitting_quote,
        ai_message: aiMessage
      });

    } catch (aiError) {
      console.error('Failed to generate AI advice:', aiError);
      // Fall back to template message if AI generation fails
    }

    res.json({
      severity: severity.severity_level,
      video: content.video_url,
      quote: content.why_quitting_quote,
      ai_message: aiMessage,
      cached: false
    });
  } catch (err) {
    next(err);
  }
}

export async function completeAdvise(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { video, quote, ai_message } = req.body;
    if (!video || !quote || !ai_message) {
      return res.status(400).json({ error: 'video, quote, and ai_message are required' });
    }
    const severity = await fiveaService.getSeverityForUser(userId);
    if (!severity) return res.status(404).json({ error: 'Severity assessment not found.' });
    await fiveaService.saveAdviseHistory(userId, {
      severity_level: severity.severity_level,
      selected_video: video,
      selected_quote: quote,
      ai_message,
    });
    // Update onboarding step to 2 (advise completed)
    await userService.updateOnboardingStep(userId, 2);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function getQuestionById(req, res, next) {
  try {
    const { id } = req.params;
    const question = await fiveaService.getQuestionById(id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json({ question });
  } catch (err) {
    next(err);
  }
}

export async function createAdminQuestion(req, res, next) {
  try {
    const { step, question_text, options, tobacco_category } = req.body;
    if (!step || !question_text) {
      return res.status(400).json({ error: 'step and question_text are required' });
    }
    if (options !== undefined && !Array.isArray(options)) {
      return res.status(400).json({ error: 'options must be an array' });
    }

    const category = tobacco_category || 'smoked';

    const created = await fiveaService.createAdminQuestion({
      step,
      question_text,
      options,
      tobacco_category: category
    });

    res.status(201).json({ question: created });
  } catch (err) {
    next(err);
  }
}

export async function updateAdminQuestion(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (payload.options !== undefined && !Array.isArray(payload.options)) {
      return res.status(400).json({ error: 'options must be an array' });
    }

    const updated = await fiveaService.updateAdminQuestion(id, payload);
    if (!updated) return res.status(404).json({ error: 'Question not found' });
    res.json({ question: updated });
  } catch (err) {
    next(err);
  }
}

export async function softDeleteAdminQuestion(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await fiveaService.softDeleteAdminQuestion(id);
    if (!deleted) return res.status(404).json({ error: 'Question not found' });
    res.json({ message: 'Question soft-deleted', id: deleted.id, is_active: deleted.is_active });
  } catch (err) {
    next(err);
  }
}
