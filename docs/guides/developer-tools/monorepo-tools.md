---
title: "Monorepo Tools"
description: "Guide to workspace management and monorepo tooling in CME"
keywords: [monorepo, turbo, pnpm, workspaces, manypkg, build-orchestration]
last_updated: "2025-01-22"
---

# Monorepo Tools

Guide to workspace management and monorepo tooling in the Content Manager Express monorepo.

## Overview

The CME monorepo uses modern tooling to manage multiple packages efficiently. Turbo orchestrates tasks with intelligent caching, pnpm manages dependencies with workspace protocol, and manypkg validates consistency.

## Turbo

Build orchestration with intelligent caching and parallel execution.

### Purpose

Turbo provides:
- **Parallel Execution:** Run tasks concurrently across packages
- **Intelligent Caching:** Skip unchanged tasks
- **Task Dependencies:** Define execution order
- **Remote Caching:** Share cache across team
- **Incremental Builds:** Only rebuild what changed

### Configuration

Located in root `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env", "**/.env.test"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"],
      "outputs": ["node_modules/.cache/.eslintcache"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

### Tasks

Standard tasks defined in configuration:

| Task | Dependencies | Caching | Use Case |
|------|-------------|---------|----------|
| `build` | `^build` (upstream) | ✅ Yes | Build all packages |
| `dev` | None | ❌ No (persistent) | Start dev servers |
| `lint` | `^lint` (upstream) | ✅ Yes | Lint all packages |
| `typecheck` | `^typecheck` (upstream) | ✅ Yes | Type check all packages |
| `test` | `^build` (upstream) | ✅ Yes | Test all packages |
| `test:unit` | `^build` (upstream) | ✅ Yes | Unit tests only |
| `test:integration` | `^build` (upstream) | ✅ Yes | Integration tests only |
| `test:e2e` | `^build` (upstream) | ✅ Yes | E2E tests only |

### Task Dependencies

`dependsOn` defines task execution order:

**`^` prefix = upstream dependencies:**
```json
{
  "build": {
    "dependsOn": ["^build"]  // Build dependencies first
  }
}
```

**No prefix = same package:**
```json
{
  "deploy": {
    "dependsOn": ["build", "test"]  // Build and test this package first
  }
}
```

**Example flow:**
```
build @scala-cme/shared-ui (no dependencies)
  ↓
build @scala-cme/client (depends on shared-ui)
  ↓
build @scala-cme/server (depends on shared-ui)
```

### Caching

Turbo caches task outputs to skip unchanged work.

**Cache key based on:**
- Input files (source code)
- Task outputs
- Configuration files
- Dependencies (package.json, pnpm-lock.yaml)
- Environment variables (globalDependencies)

**Cache location:**
```
.turbo/
├── [task-hash].log  # Task output
└── [task-hash].json # Task metadata
```

**Outputs configuration:**
```json
{
  "build": {
    "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
  }
}
```

**Cache control:**
```bash
# Use cache (default)
turbo run build

# Force bypass cache
turbo run build --force

# Clear cache
rm -rf .turbo
```

### Running Tasks

Run tasks with Turbo:

```bash
# Run task in all packages
turbo run build

# Multiple tasks
turbo run build test lint

# With cache dir
turbo run build --cache-dir=.turbo
```

**Via package.json scripts:**
```bash
# These use Turbo internally
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

### Filtering

Run tasks on specific packages:

```bash
# Single package
turbo run build --filter=@scala-cme/shared-ui

# Multiple packages
turbo run build --filter=@scala-cme/shared-ui --filter=@scala-cme/client

# Pattern matching
turbo run build --filter="@scala-cme/*"

# Exclude packages
turbo run build --filter=!@scala-cme/storybook
```

**Filter patterns:**
- `--filter=package-name` - Specific package
- `--filter="@scope/*"` - All packages in scope
- `--filter=!package-name` - Exclude package
- `--filter=./apps/*` - Path-based filter

### Parallel Execution

Run tasks concurrently:

```bash
# Parallel execution (default for independent tasks)
turbo run build

# Force parallel
turbo run build --parallel

# Force sequential
turbo run build --concurrency=1
```

**Continue on error:**
```bash
# Continue even if some packages fail
turbo run test --continue
```

