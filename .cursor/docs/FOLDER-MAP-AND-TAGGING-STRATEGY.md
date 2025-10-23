# Folder Map & Rule Tagging Strategy

**Purpose:** Map the actual monorepo structure and define which rules should apply to each folder/package.

**Generated:** 2025-10-07

---

## Monorepo Structure Overview

```
cortals-monorepo/
├── apps/           # Executable applications
├── packages/       # Shared React UI libraries
├── services/       # Backend microservices
└── tooling/        # Shared build/dev tooling
```

---

## Detailed Folder Map

### 📱 Apps (Executable Applications)

| Folder | Package | Tech Stack | Purpose | Required Rules |
|--------|---------|------------|---------|----------------|
| `apps/client` | `client` | React + Vite | Main frontend application | Foundation, Validation, Frontend Patterns, React Standards, Workflow |
| `apps/server` | `@scala-cme/server` | Express + TypeScript | API backend server | Foundation, Validation, Backend Express, Workflow |
| `apps/storybook` | `storybook` | Storybook | Component library docs | Foundation, Frontend Patterns, React Standards, Storybook |

### 📦 Packages (Shared React UI Libraries)

| Folder | Package | Tech Stack | Purpose | Required Rules |
|--------|---------|------------|---------|----------------|
| `packages/admin-ui` | `@scala-cme/admin-ui` | React components | Admin UI components | Foundation, Frontend Patterns, React Standards, Documentation |
| `packages/navigation-ui` | `@scala-cme/navigation-ui` | React components | Navigation components | Foundation, Frontend Patterns, React Standards, Documentation |
| `packages/shared-ui` | `@scala-cme/shared-ui` | React components | Shared UI primitives | Foundation, Frontend Patterns, React Standards, Documentation |
| `packages/shared-redux` | `@scala-cme/shared-redux` | Redux Toolkit | Shared state management | Foundation, React Standards, Documentation |
| `packages/shared-types` | `@scala-cme/shared-types` | TypeScript | Shared type definitions | Foundation, Documentation |
| `packages/testids` | `@scala-cme/testids` | TypeScript | Test ID constants | Foundation, Documentation |
| `packages/i18n` | `@scala-cme/i18n` | TypeScript | Internationalization (19 languages) | Foundation, Documentation |
| `packages/shared-plugin-registry` | `@scala-cme/shared-plugin-registry` | TypeScript | Plugin architecture | Foundation, Documentation |

### 🔧 Services (Backend Microservices)

| Folder | Package | Tech Stack | Purpose | Required Rules |
|--------|---------|------------|---------|----------------|
| `services/cm` | `@scala-cme/cm-service` | Express | Content Manager proxy | Foundation, Validation, Backend Express, Workflow |
| `services/pg` | `@scala-cme/pg-service` | Node + PostgreSQL | Database service | Foundation, Backend Functional, Documentation |
| `services/mailer` | `@scala-cme/mailer-service` | Node | Email service | Foundation, Backend Functional, Documentation |

### ⚙️ Tooling (Shared Build/Dev Tools)

| Folder | Package | Tech Stack | Purpose | Required Rules |
|--------|---------|------------|---------|----------------|
| `tooling/testing` | `@kit/testing` | Vitest + Playwright | Test configuration | Foundation, Validation, Documentation |
| `tooling/logger` | `@kit/logger` | Pino | Structured logging | Foundation, Documentation |
| `tooling/brain-monitor` | `@kit/brain-monitor` | Node | Validation orchestration | Foundation, Validation, Documentation |
| `tooling/env-loader` | `@kit/env-loader` | Node | Environment variable loader | Foundation, Documentation |
| `tooling/eslint` | `@kit/eslint-config` | ESLint | Linting configuration | Foundation, Documentation |
| `tooling/prettier` | `@kit/prettier-config` | Prettier | Code formatting | Foundation, Documentation |
| `tooling/typescript` | `@kit/tsconfig` | TypeScript | TS configuration | Foundation, Documentation |

---

## Proposed Tagging System

### Current Problem
- Scopes are too generic (`react`, `frontend`, `backend`)
- Don't map to actual folder structure
- Root context needs ALL rules, specialized contexts need filtered rules

### New Tag Categories

#### 1. **Layer Tags** (What layer of the stack)
- `layer:foundation` - Core monorepo setup (ALWAYS include)
- `layer:frontend` - Frontend/UI development
- `layer:backend` - Backend/API development
- `layer:validation` - Testing and validation
- `layer:workflow` - Git/PR/deployment

#### 2. **Tech Tags** (What technology)
- `tech:react` - React-specific patterns
- `tech:express` - Express-specific patterns
- `tech:node` - Node.js patterns (non-Express)
- `tech:typescript` - TypeScript patterns

