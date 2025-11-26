# User Management System Documentation

## Overview

The User Management system provides comprehensive CRUD operations for managing user accounts in the admin panel. This system allows administrators to create, read, update, and delete users, with role-based access control and avatar upload functionality.

## Architecture

### Backend Components

- **UserModel** (`/server/src/models/UserModel.js`) - Database operations for users and profiles
- **userManagementController** (`/server/src/controllers/userManagementController.js`) - API endpoint handlers
- **userManagementRoutes** (`/server/src/routes/userManagementRoutes.js`) - Route definitions with admin middleware
- **Admin Middleware** (`/server/src/middleware/admin.js`) - Role-based access control
- **Upload Middleware** (`/server/src/middleware/upload.js`) - Avatar file upload handling

### Frontend Components

- **UserManagement** (`/client/src/components/admin/UserManagement.tsx`) - Main user management interface
- **UserService** (`/client/src/services/userService.ts`) - API service layer
- **UserDetailModal** (`/client/src/components/admin/UserDetailModal.tsx`) - User detail view/edit modal

## Database Schema

The system uses existing `users` and `profiles` tables:

### Users Table
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `password_hash` (VARCHAR)
- `role` (VARCHAR: 'admin', 'user')
- `status` (VARCHAR: 'active', 'inactive', 'suspended')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Profiles Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `name` (VARCHAR)
- `avatar_url` (TEXT)
- `bio` (TEXT)
- `phone` (VARCHAR)
- `age` (INTEGER)
- `fagerstrom_score` (INTEGER, 0-10)
- `addiction_level` (VARCHAR: 'Low', 'Medium', 'High')
- `join_date` (DATE)
- `last_login` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## API Endpoints

All endpoints require admin authentication via JWT token.

### Base URL
```
http://localhost:5000/api/admin/users
```

### Endpoints

#### GET /api/admin/users
Get all users with pagination and filtering.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `search` (string) - Search by name, email, or phone
- `role` (string) - Filter by role ('admin', 'user')
- `status` (string) - Filter by status ('active', 'inactive', 'suspended')

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "role": "user",
      "status": "active",
      "name": "John Doe",
      "avatar_url": "http://localhost:5000/uploads/avatars/avatar.jpg",
      "bio": "User bio",
      "phone": "+1234567890",
      "age": 30,
      "fagerstrom_score": 5,
      "addiction_level": "Medium",
      "join_date": "2024-01-15",
      "last_login": "2025-01-20T10:30:00Z",
      "created_at": "2024-01-15T08:00:00Z",
      "updated_at": "2025-01-20T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /api/admin/users/:id
Get a single user by ID.

**Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user",
    "status": "active",
    "name": "John Doe",
    "avatar_url": "http://localhost:5000/uploads/avatars/avatar.jpg",
    "bio": "User bio",
    "phone": "+1234567890",
    "age": 30,
    "fagerstrom_score": 5,
    "addiction_level": "Medium",
    "join_date": "2024-01-15",
    "last_login": "2025-01-20T10:30:00Z",
    "created_at": "2024-01-15T08:00:00Z",
    "updated_at": "2025-01-20T10:30:00Z"
  }
}
```

#### POST /api/admin/users
Create a new user.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "role": "user",
  "status": "active",
  "name": "Jane Doe",
  "bio": "New user bio",
  "phone": "+1234567890",
  "age": 25,
  "fagerstrom_score": 3,
  "addiction_level": "Low",
  "join_date": "2024-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "new-uuid",
    "email": "newuser@example.com",
    "role": "user",
    "status": "active",
    "name": "Jane Doe",
    "bio": "New user bio",
    "phone": "+1234567890",
    "age": 25,
    "fagerstrom_score": 3,
    "addiction_level": "Low",
    "join_date": "2024-01-15",
    "created_at": "2025-01-20T11:00:00Z",
    "updated_at": "2025-01-20T11:00:00Z"
  }
}
```

#### PUT /api/admin/users/:id
Update an existing user.

