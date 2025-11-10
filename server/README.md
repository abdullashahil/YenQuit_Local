# YenQuit Backend Server

Node.js backend server with PostgreSQL database connection.

## Prerequisites

- PostgreSQL (with pgAdmin)
- Database named `yenquit` created in PostgreSQL

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Open pgAdmin and create a database named `yenquit`
2. Run the schema file to create tables:
   - Open pgAdmin Query Tool
   - Open `database/schema.sql`
   - Execute the SQL script

### 3. Environment Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your PostgreSQL credentials:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=yenquit
DB_USER=postgres
DB_PASSWORD=your_actual_password

CLIENT_URL=http://localhost:5173
```