---
title: "Environment Management"
description: "Guide to environment configuration and setup tools in CME"
keywords: [environment, configuration, env-loader, setup, dotenv, environment-variables]
last_updated: "2025-01-22"
---

# Environment Management

Guide to environment configuration and setup tools in the Content Manager Express monorepo.

## Overview

Proper environment management ensures applications run consistently across development, testing, and production environments. CME provides @kit/env-loader for centralized environment variable management and setup-env script for automatic configuration.

## @kit/env-loader

Centralized environment variable loading and validation.

### Purpose

@kit/env-loader provides:
- **Centralized Loading:** Single source for environment variables
- **Loading Order:** monorepo root → app → process.env
- **Validation:** Required variable enforcement
- **Type Safety:** TypeScript support
- **Browser Support:** Automatic VITE_ prefix handling
- **Error Handling:** Clear error messages

### Loading Order

Environment variables are loaded in this order (later overrides earlier):

1. **Monorepo root `.env`** - Shared variables
2. **App-specific `.env`** - App overrides
3. **process.env** - System environment variables

**Example:**
```
# Root .env
LOG_LEVEL=info
API_URL=http://localhost:8080

# apps/server/.env
LOG_LEVEL=debug  # Overrides root
DB_HOST=localhost  # App-specific
```

### Node.js Usage

```typescript
import {loadEnvironment, requireEnv} from '@kit/env-loader/node';

// Load environment variables
const result = loadEnvironment({
  appName: 'server',
  required: ['DATABASE_URL', 'JWT_SECRET'],
});

// Check if loaded successfully
if (!result.success) {
  console.error('Missing required environment variables:', result.missing);
  process.exit(1);
}

// Access required variables
const dbUrl = requireEnv('DATABASE_URL');
const jwtSecret = requireEnv('JWT_SECRET');

// Access optional variables
const port = process.env.PORT || '3000';
```

**loadEnvironment options:**

```typescript
interface LoadEnvironmentOptions {
  appName?: string;        // App name for app-specific .env
  required?: string[];     // Required variable names
  rootDir?: string;        // Custom root directory
}
```

**requireEnv function:**

```typescript
// Throws error if variable not set
const dbUrl = requireEnv('DATABASE_URL');

// With default value
const port = process.env.PORT || '3000';
```

### Browser Usage

Browser environment variables must be prefixed with `VITE_`:

```typescript
import {getEnv} from '@kit/env-loader/browser';

// Get environment variable with default
const apiUrl = getEnv('VITE_API_URL', 'http://localhost:8080');
const logLevel = getEnv('VITE_LOG_LEVEL', 'info');

// Required variable (throws if not set)
const apiKey = getEnv('VITE_API_KEY');
```

**Important:** Only variables prefixed with `VITE_` are accessible in the browser.

**Example .env:**
```bash
# Server-side (no prefix needed)
DATABASE_URL=postgresql://localhost:5432/db
JWT_SECRET=secret123

# Browser-side (VITE_ prefix required)
VITE_API_URL=http://localhost:8080
VITE_LOG_LEVEL=debug
VITE_FEATURE_FLAGS={"newUI":true}
```

### Required Variables

Specify required variables for validation:

```typescript
const result = loadEnvironment({
  appName: 'server',
  required: [
    'DATABASE_URL',
    'JWT_SECRET',
    'REDIS_URL',
    'SMTP_HOST',
  ],
});

if (!result.success) {
  console.error('Missing required variables:');
  result.missing.forEach((varName) => {
    console.error(`  - ${varName}`);
  });
  process.exit(1);
}
```

**Benefits:**
- Fail fast on missing configuration
- Clear error messages
- Prevents runtime errors
- Documents required configuration

### Error Handling

@kit/env-loader provides clear error messages:

```typescript
// Missing required variable
Error: Required environment variable DATABASE_URL is not set

// Browser variable without VITE_ prefix
Warning: Browser environment variable API_URL should be prefixed with VITE_
Use VITE_API_URL instead

// Invalid .env file
Error: Failed to parse .env file: Invalid format at line 15
```

### Detailed Documentation

For complete @kit/env-loader documentation, see: [/tooling/env-loader/README.md](/tooling/env-loader/README.md)

## setup-env Script

Automatic port assignment and .env generation for worktrees.

### Purpose

setup-env script provides:
- **Automatic Port Assignment:** Unique ports per worktree
- **.env Generation:** Creates .env files for each app
- **Worktree Support:** Prevents port conflicts across branches
- **Zero Configuration:** Works out of the box

### Location

`/scripts/setup-env.ts`

### When to Run

