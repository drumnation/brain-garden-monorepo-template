---
title: "Validation Tools"
description: "Guide to validation, testing, and quality assurance tools in CME"
keywords: [validation, testing, brain-monitor, eslint, prettier, typescript, vitest]
last_updated: "2025-01-22"
---

# Validation Tools

Comprehensive guide to validation, testing, and quality assurance tools in the Content Manager Express monorepo.

## Overview

The CME monorepo uses a suite of validation tools to ensure code quality, type safety, and test coverage. These tools are orchestrated by brain-monitor, which provides unified reporting and efficient parallel execution.

**Key Principle:** Always check `_errors/validation-summary.md` before running validations to avoid redundant work.

## brain-monitor

The validation orchestrator that centralizes all quality assurance tasks.

### Purpose

brain-monitor provides:
- **Centralized Validation:** Single command for all quality checks
- **Shared Reporting:** Markdown task lists in `_errors/` directory
- **Real-time Logging:** Streams dev server logs to `_logs/` directory
- **Parallel Execution:** Runs validations concurrently for speed
- **Watch Mode:** Continuous validation with file watching
- **AI-Friendly:** Designed for multi-agent collaboration

### Key Commands

From root `package.json`:

| Command | Purpose | Speed | When to Use |
|---------|---------|-------|-------------|
| `pnpm brain:validate` | Run all validations | Slow | Before committing |
| `pnpm brain:watch` | Watch mode (TypeScript + Lint) | Fast | During development |
| `pnpm brain:typecheck-failures` | TypeScript only | Fast | Fixing type errors |
| `pnpm brain:lint-failures` | ESLint only | Fast | Fixing lint errors |
| `pnpm brain:format-failures` | Prettier only | Fast | Fixing format errors |
| `pnpm brain:test-failures-unit` | Unit tests only | Medium | Fixing unit test failures |
| `pnpm brain:test-failures-integration` | Integration tests only | Medium | Fixing integration test failures |
| `pnpm brain:test-failures-e2e` | E2E tests only | Slow | Fixing E2E test failures |
| `pnpm brain:logs` | Monitor dev server logs | N/A | Viewing runtime logs |
| `pnpm brain:dev` | Start dev servers with logging | N/A | Development with logging |

### Output Structure

brain-monitor generates reports in the `_errors/` directory:

```
_errors/
├── validation-summary.md              # Check this FIRST
├── watch-summary.md                   # Live status (watch mode)
└── reports/
    ├── errors.typecheck-failures.md   # TypeScript errors
    ├── errors.lint-failures.md        # ESLint errors
    ├── errors.format-failures.md      # Prettier errors
    ├── errors.test-failures-unit.md   # Unit test failures
    ├── errors.test-failures-integration.md
    └── errors.test-failures-e2e.md
```

**Validation Summary Example:**

```markdown
# Validation Summary

Last updated: 2025-01-22 10:30:45

## Status: ✅ PASSING

All validations passed successfully.

## Recent Validations

- ✅ TypeScript: 0 errors
- ✅ ESLint: 0 errors
- ✅ Prettier: 0 errors
- ✅ Unit Tests: 125/125 passing
- ✅ Integration Tests: 45/45 passing
```

### Watch Mode

Continuous validation during development:

```bash
# Fast watch (TypeScript + Lint only)
pnpm brain:watch

# Full watch (includes tests - slower)
pnpm brain:watch --all
```

**Watch mode provides:**
- Immediate feedback on file changes
- Incremental validation (only changed files)
- Live status in `_errors/watch-summary.md`
- Terminal notifications for errors

### When to Use vs. Direct Turbo Commands

| Scenario | Use | Reason |
|----------|-----|--------|
| Multiple agents | brain-monitor | Shared reports prevent conflicts |
| Complete validation | brain-monitor | Unified reporting |
| Specific package | Turbo with filter | Direct package targeting |
| CI/CD pipeline | brain-monitor | Standardized output |
| Quick local check | Turbo | Slightly faster for single task |

### Multi-Agent Collaboration

brain-monitor is designed for multiple AI agents working simultaneously:

- **Shared Reports:** All agents read from same `_errors/` directory
- **No Conflicts:** Markdown files prevent git merge conflicts
- **Task Delegation:** Clear error categorization by file
- **Status Awareness:** Agents check summary before starting work

