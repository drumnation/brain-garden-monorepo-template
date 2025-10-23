---
title: "Logging & Debugging Tools"
description: "Guide to observability and debugging tools in CME"
keywords: [logging, debugging, logger, brain-monitor, observability, troubleshooting]
last_updated: "2025-01-22"
---

# Logging & Debugging Tools

Comprehensive guide to observability and debugging tools in the Content Manager Express monorepo.

## Overview

Effective logging and debugging are essential for understanding runtime behavior, diagnosing issues, and maintaining code quality. CME provides a comprehensive observability stack with @kit/logger for structured logging and brain-monitor for log collection.

## @kit/logger

Universal structured logging library for Node.js and browser environments.

### Purpose

@kit/logger provides:
- **Universal Logging:** Works in Node.js and browser
- **Structured Data:** Log with metadata and context
- **Scoped Logging:** Create child loggers for modules
- **Color Themes:** Beautiful terminal color schemes
- **React Integration:** Hooks and context for React apps
- **Performance:** Optimized with Pino under the hood
- **Type Safety:** Full TypeScript support

### Node.js Usage

```typescript
import {createLogger} from '@kit/logger/node';

// Create logger instance
const logger = createLogger({
  level: 'info',
  theme: 'Dracula',
});

// Log messages
logger.info('Server started');
logger.debug({port: 3000}, 'Server listening');
logger.error({error: err}, 'Failed to connect to database');
```

### Browser Usage

```typescript
import {createLogger} from '@kit/logger/browser';

// Create logger instance
const logger = createLogger({
  level: 'info',
  theme: 'Nord',
});

// Log messages
logger.info('App mounted');
logger.debug({userId: '123'}, 'User authenticated');
logger.warn({msg: 'API slow'}, 'Request took >1s');
```

**Important:** Browser environment variables must be prefixed with `VITE_`:
- `VITE_LOG_LEVEL` - Browser log level
- `VITE_LOG_THEME` - Browser color theme

### Log Levels

Log levels in order of severity:

| Level | Numeric Value | Use Case | Example |
|-------|--------------|----------|---------|
| `fatal` | 60 | Critical system failures | Database completely down |
| `error` | 50 | Application errors | API request failed |
| `warn` | 40 | Warning conditions | Deprecated API used |
| `info` | 30 | General information | Server started |
| `debug` | 20 | Debug information | Function called with params |
| `trace` | 10 | Detailed traces | Loop iteration details |

**Setting log level:**

```bash
# Node.js
LOG_LEVEL=debug pnpm dev

# Browser (in .env)
VITE_LOG_LEVEL=debug
```

### Color Themes

Choose from multiple color themes to match your terminal:

| Theme | Style | Best For |
|-------|-------|----------|
| **Dracula** | Dark & vibrant | Late-night coding, high contrast |
| **Solarized** | Balanced & scientific | Reduced eye strain |
| **Nord** | Arctic & clean | Light backgrounds, minimalism |
| **Gruvbox** | Retro & warm | Vintage aesthetics |
| **NightOwl** | Night-optimized | Dark mode, night coding |
| **Monochrome** | Minimalist | CI/CD logs, no color preference |
| **Classic** | Original | Default CME theme |

**Setting theme:**

```bash
# Node.js
LOG_THEME=Dracula pnpm dev

# Browser (in .env)
VITE_LOG_THEME=Nord
```

**Example theme output:**

```typescript
// Dracula theme
logger.info('User login'); // Green text
logger.warn('Slow query'); // Orange text
logger.error('Auth failed'); // Red text

// Nord theme
logger.debug('Query params', {id: '123'}); // Arctic blue
logger.info('Request complete'); // Frost green
```

### Scoped Logging

Create child loggers with specific scopes:

```typescript
import {createLogger} from '@kit/logger/node';

const logger = createLogger();

// Create child logger with scope
const authLogger = logger.child({scope: 'UserAuth'});
const dbLogger = logger.child({scope: 'Database'});

// Logs include scope
authLogger.info('User logged in'); // [UserAuth] User logged in
dbLogger.debug('Query executed'); // [Database] Query executed
```

