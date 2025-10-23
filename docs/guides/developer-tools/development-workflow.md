---
title: "Development Workflows"
description: "Common development workflows using CME tools"
keywords: [workflow, development, best-practices, commands, tdd]
last_updated: "2025-01-22"
---

# Development Workflows

Common development workflows showing how CME tools work together in real scenarios.

## Overview

This guide provides step-by-step workflows for common development tasks, demonstrating how validation, logging, testing, and other tools integrate seamlessly.

## Starting Development Session

Complete workflow for beginning a development session.

### Step 1: Check for Existing Errors

Before starting, check if there are existing validation issues:

```bash
cat _errors/validation-summary.md
```

**Why:** Understand the current state. Don't create new errors while existing ones remain.

**If errors exist:**
- Review the errors
- Fix critical blockers first
- Or work on unrelated area

### Step 2: Setup Environment (If Needed)

Run environment setup after:
- Fresh clone
- Branch switch
- Worktree creation
- Port conflicts

```bash
pnpm setup:env
```

**What it does:**
- Assigns unique ports per worktree
- Generates `.env` files for each app
- Prevents port conflicts across branches

### Step 3: Start Dev Servers with Logging

```bash
pnpm brain:dev
```

**What this provides:**
- Starts all dev servers (`client`, `server`, `storybook`, etc.)
- Captures logs to `_logs/[package-name].log`
- Captures browser console to `_logs/browser-console.log`
- Auto-discovers packages with dev scripts

**Alternative (without logging):**
```bash
pnpm dev
```

### Step 4: Start Watch Mode for Validation

In a separate terminal:

```bash
pnpm brain:watch
```

**What this provides:**
- Continuous TypeScript + ESLint validation
- Immediate feedback on file changes
- Live status in `_errors/watch-summary.md`
- Terminal notifications for errors

### Step 5: Monitor Logs (Optional)

In a separate terminal, monitor specific package logs:

```bash
# Server logs
tail -f _logs/server.log

# Client logs
tail -f _logs/client.log

# All logs
tail -f _logs/*.log
```

### Complete Setup Example

```bash
# Terminal 1: Check state, setup, start dev servers
cat _errors/validation-summary.md
pnpm setup:env
pnpm brain:dev

# Terminal 2: Start watch mode
pnpm brain:watch

# Terminal 3: Monitor server logs
tail -f _logs/server.log
```

## Before Committing Workflow

Pre-commit checklist to ensure code quality.

### Step 1: Run All Validations

```bash
pnpm brain:validate
```

**This runs:**
- TypeScript type checking
- ESLint linting
- Prettier formatting
- All unit tests
- All integration tests
- All E2E tests (if configured)

**Expected time:** 2-5 minutes depending on codebase size.

### Step 2: Review Validation Summary

```bash
cat _errors/validation-summary.md
```

**Look for:**
- ✅ PASSING status
- Error counts per validation type
- Timestamp of last validation

**If errors found:** Proceed to Step 3. If passing: Skip to Step 6.

### Step 3: Auto-Fix What's Possible

```bash
pnpm format:fix && pnpm lint:fix
```

**What gets fixed:**
- Code formatting (Prettier)
- Auto-fixable lint rules (ESLint)
- Import sorting
- Whitespace issues

### Step 4: Re-Run Validations (If Fixes Were Made)

```bash
pnpm brain:validate
```

**Why:** Auto-fixes might have resolved type errors or test failures indirectly.

### Step 5: Manual Fixes (If Errors Remain)

Review detailed error reports:

```bash
# Type errors
cat _errors/reports/errors.typecheck-failures.md

# Lint errors
cat _errors/reports/errors.lint-failures.md

# Test failures
cat _errors/reports/errors.test-failures-unit.md
```

Fix remaining issues manually, then return to Step 1.

### Step 6: Update CHANGELOG.md (If User-Facing Changes)

If changes affect users or API consumers:

```markdown
## [Unreleased]

### Added
- New feature: User can now export data to CSV

### Changed
- Improved: Login form now shows validation errors inline

### Fixed
- Bug fix: Dashboard no longer crashes on refresh
```

