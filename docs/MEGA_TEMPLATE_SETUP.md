---
title: "Mega Template Setup Guide"
description: "Comprehensive guide to the monorepo mega starter template"
keywords: [monorepo, template, starter, full-stack, testing, validation]
last_updated: "2025-10-22"
---

# Monorepo Mega Template Setup Guide

## Overview

This is a **production-ready monorepo mega starter template** that provides a complete foundation for building modern full-stack applications. It includes showcase applications for every major platform, comprehensive testing infrastructure, automated validation, and complete tooling integration.

### What Makes This a "Mega" Template?

1. **All App Types Included**
   - React web app (Vite + Mantine UI)
   - React Native mobile app (Expo + Expo Router)
   - Electron desktop app (cross-platform)
   - Express API backend (functional DI pattern)

2. **Shared Package System**
   - `shared-utils` - Common utility functions
   - `shared-ui` - Shared React components
   - No-build library pattern (export TS source directly)

3. **Comprehensive Testing**
   - Three-tier approach: Unit → Integration → E2E
   - Centralized configuration via `@kit/testing`
   - No per-package vitest configs
   - Sample tests for every app type

4. **Automated Validation**
   - Brain Monitor coordination system
   - Real-time error reporting
   - Multi-agent collaboration support
   - CI/CD integration

5. **Complete Tooling**
   - Turborepo task orchestration
   - ESLint + Prettier (centralized configs)
   - TypeScript strict mode
   - pnpm workspaces
   - GitHub Actions workflows

## Generated Applications

### Web App (`apps/web`)
- **Stack:** React 18, Vite, TypeScript
- **UI:** Mantine UI components
- **State:** Zustand (lightweight)
- **Router:** React Router
- **Styling:** Tailwind CSS
- **Port:** 3000

**Purpose:** Showcase modern React SPA development with fast HMR and production builds.

### Mobile App (`apps/mobile`)
- **Stack:** React Native, Expo, TypeScript
- **Router:** Expo Router
- **UI:** React Native Paper
- **State:** Zustand
- **Platforms:** iOS, Android, Web

**Purpose:** Demonstrate cross-platform mobile development with Expo's developer experience.

### Desktop App (`apps/desktop`)
- **Stack:** Electron, React, TypeScript
- **UI:** Mantine UI
- **State:** Zustand
- **IPC:** Main ↔ Renderer communication
- **Auto-Update:** Enabled
- **Platforms:** macOS, Windows, Linux

**Purpose:** Show desktop application development with native capabilities and auto-updates.

### API (`apps/api`)
- **Stack:** Express.js, TypeScript, Node.js
- **Database:** Prisma (PostgreSQL)
- **Validation:** Zod schemas
- **Auth:** JWT strategy
- **Logging:** Structured logging with `@kit/logger` (all packages must use this)
- **Environment:** `@kit/env-loader` (consolidates all env vars to root `.env`)
- **Port:** 8080

**Purpose:** Comprehensive Express backend showcasing functional architecture with DI pattern, domain modules, Prisma integration, JWT authentication, and Zod validation. This is the primary backend reference implementation demonstrating all architectural patterns.

## Shared Packages

### `packages/shared-utils`
Common utility functions shared across all apps:
- Date formatting (`formatDate`, `parseDate`, `addDays`, `isWeekend`)
- String manipulation
- Validation helpers
- Pure functions (no side effects)

**Usage:**
```typescript
import { formatDate, addDays } from '@starter/shared-utils';

const today = new Date();
const nextWeek = addDays(today, 7);
console.log(formatDate(nextWeek, 'yyyy-MM-dd'));
```

### `packages/shared-ui`
Reusable React components following atomic design principles:
- Button (variants, sizes, states)
- Input fields
- Cards
- Atomic design structure

**Usage:**
```tsx
import { Button } from '@starter/shared-ui';

<Button variant="primary" size="large" onClick={handleClick}>
  Click Me
</Button>
```

## Testing Strategy

### Three-Tier Approach

