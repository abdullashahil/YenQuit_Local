import { query, getClient } from '../db/index.js';

class QuitTrackerService {
  // Get user's progress data


  // Get user's quit date from users table (previously profiles)
  static async getUserQuitDate(userId) {
    const sql = 'SELECT quit_date FROM users WHERE id = $1';
    const result = await query(sql, [userId]);
    return result.rows[0]?.quit_date || null;
  }

  // Update user's quit date
  static async updateQuitDate(userId, quitDate) {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Check for existing plan
      const checkSql = 'SELECT id FROM fivea_assist_plans WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1';
      const checkResult = await client.query(checkSql, [userId]);

      let assistPlanResult;

      if (checkResult.rows.length > 0) {
        // Update existing plan
        const updateSql = `
          UPDATE fivea_assist_plans 
          SET 
            quit_date = $1,
            updated_at = NOW()
          WHERE id = $2
          RETURNING id, quit_date, updated_at, created_at
        `;
        assistPlanResult = await client.query(updateSql, [quitDate, checkResult.rows[0].id]);
      } else {
        // Create new plan
        const insertSql = `
          INSERT INTO fivea_assist_plans (user_id, quit_date, updated_at, created_at)
          VALUES ($1, $2, NOW(), NOW())
          RETURNING id, quit_date, updated_at, created_at
        `;
        assistPlanResult = await client.query(insertSql, [userId, quitDate]);
      }

      // Also update users table
      await client.query('UPDATE users SET quit_date = $1, updated_at = NOW() WHERE id = $2', [quitDate, userId]);

      await client.query('COMMIT');
      return assistPlanResult.rows[0].quit_date;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error updating quit date:', error);
      throw error;
    } finally {
      client.release();
    }
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
    try {
      const { startDate, endDate, goalDays = 30 } = options;

      // Get user's quit date and join date from user table
      const profileRes = await query('SELECT quit_date, join_date FROM users WHERE id = $1', [userId]);
      let quitDate = profileRes.rows[0]?.quit_date || null;
      let joinDate = profileRes.rows[0]?.join_date || null;

      // Get assist plan data for start date and quit date
      let assistPlanData = null;

      try {
        // First try to get assist plan data by user_id (most recent)
        const assistPlanRes = await query(`
          SELECT quit_date, updated_at, created_at
          FROM fivea_assist_plans 
          WHERE user_id = $1
          ORDER BY updated_at DESC
          LIMIT 1
        `, [userId]);

        assistPlanData = assistPlanRes.rows[0];

        // If assist plan exists, use its quit_date for consistency
        if (assistPlanData && assistPlanData.quit_date) {
          // Override the quitDate with the one from assist plan for consistency
          quitDate = assistPlanData.quit_date;
        }
      } catch (error) {
        // If the table doesn't exist or there's an error, just log it and continue
      }

      // Get tracker settings to determine start date fallback
      const settings = await query('SELECT created_at FROM quit_tracker_settings WHERE user_id = $1', [userId]);
      const settingsStartDate = settings.rows[0]?.created_at ? new Date(settings.rows[0].created_at) : null;

      // Determine the official "Tracker Start Date"
      const today = new Date();
      // Use join_date from profile as the primary start date, fallback to other dates if not available
      const trackerStartDate = joinDate ?
        new Date(joinDate) :
        (assistPlanData?.updated_at ? new Date(assistPlanData.updated_at) : (settingsStartDate || new Date()));

      // Check if 30 days have completed since start date
      const dayDiff = Math.floor((today - trackerStartDate) / (1000 * 60 * 60 * 24));
      const is30DaysCompleted = dayDiff >= 30;

      // Default date range calculation
      const assistPlanStartDate = assistPlanData?.updated_at ?
        new Date(assistPlanData.updated_at) :
        new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);

      const defaultStartDate = new Date(Math.min(assistPlanStartDate.getTime(), (today.getTime() - 90 * 24 * 60 * 60 * 1000)));

