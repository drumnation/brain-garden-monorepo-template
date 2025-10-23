---
title: "Developer Tools - Troubleshooting"
description: "Common issues and solutions for CME developer tools"
keywords: [troubleshooting, issues, solutions, debugging, errors, fixes]
last_updated: "2025-01-22"
---

# Developer Tools - Troubleshooting

Common issues and solutions for CME developer tools.

## Overview

This guide provides solutions for common problems encountered with validation, logging, environment, and monorepo tools.

**How to use this guide:**
1. Find your issue category below
2. Match your symptoms to the issue description
3. Follow the solution steps
4. If issue persists, check "Getting Help" section

## Validation Issues

Problems with brain-monitor and testing tools.

### Validation Reports Are Stale

**Symptoms:**
- Validation summary shows old timestamp
- Reports don't reflect recent changes
- Status doesn't match actual state

**Cause:** Reports not regenerated after changes.

**Solution:**

```bash
# Regenerate all validation reports
pnpm brain:validate

# Check updated summary
cat _errors/validation-summary.md
```

**Prevention:** Use watch mode during development:
```bash
pnpm brain:watch
```

### Tests Timing Out

**Symptoms:**
```
Error: Test exceeded 5000ms timeout
Timeout: test/user-auth.test.ts
```

**Cause:** Tests running too slowly or hanging.

**Solutions:**

**1. Use recursive runner (automatic):**
```bash
# Recursive runner auto-adjusts
pnpm brain:test-failures-unit
```

**2. Increase timeout in test:**
```typescript
it('slow operation', async () => {
  // ...
}, {timeout: 10000}); // 10 seconds
```

**3. Enable isolation:**
```typescript
// vitest.config.ts
export default {
  test: {
    pool: 'forks',  // Isolate tests
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
};
```

**4. Debug hanging tests:**
```bash
LOG_LEVEL=debug pnpm test:unit
```

### Coverage Below Threshold

**Symptoms:**
```
Error: Coverage for statements (82%) is below threshold (85%)
```

**Cause:** New code not covered by tests.

**Solutions:**

**1. Recursive runner auto-adjusts (temporary):**
```bash
# Auto-enables isolation for coverage issues
pnpm brain:test-failures-unit
```

**2. Add missing tests:**
```typescript
// src/utils.unit.test.ts
describe('parseData', () => {
  it('should handle empty input', () => {
    expect(parseData('')).toEqual([]);
  });
});
```

**3. Check coverage report:**
```bash
# View coverage in browser
open coverage/index.html
```

**4. Temporarily lower threshold (not recommended):**
```typescript
// vitest.config.ts
import {presets} from '@kit/testing';

export default {
  test: {
    coverage: presets.coverage.relaxed, // 70%
  },
};
```

### brain-monitor Command Not Found

**Symptoms:**
```
bash: brain-monitor: command not found
```

**Cause:** Dependencies not installed or PATH issue.

**Solution:**

```bash
# Install dependencies
pnpm install

# Verify installation
which brain-monitor

# Or use via pnpm script
pnpm brain:validate
```

## Environment Issues

Problems with configuration and environment variables.

### Missing Environment Variables

**Symptoms:**
```
Error: Required environment variable DATABASE_URL not found
```

**Cause:** .env file missing or incomplete.

**Solution:**

```bash
# Check if .env exists
ls -la .env

# If missing, copy from example
cp .env.example .env

# Edit with required values
vim .env

# Add missing variable
echo "DATABASE_URL=postgresql://localhost:5432/cme_dev" >> .env

# Restart application
pnpm dev
```

**Prevention:** Use @kit/env-loader validation:
```typescript
import {loadEnvironment} from '@kit/env-loader/node';

loadEnvironment({
  required: ['DATABASE_URL', 'JWT_SECRET'],
});
```

### Port Conflicts

**Symptoms:**
```
Error: Port 8080 is already in use
Error: listen EADDRINUSE: address already in use :::8080
```

**Cause:** Port already occupied by another process.

**Solutions:**

**1. Reassign ports automatically:**
```bash
pnpm setup:env
pnpm dev
```

