import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcrypt';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'yenquit',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

async function upsertContent(client, slug, content, updatedBy = null) {
  await client.query(
    `INSERT INTO site_content (slug, content, updated_by)
     VALUES ($1, $2, $3)
     ON CONFLICT (slug)
     DO UPDATE SET content = EXCLUDED.content, updated_by = EXCLUDED.updated_by, updated_at = NOW()`,
    [slug, content, updatedBy]
  );
}

async function upsertConfig(client, key, value, updatedBy = null) {
  await client.query(
    `INSERT INTO admin_configs (key, value, updated_by)
     VALUES ($1, $2, $3)
     ON CONFLICT (key)
     DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = NOW()`,
    [key, value, updatedBy]
  );
}

async function ensureAdminUser(client) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log('Skipping admin user creation: set ADMIN_EMAIL and ADMIN_PASSWORD in .env to seed an admin.');
    return null;
  }
  const existing = await client.query('SELECT id, role FROM users WHERE email = $1', [email]);
  if (existing.rows[0]) {
    if (existing.rows[0].role !== 'admin') {
      await client.query('UPDATE users SET role = $1 WHERE id = $2', ['admin', existing.rows[0].id]);
      console.log(`Updated existing user ${email} to admin role.`);
    } else {
      console.log(`Admin user ${email} already exists.`);
    }
    return existing.rows[0].id;
  }
  const hash = await bcrypt.hash(password, 10);
  const res = await client.query(
    `INSERT INTO users (email, password_hash, role, is_verified)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [email, hash, 'admin', true]
  );
  console.log(`Created admin user ${email}.`);
  return res.rows[0].id;
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Optional admin user
    const adminId = await ensureAdminUser(client);

    // Default landing content
    await upsertContent(client, 'landing.hero', {
      headline: 'Your Quitting Journey Begins',
      sub: 'Personalized, science-backed support to help you quit tobacco.',
      cta: 'Get Started',
    }, adminId);
    await upsertContent(client, 'landing.cta', {
      title: 'Start Now',
      button: 'Join YenQuit',
    }, adminId);

    // Example configs
    await upsertConfig(client, 'site.theme', { primary: '#1C3B5E', accent: '#20B2AA' }, adminId);
    await upsertConfig(client, 'feature.flags', { fiveR: true, fiveA: true }, adminId);

    await client.query('COMMIT');
    console.log('✅ Seed completed.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
