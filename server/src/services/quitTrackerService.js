import { query, getClient } from '../db/index.js';

class QuitTrackerService {
  // Get user's progress data
  static async getProgress(userId, options = {}) {
    const { startDate, endDate, goalDays = 30 } = options;
    
    try {
      // 1. Get user's quit date
      const quitDate = await this.getUserQuitDate(userId);
      
      // 2. Calculate days smoke-free
      let daysSmokeFree = 0;
      if (quitDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const quitDateObj = new Date(quitDate);
        quitDateObj.setHours(0, 0, 0, 0);
        
        // Calculate days since quit date
        const diffTime = Math.max(0, today - quitDateObj);
        daysSmokeFree = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      }
      
      // 3. Get logs for the period
      let logsSql = `
        SELECT * FROM daily_logs 
        WHERE user_id = $1 
        ${startDate ? 'AND log_date >= $2' : ''}
        ${endDate ? `AND log_date <= $${startDate ? '3' : '2'}` : ''}
        ORDER BY log_date DESC
      `;
      
      const logParams = [userId];
      if (startDate) logParams.push(startDate);
      if (endDate) logParams.push(endDate);
      
      const logsResult = await query(logsSql, logParams);
      
      // 4. Calculate success rate
      const totalDays = logsResult.rows.length;
      const smokeFreeDays = logsResult.rows.filter(log => !log.smoked).length;
      const successRate = totalDays > 0 ? Math.round((smokeFreeDays / totalDays) * 100) : 0;
      
      // 5. Get the last entry date
      const lastEntry = logsResult.rows[0]?.log_date || null;
      
      // 6. Calculate progress percentage based on goal days
      const progressPercentage = Math.min(
        Math.round((daysSmokeFree / goalDays) * 100),
        100
      );
      
      return {
        quitDate,
        daysSmokeFree,
        totalGoal: goalDays,
        progressPercentage,
        lastEntry,
        successRate,
        logs: logsResult.rows
      };
      
    } catch (error) {
      console.error('Error in QuitTrackerService.getProgress:', error);
      throw error;
    }
  }

  // Get user's quit date from profile
  static async getUserQuitDate(userId) {
    const sql = 'SELECT quit_date FROM profiles WHERE user_id = $1';
    const result = await query(sql, [userId]);
    return result.rows[0]?.quit_date || null;
  }

  // Update user's quit date
  static async updateQuitDate(userId, quitDate) {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      // Update profiles table
      const profileSql = `
        INSERT INTO profiles (user_id, quit_date, created_at, updated_at)
        VALUES ($1, $2, NOW(), NOW())
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          quit_date = EXCLUDED.quit_date,
          updated_at = NOW()
        RETURNING quit_date
      `;
      const profileResult = await client.query(profileSql, [userId, quitDate]);
      
      // Update or create fivea_assist_plans entry with NEW start date
      const assistPlanSql = `
        INSERT INTO fivea_assist_plans (user_id, quit_date, updated_at, created_at)
        VALUES ($1, $2, NOW(), NOW())
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          quit_date = EXCLUDED.quit_date,
          updated_at = NOW(),  -- This sets the NEW start date for the tracker
          created_at = CASE 
            WHEN fivea_assist_plans.quit_date IS NULL THEN EXCLUDED.created_at 
            ELSE fivea_assist_plans.created_at 
          END
        RETURNING id, quit_date, updated_at, created_at
      `;
      const assistPlanResult = await client.query(assistPlanSql, [userId, quitDate]);
      
      console.log('🗓️ Updated quit date in profiles:', profileResult.rows[0]);
      console.log('🗓️ Updated/created assist plan with NEW start date:', assistPlanResult.rows[0]);
      
      await client.query('COMMIT');
      return profileResult.rows[0].quit_date;
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
    const { startDate, endDate, goalDays = 30 } = options;
    
    console.log('🔍 getProgress called for userId:', userId);
    
    // Get user's quit date from profile
    let quitDate = await this.getUserQuitDate(userId);
    console.log('📅 User quit date:', quitDate);
    
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
      console.log('🎯 Assist plan data found:', assistPlanData);
      
      // If assist plan exists, use its quit_date for consistency
      if (assistPlanData && assistPlanData.quit_date) {
        console.log('🔄 Using assist plan quit_date instead of profile quit_date');
        console.log('📅 Profile quit_date was:', quitDate);
        console.log('📅 Assist plan quit_date is:', assistPlanData.quit_date);
        // Override the quitDate with the one from assist plan for consistency
        quitDate = assistPlanData.quit_date;
      }
    } catch (error) {
      // If the table doesn't exist or there's an error, just log it and continue
      console.log('ℹ️ fivea_assist_plans table not found or error accessing it, using profile quit date');
    }
    