Run setup-env after:
- **Git clone:** Fresh repository setup
- **Branch switch:** Different branches may need different ports
- **Worktree creation:** Each worktree needs unique ports
- **Port conflicts:** Resolve conflicts automatically

### Command

```bash
pnpm setup:env
```

### What It Does

**1. Detects Worktree**

Determines if running in a git worktree:
```
Main repository: /Users/dev/project
Worktree: /Users/dev/project-worktrees/feature-branch
```

**2. Assigns Unique Ports**

Each worktree gets unique port range:

| Worktree | Server Port | Client Port | Storybook Port |
|----------|-------------|-------------|----------------|
| Main | 8080 | 3000 | 6006 |
| Worktree 1 | 8081 | 3001 | 6007 |
| Worktree 2 | 8082 | 3002 | 6008 |

**3. Generates .env Files**

Creates .env file for each app:

```bash
# apps/server/.env
PORT=8080
CLIENT_URL=http://localhost:3000

# apps/client/.env
VITE_API_URL=http://localhost:8080
VITE_PORT=3000
```

**4. Updates Configuration**

Updates relevant config files:
- Vite config (client port)
- Express config (server port)
- Storybook config (storybook port)

### Worktree Support

Worktrees allow multiple branches to be checked out simultaneously:

```bash
# Create worktree for feature branch
git worktree add ../project-feature-branch feature-branch

# Enter worktree
cd ../project-feature-branch

# Setup environment (gets unique ports)
pnpm setup:env

# Start dev servers (no conflicts with main)
pnpm dev
```

**Benefits:**
- Work on multiple branches simultaneously
- No port conflicts
- Independent development environments
- Easy branch switching

### Port Allocation Strategy

Ports are allocated based on worktree hash:

```typescript
// Simplified logic
const worktreeHash = hashWorktreePath(process.cwd());
const portOffset = worktreeHash % 100; // 0-99

const ports = {
  server: 8080 + portOffset,
  client: 3000 + portOffset,
  storybook: 6006 + portOffset,
};
```

**Range allocation:**
- Server: 8080-8179
- Client: 3000-3099
- Storybook: 6006-6105

## .env.example

Environment variable template documenting all configuration.

### Purpose

.env.example serves as:
- **Documentation:** Lists all environment variables
- **Template:** Base for creating .env files
- **Reference:** Shows expected values and formats
- **Onboarding:** Helps new developers setup environment

### Location

Root `.env.example`

### Structure

```bash
# ====================
# Server Configuration
# ====================

# Server port (auto-assigned by setup-env)
PORT=8080

# Database connection string
DATABASE_URL=postgresql://user:password@localhost:5432/cme_dev

# Redis connection string
REDIS_URL=redis://localhost:6379

# ====================
# Authentication
# ====================

# JWT secret for token signing
JWT_SECRET=your-secret-key-here

# JWT expiration time
JWT_EXPIRES_IN=7d

# ====================
# Logging
# ====================

# Log level: trace | debug | info | warn | error | fatal
LOG_LEVEL=info

# Log theme: Dracula | Nord | Solarized | Gruvbox | NightOwl | Monochrome | Classic
LOG_THEME=Dracula

# ====================
# Client Configuration (Browser)
# ====================

# API URL (VITE_ prefix required for browser)
VITE_API_URL=http://localhost:8080

# Log level for browser
VITE_LOG_LEVEL=info

# Log theme for browser
VITE_LOG_THEME=Nord

# ====================
# Third-Party Services
# ====================

# Stripe API key
STRIPE_API_KEY=sk_test_...

# SendGrid API key
SENDGRID_API_KEY=SG...

# AWS credentials
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
```

### Required Variables

Document which variables are required:

```bash
# Required: Database connection
DATABASE_URL=postgresql://localhost:5432/cme_dev

# Required: Authentication secret
JWT_SECRET=your-secret-key-here

# Optional: Custom port (defaults to 8080)
# PORT=8080
```

### Default Values

Document default values in comments:

```bash
# Log level (default: info)
LOG_LEVEL=info

# JWT expiration (default: 7d)
JWT_EXPIRES_IN=7d

# Server port (default: 8080, auto-assigned by setup-env)
# PORT=8080
```

### Usage

Create local .env from example:

```bash
# Copy template
cp .env.example .env

# Edit with your values
# vim .env

# Run setup-env to auto-configure ports
pnpm setup:env

# Start development
pnpm dev
```

## Environment Variables by Context

Where to use different environment variables.

### Node.js (Server, Scripts)

Direct access via `process.env`:

```typescript
// No prefix needed
const dbUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;
const logLevel = process.env.LOG_LEVEL || 'info';
```