### Detailed Documentation

For complete brain-monitor documentation, see: [/tooling/brain-monitor/README.md](/tooling/brain-monitor/README.md)

## @kit/testing

Unified testing infrastructure for the monorepo.

### Purpose

@kit/testing provides:
- **Pre-configured Test Runners:** Vitest, Playwright, Storybook
- **Intelligent Coverage:** Automatic thresholds with enforcement
- **Self-Healing Tests:** Auto-adjusts timeouts on failure
- **Recursive Validation:** Handles timeouts gracefully
- **Type-Safe:** Full TypeScript support

### Test Types

| Type | Environment | Runner | Use Case | Path Pattern |
|------|-------------|--------|----------|--------------|
| **Unit** | jsdom | Vitest | Component & business logic | `*.unit.test.ts(x)` |
| **Integration** | node | Vitest | API & service integration | `testing/integration/*.integration.test.ts(x)` |
| **Backend E2E** | node | Vitest | End-to-end server flows | `testing/e2e/*.backend.e2e.test.ts` |
| **Browser E2E** | Chromium | Playwright | Browser user flows | `testing/e2e/*.browser.e2e.ts` |
| **Storybook** | jsdom | Storybook Test Runner | Component visual tests | `*.stories.tsx` |

### Configuration Files

Test configuration using @kit/testing presets:

```typescript
// vitest.config.ts (unit tests)
import {configs} from '@kit/testing';
export default await configs.vitest.unit();
```

```typescript
// vitest.config.integration.ts
import {configs} from '@kit/testing';
export default await configs.vitest.integration();
```

```typescript
// playwright.config.ts
import {configs} from '@kit/testing';
export default await configs.playwright.browser();
```

### Test Runners

#### Recursive Runner

The recursive test runner automatically handles timeout failures:

**Features:**
- Detects test timeouts and retries with isolation
- Prevents false failures from shared state
- Automatically adjusts execution strategy
- Provides detailed failure reports

**How it works:**
1. Runs tests in parallel (fast)
2. If timeouts detected → Retry with isolation
3. If still failing → Report actual failures
4. Excludes timeout artifacts from reports

#### Coverage Enforcement

Automatic coverage thresholds per test type:

| Test Type | Coverage Threshold | Enforcement |
|-----------|-------------------|-------------|
| Unit | 85% | Strict |
| Integration | 85% | Strict |
| E2E | Optional | Disabled |
| Storybook | 85% | Strict |

**Coverage Presets:**

```typescript
import {presets} from '@kit/testing';

// Available presets
presets.coverage.base;     // 85% (default)
presets.coverage.strict;   // 90%
presets.coverage.relaxed;  // 70%
presets.coverage.disabled; // Off
```

### Running Tests

```bash
# All tests
pnpm test

# Specific test types
pnpm test:unit
pnpm test:integration
pnpm test:e2e

# With brain-monitor (recommended)
pnpm brain:test-failures-unit
pnpm brain:test-failures-integration
pnpm brain:test-failures-e2e
```

### Detailed Documentation

For complete testing documentation, see: [/tooling/testing/README.md](/tooling/testing/README.md)

## TypeScript

Static type checking for type safety.

### Purpose

TypeScript ensures:
- Type safety at compile time
- Prevents runtime type errors
- Enables intelligent IDE features
- Documents code through types

### Configuration

CME uses centralized TypeScript configurations from `@kit/tsconfig`:

| Preset | Use Case | Extends |
|--------|----------|---------|
| `@kit/tsconfig/base` | Shared base config | None |
| `@kit/tsconfig/node` | Node.js applications | base |
| `@kit/tsconfig/react` | React applications | base |
| `@kit/tsconfig/library` | Library packages | base |

**Package tsconfig.json example:**

```json
{
  "extends": "@kit/tsconfig/react",
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### Running Type Checks

```bash
# All packages
pnpm typecheck

# With brain-monitor (recommended)
pnpm brain:typecheck-failures
```

### Reading Type Error Reports

Type errors are reported in `_errors/reports/errors.typecheck-failures.md`:

```markdown
# TypeScript Errors

