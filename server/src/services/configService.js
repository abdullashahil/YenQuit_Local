import { query } from '../db/index.js';

export const ConfigService = {
    async initialize() {
        const sql = `
      CREATE TABLE IF NOT EXISTS system_settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
        await query(sql);
    },

    async get(key) {
        const sql = `SELECT value FROM system_settings WHERE key = $1`;
        const result = await query(sql, [key]);
        return result.rows[0]?.value || null;
    },

    async set(key, value) {
        const sql = `
      INSERT INTO system_settings (key, value, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (key) 
      DO UPDATE SET value = $2, updated_at = NOW()
      RETURNING *;
    `;
        const result = await query(sql, [key, value]);
        return result.rows[0];
    },

    async getAll() {
        const sql = `SELECT key, value FROM system_settings`;
        const result = await query(sql);
        const settings = {};
        result.rows.forEach(row => {
            settings[row.key] = row.value;
        });
        return settings;
    }
};