#### 3. **Scope Tags** (Where it applies)
- `scope:apps` - All apps
- `scope:apps/client` - Specific app
- `scope:packages` - All packages
- `scope:packages/admin-ui` - Specific package
- `scope:services` - All services
- `scope:tooling` - All tooling

#### 4. **Purpose Tags** (What it's for)
- `purpose:components` - UI component development
- `purpose:api` - API development
- `purpose:testing` - Test creation/execution
- `purpose:documentation` - Documentation standards

---

## Proposed Rule Tag Mapping

| Rule File | Layer | Tech | Scope | Purpose |
|-----------|-------|------|-------|---------|
| 01-foundation | `foundation` | - | `*` | - |
| 02-validation-testing | `validation` | - | `*` | `testing` |
| 03-frontend-patterns | `frontend` | `react` | `apps/client`, `packages/*-ui`, `apps/storybook` | `components` |
| 04-react-standards | `frontend` | `react` | `apps/client`, `packages/*-ui` | `components` |
| 05-backend-express | `backend` | `express` | `apps/server`, `services/cm` | `api` |
| 06-backend-functional | `backend` | `node` | `services/*`, `tooling/*` | - |
| 07-documentation | `foundation` | - | `*` | `documentation` |
| 08-workflow | `workflow` | - | `*` | - |
| 09-agent-documentation-coordination | `foundation` | - | `*` | `documentation` |
| storybook | `frontend` | `react`, `storybook` | `apps/storybook`, `packages/*-ui` | `testing`, `components` |

---

## Hierarchical Context Generation Strategy

### Option A: Path-Based (Recommended)

Generate contexts based on actual folder structure:

```
Root (/)
├── Apps Context
│   ├── apps/client (React)
│   ├── apps/server (Express)
│   └── apps/storybook (React)
├── Packages Context
│   ├── packages/*-ui (React)
│   └── packages/* (TypeScript)
├── Services Context
│   └── services/* (Node/Express)
└── Tooling Context
    └── tooling/* (Node)
```