**Recommended:** Use `@kit/env-loader` for validation:

```typescript
import {loadEnvironment, requireEnv} from '@kit/env-loader/node';

loadEnvironment({required: ['DATABASE_URL', 'JWT_SECRET']});
const dbUrl = requireEnv('DATABASE_URL');
```

### Browser (Vite Apps)

Must use `VITE_` prefix:

```typescript
// VITE_ prefix required
const apiUrl = import.meta.env.VITE_API_URL;
const logLevel = import.meta.env.VITE_LOG_LEVEL;

// Or use @kit/env-loader
import {getEnv} from '@kit/env-loader/browser';
const apiUrl = getEnv('VITE_API_URL');
```

**Important:** Variables without `VITE_` prefix are not available in browser.

### Shared Packages

Use `@kit/env-loader` for consistency:

```typescript
// packages/shared-utils/src/config.ts
import {getEnv} from '@kit/env-loader/browser';
import {requireEnv} from '@kit/env-loader/node';

// Works in both Node.js and browser
export const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return getEnv('VITE_API_URL');
  }
  return requireEnv('API_URL');
};
```

### Testing

Use test-specific .env files:

```bash
# .env.test
DATABASE_URL=postgresql://localhost:5432/cme_test
LOG_LEVEL=error
NODE_ENV=test
```

Load in test setup:

```typescript
// vitest.config.ts
import {defineConfig} from 'vitest/config';
import {loadEnvironment} from '@kit/env-loader/node';

// Load test environment
loadEnvironment({appName: 'test'});

export default defineConfig({
  // ...
});
```

## Common Environment Variables

Reference table for standard variables.

### Application

| Variable | Values | Default | Description |
|----------|--------|---------|-------------|
| `NODE_ENV` | development, test, production | development | Environment mode |
| `PORT` | 1024-65535 | 8080 | Server port |
| `HOST` | IP address or hostname | localhost | Server host |

### Logging

| Variable | Values | Default | Description |
|----------|--------|---------|-------------|
| `LOG_LEVEL` | trace, debug, info, warn, error, fatal | info | Node.js log level |
| `LOG_THEME` | Dracula, Nord, Solarized, etc. | Classic | Node.js log theme |
| `VITE_LOG_LEVEL` | trace, debug, info, warn, error, fatal | info | Browser log level |
| `VITE_LOG_THEME` | Dracula, Nord, Solarized, etc. | Classic | Browser log theme |

### Database

| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_URL` | postgresql://localhost:5432/db | Database connection string |
| `DB_HOST` | localhost | Database host |
| `DB_PORT` | 5432 | Database port |
| `DB_NAME` | cme_dev | Database name |
| `DB_USER` | postgres | Database user |
| `DB_PASSWORD` | password | Database password |

### Authentication

| Variable | Example | Description |
|----------|---------|-------------|
| `JWT_SECRET` | secret-key-123 | JWT signing secret |
| `JWT_EXPIRES_IN` | 7d | JWT expiration time |
| `SESSION_SECRET` | session-secret | Session signing secret |

### Redis

| Variable | Example | Description |
|----------|---------|-------------|
| `REDIS_URL` | redis://localhost:6379 | Redis connection string |
| `REDIS_HOST` | localhost | Redis host |
| `REDIS_PORT` | 6379 | Redis port |

### API

| Variable | Example | Description |
|----------|---------|-------------|
| `API_URL` | http://localhost:8080 | API base URL (server) |
| `VITE_API_URL` | http://localhost:8080 | API base URL (browser) |
| `CLIENT_URL` | http://localhost:3000 | Client app URL |

### Third-Party Services

| Variable | Description |
|----------|-------------|
| `STRIPE_API_KEY` | Stripe payment API key |
| `SENDGRID_API_KEY` | SendGrid email API key |
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `AWS_REGION` | AWS region |

## Environment Setup Workflow

Step-by-step guide for environment setup.

### Step 1: Clone Repository

```bash
git clone https://github.com/org/content-manager-express.git
cd content-manager-express
```

### Step 2: Copy .env.example to .env

```bash
cp .env.example .env
```

### Step 3: Customize Values for Local Environment

Edit `.env` with your specific values:

```bash
# Database (use local instance)
DATABASE_URL=postgresql://localhost:5432/cme_dev

# JWT secret (generate random string)
JWT_SECRET=$(openssl rand -base64 32)