**Benefits:**
- Filter logs by scope
- Identify log source quickly
- Organize logs by module

### Structured Data

Log with metadata objects:

```typescript
// Without structured data
logger.info('User created with ID 123 and email john@example.com');

// With structured data (better)
logger.info({userId: '123', email: 'john@example.com'}, 'User created');
```

**Benefits:**
- Parseable log data
- Searchable fields
- Better debugging context
- Machine-readable logs

**Example with error:**

```typescript
try {
  await createUser(data);
} catch (error) {
  logger.error({
    error: error.message,
    stack: error.stack,
    userId: data.id,
    timestamp: Date.now(),
  }, 'Failed to create user');
}
```

### React Integration

Use logger in React components with hooks:

```typescript
import {LoggerProvider, useLogger} from '@kit/logger/browser';

// Wrap app with provider
function App() {
  return (
    <LoggerProvider level="info" theme="Dracula">
      <UserProfile />
    </LoggerProvider>
  );
}

// Use logger in components
function UserProfile() {
  const logger = useLogger();

  useEffect(() => {
    logger.debug('UserProfile mounted');
  }, []);

  const handleSave = () => {
    logger.info({userId: user.id}, 'Profile saved');
  };

  return <div>...</div>;
}
```

### Environment Variables

| Variable | Values | Default | Context |
|----------|--------|---------|---------|
| `LOG_LEVEL` | trace, debug, info, warn, error, fatal | info | Node.js |
| `LOG_THEME` | Dracula, Nord, Solarized, Gruvbox, NightOwl, Monochrome, Classic | Classic | Node.js |
| `VITE_LOG_LEVEL` | trace, debug, info, warn, error, fatal | info | Browser |
| `VITE_LOG_THEME` | Dracula, Nord, Solarized, Gruvbox, NightOwl, Monochrome, Classic | Classic | Browser |

**Setting in .env:**

```bash
# Node.js logging
LOG_LEVEL=debug
LOG_THEME=Dracula

# Browser logging (requires VITE_ prefix)
VITE_LOG_LEVEL=info
VITE_LOG_THEME=Nord
```

### Detailed Documentation

For complete @kit/logger documentation, see: [/tooling/logger/README.md](/tooling/logger/README.md)

## brain-monitor Logs

Real-time log collection and monitoring from all dev servers.

### Purpose

brain-monitor logs provide:
- **Centralized Collection:** All dev server logs in one place
- **Real-time Streaming:** Live log updates
- **Browser Console Capture:** Automatic browser console logging
- **Dynamic Discovery:** Auto-finds packages with dev scripts
- **Log Rotation:** Automatic rotation at 10MB
- **Structured Organization:** Logs organized by package

### Log Directory Structure

```
_logs/
├── index.md                    # Log index with package status
├── server.log                  # Server runtime logs
├── client.log                  # Client runtime logs
├── storybook.log               # Storybook runtime logs
├── browser-console.log         # Browser console capture
└── [package-name].log          # Other package logs
```

### Starting with Logging

Use `pnpm brain:dev` to start dev servers with logging:

```bash
pnpm brain:dev
```

**What this does:**
1. Discovers all packages with dev scripts
2. Starts dev servers in parallel
3. Captures stdout/stderr to `_logs/[package].log`
4. Captures browser console to `_logs/browser-console.log`
5. Creates log index in `_logs/index.md`

**Alternative (no logging):**
```bash
pnpm dev
```

### Monitoring Logs

Real-time log monitoring with `tail`:

```bash
# Monitor specific package
tail -f _logs/server.log

# Monitor multiple packages
tail -f _logs/server.log _logs/client.log

# Monitor all logs
tail -f _logs/*.log

# Monitor with color support
tail -f _logs/server.log | less -R
```

**Search logs:**

```bash
# Find errors
grep -i error _logs/server.log

# Find specific scope
grep "scope: UserAuth" _logs/server.log

# Count occurrences
grep -c "error" _logs/server.log
```

### Browser Console Capture

Automatically captures browser console logs to file.

