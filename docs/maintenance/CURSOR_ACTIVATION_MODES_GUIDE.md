# Cursor Activation Modes Guide

> **Purpose:** Detailed guide for configuring Cursor's activation modes to maximize context efficiency while ensuring the right rules load at the right time.

**Last Updated:** 2025-10-22

---

## Table of Contents

1. [Understanding Activation Modes](#understanding-activation-modes)
2. [Recommended Configuration Table](#recommended-configuration-table)
3. [Configuration Workflow](#configuration-workflow)
4. [Testing Activation](#testing-activation)
5. [Optimization Strategies](#optimization-strategies)
6. [Context Window Management](#context-window-management)
7. [Troubleshooting](#troubleshooting)

---

## Understanding Activation Modes

Cursor provides **4 activation modes** for each rule, giving you precise control over when rules are loaded into context.

### The 4 Modes

#### 1. Always Apply
**Description:** "Apply to every chat and cmd-k session"

**When to use:**
- Foundation rules needed in ALL contexts
- Project-wide standards that always apply
- Core architectural principles

**Token cost:** ⚠️ **HIGH** - Always loaded (3K-7K tokens per rule)

**Best for:** 1-2 rules maximum

**Example:** `monorepo-structure-and-configuration`

---

#### 2. Apply Intelligently
**Description:** "When Agent decides it's relevant based on description"

**When to use:**
- Cross-cutting concerns (testing, validation, documentation)
- Rules where AI can reliably determine relevance
- Rules without clear file pattern matches

**Token cost:** 🔶 **MEDIUM** - AI decides based on context (0-7K tokens)

**Best for:** 2-3 rules

**Example:**
- `brain-monitor-validation` (AI knows when validation is relevant)
- `tests.tdd-workflow` (AI recognizes test-writing context)

**How it works:**
- Cursor analyzes file content and conversation context
- Compares against rule's `description` field in frontmatter
- Loads rule if AI determines it's relevant
- More intelligent than glob patterns but less predictable

---

#### 3. Apply to Specific Files
**Description:** "When file matches a specified pattern"

**When to use:**
- Tech-specific rules (React, Express, Testing)
- Rules with clear file extension or path patterns
- Rules that should ONLY apply to certain files

**Token cost:** ✅ **LOW** - Only when glob matches (0-7K tokens)

**Best for:** 15+ rules (the majority)

**Example:**
```yaml
# react-bulletproof-component-pattern.rules.mdc
globs:
  - "**/*.tsx"
  - "**/*.jsx"
  - "apps/client/**/*"
  - "packages/*/src/components/**/*"
```

**How it works:**
- Cursor evaluates glob patterns against current file path
- Loads rule if ANY glob matches
- Happens instantly when opening/switching files
- Most predictable and efficient mode

---

#### 4. Apply Manually
**Description:** "When @-mentioned"

**When to use:**
- Experimental or rarely-used rules
- Special-purpose rules for specific scenarios
- Rules under development

**Token cost:** ⚡ **ZERO** - Never loaded unless @-mentioned

**Best for:** 0-3 rules (rarely used)

**Example:** Special-purpose documentation rules

**How to use:**
- Type `@rule-name` in chat to load the rule
- Rule stays loaded for rest of conversation
- Useful for one-off scenarios

---

## Recommended Configuration Table

### Complete Configuration for All 19 Rules

| Rule Name | Activation Mode | Glob Patterns | Rationale |
|-----------|-----------------|---------------|-----------|
| **monorepo-structure-and-configuration** | **Always Apply** | N/A | Foundation rule needed in all contexts |
| **brain-monitor-validation** | **Apply Intelligently** | N/A | AI can determine when validation is relevant |
| **atomic-design-component-strategy** | **Apply to Specific Files** | `**/components/**/*`<br>`packages/ui/**/*` | Only relevant when working with components |
| **component-design-decision-tree** | **Apply Intelligently** | N/A | AI recognizes component design discussions |
| **mobile-first-design** | **Apply to Specific Files** | `**/*.tsx`<br>`**/*.jsx`<br>`apps/client/**/*` | React/frontend files only |
| **platform-pathways-pattern** | **Apply to Specific Files** | `**/*.tsx`<br>`**/*.jsx`<br>`**/*.mobile.tsx` | React files with platform variants |
| **react-bulletproof-component-pattern** | **Apply to Specific Files** | `**/*.tsx`<br>`**/*.jsx`<br>`apps/client/**/*` | React components only |
| **storybook-first-composition** | **Apply to Specific Files** | `**/*.stories.tsx`<br>`**/*.stories.jsx`<br>`apps/storybook/**/*` | Storybook files only |
| **monorepo-node-express-architecture** | **Apply to Specific Files** | `apps/server/**/*`<br>`services/**/*` | Express applications only |
| **node.functional-isolated-concerns** | **Apply to Specific Files** | `scripts/**/*`<br>`tooling/**/*` | Node scripts and tooling only |
| **project-wide-proxy-rules** | **Apply to Specific Files** | `services/**/*`<br>`apps/server/**/*` | Proxy-related code only |
| **cm-proxy-rules** | **Apply to Specific Files** | `services/cm/**/*` | CM service only |
| **monorepo-documentation-strategy** | **Apply Manually** | N/A | Only when explicitly writing docs |
| **tests.continuous-validation** | **Apply Intelligently** | N/A | AI recognizes testing context |
| **tests.unified-testing** | **Apply to Specific Files** | `**/*.test.ts`<br>`**/*.test.tsx`<br>`**/*.spec.ts`<br>`testing/**/*` | Test files only |
| **tests.tdd-workflow** | **Apply Intelligently** | N/A | AI recognizes TDD workflow context |
| **testid** | **Apply to Specific Files** | `**/*.test.ts(x)`<br>`packages/testids/**/*` | Test files and testid package |
| **pr-creation-guidelines** | **Apply Manually** | N/A | Only when creating PRs |
| **monorepo-package-docs-versioning** | **Apply Manually** | N/A | Only when versioning packages |

---

## Configuration Workflow

### Step-by-Step Setup in Cursor IDE

#### 1. Access Rule Settings
1. Open Cursor IDE
2. Go to **Cursor Settings** (Cmd/Ctrl + ,)
3. Navigate to **Rules** section
4. You should see all 19 rules listed

#### 2. Configure Each Rule

**For "Always Apply" rules:**
1. Find `monorepo-structure-and-configuration`
2. Click the activation mode dropdown
3. Select **"Always Apply"**
4. ✅ Done - rule will load in every session

**For "Apply to Specific Files" rules:**
1. Find rule (e.g., `react-bulletproof-component-pattern`)
2. Click activation mode dropdown
3. Select **"Apply to Specific Files"**
4. Enter glob patterns (one per line):
   ```
   **/*.tsx
   **/*.jsx
   apps/client/**/*
   ```
5. ✅ Done - rule will load when matching files are open

**For "Apply Intelligently" rules:**
1. Find rule (e.g., `brain-monitor-validation`)
2. Click activation mode dropdown
3. Select **"Apply Intelligently"**
4. ✅ Done - AI will decide when to load

**For "Apply Manually" rules:**
1. Find rule (e.g., `pr-creation-guidelines`)
2. Click activation mode dropdown
3. Select **"Apply Manually"**
4. ✅ Done - rule only loads when @-mentioned

#### 3. Verify Configuration
1. Check that dropdown shows correct mode for each rule
2. For glob-based rules, verify patterns are entered correctly
3. Save settings (automatic in Cursor)

---

## Testing Activation

### Test "Always Apply" Mode

**Goal:** Verify rule loads in every context

**Test Steps:**
1. Open any file in the project (e.g., `README.md`)
2. Start a new chat (Cmd/Ctrl + K)
3. Type a question about monorepo structure
4. Verify Cursor references the rule in its response

**Expected:** Rule appears in context indicator

**Actual:** Rule should always be present

---

### Test "Apply to Specific Files" Mode

**Goal:** Verify rule loads ONLY for matching files

**Test 1: Matching File**
1. Open a React component (e.g., `apps/client/src/App.tsx`)
2. Start a new chat (Cmd/Ctrl + K)
3. Ask about component design
4. Verify `react-bulletproof-component-pattern` is loaded

**Expected:** ✅ Rule appears in context

**Test 2: Non-Matching File**
1. Open an Express file (e.g., `apps/server/src/server.ts`)
2. Start a new chat (Cmd/Ctrl + K)
3. Ask about component design
4. Verify `react-bulletproof-component-pattern` is NOT loaded

**Expected:** ❌ Rule does NOT appear in context

**Test 3: Glob Pattern Accuracy**
1. Test with files in different directories:
   - `apps/client/src/components/Button.tsx` → ✅ Should match
   - `packages/ui/src/atoms/Button.tsx` → ✅ Should match
   - `apps/server/src/routes/index.ts` → ❌ Should NOT match

---

### Test "Apply Intelligently" Mode

**Goal:** Verify AI decides when rule is relevant

**Test 1: Relevant Context**
1. Open any file
2. Start a new chat
3. Ask: "How should I write tests for this component?"
4. Verify `tests.tdd-workflow` is loaded

**Expected:** ✅ Rule appears (AI recognizes testing context)

**Test 2: Irrelevant Context**
1. Open any file
2. Start a new chat
3. Ask: "What dependencies does this project use?"
4. Verify `tests.tdd-workflow` is NOT loaded

**Expected:** ❌ Rule does NOT appear (AI recognizes non-testing context)

---

### Test "Apply Manually" Mode

**Goal:** Verify rule only loads when @-mentioned

**Test 1: Without @-mention**
1. Open any file
2. Start a new chat
3. Ask about PR creation
4. Verify `pr-creation-guidelines` is NOT loaded

**Expected:** ❌ Rule does NOT appear

**Test 2: With @-mention**
1. Open any file
2. Start a new chat
3. Type: `@pr-creation-guidelines How do I create a PR?`
4. Verify rule is loaded

**Expected:** ✅ Rule appears and stays loaded for conversation

---

## Optimization Strategies

### Strategy 1: Minimize "Always Apply"

**Goal:** Reduce baseline token usage

**Recommendation:** Only 1-2 foundation rules

**Why:** Every "Always Apply" rule consumes 3K-7K tokens in every session, regardless of relevance.

**Example:**
```
✅ Good:
   - monorepo-structure-and-configuration (Always Apply)
   - All others: Intelligent or Glob-based

❌ Bad:
   - 5+ rules set to Always Apply
   - Result: 15K-35K tokens wasted on irrelevant rules
```

---

### Strategy 2: Maximize "Apply to Specific Files"

**Goal:** Load rules only when needed

**Recommendation:** 15+ tech-specific rules

**Why:** Glob patterns provide precise, predictable activation with zero token waste.

**Pattern Library:**
```
React/Frontend:
  - **/*.tsx
  - **/*.jsx
  - apps/client/**/*
  - packages/ui/**/*

Backend/Express:
  - apps/server/**/*
  - services/**/*
  - **/*.server.ts

Testing:
  - **/*.test.ts
  - **/*.test.tsx
  - **/*.spec.ts
  - testing/**/*

Storybook:
  - **/*.stories.tsx
  - **/*.stories.jsx
  - apps/storybook/**/*

Scripts:
  - scripts/**/*
  - tooling/**/*
```

---

### Strategy 3: Use "Apply Intelligently" Sparingly

**Goal:** Let AI decide for cross-cutting concerns

**Recommendation:** 2-3 rules maximum

**Why:** AI decision-making is powerful but less predictable than glob patterns.

**Best candidates:**
- Testing workflow rules (AI recognizes test context)
- Validation rules (AI recognizes quality concerns)
- Documentation rules (AI recognizes documentation tasks)

**Example:**
```
✅ Good candidates:
   - brain-monitor-validation (AI recognizes validation context)
   - tests.tdd-workflow (AI recognizes testing context)
   - component-design-decision-tree (AI recognizes design discussions)

❌ Poor candidates:
   - react-bulletproof-component-pattern (use glob: **/*.tsx)
   - express-architecture (use glob: apps/server/**/*)
   - storybook-first (use glob: **/*.stories.tsx)
```

---

### Strategy 4: Reserve "Apply Manually" for Special Cases

**Goal:** Zero token cost for rarely-used rules

**Recommendation:** 0-3 rules

**Best for:**
- Experimental rules under development
- Special-purpose rules for specific scenarios
- Documentation/process rules used infrequently

**Example:**
```
Manual rules:
   - pr-creation-guidelines (only when creating PRs)
   - package-versioning (only when versioning packages)
   - monorepo-documentation-strategy (only when writing docs)
```

---

## Context Window Management

### Understanding Cursor's Context Window

**Standard Mode:** 20K tokens (~80K characters)
**Long-Context Mode:** 200K tokens (~800K characters)

### Token Budget Allocation

**Recommended Split:**
- **40% for rules** (foundation + tech-specific)
- **40% for codebase context** (open files, definitions)
- **20% for conversation history**

**Example (20K window):**
- **8K tokens** for rules (4-6 active rules)
- **8K tokens** for code (5-10 files)
- **4K tokens** for conversation (50-100 messages)

### When to Enable Long-Context Mode

**Enable for:**
- Large refactors spanning multiple files
- Complex features requiring extensive context
- Deep codebase exploration

**Enable via:**
1. Cursor Settings
2. Enable "Long Context Mode" toggle
3. Context window expands to 200K tokens

**Trade-offs:**
- **Pros:** More rules and files can be loaded simultaneously
- **Cons:** Slower response times, higher costs

---

## Troubleshooting

### Rule Not Activating When Expected

**Symptom:** Rule should load but doesn't appear in context

**Possible Causes:**
1. **Glob pattern doesn't match file path**
   - **Solution:** Check pattern syntax, test with sample files
   - **Example:** Pattern `apps/client/**/*.tsx` won't match `apps/web/**/*.tsx`

2. **Activation mode set incorrectly**
   - **Solution:** Verify mode in Cursor Settings → Rules
   - **Example:** Mode set to "Apply Manually" but not @-mentioned

3. **File not recognized as matching type**
   - **Solution:** Check file extension, add additional glob patterns
   - **Example:** `.jsx` files don't match `**/*.tsx` pattern

**Debugging Steps:**
1. Open Cursor Settings → Rules
2. Find the rule
3. Check activation mode and glob patterns
4. Test with a file that should definitely match
5. If still not working, try "Always Apply" temporarily to verify rule loads

---

### Too Many Rules Loading

**Symptom:** Context window fills quickly, slow responses

**Possible Causes:**
1. **Too many "Always Apply" rules**
   - **Solution:** Switch to "Apply to Specific Files" or "Apply Intelligently"
   - **Target:** Maximum 2 "Always Apply" rules

2. **Glob patterns too broad**
   - **Solution:** Make patterns more specific
   - **Example:** Change `**/*` to `apps/client/**/*.tsx`

3. **AI over-activating "Apply Intelligently" rules**
   - **Solution:** Switch to "Apply to Specific Files" with precise globs
   - **Example:** Testing rules → `**/*.test.ts(x)` instead of intelligent mode

**Debugging Steps:**
1. Use `/context` command in chat to see loaded rules
2. Identify unexpectedly loaded rules
3. Adjust activation modes accordingly
4. Test with same file to verify improvement

---

### Rule Activating in Wrong Context

**Symptom:** Rule loads when it shouldn't (e.g., backend rule in React file)

**Possible Causes:**
1. **Glob pattern matches unintended files**
   - **Solution:** Add negative patterns or be more specific
   - **Example:** `**/*.ts` matches both `*.tsx` and `*.server.ts`

2. **"Apply Intelligently" AI decision incorrect**
   - **Solution:** Switch to "Apply to Specific Files" for more control
   - **Example:** AI loading backend rules during frontend work

**Debugging Steps:**
1. Review glob patterns for overlap
2. Test patterns with various file types
3. Consider switching to more restrictive mode
4. Use negative patterns: `!**/*.test.tsx` to exclude files

---

### Context Window Full

**Symptom:** Cursor warns about context limit, can't load more files

**Possible Causes:**
1. **Too many active rules**
   - **Solution:** Disable unused rules or adjust activation modes
   - **Target:** 4-6 active rules maximum (standard mode)

2. **Too many open files**
   - **Solution:** Close irrelevant files
   - **Target:** 5-10 files in context (standard mode)

3. **Long conversation history**
   - **Solution:** Start new chat to reset context
   - **Shortcut:** Cmd/Ctrl + Shift + K

**Solutions:**
1. **Short-term:** Enable long-context mode (200K tokens)
2. **Long-term:** Optimize rule activation (fewer "Always Apply", more globs)
3. **Immediate:** Start new chat, close files, disable unused rules

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                  CURSOR ACTIVATION MODES                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Mode                    │ Use For          │ Token Cost   │
│  ────────────────────────┼──────────────────┼──────────────│
│  Always Apply            │ 1-2 foundation   │ HIGH         │
│  Apply Intelligently     │ 2-3 cross-cut    │ MEDIUM       │
│  Apply to Specific Files │ 15+ tech-spec    │ LOW          │
│  Apply Manually          │ 0-3 rarely-used  │ ZERO         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    OPTIMIZATION GOALS                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ Minimize "Always Apply" to 1-2 rules                   │
│  ✅ Maximize "Apply to Specific Files" to 15+ rules        │
│  ✅ Use "Apply Intelligently" for 2-3 cross-cutting rules  │
│  ✅ Reserve "Apply Manually" for special cases             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Related Documentation

- [CLI_COMPARISON_MATRIX.md](./CLI_COMPARISON_MATRIX.md) - Compare all 5 CLIs
- [RULE_SYSTEM.md](./RULE_SYSTEM.md) - Complete rule system architecture
- [CLI_TESTING_PROCEDURES.md](./CLI_TESTING_PROCEDURES.md) - Testing procedures
- [ADVANCED_CONTEXT_OPTIMIZATION.md](./ADVANCED_CONTEXT_OPTIMIZATION.md) - Advanced techniques

---

**Need Help?** Open an issue in the repository or consult the team's testing documentation.
