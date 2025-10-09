# Scheduling Station

A modern calendar and task editing system built with a functional monorepo architecture.

## Project Overview

Scheduling Station is a backend API system for managing calendar events and tasks. The project follows a strict ESM-only, functional programming approach with shared tooling and no-build libraries.

## Monorepo Structure

```
scheduling-station/
├── apps/                      # Executable applications
│   └── scheduling-api/       # Backend Express API server
├── packages/                  # Shared libraries (no build step)
│   └── scheduling-api/       # Domain-specific packages
│       ├── calendar/         # Calendar domain logic & types
│       └── tasks/            # Tasks domain logic & types
├── tooling/                   # Shared tooling packages
│   └── @kit/*               # Development tools (brain-monitor, logger, etc.)
├── _errors/                   # Brain Monitor error reports (gitignored)
├── _logs/                     # Application logs (gitignored)
└── .cursor/                   # Project rules and configuration
```

## Getting Started

### Prerequisites

- **Node.js**: 22+ (uses native ESM)
- **pnpm**: 9+ (package manager)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

### Environment Setup

1. Copy the root environment example:

```bash
cp .env.example .env
```

2. Copy app-specific environment files:

```bash
cp apps/scheduling-api/.env.example apps/scheduling-api/.env
```

3. Configure your environment variables in the `.env` files

### Running the Development Server

Start the API server with hot-reloading:

```bash
pnpm dev
```

The API will be available at `http://localhost:8080` (or your configured PORT).

## Architecture

### Key Principles

1. **ESM-only**: All packages use `"type": "module"` - no CommonJS
2. **No build step for libraries**: Packages in `/packages` export TypeScript source directly
3. **Functional programming**: No classes, pure functions with dependency injection
4. **Strict typing**: TypeScript with `strict: true` and `noUncheckedIndexedAccess`
5. **Monorepo**: pnpm workspaces + Turborepo for task orchestration

### Technology Stack

- **Runtime**: Node.js 22+ (ESM)
- **Package Manager**: pnpm 9+
- **Build Orchestrator**: Turborepo
- **Backend Framework**: Express.js (functional DI pattern)
- **Type System**: TypeScript 5.7+
- **Testing**: Vitest
- **Validation**: Zod
- **Logging**: Custom `@kit/logger` (structured logging)

## Development Workflow

### Adding a New Feature

1. **Define types** in the appropriate shared package (`@scheduling-api/calendar` or `@scheduling-api/tasks`)
2. **Implement business logic** in the package's service layer
3. **Create API endpoints** in `apps/scheduling-api/src/modules/<feature>/`
4. **Register routes** in `apps/scheduling-api/src/infra/http/routes.ts`
5. **Write tests** using Vitest

### Package Naming Conventions

- **Apps**: `@[app-name]` (e.g., `@scheduling-api`)
- **Packages**: `@[app-name]/[package-name]` (e.g., `@scheduling-api/calendar`)
- **Tooling**: `@kit/[tool-name]` (e.g., `@kit/logger`)

### Importing from Packages

```typescript
// Shared domain packages
import type { CalendarEvent } from '@scheduling-api/calendar';
import type { Task } from '@scheduling-api/tasks';

// Tooling packages
import { createLogger } from '@kit/logger';
import { loadEnvironment } from '@kit/env-loader/node';
```

## Available Scripts

### Root Level

```bash
pnpm dev              # Start all apps in development mode
pnpm build            # Build all apps
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:unit        # Run unit tests only
pnpm test:integration # Run integration tests
pnpm test:e2e         # Run end-to-end tests
pnpm lint             # Lint all packages
pnpm typecheck        # Type-check all packages
pnpm format           # Format code with Prettier
pnpm validate         # Run lint + typecheck + test
pnpm clean            # Remove all node_modules and build artifacts
```

### App Level (in apps/scheduling-api/)

```bash
pnpm dev              # Start dev server with hot-reload
pnpm build            # Build for production
pnpm start            # Start production server
pnpm test             # Run tests
pnpm test:coverage    # Run tests with coverage
```

## Agent Coordination with Brain Monitor

This project uses `@kit/brain-monitor` for real-time validation feedback and agent coordination:

```bash
pnpm monitor:dev      # Start development server with monitoring
pnpm monitor:errors   # Check validation errors before running tasks
pnpm monitor:logs     # View application logs
```

**Agents should**:
1. Check `_errors/` directory before running validation tasks
2. Check `_logs/` directory before restarting servers
3. Use `@kit/brain-monitor` CLI for validation insights

## Testing Strategy

- **Unit tests**: Test pure functions in isolation (packages)
- **Integration tests**: Test module interactions (API routes + services)
- **E2E tests**: Test complete user flows (API endpoints)

All tests use Vitest with parallel execution and watch mode support.

## Project Rules & Documentation

Core architectural rules are documented in `.cursor/_backup/`:

- [Monorepo Structure](/.cursor/_backup/monorepo-structure-and-configuration.rules.mdc)
- [Express Architecture](/.cursor/_backup/monorepo-node-express-architecture.rules.mdc)
- [Functional Programming](/.cursor/_backup/node.functional-isolated-concerns.rules.mdc)

## API Documentation

### Health Check

```
GET /health
```

Returns server health status.

### API v1 Base

```
GET /api/v1/
```

Base API endpoint. Feature-specific endpoints:

- `/api/v1/calendar` - Calendar operations (to be implemented)
- `/api/v1/tasks` - Task operations (to be implemented)

Detailed API documentation will be added as features are implemented.

## Contributing

When contributing:

1. Follow the functional programming patterns (no classes)
2. Maintain strict TypeScript typing
3. Write tests for all new features
4. Update documentation
5. Run `pnpm validate` before committing

## License

Private project - all rights reserved.
