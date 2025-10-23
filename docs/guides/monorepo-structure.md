# Monorepo Structure Guide

This guide explains the directory structure and philosophy behind this monorepo template.

## Directory Layout

```
project/
├── apps/                   # 🚀 Executable applications
├── packages/               # 📦 Shared libraries
├── tooling/                # 🔧 Shared configurations
├── docs/                   # 📖 Documentation
├── _errors/                # ⚠️  Validation reports
├── _logs/                  # 📋 Server logs
├── package.json            # Root workspace configuration
├── pnpm-workspace.yaml     # pnpm workspace definition
├── turbo.json              # Turborepo pipeline
├── tsconfig.base.json      # Shared TypeScript config
└── README.md               # Project overview
```

## Core Directories

### /apps - Applications

**Purpose:** Executable applications that can be run as standalone services.

**Characteristics:**
- Can have a `build` script that produces `dist/`
- Can be deployed independently
- Have their own `main.ts` or `index.ts` entry point
- Depend on packages and tooling but not on other apps

**Examples:**
```
apps/
├── api/                    # Express.js backend API
├── web/                    # React web application (Vite)
├── mobile/                 # React Native mobile app (Expo)
└── desktop/                # Electron desktop app
```

**Package Naming:**
- Located at: `apps/app-name/`
- Package name: `@your-org/app-name`
- Example: `@starter/api`, `@starter/web`, `@starter/mobile`

**When to create an app:**
- You need a runnable service
- You want to deploy it separately
- It has its own environment variables and configuration

### /packages - Shared Libraries

**Purpose:** Reusable code shared across multiple applications.

**Characteristics:**
- **No build step** - exports TypeScript source directly
- Multiple apps can depend on the same package
- Have clear, focused responsibility
- Should be independently versioned
- Exported via `src/index.ts` barrel file

**Examples:**
```
packages/
├── auth/                   # Authentication logic
├── database/               # Database connectivity
├── ui-components/          # Reusable React components
└── validation/             # Validation schemas
```

**Package Naming:**
- Located at: `packages/package-name/`
- Package name: `@your-org/package-name`
- Example: `@scheduling-station/auth`

**When to create a package:**
- Code is used by 2+ apps
- It's logically separate from any single app
- You want to independently version it
- It's a shared utility or library

**Key Rule:** No build step for libraries!

```json
{
  "name": "@your-org/package-name",
  "exports": {
    ".": "./src/index.ts",
    "./*": "./src/*.ts"
  },
  "main": "./src/index.ts",
  "files": ["src"]
}
```

### /tooling - Shared Configuration

**Purpose:** Centralized tooling and configurations used across all apps and packages.

**Characteristics:**
- Shared by all workspaces
- Provides ESLint, Prettier, TypeScript, Testing configs
- Reduces configuration duplication
- Updated in one place, used everywhere

**Examples:**
```
tooling/
├── eslint/                 # ESLint configuration
├── prettier/               # Prettier configuration
├── typescript/             # TypeScript configuration
├── testing/                # Testing utilities
├── brain-monitor/          # Validation orchestration
├── env-loader/             # Environment variable loading
└── logger/                 # Structured logging
```

**All tooling packages are @kit scoped:**
- `@kit/eslint-config`
- `@kit/prettier-config`
- `@kit/tsconfig`
- `@kit/testing`
- etc.

**Usage:**
Every app and package extends tooling configs:

```json
{
  "extends": "@kit/eslint-config/base",
  "prettier": "@kit/prettier-config",
  "eslintConfig": {
    "extends": ["@kit/eslint-config/base"]
  }
}
```

### /docs - Documentation

**Purpose:** Project documentation and guides.

**Structure:**
```
docs/
├── README.md               # Documentation index
├── architecture/           # System architecture
│   └── adr/               # Architecture Decision Records
├── features/              # Feature documentation
├── guides/                # How-to guides
└── TEMPLATE_USAGE.md      # How to use as template (if template)
```

**Content:**
- Architecture decisions
- Feature specifications
- Development guides
- API documentation
- Setup instructions

### /_errors - Validation Reports

**Purpose:** Real-time validation failure reports from brain-monitor.

**Contents:**
- `validation-summary.md` - Overall status
- `reports/` - Detailed error reports
  - `errors.typecheck-failures.md`
  - `errors.lint-failures.md`
  - `errors.test-failures-unit.md`
  - etc.

**Auto-generated** - Don't edit these files manually.

