---
title: "API Documentation - Dual Swagger System"
description: "Guide to using Proxy and CM Swagger documentation for API exploration and testing"
keywords:
  - api-documentation
  - swagger
  - openapi
  - proxy
  - content-manager
  - developer-tools
last_updated: "2025-10-22"
---

# API Documentation - Dual Swagger System

The Content Manager Express platform uses **TWO** distinct Swagger/OpenAPI documentation systems to document different layers of the API architecture. This dual swagger approach provides comprehensive API documentation for both the proxy layer (what the frontend calls) and the Content Manager layer (what the proxy calls).

## Why Two Swagger Systems?

The architectural rationale for maintaining two separate swagger systems:

- **Proxy Swagger**: Documents the proxy server API endpoints that the frontend application calls. This is the "public" API surface for the Portals application.
- **CM Swagger**: Documents the original Content Manager (CM) API that the proxy server calls. This is the "legacy" API that the proxy mediates.

### Separation Benefits

- **Different Audiences**: Frontend developers focus on Proxy Swagger, while integration developers need CM Swagger
- **Independent Evolution**: Proxy API can change without CM API changes, enabling gradual modernization
- **Testing Isolation**: Test each layer independently to identify issues at the right level
- **Clear Architectural Boundaries**: Explicit separation between modern proxy layer and legacy CM layer

## Swagger System Comparison

| Aspect | Proxy Swagger | CM Swagger |
|--------|---------------|------------|
| **Purpose** | Documents proxy endpoints for frontend | Documents original CM API |
| **Location** | `apps/server/src/swagger/openapi.yaml` | `services/cm-swagger/docs/index.yaml` |
| **Access URL** | `http://localhost:${PORT}/api-docs` (default 3000) | `http://localhost:3009/api-docs` |
| **Enable Flag** | `ENABLE_SWAGGER=true` in .env | Always enabled (separate service) |
| **Audience** | Frontend developers, API consumers | Integration developers, proxy developers |
| **Coverage** | Auth, Users, Roles, Workgroups, Current User | Content, Fleet, Admin, Auth, Media |
| **Dynamic Examples** | Yes (via updateSwaggerExamples) | No (static examples) |
| **Hot Reload** | No (requires server restart) | Yes (via WebSocket) |
| **Setup** | Integrated in main server | Separate Node.js service |

**Port Configuration:**
- **API Server (Proxy Swagger)**: Uses `PORT` environment variable from `.env` (defaults to 3000)
- **CM Swagger Service**: Runs on port 3009 (fixed)

## Proxy Swagger

### Purpose

Documents the proxy server API that the frontend application calls.

### Location

`apps/server/src/swagger/openapi.yaml`

### Access

1. **Enable in environment**: Set `ENABLE_SWAGGER=true` in `.env` file
2. **Start server**: `pnpm dev` or `pnpm --filter @scala-cme/server dev`
3. **Open browser**: Navigate to `http://localhost:${PORT}/api-docs` (default port 3000, configured via `PORT` in `.env`)

### Setup Code

Reference: `apps/server/src/swagger/index.ts:14-33` - setupSwagger function

### Key Features

- **Dynamic example generation** via `updateSwaggerExamples()` function
- **Realistic examples** using actual role/workgroup IDs from running server
- **Integrated with main Express server**
- Requires server restart to see spec changes

### API Coverage

- **Authentication**: Login, session retrieval
- **Users**: List, create, get, update, delete, reactivate
- **Current User**: Get current user, update profile, change password
- **Roles**: List, create, get, update, delete, get resources
- **Workgroups**: List, create, get, update, delete

### When to Use Proxy Swagger

- Building frontend features that call the API
- Understanding request/response formats for proxy endpoints
- Testing proxy endpoints with authentication
- Debugging frontend API integration issues
- Generating TypeScript types from OpenAPI spec

### Example Usage

Step-by-step example of testing a proxy endpoint:

1. Navigate to `/api-docs`
2. Expand "Users" section
3. Click "POST /users" endpoint
4. Click "Try it out"
5. Fill in request body with user data:
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "username": "testuser",
     "roleIds": ["role-id-here"],
     "workgroupIds": ["workgroup-id-here"]
   }
   ```
6. Click "Execute"
7. View response with created user

## CM Swagger

### Purpose

Documents the original Content Manager API that the proxy server calls.

### Location

`services/cm-swagger/docs/index.yaml` (modular structure with paths/, components/, auth/ subdirectories)

### Access

1. **Start CM Swagger service**: `pnpm start:cm-swagger` (or alternatively: `cd services/cm-swagger && pnpm start`)
2. **Open browser**: Navigate to `http://localhost:3009/api-docs`

