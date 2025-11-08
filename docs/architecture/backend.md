---
title: "Backend Architecture"
description: "Express.js API server architecture with hexagonal pattern"
keywords: [backend, architecture, express, api, hexagonal]
last_updated: "2025-11-08"
status: "ACTIVE DOCUMENTATION"
---

# Backend Architecture

## 1. Overview

The Dev Garden backend provides RESTful API services for the project management system. Built on Express.js v5, it implements a hexagonal architecture pattern with clear separation between core business logic and adapters.

**Key Characteristics:**
- **Express.js 5.0** - Modern async middleware support
- **Hexagonal Architecture** - Core business logic isolated from delivery mechanisms
- **TypeScript ESM** - ES Modules only, no CommonJS
- **Functional DI Pattern** - Dependency injection without classes
- **Monorepo Integration** - Shares types and utilities with other apps

## 2. Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Runtime** | Node.js 20+ | JavaScript runtime |
| **Framework** | Express 5.0.1 | HTTP server and routing |
| **Language** | TypeScript 5.7 | Type safety and modern JS features |
| **Validation** | Zod 3.24 | Runtime validation and type inference |
| **Logging** | Pino 9.6 | Structured JSON logging |
| **CORS** | cors 2.8 | Cross-origin resource sharing |
| **Environment** | @kit/env-loader | Environment variable management |
| **Testing** | Vitest | Unit and integration testing |

## 3. Server Architecture

### Entry Point

**File:** `apps/api/src/main.ts`

The server bootstrap process follows this sequence:
1. Load environment variables via `@kit/env-loader`
2. Validate required environment variables
3. Create Express server with middleware stack
4. Configure routes
5. Start server on configured port

```typescript
// Bootstrap sequence
async function bootstrap() {
  // 1. Load and validate environment
  const env = loadEnvironment({
    appName: 'api',
    required: ['PORT'],
  });

  // 2. Create server with middleware
  const server = createServer();

  // 3. Start listening
  const PORT = process.env.PORT || 3000;
  server.listen(PORT);
}
```

### Configuration

Environment variables are loaded hierarchically:
- Global: `/Users/dmieloch/Dev/.env`
- App-specific: `/Users/dmieloch/Dev/apps/api/.env`
- System environment variables (highest priority)

**Key Configuration:**
```bash
PORT=3000                    # Server port
NODE_ENV=development         # Environment mode
LOG_LEVEL=info              # Logging verbosity
CORS_ORIGIN=http://localhost:5173  # Allowed origins
```

## 4. Directory Structure

```
apps/api/src/
├── infra/                  # Infrastructure layer
│   └── http/              # HTTP-specific code
│       ├── server.ts      # Express server setup
│       └── routes.ts      # Route registration
├── modules/               # Feature modules
│   └── user/             # User module example
│       ├── user.controller.ts  # HTTP controller
│       ├── user.service.ts     # Business logic
│       ├── user.repo.ts        # Data access
│       ├── user.types.ts       # TypeScript types
│       └── index.ts            # Module exports
├── shared/               # Shared utilities
│   ├── errors/          # Error handling
│   │   └── handler.ts
│   └── logging/         # Logging configuration
│       └── logger.ts
└── main.ts              # Application entry point
```

## 5. Hexagonal Architecture Pattern

### Core Principles

The backend follows hexagonal architecture (Ports & Adapters):

1. **Core Domain** (`modules/*/service.ts`)
   - Pure business logic
   - No framework dependencies
   - Platform-agnostic

2. **Adapters** (`modules/*/controller.ts`)
   - Translate HTTP requests to service calls
   - Handle HTTP-specific concerns
   - Error response formatting

3. **Repositories** (`modules/*/repo.ts`)
   - Data access abstraction
   - Database queries
   - External API calls

### Module Structure Example

```typescript
// user.service.ts - Core business logic
export const makeUserService = (deps: {
  userRepo: ReturnType<typeof makeUserRepo>;
}) => ({
  getAllUsers: async () => {
    return deps.userRepo.findAll();
  },

  getUserById: async (id: string) => {
    const user = await deps.userRepo.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }
});

// user.controller.ts - HTTP adapter
export const makeUserController = (deps: {
  userService: ReturnType<typeof makeUserService>;
}) => ({
  getUsers: async (req: Request, res: Response) => {
    const users = await deps.userService.getAllUsers();
    res.json(users);
  },

  getUser: async (req: Request, res: Response) => {
    const user = await deps.userService.getUserById(req.params.id);
    res.json(user);
  }
});
```

## 6. Route Structure

### API Routes

**Base Path:** `/api`

Routes are organized by feature modules:

```typescript
// infra/http/routes.ts
export function configureRoutes(app: Express) {
  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // User routes
  app.get('/api/users', userController.getUsers);
  app.get('/api/users/:id', userController.getUser);
  app.post('/api/users', userController.createUser);
  app.put('/api/users/:id', userController.updateUser);
  app.delete('/api/users/:id', userController.deleteUser);

  // Additional feature routes...
}
```

## 7. Middleware Architecture

Middleware stack (order matters):

1. **CORS**
   - Purpose: Enable cross-origin requests
   - Configuration: Allows configured origins

2. **Body Parser**
   - Purpose: Parse JSON request bodies
   - Limit: 10mb by default

3. **Request Logger**
   - Purpose: Log incoming requests
   - Uses Pino for structured logging

4. **Error Handler** (last)
   - Purpose: Catch and format errors
   - Returns consistent error responses

```typescript
// infra/http/server.ts
export function createServer() {
  const app = express();

  // Middleware stack
  app.use(cors({ origin: process.env.CORS_ORIGIN }));
  app.use(express.json({ limit: '10mb' }));
  app.use(requestLogger);

  // Routes
  configureRoutes(app);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
```

## 8. Error Handling

### Error Types

```typescript
// shared/errors/types.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}
```

### Global Error Handler

```typescript
// shared/errors/handler.ts
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      status: err.statusCode
    });
  }

  // Unhandled errors
  logger.error('Unhandled error:', err);
  return res.status(500).json({
    error: 'Internal server error',
    status: 500
  });
};
```

## 9. Testing Strategy

### Test Types

1. **Unit Tests** - Service logic testing
2. **Integration Tests** - API endpoint testing
3. **Repository Tests** - Data access testing

### Test Configuration

Tests use Vitest with the monorepo's shared testing configuration:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## 10. Deployment & Runtime

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server with hot reload
pnpm --filter @dev-garden/api dev

# Run tests
pnpm --filter @dev-garden/api test
```

### Production Build

```bash
# Build TypeScript
pnpm --filter @dev-garden/api build

# Start production server
pnpm --filter @dev-garden/api start
```

### Docker Support (Planned)

Dockerfile and docker-compose configuration pending implementation.

## 11. Future Enhancements

### Planned Features

1. **Database Integration**
   - SQLite for local development
   - PostgreSQL for production
   - Prisma ORM integration

2. **Authentication**
   - JWT-based auth
   - Session management
   - Role-based access control

3. **PM Agent Features**
   - Project scanning endpoints
   - Quality metrics calculation
   - Motivation verdict generation

4. **WebSocket Support**
   - Real-time updates
   - Live project monitoring

## Related Documentation

- [System Overview](./system-overview.md) - High-level architecture
- [Database Architecture](./database.md) - Data layer documentation
- [Frontend Architecture](./frontend.md) - Client applications
- [Monorepo Structure](../guides/monorepo-structure.md) - Project organization

---

**Last Updated:** 2025-11-08
**Status:** Active Documentation