**Rules per context:**
- **Root:** ALL 8 rules (comprehensive reference)
- **apps/client:** Foundation, Validation, Frontend Patterns, React Standards, Workflow
- **apps/server:** Foundation, Validation, Backend Express, Workflow
- **packages/*-ui:** Foundation, Frontend Patterns, React Standards, Documentation
- **services/*:** Foundation, Backend Functional, Documentation
- **tooling/*:** Foundation, Backend Functional, Documentation

### Option B: Role-Based

Generate contexts based on developer role:

```
Root (/)
├── Frontend Developer
│   - All React/UI rules
├── Backend Developer
│   - All Express/Node rules
├── Full Stack Developer
│   - All rules
└── DevOps/Tooling
    - Foundation, Validation, Workflow
```

---

## Implementation Plan

### Phase 1: Update Rule Frontmatter (30 min)

Update each rule's frontmatter with new tag system:

```yaml
---
description: "Description"
layer: foundation | frontend | backend | validation | workflow
tech: [react, express, node, typescript]
scopes:
  - "*"  # or specific paths like "apps/client", "packages/*-ui"
purpose: [components, api, testing, documentation]
alwaysApply: true | false
---
```

### Phase 2: Update Build Script (45 min)

Update `build-consolidated-rules.ts` to:

1. **Define contexts from actual folder structure:**
   ```typescript
   const CONTEXTS = [
     { name: 'Root', path: '', scopes: ['*'] },
     { name: 'Frontend', path: 'apps/client', layers: ['foundation', 'frontend', 'validation', 'workflow'] },
     { name: 'Backend', path: 'apps/server', layers: ['foundation', 'backend', 'validation', 'workflow'] },
     { name: 'UI Packages', path: 'packages', layers: ['foundation', 'frontend', 'documentation'] },
     { name: 'Services', path: 'services', layers: ['foundation', 'backend', 'documentation'] },
     { name: 'Tooling', path: 'tooling', layers: ['foundation', 'backend', 'documentation'] }
   ];
   ```

2. **Match rules to contexts by layer:**
   ```typescript
   function ruleMatchesContext(rule: RuleFile, context: Context): boolean {
     if (context.scopes.includes('*')) return true; // Root gets all
     return context.layers.some(layer => rule.frontmatter.layer === layer);
   }
   ```

3. **Generate per-folder CLAUDE.md files:**
   ```
   /CLAUDE.md                   (all 8 rules)
   /apps/client/CLAUDE.md       (Foundation, Frontend, Validation, Workflow)
   /apps/server/CLAUDE.md       (Foundation, Backend Express, Validation, Workflow)
   /packages/CLAUDE.md          (Foundation, Frontend, Documentation)
   /services/CLAUDE.md          (Foundation, Backend Functional, Documentation)
   /tooling/CLAUDE.md           (Foundation, Backend Functional, Documentation)
   ```

### Phase 3: Test & Verify (15 min)

1. Run `pnpm rules:build`
2. Verify root CLAUDE.md has all 8 rules
3. Verify specialized contexts have appropriate subsets
4. Check file sizes are reasonable

---

## Benefits of New System

✅ **Clearer mapping** - Tags directly map to folders
✅ **Better filtering** - Layer-based matching is more precise
✅ **Easier maintenance** - Add new rules by specifying layer
✅ **Self-documenting** - Tags explain where rule applies
✅ **Flexible** - Can generate contexts by path OR role

---

## Audit Results

**Date:** 2025-10-22
**Auditor:** Campaign Conductor (Genesis Protocol v2.1)

### Key Findings

1. **✅ RESOLVED: Storybook Rule Over-Distribution**
   - **Issue:** `storybook.mdc` had no YAML frontmatter, causing it to appear in all contexts
   - **Fix:** Added frontmatter with scopes: [react, storybook, testing, ui]
   - **Result:** Rule now correctly excluded from backend contexts (apps/server, services/*)

2. **✅ COMPLETED: Context Expansion**
   - **Before:** 5 contexts covering 33% of monorepo
   - **After:** 15 contexts covering 100% of key directories
   - **New Contexts:** apps/storybook, packages/admin-ui, packages/navigation-ui, packages/shared-redux, tooling/brain-monitor, tooling/logger, tooling/testing, services/cm, services/pg, plugins/

3. **✅ IMPLEMENTED: Validation Infrastructure**
   - **Feature:** Build script now validates frontmatter (scopes, alwaysApply, valid scope values)
   - **Feature:** Verification script audits distribution correctness
   - **Scripts:** `pnpm rules:verify`, `pnpm rules:build:verify`
   - **Warnings:** 3 contradictory alwaysApply + scopes warnings (informational only)

4. **✅ UPDATED: Documentation**
   - `.cursor/rules/README.md` now documents frontmatter requirements and scope system
   - Added usage examples for verification commands

5. **⚠️ PARTIAL: Directory Validation**
   - Build script now skips non-existent directories instead of creating them
   - Note: Some contexts in HIERARCHICAL_CONTEXTS may reference non-existent directories (this is acceptable for future expansion)

### Implementation Status

| Phase | Status | Completion Date |
|-------|--------|-----------------|
| Phase 1: Critical Fix (storybook.mdc) | ✅ Complete | 2025-10-22 |
| Phase 2: Context Expansion (5→15 contexts) | ✅ Complete | 2025-10-22 |
| Phase 3: Validation Infrastructure | ✅ Complete | 2025-10-22 |
| Phase 4: Documentation Updates | ✅ Complete | 2025-10-22 |
| Phase 5: Final Verification | ✅ Complete | 2025-10-22 |

---

## Next Steps

1. ~~**Review this proposal** - Does the tagging system make sense?~~ ✅ Implemented with scope-based system
2. ~~**Choose Option A or B** - Path-based or Role-based contexts?~~ ✅ Chose Path-Based (Option A)
3. ~~**Update rule frontmatter** - Add layer/tech/scope/purpose tags~~ ✅ All rules have frontmatter with scopes
4. ~~**Update build script** - Implement new context generation~~ ✅ Build script expanded to 15 contexts
5. ~~**Test & verify** - Ensure all contexts have appropriate rules~~ ✅ Verification script created

### Optional Future Enhancements

1. **CI/CD Integration** - Add `pnpm rules:verify` to GitHub Actions workflow
2. **Strict Mode** - Add `--strict` flag to treat validation warnings as errors
3. **Verification Script Enhancement** - Improve AGENTS.md parsing to reduce false positives
4. **Resolve alwaysApply Contradictions** - Clarify rules 01, 02, 09 frontmatter
5. **Additional Contexts** - Consider per-plugin contexts (plugins/displays/, plugins/flight-boards/)

---

**Questions to Answer:**

1. ~~Should we use Path-Based (Option A) or Role-Based (Option B) contexts?~~ ✅ Answer: Path-Based (Option A)
2. ~~Do the layer categories make sense?~~ ✅ Answer: Using scope-based system instead
3. ~~Should we generate CLAUDE.md at every folder level, or just major sections?~~ ✅ Answer: Major sections (15 key directories)
4. ~~Any other folder-specific rules we're missing?~~ ✅ Answer: All major rules covered; storybook.mdc added