**2. Find process using port:**
```bash
# macOS/Linux
lsof -i :8080

# Windows
netstat -ano | findstr :8080

# Kill process
kill -9 [PID]
```

**3. Manually change port:**
```bash
# Edit .env
echo "PORT=8081" >> .env

# Restart
pnpm dev
```

**4. Stop conflicting services:**
```bash
# Stop all dev servers
# Ctrl+C in terminal

# Or kill all node processes (careful!)
pkill -f "node"
```

### VITE_ Variables Not Working

**Symptoms:**
```
Warning: VITE_API_URL is undefined in browser
Error: Cannot read property of undefined
```

**Cause:** Browser variables missing VITE_ prefix.

**Solution:**

```bash
# ❌ Wrong - no VITE_ prefix
echo "API_URL=http://localhost:8080" >> .env

# ✅ Correct - with VITE_ prefix
echo "VITE_API_URL=http://localhost:8080" >> .env

# Restart dev server
pnpm dev
```

**Remember:** All browser environment variables must have `VITE_` prefix.

### .env Changes Not Reflected

**Symptoms:**
- Updated .env file
- Changes not appearing in application
- Old values still being used

**Cause:** Dev server needs restart to load new environment.

**Solution:**

```bash
# Stop dev servers
# Ctrl+C

# Restart to reload environment
pnpm dev

# Verify changes loaded
# Check application logs
```

**Note:** Environment variables are loaded at application startup, not dynamically.

## Logging Issues

Problems with @kit/logger and log monitoring.

### Logs Not Showing Colors

**Symptoms:**
- Terminal output is monochrome
- No color highlighting
- Hard to read logs

**Cause:** Terminal doesn't support colors or theme issue.

**Solutions:**

**1. Check terminal color support:**
```bash
# Check if terminal supports color
echo $TERM

# Should be xterm-256color or similar
```

**2. Try different theme:**
```bash
# Try Monochrome theme
LOG_THEME=Monochrome pnpm dev

# Or try different theme
LOG_THEME=Dracula pnpm dev
```

**3. Force color output:**
```bash
FORCE_COLOR=1 pnpm dev
```

**4. Update terminal:**
- Use modern terminal (iTerm2, Windows Terminal, Hyper)
- Enable 256 color support

### Log Level Too Verbose

**Symptoms:**
- Too many log messages
- Hard to find important information
- Console cluttered

**Cause:** Log level set too low (trace/debug).

**Solution:**

```bash
# Set higher log level
LOG_LEVEL=info pnpm dev

# Or even higher
LOG_LEVEL=warn pnpm dev

# For production
LOG_LEVEL=error pnpm dev
```

**Log levels (increasing verbosity):**
- `fatal` - Critical only
- `error` - Errors only
- `warn` - Warnings and errors
- `info` - General information (default)
- `debug` - Debugging details
- `trace` - Maximum verbosity

### Browser Logs Not Captured

**Symptoms:**
- `_logs/browser-console.log` is empty
- Browser console logs not appearing in file
- Missing client-side logging

**Cause:** brain-monitor middleware not installed or not running.

**Solutions:**

**1. Verify brain-monitor running:**
```bash
# Start with brain-monitor
pnpm brain:dev

# Not just
pnpm dev
```

**2. Check middleware installed:**
```typescript
// apps/server/src/main.ts
import {createBrainMonitorRouter} from '@kit/brain-monitor/server';

app.use('/_brain-monitor', createBrainMonitorRouter());
```

**3. Verify client sending logs:**
```typescript
// Check browser console
console.log('Test log'); // Should appear in file
```

**4. Check log file permissions:**
```bash
ls -la _logs/browser-console.log
chmod 644 _logs/browser-console.log
```

### Log Files Too Large

**Symptoms:**
- Log files exceeding 10MB
- Slow to open or search
- Disk space issues

**Cause:** Automatic rotation not working or excessive logging.

**Solutions:**

**1. Manual cleanup:**
```bash
# Remove all logs
rm _logs/*.log

# Logs recreated on next start
pnpm dev
```

**2. Reduce log verbosity:**
```bash
LOG_LEVEL=warn pnpm dev
```

**3. Rotate logs manually:**
```bash
# Archive old logs
mv _logs/server.log _logs/server.log.old

# Start fresh
pnpm dev
```