## packages/shared-ui/src/Button.tsx

Line 45:12 - TS2322: Type 'string' is not assignable to type 'number'.
  43 | const handleClick = () => {
  44 |   const value: number = props.value;
> 45 |   setValue("123"); // Error here
     |            ^^^^^
  46 | };
```

### Common Type Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `TS2322` | Type mismatch | Check assigned value matches declared type |
| `TS2304` | Cannot find name | Import missing type or value |
| `TS2339` | Property does not exist | Add property to interface or check typo |
| `TS2345` | Argument type mismatch | Check function parameter types |
| `TS2741` | Missing properties | Add required properties to object |
| `TS7006` | Implicit any | Add explicit type annotation |

## ESLint

Code quality and consistency enforcement.

### Purpose

ESLint ensures:
- Consistent code style
- Best practice adherence
- Bug prevention
- Framework-specific rules

### Configuration

CME uses centralized ESLint configurations from `@kit/eslint`:

| Preset | Use Case | Rules |
|--------|----------|-------|
| `@kit/eslint-config/base` | All packages | Core ESLint + TypeScript |
| `@kit/eslint-config/react` | React packages | base + React + Hooks |
| `@kit/eslint-config/services` | Backend services | base + Node.js |
| `@kit/eslint-config/apps` | Applications | Combines relevant presets |

**Package eslintConfig example (package.json):**

```json
{
  "eslintConfig": {
    "root": true,
    "extends": ["@kit/eslint-config/react"]
  }
}
```

### Running Lint

```bash
# Check for errors
pnpm lint

# Auto-fix errors
pnpm lint:fix

# With brain-monitor (recommended)
pnpm brain:lint-failures
```

### ESLint Cache

ESLint uses caching for faster subsequent runs:

```bash
# Cache location
node_modules/.cache/.eslintcache

# Cache is invalidated when:
# - Source files change
# - .eslintrc changes
# - Dependencies change
```

### Common Lint Errors and Auto-Fixes

| Error | Description | Auto-Fix |
|-------|-------------|----------|
| `no-unused-vars` | Unused variable | ❌ Manual |
| `prefer-const` | Variable should be const | ✅ Yes |
| `quotes` | Inconsistent quote style | ✅ Yes |
| `semi` | Missing semicolon | ✅ Yes |
| `indent` | Incorrect indentation | ✅ Yes |
| `react/jsx-key` | Missing key prop | ❌ Manual |
| `react-hooks/exhaustive-deps` | Missing hook dependency | ⚠️ Partial |

### ESLint vs Prettier

ESLint and Prettier work together:

- **ESLint:** Code quality and logical errors
- **Prettier:** Code formatting only
- **Integration:** ESLint delegates formatting to Prettier

**Run order:** Format first, then lint:

```bash
pnpm format:fix && pnpm lint:fix
```

### Detailed Configuration

For complete ESLint configuration, see: `/tooling/eslint/`

## Prettier

Automatic code formatting for consistency.

### Purpose

Prettier ensures:
- Consistent code formatting
- Eliminates style debates
- Automatic on save (IDE integration)
- Works with ESLint

### Configuration

CME uses centralized Prettier configuration from `@kit/prettier-config`.

**Package configuration (package.json):**

```json
{
  "prettier": "@kit/prettier-config"
}
```

**Config options:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

### Running Format

```bash
# Check formatting
pnpm format

# Auto-fix formatting
pnpm format:fix

# With brain-monitor (recommended)
pnpm brain:format-failures
```

### Integration with ESLint

Prettier is integrated with ESLint via `eslint-config-prettier`:

- Disables conflicting ESLint formatting rules
- Allows Prettier to handle all formatting
- ESLint focuses on code quality

### Detailed Configuration

For complete Prettier configuration, see: `/tooling/prettier/`

## Turbo Caching

Understanding cache behavior for validation tools.

### How Turbo Caches Results

Turbo caches validation results to speed up subsequent runs:

**Cache key based on:**
- Input files (source code)
- Configuration files
- Dependencies (package.json, pnpm-lock.yaml)
- Environment variables (in some cases)

**Cache location:**
```
.turbo/
├── [task-hash].log  # Task output
└── [task-hash].json # Task metadata
```

### When Cache is Invalidated

Cache invalidates when:
- Source files change
- Configuration files change (tsconfig.json, .eslintrc, etc.)
- Dependencies change
- Manually cleared

### Cache Control

```bash
# Use cache (default)
pnpm brain:validate

