 import { Pool } from 'pg';
 import { readFileSync, readdirSync } from 'fs';
 import path from 'path';
 import { fileURLToPath } from 'url';
 import dotenv from 'dotenv';

 dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'yenquit',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const dir = path.join(__dirname, '../migrations');
    const files = readdirSync(dir)
      .filter((f) => f.endsWith('.sql'))
      .sort();
    for (const file of files) {
      const full = path.join(dir, file);
      const sql = readFileSync(full, 'utf8');
      if (sql && sql.trim().length) {
        await client.query(sql);
      }
    }
    await client.query('COMMIT');
    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
