# Scopes Guide: Hierarchical CLAUDE.md Generation

This guide explains how to use the `scopes` field in rule frontmatter to control which `CLAUDE.md` files include each rule.

## Overview

The build script generates **5 different CLAUDE.md files**, each scoped to a specific context in the monorepo:

| Context | File Location | Scopes | Purpose |
|:--------|:--------------|:-------|:--------|
| **Monorepo Root** | `/CLAUDE.md` | `monorepo`, `global`, `core` | Core monorepo-wide standards |
| **React/Frontend** | `/apps/client/CLAUDE.md` | `monorepo`, `global`, `react`, `frontend`, `ui`, `components` | React and UI development |
| **Express/Backend** | `/apps/server/CLAUDE.md` | `monorepo`, `global`, `express`, `backend`, `api`, `node` | Express.js backend |
| **Shared UI Packages** | `/packages/shared-ui/CLAUDE.md` | `monorepo`, `global`, `react`, `ui`, `components`, `storybook` | Shared UI library |
| **Services** | `/services/CLAUDE.md` | `monorepo`, `global`, `services`, `backend`, `node` | Microservices |

## How It Works

### Default Behavior (No Scopes)

If a rule **does not have** a `scopes` field, it's included ONLY in:
- Monorepo Root (`global`, `monorepo`)

**Example:**

```markdown
---
description: Core monorepo structure and configuration
globs:
  - "**/*"
alwaysApply: true
---

# Rule content...
```

This rule appears in:
- ✅ `/CLAUDE.md` (Monorepo Root)
- ❌ `/apps/client/CLAUDE.md`
- ❌ `/apps/server/CLAUDE.md`
- ❌ `/packages/shared-ui/CLAUDE.md`
- ❌ `/services/CLAUDE.md`

### With Scopes

Add a `scopes` array to control which `CLAUDE.md` files include the rule:

```markdown
---
description: React component development patterns
globs:
  - "apps/client/**/*.tsx"
  - "packages/shared-ui/**/*.tsx"
alwaysApply: false
scopes:
  - global
  - react
  - ui
  - components
---

# Rule content...
```

This rule appears in:
- ✅ `/CLAUDE.md` (has `global`)
- ✅ `/apps/client/CLAUDE.md` (has `react`, `ui`, `components`)
- ❌ `/apps/server/CLAUDE.md`
- ✅ `/packages/shared-ui/CLAUDE.md` (has `react`, `ui`, `components`)
- ❌ `/services/CLAUDE.md`

## Available Scopes

### Universal Scopes
- `global` - Included in ALL contexts (use sparingly)
- `monorepo` - Included in root context only

### Technology Scopes
- `react` - React/frontend contexts
- `express` - Express.js backend contexts
- `node` - Node.js contexts (backend + services)
- `storybook` - Storybook-related contexts

### Layer Scopes
- `frontend` - Frontend application contexts
- `backend` - Backend application contexts
- `ui` - UI-focused contexts
- `components` - Component development contexts
- `api` - API development contexts
- `services` - Microservice contexts
- `core` - Core/fundamental contexts

## Scope Matching Logic

A rule is included in a context if **ANY** of its scopes match the context's scopes.

**Example:**

Rule with `scopes: ["react", "storybook"]`
- ✅ Matches `apps/client/CLAUDE.md` (has `react`)
- ✅ Matches `packages/shared-ui/CLAUDE.md` (has `react` AND `storybook`)
- ❌ Does NOT match `apps/server/CLAUDE.md` (no overlap)

## Common Patterns

### 1. Core Monorepo Rules (Testing, Validation, Structure)

```markdown
---
description: Core monorepo testing standards
scopes:
  - global
---
```

**Result:** Included in ALL contexts (use for universal rules)

### 2. React/UI Component Rules

```markdown
---
description: Atomic design component strategy
scopes:
  - react
  - ui
  - components
---
```

**Result:** Included in `apps/client`, `packages/shared-ui`

### 3. Backend/Express Rules

```markdown
---
description: Express.js architecture patterns
scopes:
  - express
  - backend
  - api
---
```

**Result:** Included in `apps/server`

### 4. Storybook-Specific Rules

```markdown
---
description: Storybook-first composition
scopes:
  - react
  - ui
  - storybook
---
```

**Result:** Included in `apps/client`, `packages/shared-ui`

### 5. Node.js General Rules (Backend + Services)

```markdown
---
description: Functional isolated concerns pattern
scopes:
  - node
  - backend
  - services
---
```

