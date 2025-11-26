# Content Management API Documentation

## Base URL
```
http://localhost:5000/api/content
```

## Endpoints

### 1. Create Content
**POST** `/api/content`

Create new content with optional file upload.

#### Request (FormData)
- `title` (string, required) - Content title
- `category` (string, required) - Blog, Quote, Campaign, Video, Podcast, Image
- `description` (string, optional) - Short description
- `content` (string, required) - Full content text
- `status` (string, optional) - Draft, Pending, Live (default: Draft)
- `publish_date` (date, optional) - YYYY-MM-DD format
- `end_date` (date, optional) - YYYY-MM-DD format
- `media_url` (string, optional) - External media URL
- `tags` (string/array, optional) - Tags as JSON array or comma-separated
- `media` (file, optional) - File upload (PNG, JPG, MP4, PDF, max 10MB)

#### Response
```json
{
  "success": true,
  "message": "Content created successfully",
  "data": {
    "id": "uuid",
    "title": "Sample Blog Post",
    "category": "Blog",
    "description": "A sample blog post",
    "content": "Full content here...",
    "status": "Draft",
    "publish_date": "2024-01-01",
    "end_date": null,
    "media_url": "http://localhost:5000/uploads/content/filename-1234567890.jpg",
    "tags": ["tag1", "tag2"],
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

#### Curl Example
```bash
curl -X POST http://localhost:5000/api/content \
  -F "title=My First Blog Post" \
  -F "category=Blog" \
  -F "description=A sample blog post" \
  -F "content=This is the full content of the blog post..." \
  -F "status=Draft" \
  -F "publish_date=2024-01-15" \
  -F "tags=[\"blog\", \"sample\", \"first\"]" \
  -F "media=@/path/to/image.jpg"
```

### 2. Get All Content
**GET** `/api/content`

Retrieve all content with pagination and filtering.

#### Query Parameters
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10)
- `search` (string, optional) - Search by title
- `category` (string, optional) - Filter by category
- `status` (string, optional) - Filter by status

#### Response
```json
{
  "success": true,
  "message": "Content retrieved successfully",
  "data": [
    {
      "id": "uuid",
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

#### Curl Examples
```bash
# Get all content
curl http://localhost:5000/api/content

# Get page 2 with 5 items per page
curl "http://localhost:5000/api/content?page=2&limit=5"

# Search and filter
curl "http://localhost:5000/api/content?search=blog&category=Blog&status=Live"
```

### 3. Get Content by ID
**GET** `/api/content/:id`

Retrieve a single content item by its UUID.

#### Response
```json
{
  "success": true,
  "message": "Content retrieved successfully",
  "data": {
    "id": "uuid",
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

#### Curl Example
```bash
curl http://localhost:5000/api/content/123e4567-e89b-12d3-a456-426614174000
```

### 4. Update Content
**PUT** `/api/content/:id`

Update existing content with optional file upload.

#### Request (FormData)
Same fields as create endpoint, but all fields are optional.

#### Response
```json
{
  "success": true,
  "message": "Content updated successfully",
  "data": {
    "id": "uuid",
    "title": "Updated Blog Post",
    "category": "Blog",
    "description": "Updated description",
    "content": "Updated full content...",
    "status": "Live",
    "publish_date": "2024-01-15",
    "end_date": null,
    "media_url": "http://localhost:5000/uploads/content/new-filename.jpg",
    "tags": ["updated", "tags"],
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-02T10:30:00Z"
  }
}
```

#### Curl Example
```bash
curl -X PUT http://localhost:5000/api/content/123e4567-e89b-12d3-a456-426614174000 \
  -F "title=Updated Blog Post" \
  -F "status=Live" \
  -F "content=Updated content here..."
```

### 5. Delete Content
**DELETE** `/api/content/:id`

Delete content and associated file.

#### Response
```json
{
  "success": true,
  "message": "Content deleted successfully",
  "data": {
    "id": "uuid",
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

#### Curl Example
```bash
curl -X DELETE http://localhost:5000/api/content/123e4567-e89b-12d3-a456-426614174000
```

### 6. Get Content Statistics
**GET** `/api/content/stats`

Retrieve content statistics.

#### Response
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

#### Curl Example
```bash
curl http://localhost:5000/api/content/stats
```

## Error Responses

All endpoints return error responses in this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common Error Codes
- `400` - Bad Request (validation errors, invalid data)
- `404` - Not Found (content doesn't exist)
- `500` - Internal Server Error

## File Upload

- **Supported formats**: PNG, JPG, MP4, PDF
- **Maximum size**: 10MB
- **Storage location**: `/uploads/content/`
- **File naming**: `{original-name}-{timestamp}-{random}.{ext}`
- **URL format**: `http://localhost:5000/uploads/content/{filename}`

## Postman Collection

You can import this Postman collection JSON:

```json
{
  "info": {
    "name": "Content Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Content",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "formdata",
          "formdata": [
            {"key": "title", "value": "Sample Blog Post", "type": "text"},
            {"key": "category", "value": "Blog", "type": "text"},
            {"key": "description", "value": "A sample blog post", "type": "text"},
            {"key": "content", "value": "This is the full content...", "type": "text"},
            {"key": "status", "value": "Draft", "type": "text"},
            {"key": "tags", "value": "[\"blog\", \"sample\"]", "type": "text"}
          ]
        },
        "url": {
          "raw": "{{baseUrl}}/content",
          "host": ["{{baseUrl}}"],
          "path": ["content"]
        }
      }
    },
    {
      "name": "Get All Content",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/content?page=1&limit=10",
          "host": ["{{baseUrl}}"],
          "path": ["content"],
          "query": [
            {"key": "page", "value": "1"},
            {"key": "limit", "value": "10"}
          ]
        }
      }
    },
    {
      "name": "Get Content by ID",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/content/:id",
          "host": ["{{baseUrl}}"],
          "path": ["content", ":id"]
        }
      }
    },
    {
      "name": "Update Content",
      "request": {
        "method": "PUT",
        "header": [],
        "body": {
          "mode": "formdata",
          "formdata": [
            {"key": "title", "value": "Updated Blog Post", "type": "text"},
            {"key": "status", "value": "Live", "type": "text"}
          ]
        },
        "url": {
          "raw": "{{baseUrl}}/content/:id",
          "host": ["{{baseUrl}}"],
          "path": ["content", ":id"]
        }
      }
    },
    {
      "name": "Delete Content",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/content/:id",
          "host": ["{{baseUrl}}"],
          "path": ["content", ":id"]
        }
      }
    },
    {
      "name": "Get Stats",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/content/stats",
          "host": ["{{baseUrl}}"],
          "path": ["content", "stats"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ]
}
```
