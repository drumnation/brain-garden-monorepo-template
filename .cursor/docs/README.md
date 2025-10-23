# Cursor Rules Documentation

This directory contains the development rules for the Cortals monorepo, optimized for Cursor's modular rule system.

## Philosophy: Modular Rules for Cursor, Hierarchical for Claude, Consolidated for Others

**Cursor's advantage:** The multi-file `.mdc` approach with `globs` and `alwaysApply` provides superior contextual control. Rules are only loaded when relevant, reducing token usage and improving AI focus.

**Claude Projects (NEW):** We generate **hierarchical CLAUDE.md files** scoped to different contexts (monorepo root, React/frontend, Express/backend, etc.). Each context only includes relevant rules, providing token efficiency similar to Cursor's modular approach.

**Other platforms:** Tools like Cline and Windsurf use single-file rule formats (`.clinerules`, `.windsurfrules`). We auto-generate these from the modular source.

## File Structure

### Source Files (Modular - Edit These)

The following **8 focused `.mdc` files** are the **single source of truth**. Edit these, then regenerate consolidated files:

- **`01-foundation.rules.mdc`** - Core monorepo foundation (ESM, structure, env vars)
- **`02-validation-testing.rules.mdc`** - Brain monitor validation & TDD workflow
- **`03-frontend-patterns.rules.mdc`** - Component decision tree (atomic, platform pathways, mobile-first)
- **`04-react-standards.rules.mdc`** - React best practices (state, API layer, logging)
- **`05-backend-express.rules.mdc`** - Express.js architecture patterns
- **`06-backend-functional.rules.mdc`** - Functional patterns for scripts/CLIs
- **`07-documentation.rules.mdc`** - Documentation hierarchy and versioning
- **`08-workflow.rules.mdc`** - PR creation and essential commands
- **`09-ai-documentation-maintenance.rules.mdc`** - AI agent documentation responsibilities

**Original files backed up:** The 19 original verbose `.mdc` files are in `_backup/` for reference.

### Backup Directory

**`_backup/`** contains the original 19 verbose `.mdc` files:
- Preserved for reference and historical context
- **Not loaded by Cursor** (excluded via filename filter)
- **Not processed by build script** (excluded via `_` prefix filter)
- Can be safely deleted if no longer needed

### Generated Files (Auto-Generated - Do Not Edit)

These files are **automatically generated** from the source `.mdc` files:

**Reference files:**
- **`master.rules.mdc`** - Consolidated reference (≤50% of original, for quick lookup)

**Hierarchical CLAUDE.md files (scoped by context):**
- **`../CLAUDE.md`** - Monorepo root (core standards)
- **`../apps/client/CLAUDE.md`** - React/Frontend context
- **`../apps/server/CLAUDE.md`** - Express/Backend context
- **`../packages/shared-ui/CLAUDE.md`** - Shared UI library context
- **`../services/CLAUDE.md`** - Microservices context

**Single-file formats (full rules):**
- **`../.clinerules`** - Cline-specific format (markdown)
- **`../.windsurfrules`** - Windsurf-specific format (markdown)
- **`../GEMINI.md`** - Google Gemini format (structured with decision points)
- **`../AGENTS.md`** - Codex/autonomous agents format (concise, action-oriented)

### Special File: `.cursorrules`

**`../.cursorrules`** is **NOT auto-generated**. It's reserved for:
- Agent correction instructions
- Supplemental rules that apply across all AI platforms
- Temporary overrides or debugging guidance

Cursor reads the modular `.mdc` files directly, so `.cursorrules` would duplicate context unnecessarily.

## How It Works

### 1. Edit Modular Rules (Cursor-Optimized)

Edit any `.mdc` file in `.cursor/rules/`:

```markdown
---
description: Use when adding new UI components
globs:
  - "packages/ui/**/*"
  - "apps/client/src/components/**/*"
alwaysApply: false
scopes:
  - react
  - ui
  - components
---

# Your Rule Content Here
```

**Key frontmatter fields:**
- **`globs`**: Only include this rule when working on matching files (Cursor)
- **`alwaysApply`**: Set to `true` for universal rules, `false` for contextual (Cursor)
- **`scopes`**: Controls which hierarchical CLAUDE.md files include this rule (Claude Projects)
  - See [SCOPES-GUIDE.md](./SCOPES-GUIDE.md) for detailed documentation

**Available scopes:**
- `global` - All contexts
- `monorepo` - Monorepo root only
- `react`, `frontend`, `ui`, `components` - React/UI contexts
- `express`, `backend`, `api`, `node` - Backend contexts
- `services` - Microservices context
- `storybook` - Storybook-related contexts

### 2. Regenerate Consolidated Files

After editing any `.mdc` file, run:

