---
title: "Testing Strategy Guide"
description: "Comprehensive testing strategy for the monorepo mega template"
keywords: [testing, vitest, playwright, unit, integration, e2e, coverage]
last_updated: "2025-10-22"
---

# Testing Strategy Guide

## Philosophy

Testing in this monorepo serves multiple critical purposes:

1. **AI Verification** - Provide signals that features actually work (AI-detectable regression prevention)
2. **Regression Prevention** - Catch breaking changes before they reach production
3. **Living Documentation** - Tests document expected behavior and API contracts
4. **Refactoring Confidence** - Enable safe code improvements with quick feedback

**CRITICAL:** End-to-end tests and integration tests are MOST IMPORTANT because they provide signals that features actually work. Unit tests are supplementary.

## Three-Tier Testing Approach

### Tier 1: Unit Tests (`.unit.test.ts(x)`)

**Purpose:** Test pure functions and components in isolation

**Location:** Co-located with source files
```
src/
├── utils/
│   ├── date.ts
│   └── date.unit.test.ts
├── components/
│   ├── Button.tsx
│   └── Button.unit.test.tsx
```

**Environment:** jsdom (for React components) or node (for pure functions)

**Characteristics:**
- Fast execution (<100ms per test)
- No external dependencies
- Mock external services
- Focus on edge cases and logic

**Example:**
```typescript
// src/utils/validation.ts
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// src/utils/validation.unit.test.ts
import { describe, it, expect } from 'vitest';
import { isValidEmail } from './validation';

describe('isValidEmail', () => {
  it('returns true for valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  it('returns false for invalid email', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
  });

  it('handles edge cases', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('test@sub.example.com')).toBe(true);
  });
});
```

### Tier 2: Integration Tests (`.integration.test.ts(x)`)

**Purpose:** Test multiple modules working together with real dependencies

**Location:** `testing/integration/`
```
apps/api/
├── testing/
│   └── integration/
│       ├── user-service.integration.test.ts
│       └── auth-flow.integration.test.ts
```

**Environment:** node

**Characteristics:**
- Medium execution time (100ms-1s per test)
- Uses real services (database, file system)
- May use test containers or in-memory databases
- Tests actual integration between modules

**Example:**
```typescript
// testing/integration/user-crud.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTestDatabase } from '../helpers/test-db';
import { createUserService } from '../../src/services/user';
import { createUserRepository } from '../../src/repositories/user';

describe('User CRUD Integration', () => {
  const testDb = createTestDatabase();
  const userRepo = createUserRepository({ db: testDb });
  const userService = createUserService({ userRepo });

  beforeAll(async () => {
    await testDb.migrate();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  it('creates and retrieves user', async () => {
    const created = await userService.createUser({
      name: 'Alice',
      email: 'alice@example.com',
    });

    expect(created).toHaveProperty('id');
    expect(created.name).toBe('Alice');

    const retrieved = await userService.getUserById(created.id);
    expect(retrieved).toEqual(created);
  });

  it('updates user data', async () => {
    const user = await userService.createUser({
      name: 'Bob',
      email: 'bob@example.com',
    });

    const updated = await userService.updateUser(user.id, {
      name: 'Robert',
    });

    expect(updated.name).toBe('Robert');
    expect(updated.email).toBe('bob@example.com');
  });

  it('deletes user', async () => {
    const user = await userService.createUser({
      name: 'Charlie',
      email: 'charlie@example.com',
    });

    await userService.deleteUser(user.id);

    const retrieved = await userService.getUserById(user.id);
    expect(retrieved).toBeNull();
  });
});
```

### Tier 3: End-to-End Tests

#### Backend E2E (`.backend.e2e.test.ts`)

**Purpose:** Test complete API workflows via HTTP without browser

**Location:** `testing/e2e/`

**Environment:** node

**Characteristics:**
- Slow execution (1s+ per test)
- Full server startup/shutdown
- Real HTTP requests via supertest
- Tests complete user scenarios

