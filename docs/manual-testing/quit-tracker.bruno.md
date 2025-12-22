# Quit Tracker API - Manual Testing Guide

This document provides curl commands and examples for testing the Quit Tracker API endpoints.

## Base URL
```
http://localhost:5000/api/quit-tracker
```

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Get Progress
**GET** `/api/quit-tracker/progress`

Get user's quit tracker progress with computed metrics.

**Query Parameters:**
- `startDate` (optional): Start date in YYYY-MM-DD format
- `endDate` (optional): End date in YYYY-MM-DD format  
- `goalDays` (optional): Goal days for progress calculation (default: 30)

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/quit-tracker/progress?goalDays=30" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "quitDate": "2025-10-05",
    "daysSmokeFree": 12,
    "totalGoal": 30,
    "progressPercentage": 40,
    "lastEntry": "2025-11-26T10:30:00.000Z",
    "successRate": 87,
    "logs": [
      {
        "id": "uuid-123",
        "user_id": "uuid-user",
        "log_date": "2025-11-26",
        "smoked": false,
        "cigarettes_count": null,
        "cravings_level": 3,
        "mood": 7,
        "notes": "Feeling strong today",
        "created_at": "2025-11-26T10:30:00.000Z",
        "updated_at": "2025-11-26T10:30:00.000Z"
      }
    ]
  }
}
```

### 2. Create or Update Daily Log
**POST** `/api/quit-tracker/log`

Create a new daily log or update an existing one for the specified date.

**Request Body:**
```json
{
  "log_date": "2025-11-26",
  "smoked": false,
  "cigarettes_count": null,
  "cravings_level": 3,
  "mood": 7,
  "notes": "Feeling strong today"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:5000/api/quit-tracker/log" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "log_date": "2025-11-26",
    "smoked": false,
    "cigarettes_count": null,
    "cravings_level": 3,
    "mood": 7,
    "notes": "Feeling strong today"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "Log saved successfully",
  "data": {
    "id": "uuid-123",
    "user_id": "uuid-user",
    "log_date": "2025-11-26",
    "smoked": false,
    "cigarettes_count": null,
    "cravings_level": 3,
    "mood": 7,
    "notes": "Feeling strong today",
    "created_at": "2025-11-26T10:30:00.000Z",
    "updated_at": "2025-11-26T10:30:00.000Z"
  }
}
```

### 3. Update Log
**PUT** `/api/quit-tracker/log/:id`

Update a specific log by ID.

**Request Body:**
```json
{
  "log_date": "2025-11-26",
  "smoked": true,
  "cigarettes_count": 5,
  "cravings_level": 8,
  "mood": 4,
  "notes": "Had a stressful day at work"
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:5000/api/quit-tracker/log/uuid-123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "log_date": "2025-11-26",
    "smoked": true,
    "cigarettes_count": 5,
    "cravings_level": 8,
    "mood": 4,
    "notes": "Had a stressful day at work"
  }'
```

### 4. Delete Log
**DELETE** `/api/quit-tracker/log/:id`

Delete a specific log by ID.

**Example Request:**
```bash
curl -X DELETE "http://localhost:5000/api/quit-tracker/log/uuid-123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Example Response:**
```json
{
  "success": true,
  "message": "Log deleted successfully",
  "data": {
    "id": "uuid-123",
    "user_id": "uuid-user",
    "log_date": "2025-11-26",
    "smoked": true,
    "cigarettes_count": 5,
    "cravings_level": 8,
    "mood": 4,
    "notes": "Had a stressful day at work",
    "created_at": "2025-11-26T10:30:00.000Z",
    "updated_at": "2025-11-26T11:00:00.000Z"
  }
}
```

### 5. Get Logs with Pagination
**GET** `/api/quit-tracker/logs`

Get paginated logs for a user.

**Query Parameters:**
- `startDate` (optional): Start date in YYYY-MM-DD format
- `endDate` (optional): End date in YYYY-MM-DD format
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of logs per page (default: 30, max: 100)

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/quit-tracker/logs?startDate=2025-11-01&endDate=2025-11-26&page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid-123",
        "user_id": "uuid-user",
        "log_date": "2025-11-26",
        "smoked": false,
        "cigarettes_count": null,
        "cravings_level": 3,
        "mood": 7,
        "notes": "Feeling strong today",
        "created_at": "2025-11-26T10:30:00.000Z",
        "updated_at": "2025-11-26T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 6. Update Quit Date
**PUT** `/api/quit-tracker/quit-date`

Update the user's official quit date.

**Request Body:**
```json
{
  "quit_date": "2025-10-05"
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:5000/api/quit-tracker/quit-date" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "quit_date": "2025-10-05"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "Quit date updated successfully",
  "data": {
    "quit_date": "2025-10-05"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "log_date and smoked are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Log not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to fetch progress data"
}
```

## Testing Scenarios

### Scenario 1: New User Setup
1. Set quit date: `PUT /quit-tracker/quit-date`
2. Create first log: `POST /quit-tracker/log`
3. Check progress: `GET /quit-tracker/progress`

### Scenario 2: Daily Logging
1. Create today's log: `POST /quit-tracker/log`
2. Update log if needed: `PUT /quit-tracker/log/:id`
3. View updated progress: `GET /quit-tracker/progress`

### Scenario 3: Progress Tracking
1. Get logs for date range: `GET /quit-tracker/logs?startDate=2025-11-01&endDate=2025-11-30`
2. Check overall progress: `GET /quit-tracker/progress?goalDays=30`
3. Update quit date if needed: `PUT /quit-tracker/quit-date`

## Data Validation Rules

- `log_date`: Must be in YYYY-MM-DD format
- `smoked`: Required boolean field
- `cigarettes_count`: Optional, must be non-negative integer if provided
- `cravings_level`: Optional, must be integer between 1-10
- `mood`: Optional, must be integer between 1-10
- `notes`: Optional text field
- `quit_date`: Optional, must be in YYYY-MM-DD format and not in future

## Notes

- All timestamps are in UTC
- Logs are automatically updated if one exists for the same date
- Progress is calculated based on quit date and smoking history
- Success rate is calculated over the last 30 days by default
