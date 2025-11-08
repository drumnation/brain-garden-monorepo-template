# Monorepo Template - Action Plan

**Prepared:** 2025-10-22
**Target:** Complete template validation and preparation

> **⚠️ IMPORTANT NOTE:** The `apps/scheduling-api` directory has been removed from the template. All references to `scheduling-api` in this document are historical. Use `pnpm gen:express-api` to generate backend servers. See CHANGELOG.md for details.

---

## Phase 1: Critical Fixes (Blocking Issues)

These must be fixed before the template is usable.

### 1.1 Apps Are Generated, Not Pre-Built
**Status:** ✅ RESOLVED
**Time:** N/A

**Note:** The `apps/scheduling-api` directory has been removed from the template. Backend servers should be generated using:

```bash
pnpm gen:express-api
```

This generates a new Express API server at `apps/api` with complete testing infrastructure, configurations, and example code. All references to `scheduling-api` in this document are historical.

---

### 1.2 Verify All Turbo Scripts Work
**Status:** ⛔ BLOCKING
**Time:** 20 minutes
**Files Affected:**
- `/turbo.json`
- `/package.json`

**Action:**
```bash
# Test each script
pnpm lint              # Should pass/warn
pnpm typecheck         # Should complete
pnpm test              # Should complete (0 tests is OK)
pnpm validate          # Should run lint + typecheck + test
pnpm clean             # Should clean turbo cache
```

**Expected Output:**
- All commands complete without fatal errors
- Turbo caching works (second run is faster)

**Why:** Turbo pipeline is the foundation of the template

---

### 1.3 Test Brain-Monitor Integration
**Status:** ⛔ BLOCKING
**Time:** 15 minutes
**Files Affected:**
- `tooling/brain-monitor/`
- `_errors/` directory
- `_logs/` directory

**Action:**
```bash
# Verify brain-monitor is accessible
pnpm ls @kit/brain-monitor  # Should be in dependencies

# Verify directories exist
ls -la _errors/
ls -la _logs/

# Try running validation (creates reports)
pnpm run validate

# Check if reports were created
ls -la _errors/
```

**Expected Output:**
- `_errors/validation-summary.md` exists
- `_errors/reports/` contains error reports
- No fatal errors

**Why:** Brain-monitor is core to the workflow

---

### 1.4 Verify Generated App Server Starts
**Status:** ⛔ BLOCKING
**Time:** 20 minutes

**Action:**
```bash
# First, generate an API server
pnpm gen:express-api

# Start the generated app
cd apps/api
pnpm dev

# In another terminal, test it
curl http://localhost:8080/health  # Or appropriate endpoint

# Stop with Ctrl+C
```

**Expected Output:**
- Server starts without errors
- Server listens on port 8080 (or configured port)
- Can stop gracefully with Ctrl+C

**Why:** Verifies the generator creates working applications

---

## Phase 2: Documentation & Configuration

Complete after Phase 1 is verified working.

### 2.1 Add Missing Brain-Monitor Scripts
**Status:** 📋 MEDIUM
**Time:** 15 minutes
**Files Affected:**
- `/package.json` (root)

**Action:**
Edit root package.json, replace the scripts section:

```json
"scripts": {
  "dev": "turbo run dev",
  "build": "turbo run build",
  "lint": "turbo run lint",
  "format": "turbo run format",
  "typecheck": "turbo run typecheck",
  "test": "turbo run test",
  "test:watch": "turbo run test:watch",
  "test:unit": "turbo run test:unit",
  "test:integration": "turbo run test:integration",
  "test:e2e": "turbo run test:e2e",
  "test:storybook": "turbo run test:storybook",
  "test:e2e:browser": "turbo run test:e2e:browser",
  "validate": "turbo run validate",
  "clean": "turbo run clean && rimraf node_modules .turbo",
  "monitor:dev": "node tooling/brain-monitor/cli.mjs dev",
  "monitor:errors": "node tooling/brain-monitor/cli.mjs errors",
  "monitor:logs": "node tooling/brain-monitor/cli.mjs logs",
  "brain:validate": "turbo run validate",
  "brain:watch": "turbo run validate --watch",
  "brain:typecheck-failures": "pnpm --filter=@kit/brain-monitor run typecheck-failures",
  "brain:test-failures-unit": "pnpm --filter=@kit/brain-monitor run test-failures-unit",
  "brain:lint-failures": "pnpm --filter=@kit/brain-monitor run lint-failures"
}
```

