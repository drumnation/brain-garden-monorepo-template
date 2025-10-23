# Advanced Context Optimization Guide

> **Purpose:** Advanced techniques, memory hooks, and CLI-specific tricks to maximize rule effectiveness while minimizing token usage. For power users seeking optimal context management.

**Last Updated:** 2025-10-22

---

## Table of Contents

1. [Context Optimization Principles](#context-optimization-principles)
2. [Cursor Advanced Techniques](#cursor-advanced-techniques)
3. [Cline Advanced Techniques](#cline-advanced-techniques)
4. [Codex Advanced Techniques](#codex-advanced-techniques)
5. [Windsurf Advanced Techniques](#windsurf-advanced-techniques)
6. [Gemini Advanced Techniques](#gemini-advanced-techniques)
7. [Multi-CLI Workflows](#multi-cli-workflows)
8. [Token Budget Management](#token-budget-management)
9. [Advanced Memory Hooks](#advanced-memory-hooks)
10. [Troubleshooting Performance](#troubleshooting-performance)

---

## Context Optimization Principles

### Core Principles

1. **Lazy Loading** - Load rules only when needed
2. **Hierarchical Scoping** - Place rules at appropriate level
3. **Rule Toggling** - Disable unused rules per task
4. **Context Handoffs** - Use new_task at 80% threshold
5. **Import Depth Limiting** - Configure max depth appropriately

### Token Efficiency Formula

```
Total Context = Rules + Codebase + Conversation
Target: 40% + 40% + 20%

Example (20K window):
- 8K tokens for rules (4-6 active rules)
- 8K tokens for code (5-10 files)
- 4K tokens for conversation (50-100 messages)
```

---

## Cursor Advanced Techniques

### Context Pinning

**Purpose:** Keep frequently-used rules always accessible

**When to use:**
- Working on specific feature for extended period
- Need certain rules regardless of file type
- Override glob-based activation temporarily

**How to pin:**
1. Open Cursor chat
2. Right-click on rule in context indicator
3. Select "Pin rule"
4. Rule stays loaded until unpinned

**Best practices:**
- Pin 2-3 rules maximum
- Unpin when switching tasks
- Prefer glob patterns over pinning

---

### Long-Context Mode

**Standard:** 20K tokens (~80K characters)
**Long-Context:** 200K tokens (~800K characters)

**Enable for:**
- Large refactors spanning 10+ files
- Complex features requiring extensive context
- Deep codebase exploration
- Analyzing large datasets or logs

**Enable via:**
- Cursor Settings → Enable "Long Context Mode"

**Trade-offs:**
- **Pros:** Load more rules, files, history
- **Cons:** Slower responses (2-3x), higher API costs

**Monitoring:**
- Use `/context` command to check usage
- Switch back to standard when possible

---

### Glob Pattern Optimization

**Precise Patterns:**
```yaml
# ❌ Too broad (matches everything)
globs:
  - "**/*"

# ✅ Precise (matches only React components)
globs:
  - "apps/client/src/components/**/*.tsx"
  - "packages/ui/src/**/*.tsx"
  - "!**/*.test.tsx"  # Exclude tests
```

**Negative Patterns:**
```yaml
# Include all TypeScript except tests
globs:
  - "**/*.ts"
  - "**/*.tsx"
  - "!**/*.test.ts"
  - "!**/*.test.tsx"
  - "!**/*.spec.ts"
```

**Testing Patterns:**
```bash
# Test glob patterns before committing
find . -path "apps/client/src/components/**/*.tsx" -type f
```

---

## Cline Advanced Techniques

### Rule Presets

**Purpose:** Create task-specific rule combinations

**Frontend Development Preset:**
```markdown
### Frontend Preset (10 rules, ~25K tokens)
✅ 01-monorepo-structure-and-configuration
✅ 03-atomic-design-component-strategy
✅ 04-component-design-decision-tree
✅ 05-mobile-first-design
✅ 06-platform-pathways-pattern
✅ 07-react-bulletproof-component-pattern
✅ 08-storybook-first-composition
✅ 13-brain-monitor-validation
✅ 15-tests.unified-testing
✅ 16-tests.tdd-workflow
```

**Backend Development Preset:**
```markdown
### Backend Preset (9 rules, ~22K tokens)
✅ 01-monorepo-structure-and-configuration
✅ 09-monorepo-node-express-architecture
✅ 10-node.functional-isolated-concerns
✅ 11-project-wide-proxy-rules
✅ 12-cm-proxy-rules
✅ 13-brain-monitor-validation
✅ 14-tests.continuous-validation
✅ 15-tests.unified-testing
✅ 16-tests.tdd-workflow
```

**Testing Preset:**
```markdown
### Testing Preset (6 rules, ~18K tokens)
✅ 01-monorepo-structure-and-configuration
✅ 13-brain-monitor-validation
✅ 14-tests.continuous-validation
✅ 15-tests.unified-testing
✅ 16-tests.tdd-workflow
✅ 17-testid
```

**Document in meta-instructions for easy reference**

---

### Context Handoffs

**When to use `new_task`:**
- Context usage > 80% (160K of 200K tokens)
- Switching between major tasks (frontend → backend)
- Starting fresh after completing feature
- Clearing conversation history

**How to use:**
```
# In Cline chat
/new_task

# Cline starts fresh conversation with:
- ✅ Rules still available (re-enable as needed)
- ✅ Codebase context preserved
- ❌ Conversation history cleared (0% usage)
```

**Best practices:**
- Summarize completed work before handoff
- Document state for continuity
- Re-enable relevant rules for new task

---

### Memory Management

**Monitor token usage:**
- Cline shows usage in sidebar
- Watch for 60%+ usage (120K tokens)
- Proactively handoff at 80%

**Optimize rule descriptions:**
- Ensure descriptions clearly indicate relevance
- AI uses descriptions to parse appropriateness
- Better descriptions = better decisions

---

## Codex Advanced Techniques

### Hierarchical AGENTS.md Strategy

**Three-Level Approach:**

**Level 1: Global (`~/.codex/AGENTS.md`):**
```markdown
# Personal Preferences (< 2K tokens)
- Preferred coding style
- Personal workflow preferences
- Editor shortcuts you use
```

**Level 2: Project (root `AGENTS.md`):**
```markdown
# Foundation Rules (6-8K tokens)
- monorepo-structure-and-configuration
- brain-monitor-validation
```

**Level 3: Context (subdir `AGENTS.md`):**
```markdown
# apps/client/AGENTS.md (12-15K tokens)
- React rules
- Component design rules
- Storybook rules
- Frontend testing rules
```

**Benefits:**
- Automatic context-appropriate loading
- No manual toggling needed
- Clear separation of concerns

---

### Task Sandboxing

**How Codex tasks work:**
- Each task runs in isolated environment
- Context = Global + Project + Task-specific AGENTS.md
- Tasks don't share conversation history

**Optimization strategy:**
1. Keep Global minimal (< 2K tokens)
2. Keep Project focused (< 8K tokens)
3. Put bulk of rules in Context level (< 15K tokens)
4. Total per task: < 25K tokens (leaves 103K for code)

---

### Memory Verification

**Check loaded files:**
```bash
/status

# Output shows:
# Loaded: ~/.codex/AGENTS.md
# Loaded: /path/to/project/AGENTS.md
# Loaded: /path/to/project/apps/client/AGENTS.md
# Total: 3 files, ~23K tokens
```

**Debugging missing rules:**
1. Run `/status` to see loaded files
2. Check if expected AGENTS.md exists in path
3. Verify scope filtering allows rule in context
4. Confirm build script generated file correctly

---

## Windsurf Advanced Techniques

### Activation Metadata Optimization

**Choose optimal mode per rule:**

**Always On (1-2 rules):**
```yaml
alwaysApply: true
```
- Foundation rules only
- Needed in every context
- Example: monorepo-structure

**Glob-Based (15+ rules):**
```yaml
alwaysApply: false
globs:
  - "**/*.tsx"
  - "**/*.jsx"
```
- Tech-specific rules
- Precise file matching
- Most efficient

**Model Decision (2-3 rules):**
```yaml
alwaysApply: false
# No globs defined
```
- Cross-cutting concerns
- AI decides relevance
- Use sparingly

---

### Rule Splitting Strategy

**When to split:**
- Rule exceeds 12K characters
- Analysis shows "Exceeds 12K"

**How to split:**
1. Run `pnpm rules:analyze` to identify
2. Follow [RULE_SPLITTING_GUIDE.md](./RULE_SPLITTING_GUIDE.md)
3. Split at natural boundaries
4. Maintain cross-references

**Our 3 oversized rules:**
1. `monorepo-structure-and-configuration` (13.4K)
2. `node.functional-isolated-concerns` (12.5K)
3. `tests.unified-testing` (12.5K)

---

### Cascade Configuration

**Allow/deny lists for auto-execution:**

**Safe commands (allow):**
- `npm install`
- `git status`
- `pnpm test`

**Dangerous commands (deny):**
- `rm -rf`
- `git push --force`
- Database operations

**Configure in Windsurf settings:**
- Settings → Cascade → Command Policy
- Add trusted commands to allowlist
- Block dangerous patterns

---

## Gemini Advanced Techniques

### Import Hierarchy Optimization

**Minimize duplication:**

**Root GEMINI.md (orchestrator):**
```markdown
# Foundation
@import .cursor/rules-source/monorepo-structure-and-configuration.rules.mdc

# Contexts
@import ./apps/client/GEMINI.md
@import ./apps/server/GEMINI.md
```

**Context GEMINI.md (specialized):**
```markdown
# apps/client/GEMINI.md
@import ../../.cursor/rules-source/react-bulletproof-component-pattern.rules.mdc
@import ../../.cursor/rules-source/atomic-design-component-strategy.rules.mdc
@import ../../.cursor/rules-source/storybook-first-composition.rules.mdc
```

**Benefits:**
- Foundation imported once (root level)
- Context rules imported as needed
- No duplication across contexts

---

### Memory Bank Usage

**Session-specific context:**
```bash
# Add temporary context for this session
/memory add "Working on authentication feature, focus on security"

# View current memory
/memory show

# Refresh after rule changes
/memory refresh
```

**Best practices:**
- Use for task-specific context
- Clear when switching tasks
- Complement rules, don't replace

---

### Import Depth Configuration

**Default:** 5 levels
**Max:** Configurable (10+)

**When to adjust:**
- **Increase:** Complex nested imports, deep hierarchy
- **Decrease:** Performance concerns, circular import risks

**Configure in Gemini settings:**
```yaml
maxImportDepth: 5  # Default
```

**Trade-offs:**
- **Higher depth:** More context, slower loading
- **Lower depth:** Faster, less context

---

## Multi-CLI Workflows

### Scenario 1: Frontend Development

**Primary:** Cursor (IDE integration)
- Edit components in IDE
- Glob-activated React rules
- Real-time feedback

**Quick Tasks:** Cline (task-specific)
- Toggle frontend preset
- Quick fixes and refactors
- Test generation

**Deep Analysis:** Gemini (1M token window)
- Complex refactors
- Architecture decisions
- Full codebase analysis

---

### Scenario 2: Backend Development

**Primary:** Cursor (IDE integration)
- Edit Express routes/services
- Glob-activated backend rules

**API Generation:** Codex (hierarchical context)
- Automatic context loading
- Task sandboxing
- Endpoint generation

**Testing:** Cline (focused testing)
- Enable testing preset
- Write comprehensive tests
- Validate with brain-monitor

---

### Scenario 3: Full-Stack Feature

**Phase 1 - Frontend (Cursor):**
- Build UI components
- React + Storybook rules active
- Iterative development

**Phase 2 - Backend (Codex):**
- Generate API endpoints
- Express rules auto-loaded
- Service layer implementation

**Phase 3 - Integration (Gemini):**
- End-to-end testing
- Full context loaded via imports
- Integration validation

---

## Token Budget Management

### Calculating Token Usage

**Formula:** ~1 token per 4 characters

**Rule Estimates:**
- Foundation rules: ~3K tokens
- Tech-specific rules: ~2K tokens each
- Total for all 19 rules: ~40K tokens

---

### Optimization Strategies

**1. Load only relevant rules:**
```
Standard: All 19 rules = 40K tokens
Optimized: 6 active rules = 15K tokens
Savings: 25K tokens (62.5%)
```

**2. Use hierarchical loading:**
```
Cursor: All rules in single context = 40K tokens
Codex: Root (6K) + Context (15K) = 21K tokens
Savings: 19K tokens (47.5%)
```

**3. Toggle rules per task:**
```
Cline: All enabled = 40K tokens
Cline: Preset enabled = 18K tokens
Savings: 22K tokens (55%)
```

**4. Context handoffs:**
```
Before handoff: 160K tokens used (80%)
After new_task: 20K tokens used (10%)
Savings: 140K tokens restored
```

---

### Context Window Allocation

**Recommended Split (20K window):**
```
Rules:        8K tokens (40%)
Codebase:     8K tokens (40%)
Conversation: 4K tokens (20%)
```

**Adjusted for long context (200K window):**
```
Rules:       40K tokens (20%)  # Load all 19 rules
Codebase:    80K tokens (40%)  # 15-20 files
Conversation: 80K tokens (40%) # 800+ messages
```

---

## Advanced Memory Hooks

### Cursor: .cursorrules File

**Purpose:** Agent correction instructions

**Location:** `.cursorrules` (root)

**Combines with .mdc rules for layered guidance**

**Example:**
```markdown
# .cursorrules
- Always run tests after code changes
- Prefer functional patterns over classes
- Use TypeScript strict mode
```

---

### Cline: Meta-Instructions

**Purpose:** "Rule about rules"

**Location:** `.clinerules/00-meta-instructions.md`

**Defines precedence and conflict resolution**

**Example:**
```markdown
## Rule Precedence
1. Foundation rules (01-02)
2. Architecture rules (09-12)
3. Pattern rules (03-08)
4. Testing rules (13-17)
```

---

### Codex: Global AGENTS.md

**Purpose:** Personal workflow preferences

**Location:** `~/.codex/AGENTS.md`

**Applies to ALL projects**

**Example:**
```markdown
# Personal Preferences
- I prefer detailed explanations
- Break down complex tasks into steps
- Ask clarifying questions before acting
```

---

### Gemini: Root Orchestrator

**Purpose:** Import orchestration

**Location:** Root `GEMINI.md`

**Controls what gets imported where**

**Example:**
```markdown
# Global Rules
@import .cursor/rules-source/monorepo-structure-and-configuration.rules.mdc

# Conditional Imports (based on task)
# Frontend: @import ./apps/client/GEMINI.md
# Backend: @import ./apps/server/GEMINI.md
```

---

## Troubleshooting Performance

### Symptom: Slow Response Times

**Possible Causes:**
1. Too many rules loaded (> 40K tokens)
2. Long context mode when not needed
3. Too many files in context

**Solutions:**
```bash
# 1. Check active rules
/context  # Cursor
/status   # Codex
/memory show  # Gemini

# 2. Disable unused rules
# Cline: Toggle off
# Cursor: Change to "Apply to Specific Files"

# 3. Close unnecessary files
# Keep only 5-10 files open
```

---

### Symptom: Context Window Full

**Possible Causes:**
1. Too many active rules
2. Too many open files
3. Long conversation history

**Solutions:**
```bash
# 1. Reduce active rules (4-6 ideal)
# 2. Close files (5-10 ideal)
# 3. Start new chat (Cmd+Shift+K)
# 4. Enable long-context mode (if needed)
```

---

### Symptom: Wrong Rules Activating

**Possible Causes:**
1. Glob pattern matches unintended files
2. AI over-activating "Apply Intelligently"
3. Scope filtering not working

**Solutions:**
```bash
# 1. Review and refine glob patterns
# 2. Switch to "Apply to Specific Files"
# 3. Check scope configuration in AGENTS.md/GEMINI.md
```

---

## Quick Reference Card

```
┌──────────────────────────────────────────────────────────────┐
│           ADVANCED CONTEXT OPTIMIZATION CHEAT SHEET           │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Technique              │ Token Savings  │ Best For          │
│  ──────────────────────┼────────────────┼──────────────────  │
│  Lazy Loading          │ 25K (62%)      │ All CLIs          │
│  Hierarchical Scoping  │ 19K (47%)      │ Codex, Gemini     │
│  Rule Toggling         │ 22K (55%)      │ Cline             │
│  Context Handoffs      │ 140K restored  │ Cline, Codex      │
│  Glob Patterns         │ 20-30K (50%)   │ Cursor, Windsurf  │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│                        TOKEN BUDGETS                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Window Size  │ Rules    │ Codebase │ Conversation          │
│  ────────────┼──────────┼──────────┼──────────────────────  │
│  20K (std)   │ 8K (40%) │ 8K (40%) │ 4K (20%)               │
│  200K (long) │ 40K (20%)│ 80K (40%)│ 80K (40%)              │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## Related Documentation

- [CLI_COMPARISON_MATRIX.md](./CLI_COMPARISON_MATRIX.md) - Feature comparison
- [CURSOR_ACTIVATION_MODES_GUIDE.md](./CURSOR_ACTIVATION_MODES_GUIDE.md) - Cursor setup
- [CLI_TESTING_PROCEDURES.md](./CLI_TESTING_PROCEDURES.md) - Testing procedures
- [RULE_SYSTEM.md](./RULE_SYSTEM.md) - System architecture

---

**Power User Tips:**
- Start with conservative settings, optimize based on actual usage
- Monitor context usage regularly
- Experiment with different CLIs for different tasks
- Document what works for your workflow
- Share optimization techniques with team
