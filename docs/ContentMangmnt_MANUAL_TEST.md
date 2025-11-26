# Content Management API - Manual Testing Guide

## Base URL
```
http://localhost:5000/api/content
```

---

## 1. Create Content
**POST** `/api/content`

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (FormData):**
```
title: Sample Blog Post
category: Blog
description: A sample blog post for testing the API
content: This is the full content of the blog post. It contains detailed information about the topic being discussed.
status: Draft
publish_date: 2024-01-15
tags: ["blog", "sample", "test"]
media: [file upload - optional]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Content created successfully",
  "data": {
    "id": "uuid-here",
    "title": "Sample Blog Post",
    "category": "Blog",
    "description": "A sample blog post for testing the API",
    "content": "This is the full content...",
    "status": "Draft",
    "publish_date": "2024-01-15",
    "end_date": null,
    "media_url": null,
    "tags": ["blog", "sample", "test"],
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

---

## 2. Get All Content
**GET** `/api/content`

**Query Parameters (optional):**
```
?page=1&limit=10&search=blog&category=Blog&status=Draft
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Content retrieved successfully",
  "data": [
    {
      "id": "uuid-here",
      "title": "Sample Blog Post",
      "category": "Blog",
      "description": "A sample blog post",
      "content": "Full content here...",
      "status": "Draft",
      "publish_date": "2024-01-01",
      "end_date": null,
      "media_url": "http://localhost:5000/uploads/content/filename.jpg",
      "tags": ["tag1", "tag2"],
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
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
```

---

## 3. Get Content by ID
**GET** `/api/content/{id}`

**Example URL:**
```
http://localhost:5000/api/content/123e4567-e89b-12d3-a456-426614174000
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Content retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Sample Blog Post",
    "category": "Blog",
    "description": "A sample blog post",
    "content": "Full content here...",
    "status": "Draft",
    "publish_date": "2024-01-01",
    "end_date": null,
    "media_url": "http://localhost:5000/uploads/content/filename.jpg",
    "tags": ["tag1", "tag2"],
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

---

## 4. Update Content
**PUT** `/api/content/{id}`

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (FormData):**
```
title: Updated Blog Post Title
description: Updated description for the blog post
status: Live
publish_date: 2024-01-20
tags: ["blog", "updated", "live"]
media: [file upload - optional]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Content updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Updated Blog Post Title",
    "category": "Blog",
    "description": "Updated description for the blog post",
    "content": "Full content here...",
    "status": "Live",
    "publish_date": "2024-01-20",
    "end_date": null,
    "media_url": "http://localhost:5000/uploads/content/filename.jpg",
    "tags": ["blog", "updated", "live"],
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-02T10:30:00Z"
  }
}
```

---

## 5. Delete Content
**DELETE** `/api/content/{id}`

**Example URL:**
```
http://localhost:5000/api/content/123e4567-e89b-12d3-a456-426614174000
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Content deleted successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Deleted Blog Post",
    "category": "Blog",
    "description": "A sample blog post",
    "content": "Full content here...",
    "status": "Draft",
    "publish_date": "2024-01-01",
    "end_date": null,
    "media_url": "http://localhost:5000/uploads/content/filename.jpg",
    "tags": ["tag1", "tag2"],
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

---

## 6. Get Content Statistics
**GET** `/api/content/stats`

**Expected Response:**
```json
{
  "success": true,
  "message": "Stats retrieved successfully",
  "data": {
    "total": 25,
    "byStatus": [
      { "status": "Draft", "count": 10 },
      { "status": "Live", "count": 12 },
      { "status": "Pending", "count": 3 }
    ],
    "byCategory": [
      { "category": "Blog", "count": 15 },
      { "category": "Video", "count": 5 },
      { "category": "Campaign", "count": 3 },
      { "category": "Quote", "count": 2 }
    ],
    "recent": 5
  }
}
```

---

## Testing Scenarios

### ✅ Success Tests
1. **Create content** - Use the POST endpoint with valid data
2. **Get all content** - Use GET endpoint with pagination
3. **Get content by ID** - Use the ID returned from create
4. **Update content** - Use PUT endpoint with the created ID
5. **Get statistics** - Use GET /stats endpoint
6. **Delete content** - Use DELETE endpoint with the created ID

### ❌ Error Tests
1. **Create without required fields** - Send POST without title, category, or content
2. **Invalid content ID** - Use GET with invalid UUID format
3. **Non-existent content** - Use GET/PUT/DELETE with valid UUID that doesn't exist
4. **Invalid file type** - Upload file that's not PNG, JPG, MP4, or PDF
5. **File too large** - Upload file larger than 10MB

### 📁 File Upload Tests
1. **Upload image** - PNG or JPG file
2. **Upload video** - MP4 file
3. **Upload PDF** - PDF document
4. **Update with new file** - PUT request with different file
5. **Delete with file** - Verify file is removed from uploads folder

---

## Quick Test Commands

### Using curl (copy-paste ready)

```bash
# Create content
curl -X POST http://localhost:5000/api/content \
  -F "title=Test Blog Post" \
  -F "category=Blog" \
  -F "description=Test description" \
  -F "content=This is test content for manual testing" \
  -F "status=Draft" \
  -F "tags=[\"test\", \"blog\"]"

# Get all content
curl http://localhost:5000/api/content

# Get content by ID (replace with actual ID from create)
curl http://localhost:5000/api/content/YOUR_CONTENT_ID_HERE

# Update content (replace with actual ID)
curl -X PUT http://localhost:5000/api/content/YOUR_CONTENT_ID_HERE \
  -F "title=Updated Test Post" \
  -F "status=Live"

# Get statistics
curl http://localhost:5000/api/content/stats

# Delete content (replace with actual ID)
curl -X DELETE http://localhost:5000/api/content/YOUR_CONTENT_ID_HERE
```

---

## File Upload Testing

**Supported formats:** PNG, JPG, MP4, PDF  
**Maximum size:** 10MB  
**Upload location:** `/uploads/content/`  
**File URL format:** `http://localhost:5000/uploads/content/{filename}`

**Test with file:**
```bash
curl -X POST http://localhost:5000/api/content \
  -F "title=Video Test" \
  -F "category=Video" \
  -F "content=Video content test" \
  -F "status=Draft" \
  -F "media=@/path/to/your/test-file.mp4"
```

---

## Environment Setup

Make sure your server is running:
```bash
cd server
npm run dev
```

Server should be available at: `http://localhost:5000`

Check API health:
```bash
curl http://localhost:5000/
```

---

## Response Format

All endpoints return:
- **Success:** `{ "success": true, "message": "...", "data": {...} }`
- **Error:** `{ "success": false, "message": "...", "error": "..." }`

**HTTP Status Codes:**
- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `404` - Not Found (invalid ID)
- `500` - Internal Server Error

Happy testing! 🚀
