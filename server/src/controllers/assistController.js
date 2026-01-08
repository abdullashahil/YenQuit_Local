import * as assistService from '../services/assistService.js';

// Public/User Routes

export async function getCopingStrategies(req, res, next) {
  try {
    const isActiveOnly = req.query.active !== 'false';
    const strategies = await assistService.getCopingStrategies(isActiveOnly);
    res.json({ success: true, data: strategies });
  } catch (err) {
    next(err);
  }
}

export async function getUserAssistPlan(req, res, next) {
  try {
    const userId = req.user.userId;
    const plan = await assistService.getUserAssistPlan(userId);
    res.json({ success: true, data: plan });
  } catch (err) {
    next(err);
  }
}

export async function createOrUpdateUserAssistPlan(req, res, next) {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { quitDate, triggers, selectedStrategyIds } = req.body;

    // Validate input
    if (quitDate && isNaN(Date.parse(quitDate))) {
      return res.status(400).json({ error: 'Invalid quitDate format' });
    }
    if (selectedStrategyIds && (!Array.isArray(selectedStrategyIds) || selectedStrategyIds.some(id => !Number.isInteger(id)))) {
      return res.status(400).json({ error: 'selectedStrategyIds must be an array of integers' });
    }

    const plan = await assistService.createOrUpdateUserAssistPlan(userId, { quitDate, triggers, selectedStrategyIds });
    res.json({ success: true, data: plan });
  } catch (err) {
    next(err);
  }
}

export async function completeAssistPlan(req, res, next) {
  try {
    const userId = req.user.userId; // Changed from req.user.id to req.user.userId
    const result = await assistService.completeAssistPlan(userId);
    res.json({ success: true, data: result, message: 'Assist plan completed successfully' });
  } catch (err) {
    next(err);
  }
}

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
    const userId = req.user.userId; // Changed from req.user.id to req.user.userId
    const notifications = await assistService.getUserNotifications(userId);
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
}

export async function upsertUserNotifications(req, res, next) {
  try {
    const userId = req.user.userId; // Changed from req.user.id to req.user.userId
    const { notifications } = req.body;


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

// Admin Routes

export async function createCopingStrategy(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

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
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const payload = req.body;

    if (!Number.isInteger(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid strategy ID' });
    }

    const updated = await assistService.updateCopingStrategy(parseInt(id), payload);
    if (!updated) return res.status(404).json({ error: 'Strategy not found' });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function softDeleteCopingStrategy(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    if (!Number.isInteger(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid strategy ID' });
    }

    const deleted = await assistService.softDeleteCopingStrategy(parseInt(id));
    if (!deleted) return res.status(404).json({ error: 'Strategy not found' });

    res.json({ success: true, message: 'Strategy soft-deleted', data: deleted });
  } catch (err) {
    next(err);
  }
}

export async function createNotificationTemplate(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { key, title, default_time } = req.body;
    if (!key || !title) {
      return res.status(400).json({ error: 'key and title are required' });
    }

    if (default_time && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(default_time)) {
      return res.status(400).json({ error: 'default_time must be in HH:MM format' });
    }

    const created = await assistService.createNotificationTemplate({ key, title, default_time });
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

export async function updateNotificationTemplate(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const payload = req.body;

    if (!Number.isInteger(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    if (payload.default_time && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(payload.default_time)) {
      return res.status(400).json({ error: 'default_time must be in HH:MM format' });
    }

    const updated = await assistService.updateNotificationTemplate(parseInt(id), payload);
    if (!updated) return res.status(404).json({ error: 'Template not found' });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function softDeleteNotificationTemplate(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    if (!Number.isInteger(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    const deleted = await assistService.softDeleteNotificationTemplate(parseInt(id));
    if (!deleted) return res.status(404).json({ error: 'Template not found' });

    res.json({ success: true, message: 'Template soft-deleted', data: deleted });
  } catch (err) {
    next(err);
  }
}

export async function getAssistHistory(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 200);

    const result = await assistService.getAssistHistory(page, limit);
    res.json({ success: true, data: result.history, pagination: result.pagination });
  } catch (err) {
    next(err);
  }
}