### /_logs - Server Logs

**Purpose:** Aggregated logs from running servers and processes.

**Contents:**
- `[app-name].log` - Application logs
- `index.md` - Log index

**Auto-generated** - Referenced by monitoring tools.

---

## Naming Conventions

### App Names

**Pattern:** `apps/[app-name]/`
**Package Name:** `@your-org/[app-name]`

Examples:
- Directory: `apps/api/` → Name: `@acme/api`
- Directory: `apps/web-frontend/` → Name: `@acme/web-frontend`

**Rules:**
- Use kebab-case for directory names
- Keep names descriptive but concise
- No abbreviations unless universally understood

### Package Names

**Pattern:** `packages/[package-name]/`
**Package Name:** `@your-org/[package-name]`

Examples:
- Directory: `packages/auth/` → Name: `@acme/auth`
- Directory: `packages/ui-components/` → Name: `@acme/ui-components`

**Rules:**
- Use kebab-case for directory names
- Start with app prefix if app-specific
- Example: `@acme/api/users` for users package under api

### Tooling Names

**Pattern:** `tooling/[tool-name]/`
**Package Name:** `@kit/[tool-name]`

Examples:
- Directory: `tooling/eslint/` → Name: `@kit/eslint-config`
- Directory: `tooling/testing/` → Name: `@kit/testing`

**Rules:**
- Always scoped to `@kit`
- Descriptive names
- Include tool type in name

---

## Package Dependencies

### Dependency Rules

**Apps can depend on:**
- ✅ Packages in `/packages/`
- ✅ Tooling in `/tooling/`
- ❌ Other apps

**Packages can depend on:**
- ✅ Other packages in `/packages/`
- ✅ Tooling in `/tooling/`
- ❌ Apps in `/apps/`
- ❌ Framework-specific packages

**Tooling should:**
- ✅ Be framework-agnostic
- ✅ Provide reusable configurations
- ✅ Have minimal external dependencies
- ❌ Not depend on apps or packages

### Workspace Resolution

Dependencies use `workspace:*` protocol:

```json
{
  "dependencies": {
    "@kit/logger": "workspace:*",
    "@acme/auth": "workspace:*"
  }
}
```

This means:
- Use the local version from the workspace
- Automatically installed with `pnpm install`
- No need to publish to npm for local development

---

## File Organization Within Packages

### Standard Package Structure

```
packages/auth/
├── src/
│   ├── index.ts               # Main export barrel
│   ├── auth.service.ts        # Business logic
│   ├── auth.types.ts          # TypeScript types
│   └── auth.test.ts           # Tests
├── package.json               # Package metadata
├── tsconfig.json              # TypeScript config
├── README.md                  # Package documentation
└── CHANGELOG.md               # Version history
```

### Standard App Structure

```
apps/api/
├── src/
│   ├── main.ts                # Entry point
│   ├── modules/               # Feature modules
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repo.ts
│   │   │   └── users.types.ts
│   │   └── posts/
│   ├── shared/                # App-internal shared code
│   │   ├── middleware/
│   │   ├── errors/
│   │   └── validation/
│   └── infra/                 # Infrastructure setup
│       ├── http/
│       │   ├── server.ts
│       │   └── routes.ts
│       └── db/
│           └── client.ts
├── dist/                      # Built output (generated)
├── package.json               # App metadata
├── tsconfig.json              # TypeScript config
├── tsconfig.build.json        # Build-specific config
├── vitest.config.ts           # Test configuration
└── README.md                  # App documentation
```

---

## Configuration Hierarchy

### TypeScript Configuration

```
tsconfig.base.json (root)
    ↓ extended by
tsconfig.json (app or package)
    ↓ extended by
tsconfig.build.json (app-specific, optional)
```

**Root config:**
- Base compiler options
- Path aliases for all workspaces
- Shared strict settings

**Workspace config:**
- Includes/excludes
- Workspace-specific paths

### ESLint Configuration

```
tooling/eslint/ (central)
    ↓ used by
eslintConfig in each package.json
```

All workspaces extend the same ESLint config.

### Prettier Configuration

```
tooling/prettier/ (central)
    ↓ used by
prettier field in each package.json
```

All workspaces use the same formatting rules.

---

## The "No Build" Pattern

This monorepo uses a unique pattern for **libraries in `/packages/`**:

**Traditional approach:**
```
src/index.ts  →  [build step]  →  dist/index.js  ←  imported by apps
```