Follow [Keep a Changelog](https://keepachangelog.com/) format.

### Step 7: Commit with Conventional Commit Message

```bash
git add .
git commit -m "feat(auth): add CSV export functionality"
```

**Conventional Commit format:**
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Complete Pre-Commit Example

```bash
# Step 1: Validate
pnpm brain:validate

# Step 2: Check results
cat _errors/validation-summary.md

# Step 3 (if needed): Auto-fix
pnpm format:fix && pnpm lint:fix

# Step 4 (if fixed): Re-validate
pnpm brain:validate

# Step 5 (if needed): Manual fixes
# ... fix remaining issues ...

# Step 6: Update changelog
# ... edit CHANGELOG.md ...

# Step 7: Commit
git add .
git commit -m "feat(users): add CSV export functionality"
```

## Creating New Package Workflow

Scaffolding a new package in the monorepo.

### Step 1: Run Generator

```bash
pnpm gen:library
```

### Step 2: Answer Interactive Prompts

```
? Package name: @scala-cme/data-export
? Description: Data export utilities for CSV, Excel, PDF
? Package type: (Use arrow keys)
  ❯ library   - Shared library package
    ui        - UI component library
    utility   - Utility/helper package
```

**Naming conventions:**
- Apps: `@scala-cme/[app-name]`
- Packages: `@scala-cme/[package-name]`
- Tooling: `@kit/[tool-name]`

### Step 3: Review Generated Structure

```bash
ls -la packages/data-export/
```

**Generated files:**
```
packages/data-export/
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript config
├── README.md              # Package documentation
├── CHANGELOG.md           # Version history
└── src/
    └── index.ts           # Main entry point
```

### Step 4: Setup Environment

```bash
pnpm setup:env
```

**Why:** Installs dependencies and configures environment.

### Step 5: Validate Setup

```bash
pnpm brain:typecheck-failures
```

**Expected:** No errors for fresh package.

### Step 6: Create Package README.md

Follow template structure:

```markdown
# @scala-cme/data-export

> Data export utilities for CSV, Excel, PDF

## Installation

\`\`\`bash
pnpm add @scala-cme/data-export
\`\`\`

## Usage

\`\`\`typescript
import {exportToCSV} from '@scala-cme/data-export';

const data = [{name: 'John', age: 30}];
exportToCSV(data, 'users.csv');
\`\`\`

## API

### `exportToCSV(data, filename)`
...
```

### Step 7: Add to Feature Documentation (If Applicable)

If package is part of a feature, update feature docs:

```bash
# Create or update feature documentation
docs/features/data-export/
├── README.md
├── requirements.md
├── architecture.md
├── api.md
└── testing.md
```

See: [/docs/maintenance/templates/feature-template/](/docs/maintenance/templates/feature-template/)

### Complete Package Creation Example

```bash
# Step 1: Generate
pnpm gen:library

# Steps 2-3: Answer prompts and review
# Package name: @scala-cme/data-export
# Description: Data export utilities
# Type: library

# Step 4: Setup
pnpm setup:env

# Step 5: Validate
pnpm brain:typecheck-failures

# Step 6: Create README
# ... edit packages/data-export/README.md ...

# Step 7: Implement and test
cd packages/data-export
# ... write code and tests ...

# Step 8: Validate final package
cd ../..
pnpm brain:validate
```

## Debugging Runtime Issues Workflow

Troubleshooting runtime problems with logging tools.

### Step 1: Identify Problematic Package

Determine which package has the issue:
- Server errors → `@scala-cme/server`
- Client errors → `@scala-cme/client`
- UI errors → `@scala-cme/shared-ui`

### Step 2: Check Package Logs

```bash
tail -f _logs/[package-name].log
```

**Example:**
```bash
tail -f _logs/server.log
```

### Step 3: Enable Debug Logging

For more detailed output:

```bash
LOG_LEVEL=debug pnpm dev
```

**Or for specific package:**
```bash
cd apps/server
LOG_LEVEL=debug pnpm dev
```

**Log levels (verbosity increasing):**
- `error` - Errors only
- `warn` - Warnings and errors
- `info` - General information (default)
- `debug` - Debugging details
- `trace` - Maximum verbosity

### Step 4: Reproduce Issue While Monitoring

With logs tailing, reproduce the issue and watch for:
- Error messages
- Stack traces
- Request/response data
- Timing information

### Step 5: Add Targeted Logging (If Needed)

Insert log statements at key points:

```typescript
import {log} from '@kit/logger/node';

export const processUser = (userId: string) => {
  log.debug({userId}, 'Processing user');

  const user = getUserFromDB(userId);
  log.debug({user}, 'User retrieved');

  if (!user) {
    log.error({userId}, 'User not found');
    throw new Error('User not found');
  }

  // ... rest of logic
};
```

### Step 6: Fix Issue

Based on log analysis, implement fix.

### Step 7: Verify Fix with Logs

Continue monitoring logs while testing:

```bash
tail -f _logs/server.log
```

Confirm:
- Error no longer occurs
- Expected log messages appear
- No new errors introduced

### Complete Debugging Example

```bash
# Step 1: Identify package
# Issue: API endpoint returning 500 error
# Package: @scala-cme/server

# Step 2: Check logs
tail -f _logs/server.log

# Step 3: Enable debug logging
LOG_LEVEL=debug pnpm dev

# Step 4: Reproduce issue
# ... make API request that fails ...

# Step 5: Review logs for errors
# Found: "Database connection timeout"

# Step 6: Add targeted logging
# ... edit server code to log DB connection details ...

# Step 7: Reproduce with new logs
# Found: Connection string missing DB_HOST

# Step 8: Fix
# ... add DB_HOST to .env ...

# Step 9: Verify fix
tail -f _logs/server.log
# ... make API request ...
# Success: No errors, request completes
```

## Fixing Validation Errors Workflow

Systematic approach to resolving validation failures.

### Step 1: Identify Error Type

```bash
cat _errors/validation-summary.md
```

**Look for:**
- Error counts by type
- Which validation failed
- Timestamps

### Step 2: Read Detailed Report

```bash
cat _errors/reports/errors.[type].md
```

**Example:**
```bash
# For type errors
cat _errors/reports/errors.typecheck-failures.md

# For lint errors
cat _errors/reports/errors.lint-failures.md

# For test failures
cat _errors/reports/errors.test-failures-unit.md
```

### Step 3: Run Specific Validation

For faster feedback during fixes:

```bash
# TypeScript errors
pnpm brain:typecheck-failures

# Lint errors
pnpm brain:lint-failures

# Format errors
pnpm brain:format-failures

# Test failures
pnpm brain:test-failures-unit
```

### Step 4: Fix Errors in Order

Recommended order:

**1. Format →** `pnpm format:fix`
**2. Lint →** `pnpm lint:fix`
**3. TypeScript →** Manual fixes
**4. Tests →** Manual fixes

**Why this order:** Auto-fixes first, then manual. Format/lint fixes can resolve type errors.

### Step 5: Re-Run Specific Validation

```bash
pnpm brain:[type]-failures
```

### Step 6: Iterate Until Clean

Repeat Steps 3-5 until validation passes.

### Step 7: Run Full Validation

Once specific validation passes:

```bash
pnpm brain:validate
```

**Why:** Ensure no regressions in other areas.

### Complete Error Fixing Example

```bash
# Step 1: Check summary
cat _errors/validation-summary.md
# Result: 12 TypeScript errors, 5 lint errors

# Step 2: Auto-fix what's possible
pnpm format:fix && pnpm lint:fix
# Result: Fixed 3 lint errors

# Step 3: Check remaining lint errors
pnpm brain:lint-failures
cat _errors/reports/errors.lint-failures.md
# Result: 2 lint errors (no-unused-vars)

# Step 4: Fix manual lint errors
# ... remove unused variables ...

# Step 5: Verify lint clean
pnpm brain:lint-failures
# Result: ✅ No lint errors

# Step 6: Fix TypeScript errors
pnpm brain:typecheck-failures
cat _errors/reports/errors.typecheck-failures.md
# ... fix type errors one by one ...

# Step 7: Verify TypeScript clean
pnpm brain:typecheck-failures
# Result: ✅ No type errors

# Step 8: Full validation
pnpm brain:validate
# Result: ✅ PASSING
```

## Adding New Feature Workflow

Complete TDD workflow for implementing a new feature.

### Step 1: Create Feature Documentation

Use template from `/docs/maintenance/templates/feature-template/`:

```bash
cp -r docs/maintenance/templates/feature-template docs/features/user-export
```

**Fill all sections:**
- `README.md` - Overview and navigation
- `requirements.md` - Functional and non-functional requirements
- `architecture.md` - Technical design
- `api.md` - API contracts
- `testing.md` - Test strategy

### Step 2: Follow TDD Workflow (from AGENTS.md)

**TDD 5-Step Process:**

1. **ORIENT** - Choose test type (E2E > Integration > Unit)
2. **SCAFFOLD** - Create test file
3. **RED** - Write failing test
4. **GREEN** - Minimal code to pass
5. **REFACTOR** - Clean up

**Test type priority:**
- E2E first (validates complete user flow)
- Integration second (validates API/service integration)
- Unit last (validates business logic)

### Step 3: Implement Feature with Tests

```bash
# Start watch mode
pnpm brain:watch

# Implement feature following TDD
# ... write test (RED) ...
# ... write code (GREEN) ...
# ... refactor (REFACTOR) ...
# ... repeat ...
```

### Step 4: Run Validations Continuously

Watch mode provides continuous feedback:

```bash
pnpm brain:watch
```

**Or run specific validations:**
```bash
pnpm brain:test-failures-unit
pnpm brain:typecheck-failures
```

### Step 5: Update Feature Documentation

Add code references to feature docs:

```markdown
## Implementation

The user export feature is implemented in:
- `packages/data-export/src/exporters/csv.ts:45` - CSV export logic
- `apps/server/src/modules/export/export.controller.ts:22` - API endpoint
- `apps/client/src/features/export/ExportButton.tsx:10` - UI component
```

### Step 6: Update CHANGELOG.md

```markdown
## [Unreleased]

### Added
- User export: CSV, Excel, PDF export functionality
```

### Step 7: Full Validation Before PR

```bash
pnpm brain:validate
```

### Complete Feature Example

```bash
# Step 1: Create feature docs
cp -r docs/maintenance/templates/feature-template docs/features/user-export
# ... fill all template sections ...

# Step 2: Start watch mode
pnpm brain:watch

# Step 3: TDD - E2E test
# ... create testing/e2e/user-export.browser.e2e.ts (RED) ...

# Step 4: TDD - Integration test
# ... create testing/integration/export-api.integration.test.ts (RED) ...

# Step 5: TDD - Unit tests
# ... create packages/data-export/src/csv.unit.test.ts (RED) ...

# Step 6: Implement (GREEN)
# ... implement export logic ...
# ... implement API endpoint ...
# ... implement UI component ...

# Step 7: Refactor (REFACTOR)
# ... clean up code ...
# ... add error handling ...
# ... optimize performance ...

# Step 8: Update feature docs
# ... add code references to architecture.md ...
# ... update api.md with endpoints ...

# Step 9: Update changelog
# ... add entry to CHANGELOG.md ...

# Step 10: Full validation
pnpm brain:validate

# Step 11: Create PR
git add .
git commit -m "feat(export): add user export functionality"
git push origin feature/user-export
gh pr create --base qa --title "feat: User export functionality"
```

## Working from GitHub Issue Workflow

Ticket-based development for smaller tasks.

### Step 1: Use Brain Garden Prompt (If Available)

```bash
# Use Brain Garden prompt to fetch and route issue
@.brain/prompts/routine/planning/work-from-github-issue.prompt.md
```

**Or fetch manually:**
```bash
gh issue view [issue-number]
```

### Step 2: Determine Workflow Type

| Issue Type | Workflow | Documentation Needed |
|------------|----------|----------------------|
| Bug fix | Dev → QA | Update CHANGELOG only |
| Small enhancement | Dev → QA | Update CHANGELOG + package README |
| Refactoring | Dev → QA | Update relevant docs |
| Large feature | Full BMAD | Create feature docs |

### Step 3: Execute Appropriate Workflow

**Simple workflow (bug fix):**
1. Write failing test
2. Fix bug
3. Verify test passes
4. Update CHANGELOG
5. Create PR

**Complex workflow (multi-package):**
1. Break down into tasks
2. Implement per-package
3. Test integration
4. Update all affected docs
5. Create PR

### Step 4: Update Documentation

**For tickets:**
- Update CHANGELOG.md if user-facing
- Update package README.md if API changed
- Update existing feature docs if behavior changed
- **Do NOT** create new feature docs for tickets

### Step 5: Close Issue

```bash
# Comment with PR link
gh issue comment [issue-number] --body "Fixed in #[pr-number]"

# Close issue
gh issue close [issue-number]
```

### Complete Issue Workflow Example

```bash
# Step 1: Fetch issue
gh issue view 123

# Step 2: Determine workflow
# Issue: "Button component doesn't handle disabled state"
# Type: Bug fix → Simple workflow

# Step 3: Write failing test
# ... create Button.unit.test.ts test for disabled state ...

# Step 4: Fix bug
# ... update Button.tsx to handle disabled prop ...

# Step 5: Verify
pnpm brain:test-failures-unit
# Result: ✅ Test passes

# Step 6: Update changelog
# ... add to CHANGELOG.md ...

# Step 7: Validate
pnpm brain:validate

# Step 8: Create PR
git add .
git commit -m "fix(ui): handle disabled state in Button component

Closes #123"
git push origin fix/button-disabled
gh pr create --base qa --title "fix: Button disabled state" --body "Closes #123"

# Step 9: Close issue
gh issue close 123
```

## Multi-Package Changes Workflow

Working across multiple packages in the monorepo.

### Step 1: Identify Affected Packages

List all packages that need changes:
- `@scala-cme/shared-ui` - UI components
- `@scala-cme/client` - Client app
- `@scala-cme/server` - Server API

### Step 2: Use Turbo Filters

Run commands on specific packages:

```bash
# Build specific packages
turbo build --filter=@scala-cme/shared-ui --filter=@scala-cme/client

# Test specific packages
turbo test --filter=@scala-cme/shared-ui

# Validate specific packages
turbo typecheck --filter=@scala-cme/server
```

### Step 3: Validate Each Package Individually

```bash
# Package 1
pnpm --filter @scala-cme/shared-ui typecheck

# Package 2
pnpm --filter @scala-cme/client typecheck

# Package 3
pnpm --filter @scala-cme/server typecheck
```

**Why:** Isolate errors to specific packages.

### Step 4: Run Full Monorepo Validation

```bash
pnpm brain:validate
```

**Why:** Ensure changes work together across packages.

### Step 5: Update Documentation for Each Package

Update relevant documentation:
- Package READMEs
- Feature documentation
- Architecture docs

### Complete Multi-Package Example

```bash
# Step 1: Identify packages
# Changes needed in: shared-ui, client, server

# Step 2: Implement in shared-ui
cd packages/shared-ui
# ... make changes ...
pnpm test:unit

# Step 3: Implement in client
cd ../../apps/client
# ... make changes ...
pnpm test:unit

# Step 4: Implement in server
cd ../server
# ... make changes ...
pnpm test:unit

# Step 5: Test integration
cd ../..
pnpm test:integration

# Step 6: Full validation
pnpm brain:validate

# Step 7: Update documentation
# ... update packages/shared-ui/README.md ...
# ... update docs/features/[feature]/architecture.md ...

# Step 8: Commit
git add .
git commit -m "feat: add export functionality across packages"
```

## Tool Integration Examples

How tools complement each other in real workflows.

### brain-monitor + @kit/logger

**Comprehensive observability:**

```bash
# Start dev with logging
pnpm brain:dev

# In separate terminal: watch validation
pnpm brain:watch

# In separate terminal: monitor logs
tail -f _logs/server.log
```

**Benefits:**
- Real-time runtime monitoring (logs)
- Real-time build monitoring (watch)
- Centralized error tracking (reports)

### Turbo + brain-monitor

**Efficient validation:**

```bash
# brain-monitor uses Turbo under the hood
pnpm brain:validate

# Turbo provides:
# - Parallel execution
# - Intelligent caching
# - Task dependencies
```

### @kit/testing + brain-monitor

**Test orchestration:**

```bash
# brain-monitor coordinates tests
pnpm brain:test-failures-unit

# @kit/testing provides:
# - Recursive runner (handles timeouts)
# - Coverage enforcement
# - Multiple test types
```

### pnpm workspaces + generators

**Consistent package creation:**

```bash
# Generator creates package
pnpm gen:library

# pnpm links automatically
# workspace:* protocol ensures consistency
```

## Related Documentation

- [Quick Reference](/docs/guides/developer-tools/quick-reference.md) - Command lookup
- [Validation Tools](/docs/guides/developer-tools/validation-tools.md) - Validation tool details
- [Logging & Debugging](/docs/guides/developer-tools/logging-debugging.md) - Debugging strategies
- [Code Generation](/docs/guides/developer-tools/code-generation.md) - Scaffolding tools
- [Troubleshooting](/docs/guides/developer-tools/troubleshooting.md) - Common issues
- [AGENT_INSTRUCTIONS.md](/docs/maintenance/AGENT_INSTRUCTIONS.md) - Complete agent guide
- [AGENTS.md](/AGENTS.md) - Development rules and TDD workflow
