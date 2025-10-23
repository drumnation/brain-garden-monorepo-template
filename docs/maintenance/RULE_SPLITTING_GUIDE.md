# Rule Splitting Guide

> **Purpose:** Systematic approach to splitting large rules that exceed Windsurf's 12K character limit while maintaining coherence and cross-references.

**Last Updated:** 2025-10-22

---

## Table of Contents

1. [When to Split](#when-to-split)
2. [Splitting Strategies](#splitting-strategies)
3. [Step-by-Step Process](#step-by-step-process)
4. [Naming Conventions](#naming-conventions)
5. [Example Split: monorepo-structure-and-configuration](#example-split-monorepo-structure-and-configuration)
6. [Cross-Reference Pattern](#cross-reference-pattern)
7. [Validation Checklist](#validation-checklist)
8. [Common Pitfalls](#common-pitfalls)

---

## When to Split

### Mandatory Split Scenarios

**✅ Split when:**
- Rule exceeds **12,000 characters** (Windsurf limit)
- Rule has been identified in `pnpm rules:analyze` output as "Exceeds 12K"
- Multiple distinct concerns are combined in one file
- Rule is difficult to navigate due to length

**Current Analysis Results:**
```
❌ Rules Exceeding 12K Characters:
  - monorepo-structure-and-configuration.rules.mdc (13.4K)
  - node.functional-isolated-concerns.rules.mdc (12.5K)
  - tests.unified-testing.rules.mdc (12.5K)
```

### Optional Split Scenarios

**Consider splitting when:**
- Rule exceeds **8,000 characters** (approaching limit)
- Rule has low cohesion between sections
- Team finds rule overwhelming to read
- Different sections serve different use cases

**Current Analysis Results:**
```
⚠️ Large Rules (8K-12K):
  - mobile-first-design.rules.mdc (9.6K)
  - monorepo-node-express-architecture.rules.mdc (11.2K)
  - project-wide-proxy-rules.mdc (9.2K)
  - react-bulletproof-component-pattern.rules.mdc (9.2K)
  - tests.tdd-workflow.rules.mdc (10.1K)
```

---

## Splitting Strategies

### Strategy 1: By Concern

**When to use:** Rule covers multiple distinct concerns

**Example:** Express Architecture
- **Part A:** Routes & Controllers (HTTP layer)
- **Part B:** Services & Repositories (business logic)
- **Part C:** Validation & Error Handling

**Benefits:**
- Clear separation of concerns
- Each part is independently useful
- Easy to extend individual parts

---

### Strategy 2: By Scope

**When to use:** Rule applies to different contexts

**Example:** React Standards
- **Part A:** Component Patterns (atoms, molecules, organisms)
- **Part B:** State Management (hooks, context, Redux)
- **Part C:** Testing (unit, integration, snapshot)

**Benefits:**
- Context-appropriate loading
- Different globs for each part
- Reduces token usage per context

---

### Strategy 3: By Complexity

**When to use:** Rule has basic and advanced concepts

**Example:** TypeScript Configuration
- **Part A:** Basic Setup (tsconfig, paths, strict mode)
- **Part B:** Advanced Types (generics, conditional types, utility types)

**Benefits:**
- Beginners see only basics
- Advanced users can load advanced part
- Progressive disclosure of complexity

---

### Strategy 4: By Lifecycle

**When to use:** Rule covers different phases

**Example:** Package Management
- **Part A:** Setup & Installation
- **Part B:** Development & Maintenance
- **Part C:** Deployment & Publishing

**Benefits:**
- Load only relevant phase
- Clear workflow progression
- Reduces cognitive load

---

## Step-by-Step Process

### Phase 1: Analysis

**1. Run size analysis:**
```bash
pnpm rules:analyze
```

**2. Identify oversized rule:**
- Review "Exceeds 12K" section
- Note character count and excess
- Review split suggestions

**3. Read the rule content:**
- Identify major sections (## headings)
- Look for natural boundaries
- Assess cohesion between sections

**4. Choose splitting strategy:**
- By Concern: Multiple distinct topics
- By Scope: Different use contexts
- By Complexity: Basic vs Advanced
- By Lifecycle: Sequential phases

---

### Phase 2: Planning

**1. Create split plan:**
```
Original: monorepo-structure-and-configuration.rules.mdc (13.4K)

Split Plan:
  Part A: monorepo-structure-and-configuration.core.rules.mdc (6.5K)
    - Core Principles
    - Monorepo Layout
    - Package Configuration
    - Root Pipeline

  Part B: monorepo-structure-and-configuration.tooling.rules.mdc (6.8K)
    - Testing Framework
    - Agent Coordination
    - Environment Variables
    - Related Rules
```

**2. Design frontmatter for each part:**
```yaml
# Part A (Core)
---
description: Core monorepo structure, ESM-only, no-build libraries, shared config
whenToUse: Core monorepo structure, ESM-only, no-build libraries, shared config
globs:
  - "package.json"
  - "pnpm-workspace.yaml"
  - "turbo.json"
  - "packages/*/package.json"
scopes:
  - monorepo
  - global
alwaysApply: true
---

# Part B (Tooling)
---
description: Monorepo tooling integration - testing, validation, env loading
whenToUse: Monorepo tooling integration - testing, validation, env loading
globs:
  - "tooling/**/*"
  - "**/vitest.config.*"
  - "**/.env*"
scopes:
  - monorepo
  - global
  - tooling
  - testing
alwaysApply: false
---
```

**3. Plan cross-references:**
- Where to link between parts
- How to maintain context
- What to reference in "Related Rules"

---

### Phase 3: Execution

**1. Create new files:**
```bash
cd .cursor/rules-source
cp monorepo-structure-and-configuration.rules.mdc monorepo-structure-and-configuration.core.rules.mdc
cp monorepo-structure-and-configuration.rules.mdc monorepo-structure-and-configuration.tooling.rules.mdc
```

**2. Edit Part A (Core):**
- Keep frontmatter and update as planned
- Keep sections: Core Principles → Root Pipeline
- Remove sections: Testing Framework → Related Rules
- Add cross-reference section at end

**3. Edit Part B (Tooling):**
- Keep frontmatter and update as planned
- Remove sections: Core Principles → Root Pipeline
- Keep sections: Testing Framework → Related Rules
- Add cross-reference section at end

**4. Add cross-references to both parts:**
```markdown
## Related Rules

This rule is part of the **Monorepo Structure** series:
- See `monorepo-structure-and-configuration.core.rules.mdc` for core principles
- See `monorepo-structure-and-configuration.tooling.rules.mdc` for tooling integration
```

**5. Delete original file (optional):**
```bash
# Either delete original:
rm monorepo-structure-and-configuration.rules.mdc

# Or convert to index/overview:
# Keep file but make it reference the split parts
```

---

### Phase 4: Verification

**1. Check character counts:**
```bash
pnpm rules:analyze
```

**Expected:**
```
✅ monorepo-structure-and-configuration.core.rules.mdc (6.5K)
✅ monorepo-structure-and-configuration.tooling.rules.mdc (6.8K)
```

**2. Rebuild and verify:**
```bash
pnpm rules:build:verify
```

**Expected:**
- Build succeeds without warnings
- Verification passes
- All CLIs receive updated files

**3. Test in Cursor:**
- Open file matching Part A globs → Part A should activate
- Open file matching Part B globs → Part B should activate
- Verify no duplicate content

**4. Test in other CLIs:**
- Cline: Check both parts appear in menu
- Codex: Verify both parts in appropriate AGENTS.md
- Windsurf: Confirm neither part exceeds limit
- Gemini: Check imports resolve correctly

---

## Naming Conventions

### Pattern: `original-name.part-identifier.rules.mdc`

**Hierarchical Split (Recommended):**
```
parent-rule.child-concern.rules.mdc

Examples:
  monorepo-structure-and-configuration.core.rules.mdc
  monorepo-structure-and-configuration.tooling.rules.mdc

  react-standards.component-patterns.rules.mdc
  react-standards.state-management.rules.mdc
  react-standards.testing.rules.mdc
```

**Sequential Split:**
```
rule-name.part-N.rules.mdc

Examples:
  node-functional-concerns.part-1.rules.mdc
  node-functional-concerns.part-2.rules.mdc
```

**Concern-Based Split:**
```
rule-name.concern.rules.mdc

Examples:
  express-architecture.routes.rules.mdc
  express-architecture.services.rules.mdc
  express-architecture.validation.rules.mdc
```

### Frontmatter Naming

**Part A (Core):**
```yaml
description: Core [topic] - foundation, setup, basic concepts
```

**Part B (Advanced/Tooling):**
```yaml
description: Advanced [topic] - tooling, integration, advanced patterns
```

---

## Example Split: monorepo-structure-and-configuration

### Current State Analysis

**File:** `monorepo-structure-and-configuration.rules.mdc`
**Size:** 13,366 characters (1,366 over limit)
**Sections:** 8 major sections

**Section Breakdown:**
1. Core Principles (1.2K)
2. Monorepo Layout (0.8K)
3. Package Configuration (2.1K) ⭐ Natural boundary
4. Root Pipeline (1.9K)
5. Testing Framework (1.5K)
6. Agent Coordination (1.4K)
7. Environment Variables (1.8K)
8. Related Rules (0.6K)

### Split Plan

**Split Point:** After "Root Pipeline" section

**Rationale:**
- Sections 1-4 cover core structure (6.0K)
- Sections 5-8 cover tooling integration (6.8K)
- Natural thematic boundary
- Both parts are independently useful

### Part A: Core Structure

**File:** `monorepo-structure-and-configuration.core.rules.mdc`
**Size:** ~6,500 characters
**Sections:**
1. Core Principles
2. Monorepo Layout
3. Package Configuration
4. Root Pipeline

**Frontmatter:**
```yaml
---
description: Core monorepo structure, ESM-only, no-build libraries, shared config
whenToUse: Core monorepo structure, ESM-only, no-build libraries, shared config
globs:
  - "package.json"
  - "pnpm-workspace.yaml"
  - "turbo.json"
  - "tsconfig*.json"
  - "packages/*/package.json"
scopes:
  - monorepo
  - global
alwaysApply: true
---
```

**Cross-Reference Section:**
```markdown
## 🔗 Related Rules

### Monorepo Tooling Integration
This rule covers core structure. For tooling integration, see:
- **`monorepo-structure-and-configuration.tooling.rules.mdc`** - Testing, validation, environment loading

### Backend Development Patterns
For backend code organization, see:
- **`monorepo-node-express-architecture.rules.mdc`** - Express.js applications
- **`node.functional-isolated-concerns.rules.mdc`** - Scripts, CLIs, workers
```

### Part B: Tooling Integration

**File:** `monorepo-structure-and-configuration.tooling.rules.mdc`
**Size:** ~6,800 characters
**Sections:**
1. Testing Framework (@kit/testing)
2. Agent Coordination (@kit/brain-monitor)
3. Environment Variables (@kit/env-loader)
4. Related Rules

**Frontmatter:**
```yaml
---
description: Monorepo tooling integration - testing, validation, env loading
whenToUse: Monorepo tooling integration - testing, validation, env loading
globs:
  - "tooling/**/*"
  - "**/vitest.config.*"
  - "**/playwright.config.*"
  - "**/.env*"
  - "scripts/**/*"
scopes:
  - monorepo
  - global
  - tooling
  - testing
alwaysApply: false
---
```

**Cross-Reference Section:**
```markdown
## 🔗 Related Rules

### Core Monorepo Structure
This rule covers tooling integration. For core structure, see:
- **`monorepo-structure-and-configuration.core.rules.mdc`** - Core principles, layout, packages

### Testing Standards
For detailed testing guidance, see:
- **`tests.unified-testing.rules.mdc`** - TDD process, test patterns
- **`tests.continuous-validation.rules.mdc`** - Auto-validation workflow
- **`brain-monitor-validation.rules.mdc`** - Error reporting system
```

### Implementation

**Step 1: Create files**
```bash
cd .cursor/rules-source
cp monorepo-structure-and-configuration.rules.mdc monorepo-structure-and-configuration.core.rules.mdc
cp monorepo-structure-and-configuration.rules.mdc monorepo-structure-and-configuration.tooling.rules.mdc
```

**Step 2: Edit Part A**
- Update frontmatter
- Keep sections 1-4
- Remove sections 5-8
- Add cross-references

**Step 3: Edit Part B**
- Update frontmatter
- Remove sections 1-4
- Keep sections 5-8
- Add cross-references

**Step 4: Delete original**
```bash
rm monorepo-structure-and-configuration.rules.mdc
```

**Step 5: Verify**
```bash
pnpm rules:analyze
pnpm rules:build:verify
```

---

## Cross-Reference Pattern

### Standard Template

**At end of each split part:**

```markdown
## 🔗 Related Rules

### [Series Name]

This rule is part of the **[Series Name]** series:
- See `[part-a-filename]` for [part A description]
- See `[part-b-filename]` for [part B description]
- See `[part-c-filename]` for [part C description] (if applicable)

### [Related Topic 1]
- **`[related-rule-1]`** - [Description]
- **`[related-rule-2]`** - [Description]

### [Related Topic 2]
- **`[related-rule-3]`** - [Description]
```

### Example 1: Express Architecture Split

**Part A (Routes & Controllers):**
```markdown
## 🔗 Related Rules

### Express Architecture Series
This rule covers HTTP routes and controllers. For other concerns:
- **`express-architecture.services.rules.mdc`** - Business logic and services
- **`express-architecture.validation.rules.mdc`** - Input validation and errors

### Backend Development
- **`node.functional-isolated-concerns.rules.mdc`** - For scripts and CLIs
- **`project-wide-proxy-rules.mdc`** - Proxy middleware patterns
```

### Example 2: React Standards Split

**Part A (Component Patterns):**
```markdown
## 🔗 Related Rules

### React Standards Series
This rule covers component patterns. For other React concerns:
- **`react-standards.state-management.rules.mdc`** - Hooks, Context, Redux
- **`react-standards.testing.rules.mdc`** - Component testing strategies

### UI Development
- **`atomic-design-component-strategy.rules.mdc`** - Atomic design principles
- **`storybook-first-composition.rules.mdc`** - Component isolation
```

---

## Validation Checklist

### Pre-Split Checklist
- [ ] Rule exceeds 12K characters (confirmed via `pnpm rules:analyze`)
- [ ] Splitting strategy chosen (by concern/scope/complexity/lifecycle)
- [ ] Natural split points identified
- [ ] Frontmatter designed for each part
- [ ] Cross-reference structure planned

### During Split Checklist
- [ ] New files created with appropriate names
- [ ] Frontmatter updated with accurate descriptions
- [ ] Globs updated for appropriate file matching
- [ ] Scopes updated for correct context distribution
- [ ] Content split at planned boundaries
- [ ] Cross-references added to both parts

### Post-Split Checklist
- [ ] Each split part is under 12K characters
- [ ] `pnpm rules:analyze` shows both parts as optimal or large (not exceeds)
- [ ] `pnpm rules:build` succeeds without warnings
- [ ] `pnpm rules:verify` passes all checks
- [ ] Original file deleted or converted to index
- [ ] All CLIs load split rules correctly:
  - [ ] Cursor: Both parts activate with appropriate globs
  - [ ] Cline: Both parts appear in toggle menu
  - [ ] Codex: Both parts in appropriate AGENTS.md files
  - [ ] Windsurf: Both parts under 12K limit
  - [ ] Gemini: Both parts imported correctly

### Content Quality Checklist
- [ ] No orphaned sections (all content included in a part)
- [ ] No duplicate content between parts
- [ ] Cross-references accurate and helpful
- [ ] Each part is independently useful
- [ ] Frontmatter accurately describes part content
- [ ] Globs prevent both parts from loading simultaneously (if intended)

---

## Common Pitfalls

### Pitfall 1: Splitting Mid-Section

**Problem:** Splitting in the middle of a cohesive section breaks flow and understanding.

**Example:**
```
❌ Bad:
  Part A ends with half of "Testing Framework" section
  Part B starts with other half of "Testing Framework" section

✅ Good:
  Part A ends after "Root Pipeline" section (complete)
  Part B starts with "Testing Framework" section (complete)
```

**Solution:** Always split at section boundaries (## headings).

---

### Pitfall 2: Forgetting Cross-References

**Problem:** Users don't know other parts exist, leading to incomplete understanding.

**Example:**
```
❌ Bad:
  Part A has no mention of Part B
  Users think Part A is complete

✅ Good:
  Part A clearly states "For tooling integration, see Part B"
  Users know to check Part B when needed
```

**Solution:** Add comprehensive "Related Rules" section to every part.

---

### Pitfall 3: Inconsistent Frontmatter

**Problem:** Different scopes/globs cause confusion about when each part applies.

**Example:**
```
❌ Bad:
  Part A: scopes: [monorepo, global]
  Part B: scopes: [testing]  # Missing 'monorepo'!

✅ Good:
  Part A: scopes: [monorepo, global]
  Part B: scopes: [monorepo, global, testing]
```

**Solution:** Ensure all parts share common base scopes, add specific scopes as needed.

---

### Pitfall 4: Overlapping Globs

**Problem:** Both parts load simultaneously, wasting tokens.

**Example:**
```
❌ Bad:
  Part A globs: ["**/*.tsx"]
  Part B globs: ["**/*.tsx"]  # Same pattern!
  Result: Both load for every .tsx file

✅ Good:
  Part A globs: ["apps/client/src/components/**/*.tsx"]
  Part B globs: ["apps/client/src/pages/**/*.tsx"]
  Result: Only relevant part loads
```

**Solution:** Design globs to be mutually exclusive or use `alwaysApply` judiciously.

---

### Pitfall 5: Orphaned Content

**Problem:** Content accidentally excluded from all parts.

**Example:**
```
❌ Bad:
  Original had section: "Deployment Strategies"
  Part A doesn't include it
  Part B doesn't include it
  Content lost!

✅ Good:
  All sections accounted for in split plan
  Every section appears in exactly one part
```

**Solution:** Create comprehensive split plan before editing, verify all content included.

---

### Pitfall 6: Over-Splitting

**Problem:** Splitting into too many small parts increases maintenance burden.

**Example:**
```
❌ Bad:
  Original: 13K characters
  Split into 6 parts of 2K each
  Result: 6 files to maintain, excessive cross-references

✅ Good:
  Original: 13K characters
  Split into 2 parts of 6.5K each
  Result: 2 files, simple cross-references
```

**Solution:** Aim for 2-3 parts maximum unless rule is extremely large (>20K).

---

## Quick Reference

### Split Decision Tree

```
Is rule > 12K chars?
├─ YES → MUST split
│   └─ Choose strategy:
│       ├─ Multiple distinct concerns? → By Concern
│       ├─ Different use contexts? → By Scope
│       ├─ Basic + Advanced? → By Complexity
│       └─ Sequential phases? → By Lifecycle
│
└─ NO → Is rule > 8K chars?
    ├─ YES → CONSIDER splitting (approaching limit)
    └─ NO → NO split needed (optimal size)
```

### Commands Reference

```bash
# Analyze rule sizes
pnpm rules:analyze

# Create split files
cp original.rules.mdc original.part-a.rules.mdc
cp original.rules.mdc original.part-b.rules.mdc

# Verify split
pnpm rules:build:verify

# Test in Cursor
# (Open files matching each part's globs)
```

---

## Related Documentation

- [CLI_COMPARISON_MATRIX.md](./CLI_COMPARISON_MATRIX.md) - Windsurf's 12K limit
- [RULE_SYSTEM.md](./RULE_SYSTEM.md) - Overall architecture
- [CURSOR_ACTIVATION_MODES_GUIDE.md](./CURSOR_ACTIVATION_MODES_GUIDE.md) - Glob configuration

---

**Need Help?** Run `pnpm rules:analyze` to see which rules need splitting, or consult the split suggestions in the analysis output.
