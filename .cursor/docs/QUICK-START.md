# Quick Start Guide: Hierarchical Rule System

## TL;DR - How to Use

### Regenerate All Rule Files

```bash
pnpm rules:build
```

This generates 15 hierarchical files (CLAUDE.md, GEMINI.md, AGENTS.md) across 5 contexts, plus 2 full-monorepo files (.clinerules, .windsurfrules).

### Watch Mode (Auto-Regenerate on Changes)

```bash
pnpm rules:watch
```

Automatically rebuilds whenever you edit any `.mdc` file in `.cursor/rules/`.

---

## Step-by-Step Workflow

### 1. Edit a Rule

Edit any `.mdc` file in `.cursor/rules/`:

```bash
# Example: Edit the atomic design rule
code .cursor/rules/atomic-design-component-strategy.rules.mdc
```

**Add scopes to control which contexts include this rule:**

```yaml
---
description: Atomic design for UI components
globs:
  - "packages/ui/**/*"
  - "apps/client/src/components/**/*"
scopes:
  - react
  - ui
  - components
---
```

### 2. Regenerate Files

```bash
pnpm rules:build
```

**Output:**
```
✨ Done! All consolidated rule files generated.

📄 Generated files:
   - 15 hierarchical context files (CLAUDE.md, GEMINI.md, AGENTS.md)
   - .clinerules (Cline - full monorepo)
   - .windsurfrules (Windsurf - full monorepo)

📁 Hierarchical structure:
   - /: CLAUDE.md, GEMINI.md, AGENTS.md
   - apps/client/: CLAUDE.md, GEMINI.md, AGENTS.md
   - apps/server/: CLAUDE.md, GEMINI.md, AGENTS.md
   - packages/shared-ui/: CLAUDE.md, GEMINI.md, AGENTS.md
   - services/: CLAUDE.md, GEMINI.md, AGENTS.md
```

### 3. Verify Output

Check that your rule appears in the expected contexts:

```bash
# Frontend context (should have React/UI rules)
head -100 apps/client/CLAUDE.md

# Backend context (should have Express/API rules)
head -100 apps/server/CLAUDE.md

# Root context (should have core monorepo rules)
head -100 CLAUDE.md
```

### 4. Commit

```bash
git add .cursor/rules/*.mdc
git add */CLAUDE.md */GEMINI.md */AGENTS.md
git add .clinerules .windsurfrules
git commit -m "docs: update development rules"
```

---

## Available Scopes

Use these scopes in your rule frontmatter:

| Scope | Included In | Use For |
|:------|:------------|:--------|
| `global` | ALL contexts | Universal rules (testing, validation) |
| `monorepo` | Root only | Monorepo structure, tooling |
| `react` | Frontend, UI library | React patterns, components |
| `express` | Backend | Express.js, API development |
| `node` | Backend, Services | Node.js patterns |
| `frontend` | Frontend apps | Browser-specific patterns |
| `backend` | Backend apps | Server-specific patterns |
| `ui` | Frontend, UI library | UI components, styling |
| `components` | Frontend, UI library | Component architecture |
| `storybook` | Frontend, UI library | Storybook development |
| `api` | Backend | API design, endpoints |
| `services` | Services | Microservices patterns |

---

## Example: Adding Scopes to Existing Rules

### Before (No Scopes)

```yaml
---
description: React component patterns
globs:
  - "apps/client/**/*.tsx"
alwaysApply: false
---
```

**Result:** Only appears in root `CLAUDE.md`

### After (With Scopes)

```yaml
---
description: React component patterns
globs:
  - "apps/client/**/*.tsx"
alwaysApply: false
scopes:
  - react
  - ui
  - components
---
```

**Result:** Appears in:
- ✅ Root `CLAUDE.md` (for reference)
- ✅ `apps/client/CLAUDE.md`
- ✅ `packages/shared-ui/CLAUDE.md`
- ❌ `apps/server/CLAUDE.md`
- ❌ `services/CLAUDE.md`

---

## Common Patterns

### Core Monorepo Rules (Testing, Validation)

