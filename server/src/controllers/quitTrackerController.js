import QuitTrackerService from '../services/quitTrackerService.js';

// Get user's quit tracker progress
const getProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, goalDays } = req.query;
    
    const options = {
      startDate,
      endDate,
      goalDays: goalDays ? parseInt(goalDays) : 30
    };
    
    const progress = await QuitTrackerService.getProgress(userId, options);
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error fetching quit tracker progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress data'
    });
  }
};

// Create or update daily log
const createOrUpdateLog = async (req, res, next) => {
  try {
    const userId = req.user.id;
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
      log_date,
      smoked: Boolean(smoked),
      cigarettes_count: cigarettes_count || null,
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
    const userId = req.user.id;
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
    const userId = req.user.id;
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
    const userId = req.user.id;
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
    const userId = req.user.id;
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
      
      // Validate date is not in the future
      const quitDate = new Date(quit_date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // end of today
      
      if (quitDate > today) {
        return res.status(400).json({
          success: false,
          message: 'Quit date cannot be in the future'
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

export {
  getProgress,
  createOrUpdateLog,
  updateLog,
  deleteLog,
  getLogs,
  updateQuitDate
};
