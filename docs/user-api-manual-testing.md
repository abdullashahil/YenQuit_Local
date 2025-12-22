# User Management API Manual Testing Guide

## Overview

This guide provides comprehensive manual testing instructions for the User Management API endpoints. All tests require admin authentication.

## Prerequisites

1. **Running Server**: Backend server must be running on `http://localhost:5000`
2. **Database**: PostgreSQL with users and profiles tables
3. **Admin Account**: At least one admin user for authentication
4. **JWT Token**: Valid admin JWT token for API calls

## Authentication Setup

### 1. Get Admin JWT Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminPassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "admin-uuid",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

Copy the `accessToken` value for use in subsequent API calls.

## API Endpoint Tests

### 1. Get All Users

**Endpoint**: `GET /api/admin/users`

**Test 1: Basic Request**
```bash
curl -X GET "http://localhost:5000/api/admin/users" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0,
    "hasNext": false,
    "hasPrev": false
  }
}
```

**Test 2: With Pagination**
```bash
curl -X GET "http://localhost:5000/api/admin/users?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Test 3: With Search**
```bash
curl -X GET "http://localhost:5000/api/admin/users?search=john" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Test 4: With Role Filter**
```bash
curl -X GET "http://localhost:5000/api/admin/users?role=user" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Test 5: With Status Filter**
```bash
curl -X GET "http://localhost:5000/api/admin/users?status=active" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Test 6: Combined Filters**
```bash
curl -X GET "http://localhost:5000/api/admin/users?page=1&limit=10&search=test&role=user&status=active" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Create User

**Endpoint**: `POST /api/admin/users`

**Test 1: Valid User Creation**
```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123!",
    "role": "user",
    "status": "active",
    "name": "Test User",
    "bio": "Test user bio",
    "phone": "+1234567890",
    "age": 30,
    "fagerstrom_score": 5,
    "addiction_level": "Medium",
    "join_date": "2024-01-15"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "new-user-uuid",
    "email": "testuser@example.com",
    "role": "user",
    "status": "active",
    "name": "Test User",
    "bio": "Test user bio",
    "phone": "+1234567890",
    "age": 30,
    "fagerstrom_score": 5,
    "addiction_level": "Medium",
    "join_date": "2024-01-15",
    "created_at": "2025-01-20T12:00:00Z",
    "updated_at": "2025-01-20T12:00:00Z"
  }
}
```

**Test 2: Missing Required Fields**
```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

**Test 3: Duplicate Email**
```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "AnotherPassword123!"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 3. Get User by ID

**Endpoint**: `GET /api/admin/users/:id`

**Test 1: Valid User ID**
```bash
curl -X GET "http://localhost:5000/api/admin/users/USER_UUID_HERE" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "USER_UUID_HERE",
    "email": "testuser@example.com",
    "role": "user",
    "status": "active",
    "name": "Test User",
    "bio": "Test user bio",
    "phone": "+1234567890",
    "age": 30,
    "fagerstrom_score": 5,
    "addiction_level": "Medium",
    "join_date": "2024-01-15",
    "created_at": "2025-01-20T12:00:00Z",
    "updated_at": "2025-01-20T12:00:00Z"
  }
}
```

**Test 2: Invalid User ID**
```bash
curl -X GET "http://localhost:5000/api/admin/users/invalid-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "User not found"
}
```

### 4. Update User

**Endpoint**: `PUT /api/admin/users/:id`

**Test 1: Update Basic Fields**
```bash
curl -X PUT "http://localhost:5000/api/admin/users/USER_UUID_HERE" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "bio": "Updated bio",
    "phone": "+0987654321",
    "age": 31,
    "role": "admin"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "USER_UUID_HERE",
    "email": "testuser@example.com",
    "role": "admin",
    "status": "active",
    "name": "Updated Name",
    "bio": "Updated bio",
    "phone": "+0987654321",
    "age": 31,
    "fagerstrom_score": 5,
    "addiction_level": "Medium",
    "updated_at": "2025-01-20T12:30:00Z"
  }
}
```

**Test 2: Update Email to Existing Email**
```bash
curl -X PUT "http://localhost:5000/api/admin/users/USER_UUID_HERE" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Email is already in use by another user"
}
```

### 5. Update User Avatar

**Endpoint**: `PUT /api/admin/users/:id/avatar`

**Test 1: Valid Image Upload**

First, create a test image file:
```bash
# Create a simple test image (you'll need an actual image file)
echo "test image data" > test-avatar.jpg
```

Then upload it:
```bash
curl -X PUT "http://localhost:5000/api/admin/users/USER_UUID_HERE/avatar" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@test-avatar.jpg"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "USER_UUID_HERE",
    "avatar_url": "http://localhost:5000/uploads/avatars/avatar-test-1642694400000-123456789.jpg",
    "updated_at": "2025-01-20T12:45:00Z"
  }
}
```

**Test 2: Invalid File Type**
```bash
echo "not an image" > test.txt
curl -X PUT "http://localhost:5000/api/admin/users/USER_UUID_HERE/avatar" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@test.txt"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid file type. Only png, jpg files are allowed for avatars."
}
```

**Test 3: Oversized File**
```bash
# Create a large file (>5MB)
dd if=/dev/zero of=large-avatar.jpg bs=1M count=6
curl -X PUT "http://localhost:5000/api/admin/users/USER_UUID_HERE/avatar" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@large-avatar.jpg"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "File size too large. Maximum size is 10MB for content and 5MB for avatars."
}
```

### 6. Delete User

**Endpoint**: `DELETE /api/admin/users/:id`

**Test 1: Valid User Deletion**
```bash
curl -X DELETE "http://localhost:5000/api/admin/users/USER_UUID_HERE" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": "USER_UUID_HERE",
    "email": "testuser@example.com",
    "role": "user",
    "status": "active"
  }
}
```

**Test 2: Self-Deletion Prevention**
```bash
curl -X DELETE "http://localhost:5000/api/admin/users/YOUR_ADMIN_UUID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Cannot delete your own account"
}
```

**Test 3: Delete Non-existent User**
```bash
curl -X DELETE "http://localhost:5000/api/admin/users/non-existent-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "User not found"
}
```

### 7. Get User Statistics

**Endpoint**: `GET /api/admin/users/stats`

**Test 1: Get Statistics**
```bash
curl -X GET "http://localhost:5000/api/admin/users/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User statistics retrieved successfully",
  "data": {
    "total": 2,
    "byRole": [
      { "role": "admin", "count": 1 },
      { "role": "user", "count": 1 }
    ],
    "byStatus": [
      { "status": "active", "count": 2 }
    ],
    "recentRegistrations": 1
  }
}
```

## Authentication Tests

### Test 1: No Token
```bash
curl -X GET "http://localhost:5000/api/admin/users"
```

**Expected Response:**
```json
{
  "error": "Access token required"
}
```

### Test 2: Invalid Token
```bash
curl -X GET "http://localhost:5000/api/admin/users" \
  -H "Authorization: Bearer invalid_token"
