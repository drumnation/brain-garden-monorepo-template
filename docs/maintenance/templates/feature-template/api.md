<!--
Feature API Documentation Template v1.0

Instructions:
1. Copy this file when documenting a new feature's API
2. Replace all [PLACEHOLDER] text with actual content
3. Update YAML frontmatter with appropriate values
4. Fill in all sections completely for each endpoint
5. Provide working cURL examples
6. Include accurate request/response JSON schemas
7. Remove this instruction block when done

For reference implementation, see: /docs/features/authentication/api.md
-->

---
title: "[Feature Name] API Documentation"
description: "[Brief description of the API endpoints for this feature]"
keywords: [[feature-name], api, rest, [technology]]
last_updated: "YYYY-MM-DD"
---

# [Feature Name] API Documentation

## API Overview

<!-- Brief description of what this API provides -->

**Purpose:** [What this API enables users/clients to do]

**Base URL:** `[http://localhost:PORT/api/[feature] or production URL]`

**Version:** `v[X]`

**Authentication:** [Required/Optional - JWT/API Key/None]

**Content Type:** `application/json`

---

## Authentication

<!-- Describe how clients authenticate requests to this API -->

### Authentication Method

**Type:** [Bearer Token/JWT/API Key/Session Cookie/OAuth 2.0]

**Description:** [How authentication works for this feature]

### How to Authenticate

**Header Format:**
```
Authorization: Bearer <token>
```

**Obtaining Credentials:**
1. [Step 1 to obtain credentials]
2. [Step 2 if applicable]
3. [Step 3 if applicable]

**Token Expiration:** [Duration or policy]

**Refresh Strategy:** [How to refresh expired tokens]

### Authentication Errors

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 401 | `UNAUTHORIZED` | No authentication token provided |
| 401 | `INVALID_TOKEN` | Token is invalid or malformed |
| 401 | `EXPIRED_TOKEN` | Token has expired |
| 403 | `FORBIDDEN` | Insufficient permissions for this resource |

---

## Endpoints

### Endpoint 1: [Get Resource]

#### Overview
**Purpose:** [What this endpoint does - e.g., "Retrieves a list of resources"]

**Method:** `GET`

**Path:** `/api/[feature]/[resource]`

**Authentication:** [Required/Optional]

**Authorization:** [Any role requirements]

---

#### Request

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `[param]` | `[string/number]` | [Yes/No] | [Description] |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `[param1]` | `[string]` | [Yes/No] | `[value]` | [Description] |
| `[param2]` | `[number]` | [Yes/No] | `[value]` | [Description] |
| `[param3]` | `[boolean]` | [Yes/No] | `[value]` | [Description] |

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** None (GET request)

---

#### Response

**Success Response: 200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": "[string/number]",
      "field1": "[type]",
      "field2": "[type]",
      "field3": {
        "nestedField": "[type]"
      },
      "createdAt": "[ISO 8601 timestamp]",
      "updatedAt": "[ISO 8601 timestamp]"
    }
  ],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10
  }
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Indicates if request was successful |
| `data` | `array` | Array of resource objects |
| `data[].id` | `[type]` | [Description] |
| `data[].field1` | `[type]` | [Description] |
| `data[].field2` | `[type]` | [Description] |
| `meta.total` | `number` | Total number of resources |
| `meta.page` | `number` | Current page number |
| `meta.limit` | `number` | Items per page |

---

#### Status Codes

| Code | Description |
|------|-------------|
| `200 OK` | Request successful, data returned |
| `400 Bad Request` | Invalid query parameters or malformed request |
| `401 Unauthorized` | Authentication required or invalid token |
| `403 Forbidden` | Insufficient permissions |
| `404 Not Found` | Resource not found |
| `500 Internal Server Error` | Server encountered an error |

---

#### Error Response

**Format:**
```json
{
  "error": {
    "code": "[ERROR_CODE]",
    "message": "[Human-readable error message]",
    "details": "[Additional context if available]"
  }
}
```

**Example Error (400 Bad Request):**
```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Query parameter 'limit' must be between 1 and 100",
    "details": "Received: 150"
  }
}
```

---

#### Example Request

