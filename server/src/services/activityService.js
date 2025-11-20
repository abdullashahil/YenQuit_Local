import { query } from '../db/index.js';

export async function logActivity(userId, activityType, description, ipAddress, userAgent) {
  try {
    await query(
      'INSERT INTO activity_logs (user_id, activity_type, description, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
      [userId, activityType, description, ipAddress, userAgent]
    );
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

export async function getUserActivities(userId, limit = 50) {
  const res = await query(
    'SELECT * FROM activity_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
    [userId, limit]
  );
  return res.rows;
}
