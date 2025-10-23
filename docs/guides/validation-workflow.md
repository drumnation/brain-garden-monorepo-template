# Validation Workflow Guide

This guide explains how to use the monorepo's validation system to keep your code clean, type-safe, and well-tested.

## Overview

The monorepo uses a three-tier validation approach:

1. **Turbo Pipeline** - Orchestrates all validation tasks
2. **Brain-Monitor** - Generates detailed error reports
3. **Individual Tools** - ESLint, TypeScript, Vitest

## Quick Start Commands

### Full Validation
```bash
# Run all validations (lint, typecheck, test)
pnpm validate

# Same but using brain-monitor
pnpm brain:validate
```

### Watch Mode
```bash
# Run validation in watch mode (re-runs on file changes)
pnpm brain:watch
```

### Specific Validations
```bash
# Type checking only
pnpm typecheck
pnpm brain:typecheck-failures

# Linting only
pnpm lint
pnpm brain:lint-failures

# Testing only
pnpm test
pnpm brain:test-failures-unit

# Formatting check only
pnpm format
pnpm brain:format-failures
```

## Understanding Reports

### validation-summary.md
**Location:** `_errors/validation-summary.md`

Quick overview of all validation results:
```markdown
# Validation Summary

## Status Overview
- ✅ TypeScript: 0 errors
- ⚠️  Linting: 3 warnings
- ❌ Tests: 2 failures
- ✅ Formatting: 0 issues

## Quick Actions
[Links to specific reports]
```

**Check this first** - it tells you what's broken

### Detailed Error Reports
**Location:** `_errors/reports/`

Individual reports for each validation type:
- `errors.typecheck-failures.md` - TypeScript errors with file/line numbers
- `errors.lint-failures.md` - ESLint violations with locations
- `errors.test-failures-unit.md` - Failed unit tests
- `errors.test-failures-integration.md` - Failed integration tests
- `errors.test-failures-e2e.md` - Failed E2E tests

### Real-time Logs
**Location:** `_logs/`

Server logs from running applications:
```bash
# Watch logs in real-time
tail -f _logs/api.log
```

## Common Issues & Fixes

### TypeScript Errors
**When:** `pnpm typecheck` fails
**Where:** `_errors/reports/errors.typecheck-failures.md`

**Common causes:**
```typescript
// ❌ Type mismatch
const x: string = 123;

// ✅ Fix
const x: number = 123;

// ❌ Missing imports
const logger = createLogger();  // createLogger not imported

// ✅ Fix
import { createLogger } from '@kit/logger';
const logger = createLogger();

// ❌ Wrong type
function process(data: User) { }
process({ name: 'John' } as unknown);  // Type assertion wrong

// ✅ Fix
const user: User = { name: 'John', id: 1 };
process(user);
```

**Fix:** Review the error locations in the report and update types

### Lint Errors
**When:** `pnpm lint` fails
**Where:** `_errors/reports/errors.lint-failures.md`

**Common causes:**
```typescript
// ❌ console.log not allowed
console.log('debug');

// ✅ Use logger instead
logger.debug('debug');

// ❌ Unused variables
const unused = 123;

// ✅ Remove or use them
const used = 123;
console.log(used);

// ❌ Line too long
const veryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLongLine = 1;

// ✅ Break lines
const veryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLongLine =
  1;
```

**Fix:** Review the lint report and apply fixes. Run `pnpm format` to fix many automatically.

### Test Failures
**When:** `pnpm test` fails
**Where:** `_errors/reports/errors.test-failures-unit.md`

**Common causes:**
```typescript
// ❌ Assertion mismatch
expect(actualValue).toBe(expectedValue);  // actualValue !== expectedValue

// ✅ Check actual vs expected
const actual = calculateTotal([10, 20]);
const expected = 30;
expect(actual).toBe(expected);

// ❌ Async test not awaited
it('should load data', () => {
  loadData();  // Promise not awaited
});

// ✅ Await async operations
it('should load data', async () => {
  const data = await loadData();
  expect(data).toBeDefined();
});

// ❌ Wrong test file location
// src/components/Button.tsx
// tests/button.test.ts  ❌ Wrong location

// ✅ Co-locate tests
// src/components/Button.tsx
// src/components/Button.test.ts  ✅ Same directory
```

