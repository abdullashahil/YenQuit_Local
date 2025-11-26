# API Manual Testing Guide - Bruno Collection

This document provides comprehensive manual testing instructions for all backend API endpoints using Bruno.

## 🚀 Setup Instructions

### 1. Bruno Collection Setup
1. Install Bruno (https://www.usebruno.com/)
2. Create a new collection: "YenQuit API Testing"
3. Set environment variables:
   ```json
   {
     "baseUrl": "http://localhost:5000/api",
     "adminEmail": "admin@gmail.com",
     "adminPassword": "admin@123"
   }
   ```

### 2. Authentication Setup
- Get admin token from `/api/auth/login` endpoint
- Store token in environment variable: `{{adminToken}}`

---

## 🔐 Authentication Routes

### POST /api/auth/login
**Purpose**: User login and JWT token generation

**Request Body**:
```json
{
  "email": "{{adminEmail}}",
  "password": "{{adminPassword}}"
}
```

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "email": "admin@gmail.com",
      "role": "admin",
      "status": "active"
    }
  }
}
```

**Test Cases**:
- ✅ Valid credentials → 200 OK
- ❌ Invalid email → 400 Bad Request
- ❌ Invalid password → 401 Unauthorized
- ❌ Missing fields → 400 Bad Request

### POST /api/auth/register
**Purpose**: New user registration

**Request Body**:
```json
{
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Expected Response (201)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "test@example.com",
      "role": "user"
    }
  }
}
```

---

## 👥 User Management Routes (Admin Only)

### GET /api/users/admin/users
**Purpose**: Get all users with pagination and filters

**Headers**:
```
Authorization: Bearer {{adminToken}}
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by email, name, or phone
- `role` (optional): Filter by role (admin, user)
- `status` (optional): Filter by status (active, inactive)

**Example URL**:
```
{{baseUrl}}/users/admin/users?page=1&limit=10&search=admin&role=admin&status=active
```

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "uuid-here",
      "email": "admin@gmail.com",
      "role": "admin",
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "full_name": "Admin User",
      "avatar_url": null,
      "bio": null,
      "phone": null,
      "age": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

**Test Cases**:
- ✅ Valid admin token → 200 OK
- ❌ No token → 401 Unauthorized
- ❌ Invalid token → 401 Unauthorized
- ❌ Non-admin user → 403 Forbidden

### GET /api/users/admin/users/stats
**Purpose**: Get user statistics

**Headers**:
```
Authorization: Bearer {{adminToken}}
```

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "User statistics retrieved successfully",
  "data": {
    "total": 10,
    "byRole": [
      {"role": "admin", "count": 1},
      {"role": "user", "count": 9}
    ],
    "byStatus": [
      {"status": "active", "count": 8},
      {"status": "inactive", "count": 2}
    ],
    "recentRegistrations": 3
  }
}
```

### GET /api/users/admin/users/:id
**Purpose**: Get specific user by ID

**Headers**:
```
Authorization: Bearer {{adminToken}}
```

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid-here",
    "email": "admin@gmail.com",
    "role": "admin",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "full_name": "Admin User",
    "avatar_url": null,
    "bio": null,
    "phone": null,
    "age": null
  }
}
```

**Test Cases**:
- ✅ Valid user ID → 200 OK
- ❌ Invalid user ID → 404 Not Found
- ❌ UUID format error → 400 Bad Request

### POST /api/users/admin/users
**Purpose**: Create new user

**Headers**:
```
Authorization: Bearer {{adminToken}}
```

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "role": "user",
  "status": "active",
  "name": "New User",
  "bio": "User bio",
  "phone": "+1234567890",
  "age": 25,
  "fagerstrom_score": 5,
  "addiction_level": "medium",
  "join_date": "2024-01-01T00:00:00.000Z"
}
```

**Expected Response (201)**:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "new-uuid-here",
    "email": "newuser@example.com",
    "role": "user",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Test Cases**:
- ✅ Valid data → 201 Created
- ❌ Duplicate email → 409 Conflict
- ❌ Missing required fields → 400 Bad Request
- ❌ Invalid email format → 400 Bad Request

### PUT /api/users/admin/users/:id
**Purpose**: Update existing user

**Headers**:
```
Authorization: Bearer {{adminToken}}
```

**Request Body**:
```json
{
  "email": "updated@example.com",
  "role": "admin",
  "status": "active",
  "name": "Updated Name",
  "bio": "Updated bio",
  "phone": "+1234567890",
  "age": 30
}
```

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "uuid-here",
    "email": "updated@example.com",
    "role": "admin",
    "status": "active",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### DELETE /api/users/admin/users/:id
**Purpose**: Delete user

**Headers**:
```
Authorization: Bearer {{adminToken}}
```

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": "deleted-uuid-here",
    "email": "deleted@example.com"
  }
}
```

**Test Cases**:
- ✅ Valid user ID → 200 OK
- ❌ Non-existent user → 404 Not Found
- ❌ Trying to delete self → 400 Bad Request

---

## 👤 Regular User Routes

### GET /api/users/me
**Purpose**: Get current user profile

**Headers**:
```
Authorization: Bearer {{userToken}}
```