      // Safe date parsing helper
      const safeDate = (dateStr) => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? null : d;
      };

      const queryStart = safeDate(startDate) || defaultStartDate;
      const queryEnd = safeDate(endDate) || today;

      // Ensure valid dates for SQL
      const finalStartDate = new Date(Math.min(queryStart.getTime(), queryEnd.getTime()));
      const finalEndDate = new Date(Math.max(queryStart.getTime(), queryEnd.getTime()));

      // Get logs in date range
      const logsSql = `
        SELECT * FROM daily_logs 
        WHERE user_id = $1 AND log_date BETWEEN $2 AND $3
        ORDER BY log_date DESC
      `;

      const logsResult = await query(logsSql, [userId, finalStartDate.toISOString().split('T')[0], finalEndDate.toISOString().split('T')[0]]);
      const logs = logsResult.rows;

      // Calculate metrics
      let daysSmokeFree = 0;
      let successRate = 0;
      let lastEntry = null;

      // Calculate smoke-free days only between start date and current date
      if (logs.length > 0) {
        // Filter logs to only include dates from start date onwards for calculation
        const calcStartDate = new Date(assistPlanData?.updated_at || today.getTime() - 90 * 24 * 60 * 60 * 1000);
        calcStartDate.setHours(0, 0, 0, 0);

        // Only count logs from start date to today (inclusive)
        const filteredLogs = logs.filter(log => {
          const logDate = new Date(log.log_date);
          logDate.setHours(0, 0, 0, 0);
          return logDate >= calcStartDate && logDate <= today;
        });

        const smokeFreeLogs = filteredLogs.filter(log => !log.smoked);
        daysSmokeFree = smokeFreeLogs.length;

      } else if (quitDate) {
        // Fallback to quit date calculation if no logs
        const quitDateObj = new Date(quitDate);
        const todayObj = new Date();
        todayObj.setHours(0, 0, 0, 0);
        quitDateObj.setHours(0, 0, 0, 0);

        if (!isNaN(quitDateObj.getTime()) && quitDateObj <= todayObj) {
          daysSmokeFree = Math.floor((todayObj - quitDateObj) / (24 * 60 * 60 * 1000)) + 1;
        }
      }

      // Calculate success rate (last 30 days)
      const successRateDays = 30;
      const successRateStartDate = new Date(today.getTime() - (successRateDays - 1) * 24 * 60 * 60 * 1000);

      const recentLogsSql = `
        SELECT smoked FROM daily_logs 
        WHERE user_id = $1 AND log_date >= $2
      `;
      const recentLogsResult = await query(recentLogsSql, [userId, successRateStartDate.toISOString().split('T')[0]]);
      if (recentLogsResult.rows.length > 0) {
        const smokeFreeDaysInRange = recentLogsResult.rows.filter(log => !log.smoked).length;
        successRate = Math.round((smokeFreeDaysInRange / recentLogsResult.rows.length) * 100);
      }

      if (logs.length > 0) {
        lastEntry = logs[0].log_date;
      }

      // Calculate progress percentage
      let progressPercentage = 0;
      if (quitDate && assistPlanData && assistPlanData.updated_at) {
        const targetDate = new Date(quitDate);
        const currentDate = new Date();
        const planStartDate = new Date(assistPlanData.updated_at);

        planStartDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        if (!isNaN(targetDate.getTime()) && !isNaN(planStartDate.getTime())) {
          if (targetDate > currentDate) {
            // Future quit date logic
            const totalJourneyDays = Math.max(1, Math.floor((targetDate - planStartDate) / (24 * 60 * 60 * 1000)) + 1);
            const daysPassed = Math.floor((currentDate - planStartDate) / (24 * 60 * 60 * 1000)) + 1;
            const prepProgress = (daysPassed / totalJourneyDays) * 100;

            // Smoking progress
            const logsInRange = logs.filter(log => {
              const logDate = new Date(log.log_date);
              logDate.setHours(0, 0, 0, 0);
              return logDate >= planStartDate && logDate <= currentDate;
            });

            let smokingProgress = 0;
            if (logsInRange.length >= 3) {
              smokingProgress = (daysSmokeFree / logsInRange.length) * 100;
            } else {
              smokingProgress = daysSmokeFree > 0 ? 50 : 0;
            }

            let prepWeight = 0.7, smokingWeight = 0.3;
            if (daysPassed <= 3) { prepWeight = 0.9; smokingWeight = 0.1; }
            else if (daysPassed <= 7) { prepWeight = 0.8; smokingWeight = 0.2; }

            progressPercentage = Math.round((prepProgress * prepWeight) + (smokingProgress * smokingWeight));

          } else {
            // Past quit date logic
            const logsInRange = logs.filter(log => {
              const logDate = new Date(log.log_date);
              logDate.setHours(0, 0, 0, 0);
              return logDate >= planStartDate && logDate <= currentDate;
            });
            progressPercentage = logsInRange.length > 0 ?
              Math.round((daysSmokeFree / logsInRange.length) * 100) : 0;
          }
        }
        progressPercentage = Math.min(progressPercentage, 100);

      } else if (goalDays > 0) {
        progressPercentage = Math.round((daysSmokeFree / goalDays) * 100);
        progressPercentage = Math.min(progressPercentage, 100);
      }

      return {
        quitDate: quitDate || null,
        daysSmokeFree,
        totalGoal: goalDays,
        progressPercentage,
        lastEntry,
        successRate,
        logs,
        assistPlanData,
        is30DaysCompleted,
        trackerStartDate,
        joinDate
      };

    } catch (error) {
      console.error('❌ Error in QuitTrackerService.getProgress:', error);
      throw error;
    }
  }

  // Get a specific log by ID
  static async getLogById(userId, logId) {
    const sql = 'SELECT * FROM daily_logs WHERE id = $1 AND user_id = $2';
    const result = await query(sql, [logId, userId]);
    return result.rows[0];
  }
}

export default QuitTrackerService;