**Note:** CM Swagger runs on port 3009 by default. Some older documentation may reference port 7000, which is no longer accurate.

### Setup Code

Reference: `services/cm-swagger/server/app.js:76-92` - Swagger UI configuration

### Key Features

- **Hot-reload via WebSocket** (spec changes auto-refresh browser)
- **Modular YAML structure** (paths/, components/, schemas/ organized by domain)
- **Separate service** (runs independently from main server)
- **Mock endpoints** for testing without CM server
- **CORS enabled** for cross-origin testing

### API Coverage

- **Content Management**: Content CRUD, versioning, publishing, search, media assets
- **Fleet Management**: Vehicles, drivers, routes, tracking
- **Administration**: Users, roles, permissions, workgroups, system config
- **Authentication**: Login, logout, tokens, sessions, API keys
- **Activities**: Activity endpoints (documented separately due to size)

### Modular Documentation Structure

```
docs/
├── index.yaml              # Main OpenAPI spec
├── paths/                  # Endpoint definitions
│   ├── content/
│   ├── fleet/
│   ├── admin/
│   ├── auth/
│   └── activity/
├── components/
│   ├── schemas/            # Data models
│   ├── parameters/         # Reusable parameters
│   ├── responses/          # Reusable responses
│   └── securitySchemes/    # Auth schemes
```

### When to Use CM Swagger

- Understanding the original CM API structure
- Developing proxy middleware or transformations
- Debugging proxy-to-CM communication issues
- Planning new proxy endpoints based on CM capabilities
- Understanding CM authentication requirements
- Exploring CM API features not yet proxied

### Example Usage

Step-by-step example of exploring CM API:

1. Start CM Swagger service: `pnpm start:cm-swagger`
2. Navigate to `/api-docs`
3. Explore "Fleet Management" section
4. Review vehicle management endpoints
5. Understand CM API request/response formats
6. Plan proxy endpoint to expose this functionality

## Quick Start Guide

### For Frontend Developers

1. Use **Proxy Swagger** as your primary reference
2. Enable with `ENABLE_SWAGGER=true`
3. Access at `http://localhost:${PORT}/api-docs` (default 3000)
4. Test endpoints with your auth token

### For Backend/Integration Developers

1. Use **both** swagger systems
2. Start with **Proxy Swagger** to understand frontend API
3. Use **CM Swagger** to understand underlying CM API
4. Compare both to understand proxy transformations

### For Proxy Developers

1. **CM Swagger** is your source of truth for CM API
2. **Proxy Swagger** is what you're building
3. Use CM Swagger to understand available CM endpoints
4. Update Proxy Swagger when adding new proxy endpoints

## Common Workflows

### Workflow 1: Testing a Proxy Endpoint

1. Enable Proxy Swagger in `.env`: `ENABLE_SWAGGER=true`
2. Start server: `pnpm dev`
3. Navigate to `http://localhost:${PORT}/api-docs` (default 3000)
4. Click "Authorize" and enter your authentication credentials
   - The dialog expects apiKey headers: `token` (user auth) or `cm-api-key` (system auth)
5. Expand endpoint section (e.g., "Users")
6. Click "Try it out" on desired endpoint
7. Fill in request parameters/body
8. Click "Execute"
9. Review response

### Workflow 2: Understanding Proxy Transformations

1. Start both swagger systems (see Commands Reference below)
2. Open Proxy Swagger: `http://localhost:${PORT}/api-docs` (default 3000)
3. Open CM Swagger: `http://localhost:3009/api-docs`
4. Find corresponding endpoints in both systems
5. Compare request/response schemas
6. Identify transformations and data augmentation
7. Document differences for maintenance

### Workflow 3: Adding a New Proxy Endpoint

1. Review CM Swagger to understand source endpoint
2. Identify required CM API calls and data transformations
3. Implement proxy middleware/route
4. Update `apps/server/src/swagger/openapi.yaml` spec
5. Restart server to load updated spec
6. Test via Swagger UI
7. Verify transformations match requirements

## Troubleshooting

### Proxy Swagger Not Loading

