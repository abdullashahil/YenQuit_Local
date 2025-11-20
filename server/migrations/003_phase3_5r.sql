-- Phase 3: 5R's schema (Relevance, Risks, Rewards, Roadblocks, Repetition)

-- Relevance: personal reasons/goals
CREATE TABLE IF NOT EXISTS r_relevance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goals TEXT[],
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_r_relevance_user_id ON r_relevance(user_id);

-- Risks: selected risks and optional custom notes
CREATE TABLE IF NOT EXISTS r_risks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  risks TEXT[],
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_r_risks_user_id ON r_risks(user_id);

-- Rewards: selected rewards and computed savings snapshot
CREATE TABLE IF NOT EXISTS r_rewards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rewards TEXT[],
  estimated_monthly_savings NUMERIC(12,2),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_r_rewards_user_id ON r_rewards(user_id);

-- Roadblocks: barriers and suggested strategies captured at time of entry
CREATE TABLE IF NOT EXISTS r_roadblocks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  barriers TEXT[],
  strategies TEXT[],
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_r_roadblocks_user_id ON r_roadblocks(user_id);

-- Repetition: reminders/follow-ups specific to 5R
CREATE TABLE IF NOT EXISTS r_repetition (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  schedule JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_r_repetition_user_id ON r_repetition(user_id);