**Expected Response (200)**:
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "role": "user",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "full_name": "Regular User",
    "avatar_url": null,
    "bio": null,
    "phone": null,
    "age": null
  }
}
```

### PUT /api/users/me/profile
**Purpose**: Update current user profile

**Headers**:
```
Authorization: Bearer {{userToken}}
```

**Request Body**:
```json
{
  "full_name": "Updated Name",
  "bio": "Updated bio",
  "phone": "+1234567890",
  "age": 25,
  "avatar_url": "https://example.com/avatar.jpg"
}
```

**Expected Response (200)**:
```json
{
  "profile": {
    "id": "profile-uuid",
    "user_id": "user-uuid",
    "full_name": "Updated Name",
    "bio": "Updated bio",
    "phone": "+1234567890",
    "age": 25,
    "avatar_url": "https://example.com/avatar.jpg",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📝 Content Management Routes

### GET /api/content
**Purpose**: Get all content with pagination

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

### GET /api/content/:id
**Purpose**: Get specific content by ID

### POST /api/content
**Purpose**: Create new content (Admin only)

**Headers**:
```
Authorization: Bearer {{adminToken}}
```

**Request Body**:
```json
{
  "title": "New Content",
  "description": "Content description",
  "type": "article",
  "status": "published"
}
```

### PUT /api/content/:id
**Purpose**: Update content (Admin only)

### DELETE /api/content/:id
**Purpose**: Delete content (Admin only)

---

## 🔧 Error Response Format

All endpoints return consistent error responses:

**400 Bad Request**:
```json
{
  "success": false,
  "message": "Validation error details",
  "error": "Field validation failed"
}
```

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Invalid or expired access token",
  "error": "Authentication failed"
}
```

**403 Forbidden**:
```json
{
  "success": false,
  "message": "Access denied - admin privileges required",
  "error": "Authorization failed"
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "Resource not found",
  "error": "User/Content not found"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Database connection failed"
}
```

---

## 🧪 Testing Checklist

### Authentication Tests
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Register new user
- [ ] Register with duplicate email
- [ ] Token validation
- [ ] Token expiration

### User Management Tests
- [ ] Get all users (admin)
- [ ] Get user statistics (admin)
- [ ] Get specific user (admin)
- [ ] Create new user (admin)
- [ ] Update user (admin)
- [ ] Delete user (admin)
- [ ] Access admin routes without token
- [ ] Access admin routes with user token

### Regular User Tests
- [ ] Get current user profile
- [ ] Update user profile
- [ ] Access other user's data (should fail)

### Content Management Tests
- [ ] Get all content
- [ ] Get specific content
- [ ] Create content (admin)
- [ ] Update content (admin)
- [ ] Delete content (admin)
- [ ] Create content (user - should fail)

---

## 📊 Performance Testing

### Load Testing Scenarios
1. **User Registration**: 100 concurrent registrations
2. **User Login**: 500 concurrent logins
3. **User List**: 1000 requests for user list with pagination
4. **User Search**: Search requests with various filters

### Expected Performance Metrics
- **Response Time**: < 200ms for simple queries
- **Response Time**: < 500ms for complex queries
- **Throughput**: > 100 requests/second
- **Error Rate**: < 1% for valid requests

---

## 🐛 Common Issues & Solutions

### 1. Token Issues
**Problem**: "Invalid or expired access token"
**Solution**: 
- Check token format: `Bearer <token>`
- Verify token is not expired
- Re-login to get fresh token

### 2. Database Connection
**Problem**: 500 Internal Server Error
**Solution**:
- Check database connection string
- Verify database is running
- Check database schema

### 3. CORS Issues
**Problem**: Network error/CORS error
**Solution**:
- Verify CORS settings on server
- Check API base URL in environment

### 4. Validation Errors
**Problem**: 400 Bad Request
**Solution**:
- Check request body format
- Verify required fields
- Check data types and formats

---

## 📝 Bruno Collection Export

You can import this collection directly into Bruno using the following collection structure:

```json
{
  "name": "YenQuit API",
  "version": "1.0.0",
  "environments": {
    "Development": {
      "baseUrl": "http://localhost:5000/api",
      "adminEmail": "admin@gmail.com",
      "adminPassword": "admin@123"
    }
  },
  "folders": [
    {
      "name": "Authentication",
      "requests": [
        "login",
        "register"
      ]
    },
    {
      "name": "User Management",
      "requests": [
        "get-users",
        "get-user-stats",
        "get-user-by-id",
        "create-user",
        "update-user",
        "delete-user"
      ]
    },
    {
      "name": "Regular User",
      "requests": [
        "get-me",
        "update-profile"
      ]
    },
    {
      "name": "Content Management",
      "requests": [
        "get-content",
        "get-content-by-id",
        "create-content",
        "update-content",
        "delete-content"
      ]
    }
  ]
}
```

---

## 🔄 Automated Testing Integration

### Bruno CLI
```bash
# Run all tests
bru run

# Run specific folder
bru run "Authentication"

# Run with environment
bru run --env Development

# Generate report
bru run --reporter html
```

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Run API Tests
  run: |
    npm install -g @usebruno/cli
    bru run --env Production --reporter junit
```

---

**Happy Testing! 🚀**
