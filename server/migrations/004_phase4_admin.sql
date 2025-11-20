-- Phase 4: Admin & Configuration

-- Admin configs (key/value store)
CREATE TABLE IF NOT EXISTS admin_configs (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_admin_configs_key ON admin_configs(key);

-- Site content (simple CMS blocks)
CREATE TABLE IF NOT EXISTS site_content (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE, -- e.g., 'landing.hero', 'landing.cta'
  content JSONB NOT NULL,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_site_content_slug ON site_content(slug);

-- Simple audit log (admin & system actions)
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  meta JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
