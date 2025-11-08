# Using This Monorepo as a Template

This monorepo is designed to be used as a reusable template for new projects. This guide walks you through customizing it for your specific needs.

## Quick Start

```bash
# 1. Clone this template
git clone <this-repo> my-project
cd my-project

# 2. Customize (see sections below)
# - Update app names
# - Update package names
# - Update documentation

# 3. Initialize
pnpm install
pnpm validate

# 4. Start developing
pnpm dev
```

## Step 1: Rename Your Project

### Update Root package.json

**File:** `package.json`

```json
{
  "name": "@your-organization/your-monorepo-name",
  "version": "1.0.0",
  // ... rest of file
}
```

**Current value:** `"name": "scheduling-station"`
**Change to:** `"name": "@your-org/your-project"`

### Update Package Manager Requirement (Optional)

```json
{
  "packageManager": "pnpm@9.0.0"
}
```

Update the version if you're using a different pnpm version.

## Step 2: Generate Your Applications

This template starts empty - you populate it by running the generators to create the applications you need.

### Generate Backend API

```bash
pnpm gen:express-api
# → Prompts for name, database, auth, etc.
# → Creates apps/[your-name] with complete Express setup
# → Includes Prisma, Zod validation, JWT auth
# → Adds sample tests (unit, integration, e2e)
```

### Generate React Web App

```bash
pnpm gen:react-web
# → Prompts for name, UI library, state management, etc.
# → Creates apps/[your-name] with Vite + React setup
# → Includes routing, UI components, and testing
```

### Generate React Native Mobile App

```bash
pnpm gen:react-native
# → Prompts for template, UI library, etc.
# → Creates apps/[your-name] with Expo setup
# → Includes Expo Router and cross-platform support
```

### Generate Electron Desktop App

```bash
pnpm gen:electron
# → Prompts for UI, auto-updater, etc.
# → Creates apps/[your-name] with Electron setup
# → Includes IPC, native capabilities, and auto-updates
```

**All generators automatically:**
- Configure `@kit/testing` integration with centralized configs
- Add proper test scripts (unit, integration, e2e)
- Create sample test files for each test type
- Set up ESLint, Prettier, and TypeScript
- Add `@kit/logger` for structured logging
- Configure `@kit/env-loader` for environment variables

## Step 3: Update Documentation

### Root README.md

**File:** `README.md`

Update:
1. Project title and description
2. Architecture section with your structure
3. Package list (see "Step 4" below)
4. Any project-specific instructions

**Example:**
```markdown
# Your Project Name

Your project description here.

## Packages

| Package | Description |
|---------|-------------|
| [@your-org/your-app](./apps/your-app) | Your app description |
| [@your-org/shared-lib](./packages/shared-lib) | Shared library |

## Getting Started

[Your setup instructions]
```

### Update CHANGELOG.md

**File:** `CHANGELOG.md`

Replace with your project's change history:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Initial project setup

## [1.0.0] - 2025-10-22

### Added
- Project initialized from template
```

### Create PROJECT_README.md (Optional)

Document your specific setup:

```markdown
# Your Project

## Architecture

[Your architecture explanation]

## Development

[Your development setup]

## Deployment

[Your deployment process]
```

## Step 4: Set Up Shared Packages

The `/packages` directory is for shared libraries used across apps.

### Create Your First Package

```bash
# Create a new shared package
mkdir -p packages/your-lib

# Copy template
cp -r tooling/env-loader packages/your-lib

# Update package.json
vim packages/your-lib/package.json
```

**Update package.json:**

```json
{
  "name": "@your-org/your-lib",
  // Change from: "@kit/..."
  "description": "Your library description",
  "version": "1.0.0"
}
```

**Update tsconfig.json:**

```json
{
  "extends": "../../tsconfig.base.json"
  // Make sure path is relative to your package
}
```

### Update Workspace Configuration

**File:** `pnpm-workspace.yaml`

Already configured correctly:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tooling/*'
```

No changes needed unless you change directory structure.

## Step 5: Customize Tooling

The `/tooling` directory has shared configurations. You may want to customize them:

### ESLint Configuration

**Directory:** `tooling/eslint/`

Customize rules for your project:
- Disable rules you don't need
- Add new rules specific to your project
- Update naming conventions to match your style

**File:** `tooling/eslint/src/index.ts`

### Prettier Configuration

**Directory:** `tooling/prettier/`

Customize formatting rules:
- Line length
- Quote style
- Tab width
- Etc.

**File:** `tooling/prettier/src/index.ts`

### TypeScript Configuration

**Directory:** `tooling/typescript/`

Customize TypeScript rules:
- Strict mode (already enabled)
- Module resolution
- Target runtime version
- Etc.

**File:** `tooling/typescript/src/tsconfig.json`

### Brain-Monitor

**Directory:** `tooling/brain-monitor/`

Customize validation:
- Validation frequency
- Report format
- Error categories
- Log retention

## Step 6: Update Environment Configuration

### .env.example

