# CLI Comparison Matrix

> **Purpose:** Comprehensive comparison matrix documenting how each CLI handles context management, helping developers choose the right CLI and optimize rule loading.

**Last Updated:** 2025-10-22

---

## Table of Contents

1. [Overview](#overview)
2. [Feature Comparison Table](#feature-comparison-table)
3. [Activation Mode Details](#activation-mode-details)
4. [Context Management Strategies](#context-management-strategies)
5. [Token Efficiency Techniques](#token-efficiency-techniques)
6. [Best Practices Per CLI](#best-practices-per-cli)
7. [Recommended Configuration](#recommended-configuration)
8. [Testing Checklist](#testing-checklist)

---

## Overview

This monorepo supports **5 AI coding assistants**, each with unique context management capabilities. This matrix helps you choose the right CLI for your workflow and optimize rule loading for efficiency.

### When to Use Each CLI

| CLI | Best For | Strengths | Weaknesses |
|-----|----------|-----------|------------|
| **Cursor** | Primary IDE development | Native IDE integration, glob patterns, "Apply Intelligently" mode | Limited to IDE context |
| **Cline** | Task-specific workflows | Manual rule toggling, 200K context window | Requires manual rule management |
| **Codex** | Hierarchical projects | Automatic context merging, task sandboxing | Requires AGENTS.md maintenance |
| **Windsurf** | Quick iterations | Fast startup, model-driven decisions | 12K char limit per rule |
| **Gemini** | Complex analysis | Massive 1M token window, @import directives | Requires import configuration |

---

## Feature Comparison Table

| Feature | Cursor | Cline | Codex | Windsurf | Gemini |
|---------|--------|-------|-------|----------|--------|
| **File Format** | `.mdc` files | `.clinerules/` folder | `AGENTS.md` | `.windsurfrules` | `GEMINI.md` |
| **Activation Modes** | 4 modes | Toggle menu | Hierarchical | 3 modes | Hierarchical |
| **Glob Patterns** | ✅ Yes | ❌ No | ❌ No | ✅ Yes | ❌ No |
| **Hierarchical Loading** | ❌ No | ❌ No | ✅ Yes | ❌ No | ✅ Yes |
| **Import Directives** | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Yes (@import) |
| **Context Window** | 20K-200K | 200K | 128K | Unknown | 500K-1M |
| **Rule Toggling** | Per-rule | Per-rule | N/A | Per-rule | N/A |
| **Memory Commands** | ❌ No | ✅ Yes | ✅ Yes (/status) | ❌ No | ✅ Yes (/memory) |
| **Auto-Reload** | ✅ Yes | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| **Character Limit** | None | None | None | **12K/rule** | None |
| **IDE Integration** | ✅ Native | VSCode extension | CLI | ✅ Native | Web/CLI |

---

## Activation Mode Details

### Cursor's 4 Activation Modes

Cursor provides the most sophisticated rule activation system:

1. **Always Apply** - "Apply to every chat and cmd-k session"
   - **Use for:** Foundation rules (1-2 rules max)
   - **Example:** `monorepo-structure-and-configuration`
   - **Token cost:** High (always loaded)

2. **Apply Intelligently** - "When Agent decides it's relevant based on description"
   - **Use for:** Cross-cutting concerns (2-3 rules)
   - **Example:** `brain-monitor-validation`, `tests.tdd-workflow`
   - **Token cost:** Medium (AI decides)

3. **Apply to Specific Files** - "When file matches a specified pattern"
   - **Use for:** Tech-specific rules (15+ rules)
   - **Example:** `react-bulletproof-component-pattern` → `**/*.tsx, **/*.jsx`
   - **Token cost:** Low (only when matched)

4. **Apply Manually** - "When @-mentioned"
   - **Use for:** Experimental or rarely-used rules
   - **Example:** Special-purpose rules
   - **Token cost:** Zero (unless mentioned)

**Optimization Strategy:** Minimize "Always Apply" (1-2 rules), maximize "Apply to Specific Files" (15+ rules), use "Apply Intelligently" sparingly (2-3 rules).

### Cline's Toggle System

Cline displays all rules in a popover menu with toggle switches:

- **All 19 rules available** in dropdown
- **Enable/disable per task** manually
- **Meta-instructions** guide precedence and conflict resolution
- **Best for:** Task-specific workflows where you know which rules apply

**Optimization Strategy:** Create task-specific "rule presets" documented in meta-instructions:
- Frontend Development: Rules 01, 03-08, 15
- Backend Development: Rules 01, 09-11, 13-14
- Testing: Rules 01, 16-19

### Windsurf's 3 Activation Modes

Similar to Cursor but with a critical limitation:

1. **Always On** - `alwaysApply: true` in frontmatter
2. **Glob-Based** - File patterns defined in frontmatter
3. **Model Decision** - LLM decides based on context

**Critical Limitation:** Rules must be **under 12K characters**. Our analysis shows 3 rules exceed this limit and must be split.

### Codex's Hierarchical System

Codex automatically merges AGENTS.md files from multiple levels:

- **Global** (`~/.codex/AGENTS.md`): Personal preferences
- **Project** (root): Foundation rules
- **Context** (subdirs): Tech-specific rules

**Loading order:** Global → Project → Subfolder (later files override earlier)

**Optimization Strategy:** Place rules at the appropriate level:
- Global: Personal workflow preferences only
- Project root: 2-3 foundation rules
- Context subdirs: 5-10 tech-specific rules

### Gemini's Import System

Gemini uses `@import` directives for modular composition:

```markdown
# Root GEMINI.md
@import ./apps/client/GEMINI.md
@import ./packages/ui/GEMINI.md
```

**Features:**
- Hierarchical loading (root → subdirs)
- Relative path imports
- Circular import detection
- Configurable max depth (default: 5)

**Optimization Strategy:** Structure imports to minimize duplication and maximize relevance.

---

## Context Management Strategies

### Cursor: Glob Patterns + "Apply Intelligently"

**Primary Strategy:** Use glob patterns for automatic rule activation

**Example Configuration:**
```yaml
# react-bulletproof-component-pattern.rules.mdc
globs:
  - "**/*.tsx"
  - "**/*.jsx"
  - "apps/client/**/*"
  - "packages/*/src/components/**/*"
```

**Benefits:**
- Automatic activation when editing matching files
- Zero manual intervention
- Precise targeting

**Tips:**
- Test glob patterns before committing
- Use negative patterns to exclude files: `!**/*.test.tsx`
- Combine multiple patterns for comprehensive coverage

### Cline: Manual Toggling + Meta-Instructions

**Primary Strategy:** Toggle rules based on current task domain

**Task-Specific Presets:**

```markdown
### Frontend Development Preset
- ✅ 01-monorepo-structure-and-configuration
- ✅ 03-atomic-design-component-strategy
- ✅ 04-component-design-decision-tree
- ✅ 05-mobile-first-design
- ✅ 06-platform-pathways-pattern
- ✅ 07-react-bulletproof-component-pattern
- ✅ 08-storybook-first-composition
- ✅ 15-tests.unified-testing

### Backend Development Preset
- ✅ 01-monorepo-structure-and-configuration
- ✅ 09-monorepo-node-express-architecture
- ✅ 10-node.functional-isolated-concerns
- ✅ 11-project-wide-proxy-rules
- ✅ 12-cm-proxy-rules
- ✅ 13-brain-monitor-validation
- ✅ 14-tests.continuous-validation

### Testing Preset
- ✅ 01-monorepo-structure-and-configuration
- ✅ 13-brain-monitor-validation
- ✅ 14-tests.continuous-validation
- ✅ 15-tests.unified-testing
- ✅ 16-tests.tdd-workflow
- ✅ 17-testid
```

**Benefits:**
- Full control over loaded rules
- Task-optimized context
- Easy to document and share presets

### Codex: Hierarchical AGENTS.md Merging

**Primary Strategy:** Maintain AGENTS.md files at appropriate levels

**Directory Structure:**
```
/
├── AGENTS.md                      # Foundation rules (2-3 rules)
├── apps/
│   ├── client/
│   │   └── AGENTS.md              # React/Frontend rules
│   └── server/
│       └── AGENTS.md              # Express/Backend rules
├── packages/
│   └── ui/
│       └── AGENTS.md              # UI component rules
└── tooling/
    └── testing/
        └── AGENTS.md              # Testing rules
```

**Merge Behavior:**
- Working in `apps/client/`: Loads root + apps/client AGENTS.md
- Working in `apps/server/`: Loads root + apps/server AGENTS.md
- Each task runs in isolated environment

**Benefits:**
- Automatic context-appropriate loading
- No manual toggling
- Clear separation of concerns

### Windsurf: Activation Metadata + Glob Patterns

**Primary Strategy:** Use activation metadata in frontmatter

**Example:**
```yaml
---
activation: glob-based
globs:
  - "**/*.tsx"
  - "**/*.jsx"
alwaysApply: false
---
```

**Activation Modes:**
- `alwaysApply: true` - Always On
- `globs: [...]` - Glob-Based
- Neither - Model Decision

**Critical:** Ensure rules are under 12K characters (see analysis results).

### Gemini: @import Directives + Hierarchical Loading

**Primary Strategy:** Use @import for modular composition

**Root GEMINI.md:**
```markdown
# Monorepo Rules

## Foundation
@import .cursor/rules-source/monorepo-structure-and-configuration.rules.mdc

## Context-Specific Rules
@import ./apps/client/GEMINI.md
@import ./apps/server/GEMINI.md
@import ./packages/ui/GEMINI.md
```

**Context GEMINI.md (apps/client/):**
```markdown
# Frontend Rules

@import ../../.cursor/rules-source/react-bulletproof-component-pattern.rules.mdc
@import ../../.cursor/rules-source/atomic-design-component-strategy.rules.mdc
@import ../../.cursor/rules-source/storybook-first-composition.rules.mdc
```

**Benefits:**
- Modular composition
- Reusable imports
- Clear dependencies

---

## Token Efficiency Techniques

### Lazy Loading
**Use glob patterns** (Cursor, Windsurf) to load rules only when needed.

**Example:** React rules only load when editing `.tsx` files.

**Token Savings:** 20-30K tokens (assuming 15 unused rules)

### Hierarchical Scoping
**Place rules at appropriate level** (Codex, Gemini) to avoid loading irrelevant context.

**Example:** Backend rules in `apps/server/AGENTS.md`, not global.

**Token Savings:** 10-15K tokens per context

### Rule Toggling
**Disable unused rules** (Cline, Windsurf) per task to conserve tokens.

**Example:** Disable all backend rules when doing frontend work.

**Token Savings:** 15-20K tokens (7-8 disabled rules)

### Context Handoffs
**Use new_task** at 80% threshold (Cline, Codex) to start fresh conversation.

**Example:** After completing feature, run `new_task` before starting tests.

**Token Savings:** Resets context window to 0%

### Import Depth Limiting
**Configure max depth** (Gemini) to prevent over-importing.

**Example:** Set `maxImportDepth: 3` to limit nested imports.

**Token Savings:** 5-10K tokens (prevents deep import chains)

---

## Best Practices Per CLI

### Cursor Best Practices

1. **Foundation Rules:** Set 1-2 rules to "Always Apply"
   - `monorepo-structure-and-configuration`

2. **Tech-Specific Rules:** Set 15+ rules to "Apply to Specific Files"
   - Use precise glob patterns
   - Test patterns before committing

3. **Cross-Cutting Rules:** Set 2-3 rules to "Apply Intelligently"
   - `brain-monitor-validation`
   - `tests.tdd-workflow`

4. **Rarely-Used Rules:** Set to "Apply Manually"
   - Experimental rules
   - Special-purpose rules

### Cline Best Practices

1. **Keep all 19 rules available** in toggle menu
2. **Create task-specific presets** (documented in meta-instructions)
3. **Monitor token usage** and disable unused rules
4. **Use new_task** at 80% threshold
5. **Leverage meta-instructions** for precedence

### Codex Best Practices

1. **Maintain hierarchical AGENTS.md** at appropriate levels
2. **Place foundation rules** in root AGENTS.md (2-3 rules)
3. **Place context-specific rules** in subdirs (5-10 rules each)
4. **Verify loading** with `/status` command
5. **Use task sandboxing** for isolated workflows

### Windsurf Best Practices

1. **Split large rules** exceeding 12K characters (see analysis)
2. **Use activation metadata** appropriately:
   - `alwaysApply: true` for 1-2 foundation rules
   - `globs: [...]` for 15+ tech-specific rules
   - Neither for cross-cutting rules (model decides)
3. **Test activation** after configuration changes

### Gemini Best Practices

1. **Use @import directives** for modular composition
2. **Structure imports hierarchically** (root → context → specific)
3. **Avoid circular imports** (build validates this)
4. **Configure max depth** based on project size
5. **Use memory commands**:
   - `/memory show` - Verify imports resolved
   - `/memory refresh` - Reload after rule changes

---

## Recommended Configuration

### Optimal Activation Mode Per Rule

| Rule | Cursor | Cline | Codex | Windsurf | Gemini |
|------|--------|-------|-------|----------|--------|
| monorepo-structure | Always Apply | Always On | Root AGENTS.md | alwaysApply: true | Root import |
| brain-monitor | Apply Intelligently | Toggle | Context AGENTS.md | Model Decision | Context import |
| atomic-design | Apply to Files (`**/components/**`) | Toggle | Context AGENTS.md | Glob-Based | Context import |
| component-tree | Apply Intelligently | Toggle | Context AGENTS.md | Model Decision | Context import |
| mobile-first | Apply to Files (`**/*.tsx`) | Toggle | Context AGENTS.md | Glob-Based | Context import |
| platform-pathways | Apply to Files (`**/*.tsx`) | Toggle | Context AGENTS.md | Glob-Based | Context import |
| react-bulletproof | Apply to Files (`**/*.tsx, **/*.jsx`) | Toggle | Context AGENTS.md | Glob-Based | Context import |
| storybook-first | Apply to Files (`**/*.stories.tsx`) | Toggle | Context AGENTS.md | Glob-Based | Context import |
| express-architecture | Apply to Files (`apps/server/**/*`) | Toggle | Context AGENTS.md | Glob-Based | Context import |
| functional-node | Apply to Files (`scripts/**/*`) | Toggle | Context AGENTS.md | Glob-Based | Context import |
| proxy-rules | Apply to Files (`services/**/*`) | Toggle | Context AGENTS.md | Glob-Based | Context import |
| cm-proxy | Apply to Files (`services/cm/**/*`) | Toggle | Context AGENTS.md | Glob-Based | Context import |
| tests.continuous | Apply Intelligently | Toggle | Context AGENTS.md | Model Decision | Context import |
| tests.unified | Apply to Files (`**/*.test.ts(x)`) | Toggle | Context AGENTS.md | Glob-Based | Context import |
| tests.tdd | Apply Intelligently | Toggle | Context AGENTS.md | Model Decision | Context import |
| testid | Apply to Files (`**/*.test.ts(x)`) | Toggle | Context AGENTS.md | Glob-Based | Context import |
| pr-creation | Apply Manually | Toggle | N/A | Model Decision | Root import |
| documentation-strategy | Apply Manually | Toggle | Root AGENTS.md | Model Decision | Root import |
| package-versioning | Apply Manually | Toggle | Context AGENTS.md | Model Decision | Context import |

### Example Configurations

#### Cursor: Optimal Setup for Frontend Development
```
✅ Always Apply (1 rule):
   - monorepo-structure-and-configuration

✅ Apply to Specific Files (8 rules):
   - atomic-design-component-strategy (**/**/components/***)
   - mobile-first-design (**/*.tsx, **/*.jsx)
   - platform-pathways-pattern (**/*.tsx, **/*.jsx)
   - react-bulletproof-component-pattern (**/*.tsx, **/*.jsx)
   - storybook-first-composition (**/*.stories.tsx)
   - tests.unified-testing (**/*.test.ts(x))
   - testid (**/*.test.ts(x))
   - component-design-decision-tree (**/*.tsx, **/*.jsx)

✅ Apply Intelligently (2 rules):
   - brain-monitor-validation
   - tests.tdd-workflow

❌ Apply Manually (8 rules):
   - All backend and documentation rules
```

#### Cline: Frontend Development Preset
```
Enabled Rules (10):
  ✅ 01-monorepo-structure
  ✅ 03-atomic-design
  ✅ 04-component-tree
  ✅ 05-mobile-first
  ✅ 06-platform-pathways
  ✅ 07-react-bulletproof
  ✅ 08-storybook-first
  ✅ 13-brain-monitor
  ✅ 15-tests.unified
  ✅ 16-tests.tdd

Disabled Rules (9):
  ❌ All backend rules (09-12)
  ❌ Documentation rules (02, 17-19)
```

---

## Testing Checklist

### Verify Rules Load Correctly

**Cursor:**
- [ ] All 19 rules visible in Cursor Settings → Rules
- [ ] Each rule shows activation mode dropdown
- [ ] Glob patterns activate correctly (test with sample files)

**Cline:**
- [ ] All 19 rules listed in popover menu
- [ ] Toggle switches functional
- [ ] Meta-instructions display correctly

**Codex:**
- [ ] Run `/status` shows loaded AGENTS.md files
- [ ] Hierarchical loading works (root + context)
- [ ] Scope filtering prevents wrong rules from loading

**Windsurf:**
- [ ] All rules load without errors
- [ ] Activation metadata respected
- [ ] No rules exceed 12K characters

**Gemini:**
- [ ] Run `/memory show` verifies imports resolved
- [ ] No circular import errors
- [ ] Hierarchical loading works

### Verify Correct Context Activation

**Test Scenario: Open React Component**
- **Expected:** React rules activate
- **Not Expected:** Backend rules activate

**Test Scenario: Open Express File**
- **Expected:** Backend rules activate
- **Not Expected:** React rules activate

**Test Scenario: Open Test File**
- **Expected:** Testing rules activate
- **Also Expected:** Context-appropriate tech rules activate

### Check Context Window Usage

**Cursor:** Use `/context` command or check chat status
**Cline:** Monitor token usage in sidebar
**Codex:** Run `/status` for context summary
**Windsurf:** Check rule panel for active rules
**Gemini:** Run `/memory show` for import tree

---

## References

- [RULE_SYSTEM.md](./RULE_SYSTEM.md) - Complete architecture documentation
- [CURSOR_ACTIVATION_MODES_GUIDE.md](./CURSOR_ACTIVATION_MODES_GUIDE.md) - Detailed Cursor guide
- [CLI_TESTING_PROCEDURES.md](./CLI_TESTING_PROCEDURES.md) - Empirical testing procedures
- [ADVANCED_CONTEXT_OPTIMIZATION.md](./ADVANCED_CONTEXT_OPTIMIZATION.md) - Power user techniques

**Official CLI Documentation:**
- Cursor: https://cursor.com/docs
- Cline: https://github.com/cline/cline
- Codex: https://codexhq.com/docs
- Windsurf: https://windsurf.ai/docs
- Gemini: https://ai.google.dev/gemini-api/docs