```

**Expected Response:**
```json
{
  "error": "Invalid or expired access token"
}
```

### Test 3: Non-Admin Token
```bash
# First create a regular user and get their token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123!"
  }'
```

Then use regular user token:
```bash
curl -X GET "http://localhost:5000/api/admin/users" \
  -H "Authorization: Bearer REGULAR_USER_TOKEN"
```

**Expected Response:**
```json
{
  "error": "Admin access required",
  "message": "This endpoint is only accessible to administrators"
}
```

## File Upload Tests

### Test Avatar URL Accessibility
After uploading an avatar, test if the URL is accessible:

```bash
curl -I "http://localhost:5000/uploads/avatars/avatar-test-1642694400000-123456789.jpg"
```

**Expected Response:**
```
HTTP/1.1 200 OK
Content-Type: image/jpeg
...
```

### Test Non-existent Avatar
```bash
curl -I "http://localhost:5000/uploads/avatars/non-existent.jpg"
```

**Expected Response:**
```
HTTP/1.1 404 Not Found
```

## Performance Tests

### Test Pagination Performance
```bash
# Test with large page size
curl -X GET "http://localhost:5000/api/admin/users?limit=100" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -w "\nTime: %{time_total}s\n"
```

### Test Search Performance
```bash
# Test search with common terms
curl -X GET "http://localhost:5000/api/admin/users?search=a" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -w "\nTime: %{time_total}s\n"
```

## Error Handling Tests

### Test Invalid UUID Format
```bash
curl -X GET "http://localhost:5000/api/admin/users/invalid-format" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Malformed JSON
```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  '  # Missing closing brace
```

### Test Empty Request Body
```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d ''
```

## Cleanup Tests

### Delete Test Users
```bash
# Get all users and delete test ones
curl -X GET "http://localhost:5000/api/admin/users" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" | \
  jq -r '.data[] | select(.email | contains("test")) | .id' | \
  xargs -I {} curl -X DELETE "http://localhost:5000/api/admin/users/{}" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Clean Up Test Files
```bash
rm -f test-avatar.jpg test.txt large-avatar.jpg
```

## Test Checklist

- [ ] All endpoints respond with correct status codes
- [ ] Authentication works correctly
- [ ] Admin-only access is enforced
- [ ] Pagination works as expected
- [ ] Search and filtering work correctly
- [ ] File upload handles valid and invalid files
- [ ] Error responses are informative
- [ ] Database constraints are respected
- [ ] Performance is acceptable
- [ ] Cleanup removes test data

## Notes

1. Replace `YOUR_JWT_TOKEN` with actual admin JWT token
2. Replace `USER_UUID_HERE` with actual user UUID from previous responses
3. Some tests require creating users first
4. File upload tests require actual image files
5. Performance tests should be run multiple times for consistency