# API keys (from service providers)
STRIPE_API_KEY=sk_test_your_key_here
SENDGRID_API_KEY=SG.your_key_here
```

### Step 4: Run setup-env for Auto-Configuration

```bash
pnpm setup:env
```

**This auto-configures:**
- Unique ports per worktree
- App-specific .env files
- Configuration file updates

### Step 5: Verify with Dev Server

```bash
pnpm dev
```

**Check:**
- Server starts on correct port
- Client connects to API
- No environment variable errors
- Logs show correct configuration

### Complete Setup Example

```bash
# Step 1: Clone
git clone https://github.com/org/content-manager-express.git
cd content-manager-express

# Step 2: Install dependencies
pnpm install

# Step 3: Copy env template
cp .env.example .env

# Step 4: Edit .env with your values
# vim .env

# Step 5: Run setup
pnpm setup:env

# Step 6: Start development
pnpm dev

# Step 7: Verify
# → Server: http://localhost:8080
# → Client: http://localhost:3000
# → Storybook: http://localhost:6006
```

## Troubleshooting

Common environment issues and solutions.

### Missing Required Variables

**Error:**
```
Error: Required environment variable DATABASE_URL not found
```

**Solution:**
```bash
# Check .env file
cat .env

# Add missing variable
echo "DATABASE_URL=postgresql://localhost:5432/cme_dev" >> .env

# Restart application
pnpm dev
```

### Port Conflicts

**Error:**
```
Error: Port 8080 is already in use
```

**Solution:**
```bash
# Run setup-env to reassign ports
pnpm setup:env

# Or manually change port in .env
echo "PORT=8081" >> .env

# Restart application
pnpm dev
```

### VITE_ Prefix Missing

**Warning:**
```
Warning: VITE_API_URL is undefined in browser
```

**Solution:**
```bash
# Add VITE_ prefix in .env
# ❌ Wrong
API_URL=http://localhost:8080

# ✅ Correct
VITE_API_URL=http://localhost:8080

# Restart dev server
pnpm dev
```

### .env Not Loaded

**Issue:** Environment variables not being loaded.

**Solution:**
```bash
# Check file location
ls -la .env

# Ensure no trailing spaces or invalid syntax
cat .env

# Check file is named exactly ".env" (not ".env.local" or "env")
# Restart application
pnpm dev
```

### Environment Not Updated

**Issue:** Changes to .env not reflected in running application.

**Solution:**
```bash
# Stop dev servers
# Ctrl+C

# Restart dev servers
pnpm dev

# Changes should now be loaded
```

## Best Practices

### Never Commit .env Files

**.gitignore should include:**
```
.env
.env.local
.env.*.local
```

**Why:** .env files contain secrets and local configuration.

**Exception:** `.env.example` should be committed as documentation.

### Document All Variables in .env.example

```bash
# ✅ Good - documented
# Database connection string (required)
# Example: postgresql://user:password@host:port/database
DATABASE_URL=postgresql://localhost:5432/cme_dev

# ❌ Bad - no documentation
DATABASE_URL=postgresql://localhost:5432/cme_dev
```

### Use @kit/env-loader for Consistency

```typescript
// ✅ Good - validated and consistent
import {loadEnvironment, requireEnv} from '@kit/env-loader/node';
loadEnvironment({required: ['DATABASE_URL']});
const dbUrl = requireEnv('DATABASE_URL');

// ❌ Bad - no validation
const dbUrl = process.env.DATABASE_URL;
```

### Validate Required Variables at Startup

```typescript
// Application entry point
import {loadEnvironment} from '@kit/env-loader/node';

const result = loadEnvironment({
  appName: 'server',
  required: ['DATABASE_URL', 'JWT_SECRET', 'REDIS_URL'],
});

if (!result.success) {
  console.error('Missing required environment variables');
  process.exit(1);
}
```

**Why:** Fail fast with clear error messages.

### Use Different .env Files Per Environment

```
.env                    # Local development
.env.test               # Testing
.env.staging            # Staging
.env.production         # Production
```

**Load based on NODE_ENV:**
```typescript
const envFile = `.env.${process.env.NODE_ENV}`;
loadEnvironment({envFile});
```

### Keep Secrets Out of Code

```typescript
// ❌ Bad - secret in code
const apiKey = 'sk_test_secret123';

// ✅ Good - secret in environment
const apiKey = requireEnv('STRIPE_API_KEY');
```

## Related Documentation

- [Quick Reference](/docs/guides/developer-tools/quick-reference.md) - Environment variable quick reference
- [Development Workflows](/docs/guides/developer-tools/development-workflow.md) - Environment setup in workflows
- [Troubleshooting](/docs/guides/developer-tools/troubleshooting.md) - Environment troubleshooting
- [@kit/env-loader README](/tooling/env-loader/README.md) - Complete env-loader documentation
