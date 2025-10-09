# @scheduling-api/tasks

Shared task domain logic and types for the scheduling station.

## Purpose

This package contains task-specific business logic, types, and utilities that can be shared across the scheduling API and potentially other applications in the monorepo.

## Architecture

- **Functional programming**: No classes, pure functions only
- **Type-safe**: Strict TypeScript with comprehensive type definitions
- **Isolated concerns**: Each file has a single responsibility
- **No build step**: Exports TypeScript source directly

## Usage

Import types and utilities from this package:

```typescript
import type { Task, TaskInput, TaskStatus, TaskPriority } from '@scheduling-api/tasks';

// Example: Using task types in your API
const task: Task = {
  id: '456',
  title: 'Review PR',
  status: 'in_progress',
  priority: 'high',
  createdAt: new Date(),
  updatedAt: new Date()
};
```

## Structure

```
src/
├── index.ts           # Public API exports
├── task.types.ts      # Task type definitions
├── task.service.ts    # Business logic (to be added)
└── task.validation.ts # Validation utilities (to be added)
```

## Development

### Type Definitions

All task-related types are defined in `task.types.ts`. This includes:

- `Task`: The main task entity
- `TaskInput`: Input for creating a new task
- `TaskUpdate`: Partial input for updating tasks
- `TaskStatus`: Status enum (todo, in_progress, completed, cancelled)
- `TaskPriority`: Priority enum (low, medium, high, urgent)

### Adding New Features

When adding new task features:

1. Add types to `task.types.ts`
2. Add business logic to `task.service.ts`
3. Add validation to `task.validation.ts`
4. Export public API from `index.ts`

Follow the functional isolated concerns pattern as defined in `.cursor/_backup/node.functional-isolated-concerns.rules.mdc`.

## Testing

Run tests:

```bash
pnpm test           # Run all tests
pnpm test:watch     # Run tests in watch mode
pnpm test:coverage  # Run with coverage
```

## References

- [Monorepo Structure Rules](/.cursor/_backup/monorepo-structure-and-configuration.rules.mdc)
- [Functional Programming Rules](/.cursor/_backup/node.functional-isolated-concerns.rules.mdc)
