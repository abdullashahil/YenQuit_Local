-- Migration to remove unused columns from users table
-- Columns to remove: first_name, last_name, bio, avatar_url, addiction_level, last_login, status

ALTER TABLE public.users
DROP COLUMN IF EXISTS first_name,
DROP COLUMN IF EXISTS last_name,
DROP COLUMN IF EXISTS bio,
DROP COLUMN IF EXISTS avatar_url,
DROP COLUMN IF EXISTS addiction_level,
DROP COLUMN IF EXISTS last_login,
DROP COLUMN IF EXISTS status;