### Common Commands

From root `package.json`:

```bash
# Build all packages
pnpm build

# Start all dev servers
pnpm dev

# Lint all packages
pnpm lint
pnpm lint:fix

# Type check all packages
pnpm typecheck

# Test all packages
pnpm test
pnpm test:unit
pnpm test:integration
pnpm test:e2e
```

## pnpm Workspaces

Monorepo package management with workspace protocol.

### Purpose

pnpm Workspaces provide:
- **Workspace Protocol:** Link internal packages
- **Dependency Hoisting:** Share common dependencies
- **Efficient Storage:** Content-addressable storage
- **Fast Installs:** Parallel installation
- **Strict Mode:** Prevents phantom dependencies

### Configuration

Located in `pnpm-workspace.yaml`:

```yaml
packages:
  - apps/*
  - tooling/*
  - plugins/*
  - plugins/**/*
  - services/*
  - services/*/*
  - packages/*
  - packages/*/*
  - packages/*/*/*

exclude:
  - '_backup/**'
```

**Pattern explanation:**
- `apps/*` - All apps in `/apps`
- `packages/*/*` - Nested packages (e.g., `/packages/ui/button`)
- `plugins/**/*` - All plugin levels
- `exclude` - Directories to ignore

### Workspace Protocol

Link internal dependencies with `workspace:*`:

```json
{
  "dependencies": {
    "@scala-cme/shared-ui": "workspace:*",
    "@kit/logger": "workspace:*"
  }
}
```

**Benefits:**
- Always uses local version
- No version mismatches
- Automatic linking
- Type safety across packages

**Version resolution:**
```
workspace:* → Latest local version
workspace:^1.0.0 → Semver range within workspace
workspace:~ → Workspace with version constraint
```

### Installing Dependencies

Install in specific workspace:

```bash
# Add dependency to specific package
pnpm --filter @scala-cme/client add axios

# Add dev dependency
pnpm --filter @scala-cme/client add -D @types/axios

# Add workspace dependency
pnpm --filter @scala-cme/client add @scala-cme/shared-ui@workspace:*
```

### Recursive Operations

Run commands in all workspaces:

```bash
# Install all dependencies
pnpm install

# Update all dependencies
pnpm update -r

# Run script in all workspaces
pnpm -r run build

# Run script with filter
pnpm --filter "@scala-cme/*" run test
```

### Linking

Automatic linking of workspace packages:

```
packages/
├── shared-ui/
│   └── package.json (name: @scala-cme/shared-ui)
└── client/
    └── package.json (depends on @scala-cme/shared-ui@workspace:*)

# pnpm automatically links
node_modules/
└── @scala-cme/
    └── shared-ui/ → ../../packages/shared-ui
```

**No manual linking needed!**

### Hoisting

Shared dependencies hoisted to root `node_modules`:

```
# Before hoisting
packages/client/node_modules/react
packages/server/node_modules/react

# After hoisting (pnpm does this automatically)
node_modules/react  # Shared
packages/client/node_modules/  # Package-specific only
packages/server/node_modules/  # Package-specific only
```

**Benefits:**
- Reduced disk space
- Faster installs
- Consistent versions

**pnpm is strict:** Only hoists compatible versions.

## manypkg

Workspace package.json validation and fixing.

### Purpose

manypkg ensures:
- **Version Consistency:** Same version across workspace
- **Workspace Protocol:** Correct usage of `workspace:*`
- **Valid Structure:** Proper package.json format
- **Dependency Alignment:** No version mismatches

### Commands

```bash
# Validate workspace
manypkg check

# Auto-fix issues
manypkg fix
```

**Integrated in lint:**
```bash
pnpm lint  # Includes manypkg check
```

### What It Checks

**1. Dependency versions:**
```json
// ❌ Bad - mismatched versions
// package A
{"dependencies": {"react": "18.3.0"}}

// package B
{"dependencies": {"react": "18.2.0"}}

// ✅ Good - consistent versions
// Both packages
{"dependencies": {"react": "18.3.0"}}
```

**2. Workspace protocol:**
```json
// ❌ Bad - missing workspace protocol
{"dependencies": {"@scala-cme/shared-ui": "1.0.0"}}

// ✅ Good - using workspace protocol
{"dependencies": {"@scala-cme/shared-ui": "workspace:*"}}
```