**Verification:**
```bash
pnpm brain:validate          # Should work
pnpm monitor:errors          # Should work
```

---

### 2.2 Create Validation Workflow Guide
**Status:** 📋 MEDIUM
**Time:** 30 minutes
**Files to Create:**
- `/docs/guides/validation-workflow.md`

**Content Structure:**
1. Overview of validation tools
2. Brain-monitor workflow
3. Reading error reports
4. Fixing common issues
5. Examples

**Key Sections:**
```markdown
# Validation Workflow

## Quick Start
```bash
pnpm brain:validate          # Full validation
pnpm monitor:errors          # Check errors
pnpm monitor:logs            # Check logs
```

## Understanding Reports
- Location: `_errors/validation-summary.md`
- Error reports in `_errors/reports/`
- Real-time logs in `_logs/`

## Common Fixes
[Include common lint, type, and test errors]
```

---

### 2.3 Create Template Usage Guide
**Status:** 📋 MEDIUM
**Time:** 45 minutes
**Files to Create:**
- `/docs/guides/TEMPLATE_USAGE.md`

**Content Structure:**
```markdown
# Using This Monorepo as a Template

## How to Customize

### 1. Rename the Project
```bash
# Update these values:
# - Project name in package.json
# - App name (e.g., @scheduling-api → @your-app)
# - Package names
```

### 2. Update Documentation
- README.md
- CHANGELOG.md
- Architecture docs

### 3. Customize tooling
- ESLint rules
- Prettier formatting
- TypeScript config

## Step-by-Step Checklist
- [ ] Update package.json name
- [ ] Update app names
- [ ] Update documentation
- [ ] Run validation
- [ ] Create first feature

## Directory Structure
[Explain each directory]

## Key Concepts
- ESM-only
- No-build libraries
- Functional DI patterns
- Brain-monitor coordination
```

---

### 2.4 Sample Tests in Generated Apps
**Status:** ✅ RESOLVED
**Time:** N/A

**Note:** Generated apps (via `pnpm gen:express-api`) automatically include:
- Sample test files demonstrating unit, integration, and E2E patterns
- Vitest configuration using `@kit/testing`
- Complete testing infrastructure

No manual test creation is needed for the template itself.

---

### 2.6 Document Monorepo Structure
**Status:** 📋 MEDIUM
**Time:** 30 minutes
**Files to Create:**
- `/docs/guides/monorepo-structure.md`

**Include:**
- Directory explanation
- Naming patterns
- Package types (app vs library vs tooling)
- ESM-only philosophy
- No-build library approach
- Examples

---

## Phase 3: Advanced Documentation

Complete after Phase 2 is done.

### 3.1 Create "Adding New Packages" Guide
**Status:** 📖 OPTIONAL
**Time:** 30 minutes
**Files to Create:**
- `/docs/guides/adding-new-packages.md`

**Cover:**
- When to create a package
- Directory structure
- Package.json template
- tsconfig.json setup
- Common patterns
- Publishing/versioning

---

### 3.2 Create "Adding New Apps" Guide
**Status:** 📖 OPTIONAL
**Time:** 30 minutes
**Files to Create:**
- `/docs/guides/adding-new-apps.md`

**Cover:**
- When to create an app
- App vs package differences
- Directory structure
- Build configuration
- Environment variables
- Examples (Express, Next.js, etc.)

---

### 3.3 Create Frontend Setup Guide (Optional)
**Status:** 📖 OPTIONAL
**Time:** 45 minutes
**Files to Create:**
- `/docs/guides/adding-react-frontend.md`

**Cover:**
- Decision: Next.js vs Vite vs Remix
- Directory structure
- Setup steps
- TypeScript configuration
- Testing setup
- Example app structure

---

## Phase 4: Testing & Verification

### 4.1 End-to-End Testing Checklist

**Prerequisite:** Generate apps first, then test

Test each of these:

```bash
# Installation
pnpm install                    # ✓ Complete without errors

# Generation (required before dev)
pnpm gen:express-api            # ✓ Generate API server at apps/api

# Development
pnpm dev                        # ✓ Start generated servers
# In new terminal:
curl http://localhost:8080      # ✓ Get response

# Linting & Type Checking
pnpm lint                       # ✓ Show any lint issues
pnpm typecheck                  # ✓ No type errors

# Testing
pnpm test                       # ✓ Run tests for generated apps
pnpm test:watch                 # ✓ Start watch mode
pnpm test:unit                  # ✓ Run unit tests only

# Validation
pnpm validate                   # ✓ Full validation

# Brain-Monitor
pnpm brain:validate             # ✓ Generate reports
cat _errors/validation-summary.md  # ✓ See summary
pnpm monitor:errors             # ✓ Show errors
pnpm monitor:logs               # ✓ Show logs

# Cleanup
pnpm clean                      # ✓ Clean build artifacts
```

**Success Criteria:** All commands complete successfully after generating apps

---

### 4.2 Template Usability Test

Clone and test the template as a new user would:

```bash
# Simulate new project
cp -r . ~/test-template
cd ~/test-template

# Customize
# 1. Update root package.json name
# 2. Update README with project details
# 3. Generate your first app

# Generate apps and verify
pnpm install
pnpm gen:express-api            # Generate API at apps/api
pnpm dev                        # Start generated apps
# Test app...
pnpm validate
```

---

## Priority Matrix

| Task | Phase | Priority | Time | Impact |
|---|---|---|---|---|
| Generate & verify app | 1 | 🔴 CRITICAL | 20m | Primary workflow |
| Verify Turbo scripts | 1 | 🔴 CRITICAL | 20m | Foundation |
| Test brain-monitor | 1 | 🔴 CRITICAL | 15m | Core workflow |
| Test app generators | 1 | 🔴 CRITICAL | 20m | Core functionality |
| Add brain-monitor scripts | 2 | 🟠 HIGH | 15m | Developer experience |
| Validation guide | 2 | 🟠 HIGH | 30m | Documentation |
| Template guide | 2 | 🟠 HIGH | 45m | Reusability |
| Generated app tests | 2 | ✅ RESOLVED | N/A | Auto-generated |
| Structure guide | 2 | 🟡 MEDIUM | 30m | Understanding |
| Frontend guide | 3 | 🟢 LOW | 45m | Optional |
| Package guide | 3 | 🟢 LOW | 30m | Reference |
| App guide | 3 | 🟢 LOW | 30m | Reference |

---

## Recommended Execution Order

### Day 1: Generator Verification (1.5 hours)
1. Test app generators (gen:express-api, etc.)
2. Verify Turbo pipeline with generated apps
3. Test brain-monitor integration
4. Verify generated app servers start

### Day 2: Core Documentation (2 hours)
1. Add brain-monitor scripts
2. Create validation guide
3. Create template usage guide
4. Add sample test

### Day 3: Reference Documentation (1.5 hours)
1. Add vitest.config.ts
2. Document structure
3. Create package guide
4. Create app guide

### Day 4: Verification (1 hour)
1. Test all scripts
2. Run validation
3. Test as template (clone/customize)
4. Final review

---

## Success Criteria

Template is **complete** when:

- [x] All Phase 1 items verified working
- [x] All critical issues fixed
- [x] All core documentation written
- [x] Template can be cloned and customized
- [x] New projects can be initialized from template
- [x] All scripts work as documented
- [x] Validation pipeline produces clean reports

---

## File Checklist

### To Verify
- [ ] App generators work (`pnpm gen:express-api`, etc.)
- [ ] Generated apps have complete testing infrastructure
- [ ] `/package.json` (root) - Brain-monitor scripts present

### To Create/Update
- [ ] `/docs/guides/validation-workflow.md`
- [ ] `/docs/guides/TEMPLATE_USAGE.md`
- [ ] `/docs/guides/monorepo-structure.md`
- [ ] `/docs/guides/using-generators.md` (document gen:express-api and other generators)
- [ ] `/docs/guides/adding-new-packages.md` (optional)
- [ ] `/docs/guides/adding-react-frontend.md` (optional)

---

## Notes

- All timings are estimates
- Parallel work possible where noted
- Phase 1 must complete before Phase 2-3
- Testing phase validates everything
- Template can be published after Phase 2 + testing
- Phase 3 items are nice-to-have, not blocking

---

**Status:** Ready for implementation
**Assigned:** Developer team
**Target Completion:** 4 days
**Review Date:** Post-completion