**This monorepo's approach:**
```
src/index.ts  ←  [no build!]  ←  imported directly by apps
```

### Benefits

- ✅ **Instant updates** - Changes visible immediately without rebuild
- ✅ **Simple debugging** - Debug directly in source TypeScript
- ✅ **No build complexity** - Skip the build step entirely
- ✅ **Faster development** - No waiting for builds

### How It Works

1. **Package exports TypeScript source:**
   ```json
   {
     "exports": {
       ".": "./src/index.ts"
     },
     "main": "./src/index.ts",
     "files": ["src"]
   }
   ```

2. **Consuming app/package imports the source:**
   ```typescript
   import { createLogger } from '@kit/logger';
   // Actually imports: node_modules/@kit/logger/src/index.ts
   ```

3. **Runtime transpiler (tsx/esbuild) handles TypeScript:**
   ```bash
   # Apps use tsx for development
   pnpm dev
   ```

### Only Apps Build

Apps CAN have a build step that produces `dist/`:

```json
{
  "scripts": {
    "build": "tsc --project tsconfig.build.json",
    "start": "node dist/main.js"
  }
}
```

But libraries in `/packages/` do NOT build.

---

## Turbo Pipeline

Turborepo orchestrates tasks across the monorepo.

### Task Configuration

**File:** `turbo.json`

```json
{
  "pipeline": {
    "lint": {
      "cache": true
    },
    "typecheck": {
      "cache": true
    },
    "test": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Running Tasks

```bash
# Run task in all workspaces
pnpm lint                  # Same as: turbo run lint

# Run with watch mode
pnpm dev                   # turbo run dev

# Run specific workspace
pnpm --filter=@kit/logger lint
```

---

## Brain-Monitor Integration

The monorepo uses brain-monitor for validation coordination.

**Directories:**
- `_errors/` - Validation reports
- `_logs/` - Server logs

**Reports include:**
- TypeScript errors
- Lint violations
- Test failures
- Format issues

**Accessed via:**
```bash
pnpm brain:validate        # Generate all reports
pnpm monitor:errors        # View error summary
cat _errors/validation-summary.md
```

---

## Key Concepts

### ESM-Only

This monorepo uses **ES Modules exclusively**:
- No CommonJS (`require`, `module.exports`)
- All files have `"type": "module"` in package.json
- Top-level `await` is allowed
- Modern JavaScript everywhere

### Functional Programming

Code follows functional patterns:
- No classes (except where frameworks require)
- Pure functions where possible
- Dependency injection via parameters
- Immutable data structures

### Strict TypeScript

TypeScript is configured with strict mode:
- `strict: true`
- `noImplicitAny: true`
- `exactOptionalPropertyTypes: true`
- All types must be explicit

---

## Workspace Commands

Common commands to manage the monorepo:

```bash
# Install all dependencies
pnpm install

# Run all validations
pnpm validate

# Start all apps in development mode
pnpm dev

# Run tests across monorepo
pnpm test

# Run specific workspace task
pnpm --filter=@kit/logger lint

# Run tasks that depend on a workspace
pnpm --filter=@acme/api build

# Clean all build artifacts
pnpm clean
```

---

## Architecture Overview

### Dependency Graph

```
apps/api
  ├── @kit/env-loader
  ├── @kit/logger
  └── @acme/auth (from packages/)

apps/web
  ├── @kit/env-loader
  ├── @kit/logger
  └── @acme/ui (from packages/)

packages/auth
  ├── @kit/env-loader
  └── @kit/logger

packages/ui
  ├── @kit/testing

tooling/*
  ├── Provides configs
  └── No dependencies on apps/packages
```

### Data Flow

```
User Code (apps/)
    ↓
Business Logic (packages/)
    ↓
Shared Utilities (@kit/*)
    ↓
External Libraries
```

---

## Summary

This structure provides:

✅ **Clear separation** of concerns
✅ **Reusable** code via packages
✅ **Shared** configurations via tooling
✅ **Scalable** monorepo that grows with your project
✅ **Simple** development workflow
✅ **Fast** validation and testing

**Follow the patterns**, keep apps focused, and create packages for reusable code.

---

See also:
- `/docs/TEMPLATE_USAGE.md` - How to customize the template
- `/docs/guides/adding-new-packages.md` - Creating packages
- `/docs/guides/adding-new-apps.md` - Creating apps
- `/docs/guides/validation-workflow.md` - Using validation tools
