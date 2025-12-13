import QuitTrackerService from '../services/quitTrackerService.js';
import {
  getQuestions,
  getUserResponses,
  saveUserResponses,
  hasUserCompletedQuestionnaire,
  hasUserCompletedPreSelfEfficacy,
  hasUserCompletedPostSelfEfficacy,
  savePreSelfEfficacyResponses,
  savePostSelfEfficacyResponses,
  getUserSettings,

  updateUserSettings,
  hasUserProvidedFeedback,
  getFeedbackQuestions as getFeedbackQuestionsService,
  saveUserFeedback
} from '../services/self-efficacyService.js';

// Get user's quit tracker progress
const getProgress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate, goalDays } = req.query;

    // Check if user has completed pre and post self-efficacy questionnaires
    const hasCompletedPre = await hasUserCompletedPreSelfEfficacy(userId);
    const hasCompletedPost = await hasUserCompletedPostSelfEfficacy(userId);
    const hasCompletedFeedback = await hasUserProvidedFeedback(userId);

    // Always calculate progress, but include questionnaire status
    const options = { startDate, endDate, goalDays: goalDays ? parseInt(goalDays) : 30 };
    const progressData = await QuitTrackerService.getProgress(userId, options);

    // Check if quit date has passed
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const quitDate = progressData.quitDate ? new Date(progressData.quitDate) : null;
    const isQuitDatePassed = quitDate && quitDate <= today;

    // Add status information to the response
    progressData.needsQuestionnaire = !hasCompletedPre;
    progressData.hasCompletedPreSelfEfficacy = hasCompletedPre;
    progressData.hasCompletedPostSelfEfficacy = hasCompletedPost;
    progressData.hasCompletedFeedback = hasCompletedFeedback;
    progressData.isQuitDatePassed = isQuitDatePassed;

    res.json({
      success: true,
      data: progressData
    });
  } catch (error) {
    console.error('🔍 Controller - Error in getProgress:', error);
    next(error);
  }
};

// Create or update daily log
const createOrUpdateLog = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { log_date, smoked, cigarettes_count, cravings_level, mood, notes } = req.body;

    // Validate required fields
    if (!log_date || smoked === undefined) {
      return res.status(400).json({
        success: false,
        message: 'log_date and smoked are required'
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(log_date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    // Validate optional numeric fields
    if (cigarettes_count !== undefined && cigarettes_count !== null && (cigarettes_count < 0 || !Number.isInteger(cigarettes_count))) {
      return res.status(400).json({
        success: false,
        message: 'cigarettes_count must be a non-negative integer'
      });
    }

    if (cravings_level !== undefined && (cravings_level < 1 || cravings_level > 10 || !Number.isInteger(cravings_level))) {
      return res.status(400).json({
        success: false,
        message: 'cravings_level must be an integer between 1 and 10'
      });
    }

    if (mood !== undefined && (mood < 1 || mood > 10 || !Number.isInteger(mood))) {
      return res.status(400).json({
        success: false,
        message: 'mood must be an integer between 1 and 10'
      });
    }

    const logData = {
      log_date,
      smoked: Boolean(smoked),
      cigarettes_count: smoked ? (cigarettes_count || 0) : 0,
      cravings_level: cravings_level || null,
      mood: mood || null,
      notes: notes || null
    };

    const log = await QuitTrackerService.createOrUpdateLog(userId, logData);

    res.status(201).json({
      success: true,
      message: 'Log saved successfully',
      data: log
    });
  } catch (error) {
    console.error('Error creating/updating log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save log'
    });
  }
};

// Update a specific log
const updateLog = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { log_date, smoked, cigarettes_count, cravings_level, mood, notes } = req.body;

    // Check if log exists and belongs to user
    const existingLog = await QuitTrackerService.getLogById(userId, id);
    if (!existingLog) {
      return res.status(404).json({
        success: false,
        message: 'Log not found'
      });
    }

    // Validate date format if provided
    if (log_date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(log_date)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Use YYYY-MM-DD'
        });
      }
    }

    // Validate optional fields
    if (cigarettes_count !== undefined && (cigarettes_count < 0 || !Number.isInteger(cigarettes_count))) {
      return res.status(400).json({
        success: false,
        message: 'cigarettes_count must be a non-negative integer'
      });
    }

    if (cravings_level !== undefined && (cravings_level < 1 || cravings_level > 10 || !Number.isInteger(cravings_level))) {
      return res.status(400).json({
        success: false,
        message: 'cravings_level must be an integer between 1 and 10'
      });
    }

    if (mood !== undefined && (mood < 1 || mood > 10 || !Number.isInteger(mood))) {
      return res.status(400).json({
        success: false,
        message: 'mood must be an integer between 1 and 10'
      });
    }

    const logData = {
      log_date: log_date || existingLog.log_date,
      smoked: smoked !== undefined ? Boolean(smoked) : existingLog.smoked,
      cigarettes_count: cigarettes_count !== undefined ? cigarettes_count : existingLog.cigarettes_count,
      cravings_level: cravings_level !== undefined ? cravings_level : existingLog.cravings_level,
      mood: mood !== undefined ? mood : existingLog.mood,
      notes: notes !== undefined ? notes : existingLog.notes
    };

    const updatedLog = await QuitTrackerService.updateLog(userId, id, logData);

    res.json({
      success: true,
      message: 'Log updated successfully',
      data: updatedLog
    });
  } catch (error) {
    console.error('Error updating log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update log'
    });
  }
};