**3. Package.json structure:**
```json
// ❌ Bad - missing required fields
{"name": "@scala-cme/client"}

// ✅ Good - complete fields
{
  "name": "@scala-cme/client",
  "version": "1.0.0",
  "private": true
}
```

### Common Issues

**Issue: Mismatched versions**
```
Error: Different versions of "react" in workspace
  @scala-cme/client: 18.3.0
  @scala-cme/server: 18.2.0
```

**Solution:**
```bash
manypkg fix
```

**Issue: Missing workspace protocol**
```
Warning: Internal dependency should use workspace protocol
  @scala-cme/client depends on @scala-cme/shared-ui: "1.0.0"
```

**Solution:**
```bash
# Auto-fix with manypkg
manypkg fix

# Or manual fix in package.json
"@scala-cme/shared-ui": "workspace:*"
```

## Worktree Setup

Multi-branch development with isolated environments.

### Purpose

Worktrees allow working on multiple branches simultaneously:
- Independent development environments
- No branch switching needed
- Unique ports per worktree
- Isolated dependencies

### Creating Worktrees

```bash
# Create worktree for feature branch
git worktree add ../project-feature-branch feature-branch

# Create worktree for new branch
git worktree add ../project-hotfix hotfix/critical-bug

# List worktrees
git worktree list
```

### Port Auto-Assignment

`pnpm setup:env` assigns unique ports per worktree:

```bash
# Main repository
cd /path/to/project
pnpm setup:env  # Gets ports 8080, 3000, 6006

# Worktree 1
cd /path/to/project-feature
pnpm setup:env  # Gets ports 8081, 3001, 6007

# Worktree 2
cd /path/to/project-hotfix
pnpm setup:env  # Gets ports 8082, 3002, 6008
```

**No port conflicts!**

### Environment Isolation

Each worktree has own `.env`:

```
main/.env              # Main branch config
feature/.env           # Feature branch config
hotfix/.env            # Hotfix branch config
```

### Benefits

- **Parallel Development:** Work on multiple features simultaneously
- **Easy Comparison:** Run both versions side-by-side
- **Quick Testing:** Test hotfix while developing feature
- **No Context Switching:** No branch switching overhead

### Worktree Workflow

```bash
# Day 1: Feature development
cd ~/project-feature
pnpm dev  # Port 8081

# Day 1 (later): Urgent hotfix needed
cd ~/project-main
git worktree add ../project-hotfix main
cd ../project-hotfix
pnpm setup:env  # Port 8082
pnpm dev  # Hotfix server on 8082

# Both running simultaneously!
# Feature: http://localhost:8081
# Hotfix: http://localhost:8082

# Complete hotfix
git commit -m "fix: critical bug"
git push
gh pr create

# Return to feature development
cd ~/project-feature
# Still running on 8081, no setup needed
```

## Package Naming Conventions

Standard naming patterns for monorepo packages.

From AGENTS.md:

### Apps

```
@scala-cme/[app-name]
```

**Examples:**
- `@scala-cme/client` - Client application
- `@scala-cme/server` - Server application
- `@scala-cme/admin` - Admin panel
- `@scala-cme/storybook` - Storybook app

### Packages

```
@scala-cme/[package-name]
```

**Examples:**
- `@scala-cme/shared-ui` - UI components
- `@scala-cme/shared-redux` - Redux logic
- `@scala-cme/data-export` - Export utilities
- `@scala-cme/navigation-ui` - Navigation components

### Tooling

```
@kit/[tool-name]
```

**Examples:**
- `@kit/logger` - Logging library
- `@kit/testing` - Test configuration
- `@kit/eslint-config` - ESLint presets
- `@kit/env-loader` - Environment management

## Monorepo Structure

Directory organization and purpose.

