import { query } from '../db/index.js';

class QuitTrackerService {
  // Get user's quit date from profile
  static async getUserQuitDate(userId) {
    const sql = 'SELECT quit_date FROM profiles WHERE user_id = $1';
    const result = await query(sql, [userId]);
    return result.rows[0]?.quit_date || null;
  }

  // Update user's quit date
  static async updateQuitDate(userId, quitDate) {
    const sql = `
      INSERT INTO profiles (user_id, quit_date, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        quit_date = EXCLUDED.quit_date,
        updated_at = NOW()
      RETURNING quit_date
    `;
    const result = await query(sql, [userId, quitDate]);
    return result.rows[0].quit_date;
  }

  // Create or update daily log (upsert)
  static async createOrUpdateLog(userId, logData) {
    const { log_date, smoked, cigarettes_count, cravings_level, mood, notes } = logData;
    
    const sql = `
      INSERT INTO daily_logs (user_id, log_date, smoked, cigarettes_count, cravings_level, mood, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id, log_date)
      DO UPDATE SET
        smoked = EXCLUDED.smoked,
        cigarettes_count = EXCLUDED.cigarettes_count,
        cravings_level = EXCLUDED.cravings_level,
        mood = EXCLUDED.mood,
        notes = EXCLUDED.notes,
        updated_at = NOW()
      RETURNING *
    `;
    
    const result = await query(sql, [
      userId, log_date, smoked, cigarettes_count, cravings_level, mood, notes
    ]);
    
    return result.rows[0];
  }

  // Update a specific log by ID
  static async updateLog(userId, logId, logData) {
    const { log_date, smoked, cigarettes_count, cravings_level, mood, notes } = logData;
    
    const sql = `
      UPDATE daily_logs 
      SET 
        log_date = $1,
        smoked = $2,
        cigarettes_count = $3,
        cravings_level = $4,
        mood = $5,
        notes = $6,
        updated_at = NOW()
      WHERE id = $7 AND user_id = $8
      RETURNING *
    `;
    
    const result = await query(sql, [
      log_date, smoked, cigarettes_count, cravings_level, mood, notes, logId, userId
    ]);
    
    return result.rows[0];
  }

  // Delete a log by ID
  static async deleteLog(userId, logId) {
    const sql = 'DELETE FROM daily_logs WHERE id = $1 AND user_id = $2 RETURNING *';
    const result = await query(sql, [logId, userId]);
    return result.rows[0];
  }

  // Get logs for a user with pagination
  static async getLogs(userId, options = {}) {
    const { startDate, endDate, page = 1, limit = 30 } = options;
    
    let whereClause = 'WHERE user_id = $1';
    const queryParams = [userId];
    let paramIndex = 2;
    
    if (startDate) {
      whereClause += ` AND log_date >= $${paramIndex}`;
      queryParams.push(startDate);
      paramIndex++;
    }
    
    if (endDate) {
      whereClause += ` AND log_date <= $${paramIndex}`;
      queryParams.push(endDate);
      paramIndex++;
    }
    
    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM daily_logs ${whereClause}`;
    const countResult = await query(countSql, queryParams);
    const total = parseInt(countResult.rows[0].total);
    
    // Get paginated results
    const offset = (page - 1) * limit;
    const dataSql = `
      SELECT * FROM daily_logs 
      ${whereClause}
      ORDER BY log_date DESC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    queryParams.push(limit, offset);
    const dataResult = await query(dataSql, queryParams);
    
    return {
      logs: dataResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }

  // Calculate progress metrics
  static async getProgress(userId, options = {}) {
    const { startDate, endDate, goalDays = 30 } = options;
    
    // Get user's quit date
    const quitDate = await this.getUserQuitDate(userId);
    
    // Default date range: last 90 days or since quit date
    const today = new Date();
    const defaultStartDate = quitDate ? 
      new Date(Math.max(quitDate, new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000))) :
      new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
    
    const queryStartDate = startDate || defaultStartDate.toISOString().split('T')[0];
    const queryEndDate = endDate || today.toISOString().split('T')[0];
    
    // Get logs in date range
    const logsSql = `
      SELECT * FROM daily_logs 
      WHERE user_id = $1 AND log_date BETWEEN $2 AND $3
      ORDER BY log_date DESC
    `;
    
    const logsResult = await query(logsSql, [userId, queryStartDate, queryEndDate]);
    const logs = logsResult.rows;
    
    // Calculate metrics
    let daysSmokeFree = 0;
    let successRate = 0;
    let lastEntry = null;
    
    if (quitDate) {
      // Find last lapse (smoked = true) since quit date
      const lastLapseSql = `
        SELECT log_date FROM daily_logs 
        WHERE user_id = $1 AND smoked = true AND log_date >= $2
        ORDER BY log_date DESC 
        LIMIT 1
      `;
      const lastLapseResult = await query(lastLapseSql, [userId, quitDate]);
      const lastLapseDate = lastLapseResult.rows[0]?.log_date;
      
      // Calculate days smoke-free (continuous streak)
      const startDateForCount = lastLapseDate ? 
        new Date(new Date(lastLapseDate).getTime() + 24 * 60 * 60 * 1000) : // day after last lapse
        new Date(quitDate);
      
      const todayForCount = new Date();
      todayForCount.setHours(0, 0, 0, 0); // start of today
      startDateForCount.setHours(0, 0, 0, 0); // start of start date
      
      if (startDateForCount <= todayForCount) {
        daysSmokeFree = Math.floor((todayForCount - startDateForCount) / (24 * 60 * 60 * 1000)) + 1;
      }
    }
    
    // Calculate success rate (last N days)
    const successRateDays = 30; // configurable
    const successRateStartDate = new Date(today.getTime() - (successRateDays - 1) * 24 * 60 * 60 * 1000);
    
    const recentLogsSql = `
      SELECT smoked FROM daily_logs 
      WHERE user_id = $1 AND log_date >= $2
    `;
    const recentLogsResult = await query(recentLogsSql, [userId, successRateStartDate]);
    const recentLogs = recentLogsResult.rows;
    
    if (recentLogs.length > 0) {
      const smokeFreeDays = recentLogs.filter(log => !log.smoked).length;
      successRate = Math.round((smokeFreeDays / recentLogs.length) * 100);
    }
    
    // Get last entry
    if (logs.length > 0) {
      lastEntry = logs[0].created_at;
    }
    
    // Calculate progress percentage
    const progressPercentage = goalDays > 0 ? Math.round((daysSmokeFree / goalDays) * 100) : 0;
    
    return {
      quitDate: quitDate || null,
      daysSmokeFree,
      totalGoal: goalDays,
      progressPercentage,
      lastEntry,
      successRate,
      logs
    };
  }

  // Get a specific log by ID
  static async getLogById(userId, logId) {
    const sql = 'SELECT * FROM daily_logs WHERE id = $1 AND user_id = $2';
    const result = await query(sql, [logId, userId]);
    return result.rows[0];
  }
}

export default QuitTrackerService;