**cURL:**
```bash
curl -X GET "http://localhost:8080/api/[feature]/[resource]?param1=value&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**JavaScript (fetch):**
```javascript
const response = await fetch('http://localhost:8080/api/[feature]/[resource]?param1=value', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "field1": "example value",
      "field2": 42,
      "createdAt": "2025-01-14T12:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10
  }
}
```

---

#### Code References

**Implementation:**
- `apps/server/src/routes/[feature].routes.ts:line` - Route definition
- `apps/server/src/modules/[feature]/[feature].controller.ts:line` - Controller handler
- `apps/server/src/modules/[feature]/[feature].service.ts:line` - Business logic

**Types:**
- `apps/server/src/modules/[feature]/[feature].types.ts:line` - Request/response types

---

---

### Endpoint 2: [Create Resource]

#### Overview
**Purpose:** [What this endpoint does - e.g., "Creates a new resource"]

**Method:** `POST`

**Path:** `/api/[feature]/[resource]`

**Authentication:** [Required/Optional]

**Authorization:** [Any role requirements]

---

#### Request

**Path Parameters:** None

**Query Parameters:** None

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "field1": "[type - description]",
  "field2": "[type - description]",
  "field3": {
    "nestedField": "[type - description]"
  }
}
```

**Required Fields:**
- `field1` (string) - [Description and constraints]
- `field2` (number) - [Description and constraints]

**Optional Fields:**
- `field3` (object) - [Description and default behavior]

**Validation Rules:**
- `field1`: [Validation rules - e.g., min/max length, format]
- `field2`: [Validation rules - e.g., range, positive number]
- `field3.nestedField`: [Validation rules]

---

#### Response

**Success Response: 201 Created**

```json
{
  "success": true,
  "data": {
    "id": "[string/number]",
    "field1": "[value]",
    "field2": "[value]",
    "field3": {
      "nestedField": "[value]"
    },
    "createdAt": "[ISO 8601 timestamp]",
    "updatedAt": "[ISO 8601 timestamp]"
  },
  "message": "[Success message]"
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Indicates if request was successful |
| `data` | `object` | Created resource object |
| `data.id` | `[type]` | [Description - e.g., "Unique identifier"] |
| `data.field1` | `[type]` | [Description] |
| `data.createdAt` | `string` | Timestamp of creation (ISO 8601) |
| `message` | `string` | Success message |

---

#### Status Codes

| Code | Description |
|------|-------------|
| `201 Created` | Resource successfully created |
| `400 Bad Request` | Invalid request body or validation error |
| `401 Unauthorized` | Authentication required or invalid token |
| `403 Forbidden` | Insufficient permissions to create resource |
| `409 Conflict` | Resource already exists or constraint violation |
| `422 Unprocessable Entity` | Request validation failed |
| `500 Internal Server Error` | Server encountered an error |

---

#### Error Response

**Format:**
```json
{
  "error": {
    "code": "[ERROR_CODE]",
    "message": "[Human-readable error message]",
    "details": "[Additional context]",
    "validationErrors": [
      {
        "field": "[field name]",
        "message": "[validation error message]"
      }
    ]
  }
}
```

**Example Error (422 Validation Error):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "validationErrors": [
      {
        "field": "field1",
        "message": "field1 must be at least 3 characters long"
      },
      {
        "field": "field2",
        "message": "field2 must be a positive number"
      }
    ]
  }
}
```

---

#### Example Request

**cURL:**
```bash
curl -X POST "http://localhost:8080/api/[feature]/[resource]" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "field1": "example value",
    "field2": 42,
    "field3": {
      "nestedField": "nested value"
    }
  }'
```

**JavaScript (fetch):**
```javascript
const response = await fetch('http://localhost:8080/api/[feature]/[resource]', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    field1: 'example value',
    field2: 42,
    field3: {
      nestedField: 'nested value'
    }
  })
});
const data = await response.json();
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "field1": "example value",
    "field2": 42,
    "field3": {
      "nestedField": "nested value"
    },
    "createdAt": "2025-01-14T12:00:00.000Z",
    "updatedAt": "2025-01-14T12:00:00.000Z"
  },
  "message": "Resource created successfully"
}
```

---

#### Code References

**Implementation:**
- `apps/server/src/routes/[feature].routes.ts:line` - Route definition
- `apps/server/src/modules/[feature]/[feature].controller.ts:line` - Controller handler
- `apps/server/src/modules/[feature]/[feature].service.ts:line` - Business logic
- `apps/server/src/modules/[feature]/[feature].validation.ts:line` - Validation logic

**Types:**
- `apps/server/src/modules/[feature]/[feature].types.ts:line` - Request/response types

---

---

### Endpoint 3: [Update Resource]

#### Overview
**Purpose:** [What this endpoint does - e.g., "Updates an existing resource"]

**Method:** `PUT` or `PATCH`