**4. Check auto-rotation:**
```bash
# brain-monitor rotates at 10MB
# Check if working properly
ls -lh _logs/*.log
```

## Build Issues

Problems with Turbo and compilation.

### Build Cache Stale

**Symptoms:**
- Build doesn't reflect recent changes
- Old code being used
- Inconsistent build outputs

**Cause:** Turbo cache not invalidated.

**Solution:**

```bash
# Clear Turbo cache
rm -rf .turbo

# Rebuild
pnpm build

# Or force rebuild
pnpm build --force
```

**Prevention:** Turbo should auto-invalidate. If repeatedly stale, check:

```json
// turbo.json
{
  "globalDependencies": [
    "**/.env",        // Add files that should invalidate cache
    "**/.env.test"
  ]
}
```

### TypeScript Errors in node_modules

**Symptoms:**
```
Error: node_modules/@types/react/index.d.ts(123,45): TS2345
Type errors in installed packages
```

**Cause:** Dependency version mismatch or corrupt installation.

**Solutions:**

**1. Check pnpm overrides:**
```json
// package.json (root)
{
  "pnpm": {
    "overrides": {
      "@types/react": "^18.3.11",
      "react": "18.3.1"
    }
  }
}
```

**2. Clear and reinstall:**
```bash
# Remove node_modules and lock file
pnpm clean:workspaces
rm pnpm-lock.yaml

# Fresh install
pnpm install

# Rebuild
pnpm build
```

**3. Check TypeScript version:**
```bash
# Should be consistent across workspace
pnpm list typescript
```

### Circular Dependencies

**Symptoms:**
```
Warning: Circular dependency detected
Error: Module import cycle
```

**Cause:** Packages importing each other.

**Solution:**

```bash
# Check known issues
cat TODO-CIRCULAR-DEPENDENCY.md

# Review import chain
# Package A → Package B → Package A
```

**Fix patterns:**

**1. Extract shared code:**
```typescript
// Create new shared package
packages/shared-types/
└── src/
    └── user.ts

// Both packages import shared
import {User} from '@scala-cme/shared-types';
```

**2. Use dependency injection:**
```typescript
// Instead of importing, pass as parameter
export const processUser = (deps: {getUserById: Function}) => {
  // ...
};
```

**3. Reorganize package boundaries:**
```
// Before (circular)
packages/auth → packages/user
packages/user → packages/auth

// After (linear)
packages/shared-types
  ↓
packages/user
  ↓
packages/auth
```

### Build Fails After Dependency Update

**Symptoms:**
- Build worked before update
- Now fails with errors
- Type errors or missing modules

**Solutions:**

**1. Clear and rebuild:**
```bash
rm -rf .turbo
pnpm clean:workspaces
pnpm install
pnpm build
```

**2. Check breaking changes:**
```bash
# Review changelogs
npm view [package-name] versions
```

**3. Pin problematic dependency:**
```json
// package.json
{
  "pnpm": {
    "overrides": {
      "problematic-package": "1.2.3"
    }
  }
}
```

**4. Update incrementally:**
```bash
# Update one package at a time
pnpm update [package-name]
pnpm build
```

## Package Management Issues

Problems with pnpm and workspace management.

### Workspace Package Not Found

**Symptoms:**
```
Error: Cannot find module '@scala-cme/shared-ui'
Package not found in workspace
```

**Cause:** Package not listed in pnpm-workspace.yaml.

**Solution:**

```bash
# Check workspace configuration
cat pnpm-workspace.yaml

# Ensure package path is included
# packages:
#   - packages/*
#   - packages/*/*

# If missing, add package path
# Then reinstall
pnpm install
```

### Dependency Version Mismatch

**Symptoms:**
```
Warning: Multiple versions of "react" in workspace
Error: Hook rules violated (React version mismatch)
```

**Cause:** Different packages using different versions.

**Solution:**

```bash
# Check for mismatches
manypkg check

# Auto-fix versions
manypkg fix

# Or use pnpm overrides
# package.json (root)
{
  "pnpm": {
    "overrides": {
      "react": "18.3.1"
    }
  }
}

# Reinstall
pnpm install
```