// Delete a log
const deleteLog = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    // Check if log exists and belongs to user
    const existingLog = await QuitTrackerService.getLogById(userId, id);
    if (!existingLog) {
      return res.status(404).json({
        success: false,
        message: 'Log not found'
      });
    }

    const deletedLog = await QuitTrackerService.deleteLog(userId, id);

    res.json({
      success: true,
      message: 'Log deleted successfully',
      data: deletedLog
    });
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete log'
    });
  }
};

// Get logs with pagination
const getLogs = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate, page, limit } = req.query;

    const options = {
      startDate,
      endDate,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 30
    };

    // Validate pagination params
    if (options.page < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page must be greater than 0'
      });
    }

    if (options.limit < 1 || options.limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100'
      });
    }

    // Validate date format if provided
    if (startDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(startDate)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid startDate format. Use YYYY-MM-DD'
        });
      }
    }

    if (endDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(endDate)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid endDate format. Use YYYY-MM-DD'
        });
      }
    }

    const result = await QuitTrackerService.getLogs(userId, options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch logs'
    });
  }
};

// Update quit date
const updateQuitDate = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { quit_date } = req.body;

    // Validate date format if provided
    if (quit_date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(quit_date)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Use YYYY-MM-DD'
        });
      }

      // Validate date is not too far in the future (allow reasonable future dates)
      const quitDate = new Date(quit_date);
      const today = new Date();
      const maxFutureDate = new Date();
      maxFutureDate.setDate(today.getDate() + 365); // Allow up to 1 year in future

      if (quitDate > maxFutureDate) {
        return res.status(400).json({
          success: false,
          message: 'Quit date cannot be more than 1 year in the future'
        });
      }
    }

    const updatedQuitDate = await QuitTrackerService.updateQuitDate(userId, quit_date);

    res.json({
      success: true,
      message: 'Quit date updated successfully',
      data: { quit_date: updatedQuitDate }
    });
  } catch (error) {
    console.error('Error updating quit date:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update quit date'
    });
  }
};

// Get questionnaire questions
const getQuestionnaire = async (req, res, next) => {
  try {
    const questions = await getQuestions();

    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Error fetching questionnaire:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questionnaire'
    });
  }
};

