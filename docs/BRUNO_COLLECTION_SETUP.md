# Bruno Collection Setup Guide

## 📦 Bruno Collection Files

This guide explains how to set up and use Bruno collections for testing the YenQuit API.

## 🗂️ Collection Structure

Create the following folder structure in Bruno:

```
YenQuit API/
├── Environments/
│   ├── Development.bru
│   └── Production.bru
├── Authentication/
│   ├── POST_login.bru
│   └── POST_register.bru
├── User Management/
│   ├── GET_users.bru
│   ├── GET_user-stats.bru
│   ├── GET_user-by-id.bru
│   ├── POST_create-user.bru
│   ├── PUT_update-user.bru
│   └── DELETE_delete-user.bru
├── Regular User/
│   ├── GET_me.bru
│   └── PUT_update-profile.bru
└── Content Management/
    ├── GET_content.bru
    ├── GET_content-by-id.bru
    ├── POST_create-content.bru
    ├── PUT_update-content.bru
    └── DELETE_delete-content.bru
```

## 🔧 Environment Setup

### Development Environment (`Development.bru`)
```json
{
  "name": "Development",
  "variables": {
    "baseUrl": "http://localhost:5000/api",
    "adminEmail": "admin@gmail.com",
    "adminPassword": "admin@123",
    "testEmail": "test@example.com",
    "testPassword": "password123"
  }
}
```

### Production Environment (`Production.bru`)
```json
{
  "name": "Production",
  "variables": {
    "baseUrl": "https://api.yenquit.com/api",
    "adminEmail": "admin@yenquit.com",
    "adminPassword": "{{productionAdminPassword}}",
    "testEmail": "test@yenquit.com",
    "testPassword": "{{productionTestPassword}}"
  }
}
```

## 📝 Request Examples

### Authentication - Login (`POST_login.bru`)
```json
{
  "meta": {
    "name": "Login",
    "type": "http"
  },
  "method": "POST",
  "url": "{{baseUrl}}/auth/login",
  "headers": [
    {
      "name": "Content-Type",
      "value": "application/json"
    }
  ],
  "body": {
    "type": "json",
    "json": {
      "email": "{{adminEmail}}",
      "password": "{{adminPassword}}"
    },
    "raw": ""
  },
  "tests": [
    {
      "script": {
        "type": "javascript",
        "source": "bru.setEnvVar('adminToken', res.body.data.token);\nbru.setEnvVar('userId', res.body.data.user.id);"
      }
    }
  ]
}
```

### User Management - Get Users (`GET_users.bru`)
```json
{
  "meta": {
    "name": "Get All Users",
    "type": "http"
  },
  "method": "GET",
  "url": "{{baseUrl}}/users/admin/users?page=1&limit=10",
  "headers": [
    {
      "name": "Authorization",
      "value": "Bearer {{adminToken}}"
    }
  ],
  "params": [
    {
      "name": "page",
      "value": "1",
      "description": "Page number",
      "type": "query"
    },
    {
      "name": "limit",
      "value": "10",
      "description": "Items per page",
      "type": "query"
    },
    {
      "name": "search",
      "value": "",
      "description": "Search term",
      "type": "query"
    },
    {
      "name": "role",
      "value": "all",
      "description": "Filter by role",
      "type": "query"
    },
    {
      "name": "status",
      "value": "all",
      "description": "Filter by status",
      "type": "query"
    }
  ],
  "tests": [
    {
      "script": {
        "type": "javascript",
        "source": "bru.assert.ok(res.status === 200, 'Status should be 200');\nbru.assert.ok(res.body.success === true, 'Response should be successful');\nbru.assert.ok(Array.isArray(res.body.data), 'Data should be an array');"
      }
    }
  ]
}
```

### User Management - Create User (`POST_create-user.bru`)
```json
{
  "meta": {
    "name": "Create User",
    "type": "http"
  },
  "method": "POST",
  "url": "{{baseUrl}}/users/admin/users",
  "headers": [
    {
      "name": "Authorization",
      "value": "Bearer {{adminToken}}"
    },
    {
      "name": "Content-Type",
      "value": "application/json"
    }
  ],
  "body": {
    "type": "json",
    "json": {
      "email": "newuser{{timestamp}}@example.com",
      "password": "password123",
      "role": "user",
      "status": "active",
      "name": "Test User",
      "bio": "Test user bio",
      "phone": "+1234567890",
      "age": 25,
      "fagerstrom_score": 3,
      "addiction_level": "low",
      "join_date": "2024-01-01T00:00:00.000Z"
    }
  },
  "tests": [
    {
      "script": {
        "type": "javascript",
        "source": "bru.assert.ok(res.status === 201, 'Status should be 201');\nbru.assert.ok(res.body.success === true, 'Response should be successful');\nbru.assert.ok(res.body.data.email, 'User should have email');\nbru.setEnvVar('newUserId', res.body.data.id);"
      }
    }
  ]
}
```

### Regular User - Get Profile (`GET_me.bru`)
```json
{
  "meta": {
    "name": "Get My Profile",
    "type": "http"
  },
  "method": "GET",
  "url": "{{baseUrl}}/users/me",
  "headers": [
    {
      "name": "Authorization",
      "value": "Bearer {{adminToken}}"
    }
  ],
  "tests": [
    {
      "script": {
        "type": "javascript",
        "source": "bru.assert.ok(res.status === 200, 'Status should be 200');\nbru.assert.ok(res.body.user, 'Response should contain user data');\nbru.assert.ok(res.body.user.email, 'User should have email');"
      }
    }
  ]
}
```