**Path:** `/api/[feature]/[resource]/:id`

**Authentication:** [Required/Optional]

**Authorization:** [Any role requirements]

---

#### Request

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `[string/number]` | Yes | [Description - e.g., "Unique identifier of the resource"] |

**Query Parameters:** None

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "field1": "[type - optional for PATCH, required for PUT]",
  "field2": "[type - optional for PATCH, required for PUT]",
  "field3": {
    "nestedField": "[type]"
  }
}
```

**Fields:**
- For `PUT`: All fields required (full replacement)
- For `PATCH`: Only fields to update (partial update)

---

#### Response

**Success Response: 200 OK**

```json
{
  "success": true,
  "data": {
    "id": "[string/number]",
    "field1": "[updated value]",
    "field2": "[updated value]",
    "field3": {
      "nestedField": "[updated value]"
    },
    "createdAt": "[ISO 8601 timestamp]",
    "updatedAt": "[ISO 8601 timestamp]"
  },
  "message": "[Success message]"
}
```

---

#### Status Codes

| Code | Description |
|------|-------------|
| `200 OK` | Resource successfully updated |
| `400 Bad Request` | Invalid request body or validation error |
| `401 Unauthorized` | Authentication required or invalid token |
| `403 Forbidden` | Insufficient permissions to update resource |
| `404 Not Found` | Resource with specified ID not found |
| `409 Conflict` | Update would violate constraints |
| `422 Unprocessable Entity` | Request validation failed |
| `500 Internal Server Error` | Server encountered an error |

---

#### Example Request

**cURL:**
```bash
curl -X PUT "http://localhost:8080/api/[feature]/[resource]/123" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "field1": "updated value",
    "field2": 99
  }'
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "field1": "updated value",
    "field2": 99,
    "updatedAt": "2025-01-14T13:00:00.000Z"
  },
  "message": "Resource updated successfully"
}
```

---

#### Code References

**Implementation:**
- `apps/server/src/routes/[feature].routes.ts:line` - Route definition
- `apps/server/src/modules/[feature]/[feature].controller.ts:line` - Controller handler
- `apps/server/src/modules/[feature]/[feature].service.ts:line` - Business logic

---

---

### Endpoint 4: [Delete Resource]

#### Overview
**Purpose:** [What this endpoint does - e.g., "Deletes a resource"]

**Method:** `DELETE`

**Path:** `/api/[feature]/[resource]/:id`

**Authentication:** [Required/Optional]

**Authorization:** [Any role requirements]

---

#### Request

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `[string/number]` | Yes | [Description - e.g., "Unique identifier of the resource to delete"] |

**Query Parameters:** None

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** None

---

#### Response

**Success Response: 200 OK** or **204 No Content**

```json
{
  "success": true,
  "message": "[Success message - e.g., 'Resource deleted successfully']"
}
```

---

#### Status Codes

| Code | Description |
|------|-------------|
| `200 OK` | Resource successfully deleted (with response body) |
| `204 No Content` | Resource successfully deleted (no response body) |
| `400 Bad Request` | Invalid request parameters |
| `401 Unauthorized` | Authentication required or invalid token |
| `403 Forbidden` | Insufficient permissions to delete resource |
| `404 Not Found` | Resource with specified ID not found |
| `409 Conflict` | Resource cannot be deleted due to dependencies |
| `500 Internal Server Error` | Server encountered an error |

---

#### Example Request

**cURL:**
```bash
curl -X DELETE "http://localhost:8080/api/[feature]/[resource]/123" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**JavaScript (fetch):**
```javascript
const response = await fetch('http://localhost:8080/api/[feature]/[resource]/123', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**Response Example:**
```json
{
  "success": true,
  "message": "Resource deleted successfully"
}
```

---

#### Code References

**Implementation:**
- `apps/server/src/routes/[feature].routes.ts:line` - Route definition
- `apps/server/src/modules/[feature]/[feature].controller.ts:line` - Controller handler
- `apps/server/src/modules/[feature]/[feature].service.ts:line` - Business logic

---

---

<!-- Add more endpoints following the same pattern above -->

---

## Error Codes Reference

### Error Response Format

All error responses follow this consistent format:

```json
{
  "error": {
    "code": "[ERROR_CODE]",
    "message": "[Human-readable error message]",
    "details": "[Additional context if available]",
    "validationErrors": [
      {
        "field": "[field name]",
        "message": "[validation error message]"
      }
    ]
  }
}
```

### Common Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `UNAUTHORIZED` | 401 | No authentication token provided or invalid |
| `FORBIDDEN` | 403 | Insufficient permissions for this action |
| `NOT_FOUND` | 404 | Requested resource does not exist |
| `VALIDATION_ERROR` | 422 | Request failed validation |
| `CONFLICT` | 409 | Request conflicts with existing resource or constraint |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `BAD_REQUEST` | 400 | Malformed request or invalid parameters |
| `INVALID_PARAMETER` | 400 | Specific parameter validation failed |

### Feature-Specific Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `[CUSTOM_ERROR_1]` | [4xx/5xx] | [Description of feature-specific error] |
| `[CUSTOM_ERROR_2]` | [4xx/5xx] | [Description of feature-specific error] |
| `[CUSTOM_ERROR_3]` | [4xx/5xx] | [Description of feature-specific error] |

---

## Rate Limiting

<!-- If rate limiting is applicable -->

**Rate Limit:** [Number] requests per [time period]

**Rate Limit Headers:**
```
X-RateLimit-Limit: [limit]
X-RateLimit-Remaining: [remaining]
X-RateLimit-Reset: [timestamp]
```

**Rate Limit Exceeded Response:**

**Status:** `429 Too Many Requests`

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": "Rate limit: [limit] requests per [time period]"
  }
}
```