**Setup (required):**

Add brain-monitor middleware to your Express server:

```typescript
import {createBrainMonitorRouter} from '@kit/brain-monitor/server';

// Add to Express app
app.use('/_brain-monitor', createBrainMonitorRouter());
```

**How it works:**
1. Brain-monitor middleware installed in Express app
2. Client sends console logs to `/_brain-monitor` endpoint
3. Middleware writes to `_logs/browser-console.log`
4. Includes all console methods (log, warn, error, etc.)

**Example browser console capture:**

```
[2025-01-22 10:30:45] [INFO] App mounted successfully
[2025-01-22 10:30:46] [DEBUG] User authentication started
[2025-01-22 10:30:47] [ERROR] API request failed: 404 Not Found
[2025-01-22 10:30:48] [WARN] Deprecated API endpoint used
```

### Dynamic Package Discovery

Brain-monitor automatically discovers packages with dev scripts:

**Discovery process:**
1. Reads `pnpm-workspace.yaml`
2. Finds all workspace packages
3. Checks each package for `dev` script in `package.json`
4. Starts dev servers for matching packages
5. Captures logs to `_logs/[package-name].log`

**Benefits:**
- No manual configuration
- Works with new packages automatically
- Scales with monorepo growth

### Log Rotation

Automatic log rotation at 10MB:

**How it works:**
1. Log file reaches 10MB
2. Current file rotated to `[name].log.1`
3. Previous `[name].log.1` → `[name].log.2`
4. Keeps last 5 rotations
5. New log file created

**Manual cleanup:**

```bash
# Remove all logs
rm _logs/*.log

# Remove specific log
rm _logs/server.log

# Logs will be recreated on next dev server start
```

## Debugging Strategies

Effective approaches for debugging different types of issues.

### Start with Logs

**First step:** Check logs before validation reports.

```bash
# Runtime issue? → Check logs
tail -f _logs/[package-name].log

# Build-time issue? → Check validation reports
cat _errors/validation-summary.md
```

**Why:** Logs show runtime behavior, reports show build-time errors.

### Check Validation Reports

**Second step:** Check validation reports for build-time errors.

```bash
# Check summary
cat _errors/validation-summary.md

# Check specific report
cat _errors/reports/errors.typecheck-failures.md
```

**Why:** Separate concerns - runtime vs. build-time.

### Enable Debug Logging

**Third step:** If logs don't show enough detail, enable debug logging.

```bash
# Enable debug level
LOG_LEVEL=debug pnpm dev

# Or trace level (maximum verbosity)
LOG_LEVEL=trace pnpm dev
```

**Why:** More detailed output helps identify root cause.

### Use Structured Logging

**Fourth step:** Add targeted logging with context.

```typescript
import {createLogger} from '@kit/logger/node';

const logger = createLogger();

export const processPayment = async (orderId: string, amount: number) => {
  logger.debug({orderId, amount}, 'Processing payment');

  try {
    const result = await chargeCard(amount);
    logger.info({orderId, transactionId: result.id}, 'Payment successful');
    return result;
  } catch (error) {
    logger.error({orderId, amount, error: error.message}, 'Payment failed');
    throw error;
  }
};
```

**Why:** Context makes debugging faster and more effective.

### Tail Specific Logs

**Fifth step:** Monitor only relevant logs.

```bash
# Focus on specific package
tail -f _logs/server.log

# Filter for specific scope
tail -f _logs/server.log | grep "scope: Payment"

# Filter for errors only
tail -f _logs/server.log | grep -i error
```

**Why:** Reduce noise, focus on relevant information.

### Use Log Themes

**Sixth step:** Choose theme that works for your terminal.

```bash
# Try different themes
LOG_THEME=Dracula pnpm dev
LOG_THEME=Nord pnpm dev
LOG_THEME=Solarized pnpm dev
```

**Why:** Better readability improves debugging efficiency.

### Add Targeted Logging

**Seventh step:** Insert log statements at key points.

**Strategic locations:**
- Function entry/exit
- Before/after API calls
- Error handling blocks
- State changes
- Loop iterations (use trace level)