    // Default date range: last 90 days or since assist plan start date
    const today = new Date();
    const assistPlanStartDate = assistPlanData?.updated_at ? 
      new Date(assistPlanData.updated_at) : 
      new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
    
    const defaultStartDate = new Date(Math.min(assistPlanStartDate, new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)));
    
    const queryStartDate = startDate || defaultStartDate.toISOString().split('T')[0];
    const queryEndDate = endDate || today.toISOString().split('T')[0];
    
    // Fix date range order
    const finalStartDate = new Date(Math.min(new Date(queryStartDate), new Date(queryEndDate)));
    const finalEndDate = new Date(Math.max(new Date(queryStartDate), new Date(queryEndDate)));
    
    console.log('📊 Query date range (fixed):', { 
      assistPlanStartDate: assistPlanStartDate.toISOString().split('T')[0],
      defaultStartDate: defaultStartDate.toISOString().split('T')[0],
      original: { queryStartDate, queryEndDate },
      fixed: { 
        queryStartDate: finalStartDate.toISOString().split('T')[0], 
        queryEndDate: finalEndDate.toISOString().split('T')[0] 
      } 
    });
    
    // Get logs in date range
    const logsSql = `
      SELECT * FROM daily_logs 
      WHERE user_id = $1 AND log_date BETWEEN $2 AND $3
      ORDER BY log_date DESC
    `;
    
    const logsResult = await query(logsSql, [userId, finalStartDate.toISOString().split('T')[0], finalEndDate.toISOString().split('T')[0]]);
    const logs = logsResult.rows;
    console.log('📋 Found logs:', logs.length, 'logs');
    
    // Calculate metrics
    let daysSmokeFree = 0;
    let successRate = 0;
    let lastEntry = null;
    
    // Calculate smoke-free days only between start date and current date
    if (logs.length > 0) {
      console.log('🚭 Calculating smoke-free days between start date and current date');
      
      // Filter logs to only include dates from start date onwards
      const startDate = new Date(assistPlanData?.updated_at || today.getTime() - 90 * 24 * 60 * 60 * 1000);
      // Set start date to beginning of day to ensure inclusion
      startDate.setHours(0, 0, 0, 0);
      
      // Only count logs from start date to today (inclusive)
      const filteredLogs = logs.filter(log => {
        const logDate = new Date(log.log_date);
        logDate.setHours(0, 0, 0, 0); // Normalize to start of day
        return logDate >= startDate && logDate <= today;
      });
      
      console.log(`📋 Filtered logs between ${startDate.toISOString().split('T')[0]} and ${today.toISOString().split('T')[0]}: ${filteredLogs.length} logs`);
      
      // Count smoke-free days in the filtered range
      const smokeFreeLogs = filteredLogs.filter(log => !log.smoked);
      daysSmokeFree = smokeFreeLogs.length;
      
      console.log(`🚭 Smoke-free days in range: ${daysSmokeFree} / ${filteredLogs.length} total days`);
      
      // Debug: Show each filtered log with date comparison
      filteredLogs.forEach(log => {
        const logDate = new Date(log.log_date);
        console.log(`📋 ${log.log_date}: smoked=${log.smoked}, cigarettes=${log.cigarettes_count}, logDate>=startDate=${logDate >= startDate}`);
      });
      
      // Also show any logs that were excluded for debugging
      const excludedLogs = logs.filter(log => {
        const logDate = new Date(log.log_date);
        logDate.setHours(0, 0, 0, 0);
        return !(logDate >= startDate && logDate <= today);
      });
      
      if (excludedLogs.length > 0) {
        console.log(`📋 Excluded logs (${excludedLogs.length}):`);
        excludedLogs.forEach(log => {
          const logDate = new Date(log.log_date);
          console.log(`📋 ❌ ${log.log_date}: smoked=${log.smoked}, logDate>=startDate=${logDate >= startDate}`);
        });
      }
    } else if (quitDate) {
      // Fallback to quit date calculation if no logs
      console.log('🚭 No logs found, using quit date calculation');
      
      const quitDateObj = new Date(quitDate);
      const todayObj = new Date();
      todayObj.setHours(0, 0, 0, 0);
      quitDateObj.setHours(0, 0, 0, 0);
      
      if (quitDateObj <= todayObj) {
        daysSmokeFree = Math.floor((todayObj - quitDateObj) / (24 * 60 * 60 * 1000)) + 1;
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
    
    // Get last entry (use log_date instead of created_at for better user experience)
    if (logs.length > 0) {
      lastEntry = logs[0].log_date; // Use log_date instead of created_at
    }
    
    // Calculate progress percentage based on actual smoking progress within date range
    let progressPercentage = 0;
    if (quitDate && assistPlanData) {
      const targetDate = new Date(quitDate);
      const currentDate = new Date();
      const startDate = new Date(assistPlanData.updated_at);
      
      // Normalize dates to start of day for consistent comparison
      startDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      
      console.log('📈 Progress calculation:', { startDate, targetDate, currentDate, daysSmokeFree });
      
      // Calculate progress based on the journey from start date to current date
      if (targetDate > currentDate) {
        // Future quit date: progress based on preparation time + smoking performance
        const totalJourneyDays = Math.floor((targetDate - startDate) / (24 * 60 * 60 * 1000)) + 1;
        const daysPassed = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000)) + 1;
        const prepProgress = totalJourneyDays > 0 ? (daysPassed / totalJourneyDays) * 100 : 0;
        
        // Smoking progress: how many smoke-free days out of days logged from start date
        const logsInRange = logs.filter(log => {
          const logDate = new Date(log.log_date);
          logDate.setHours(0, 0, 0, 0); // Normalize to start of day
          return logDate >= startDate && logDate <= currentDate;
        });
        
        // Fix: For new trackers with few days of data, use preparation progress primarily
        let smokingProgress = 0;
        if (logsInRange.length >= 3) {
          // Only consider smoking performance if we have at least 3 days of data
          smokingProgress = (daysSmokeFree / logsInRange.length) * 100;
        } else {
          // For new trackers (less than 3 days), use a conservative estimate
          smokingProgress = daysSmokeFree > 0 ? 50 : 0; // Conservative 50% if smoke-free, 0% if smoked
        }
        
        // Adjust weighting: Use more preparation progress for new trackers
        let prepWeight, smokingWeight;
        if (daysPassed <= 3) {
          // First 3 days: 90% preparation, 10% smoking
          prepWeight = 0.9;
          smokingWeight = 0.1;
        } else if (daysPassed <= 7) {
          // First week: 80% preparation, 20% smoking  
          prepWeight = 0.8;
          smokingWeight = 0.2;
        } else {
          // After first week: 70% preparation, 30% smoking (original)
          prepWeight = 0.7;
          smokingWeight = 0.3;
        }
        
        progressPercentage = Math.round((prepProgress * prepWeight) + (smokingProgress * smokingWeight));
        
        console.log('📈 Future quit date calculation:', { 
          totalJourneyDays, 
          daysPassed, 
          prepProgress: Math.round(prepProgress), 
          smokingProgress: Math.round(smokingProgress),
          prepWeight,
          smokingWeight,
          combinedProgress: progressPercentage 
        });
      } else {
        // Past quit date: progress based on actual smoke-free performance
        // Only count days from start date to current date
        const logsInRange = logs.filter(log => {
          const logDate = new Date(log.log_date);
          logDate.setHours(0, 0, 0, 0); // Normalize to start of day
          return logDate >= startDate && logDate <= currentDate;
        });
        
        progressPercentage = logsInRange.length > 0 ? 
          Math.round((daysSmokeFree / logsInRange.length) * 100) : 0;
        
        console.log('📈 Past quit date calculation:', { 
          logsInRange: logsInRange.length, 
          daysSmokeFree, 
          progressPercentage 
        });
      }
      
      // Cap at 100%
      progressPercentage = Math.min(progressPercentage, 100);
      
    } else if (goalDays > 0) {
      // Fallback to 30-day goal calculation
      progressPercentage = Math.round((daysSmokeFree / goalDays) * 100);
      progressPercentage = Math.min(progressPercentage, 100);
      console.log('📈 Fallback goal calculation:', { goalDays, daysSmokeFree, progressPercentage });
    }
    
    const result = {
      quitDate: quitDate || null,
      daysSmokeFree,
      totalGoal: goalDays, // Keep for backward compatibility
      progressPercentage,
      lastEntry,
      successRate,
      logs,
      assistPlanData // Include for frontend use
    };
    
    console.log('🔍 Final progress result:', result);
    
    return result;
  }

  // Get a specific log by ID
  static async getLogById(userId, logId) {
    const sql = 'SELECT * FROM daily_logs WHERE id = $1 AND user_id = $2';
    const result = await query(sql, [logId, userId]);
    return result.rows[0];
  }
}

export default QuitTrackerService;
