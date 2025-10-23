---
title: "Rules Migration Guide"
description: "Guide for transitioning from consolidated rules to the restored rule system"
keywords: [rules, migration, consolidation, restoration]
last_updated: "2025-10-22"
---

# Rules Migration Guide

This guide helps developers and AI agents transition from the old consolidated rules system to the new restored rule system.

## Table of Contents

1. [What Changed](#what-changed)
2. [For Developers](#for-developers)
3. [For AI Agents](#for-ai-agents)
4. [Breaking Changes](#breaking-changes)
5. [Action Items](#action-items)
6. [FAQ](#faq)

---

## What Changed

### System Evolution Timeline

**Original System (Pre-Consolidation)**
- 19 detailed rule files in `.cursor/rules/`
- Each file focused on single concern
- Direct loading by Cursor
- No build system required

**Consolidated System (Previous)**
- 10 consolidated rule files in `.cursor/rules/`
- Multiple concerns combined per file
- Simplified structure but lost granularity
- Direct loading by Cursor

**Restored System (Current)**
- 19 original detailed rules restored to `.cursor/rules-source/`
- Single source of truth with YAML frontmatter
- Build system generates CLI-specific formats
- Scope-based intelligent distribution

### Key Differences

| Aspect | Consolidated (Old) | Restored (New) |
|--------|-------------------|----------------|
| **File Count** | 10 files | 19 files |
| **Location** | `.cursor/rules/` | `.cursor/rules-source/` |
| **Granularity** | Multiple concerns per file | One concern per file |
| **Frontmatter** | Minimal metadata | Normalized YAML with scopes |
| **Distribution** | Manual, direct loading | Automated, CLI-specific |
| **Outputs** | Single format | 5 CLI formats (Cursor, Cline, Windsurf, Gemini, Brain Garden) |
| **Build System** | None | Required (`pnpm rules:build`) |
| **Verification** | Manual inspection | Automated (`pnpm rules:verify`) |

### File Mapping

How the 10 consolidated files map to 19 restored files:

**01-foundation.rules.mdc** →
- `monorepo-structure-and-configuration.rules.mdc`

**02-validation-testing.rules.mdc** →
- `tests.tdd-workflow.rules.mdc`
- `tests.continuous-validation.rules.mdc`
- `tests.unified-testing.rules.mdc`
- `testid.rules.mdc`
- `brain-monitor-validation.rules.mdc`

**03-frontend-patterns.rules.mdc** →
- `atomic-design-component-strategy.rules.mdc`
- `storybook-first-composition.rules.mdc`
- `mobile-first-design.rules.mdc`
- `component-design-decision-tree.rules.mdc`
- `platform-pathways-pattern.rules.mdc`

**04-react-standards.rules.mdc** →
- `react-bulletproof-component-pattern.rules.mdc`

**05-backend-express.rules.mdc** →
- `monorepo-node-express-architecture.rules.mdc`

**06-backend-functional.rules.mdc** →
- `node.functional-isolated-concerns.rules.mdc`

**07-documentation.rules.mdc** →
- `monorepo-documentation-strategy.rules.mdc`
- `monorepo-package-docs-versioning.rules.mdc`

**08-workflow.rules.mdc** →
- `pr-creation-guidelines.mdc`

**09-agent-documentation-coordination.rules.mdc** →
- *(Integrated into documentation rules)*

**10-storybook.rules.mdc** →
- *(Merged into storybook-first-composition rule)*

**New Backend Rules:**
- `cm-proxy-rules.mdc`
- `project-wide-proxy-rules.mdc`

### Directory Structure Changes

**Old structure:**
```
.cursor/
└── rules/
    ├── 01-foundation.rules.mdc
    ├── 02-validation-testing.rules.mdc
    ├── 03-frontend-patterns.rules.mdc
    └── ... (10 files total)
```

**New structure:**
```
.cursor/
├── rules-source/                           # SOURCE OF TRUTH
│   ├── README.md
│   ├── monorepo-structure-and-configuration.rules.mdc
│   ├── tests.tdd-workflow.rules.mdc
│   └── ... (19 files total)
├── sync/
│   ├── build-consolidated-rules.ts         # Build script
│   ├── contexts.ts                         # Context definitions
│   └── build-consolidated-rules-and-verify.ts
└── (generated outputs)
    ├── /CLAUDE.md                          # Root + context-specific
    ├── /.clinerules/                       # Cline folder
    ├── /.windsurfrules                     # Windsurf file
    └── /GEMINI.md                          # Gemini hierarchy
```

---

## For Developers

### Updated Workflow

**Old workflow (Consolidated):**
```bash
# 1. Edit rule file directly
vim .cursor/rules/03-frontend-patterns.rules.mdc

# 2. Save and commit
git add .cursor/rules/03-frontend-patterns.rules.mdc
git commit -m "Updated frontend patterns"

# 3. No build step needed
```

**New workflow (Restored):**
```bash
# 1. Edit source rule file
vim .cursor/rules-source/atomic-design-component-strategy.rules.mdc

# 2. Build and verify
pnpm rules:build:verify

# 3. Commit both source and generated files
git add .cursor/rules-source/atomic-design-component-strategy.rules.mdc
git add CLAUDE.md apps/*/CLAUDE.md packages/*/CLAUDE.md
git add .clinerules/ .windsurfrules GEMINI.md AGENTS.md
git commit -m "Updated atomic design strategy"
```

### How to Find Rules Now

**Old:** Navigate to `.cursor/rules/` and look for numbered files.

**New:** Navigate to `.cursor/rules-source/` and look for descriptive filenames.

**Search strategies:**

1. **By category** (see README.md in `.cursor/rules-source/`):
   - Foundation: `monorepo-structure-and-configuration`
   - React/Frontend: `atomic-design-*`, `react-*`, `mobile-*`, etc.
   - Backend: `monorepo-node-express-*`, `node.functional-*`, `*-proxy-*`
   - Testing: `tests.*`, `testid`, `brain-monitor-*`
   - Documentation: `monorepo-documentation-*`, `pr-creation-*`

2. **By file pattern:**
   ```bash
   # List all rules
   ls .cursor/rules-source/*.mdc

   # Find rules by keyword
   grep -l "React" .cursor/rules-source/*.mdc

   # Search rule content
   grep -r "TDD" .cursor/rules-source/
   ```

3. **By scope** (check frontmatter):
   ```bash
   # Find all React-scoped rules
   grep -l "scopes:.*react" .cursor/rules-source/*.mdc
   ```

### How to Modify Rules

**Step-by-step:**

1. **Locate the source file** in `.cursor/rules-source/`:
   ```bash
   # Example: updating TDD workflow
   vim .cursor/rules-source/tests.tdd-workflow.rules.mdc
   ```

2. **Edit rule content** (preserve frontmatter):
   ```yaml
   ---
   description: Brief description
   globs: ["path/**/*.ts"]
   scopes: [testing, tdd]
   alwaysApply: false
   ---

   # Your rule content here
   ```

3. **Rebuild distribution**:
   ```bash
   pnpm rules:build:verify
   ```

4. **Verify changes propagated**:
   ```bash
   # Check root CLAUDE.md
   cat CLAUDE.md | grep "TDD"

   # Check context-specific CLAUDE.md
   cat apps/client/CLAUDE.md | grep "TDD"

   # Check Cline rules
   ls .clinerules/ | grep tdd
   ```

5. **Commit all changes**:
   ```bash
   git add .cursor/rules-source/tests.tdd-workflow.rules.mdc
   git add CLAUDE.md apps/*/CLAUDE.md # (auto-generated)
   git add .clinerules/ .windsurfrules GEMINI.md AGENTS.md
   git commit -m "Updated TDD workflow rule"
   ```

### New Verification Commands

Use these commands to validate your changes:

```bash
# Build rules from source
pnpm rules:build

# Strict mode (warnings = errors)
pnpm rules:build:strict

# Verify distribution correctness
pnpm rules:verify

# Build + verify in one step
pnpm rules:build:verify

# Watch mode (auto-rebuild on changes)
pnpm rules:watch
```

### Understanding Generated Files

**DO NOT EDIT THESE FILES DIRECTLY:**

- `CLAUDE.md` (root and context-specific)
- `AGENTS.md` (root and context-specific)
- `GEMINI.md` (root and context-specific)
- `.clinerules/` folder contents
- `.windsurfrules` file

**WHY?** These files are auto-generated from `.cursor/rules-source/`. Edits will be overwritten on next build.

**INSTEAD:** Edit source files in `.cursor/rules-source/` and rebuild.

---

## For AI Agents

### How Rules Are Loaded Per CLI

**Cursor:**
- Reads `.mdc` files **directly** from `.cursor/rules-source/`
- `CLAUDE.md` files are reference documentation only
- Scope-based activation via glob patterns in frontmatter

**Cline:**
- Loads rules from `.clinerules/` folder
- Meta-instructions in `00-meta-instructions.md`
- Numbered rule files (`01-XX-<rule-name>.md`)
- Toggle rules on/off via popover menu

**Windsurf:**
- Loads single `.windsurfrules` file
- Rules categorized by activation mode:
  - Always On (alwaysApply: true)
  - Glob-Based (file patterns)
  - Model Decision (LLM decides)

**Gemini:**
- Loads `GEMINI.md` files hierarchically
- Foundation rules via `@import` at root
- Context-specific rules via `@import` in subdirectories

**Brain Garden:**
- Loads `AGENTS.md` files hierarchically
- Rules grouped by core (always apply) and contextual (when relevant)

### Scope-Based Activation

Rules now include `scopes` in frontmatter to enable intelligent activation:

```yaml
---
scopes:
  - react
  - frontend
  - ui
---
```

**How scopes work:**

1. **Global scope**: Rule applies everywhere
   ```yaml
   scopes: [global]
   ```

2. **Specific scopes**: Rule applies in matching contexts
   ```yaml
   scopes: [react, frontend]
   ```

3. **No scopes**: Rule applies everywhere (default to global)
   ```yaml
   scopes: []  # or omitted
   ```

**Example matching:**

Rule with `scopes: [react, frontend]` appears in:
- Root `CLAUDE.md` (includes all)
- `apps/client/CLAUDE.md` (frontend context)
- `packages/shared-ui/CLAUDE.md` (UI context)

Rule does NOT appear in:
- `apps/server/CLAUDE.md` (backend context)
- `tooling/testing/CLAUDE.md` (testing context)

### Context-Aware Rule Selection

Each context has defined scopes (see `.cursor/sync/contexts.ts`):

**Frontend contexts:**
```typescript
{
  name: 'React/Frontend',
  path: 'apps/client/',
  scopes: ['monorepo', 'global', 'react', 'frontend', 'ui', 'components']
}
```

**Backend contexts:**
```typescript
{
  name: 'Express/Backend',
  path: 'apps/server/',
  scopes: ['monorepo', 'global', 'express', 'backend', 'api', 'node']
}
```

**Testing contexts:**
```typescript
{
  name: 'Testing',
  path: 'tooling/testing/',
  scopes: ['monorepo', 'global', 'node', 'tooling', 'testing']
}
```

**Agent behavior:**

When working in `apps/client/`:
- Load rules with scopes: `react`, `frontend`, `ui`, `components`, `global`, `monorepo`
- Skip rules with only backend scopes

When working in `apps/server/`:
- Load rules with scopes: `express`, `backend`, `api`, `node`, `global`, `monorepo`
- Skip rules with only frontend scopes

---

## Breaking Changes

### None Expected (Backward Compatible)

The restoration is **fully backward compatible**:

- Rule content unchanged (restored from originals)
- Generated file formats maintain same structure
- CLI platforms continue working without changes
- No breaking changes to rule semantics

### Workflow Changes (Not Breaking)

**New requirement:** Run `pnpm rules:build` after editing source files.

**Why?** Source files (`.cursor/rules-source/`) are now separate from generated outputs.

**Impact:** Minimal - adds one command to workflow.

**Automation options:**

1. **Git pre-commit hook** (auto-rebuild):
   ```bash
   # .husky/pre-commit
   pnpm rules:build:verify
   ```

2. **Watch mode** (auto-rebuild on save):
   ```bash
   pnpm rules:watch
   ```

3. **Manual** (explicit rebuild):
   ```bash
   pnpm rules:build:verify
   ```

---

## Action Items

### For Existing Projects Using Old Rules

**If you're on an older branch/fork:**

1. **Pull latest changes:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Verify new structure exists:**
   ```bash
   ls .cursor/rules-source/
   # Should show 19 .mdc files
   ```

3. **Run initial build:**
   ```bash
   pnpm rules:build:verify
   ```

4. **Update bookmarks/workflows:**
   - Change references from `.cursor/rules/` to `.cursor/rules-source/`
   - Add build step to workflows

### How to Test New System

**Verification checklist:**

- [ ] Source rules exist: `ls .cursor/rules-source/*.mdc`
- [ ] Build script runs: `pnpm rules:build`
- [ ] Verification passes: `pnpm rules:verify`
- [ ] Generated files exist:
  - [ ] `CLAUDE.md` at root
  - [ ] `CLAUDE.md` in contexts (apps/, packages/)
  - [ ] `.clinerules/` folder
  - [ ] `.windsurfrules` file
  - [ ] `GEMINI.md` at root and contexts
  - [ ] `AGENTS.md` at root and contexts
- [ ] Your CLI loads rules correctly:
  - [ ] Cursor: Check rules activate on file open
  - [ ] Cline: Check `.clinerules/` folder loads
  - [ ] Windsurf: Check `.windsurfrules` loads
  - [ ] Gemini: Check `GEMINI.md` imports work

**Test workflow:**

1. **Edit a source rule:**
   ```bash
   echo "# Test addition" >> .cursor/rules-source/tests.tdd-workflow.rules.mdc
   ```

2. **Rebuild:**
   ```bash
   pnpm rules:build:verify
   ```

3. **Verify change propagated:**
   ```bash
   grep "Test addition" CLAUDE.md
   grep "Test addition" .clinerules/05-tests-tdd-workflow.md
   ```

4. **Rollback test change:**
   ```bash
   git checkout .cursor/rules-source/tests.tdd-workflow.rules.mdc
   pnpm rules:build
   ```

### Rollback Procedure (If Needed)

**If you encounter issues and need to rollback:**

1. **Check if backup exists:**
   ```bash
   ls .cursor/rules-consolidated-backup/
   # Should show 10 consolidated files
   ```

2. **Restore consolidated rules:**
   ```bash
   # CAUTION: This undoes the restoration
   rm -rf .cursor/rules-source/
   cp -r .cursor/rules-consolidated-backup/ .cursor/rules/
   ```

3. **Revert generated files:**
   ```bash
   git checkout CLAUDE.md apps/*/CLAUDE.md packages/*/CLAUDE.md
   git checkout .clinerules/ .windsurfrules GEMINI.md AGENTS.md
   ```

4. **Report issue:**
   - Document what went wrong
   - Share error messages
   - File GitHub issue

**Note:** Rollback is unlikely to be needed - system is fully backward compatible.

---

## FAQ

### Q: Do I need to rebuild rules every time I edit them?

**A:** Yes, when editing source files in `.cursor/rules-source/`. Use `pnpm rules:build` or `pnpm rules:watch` for auto-rebuild.

### Q: Can I still edit CLAUDE.md directly like before?

**A:** No - `CLAUDE.md` is now auto-generated. Edit source files in `.cursor/rules-source/` instead.

### Q: What happens if I forget to rebuild after editing?

**A:** Your changes won't appear in generated files. CLIs will load outdated rules. Run `pnpm rules:build` to sync.

### Q: How do I know which rules apply to my current file?

**A:** Check the rule's `globs` and `scopes` in frontmatter. Rules activate based on:
1. File pattern match (globs)
2. Context scope match (scopes)
3. Always apply flag (alwaysApply: true)

### Q: Can I add my own custom rules?

**A:** Yes! Create a new `.mdc` file in `.cursor/rules-source/` with proper frontmatter, then run `pnpm rules:build:verify`.

### Q: What if I get validation warnings during build?

**A:** Warnings are informational (e.g., unknown scopes, large file size). Build still succeeds. Fix if desired, or ignore if expected.

### Q: How do I see which rules are loaded in my current context?

**A:** Check the context-specific `CLAUDE.md` file:
```bash
# For client app
cat apps/client/CLAUDE.md

# For server app
cat apps/server/CLAUDE.md

# For specific package
cat packages/shared-ui/CLAUDE.md
```

### Q: Can I use the old consolidated rules and new restored rules together?

**A:** No - choose one system. The new system replaces the old. Consolidated rules are backed up for reference only.

### Q: What if verification fails with "under-distribution"?

**A:** Often a cosmetic naming mismatch. Manually check if rule content appears in the `AGENTS.md` file. If missing, add appropriate scope to rule frontmatter.

### Q: How do I update context scopes?

**A:** Edit `.cursor/sync/contexts.ts`, update the `scopes` array for the target context, then rebuild:
```bash
vim .cursor/sync/contexts.ts
pnpm rules:build:verify
```

### Q: Is the build step required for CI/CD?

**A:** Recommended. Add `pnpm rules:verify` to CI to ensure generated files are up-to-date. See [RULE_SYSTEM.md - CI/CD Integration](/docs/maintenance/RULE_SYSTEM.md#cicd-integration-recommendations).

---

## Additional Resources

- [RULE_SYSTEM.md](./RULE_SYSTEM.md) - Comprehensive rule system architecture
- [RULES_TROUBLESHOOTING.md](./RULES_TROUBLESHOOTING.md) - Troubleshooting guide
- [.cursor/rules-source/README.md](../../.cursor/rules-source/README.md) - Source rules documentation
- [AGENT_INSTRUCTIONS.md](./AGENT_INSTRUCTIONS.md) - Comprehensive agent guide

---

**Migration Completed:** 2025-10-22
**Version:** 1.0.0
**Status:** Production Ready
