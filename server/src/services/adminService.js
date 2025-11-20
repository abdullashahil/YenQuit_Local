import { query } from '../db/index.js';

// Configs
export async function setConfig(key, value, userId) {
  const res = await query(
    `INSERT INTO admin_configs (key, value, updated_by)
     VALUES ($1, $2, $3)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = NOW()
     RETURNING *`,
    [key, value, userId || null]
  );
  return res.rows[0];
}
export async function getConfig(key) {
  const res = await query('SELECT * FROM admin_configs WHERE key = $1', [key]);
  return res.rows[0] || null;
}

// Site content
export async function setContent(slug, content, userId) {
  const res = await query(
    `INSERT INTO site_content (slug, content, updated_by)
     VALUES ($1, $2, $3)
     ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, updated_by = EXCLUDED.updated_by, updated_at = NOW()
     RETURNING *`,
    [slug, content, userId || null]
  );
  return res.rows[0];
}
export async function getContent(slug) {
  const res = await query('SELECT * FROM site_content WHERE slug = $1', [slug]);
  return res.rows[0] || null;
}

// Audit log
export async function audit(userId, action, meta) {
  await query(
    'INSERT INTO audit_logs (user_id, action, meta) VALUES ($1, $2, $3)',
    [userId || null, action, meta || {}]
  );
}

// Simple analytics: counts
export async function analyticsOverview() {
  const users = await query('SELECT COUNT(*)::int AS count FROM users');
  const plans = await query('SELECT COUNT(*)::int AS count FROM quit_plans');
  const assessments = await query('SELECT COUNT(*)::int AS count FROM fagerstrom_assessments');
  return {
    users: users.rows[0]?.count || 0,
    quitPlans: plans.rows[0]?.count || 0,
    fagerstromAssessments: assessments.rows[0]?.count || 0,
  };
}