**Request Body:**
```json
{
  "email": "updated@example.com",
  "role": "admin",
  "status": "active",
  "name": "Updated Name",
  "bio": "Updated bio",
  "phone": "+1234567890",
  "age": 26,
  "fagerstrom_score": 4,
  "addiction_level": "Medium"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "uuid",
    "email": "updated@example.com",
    "role": "admin",
    "status": "active",
    "name": "Updated Name",
    "bio": "Updated bio",
    "phone": "+1234567890",
    "age": 26,
    "fagerstrom_score": 4,
    "addiction_level": "Medium",
    "updated_at": "2025-01-20T11:30:00Z"
  }
}
```

#### PUT /api/admin/users/:id/avatar
Update user avatar.

**Request:** `multipart/form-data`
- `avatar` (File) - Image file (PNG, JPG, max 5MB)

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "uuid",
    "avatar_url": "http://localhost:5000/uploads/avatars/avatar-new-123456789.jpg",
    "updated_at": "2025-01-20T11:45:00Z"
  }
}
```

#### DELETE /api/admin/users/:id
Delete a user.

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": "uuid",
    "email": "deleted@example.com",
    "role": "user",
    "status": "active"
  }
}
```

#### GET /api/admin/users/stats
Get user statistics.

**Response:**
```json
{
  "success": true,
  "message": "User statistics retrieved successfully",
  "data": {
    "total": 150,
    "byRole": [
      { "role": "admin", "count": 5 },
      { "role": "user", "count": 145 }
    ],
    "byStatus": [
      { "status": "active", "count": 120 },
      { "status": "inactive", "count": 25 },
      { "status": "suspended", "count": 5 }
    ],
    "recentRegistrations": 12
  }
}
```

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

The user must have an 'admin' role to access these endpoints.

## Error Handling

Common error responses:

**401 Unauthorized**
```json
{
  "error": "Access token required"
}
```

**403 Forbidden**
```json
{
  "error": "Admin access required",
  "message": "This endpoint is only accessible to administrators"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "User not found"
}
```

**409 Conflict**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

**400 Bad Request**
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

## File Upload

### Avatar Upload Specifications

- **File Types:** PNG, JPG/JPEG
- **Max Size:** 5MB
- **Storage:** `/server/uploads/avatars/`
- **URL Pattern:** `http://localhost:5000/uploads/avatars/avatar-{name}-{timestamp}.jpg`

### Upload Process

1. Frontend sends file as `multipart/form-data`
2. Multer middleware validates and stores file
3. File URL is updated in user's profile
4. Old avatar file is automatically cleaned up

## Frontend Integration

### UserService API

The frontend service (`/client/src/services/userService.ts`) provides these methods:

```typescript
// Get users with pagination and filters
userService.getUsers(params)

// Get single user
userService.getUserById(id)

// Create new user
userService.createUser(userData)

// Update user
userService.updateUser(id, userData)

// Update avatar
userService.updateAvatar(id, file)

// Delete user
userService.deleteUser(id)

// Get statistics
userService.getUserStats()
```

### Component Features

- **Real-time data fetching** with loading states
- **Search and filtering** by role and status
- **Pagination** with dynamic page numbers
- **Error handling** with retry functionality
- **Avatar upload** with preview
- **Responsive design** for mobile and desktop

## Security Considerations

1. **Admin-only access** enforced by middleware
2. **JWT authentication** required for all endpoints
3. **Input validation** for all user data
4. **File type validation** for avatar uploads
5. **SQL injection prevention** using parameterized queries
6. **Self-deletion prevention** for admin users

## Performance Optimizations

1. **Database indexes** on frequently queried fields
2. **Pagination** to limit result sets
3. **Efficient queries** with JOIN operations
4. **File compression** for avatar storage
5. **Caching** for user statistics

## Testing

See `/docs/user-api-manual-testing.md` for comprehensive API testing instructions.

## Deployment Notes

1. Ensure PostgreSQL database has `users` and `profiles` tables
2. Configure `DATABASE_URL` environment variable
3. Set up file upload directory with proper permissions
4. Configure JWT secret for authentication
5. Set up CORS for frontend domain