**Example:**

```typescript
export const fetchUser = async (userId: string) => {
  logger.debug({userId}, 'Fetching user');

  const user = await db.users.findOne({id: userId});
  logger.debug({user: user?.id}, 'User fetched');

  if (!user) {
    logger.warn({userId}, 'User not found');
    return null;
  }

  return user;
};
```

## Common Error Patterns

Recognizing and fixing common issues.

### Type Errors

**Check:** `_errors/reports/errors.typecheck-failures.md`

**Common patterns:**
```
TS2322: Type 'string' is not assignable to type 'number'
TS2304: Cannot find name 'UserType'
TS2339: Property 'email' does not exist on type 'User'
```

**Solutions:**
- Check type imports
- Add missing properties to interfaces
- Use type assertions carefully
- Enable strict null checks

### Lint Errors

**Check:** `_errors/reports/errors.lint-failures.md`

**Common patterns:**
```
no-unused-vars: 'userData' is defined but never used
react/jsx-key: Missing 'key' prop in list
react-hooks/exhaustive-deps: Missing dependency 'user'
```

**Solutions:**
- Remove unused variables
- Add keys to list items
- Add missing dependencies to useEffect

### Test Failures

**Check:** `_errors/reports/errors.test-failures-*.md`

**Common patterns:**
```
Timeout: Test exceeded 5000ms
AssertionError: Expected 200 but received 500
TypeError: Cannot read property 'id' of undefined
```

**Solutions:**
- Increase test timeouts
- Check test setup/teardown
- Verify test data availability
- Use recursive runner for isolation

### Runtime Errors

**Check:** `_logs/[package-name].log`

**Common patterns:**
```
[ERROR] Database connection timeout
[ERROR] API request failed: 404 Not Found
[ERROR] Unhandled promise rejection
```

**Solutions:**
- Check environment variables
- Verify API endpoints
- Add error handling
- Check database connection

### Environment Issues

**Check:** `.env` files and `@kit/env-loader`

**Common patterns:**
```
Error: Required environment variable DATABASE_URL not found
Error: PORT already in use
Warning: VITE_ prefix missing for browser variable
```

**Solutions:**
- Copy `.env.example` to `.env`
- Run `pnpm setup:env`
- Add `VITE_` prefix for browser variables
- Check for port conflicts

## Log Analysis

Reading and interpreting logs effectively.

### Log Format

Standard log entry structure:

```
[2025-01-22 10:30:45] [INFO] [scope: UserAuth] User logged in {userId: "123", method: "password"}
```

**Components:**
- `[2025-01-22 10:30:45]` - Timestamp
- `[INFO]` - Log level
- `[scope: UserAuth]` - Logger scope
- `User logged in` - Message
- `{userId: "123", method: "password"}` - Structured data

### Filtering Logs

Use grep and other CLI tools:

```bash
# Filter by level
grep "\[ERROR\]" _logs/server.log

# Filter by scope
grep "scope: UserAuth" _logs/server.log

# Filter by user ID
grep "userId: \"123\"" _logs/server.log

# Time range (example: 10:30 to 10:35)
grep "10:3[0-5]" _logs/server.log
```

### Correlating Logs

Match logs across packages:

```bash
# Find logs for specific request ID
grep "requestId: \"abc-123\"" _logs/*.log

# Or use awk for better formatting
awk '/requestId: "abc-123"/' _logs/*.log
```

**Example correlation:**

```
_logs/client.log: [10:30:45] [INFO] API request started {requestId: "abc-123"}
_logs/server.log: [10:30:45] [DEBUG] Request received {requestId: "abc-123"}
_logs/server.log: [10:30:46] [ERROR] Database query failed {requestId: "abc-123"}
_logs/client.log: [10:30:46] [ERROR] API request failed {requestId: "abc-123"}
```

### Performance Analysis

Use timing information:

```typescript
// Add timing logs
const start = Date.now();
logger.debug({operation: 'fetchUsers'}, 'Starting');

const users = await db.users.find();

const duration = Date.now() - start;
logger.debug({operation: 'fetchUsers', duration}, 'Completed');
```