---

## Webhooks / Events

<!-- If this feature emits webhooks or events -->

### Event 1: [Event Name]

**Event Type:** `[feature].[event_name]`

**Triggered When:** [Description of when this event fires]

**Payload:**
```json
{
  "event": "[feature].[event_name]",
  "timestamp": "[ISO 8601 timestamp]",
  "data": {
    "field1": "[type]",
    "field2": "[type]"
  }
}
```

---

### Event 2: [Event Name]

**Event Type:** `[feature].[event_name]`

**Triggered When:** [Description of when this event fires]

**Payload:**
```json
{
  "event": "[feature].[event_name]",
  "timestamp": "[ISO 8601 timestamp]",
  "data": {
    "field1": "[type]",
    "field2": "[type]"
  }
}
```

---

## Data Models

### [ResourceName] Model

**Description:** [What this model represents]

```typescript
interface [ResourceName] {
  id: string | number;           // [Description]
  field1: string;                // [Description and constraints]
  field2: number;                // [Description and constraints]
  field3?: {                     // [Optional - description]
    nestedField: string;
  };
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
}
```

**Field Constraints:**
- `id`: [Type, uniqueness, generation method]
- `field1`: [Min/max length, format, allowed values]
- `field2`: [Range, validation rules]
- `field3`: [When present, validation rules]

**Code Reference:** `apps/server/src/modules/[feature]/[feature].types.ts:line`

---

## Testing the API

### Prerequisites

1. [Requirement 1 - e.g., "Have a valid authentication token"]
2. [Requirement 2 - e.g., "Server running on localhost:8080"]
3. [Requirement 3 - e.g., "Database seeded with test data"]

### Quick Test Script

```bash
#!/bin/bash

# Set variables
BASE_URL="http://localhost:8080/api/[feature]"
TOKEN="YOUR_TOKEN_HERE"

# Test GET endpoint
echo "Testing GET..."
curl -X GET "$BASE_URL/[resource]" \
  -H "Authorization: Bearer $TOKEN"

# Test POST endpoint
echo "Testing POST..."
curl -X POST "$BASE_URL/[resource]" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field1": "test value",
    "field2": 42
  }'
```

---

## Cross-References

### Related Documentation
- [Requirements](./requirements.md) - Feature requirements and user stories
- [Architecture](./architecture.md) - Technical design and implementation
- [Testing](./testing.md) - Test strategy and test cases
- [Feature README](./README.md) - Feature overview

### API Implementation
- `apps/server/src/routes/[feature].routes.ts` - Route definitions
- `apps/server/src/modules/[feature]/[feature].controller.ts` - Request handlers
- `apps/server/src/modules/[feature]/[feature].service.ts` - Business logic
- `apps/server/src/modules/[feature]/[feature].types.ts` - Type definitions

### Related Architecture Docs
- [Backend Architecture](/docs/architecture/backend.md) - Overall backend patterns
- [API Design Principles](/docs/architecture/api-design.md) - [If applicable]
- [Security Architecture](/docs/architecture/security.md) - Authentication/authorization

---

**Example Implementation:** See [/docs/features/authentication/api.md](/docs/features/authentication/api.md) for a complete reference implementation of this template.