```bash
pnpm tsx .cursor/rules/build-consolidated-rules.ts
```

This automatically updates:
- 5 hierarchical `CLAUDE.md` files (scoped to contexts)
- `.clinerules` (Cline format)
- `.windsurfrules` (Windsurf format)
- `GEMINI.md` (Google Gemini format - manually referenced)
- `AGENTS.md` (Codex/autonomous agents format)

### 3. Commit Both Source and Generated

```bash
git add .cursor/rules/*.mdc
git add CLAUDE.md apps/*/CLAUDE.md packages/*/CLAUDE.md services/CLAUDE.md
git add .clinerules .windsurfrules GEMINI.md AGENTS.md
git commit -m "docs: update development rules"
```

## Build Script Details

**Location:** `.cursor/rules/build-consolidated-rules.ts`

**What it does:**
1. Reads all `.mdc` files in `.cursor/rules/`
2. Extracts YAML frontmatter and content
3. Strips markdown headings (converts to plain text dividers)
4. Concatenates into platform-specific formats
5. Writes to root directory (`.cursorrules`, `.clinerules`, `.windsurfrules`)

**Why TypeScript?**
- Type-safe frontmatter parsing
- Easy to extend for new platforms
- Runs with `tsx` (no build step needed)

## When to Use Which Rules

### In Cursor (Recommended)

Cursor automatically loads relevant rules based on:
- **File globs**: Only load rules for the files you're editing
- **`alwaysApply`**: Core rules always included

**Example:** Editing `packages/ui/atoms/Button/Button.tsx` loads:
- `monorepo-structure-and-configuration.rules.mdc` (alwaysApply: true)
- `atomic-design-component-strategy.rules.mdc` (glob: packages/ui/**/*)
- `storybook-first-composition.rules.mdc` (glob: packages/ui/**/*)
- `tests.unified-testing.rules.mdc` (alwaysApply: true)

### In Other AI Platforms

Use the generated single-file formats:
- **Claude.ai**: Manually attach `CLAUDE.md` (comprehensive format with table of contents)
- **Google Gemini**: Manually attach `GEMINI.md` (structured with decision points)
- **Codex/Autonomous Agents**: Use `AGENTS.md` (concise, action-oriented)
- **Cline**: Automatically reads `.clinerules`
- **Windsurf**: Automatically reads `.windsurfrules`

These files contain **all rules**, so they're less token-efficient but work with any AI platform.

## Key Sections Overview

| Rule File | Applies To | Always Apply? |
|:----------|:-----------|:--------------|
| `monorepo-structure-and-configuration` | All files | ✅ Yes |
| `tests.unified-testing` | All test files | ✅ Yes |
| `brain-monitor-validation` | All files | ✅ Yes |
| `atomic-design-component-strategy` | UI components | ❌ No (contextual) |
| `storybook-first-composition` | UI packages | ❌ No (contextual) |
| `monorepo-node-express-architecture` | Backend apps | ❌ No (contextual) |
| `node.functional-isolated-concerns` | Scripts/CLIs | ❌ No (contextual) |
| `testid` | When adding testIDs | ❌ No (manual trigger) |
| `pr-creation-guidelines` | Git workflows | ❌ No (manual trigger) |

## Maintenance

### Adding a New Rule

1. **Create `.mdc` file** in `.cursor/rules/`:
   ```bash
   touch .cursor/rules/new-rule.rules.mdc
   ```

2. **Add frontmatter and content**:
   ```markdown
   ---
   description: When to use this rule
   globs:
     - "relevant/**/*"
   alwaysApply: false
   scopes:
     - monorepo
     - react
   ---

   # Rule content here
   ```

3. **Regenerate consolidated files**:
   ```bash
   pnpm rules:build
   # Or use watch mode during development
   pnpm rules:watch
   ```

### Updating an Existing Rule

1. **Edit the `.mdc` file** directly in `.cursor/rules/`
2. **Regenerate** with `pnpm rules:build`
3. **Commit both** source and generated files

### Regeneration Process

The build script (`pnpm rules:build`) generates:
1. **`master.rules.mdc`** - Consolidated single file (≤50% of original)
2. **`_cursor/*.mdc`** - 8 focused Cursor-aligned files
3. **Hierarchical context files** - CLAUDE.md, GEMINI.md, AGENTS.md per context
4. **Platform files** - .clinerules, .windsurfrules

**Note:** The script now properly handles code blocks to avoid corruption.

### Testing Your Changes

**In Cursor:**
- Open a relevant file (matching the glob pattern)
- Cursor will automatically load the updated rule
- Verify it appears in the context

**In Other Platforms:**
- Check that `.clinerules` / `.windsurfrules` were updated
- Reload the AI tool to pick up changes

### Maintenance Strategies