**Fix:** Review failed tests in the report and update either the test or the code

### Formatting Issues
**When:** `pnpm format` shows files not formatted
**Where:** `_errors/reports/errors.format-failures.md`

**Quick fix:**
```bash
# Auto-fix formatting
pnpm format --fix

# OR manually if needed
pnpm format -- --write "src/**/*.ts"
```

## Workflow Example

### Scenario: Making a Feature Change

```bash
# 1. Make your changes
vim src/modules/users/users.service.ts

# 2. Check if there are issues
pnpm brain:validate

# 3. Review the summary
cat _errors/validation-summary.md

# 4. Fix TypeScript errors (if any)
pnpm typecheck
# View detailed errors
cat _errors/reports/errors.typecheck-failures.md
# Update types in your code

# 5. Fix linting issues (if any)
pnpm lint
# Many can be auto-fixed
pnpm format --fix
# Manual review if needed
cat _errors/reports/errors.lint-failures.md

# 6. Check tests (if any)
pnpm test
# If tests fail, review and either fix the test or the code
cat _errors/reports/errors.test-failures-unit.md

# 7. Run full validation again
pnpm brain:validate

# 8. When clean, commit
git add .
git commit -m "feat(users): add new user function"
```

## Watch Mode Development

For continuous feedback during development:

```bash
# Terminal 1: Start watch mode (re-runs on file changes)
pnpm brain:watch

# Terminal 2: Your editor
vim src/modules/users/users.service.ts

# Watch mode automatically re-runs validation
# Results appear in _errors/validation-summary.md
```

## Brain-Monitor Commands

### Validation Commands
```bash
# Full validation (all checks)
pnpm brain:validate

# Watch mode (continuous)
pnpm brain:watch

# Specific checks
pnpm brain:typecheck-failures      # TypeScript only
pnpm brain:lint-failures           # ESLint only
pnpm brain:test-failures-unit      # Unit tests only
```

### Log Monitoring
```bash
# View validation summary
pnpm monitor:errors

# View server logs
pnpm monitor:logs

# Monitor specific app
pnpm monitor:logs api
```

## Turbo Caching

The validation tools use Turbo's caching to speed up repeated runs:

```bash
# First run (no cache): 45 seconds
pnpm validate

# Second run (cached, no changes): 2 seconds
pnpm validate

# After changes: runs again (cached parts still fast)
vim src/file.ts
pnpm validate  # Faster because only affected packages re-run
```

**Note:** Clean cache if you have cache issues:
```bash
pnpm clean  # Removes cache
```

## Pre-Commit Workflow

**Before committing, always:**

1. Run `pnpm brain:validate` to check for issues
2. Fix any TypeScript errors
3. Fix any linting errors
4. Fix any test failures
5. Review the validation summary is clean

```bash
# Complete check before commit
pnpm brain:validate && \
  cat _errors/validation-summary.md && \
  git add . && \
  git commit -m "feat: your feature"
```

## Troubleshooting

### Reports Are Stale
If reports are older than 10 minutes, re-run validation:
```bash
pnpm brain:validate
```

### Some Errors Won't Go Away
Clear the cache and re-run:
```bash
pnpm clean
pnpm brain:validate
```

### Test Failures Are Weird
Run tests in verbose mode:
```bash
pnpm test -- --reporter=verbose
```

### Watch Mode Not Detecting Changes
Make sure you're using the correct command:
```bash
# Correct
pnpm brain:watch

# Also OK
turbo run validate --watch
```

## Advanced: Running Specific Validations

Run validation for a single package:
```bash
# Validate only the api app
pnpm --filter=@starter/api validate

# Validate only the web app
pnpm --filter=@starter/web validate

# Validate only the testing tooling
pnpm --filter=@kit/testing validate
```

---

**Need help?** See the main README.md or check the validation report at `_errors/validation-summary.md`