**File:** `.env.example`

Add your environment variables:

```env
# Current
PORT=8080
NODE_ENV=development

# Add yours
DATABASE_URL=postgres://...
API_KEY=your_api_key_here
# etc.
```

### .env (Not Tracked)

Create `.env` in your local environment:

```bash
cp .env.example .env
# Edit .env with your local values
# This file is in .gitignore and won't be tracked
```

## Step 7: Verify Your Setup

Run the complete validation:

```bash
# Install dependencies
pnpm install

# Run all validations
pnpm validate

# Check the summary
cat _errors/validation-summary.md

# Try starting the app
pnpm dev

# In another terminal, test it
curl http://localhost:8080/health
```

## Step 8: Set Up Git

Initialize your repository:

```bash
# If not already a git repo
git init

# Add all files
git add .

# Create initial commit
git commit -m "chore: initialize monorepo from template"

# Add your remote
git remote add origin https://github.com/your-org/your-repo.git

# Push
git branch -M main
git push -u origin main
```

## Common Customization Patterns

### Adding a New App

```bash
# Create new app directory
mkdir -p apps/my-new-app/src

# Copy package.json template
cat > apps/my-new-app/package.json << 'EOF'
{
  "name": "@your-org/my-new-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc --project tsconfig.build.json",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@kit/env-loader": "workspace:*",
    "@kit/logger": "workspace:*"
  },
  "devDependencies": {
    "@kit/eslint-config": "workspace:*",
    "@kit/prettier-config": "workspace:*",
    "@kit/testing": "workspace:*",
    "@kit/tsconfig": "workspace:*"
  }
}
EOF

# Create tsconfig.json
cat > apps/my-new-app/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"],
  "exclude": ["node_modules"]
}
EOF

# Create main entry
mkdir -p apps/my-new-app/src
touch apps/my-new-app/src/main.ts
```

### Adding a New Package

```bash
# Create package directory
mkdir -p packages/my-lib/src

# Copy package.json template
cat > packages/my-lib/package.json << 'EOF'
{
  "name": "@your-org/my-lib",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./*": "./src/*.ts"
  },
  "main": "./src/index.ts",
  "files": ["src"],
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "devDependencies": {
    "@kit/eslint-config": "workspace:*",
    "@kit/prettier-config": "workspace:*",
    "@kit/testing": "workspace:*",
    "@kit/tsconfig": "workspace:*"
  }
}
EOF

# Create tsconfig.json
cat > packages/my-lib/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"],
  "exclude": ["node_modules"]
}
EOF

# Create index
touch packages/my-lib/src/index.ts
```

## Customization Checklist

- [ ] Update root `package.json` name
- [ ] Generate your applications using the generators (Step 2)
- [ ] Update app `package.json` names if needed
- [ ] Update root `README.md`
- [ ] Update `CHANGELOG.md`
- [ ] Update `.env.example` with your environment variables
- [ ] Create `.env` with your values
- [ ] Run `pnpm install`
- [ ] Run `pnpm validate` (should be clean)
- [ ] Test `pnpm dev` (should start)
- [ ] Initialize git and push
- [ ] Start building your features!

## Template Features You Get

✅ **Foundation**
- ESM-only configuration
- No-build library pattern
- Functional programming style
- Monorepo with apps, packages, and tooling

✅ **Development**
- TypeScript 5.7+ with strict mode
- ESLint configuration with best practices
- Prettier code formatting
- Vitest for unit, integration, and E2E tests

✅ **Validation**
- Brain-monitor for error reporting
- Turbo for task orchestration
- Automated validation pipeline
- Real-time log monitoring

✅ **Tooling**
- Environment variable loading
- Structured logging
- Common configuration packages
- Testing utilities

✅ **Documentation**
- Architecture guidelines
- Development guides
- Contribution guidelines
- Template customization guide (this document!)

## Environment Variable Management

**This template uses a consolidated approach to environment variables:**

- **Single .env file:** All environment variables live in the monorepo root `.env` file
- **Centralized loading:** Apps use `@kit/env-loader` to access variables
- **No individual .env files:** This prevents duplication and ensures consistency

**Important:** All packages that need environment variables should use `@kit/env-loader`, and all packages should use `@kit/logger` for structured logging. These are the standard tooling packages for environment management and logging across the monorepo.

## Getting Help

**See also:**
- `/docs/guides/validation-workflow.md` - How to use validation
- `/docs/guides/monorepo-structure.md` - Structure explanation
- `/docs/guides/adding-new-packages.md` - Creating packages
- `/docs/guides/adding-new-apps.md` - Creating apps
- `README.md` - Quick reference

**Common commands:**
```bash
pnpm install              # Install dependencies
pnpm dev                  # Start development
pnpm validate             # Check for issues
pnpm test                 # Run tests
pnpm lint                 # Check code style
pnpm format --fix         # Auto-fix formatting
pnpm clean                # Clean build artifacts
```

---

**Ready to start?** Follow the checklist above and you'll be up and running in minutes!