### Package Not Linking

**Symptoms:**
- Internal package not available
- Import errors for workspace packages
- Module not found errors

**Cause:** Missing workspace protocol.

**Solution:**

```json
// ❌ Wrong
{
  "dependencies": {
    "@scala-cme/shared-ui": "1.0.0"
  }
}

// ✅ Correct
{
  "dependencies": {
    "@scala-cme/shared-ui": "workspace:*"
  }
}
```

```bash
# After fixing, reinstall
pnpm install
```

### pnpm Lock File Conflicts

**Symptoms:**
```
Error: Lockfile is broken
Git merge conflict in pnpm-lock.yaml
```

**Cause:** Multiple branches modifying dependencies.

**Solution:**

```bash
# Delete lock file
rm pnpm-lock.yaml

# Regenerate from package.json
pnpm install

# Resolve conflicts
git add pnpm-lock.yaml
git commit -m "fix: regenerate lock file"
```

**Prevention:** Update dependencies on main branch, then merge.

## Generator Issues

Problems with code generation tools.

### Generator Fails to Create Package

**Symptoms:**
```
Error: Failed to create package
Permission denied
EACCES: permission denied
```

**Cause:** Permission issues or invalid name.

**Solutions:**

**1. Check permissions:**
```bash
# Check directory permissions
ls -la packages/

# Fix if needed
chmod 755 packages/
```

**2. Verify package name:**
```bash
# Must follow convention
# ✅ Good: @scala-cme/data-export
# ❌ Bad: data_export or Data-Export
```

**3. Run with correct permissions:**
```bash
# Don't use sudo
pnpm gen:library

# If permission errors, fix directory ownership
sudo chown -R $USER:$USER packages/
```

### Generated Package Has Errors

**Symptoms:**
- TypeScript errors in new package
- Lint errors in generated code
- Tests failing immediately

**Cause:** Generator template outdated or misconfigured.

**Solutions:**

**1. Run validation:**
```bash
# Check what's wrong
pnpm brain:typecheck-failures
pnpm brain:lint-failures

# Fix issues
pnpm lint:fix
```

**2. Review generated files:**
```bash
cd packages/new-package
cat package.json
cat tsconfig.json
```

**3. Update generator templates:**
```typescript
// tooling/generators/create-library/templates.ts
// Update templates to match current standards
```

**4. Manually fix issues:**
```bash
# Common fixes
pnpm --filter @scala-cme/new-package add missing-dependency
```

### Template Not Found

**Symptoms:**
```
Error: Template file not found
ENOENT: no such file or directory
```

**Cause:** Template file missing or moved.

**Solution:**

```bash
# Check template exists
ls -la docs/maintenance/templates/

# Available templates
ls docs/maintenance/templates/
# feature-template/
# prd-template.md
# architecture-template.md
# adr-template.md
# github-issue-template.md

# Use correct template name
cp -r docs/maintenance/templates/feature-template docs/features/my-feature
```

## Development Server Issues

Problems with dev servers and runtime.

### Dev Server Won't Start

**Symptoms:**
```
Error: Failed to start dev server
Port in use
Configuration error
```

**Causes and Solutions:**

**1. Port conflict:**
```bash
pnpm setup:env
pnpm dev
```

**2. Missing dependencies:**
```bash
pnpm install
pnpm dev
```

**3. Environment variables:**
```bash
cp .env.example .env
# Edit .env with required values
pnpm dev
```

**4. Cache issues:**
```bash
rm -rf .turbo
rm -rf node_modules/.cache
pnpm dev
```

### Hot Reload Not Working

**Symptoms:**
- Changes not reflecting in browser
- Need to manually refresh
- Build not updating

**Cause:** Vite HMR issue or configuration problem.

**Solutions:**

**1. Check Vite config:**
```typescript
// vite.config.ts
export default {
  server: {
    watch: {
      usePolling: true, // Enable if on network drive
    },
  },
};
```

**2. Restart dev server:**
```bash
# Ctrl+C to stop
pnpm dev
```

**3. Clear cache:**
```bash
rm -rf node_modules/.vite
pnpm dev
```