**Result:** Included in `apps/server`, `services`

### 6. Mobile/Responsive Rules

```markdown
---
description: Mobile-first design principles
scopes:
  - react
  - frontend
  - ui
---
```

**Result:** Included in `apps/client`, `packages/shared-ui`

## Migration Guide

### Step 1: Add Scopes to Existing Rules

For each `.mdc` file in `.cursor/rules/`, add a `scopes` field based on its purpose:

**Example: `atomic-design-component-strategy.rules.mdc`**

```diff
 ---
 description: Use this rule whenever a third-party UI component is detected
 globs:
   - "packages/ui/**/*"
   - "apps/client/src/components/**/*"
 alwaysApply: false
+scopes:
+  - react
+  - ui
+  - components
 ---
```

**Example: `monorepo-node-express-architecture.rules.mdc`**

```diff
 ---
 description: When generating or refactoring TypeScript/Node-Express code
 alwaysApply: false
+scopes:
+  - express
+  - backend
+  - api
+  - node
 ---
```

**Example: `tests.unified-testing.rules.mdc`**

```diff
 ---
 description: Unified testing process for all test types
 globs:
   - "**/*.test.ts"
   - "**/*.test.tsx"
 alwaysApply: true
+scopes:
+  - global
 ---
```

### Step 2: Regenerate CLAUDE.md Files

```bash
pnpm tsx .cursor/rules/build-consolidated-rules.ts
```

### Step 3: Verify Output

Check that rules appear in the expected `CLAUDE.md` files:

```bash
# Check what's in the frontend context
head -50 apps/client/CLAUDE.md

# Check what's in the backend context
head -50 apps/server/CLAUDE.md

# Check what's in the root context
head -50 CLAUDE.md
```

## Adding New Contexts

To add a new `CLAUDE.md` context (e.g., for a new app or package):

**Edit `.cursor/rules/build-consolidated-rules.ts`:**

```typescript
const CLAUDE_CONTEXTS: ClaudeContext[] = [
  // ... existing contexts ...
  {
    name: 'My New App',
    path: join(ROOT_DIR, 'apps/my-new-app/CLAUDE.md'),
    description: 'Description of this context',
    scopes: ['monorepo', 'global', 'my-scope-1', 'my-scope-2']
  }
];
```

Then regenerate:

```bash
pnpm tsx .cursor/rules/build-consolidated-rules.ts
```

## Scope Decision Tree

```
Does this rule apply to...

├─ ALL contexts?
│  └─ scopes: ['global']
│
├─ Only React/UI work?
│  └─ scopes: ['react', 'ui', 'components']
│
├─ Only backend API work?
│  └─ scopes: ['express', 'backend', 'api']
│
├─ Both backend AND services?
│  └─ scopes: ['node', 'backend', 'services']
│
├─ Only Storybook-related?
│  └─ scopes: ['react', 'ui', 'storybook']
│
└─ Only monorepo root concepts?
   └─ No scopes field (defaults to 'monorepo', 'global')
```

## Benefits

### Token Efficiency
- Frontend devs using Claude Projects in `apps/client/` only load React/UI rules
- Backend devs in `apps/server/` only load Express/API rules
- Reduces irrelevant context by ~60-70% per context

### Better AI Focus
- Each `CLAUDE.md` is laser-focused on its domain
- Reduces confusion from unrelated patterns
- Improves AI response quality

### Maintainability
- Single source of truth (`.mdc` files)
- Easy to add new contexts
- Clear scope definitions

## FAQ

**Q: What if I forget to add scopes?**
A: The rule defaults to `monorepo` and `global` contexts only (appears in root `CLAUDE.md`).

**Q: Can a rule have multiple scopes?**
A: Yes! Use an array: `scopes: ['react', 'ui', 'components', 'storybook']`

**Q: Should I use `global` for everything?**
A: No! Use `global` only for truly universal rules (testing, validation, core structure). Most rules should be scoped to specific technologies or layers.

**Q: What's the difference between `monorepo` and `global`?**
A:
- `monorepo`: Only in root `CLAUDE.md` (monorepo-wide concepts)
- `global`: In ALL `CLAUDE.md` files (universal rules)

**Q: How do I see which rules are in each context?**
A: Check the Table of Contents at the top of each generated `CLAUDE.md` file.

---

**Remember:** After adding/modifying scopes, always regenerate with:
```bash
pnpm tsx .cursor/rules/build-consolidated-rules.ts
```
