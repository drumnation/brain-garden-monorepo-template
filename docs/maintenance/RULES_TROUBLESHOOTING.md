---
title: "Rules Troubleshooting Guide"
description: "Quick reference for common rule system issues and solutions"
keywords: [rules, troubleshooting, debugging, errors]
last_updated: "2025-10-22"
---

# Rules Troubleshooting Guide

Quick reference for common issues with the rule system and their solutions.

## Table of Contents

1. [Rule Not Appearing in Expected Context](#rule-not-appearing-in-expected-context)
2. [Rule Appearing in Wrong Context](#rule-appearing-in-wrong-context)
3. [Build Warnings](#build-warnings)
4. [Verification Failures](#verification-failures)
5. [CLI Not Loading Rules](#cli-not-loading-rules)
6. [Performance Issues](#performance-issues)
7. [Frontmatter Errors](#frontmatter-errors)

---

## Rule Not Appearing in Expected Context

### Symptom

Rule doesn't show up in expected `CLAUDE.md`, `AGENTS.md`, or other generated file.

### Common Causes

1. **Scopes don't match context**
2. **Invalid YAML frontmatter**
3. **Rule file not in source directory**
4. **Build not run after changes**

### Diagnosis

**Step 1: Check scopes**
```bash
# View rule frontmatter
head -n 20 .cursor/rules-source/my-rule.rules.mdc

# Compare to context scopes
cat .cursor/sync/contexts.ts | grep -A 5 "name: 'My Context'"
```

**Expected output:**
```yaml
---
scopes:
  - react
  - frontend
---
```

**Step 2: Verify context scopes**
```typescript
// In .cursor/sync/contexts.ts
{
  name: 'React/Frontend',
  path: join(ROOT_DIR, 'apps/client/'),
  scopes: ['monorepo', 'global', 'react', 'frontend', 'ui', 'components']
}
```

**Step 3: Run verification**
```bash
pnpm rules:verify
```

**Look for:**
```
❌ Under-Distribution (1 context):
   ✗ apps/client:
      Missing: my-rule
```

### Solutions

**Solution 1: Add matching scope**
```yaml
# Before
---
scopes:
  - backend
---

# After (to include in frontend context)
---
scopes:
  - backend
  - frontend  # Added
---
```

**Solution 2: Use global scope**
```yaml
# Apply to all contexts
---
scopes:
  - global
---
```

**Solution 3: Check alwaysApply flag**
```yaml
# Apply everywhere regardless of context
---
alwaysApply: true
scopes: []  # Can be empty when alwaysApply is true
---
```

**Solution 4: Rebuild**
```bash
pnpm rules:build:verify
```

### Verification

```bash
# Check rule appears in target context
cat apps/client/CLAUDE.md | grep "My Rule"

# Check all contexts where it appears
grep -r "My Rule" apps/*/CLAUDE.md packages/*/CLAUDE.md
```

---

## Rule Appearing in Wrong Context

### Symptom

Rule shows up in unintended `CLAUDE.md` or `AGENTS.md` file (e.g., backend rule in frontend context).

### Common Causes

1. **Overly broad scopes** (e.g., `global`)
2. **Unintended scope match**
3. **Multiple scopes causing unexpected distribution**

### Diagnosis

**Step 1: Check where rule appears**
```bash
# Find all occurrences
grep -r "My Rule" apps/*/CLAUDE.md packages/*/CLAUDE.md
```

**Step 2: Check rule scopes**
```bash
head -n 20 .cursor/rules-source/my-rule.rules.mdc
```

**Step 3: Compare to context scopes**
```bash
cat .cursor/sync/contexts.ts | grep -B 2 -A 5 "scopes:"
```

### Solutions

**Solution 1: Remove broad scopes**
```yaml
# Before (appears everywhere)
---
scopes:
  - global
  - react
---

# After (only in React contexts)
---
scopes:
  - react
---
```

**Solution 2: Use more specific scopes**
```yaml
# Before (too broad - matches many contexts)
---
scopes:
  - backend
  - frontend
---

# After (specific to Express backend)
---
scopes:
  - express
  - api
---
```

**Solution 3: Check for scope overlap**
```yaml
# This will match BOTH frontend and backend contexts
---
scopes:
  - react      # Matches frontend
  - express    # Matches backend
---

# Fix: Split into two rules if different concerns
# Rule 1: React-specific
---
scopes:
  - react
---

# Rule 2: Express-specific
---
scopes:
  - express
---
```

**Solution 4: Rebuild and verify**
```bash
pnpm rules:build:verify
```

### Verification

```bash
# Run verification to see distribution
pnpm rules:verify

# Check for over-distribution warnings
# Look for:
⚠️  Over-Distribution (1 context):
   ⚠  apps/server:
      Has unexpected: my-react-rule
```

---

## Build Warnings

### Warning: Failed to Parse Frontmatter

**Symptom:**
```
⚠️  my-rule.rules.mdc: Failed to parse frontmatter
```

**Cause:** Invalid YAML syntax in frontmatter.

**Common YAML mistakes:**

1. **Using tabs instead of spaces**
   ```yaml
   # ❌ WRONG (tab character)
   ---
   scopes:
   →	- react
   ---

   # ✅ CORRECT (spaces)
   ---
   scopes:
     - react
   ---
   ```

2. **Inconsistent indentation**
   ```yaml
   # ❌ WRONG
   ---
   globs:
     - "path/**/*.ts"
      - "other/**/*.ts"  # Extra space
   ---

   # ✅ CORRECT
   ---
   globs:
     - "path/**/*.ts"
     - "other/**/*.ts"
   ---
   ```

3. **Missing quotes for special characters**
   ```yaml
   # ❌ WRONG
   ---
   description: Rule with: colons causes issues
   ---

   # ✅ CORRECT
   ---
   description: "Rule with: colons is fine"
   ---
   ```

4. **Missing required fields**
   ```yaml
   # ❌ WRONG (missing globs)
   ---
   description: My rule
   scopes:
     - react
   ---

   # ✅ CORRECT
   ---
   description: My rule
   globs:
     - "apps/**/*.tsx"
   scopes:
     - react
   alwaysApply: false
   ---
   ```

**Solution:**
1. Validate YAML syntax using online tool: https://www.yamllint.com/
2. Fix indentation (use spaces, not tabs)
3. Add quotes around values with special characters
4. Ensure all required fields present
5. Rebuild: `pnpm rules:build`

### Warning: Unknown Scope

**Symptom:**
```
⚠️  my-rule.rules.mdc uses unknown scope: custom-scope
```

**Cause:** Scope value not in `VALID_SCOPES` array in build script.

**Expected for:**
- Specialized scopes (e.g., `proxy`, `middleware`)
- Domain-specific scopes (e.g., `cm-proxy`, `flight-boards`)
- Experimental features

**Solution (if unintended):**

1. **Use known scope from valid list:**
   ```yaml
   # Before
   ---
   scopes:
     - custom-scope  # Unknown
   ---

   # After
   ---
   scopes:
     - backend  # Known scope
   ---
   ```

2. **Add scope to build script** (if it's a common pattern):
   ```typescript
   // In .cursor/sync/build-consolidated-rules.ts
   const VALID_SCOPES = [
     'monorepo', 'global', 'shared',
     'react', 'frontend', 'ui', 'components', 'storybook', 'vite', 'mantine',
     'express', 'backend', 'api', 'node', 'mongodb',
     'tooling', 'services', 'testing',
     'custom-scope'  // Add your scope here
   ];
   ```

3. **Rebuild:**
   ```bash
   pnpm rules:build
   ```

**Solution (if intentional):**
- Safe to ignore warning
- Scope will still work for distribution
- Consider documenting specialized scopes in README

### Warning: Exceeds 12K Characters

**Symptom:**
```
⚠️  my-rule.rules.mdc exceeds 12K chars (15000), consider splitting
```

**Cause:** Rule file is large (>12,000 characters), which may impact Windsurf and Cline performance.

**Impact:**
- Rule still works
- May slow down CLI loading
- Windsurf performance degradation possible

**Solution:**

**Option 1: Split into focused sub-rules**
```bash
# Before: One large rule
tests.unified-testing.rules.mdc (15K chars)

# After: Split by concern
tests.unit-testing.rules.mdc (4K chars)
tests.integration-testing.rules.mdc (5K chars)
tests.e2e-testing.rules.mdc (4K chars)
```

**Option 2: Move examples to separate file**
```markdown
# In rule file (smaller)
See `examples.md` for detailed examples.

# In examples.md (not included in build)
[Detailed examples here]
```

**Option 3: Simplify content**
- Remove verbose examples
- Link to external documentation
- Use tables instead of long prose

**Option 4: Accept warning**
- If rule content is essential
- Document why it's large
- Monitor for performance issues

### Warning: Contradictory alwaysApply

**Symptom:**
```
⚠️  my-rule.rules.mdc has alwaysApply:true but also specific scopes (contradictory)
```

**Cause:** Rule has both `alwaysApply: true` AND specific scopes, which is contradictory.

**Explanation:**
- `alwaysApply: true` means "load in all contexts"
- Specific scopes mean "load only in matching contexts"
- Having both doesn't make sense

**Solution:**

**Option 1: Use alwaysApply only**
```yaml
# For truly global rules
---
alwaysApply: true
scopes: []  # Empty or omit
---
```

**Option 2: Use scopes only**
```yaml
# For context-specific rules
---
alwaysApply: false
scopes:
  - react
  - frontend
---
```

**Option 3: Use global scope**
```yaml
# Alternative to alwaysApply
---
alwaysApply: false
scopes:
  - global  # Appears everywhere
---
```

---

## Verification Failures

### Under-Distribution Detected

**Symptom:**
```
❌ Under-Distribution (1 context):
   ✗ packages/shared-ui:
      Missing: my-rule
```

**Cause 1: Rule scopes don't match context scopes**

**Diagnosis:**
```bash
# Check rule scopes
head -n 10 .cursor/rules-source/my-rule.rules.mdc

# Check context scopes
cat .cursor/sync/contexts.ts | grep -A 5 "shared-ui"
```

**Solution:**
Add matching scope to rule frontmatter:
```yaml
# Before
---
scopes:
  - backend
---

# After (to include in shared-ui context)
---
scopes:
  - backend
  - ui  # Added to match shared-ui context
---
```

**Cause 2: Cosmetic naming mismatch (common)**

**Diagnosis:**
```bash
# Manually inspect AGENTS.md to confirm rule is present
cat packages/shared-ui/AGENTS.md | grep -i "my rule"
```

**If rule content is present:**
- This is a cosmetic verification issue
- Rule is correctly distributed
- Safe to ignore warning

**Explanation:** Rule names in source files (e.g., `tests.tdd-workflow`) may differ from generated section headers (e.g., `TDD Workflow`), causing verification script to report false negatives.

**Solution:**
- Accept warning if rule content is present
- Or normalize rule naming in verification script (future improvement)

### Over-Distribution Detected

**Symptom:**
```
⚠️  Over-Distribution (1 context):
   ⚠  apps/server:
      Has unexpected: react-component-pattern
```

**Cause:** Rule has scopes that match backend context unintentionally.

**Diagnosis:**
```bash
# Check rule scopes
head -n 10 .cursor/rules-source/react-component-pattern.rules.mdc

# Check server context scopes
cat .cursor/sync/contexts.ts | grep -A 5 "'Express/Backend'"
```

**Common issue:** Rule has `global` or `monorepo` scope, which matches all contexts.

**Solution:**
```yaml
# Before (matches all contexts)
---
scopes:
  - global
  - react
---

# After (only React contexts)
---
scopes:
  - react
  - frontend
  - ui
---
```

### Missing AGENTS.md Files

**Symptom:**
```
❌ Missing AGENTS.md files (1):
   ✗ apps/my-app/AGENTS.md
```

**Cause:** Context directory exists but `AGENTS.md` wasn't generated.

**Diagnosis:**
```bash
# Check if directory exists
ls -la apps/my-app/

# Check if context is defined
cat .cursor/sync/contexts.ts | grep -i "my-app"
```

**Solution 1: Context not defined**

Add context to `.cursor/sync/contexts.ts`:
```typescript
{
  name: 'My App',
  path: join(ROOT_DIR, 'apps/my-app/'),
  description: 'My app description',
  scopes: ['monorepo', 'global', 'react', 'frontend']
}
```

Rebuild:
```bash
pnpm rules:build
```

**Solution 2: Directory doesn't exist**

Verification expected directory that doesn't exist. Safe to ignore or remove from `HIERARCHICAL_CONTEXTS`.

---

## CLI Not Loading Rules

### Cursor Not Loading Rules

**Symptom:** Rules don't activate when editing files in Cursor.

**Diagnosis:**

1. **Check .mdc files exist:**
   ```bash
   ls .cursor/rules-source/*.mdc
   ```

2. **Check Cursor settings:**
   - Open Cursor Settings
   - Navigate to Rules section
   - Verify rules are enabled

3. **Check file patterns (globs):**
   ```bash
   # View rule frontmatter
   head -n 20 .cursor/rules-source/my-rule.rules.mdc
   ```

**Solution:**

1. **Ensure globs match current file:**
   ```yaml
   # Example: For TypeScript files
   globs:
     - "**/*.ts"
     - "**/*.tsx"
   ```

2. **Restart Cursor:**
   - Close all windows
   - Reopen project

3. **Check Cursor version:**
   - Update to latest version
   - Verify .mdc format is supported

### Cline Not Loading Rules

**Symptom:** Rules don't appear in Cline or aren't available for toggling.

**Diagnosis:**

1. **Check .clinerules folder exists:**
   ```bash
   ls -la .clinerules/
   ```

2. **Check meta-instructions:**
   ```bash
   cat .clinerules/00-meta-instructions.md
   ```

3. **Check rule files:**
   ```bash
   ls .clinerules/*.md
   ```

**Solution:**

1. **Rebuild Cline rules:**
   ```bash
   pnpm rules:build
   ```

2. **Verify folder structure:**
   ```
   .clinerules/
   ├── 00-meta-instructions.md
   ├── 01-monorepo-structure-and-configuration.md
   ├── 02-atomic-design-component-strategy.md
   └── ... (numbered files)
   ```

3. **Restart Cline:**
   - Close and reopen Cline panel
   - Check rule toggle popover

### Windsurf Not Loading Rules

**Symptom:** Rules don't activate in Windsurf.

**Diagnosis:**

1. **Check .windsurfrules file exists:**
   ```bash
   ls -la .windsurfrules
   ```

2. **Check file size:**
   ```bash
   wc -c .windsurfrules
   # Should be < 12,000 characters for optimal performance
   ```

3. **Check file format:**
   ```bash
   head -n 50 .windsurfrules
   ```

**Solution:**

1. **Rebuild Windsurf rules:**
   ```bash
   pnpm rules:build
   ```

2. **Verify file structure:**
   ```markdown
   # Cortals Monorepo Development Rules

   **Generated:** YYYY-MM-DD

   ## Rule Name

   **Activation:** Always On | Glob-Based | Model Decision
   ...
   ```

3. **Check activation mode:**
   - Always On rules should load automatically
   - Glob-Based rules activate on file pattern match
   - Model Decision rules load based on LLM analysis

### Gemini Not Loading Rules

**Symptom:** Rules don't load via @import directives in Gemini.

**Diagnosis:**

1. **Check GEMINI.md files exist:**
   ```bash
   ls GEMINI.md
   ls apps/*/GEMINI.md
   ```

2. **Check @import paths:**
   ```bash
   cat GEMINI.md | grep "@"
   ```

3. **Verify relative paths are correct:**
   ```markdown
   @.cursor/rules-source/my-rule.rules.mdc
   ```

**Solution:**

1. **Rebuild Gemini hierarchy:**
   ```bash
   pnpm rules:build
   ```

2. **Verify @import paths are relative:**
   ```markdown
   # Root GEMINI.md
   @.cursor/rules-source/rule.mdc

   # Context GEMINI.md (apps/client/)
   @../../.cursor/rules-source/rule.mdc
   ```

3. **Check Gemini version:**
   - Update to latest version
   - Verify @import syntax is supported

---

## Performance Issues

### Slow Rule Loading

**Symptom:** CLI takes a long time to load rules.

**Causes:**
1. Rules exceed 12K characters
2. Too many rules loaded simultaneously
3. Complex glob patterns

**Solutions:**

1. **Split large rules:**
   ```bash
   # Check rule sizes
   wc -c .cursor/rules-source/*.mdc | sort -n

   # Split rules >12K characters
   ```

2. **Use more specific scopes:**
   ```yaml
   # Instead of loading all rules everywhere
   scopes:
     - global  # Too broad

   # Use specific scopes
   scopes:
     - react
     - frontend
   ```

3. **Simplify glob patterns:**
   ```yaml
   # Complex (slow)
   globs:
     - "**/{src,lib,components}/**/*.{ts,tsx,js,jsx}"

   # Simpler (faster)
   globs:
     - "src/**/*.tsx"
   ```

### High Memory Usage

**Symptom:** CLI consumes excessive memory when loading rules.

**Solutions:**

1. **Disable unused rules in Cline:**
   - Use rule toggle popover
   - Disable rules not relevant to current task

2. **Use context-specific rules:**
   - Navigate to specific context (e.g., `apps/client/`)
   - Load context-specific `CLAUDE.md` instead of root

3. **Monitor rule count:**
   ```bash
   # Check how many rules apply to context
   cat apps/client/CLAUDE.md | grep "^## " | wc -l
   ```

---

## Frontmatter Errors

### Missing Required Field

**Symptom:**
```
⚠️  my-rule.rules.mdc is missing required field: globs
```

**Solution:**
Add missing field to frontmatter:
```yaml
---
description: My rule description
globs:  # Added
  - "**/*.ts"
scopes:
  - react
alwaysApply: false
---
```

### Invalid Array Format

**Symptom:** Globs or scopes not recognized as arrays.

**Wrong:**
```yaml
---
globs: "**/*.ts"  # String, not array
scopes: react     # String, not array
---
```

**Correct:**
```yaml
---
globs:
  - "**/*.ts"     # Array
scopes:
  - react         # Array
---
```

### Empty Arrays When alwaysApply is True

**Symptom:** Warning about empty globs when `alwaysApply: true`.

**Explanation:** When `alwaysApply: true`, globs can be empty (rule applies everywhere).

**Correct:**
```yaml
---
description: Global rule
globs: []  # Empty is OK when alwaysApply is true
scopes:
  - global
alwaysApply: true
---
```

---

## Getting Help

### Diagnostic Commands

```bash
# Check rule distribution
pnpm rules:verify

# View build output
pnpm rules:build

# List all source rules
ls .cursor/rules-source/*.mdc

# Check specific context
cat apps/client/CLAUDE.md | grep "Rule Name"

# View rule frontmatter
head -n 20 .cursor/rules-source/my-rule.rules.mdc

# Check context definitions
cat .cursor/sync/contexts.ts
```

### Logging and Debugging

Enable detailed logging:
```bash
# Verbose build output
DEBUG=* pnpm rules:build

# Watch mode with logging
pnpm rules:watch 2>&1 | tee build.log
```

### Resources

- [RULE_SYSTEM.md](./RULE_SYSTEM.md) - Comprehensive architecture documentation
- [RULES_MIGRATION_GUIDE.md](./RULES_MIGRATION_GUIDE.md) - Migration guide
- [.cursor/rules-source/README.md](../../.cursor/rules-source/README.md) - Source rules documentation
- [Build script](../../.cursor/sync/build-consolidated-rules.ts) - Implementation details
- [Verification script](../../scripts/verify-rule-distribution.ts) - Distribution audit logic

### Reporting Issues

When reporting issues, include:

1. **Error message** (exact text)
2. **Command run** (e.g., `pnpm rules:build`)
3. **Rule frontmatter** (anonymized if needed)
4. **Context scopes** (from `contexts.ts`)
5. **Expected vs actual behavior**
6. **Steps to reproduce**

---

**Last Updated:** 2025-10-22
**Version:** 1.0.0