// Get user's questionnaire responses
const getUserQuestionnaireResponses = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const responses = await getUserResponses(userId);

    res.json({
      success: true,
      data: responses
    });
  } catch (error) {
    console.error('Error fetching user responses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user responses'
    });
  }
};

// Save user's questionnaire responses
const saveQuestionnaireResponses = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { responses } = req.body;

    // Validate responses
    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({
        success: false,
        message: 'Responses must be an array'
      });
    }

    // Save responses
    await saveUserResponses(userId, responses);

    res.json({
      success: true,
      message: 'Questionnaire responses saved successfully'
    });
  } catch (error) {
    console.error('Error saving questionnaire responses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save questionnaire responses'
    });
  }
};

// Save post self-efficacy responses
const savePostSelfEfficacyResponsesHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { responses } = req.body;

    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({
        success: false,
        message: 'Responses array is required'
      });
    }

    await savePostSelfEfficacyResponses(userId, responses);

    res.json({
      success: true,
      message: 'Post self-efficacy responses saved successfully'
    });
  } catch (error) {
    console.error('Error saving post self-efficacy responses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save post self-efficacy responses'
    });
  }
};

// Get feedback questions
const getFeedbackQuestions = async (req, res, next) => {
  try {
    const questions = await getFeedbackQuestionsService();

    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Error fetching feedback questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback questions'
    });
  }
};

// Save user feedback
const saveUserFeedbackHandler = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { responses } = req.body;

    if (!responses) {
      return res.status(400).json({
        success: false,
        message: 'Responses are required'
      });
    }

    await saveUserFeedback(userId, responses);

    res.json({
      success: true,
      message: 'Feedback saved successfully'
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save feedback'
    });
  }
};

// Get user settings
const getSettings = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const settings = await getUserSettings(userId);

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
};

// Update user settings
const updateSettings = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { goalDays, reminderTime, isTrackingEnabled } = req.body;

    const settings = await updateUserSettings(userId, {
      goalDays,
      reminderTime,
      isTrackingEnabled
    });

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
};

// Get all logs for modal view
const getAllLogs = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 50 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const logsData = await QuitTrackerService.getLogs(userId, options);

    res.json({
      success: true,
      data: logsData
    });
  } catch (error) {
    console.error('Error fetching all logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch logs'
    });
  }
};

// Admin endpoint to get specific user's progress
const getAdminUserProgress = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, goalDays } = req.query;

    // Always calculate progress, but include questionnaire status
    const options = { startDate, endDate, goalDays: goalDays ? parseInt(goalDays) : 30 };
    const progressData = await QuitTrackerService.getProgress(userId, options);

    // Check if quit date has passed
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const quitDate = progressData.quitDate ? new Date(progressData.quitDate) : null;
    const isQuitDatePassed = quitDate && quitDate <= today;

    // Check for questionnaire completion status
    const hasCompletedPre = await hasUserCompletedPreSelfEfficacy(userId);
    const hasCompletedPost = await hasUserCompletedPostSelfEfficacy(userId);

    // Add status information to the response
    progressData.needsQuestionnaire = !hasCompletedPre;
    progressData.hasCompletedPreSelfEfficacy = hasCompletedPre;
    progressData.hasCompletedPostSelfEfficacy = hasCompletedPost;
    progressData.isQuitDatePassed = isQuitDatePassed;

    res.json({
      success: true,
      data: progressData
    });
  } catch (error) {
    console.error('🔍 Admin Controller - Error in getAdminUserProgress:', error);
    next(error);
  }
};

export {
  getProgress,
  createOrUpdateLog,
  updateLog,
  deleteLog,
  getLogs,
  updateQuitDate,
  getQuestionnaire,
  getUserQuestionnaireResponses,
  saveQuestionnaireResponses,
  savePostSelfEfficacyResponsesHandler,
  getFeedbackQuestions,
  saveUserFeedbackHandler,
  getSettings,
  updateSettings,
  getAllLogs,
  getAdminUserProgress
};
