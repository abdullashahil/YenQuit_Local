import { query } from '../db/index.js';

/**
 * Fetch chat history for a user for the last 7 days
 * @param {string} userId - User UUID
 * @returns {Promise<Array>} - Flattened array of chat messages in chronological order
 */
export const fetchChatHistory = async (userId) => {
  const sql = `
    SELECT 
      chat_date,
      messages
    FROM user_chat_logs 
    WHERE user_id = $1 
      AND chat_date >= CURRENT_DATE - INTERVAL '7 days'
    ORDER BY chat_date ASC, created_at ASC
  `;

  const result = await query(sql, [userId]);

  if (result.rows.length === 0) {
    return [];
  }

  // Flatten all messages from all days into a single array
  const allMessages = [];
  for (const row of result.rows) {
    if (row.messages && Array.isArray(row.messages)) {
      allMessages.push(...row.messages);
    }
  }

  return allMessages;
};

/**
 * Append a chat message to today's chat log or create a new entry
 * @param {string} userId - User UUID
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - Message content
 * @returns {Promise<void>}
 */
export const appendChatMessage = async (userId, role, content) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  // First try to update existing row
  const updateSql = `
    UPDATE user_chat_logs 
    SET messages = messages || $1::jsonb,
        updated_at = NOW()
    WHERE user_id = $2 AND chat_date = $3
    RETURNING id
  `;

  const newMessage = JSON.stringify({ role, content, timestamp: new Date().toISOString() });
  const updateResult = await query(updateSql, [newMessage, userId, today]);

  // If no row exists for today, create one
  if (updateResult.rows.length === 0) {
    const insertSql = `
      INSERT INTO user_chat_logs (user_id, chat_date, messages)
      VALUES ($1, $2, $3::jsonb)
    `;

    const initialMessages = JSON.stringify([{ role, content, timestamp: new Date().toISOString() }]);
    await query(insertSql, [userId, today, initialMessages]);
  }
};

/**
 * Clean up old chat messages older than 7 days
 * @returns {Promise<number>} - Number of deleted rows
 */
export const cleanupOldChatMessages = async () => {
  const sql = `
    DELETE FROM user_chat_logs 
    WHERE chat_date < CURRENT_DATE - INTERVAL '7 days'
    RETURNING id
  `;

  const result = await query(sql);
  return result.rows.length;
};

/**
 * Get chat statistics for a user
 * @param {string} userId - User UUID
 * @returns {Promise<Object>} - Chat statistics
 */
export const getChatStats = async (userId) => {
  const sql = `
    SELECT 
      COUNT(*) as total_days,
      SUM(jsonb_array_length(messages)) as total_messages,
      MAX(chat_date) as last_chat_date,
      MIN(chat_date) as first_chat_date
    FROM user_chat_logs 
    WHERE user_id = $1
  `;

  const result = await query(sql, [userId]);
  return result.rows[0] || {
    total_days: 0,
    total_messages: 0,
    last_chat_date: null,
    first_chat_date: null
  };
};