- **Check environment**: Verify `ENABLE_SWAGGER=true` in `.env`
- **Verify server port**: Ensure server is running on correct PORT (default 3000, configured in `.env`)
- **Check spec file**: Confirm `apps/server/src/swagger/openapi.yaml` exists
- **Review logs**: Check server logs for swagger setup errors

### CM Swagger Not Loading

- **Verify service running**: `pnpm start:cm-swagger`
- **Check port availability**: Ensure port 3009 is not in use
- **Verify spec file**: Confirm `services/cm-swagger/docs/index.yaml` exists
- **Check service logs**: Review logs for YAML parsing errors

### Authentication Issues

- **Proxy Swagger**: Use "Authorize" button with header-based apiKey authentication
  - `token` header: User authentication token
  - `cm-api-key` header: System authentication key
  - Defined in `apps/server/src/swagger/openapi.yaml` under `components.securitySchemes`
- **CM Swagger**: Use "Authorize" button with system API key (**no "Bearer" prefix**)
- **Token format**: See `cm-proxy-rules.mdc` for CM API token format requirements

### Spec Changes Not Appearing

- **Proxy Swagger**: Requires server restart to reload spec changes
- **CM Swagger**: Should auto-reload via WebSocket; check browser console for errors
- **Hard refresh**: Try Ctrl+Shift+R (or Cmd+Shift+R on Mac) to clear browser cache

## Best Practices

### For API Documentation

- **Always update Proxy Swagger** when adding new proxy endpoints
- **Keep examples realistic** using `updateSwaggerExamples()` pattern
- **Document all schemas** completely with descriptions and constraints
- **Include error responses** and status codes for all endpoints
- **Add authentication requirements** clearly in endpoint documentation

### For API Testing

- **Use Swagger UI** for quick endpoint testing during development
- **Test authentication flows** with real tokens
- **Verify request/response formats** match spec
- **Use Swagger UI** to generate curl commands for automation
- **Test error cases** not just happy paths

### For API Exploration

- **Start with Proxy Swagger** to understand frontend API surface
- **Use CM Swagger** to understand available CM capabilities
- **Compare both systems** to understand proxy transformations and data augmentation
- **Document findings** when discovering new CM API features

## Commands Reference

### Proxy Swagger

```bash
# Enable in .env
echo "ENABLE_SWAGGER=true" >> .env

# Start server
pnpm dev

# Access (PORT defaults to 3000)
open http://localhost:${PORT}/api-docs
```

### CM Swagger

```bash
# Start CM Swagger service (recommended)
pnpm start:cm-swagger

# Or from service directory (alternative)
cd services/cm-swagger && pnpm start

# Access
open http://localhost:3009/api-docs
```

### Both Swagger Systems

```bash
# Terminal 1: Start main server with Proxy Swagger
ENABLE_SWAGGER=true pnpm dev

# Terminal 2: Start CM Swagger service
pnpm start:cm-swagger
```

## For AI Agents

### Understanding API Shape

Always consult both swagger systems before implementing API features:
- **Proxy Swagger** shows what frontend expects
- **CM Swagger** shows what's available from CM
- Compare both to understand transformations needed

### Adding Proxy Endpoints

1. Review **CM Swagger** first to understand source endpoint
2. Identify required data transformations
3. Implement proxy route
4. Update **Proxy Swagger** spec
5. Test via Swagger UI

### Debugging API Issues

Check both swagger systems to identify where the issue occurs:
- **Proxy layer**: Compare actual vs documented behavior in Proxy Swagger
- **CM layer**: Verify CM API responses match CM Swagger documentation
- **Transformation layer**: Compare data between CM and Proxy formats

### Token Format

**Critical**: CM API uses raw token (no "Bearer" prefix)
- See `cm-proxy-rules.mdc` for detailed requirements
- Proxy Swagger uses header-based apiKey authentication (`token` or `cm-api-key` headers)
- CM Swagger requires raw token in apiToken header

## Related Documentation

- [Proxy Feature Documentation](/docs/features/proxy/) (if exists)
- [Backend Architecture](/docs/architecture/backend.md)
- [CM Service README](/services/cm/README.md)
- [CM Swagger README](/services/cm-swagger/README.md)
- [Proxy Swagger README](/apps/server/src/swagger/README.md)
- [Project-Wide Proxy Rules](/.cursor/rules/project-wide-proxy-rules.rules.mdc)
