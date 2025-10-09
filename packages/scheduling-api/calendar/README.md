# @scheduling-api/calendar

Shared calendar domain logic and types for the scheduling station.

## Purpose

This package contains calendar-specific business logic, types, and utilities that can be shared across the scheduling API and potentially other applications in the monorepo.

## Architecture

- **Functional programming**: No classes, pure functions only
- **Type-safe**: Strict TypeScript with comprehensive type definitions
- **Isolated concerns**: Each file has a single responsibility
- **No build step**: Exports TypeScript source directly

## Usage

Import types and utilities from this package:

```typescript
import type { CalendarEvent, CalendarEventInput } from '@scheduling-api/calendar';

// Example: Using calendar types in your API
const event: CalendarEvent = {
  id: '123',
  title: 'Team Meeting',
  startTime: new Date('2024-01-15T10:00:00'),
  endTime: new Date('2024-01-15T11:00:00'),
  createdAt: new Date(),
  updatedAt: new Date()
};
```

## Structure

```
src/
├── index.ts              # Public API exports
├── calendar.types.ts     # Calendar type definitions
├── calendar.service.ts   # Business logic (to be added)
└── calendar.validation.ts # Validation utilities (to be added)
```

## Development

### Type Definitions

All calendar-related types are defined in `calendar.types.ts`. This includes:

- `CalendarEvent`: The main calendar event entity
- `CalendarEventInput`: Input for creating a new event
- `CalendarEventUpdate`: Partial input for updating events

### Adding New Features

When adding new calendar features:

1. Add types to `calendar.types.ts`
2. Add business logic to `calendar.service.ts`
3. Add validation to `calendar.validation.ts`
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
