# Admin Profile Settings - API Testing with Bruno

This document contains all the API test cases for the Admin Profile Settings functionality using Bruno (API testing tool).

## Setup

### Environment Variables
```
API_BASE_URL = http://localhost:5000/api
ACCESS_TOKEN = <your_jwt_token_here>
```

### Headers
```
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json
```

## API Endpoints Test Cases

### 1. Get Admin Profile

**Endpoint:** `GET /api/users/admin/profile`

**Request:**
```http
GET {{API_BASE_URL}}/users/admin/profile
Authorization: Bearer {{ACCESS_TOKEN}}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "admin-uuid-here",
    "name": "Admin User",
    "email": "admin@example.com",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or expired token
```json
{
  "error": "Invalid or expired access token"
}
```

- **404 Not Found:** Admin not found
```json
{
  "error": "Admin not found"
}
```

### 2. Update Admin Profile

**Endpoint:** `PUT /api/users/admin/profile`

**Request:**
```http
PUT {{API_BASE_URL}}/users/admin/profile
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "name": "Updated Admin Name",
  "email": "updated@example.com"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "admin-uuid-here",
    "name": "Updated Admin Name",
    "email": "updated@example.com",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-02T12:00:00.000Z"
  }
}
```

**Error Responses:**
- **400 Bad Request:** Invalid email format
```json
{
  "success": false,
  "message": "Invalid email format"
}
```

- **409 Conflict:** Email already exists
```json
{
  "success": false,
  "message": "Email already exists"
}
```

- **400 Bad Request:** No fields updated
```json
{
  "success": false,
  "message": "No fields updated"
}
```

### 3. Change Admin Password

**Endpoint:** `PUT /api/users/admin/change-password`

**Request:**
```http
PUT {{API_BASE_URL}}/users/admin/change-password
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "currentPassword": "currentPassword123",
  "newPassword": "NewPassword123!"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**
- **400 Bad Request:** Missing fields
```json
{
  "success": false,
  "message": "Current password and new password are required"
}
```

- **400 Bad Request:** Invalid password format
```json
{
  "success": false,
  "message": "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
}
```

- **400 Bad Request:** Incorrect current password
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

- **404 Not Found:** User not found
```json
{
  "success": false,
  "message": "User not found"
}
```

## Bruno Collection Setup

### Collection Structure
```
Admin Profile Settings/
├── Get Admin Profile.bru
├── Update Admin Profile.bru
└── Change Admin Password.bru
```

### Environment Configuration
Create an environment file `admin-profile-settings.env`:
```json
{
  "development": {
    "API_BASE_URL": "http://localhost:5000/api",
    "ACCESS_TOKEN": "your_development_token"
  },
  "production": {
    "API_BASE_URL": "https://your-api-domain.com/api",
    "ACCESS_TOKEN": "your_production_token"
  }
}
```

## Test Scenarios

### Positive Test Cases
1. ✅ Get admin profile with valid token
2. ✅ Update admin profile with valid data
3. ✅ Change password with valid current password and new password meeting requirements
4. ✅ Update only name field
5. ✅ Update only email field
6. ✅ Update both name and email fields

### Negative Test Cases
1. ❌ Get admin profile without token
2. ❌ Get admin profile with invalid token
3. ❌ Update profile with invalid email format
4. ❌ Update profile with existing email
5. ❌ Change password without current password
6. ❌ Change password with weak new password
7. ❌ Change password with incorrect current password
8. ❌ Change password with password less than 8 characters
9. ❌ Change password without uppercase letter
10. ❌ Change password without lowercase letter
11. ❌ Change password without number
12. ❌ Change password without special character

### Edge Cases
1. 🔄 Update profile with same values (should return success)
2. 🔄 Change password with same password (should work if current is correct)
3. 🔄 Handle concurrent profile updates
4. 🔄 Handle network timeouts
5. 🔄 Handle malformed JSON requests

## Performance Testing

### Load Testing Scenarios
- **Concurrent Users:** 10-50 admins updating profiles simultaneously
- **Request Rate:** 100 requests/minute sustained
- **Response Time:** < 500ms for profile updates
- **Memory Usage:** Monitor during high load

### Stress Testing
- **Peak Load:** 1000 requests in 1 minute
- **Database Connections:** Monitor connection pool usage
- **Error Rate:** Should be < 1% under normal load

## Security Testing

### Authentication Tests
1. Verify JWT token validation
2. Test token expiration handling
3. Test token refresh mechanism (if implemented)
4. Verify admin role validation

### Input Validation Tests
1. SQL injection attempts in name/email fields
2. XSS attempts in profile fields
3. Password brute force protection
4. Rate limiting on password change endpoint

### Data Protection Tests
1. Verify password hashing (bcrypt)
2. Check for sensitive data in responses
3. Validate HTTPS enforcement in production
4. Test CORS policies

## Automation Scripts

### Bruno CLI Testing
```bash
# Run all tests
bruno run "Admin Profile Settings" --env development

# Run specific test
bruno run "Admin Profile Settings/Get Admin Profile" --env development

# Run with custom variables
bruno run "Admin Profile Settings" --env development --var ACCESS_TOKEN="custom_token"
```

### CI/CD Integration
```yaml
# Example GitHub Actions workflow
- name: Run API Tests
  run: |
    npx -y @usebruno/cli run "Admin Profile Settings" --env ci
```

## Troubleshooting

### Common Issues
1. **401 Unauthorized:** Check token validity and format
2. **400 Bad Request:** Verify JSON structure and required fields
3. **409 Conflict:** Email already exists in database
4. **500 Internal Server Error:** Check server logs for database issues

### Debug Tips
1. Use Bruno's console to view full response
2. Check network tab in browser for frontend requests
3. Verify database state after operations
4. Check server logs for detailed error messages

### Performance Issues
1. Monitor database query performance
2. Check for N+1 query problems
3. Verify proper indexing on users table
4. Monitor memory usage during password hashing