## 🧪 Test Scripts

### Common Test Assertions
```javascript
// Success response validation
bru.assert.ok(res.status >= 200 && res.status < 300, 'Status should be successful');
bru.assert.ok(res.body.success === true, 'Response should be successful');

// Error response validation
bru.assert.ok(res.status >= 400, 'Status should indicate error');
bru.assert.ok(res.body.success === false, 'Response should indicate failure');

// Data validation
bru.assert.ok(Array.isArray(res.body.data), 'Data should be an array');
bru.assert.ok(res.body.data.length > 0, 'Data should not be empty');

// Token validation
bru.assert.ok(res.body.data.token, 'Response should contain token');
bru.setEnvVar('authToken', res.body.data.token);
```

### Environment Variable Management
```javascript
// Set variables from response
bru.setEnvVar('userId', res.body.data.id);
bru.setEnvVar('userEmail', res.body.data.email);
bru.setEnvVar('authToken', res.body.data.token);

// Generate unique values
const timestamp = Date.now();
bru.setEnvVar('timestamp', timestamp);
bru.setEnvVar('uniqueEmail', `test${timestamp}@example.com`);

// Clean up variables
bru.deleteEnvVar('tempToken');
```

## 🔄 Workflows

### 1. Authentication Workflow
1. Run `POST_login.bru` → Sets `adminToken`
2. Run `GET_me.bru` → Uses token to get profile
3. Run `PUT_update-profile.bru` → Updates profile

### 2. User Management Workflow
1. Run `POST_login.bru` → Get admin token
2. Run `GET_users.bru` → List all users
3. Run `POST_create-user.bru` → Create new user
4. Run `GET_user-by-id.bru` → Get specific user
5. Run `PUT_update-user.bru` → Update user
6. Run `DELETE_delete-user.bru` → Delete user

### 3. Content Management Workflow
1. Run `POST_login.bru` → Get admin token
2. Run `POST_create-content.bru` → Create content
3. Run `GET_content.bru` → List all content
4. Run `PUT_update-content.bru` → Update content
5. Run `DELETE_delete-content.bru` → Delete content

## 📊 Reporting

### HTML Report Generation
```bash
# Install Bruno CLI
npm install -g @usebruno/cli

# Run collection with HTML report
bru run --reporter html --output reports/api-test-report.html

# Run specific folder
bru run "User Management" --reporter html --output reports/user-management-report.html

# Run with environment
bru run --env Development --reporter html --output reports/dev-report.html
```

### JUnit Report for CI/CD
```bash
# Generate JUnit XML report
bru run --reporter junit --output reports/junit-results.xml

# Use in GitHub Actions
bru run --env Production --reporter junit --output reports/junit-results.xml
```

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: API Tests
on: [push, pull_request]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Bruno CLI
        run: npm install -g @usebruno/cli
        
      - name: Run API Tests
        run: |
          bru run --env Production --reporter junit --output reports/junit-results.xml
          
      - name: Upload Test Results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: reports/
```

### Docker Integration
```dockerfile
FROM node:18-alpine

RUN npm install -g @usebruno/cli

WORKDIR /app
COPY . .

# Run tests
CMD ["bru", "run", "--env", "Production", "--reporter", "html", "--output", "/reports/report.html"]
```

## 🔧 Advanced Features

### Request Chaining
```javascript
// Use response from one request in another
const userId = bru.getResponse('GET_users').body.data[0].id;
bru.setVar('selectedUserId', userId);
```

### Dynamic Data Generation
```javascript
// Generate random data
const faker = require('faker');
const randomEmail = faker.internet.email();
const randomName = faker.name.findName();

bru.setEnvVar('testEmail', randomEmail);
bru.setEnvVar('testName', randomName);
```

### Conditional Testing
```javascript
// Skip tests based on conditions
if (res.status === 401) {
  bru.skip('Skipping test due to authentication failure');
}

// Retry logic
if (res.status >= 500) {
  bru.retry('Server error, retrying...');
}
```

## 📱 Mobile Testing

### Bruno Mobile App Setup
1. Install Bruno mobile app
2. Import collection via QR code or file
3. Configure environment variables
4. Run tests on mobile

### Mobile-Specific Considerations
- Test API endpoints from mobile devices
- Verify CORS headers for mobile apps
- Test with mobile network conditions
- Validate response sizes for mobile

## 🛠️ Troubleshooting

### Common Issues
1. **Token Expiration**: Re-run login request
2. **CORS Issues**: Check server CORS configuration
3. **Environment Variables**: Verify variable names and values
4. **Network Issues**: Check API server status
5. **JSON Syntax**: Validate request body format

### Debug Mode
```javascript
// Enable debug logging
console.log('Request URL:', req.url);
console.log('Request Headers:', req.headers);
console.log('Response Status:', res.status);
console.log('Response Body:', res.body);
```

### Performance Monitoring
```javascript
// Measure response time
const startTime = Date.now();
// ... request execution
const endTime = Date.now();
const responseTime = endTime - startTime;

console.log(`Response time: ${responseTime}ms`);
bru.assert.ok(responseTime < 1000, 'Response time should be less than 1 second');
```

---

## 📚 Additional Resources

- [Bruno Documentation](https://docs.usebruno.com/)
- [Bruno CLI Guide](https://docs.usebruno.com/bruno-cli/overview)
- [Collection Examples](https://github.com/usebruno/bruno/tree/main/examples)
- [API Testing Best Practices](https://docs.usebruno.com/api-testing/best-practices)

---

**Happy Testing with Bruno! 🚀**