**Example:**
```typescript
// testing/e2e/user-api-workflow.backend.e2e.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'http';
import request from 'supertest';
import { createServer } from '../../src/infra/http/server';
import { createLogger } from '@kit/logger';

describe('User API Workflow E2E', () => {
  let server: Server;
  const PORT = 8082;
  const logger = createLogger({ name: 'test-e2e' });

  beforeAll(async () => {
    const app = createServer({ logger });
    await new Promise<void>((resolve) => {
      server = app.listen(PORT, () => resolve());
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it('completes full user lifecycle', async () => {
    // Create user
    const createRes = await request(`http://localhost:${PORT}`)
      .post('/api/v1/users')
      .send({ name: 'Alice', email: 'alice@example.com' })
      .expect(201);

    const userId = createRes.body.id;

    // Retrieve user
    const getRes = await request(`http://localhost:${PORT}`)
      .get(`/api/v1/users/${userId}`)
      .expect(200);

    expect(getRes.body.name).toBe('Alice');

    // Update user
    await request(`http://localhost:${PORT}`)
      .put(`/api/v1/users/${userId}`)
      .send({ name: 'Alicia' })
      .expect(200);

    // Delete user
    await request(`http://localhost:${PORT}`)
      .delete(`/api/v1/users/${userId}`)
      .expect(204);

    // Verify deletion
    await request(`http://localhost:${PORT}`)
      .get(`/api/v1/users/${userId}`)
      .expect(404);
  });
});
```

#### Browser E2E (`.browser.e2e.ts`)

**Purpose:** Test complete user workflows in real browser

**Location:** `testing/e2e/`

**Framework:** Playwright

**Characteristics:**
- Slowest execution (seconds per test)
- Real browser automation
- Tests actual UI interactions
- Verifies visual behavior

**Example:**
```typescript
// testing/e2e/app-navigation.browser.e2e.ts
import { test, expect } from '@playwright/test';