```yaml
scopes:
  - global
```

Appears in ALL contexts.

### React/UI Components

```yaml
scopes:
  - react
  - ui
  - components
```

Appears in: `apps/client/`, `packages/shared-ui/`

### Express Backend

```yaml
scopes:
  - express
  - backend
  - api
```

Appears in: `apps/server/`

### Node.js (Backend + Services)

```yaml
scopes:
  - node
  - backend
  - services
```

Appears in: `apps/server/`, `services/`

### Storybook-Specific

```yaml
scopes:
  - react
  - ui
  - storybook
```

Appears in: `apps/client/`, `packages/shared-ui/`

---

## Using with AI Platforms

### Claude Projects

1. Create a project for each context
2. Add the relevant `CLAUDE.md`:
   - Frontend project → Add `apps/client/CLAUDE.md`
   - Backend project → Add `apps/server/CLAUDE.md`
   - UI library project → Add `packages/shared-ui/CLAUDE.md`
   - Monorepo project → Add root `CLAUDE.md`

**Benefit:** ~60-70% token reduction per specialized context

### Gemini Code Assist

Gemini automatically detects `GEMINI.md` with hierarchical precedence:
- Global: `~/.gemini/GEMINI.md`
- Project: Root `GEMINI.md`
- Subfolder: `apps/client/GEMINI.md`, `apps/server/GEMINI.md`, etc.

More specific files supplement/override broader ones.

### OpenAI Codex

Codex uses `AGENTS.md` at repository and subdirectory levels:
- Repo-level: Root `AGENTS.md`
- Subfolder: `apps/client/AGENTS.md`, `apps/server/AGENTS.md`, etc.

### Cursor

Cursor reads the modular `.mdc` files directly (no need to regenerate for Cursor users).

### Cline

Uses `.clinerules` (full monorepo, no hierarchy).

### Windsurf

Uses `.windsurfrules` (full monorepo, no hierarchy).

---

## Troubleshooting

### My rule isn't appearing in the expected context

**Check:**
1. Does the rule have a `scopes` field?
2. Do any of the rule's scopes overlap with the context's scopes?
3. Did you run `pnpm rules:build` after editing?

**Example Debug:**

```yaml
# Rule
scopes: [react, ui]

# Context: apps/client/
scopes: [monorepo, global, react, frontend, ui, components]

# Match? YES (react, ui overlap)
```

### I want a rule in ALL contexts

Use `scopes: [global]`

### I want a rule in ONLY the root context

Don't add a `scopes` field, or use `scopes: [monorepo]`

### Build script fails

Check for YAML syntax errors in your frontmatter:

```bash
# The script shows warnings for parse errors
pnpm rules:build
```

Common issues:
- Colons in description without quotes
- Invalid YAML syntax
- Missing closing `---`

---

## Advanced: Adding New Contexts

To add a new hierarchical context (e.g., for a new app):

**Edit `.cursor/rules/build-consolidated-rules.ts`:**

```typescript
const HIERARCHICAL_CONTEXTS: ClaudeContext[] = [
  // ... existing contexts ...
  {
    name: 'My New App',
    path: join(ROOT_DIR, 'apps/my-new-app/'),
    description: 'Description of this app',
    scopes: ['monorepo', 'global', 'my-scope-1', 'my-scope-2']
  }
];
```

Then regenerate:

```bash
pnpm rules:build
```

---

## Need More Help?

- **Detailed scope guide:** [SCOPES-GUIDE.md](./SCOPES-GUIDE.md)
- **Architecture overview:** [IMPLEMENTATION-SUMMARY.md](./IMPLEMENTATION-SUMMARY.md)
- **Full documentation:** [README.md](./README.md)

---

## Quick Commands Reference

| Command | Purpose |
|:--------|:--------|
| `pnpm rules:build` | Regenerate all rule files |
| `pnpm rules:watch` | Auto-regenerate on changes |
| `ls */CLAUDE.md` | List all CLAUDE.md files |
| `git add */CLAUDE.md */GEMINI.md */AGENTS.md` | Stage all hierarchical files |
