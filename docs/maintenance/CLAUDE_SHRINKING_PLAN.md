# Plan to Shrink CLAUDE.md

**Current State:** 1,266 lines in `docs/ai-platforms/CLAUDE.md`  
**Target:** ~400-500 lines (60% reduction)  
**Strategy:** Extract detailed content to documentation, keep only essential rules

---

## Analysis

### Current Content Breakdown

1. **Documentation Strategy** (~200 lines)
   - Detailed hierarchy explanation
   - File naming conventions
   - YAML frontmatter requirements
   - Cross-linking standards

2. **Hexagonal Architecture** (~280 lines)
   - Complete architecture explanation
   - File naming patterns
   - TDD workflow details
   - Error handling patterns

3. **Monorepo Structure** (~370 lines)
   - ESM-only explanation
   - Package configuration templates
   - Turbo pipeline details
   - Testing framework API
   - Environment variable management

4. **PM Agent TDD Workflow** (~390 lines)
   - Test hierarchy explanation
   - Complete TDD workflow steps
   - Brain Garden integration
   - Test structure examples

---

## Shrinking Strategy

### Principle: "Reference, Don't Repeat"

Instead of including full content in rules, we'll:
1. **Keep essential principles** (what to do)
2. **Reference detailed docs** (how to do it)
3. **Extract examples** to separate guide files
4. **Focus on PM Agent mission** (motivation system)

---

## Extraction Plan

### 1. Documentation Strategy → Extract to Guide

**Current:** 200 lines of detailed documentation standards  
**Action:** Move to `docs/guides/documentation-standards.md`

**Keep in Rules:**
- Documentation hierarchy (3 levels)
- Quick decision matrix
- Reference to guide

**Extract:**
- Detailed YAML frontmatter examples
- File naming conventions
- Cross-linking standards
- Index file maintenance

**New Rule Size:** ~30 lines

---

### 2. Hexagonal Architecture → Extract to Architecture Doc

**Current:** 280 lines of architecture patterns  
**Action:** Move to `docs/architecture/hexagonal-architecture.md`

**Keep in Rules:**
- Core principle (Core vs Adapters)
- File naming pattern: `<feature>.<role>.ts`
- Dependency injection pattern
- Reference to architecture doc

**Extract:**
- Complete structure examples
- Detailed TDD workflow steps
- Error handling implementation
- Path alias configuration

**New Rule Size:** ~50 lines

---

### 3. Monorepo Structure → Extract to Guide

**Current:** 370 lines of monorepo configuration  
**Action:** Move to `docs/guides/monorepo-structure.md` (already exists, enhance it)

**Keep in Rules:**
- Core principles (ESM-only, no-build, shared config)
- Quick reference table
- Agent coordination workflow
- Reference to guide

**Extract:**
- Complete package.json templates
- Turbo pipeline details
- Testing framework API details
- Environment variable examples

**New Rule Size:** ~80 lines

---

### 4. PM Agent TDD Workflow → Extract to Guide

**Current:** 390 lines of TDD workflow  
**Action:** Move to `docs/guides/pm-agent-tdd-workflow.md`

**Keep in Rules:**
- Core principle (E2E tests are most important)
- Test hierarchy priority
- Mandatory rules (4 rules)
- Reference to guide

**Extract:**
- Complete TDD workflow steps
- Detailed test examples
- Brain Garden integration details
- Test structure examples

**New Rule Size:** ~60 lines

---

## Implementation Steps

### Step 1: Create Documentation Files

1. **`docs/guides/documentation-standards.md`**
   - Extract from `monorepo-documentation-strategy.rules.mdc`
   - Include all examples and detailed patterns

2. **`docs/architecture/hexagonal-architecture.md`**
   - Extract from `monorepo-node-electron-express-hexagonal-architecture.rules.mdc`
   - Include complete examples and TDD workflow

3. **`docs/guides/pm-agent-tdd-workflow.md`**
   - Extract from `pm-agent-tdd-workflow.rules.mdc`
   - Include all test examples and Brain Garden integration

4. **Enhance `docs/guides/monorepo-structure.md`**
   - Add missing content from `monorepo-structure-and-configuration.rules.mdc`
   - Include package templates and Turbo details

### Step 2: Update Rule Files

For each rule file, replace detailed content with:
1. **Core principle** (1-2 paragraphs)
2. **Quick reference** (bullet points or table)
3. **Mandatory rules** (if applicable)
4. **Reference link** to detailed doc

Example transformation:

**Before (200 lines):**
```markdown
# Documentation Strategy

[200 lines of detailed content...]
```

**After (30 lines):**
```markdown
# Documentation Strategy

## Core Principle
Documentation follows a 3-level hierarchy: package → feature → global.

## Quick Reference
- Package-level: `packages/[name]/docs/`
- Feature-level: `/docs/features/[name]/`
- Global: `/docs/architecture/`

## Mandatory Rules
1. All docs must have YAML frontmatter
2. Use kebab-case for filenames
3. Update index files when creating docs

## Detailed Documentation
See: `docs/guides/documentation-standards.md` for:
- Complete YAML frontmatter examples
- File naming conventions
- Cross-linking standards
- Index file maintenance
```

### Step 3: Update References

Update all rule files to reference the new documentation:
- Add links to extracted docs
- Update cross-references
- Ensure consistency

### Step 4: Regenerate and Verify

1. Run `pnpm rules:build`
2. Verify CLAUDE.md is ~400-500 lines
3. Check that all essential information is still present
4. Verify references work correctly

---

## Expected Results

### Before
- **CLAUDE.md:** 1,266 lines
- **Content:** Everything inline
- **Maintenance:** Hard to update
- **Focus:** Mixed concerns

### After
- **CLAUDE.md:** ~400-500 lines (60% reduction)
- **Content:** Principles + references
- **Maintenance:** Easier to update
- **Focus:** PM Agent mission

### Benefits

1. **Faster Context Loading:** Smaller file = faster AI processing
2. **Better Organization:** Detailed docs in proper locations
3. **Easier Maintenance:** Update detailed docs without touching rules
4. **Clearer Focus:** Rules focus on "what", docs explain "how"
5. **Better Discoverability:** Detailed guides are easier to find

---

## PM Agent Mission Alignment

The roadmap emphasizes:
- **Phase 1:** Cleanup & Organization
- **Phase 2:** Intelligence & Knowledge
- **Phase 3:** Autonomous Governance

The shrunk CLAUDE.md should prioritize:
1. **Motivation system rules** (keep detailed)
2. **TDD workflow principles** (keep essential)
3. **Project tracking patterns** (keep essential)
4. **Reference detailed guides** (extract examples)

---

## Next Steps

1. ✅ Create this plan document
2. ⏳ Extract documentation strategy to guide
3. ⏳ Extract hexagonal architecture to architecture doc
4. ⏳ Extract TDD workflow to guide
5. ⏳ Enhance monorepo structure guide
6. ⏳ Update rule files with references
7. ⏳ Regenerate CLAUDE.md
8. ⏳ Verify and test

---

**Created:** 2025-11-07  
**Status:** Planning Phase  
**Target Completion:** After roadmap review