```
/
├── apps/                  # Executable applications
│   ├── client/            # Client SPA
│   ├── server/            # Express API server
│   └── storybook/         # Component library
│
├── packages/              # Shared libraries
│   ├── shared-ui/         # UI components
│   ├── shared-redux/      # Redux logic
│   └── navigation-ui/     # Navigation components
│
├── tooling/               # Shared configuration and tools
│   ├── brain-monitor/     # Validation orchestrator
│   ├── logger/            # Logging library
│   ├── testing/           # Test configuration
│   ├── eslint/            # ESLint presets
│   └── prettier/          # Prettier config
│
├── plugins/               # Plugin packages
│   ├── displays/          # Display plugins
│   └── flight-boards/     # Flight board plugins
│
├── services/              # External services
│   └── cm-swagger/        # Swagger documentation
│
├── scripts/               # Utility scripts
│   └── setup-env.ts       # Environment setup
│
├── _errors/               # Validation reports (brain-monitor)
│   ├── validation-summary.md
│   └── reports/
│
├── _logs/                 # Development logs (brain-monitor)
│   ├── server.log
│   ├── client.log
│   └── index.md
│
├── turbo.json             # Turbo configuration
├── pnpm-workspace.yaml    # Workspace definition
└── package.json           # Root package.json
```

## Common Workflows

Monorepo operations and patterns.

### Adding Dependency to Specific Package

```bash
# Navigate to package (optional)
cd packages/shared-ui

# Add dependency
pnpm add axios

# Or from root with filter
pnpm --filter @scala-cme/shared-ui add axios
```

### Running Command in All Packages

```bash
# All packages
pnpm -r run build

# Filtered packages
pnpm --filter "@scala-cme/*" run test
```

### Building Specific Package

```bash
# With dependencies
turbo run build --filter=@scala-cme/client

# Without dependencies
pnpm --filter @scala-cme/client run build
```

### Running Tests in Specific Package

```bash
# Unit tests
turbo run test:unit --filter=@scala-cme/shared-ui

# Integration tests
turbo run test:integration --filter=@scala-cme/server

# All tests
turbo run test --filter=@scala-cme/client
```

### Cleaning All node_modules

```bash
# Clean all workspaces
pnpm clean:workspaces

# Reinstall
pnpm install
```

### Updating All Dependencies

```bash
# Update all packages
pnpm update -r

# Update specific dependency everywhere
pnpm update -r react

# Check for outdated
pnpm outdated -r
```

## Best Practices

### Use Workspace Protocol for Internal Dependencies

```json
// ✅ Good
{
  "dependencies": {
    "@scala-cme/shared-ui": "workspace:*"
  }
}

// ❌ Bad
{
  "dependencies": {
    "@scala-cme/shared-ui": "1.0.0"
  }
}
```

### Run manypkg Check Before Committing

```bash
# Part of lint command
pnpm lint

# Or directly
manypkg check
```

### Use Turbo for Task Orchestration

```bash
# ✅ Good - uses Turbo caching
pnpm build

// ❌ Bad - no caching
pnpm -r run build
```

### Leverage Caching for Faster Builds

```bash
# First run: slow (no cache)
pnpm build

# Second run: fast (cached)
pnpm build

# Force rebuild if needed
pnpm build --force
```

### Use Filters to Work on Specific Packages

```bash
# Develop specific feature
turbo run dev --filter=@scala-cme/client --filter=@scala-cme/server

# Test specific package
turbo run test --filter=@scala-cme/shared-ui
```

### Keep package.json Files Consistent

Use generators and manypkg:

```bash
# Generate new package (consistent structure)
pnpm gen:library

# Validate consistency
manypkg check

# Fix issues
manypkg fix
```

### Document Cross-Package Dependencies

In package README.md:

```markdown
## Dependencies

This package depends on:
- `@scala-cme/shared-ui` - UI components
- `@kit/logger` - Logging utilities

## Dependents

Used by:
- `@scala-cme/client` - Client application
- `@scala-cme/admin` - Admin panel
```

## Related Documentation

- [Quick Reference](/docs/guides/developer-tools/quick-reference.md) - Monorepo command reference
- [Development Workflows](/docs/guides/developer-tools/development-workflow.md) - Multi-package workflows
- [Code Generation](/docs/guides/developer-tools/code-generation.md) - Package generator
- [Environment Management](/docs/guides/developer-tools/environment-management.md) - Worktree environment setup
- [Troubleshooting](/docs/guides/developer-tools/troubleshooting.md) - Monorepo troubleshooting
- [AGENTS.md](/AGENTS.md) - Package naming conventions and structure