**Option A: Generator-First (Current)**
- Edit modular `.mdc` files in `.cursor/rules/`
- Run `pnpm rules:build` to generate consolidated formats
- Commit both source and generated files

**Option B: Archive Legacy (Optional)**
- Move original `.mdc` files to `.cursor/rules/archive/`
- Use only `master.rules.mdc` and `_cursor/*.mdc` going forward
- Update build script to skip archived files

## Benefits of This Approach

### For Cursor Users
✅ **Contextual loading** - Only relevant rules included
✅ **Token efficiency** - Smaller context window
✅ **Better AI focus** - Fewer distractions
✅ **Modular editing** - Easy to update specific areas

### For Other Platforms
✅ **Full compatibility** - Works with any AI tool
✅ **Single file** - Easy to reference
✅ **Auto-generated** - Always in sync with Cursor rules
✅ **No manual duplication** - One source of truth

### For the Team
✅ **Single source of truth** - Edit once, deploy everywhere
✅ **Version control** - Git tracks both modular and consolidated
✅ **Easy migration** - Switch AI platforms without losing rules
✅ **Automation-ready** - Can add to CI/CD pipeline

## CI/CD Integration (Optional)

Add to your CI pipeline to ensure consolidated files are always up-to-date:

```yaml
# .github/workflows/validate-rules.yml
name: Validate Rules

on:
  pull_request:
    paths:
      - '.cursor/rules/**/*.mdc'

jobs:
  check-rules:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - name: Install dependencies
        run: pnpm install
      - name: Regenerate rules
        run: pnpm rules:build
      - name: Check for changes
        run: |
          git diff --exit-code \
            .cursor/rules/master.rules.mdc \
            .cursor/rules/_cursor/*.mdc \
            .clinerules .windsurfrules \
            CLAUDE.md apps/*/CLAUDE.md packages/*/CLAUDE.md services/CLAUDE.md \
            GEMINI.md apps/*/GEMINI.md packages/*/GEMINI.md services/GEMINI.md \
            AGENTS.md apps/*/AGENTS.md packages/*/AGENTS.md services/AGENTS.md || \
          (echo "❌ Consolidated rules out of sync. Run 'pnpm rules:build' and commit." && exit 1)
```

## Package.json Scripts (Already Configured)

The following scripts are already configured in the root `package.json`:

```json
{
  "scripts": {
    "rules:build": "tsx .cursor/rules/build-consolidated-rules.ts",
    "rules:watch": "tsx watch .cursor/rules/build-consolidated-rules.ts .cursor/rules/*.mdc"
  }
}
```

**Usage:**
```bash
# One-time build
pnpm rules:build

# Watch mode (auto-rebuild on file changes)
pnpm rules:watch
```

**What gets generated:**
- `master.rules.mdc` (consolidated, ≤50% of original)
- `_cursor/*.mdc` (8 focused Cursor-aligned files)
- Hierarchical context files (CLAUDE.md, GEMINI.md, AGENTS.md)
- Platform files (.clinerules, .windsurfrules)

## Gitignore Consideration

You have two options for version control:

### Option 1: Track Generated Files (Recommended)
**Pros:** Other AI platforms work immediately after clone
**Cons:** Larger diffs when rules change

```gitignore
# Don't add anything - track all generated files
```

### Option 2: Generate on Demand
**Pros:** Smaller repository, cleaner diffs
**Cons:** Requires build step after clone

```gitignore
# .gitignore
/.clinerules
/.windsurfrules
/CLAUDE.md
/GEMINI.md
/AGENTS.md

# Keep .cursorrules for agent correction instructions
# (it's not auto-generated)
```

Then add to CI or post-install:
```json
{
  "scripts": {
    "postinstall": "pnpm rules:build"
  }
}
```

## Questions?

- **How do I know which file to edit?** Always edit the `.mdc` files in `.cursor/rules/`
- **Can I edit `.cursorrules` directly?** Yes! It's reserved for agent correction instructions and supplemental guidance. It won't be overwritten by the build script.
- **How often should I regenerate?** After every change to any `.mdc` file.
- **Can I customize the build script?** Yes! It's TypeScript and easy to extend.
- **Which AI platform format should I use?**
  - **Cursor:** Modular `.mdc` files (auto-loaded by Cursor)
  - **Claude.ai:** Manually attach `CLAUDE.md`
  - **Google Gemini:** Manually attach `GEMINI.md`
  - **Codex/Agents:** Reference `AGENTS.md`
  - **Cline:** `.clinerules` (auto-loaded by Cline)
  - **Windsurf:** `.windsurfrules` (auto-loaded by Windsurf)
  - **Other:** Create custom format or use one of the above

---

**Remember:** The modular `.mdc` files are the source of truth. Always edit those, then regenerate the consolidated files for other platforms.