test.describe('App Navigation', () => {
  test('navigates through main workflow', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:3000');

    // Verify landing page
    await expect(page.locator('h1')).toContainText('Welcome');

    // Click counter button
    const button = page.locator('button:has-text("count is")');
    await button.click();
    await expect(button).toContainText('count is 1');

    // Navigate to another page
    await page.click('a:has-text("About")');
    await expect(page).toHaveURL(/.*about/);
    await expect(page.locator('h1')).toContainText('About');
  });

  test('handles form submission', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

## Centralized Configuration

### No Individual Vitest Configs

**IMPORTANT:** Packages do NOT have individual `vitest.config.ts` files. Instead, they use centralized configs from `@kit/testing` via `--config` flags.

**package.json scripts:**
```json
{
  "scripts": {
    "test": "vitest run --config ../../tooling/testing/src/configs/vitest/unit.ts",
    "test:unit": "vitest run --config ../../tooling/testing/src/configs/vitest/unit.ts",
    "test:integration": "vitest run --config ../../tooling/testing/src/configs/vitest/integration.ts",
    "test:e2e": "vitest run --config ../../tooling/testing/src/configs/vitest/e2e.ts",
    "test:watch": "vitest --config ../../tooling/testing/src/configs/vitest/unit.ts"
  }
}
```

### Config Files

Located in `tooling/testing/src/configs/vitest/`:

- **`unit.ts`** - jsdom environment, fast timeouts, includes `**/*.unit.test.ts(x)`
- **`integration.ts`** - node environment, medium timeouts, includes `**/testing/integration/**/*.test.ts`
- **`e2e.ts`** - node environment, slow timeouts, includes `**/testing/e2e/**/*.test.ts`

All configs enforce 85% coverage thresholds.

## Naming Conventions

| Test Type | Pattern | Example |
|-----------|---------|---------|
| Unit | `<fileName>.unit.test.ts(x)` | `Button.unit.test.tsx` |
| Integration | `<module>.integration.test.ts` | `user-service.integration.test.ts` |
| Backend E2E | `<scenario>.backend.e2e.test.ts` | `user-api-workflow.backend.e2e.test.ts` |
| Browser E2E | `<scenario>.browser.e2e.ts` | `checkout-flow.browser.e2e.ts` |

## Directory Structure

```
apps/my-app/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── Button.unit.test.tsx        # Co-located unit tests
│   └── utils/
│       ├── validation.ts
│       └── validation.unit.test.ts     # Co-located unit tests
└── testing/
    ├── integration/
    │   ├── user-service.integration.test.ts
    │   └── auth-flow.integration.test.ts
    └── e2e/
        ├── user-workflow.backend.e2e.test.ts
        └── checkout.browser.e2e.ts
```

## Running Tests

### All Tests
```bash
pnpm test                # Run all tests in all packages
pnpm test:watch          # Watch mode for unit tests
```

### Specific Test Types
```bash
pnpm test:unit           # Unit tests only
pnpm test:integration    # Integration tests only
pnpm test:e2e            # E2E tests only
```

### Single Package
```bash
cd apps/my-app
pnpm test               # All tests in this app
pnpm test:unit          # Unit tests only
pnpm test:integration   # Integration tests only
```

### Specific File
```bash
pnpm vitest src/utils/validation.unit.test.ts
```

## Coverage Requirements

All packages must maintain **85% coverage** across:
- Statements
- Branches
- Functions
- Lines

Coverage is enforced via centralized configs and validated in CI.

## Brain-Monitor Integration

Brain-monitor tracks test failures and reports them to `_errors/`:

```bash
# Check for test failures
cat _errors/reports/errors.test-failures-unit.md
cat _errors/reports/errors.test-failures-integration.md
cat _errors/reports/errors.test-failures-e2e.md

# Or use convenience script
pnpm brain:test-failures-unit
```

### Before Running Tests

Always check existing validation status:
```bash
pnpm brain:check
```

This prevents duplicate test runs and shows you what's already failing.

## Writing Good Tests

### Test Structure (Arrange-Act-Assert)

```typescript
it('describes what the test verifies', () => {
  // Arrange: Set up test data
  const input = 'test@example.com';

  // Act: Execute the function
  const result = isValidEmail(input);

  // Assert: Verify the result
  expect(result).toBe(true);
});
```

### Descriptive Test Names

❌ Bad:
```typescript
it('works', () => { ... });
it('test email', () => { ... });
```

✅ Good:
```typescript
it('returns true for valid email addresses', () => { ... });
it('throws error when email is empty string', () => { ... });
```

### Test One Thing

Each test should verify one specific behavior:

❌ Bad:
```typescript
it('handles user operations', async () => {
  await createUser();
  await updateUser();
  await deleteUser();
  // Too many operations in one test
});
```

✅ Good:
```typescript
it('creates user with valid data', async () => { ... });
it('updates user name', async () => { ... });
it('deletes user by ID', async () => { ... });
```

### Use Test Helpers

Create reusable test utilities in `testing/helpers/`:

```typescript
// testing/helpers/test-db.ts
export const createTestDatabase = () => {
  // Setup test database
  // Return methods for migrations, cleanup, etc.
};

// testing/helpers/factories.ts
export const createTestUser = (overrides = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  ...overrides,
});
```

## Common Patterns

### Testing Async Functions

```typescript
it('resolves with user data', async () => {
  const user = await fetchUser(123);
  expect(user).toHaveProperty('id', 123);
});

it('rejects when user not found', async () => {
  await expect(fetchUser(999)).rejects.toThrow('User not found');
});
```

### Testing React Components

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

it('calls onClick when clicked', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  fireEvent.click(screen.getByText('Click me'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Testing Error Cases

```typescript
it('throws error for invalid input', () => {
  expect(() => parseDate('')).toThrow('Invalid date');
});

it('returns error object for failed validation', () => {
  const result = validateUser({ email: 'invalid' });
  expect(result.error).toBeDefined();
  expect(result.error.message).toContain('Invalid email');
});
```

## CI/CD Integration

Tests run automatically in GitHub Actions on:
- Push to any branch
- Pull requests
- Before merging

### Workflow

1. Install dependencies
2. Run `pnpm test:unit` (fast feedback)
3. Run `pnpm test:integration`
4. Run `pnpm test:e2e`
5. Upload coverage reports
6. Comment on PR with results

### Handling Failures

When tests fail in CI:
1. Check `_errors/reports/` for detailed failure info
2. Run tests locally: `pnpm test`
3. Fix the failing tests
4. Verify: `pnpm validate`
5. Commit and push

## Best Practices Summary

1. **Write tests as you code** - Don't batch them at the end
2. **Start with E2E, then integration, then unit** - Top-down testing
3. **Keep tests fast** - Mock external services in unit tests
4. **Use descriptive names** - Tests are documentation
5. **One assertion per test** - Unless testing related outcomes
6. **Test edge cases** - Empty strings, null, undefined, boundary values
7. **Clean up after tests** - Use afterEach/afterAll for cleanup
8. **Use test helpers** - DRY principle applies to tests too
9. **Run tests before committing** - `pnpm validate`
10. **Check brain-monitor first** - Don't duplicate validation runs

## Troubleshooting

### Tests Pass Locally But Fail in CI

- Check environment variables (`.env.example` vs CI secrets)
- Verify test database is created correctly
- Check for timing issues (increase timeouts if needed)
- Review CI logs for environment-specific errors

### Slow Tests

- Move expensive setup to `beforeAll` instead of `beforeEach`
- Use in-memory databases for integration tests
- Mock external services
- Run unit tests in parallel (Vitest default)

### Flaky Tests

- Avoid relying on setTimeout (use waitFor from testing-library)
- Don't depend on execution order
- Clean up state between tests
- Use deterministic test data (avoid random values)

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Keep a Changelog - Test Guidelines](https://keepachangelog.com/)

---

**Remember:** Tests are investments. Good tests save time, prevent bugs, and enable confident refactoring. Bad tests slow you down and create false confidence.