# Force bypass cache
pnpm brain:validate --force

# Clear cache
rm -rf .turbo
```

### Cache in CI/CD

CI/CD pipelines can persist Turbo cache:

```yaml
# GitHub Actions example
- name: Cache Turbo
  uses: actions/cache@v3
  with:
    path: .turbo
    key: turbo-${{ hashFiles('pnpm-lock.yaml') }}
```

## Validation Workflow

Step-by-step guide for effective validation.

### 1. Check Existing Reports

Before running any validation:

```bash
cat _errors/validation-summary.md
```

**Why:** Avoid redundant work. Another agent may have already run validations.

### 2. Run Appropriate Validation

Based on your changes:

| Change Type | Validation Command |
|-------------|-------------------|
| TypeScript types | `pnpm brain:typecheck-failures` |
| Code style | `pnpm lint:fix && pnpm format:fix` |
| Business logic | `pnpm brain:test-failures-unit` |
| API integration | `pnpm brain:test-failures-integration` |
| User flows | `pnpm brain:test-failures-e2e` |
| Everything | `pnpm brain:validate` |

### 3. Interpret Results

Read the generated reports:

```bash
# Summary
cat _errors/validation-summary.md

# Detailed errors
cat _errors/reports/errors.[type].md
```

### 4. Fix Issues

Fix in recommended order:

1. **Format** → `pnpm format:fix`
2. **Lint** → `pnpm lint:fix`
3. **TypeScript** → Manual fixes
4. **Tests** → Manual fixes

**Why this order:** Format and lint can auto-fix. Fixing these first prevents noise in type/test errors.

### 5. Re-validate

After fixes, re-run validation:

```bash
# Specific validation
pnpm brain:[type]-failures

# Full validation
pnpm brain:validate
```

### 6. Verify Clean State

Confirm all validations pass:

```bash
cat _errors/validation-summary.md
# Should show: ✅ PASSING
```

## Best Practices

### Always Check Reports First

```bash
# Before starting work
cat _errors/validation-summary.md
```

**Benefits:**
- Avoid redundant validation runs
- See existing errors before creating new ones
- Understand current codebase state
- Coordinate with other agents

### Use Watch Mode During Development

```bash
# Start watch mode
pnpm brain:watch

# Continue development
# → Automatic validation on file save
```

**Benefits:**
- Immediate feedback
- Catch errors early
- Faster iteration
- No manual validation commands

### Run Full Validation Before Committing

```bash
# Complete pre-commit validation
pnpm brain:validate

# Review results
cat _errors/validation-summary.md

# If passing, commit
git commit -m "feat: your changes"
```

**Benefits:**
- Ensure code quality
- Prevent CI/CD failures
- Maintain team standards
- Professional codebase

### Understand What Each Tool Validates

| Tool | Validates | Doesn't Validate |
|------|-----------|------------------|
| TypeScript | Type correctness | Runtime behavior |
| ESLint | Code quality, patterns | Business logic |
| Prettier | Code formatting | Code correctness |
| Unit Tests | Business logic | Integration |
| Integration Tests | API/service integration | UI behavior |
| E2E Tests | Complete user flows | Unit logic |

### Fix Issues in Order

Recommended order:

1. **Format** → Fixes formatting issues
2. **Lint** → Fixes code quality issues
3. **TypeScript** → Fixes type errors
4. **Tests** → Fixes test failures

**Why:** Each step can reveal or fix issues for the next step. Format and lint auto-fix reduce noise for manual fixes.

## Related Documentation

- [Quick Reference](/docs/guides/developer-tools/quick-reference.md) - Fast command lookup
- [Development Workflows](/docs/guides/developer-tools/development-workflow.md) - Validation in context
- [Troubleshooting](/docs/guides/developer-tools/troubleshooting.md) - Common validation issues
- [brain-monitor README](/tooling/brain-monitor/README.md) - Complete brain-monitor documentation
- [@kit/testing README](/tooling/testing/README.md) - Complete testing documentation