**Analyzing timing:**

```bash
# Find slow operations (>1000ms)
grep "duration.*[1-9][0-9]\{3,\}" _logs/server.log
```

## Debugging Workflows

Step-by-step processes for common debugging scenarios.

### Debugging Type Errors

1. Check validation summary: `cat _errors/validation-summary.md`
2. Read type error report: `cat _errors/reports/errors.typecheck-failures.md`
3. Identify file and line number
4. Fix type issue
5. Re-run typecheck: `pnpm brain:typecheck-failures`
6. Repeat until clean

### Debugging Runtime Errors

1. Identify package with issue
2. Check package logs: `tail -f _logs/[package].log`
3. Enable debug logging: `LOG_LEVEL=debug pnpm dev`
4. Reproduce issue while monitoring logs
5. Analyze error messages and stack traces
6. Add targeted logging if needed
7. Fix issue
8. Verify fix in logs

### Debugging Test Failures

1. Check test failure report: `cat _errors/reports/errors.test-failures-unit.md`
2. Identify failing test
3. Run test with debug logging: `LOG_LEVEL=debug pnpm test:unit`
4. Review test setup and assertions
5. Fix test or implementation
6. Re-run tests: `pnpm brain:test-failures-unit`
7. Verify all tests pass

### Debugging Performance Issues

1. Enable debug logging: `LOG_LEVEL=debug pnpm dev`
2. Add timing logs at key points
3. Reproduce slow operation
4. Analyze log timings
5. Identify bottleneck
6. Optimize slow operation
7. Verify improvement in logs

## Best Practices

### Log at Appropriate Levels

| Level | When to Use | Example |
|-------|-------------|---------|
| `trace` | Loop iterations, detailed traces | `logger.trace({index: i}, 'Processing item')` |
| `debug` | Development debugging | `logger.debug({userId}, 'Fetching user')` |
| `info` | General information | `logger.info('Server started')` |
| `warn` | Warning conditions | `logger.warn('API response slow')` |
| `error` | Application errors | `logger.error({error}, 'Request failed')` |
| `fatal` | Critical failures | `logger.fatal('Database unavailable')` |

### Include Context in Log Messages

```typescript
// ❌ Bad - no context
logger.error('Failed');

// ✅ Good - with context
logger.error({userId: '123', operation: 'login', error: err.message}, 'Login failed');
```

### Use Scoped Loggers

```typescript
// ❌ Bad - no scope
logger.info('User created');

// ✅ Good - with scope
const authLogger = logger.child({scope: 'UserAuth'});
authLogger.info('User created');
```

### Check Logs Before Running Validations

```bash
# Always check logs first for runtime issues
tail -f _logs/server.log

# Then check validation reports for build issues
cat _errors/validation-summary.md
```

### Use Color Themes

```bash
# Choose theme that works for your terminal
LOG_THEME=Dracula pnpm dev  # High contrast
LOG_THEME=Nord pnpm dev     # Clean and minimal
LOG_THEME=Monochrome pnpm dev  # No colors
```

### Clean Up Debug Logging

Before committing, remove or reduce verbose logging:

```typescript
// ❌ Don't commit excessive debug logs
logger.debug('Entering function');
logger.debug('Variable x =', x);
logger.debug('Exiting function');

// ✅ Keep useful logs only
logger.debug({userId, action: 'login'}, 'Authentication attempt');
```

## Related Documentation

- [Quick Reference](/docs/guides/developer-tools/quick-reference.md) - Command lookup including logging commands
- [Validation Tools](/docs/guides/developer-tools/validation-tools.md) - Understanding validation vs. runtime errors
- [Development Workflows](/docs/guides/developer-tools/development-workflow.md) - Debugging in workflow context
- [Troubleshooting](/docs/guides/developer-tools/troubleshooting.md) - Common logging and debugging issues
- [@kit/logger README](/tooling/logger/README.md) - Complete logger documentation
- [brain-monitor README](/tooling/brain-monitor/README.md) - Complete brain-monitor documentation