#### 1. Unit Tests (`.unit.test.ts`)
- **Purpose:** Test pure functions in isolation
- **Location:** Co-located with source files
- **Environment:** jsdom (browser) or node
- **Speed:** Fast (<100ms per test)
- **Coverage:** 85% threshold

**Example:**
```typescript
// src/utils/date.ts
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// src/utils/date.unit.test.ts
import { expect, it, describe } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
  it('formats date as YYYY-MM-DD', () => {
    const date = new Date('2025-10-22T12:00:00Z');
    expect(formatDate(date)).toBe('2025-10-22');
  });
});
```

#### 2. Integration Tests (`.integration.test.ts`)
- **Purpose:** Test multiple modules working together
- **Location:** `testing/integration/`
- **Environment:** node
- **Dependencies:** Real services, test databases
- **Speed:** Medium (100ms-1s per test)

**Example:**
```typescript
// testing/integration/user-service.integration.test.ts
import { describe, it, expect } from 'vitest';
import { createUserService } from '../src/services/user';
import { createTestDatabase } from './helpers/db';

describe('User Service Integration', () => {
  const db = createTestDatabase();
  const userService = createUserService({ db });

  it('creates and retrieves user', async () => {
    const user = await userService.create({ name: 'Alice' });
    const retrieved = await userService.findById(user.id);
    expect(retrieved).toEqual(user);
  });
});
```

#### 3. E2E Tests
**Backend E2E** (`.backend.e2e.test.ts`):
- Full API workflows via HTTP
- Uses supertest for requests
- Runs against real Express server

**Browser E2E** (`.browser.e2e.ts`):
- Complete user workflows in real browser
- Uses Playwright
- Tests UI interactions end-to-end

### Centralized Configuration

**No individual vitest configs!** All packages use centralized configs from `@kit/testing`:

```json
{
  "scripts": {
    "test": "vitest run --config ../../tooling/testing/src/configs/vitest/unit.ts",
    "test:integration": "vitest run --config ../../tooling/testing/src/configs/vitest/integration.ts",
    "test:e2e": "vitest run --config ../../tooling/testing/src/configs/vitest/e2e.ts"
  }
}
```

## Validation System

### Brain Monitor

Coordinates validation across the entire monorepo:

```bash
# Check current status (ALWAYS do this first!)
pnpm brain:check

# Run full validation
pnpm brain:validate

# Watch mode during development
pnpm brain:watch

# Check specific validation types
pnpm brain:typecheck-failures
pnpm brain:lint-failures
pnpm brain:test-failures-unit
```

### Validation Workflow

1. **Before Running Commands:** Check `_errors/validation-summary.md`
2. **During Development:** Use `pnpm brain:watch` for real-time feedback
3. **Before Committing:** Run `pnpm validate` (lint + typecheck + test)
4. **In CI:** Automated validation on push/PR

### Error Reports

All validation errors are written to `_errors/`:
- `validation-summary.md` - Overview of all issues
- `reports/errors.typecheck-failures.md` - TypeScript errors
- `reports/errors.lint-failures.md` - ESLint errors
- `reports/errors.test-failures-unit.md` - Unit test failures

Logs are written to `_logs/` for multi-agent coordination.

## GitHub Actions Integration

### Automated CI/CD

The template includes a complete GitHub Actions workflow (`.github/workflows/validate.yml`):

**Triggers:**
- Push to any branch
- Pull requests

**Jobs:**
- Install dependencies (with pnpm caching)
- Type checking (all packages)
- Linting (all packages)
- Testing (unit, integration, e2e)
- Generate validation report
- Comment on PR with results

**Problem Matchers:**
- TypeScript errors annotated in diff
- ESLint errors annotated in diff

### Setup

```bash
pnpm ci:init
```

This creates:
- `.github/workflows/validate.yml`
- `.github/problem-matchers.json`

## Generator Usage

Add new apps and packages easily:

```bash
# Web app
pnpm gen:react-web
# → Prompts for name, UI library, state management, etc.

# Mobile app
pnpm gen:react-native
# → Prompts for template, UI library, etc.

# Desktop app
pnpm gen:electron
# → Prompts for UI, auto-updater, etc.

# Backend API
pnpm gen:express-api
# → Prompts for database, auth, etc.
```

All generators automatically:
- Configure `@kit/testing` integration
- Add test scripts using centralized configs
- Create sample test files
- Set up ESLint/Prettier
- Configure TypeScript

## Customization Guide

### 1. Rename Project

Change `scheduling-station` to your project name:
- Root `package.json` → `name` field
- All references in documentation
- Git repository name

### 2. Update Package Scopes

Change `@starter` to your company scope:
- All app `package.json` files
- All package `package.json` files
- Import statements in code
- pnpm-workspace.yaml (if scoped)

### 3. Remove Unwanted Apps

If you don't need certain app types:
```bash
# Remove app
rm -rf apps/mobile

# Remove from pnpm-workspace.yaml if needed
# (Usually not necessary if using wildcard)

# Reinstall
pnpm install
```

### 4. Configure Environment Variables

**All environment variables are consolidated in the monorepo root:**
```bash
cp .env.example .env
# Edit .env with your values
```

**Important:** This template uses `tooling/env-loader` to manage all environment variables from a single root `.env` file. Apps access variables using `@kit/env-loader` rather than maintaining individual `.env` files. This ensures consistency and simplifies environment management across the entire monorepo.

### 5. Customize Tooling

Modify shared configs in `tooling/`:
- `tooling/eslint` - ESLint rules
- `tooling/prettier` - Prettier config
- `tooling/typescript` - TS configs
- `tooling/testing` - Test configs

## Best Practices

### Development Workflow

1. **Start Development:**
   ```bash
   pnpm dev  # Starts all apps in watch mode
   ```

2. **Make Changes with Validation:**
   ```bash
   # In another terminal
   pnpm brain:watch
   ```

3. **Run Tests:**
   ```bash
   pnpm test:watch  # Watch mode for tests
   ```

4. **Before Committing:**
   ```bash
   pnpm validate  # Ensure everything passes
   ```

### Adding Features

1. **Shared Logic:** Add to `packages/shared-utils`
2. **Shared UI:** Add to `packages/shared-ui`
3. **App-Specific:** Add to the relevant app's `src/`

Always add tests alongside your code.

### Cross-Package Dependencies

Apps can depend on shared packages:

```json
{
  "dependencies": {
    "@starter/shared-utils": "workspace:*",
    "@starter/shared-ui": "workspace:*"
  }
}
```

pnpm automatically links workspace packages.

## Troubleshooting

### Generators Not Found

```bash
# Ensure you're in monorepo root
pwd

# Check package.json has gen:* scripts
cat package.json | grep "gen:"
```

### Import Errors

```bash
# Reinstall dependencies
pnpm install

# Type check to see specific errors
pnpm typecheck
```

### Tests Failing

```bash
# Check brain-monitor reports
cat _errors/validation-summary.md

# Run specific test type
pnpm test:unit
pnpm test:integration
pnpm test:e2e
```

### Port Conflicts

Check `_logs/index.md` to see running servers. Stop conflicting processes or change ports in `.env` files.

## Next Steps

1. **Explore the Code:** Review generated apps to understand patterns
2. **Run Tests:** Execute `pnpm test` to see all tests pass
3. **Build Something:** Start adding your features!
4. **Read Guides:** Check `docs/guides/` for detailed topics

## Documentation Index

- **[Template Usage](./TEMPLATE_USAGE.md)** - How to use this template
- **[Testing Strategy](./guides/testing-strategy.md)** - Comprehensive testing guide
- **[Validation Workflow](./guides/validation-workflow.md)** - Using brain-monitor
- **[Generator Usage](./guides/generator-usage.md)** - Adding new apps/packages
- **[Customization Guide](./guides/customization-guide.md)** - Adapting the template
- **[Quick Start](./guides/quick-start.md)** - Get up and running in 5 minutes

---

**Ready to build amazing things!** 🚀
