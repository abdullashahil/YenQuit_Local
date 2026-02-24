import * as assistService from '../services/assistService.js';

// Coping Strategies
export async function getCopingStrategies(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 200);
    const isActiveOnly = req.query.active !== 'false';

    const strategies = await assistService.getCopingStrategies(page, limit, isActiveOnly);
    const total = await assistService.getCopingStrategyCount(isActiveOnly);
    res.json({
      success: true,
      data: strategies,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    next(err);
  }
}

export async function getCopingStrategyById(req, res, next) {
  try {
    const { id } = req.params;
    const strategy = await assistService.getCopingStrategyById(id);
    if (!strategy) return res.status(404).json({ success: false, error: 'Coping strategy not found' });
    res.json({ success: true, data: strategy });
  } catch (err) {
    next(err);
  }
}

export async function createCopingStrategy(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    const created = await assistService.createCopingStrategy({ name, description });
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function updateCopingStrategy(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const updated = await assistService.updateCopingStrategy(id, payload);
    if (!updated) return res.status(404).json({ success: false, error: 'Coping strategy not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function softDeleteCopingStrategy(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await assistService.softDeleteCopingStrategy(id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Coping strategy not found' });
    res.json({ success: true, message: 'Coping strategy soft-deleted', id: deleted.id, is_active: deleted.is_active });
  } catch (err) {
    next(err);
  }
}

// Notification Templates
export async function getNotificationTemplates(req, res, next) {
  try {
    const isActiveOnly = req.query.active !== 'false';
    const templates = await assistService.getNotificationTemplates(isActiveOnly);
    res.json({ success: true, data: templates });
  } catch (err) {
    next(err);
  }
}

export async function getUserNotifications(req, res, next) {
  try {
    const userId = req.user?.userId;
    const notifications = await assistService.getUserNotifications(userId);
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
}

export async function upsertUserNotifications(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { notifications } = req.body;

    // Validate
    if (!Array.isArray(notifications)) {
      return res.status(400).json({ error: 'notifications must be an array' });
    }

    // Validate each notification
    for (const notification of notifications) {
      if (!notification.template_id || !Number.isInteger(notification.template_id)) {
        return res.status(400).json({ error: 'Each notification must have a valid template_id' });
      }
      if (notification.enabled !== undefined && typeof notification.enabled !== 'boolean') {
        return res.status(400).json({ error: 'enabled must be a boolean' });
      }
      if (notification.time && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(notification.time)) {
        return res.status(400).json({ error: 'time must be in HH:MM format' });
      }
    }

    const result = await assistService.upsertUserNotifications(userId, notifications);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// NEW: Get user's notification preferences from fivea_history
export async function getUserNotificationPreferences(req, res, next) {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const preferences = await assistService.getUserNotificationPreferences(userId);
    res.json({ success: true, data: preferences });
  } catch (err) {
    next(err);
  }
}

// Assist Plan
export async function getUserAssistPlan(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const plan = await assistService.getUserAssistPlan(userId);
    res.json({ success: true, data: plan });
  } catch (err) {
    next(err);
  }
}

export async function createOrUpdateUserAssistPlan(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { quitDate, triggers, selectedStrategyIds } = req.body;

    const result = await assistService.createOrUpdateUserAssistPlan(userId, {
      quitDate,
      triggers,
      selectedStrategyIds
    });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function completeAssistPlan(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const result = await assistService.completeAssistPlan(userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// Admin: Notification Templates
export async function createNotificationTemplate(req, res, next) {
  try {
    const { key, title, default_time } = req.body;

    if (!key || !title) {
      return res.status(400).json({ error: 'key and title are required' });
    }

    // Validate default_time format if provided
    if (default_time && !/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(default_time)) {
      return res.status(400).json({ error: 'default_time must be in HH:MM or HH:MM:SS format' });
    }

    const created = await assistService.createNotificationTemplate({ key, title, default_time });
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function updateNotificationTemplate(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;

    // Validate default_time format if provided
    if (payload.default_time && !/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(payload.default_time)) {
      return res.status(400).json({ error: 'default_time must be in HH:MM or HH:MM:SS format' });
    }

    const updated = await assistService.updateNotificationTemplate(id, payload);
    if (!updated) return res.status(404).json({ success: false, error: 'Notification template not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function softDeleteNotificationTemplate(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await assistService.softDeleteNotificationTemplate(id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Notification template not found' });
    res.json({ success: true, message: 'Notification template soft-deleted', id: deleted.id, is_active: deleted.is_active });
  } catch (err) {
    next(err);
  }
}

// Admin: Assist History
export async function getAssistHistory(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 200);

    const result = await assistService.getAssistHistory(page, limit);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
