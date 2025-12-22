# 🚀 YenQuit Deployment Guide

This document outlines the steps solely for **deploying and hosting** the YenQuit application in a production environment. This guide is intended for the IT Department or System Administrators responsible for server maintenance.

## 📋 Prerequisites

Ensure the hosting server has the following installed:
*   **Node.js**: Version 18 (LTS) or higher.
*   **PostgreSQL**: Latest stable version.
*   **PM2** (Recommended): Global install for process management (`npm install -g pm2`).
*   **Nginx** (Optional but Recommended): As a reverse proxy.

---

## 🏗️ 1. Database Setup

1.  Ensure PostgreSQL is running.
2.  Create a production database (e.g., `yenquit_prod`).
3.  Run the necessary migration scripts located in `server/migrations/` (if applicable) or restore from a provided dump.

---

## 🖥️ 2. Server (Backend) Deployment

The backend is an Express.js application running on Node.js.

### 2a. Configuration
1.  Navigate to the `server/` directory.
2.  Create a `.env` file based on `.env.example`.
3.  **Critical Variables**:
    *   `PORT`: Port for the API (default `5000`).
    *   `DATABASE_URL` / DB Credentials: Connection string for the PostgreSQL production database.
    *   `CORS_ORIGIN`: The URL where the Client (Frontend) will be hosted (e.g., `https://yenquit.organization.com`).

### 2b. Installation & Startup
```bash
cd server
npm ci --production
```

### 2c. Run with PM2
We recommend using PM2 to keep the server alive and handle log rotation.
```bash
# Start the server (assuming entry point is index.js)
pm2 start index.js --name "yenquit-api"
pm2 save
```

---

## 🌐 3. Client (Frontend) Deployment

The frontend is a Next.js 16 application.

### 3a. Configuration
1.  Navigate to the `client/` directory.
2.  Create a `.env.local` or `.env.production` file.
3.  **Critical Variables**:
    *   `NEXT_PUBLIC_API_URL`: The full URL of the deployed Backend API (e.g., `https://api-yenquit.organization.com` or `http://localhost:5000` if behind same proxy).

### 3b. Build & Start
Next.js produces an optimized production build.
```bash
cd client
npm ci
npm run build
```

### 3c. Run with PM2
```bash
# Start the Next.js production server
pm2 start npm --name "yenquit-web" -- start -- -p 3000
pm2 save
```

---

## 🔗 4. Reverse Proxy (Nginx) Example

It is best practice to run these services behind a reverse proxy like Nginx to handle SSL and port forwarding.

```nginx
# Example Nginx Block

server {
    listen 80;
    server_name yenquit.organization.com;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (Express)
    location /api {
        # Adjust /api rewrite rule if necessary based on backend routes
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔄 Maintenance

*   **Logs**: Check logs via `pm2 logs yenquit-api` or `pm2 logs yenquit-web`.
*   **Updates**: To update the app, pull the latest code, run `npm install` in respective folders, rebuild the client (`npm run build`), and restart PM2 processes (`pm2 restart all`).
