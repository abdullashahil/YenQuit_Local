# YenQuit Backend API

A minimal Node.js + Express + PostgreSQL backend for user authentication and profile management.

## Features
- User registration with profile creation (transactional)
- JWT access & refresh token authentication
- Login, refresh, logout endpoints
- Protected user info/profile endpoints
- Bcrypt password hashing
- Parameterized SQL queries (pg)
- Centralized error handling
- Layered, clean structure for easy extension

## Folder Structure
```
src/
  routes/
  controllers/
  services/
  db/
  middleware/
  utils/
  app.js
index.js
```

## Setup
1. Clone repo and install dependencies:
   ```sh
   npm install
   ```
2. Set up your PostgreSQL database using the provided schema (see below).
3. Create a `.env` file in `server/`:
   ```env
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   DB_NAME=yenquit
   DB_HOST=localhost
   ACCESS_TOKEN_SECRET=your_access_secret
   REFRESH_TOKEN_SECRET=your_refresh_secret
   NODE_ENV=development
   PORT=5000
   ```
4. Start server:
   ```sh
   npm start
   ```

## Database Schema
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'co_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(150),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  phone VARCHAR(20),
  age INT CHECK (age >= 0 AND age <= 120),
  gender VARCHAR(32),
  tobacco_type VARCHAR(50),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_metadata ON profiles USING gin (metadata);
```

## API Endpoints
### Auth
- `POST /api/auth/register` — Register user & profile
- `POST /api/auth/login` — Login (returns tokens)
- `POST /api/auth/refresh` — Refresh access token
- `POST /api/auth/logout` — Logout (invalidate refresh)

### User
- `GET /api/users/me` — Get current user & profile (auth)
- `PUT /api/users/me/profile` — Update profile (auth)

## Example Requests
### Register
```sh
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","profile":{"full_name":"Test User"}}'
```
### Login
```sh
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```
### Refresh
```sh
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<token>"}'
```
### Get Profile
```sh
curl -H "Authorization: Bearer <accessToken>" http://localhost:5000/api/users/me
```
### Update Profile
```sh
curl -X PUT http://localhost:5000/api/users/me/profile \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"New Name"}'
```

---

## License
MIT