**4. Check file watcher limits (Linux):**
```bash
# Increase limit
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Multiple Packages Failing

**Symptoms:**
- Several packages not starting
- Multiple error messages
- Cascade of failures

**Cause:** Shared dependency issue or environment problem.

**Solutions:**

**1. Check log index:**
```bash
cat _logs/index.md
# Shows which packages are running/failed
```

**2. Review individual logs:**
```bash
tail -f _logs/server.log
tail -f _logs/client.log
```

**3. Restart with logging:**
```bash
# Stop all
# Ctrl+C

# Start with logging for diagnosis
pnpm brain:dev
```

**4. Fix common issues first:**
```bash
# Environment
pnpm setup:env

# Dependencies
pnpm install

# Clear cache
rm -rf .turbo

# Try again
pnpm dev
```

### brain:dev Command Hangs

**Symptoms:**
- Command runs but nothing happens
- No output or logs
- Terminal stuck

**Cause:** Package discovery issue or port conflict.

**Solutions:**

**1. Check for port conflicts:**
```bash
# Stop brain:dev (Ctrl+C)

# Check ports
lsof -i :8080
lsof -i :3000
lsof -i :6006

# Kill conflicting processes
kill -9 [PID]

# Reassign ports
pnpm setup:env

# Try again
pnpm brain:dev
```

**2. Review package discovery:**
```bash
# Check which packages have dev scripts
grep -r "\"dev\"" apps/*/package.json packages/*/package.json
```

**3. Run individually:**
```bash
# Start packages one at a time
cd apps/server
pnpm dev

# In another terminal
cd apps/client
pnpm dev
```

**4. Check logs:**
```bash
# If any logs created
ls -la _logs/
cat _logs/[package].log
```

## Getting Help

When troubleshooting doesn't solve your issue.

### Check Validation Summary

```bash
cat _errors/validation-summary.md
```

Look for:
- Error counts
- Failed validations
- Timestamps

### Review Logs

```bash
# Server logs
tail -f _logs/server.log

# Client logs
tail -f _logs/client.log

# All logs
tail -f _logs/*.log
```

### Search Documentation

```bash
# Search all docs for keyword
grep -r "keyword" docs/

# Search this guide
grep -i "your issue" docs/guides/developer-tools/troubleshooting.md
```

### Check Tool READMEs

Individual tool documentation:
- [brain-monitor](/tooling/brain-monitor/README.md)
- [@kit/logger](/tooling/logger/README.md)
- [@kit/testing](/tooling/testing/README.md)
- [@kit/env-loader](/tooling/env-loader/README.md)

### Review Development Rules

Project-wide standards and patterns:
- [AGENTS.md](/AGENTS.md) - Development rules
- [AGENT_INSTRUCTIONS.md](/docs/maintenance/AGENT_INSTRUCTIONS.md) - Agent guide
- [DOCUMENTATION_STANDARDS.md](/docs/maintenance/DOCUMENTATION_STANDARDS.md) - Documentation style

### Check GitHub Issues

Search for similar problems:

```bash
# Using GitHub CLI
gh issue list --search "your issue"

# Search closed issues too
gh issue list --state closed --search "your issue"
```

### Ask for Help

If issue persists:

1. **Gather information:**
   - Error messages
   - Steps to reproduce
   - Environment details
   - Relevant logs

2. **Create GitHub issue:**
   ```bash
   gh issue create --title "Issue: brief description" --body "Detailed info"
   ```

3. **Include context:**
   - OS and version
   - Node.js version
   - pnpm version
   - Recent changes
   - Steps tried

## Related Documentation

- [Quick Reference](/docs/guides/developer-tools/quick-reference.md) - Command reference
- [Validation Tools](/docs/guides/developer-tools/validation-tools.md) - Validation troubleshooting
- [Logging & Debugging](/docs/guides/developer-tools/logging-debugging.md) - Debugging strategies
- [Environment Management](/docs/guides/developer-tools/environment-management.md) - Environment troubleshooting
- [Monorepo Tools](/docs/guides/developer-tools/monorepo-tools.md) - Monorepo troubleshooting
- [Development Workflows](/docs/guides/developer-tools/development-workflow.md) - Workflow patterns
