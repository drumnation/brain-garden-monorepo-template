# Scheduling API

Backend API for the scheduling station calendar and task editing system.

## Architecture

This application follows the Express.js architecture pattern with functional dependency injection, as defined in `.cursor/_backup/monorepo-node-express-architecture.rules.mdc`.

### Key Principles

- **ESM-only**: Uses ES modules (`type: "module"`)
- **Functional DI**: Dependencies passed as function parameters (no classes)
- **Modular structure**: Features organized in `/src/modules`
- **Infrastructure separation**: HTTP, database, and other infrastructure concerns in `/src/infra`
- **Type safety**: Strict TypeScript configuration

## Project Structure

```
src/
├── main.ts                    # Application entry point
├── infra/                     # Infrastructure layer
│   └── http/                  # HTTP server setup
│       ├── server.ts          # Express app factory
│       ├── routes.ts          # Route aggregator
│       └── middleware/        # Shared middleware
├── modules/                   # Feature modules (bounded contexts)
│   ├── calendar/             # Calendar feature
│   └── tasks/                # Tasks feature
└── shared/                    # App-specific shared code
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+

### Installation

From the monorepo root:

```bash
pnpm install
```

### Environment Setup

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Required environment variables:
- `PORT`: Server port (default: 8080)
- `NODE_ENV`: Environment (development/production)
- `LOG_LEVEL`: Logging level (debug/info/warn/error)

### Development

Start the development server with hot-reloading:

```bash
pnpm dev
```

### Build

Build for production:

```bash
pnpm build
```

### Testing

Run tests:

```bash
pnpm test           # Run all tests once
pnpm test:watch     # Run tests in watch mode
pnpm test:coverage  # Run tests with coverage
```

## API Endpoints

### Health Check

```
GET /health
```

Returns server health status.

### API v1

```
GET /api/v1/
```

Base API endpoint. Feature-specific endpoints will be documented as they are added.

## Development Workflow

### Adding a New Feature

1. Create a new module in `/src/modules/<feature-name>`
2. Follow the `<feature>.<role>.ts` naming pattern:
   - `<feature>.types.ts` - Type definitions
   - `<feature>.controller.ts` - HTTP handlers
   - `<feature>.service.ts` - Business logic
   - `<feature>.repository.ts` - Data access
   - `<feature>.routes.ts` - Route definitions
3. Register routes in `/src/infra/http/routes.ts`
4. Add corresponding types/logic to shared packages in `/packages/scheduling-api/*`

### Using Shared Packages

Import from shared domain packages:

```typescript
import type { CalendarEvent } from '@scheduling-api/calendar';
import type { Task } from '@scheduling-api/tasks';
```

### Using Tooling Packages

Import from shared tooling:

```typescript
import { createLogger } from '@kit/logger';
import { loadEnvironment } from '@kit/env-loader/node';
```

## References

- [Monorepo Structure Rules](/.cursor/_backup/monorepo-structure-and-configuration.rules.mdc)
- [Express Architecture Rules](/.cursor/_backup/monorepo-node-express-architecture.rules.mdc)
- [Functional Programming Rules](/.cursor/_backup/node.functional-isolated-concerns.rules.mdc)
