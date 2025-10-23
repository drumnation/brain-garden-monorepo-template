# CLI Testing Procedures

> **Purpose:** Empirical testing procedures for validating rule loading in each CLI, ensuring the rule system works correctly across all 5 supported AI coding assistants.

**Last Updated:** 2025-10-22

---

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Cursor IDE Testing](#cursor-ide-testing)
3. [Cline CLI Testing](#cline-cli-testing)
4. [Codex CLI Testing](#codex-cli-testing)
5. [Windsurf IDE Testing](#windsurf-ide-testing)
6. [Gemini CLI Testing](#gemini-cli-testing)
7. [Cross-CLI Consistency Testing](#cross-cli-consistency-testing)
8. [Performance Benchmarking](#performance-benchmarking)

---

## Testing Overview

### Purpose
Verify that all 19 rules load correctly in each CLI and activate appropriately based on file context.

### Prerequisites
- [ ] All CLIs installed and configured
- [ ] Rules built: `pnpm rules:build`
- [ ] Monorepo cloned and set up
- [ ] Test files available in various contexts

### Expected Outcomes
- ✅ Rules load correctly in each CLI
- ✅ Activation modes work as configured
- ✅ No errors or warnings
- ✅ Context-appropriate rule loading

---

## Cursor IDE Testing

### Setup

**1. Verify symlink exists:**
```bash
ls -la .cursor/rules
# Expected: rules -> rules-source
```

**2. Open Cursor IDE:**
- Launch Cursor in monorepo root
- Wait for initialization

**3. Access settings:**
- Open Cursor Settings (Cmd/Ctrl + ,)
- Navigate to **Rules** section

---

### Test Suite

#### TC1: Verify All Rules Visible

**Objective:** Confirm all 19 rules appear in settings panel

**Steps:**
1. Open Cursor Settings → Rules
2. Count total rules displayed

**Expected Result:**
- ✅ 19 rules listed
- ✅ Each rule shows title and description
- ✅ Each rule has activation mode dropdown

**Pass Criteria:** All 19 rules visible with controls

---

#### TC2: Test "Always Apply" Mode

**Objective:** Verify rule loads in every context

**Configuration:**
- Rule: `monorepo-structure-and-configuration`
- Mode: **Always Apply**

**Steps:**
1. Set rule to "Always Apply"
2. Open any file (e.g., `README.md`)
3. Start new chat (Cmd/Ctrl + K)
4. Ask: "What are the monorepo standards?"

**Expected Result:**
- ✅ Rule appears in context indicator
- ✅ Response references monorepo structure
- ✅ Rule loads in every subsequent chat

**Pass Criteria:** Rule always present regardless of file

---

#### TC3: Test "Apply to Specific Files" Mode

**Objective:** Verify glob pattern matching works correctly

**Configuration:**
- Rule: `react-bulletproof-component-pattern`
- Mode: **Apply to Specific Files**
- Globs:
  ```
  **/*.tsx
  **/*.jsx
  apps/client/**/*
  ```

**Test 3A: Matching File**
1. Open `apps/client/src/App.tsx`
2. Start new chat (Cmd/Ctrl + K)
3. Ask: "How should I structure this component?"

**Expected Result:**
- ✅ Rule appears in context
- ✅ Response references React patterns

**Test 3B: Non-Matching File**
1. Open `apps/server/src/server.ts`
2. Start new chat (Cmd/Ctrl + K)
3. Ask: "How should I structure this component?"

**Expected Result:**
- ❌ Rule does NOT appear in context
- ❌ Response does not reference React patterns

**Test 3C: Glob Pattern Variations**
- `apps/client/src/components/Button.tsx` → ✅ Should match
- `packages/ui/src/atoms/Button.tsx` → ✅ Should match
- `apps/server/src/routes/index.ts` → ❌ Should NOT match

**Pass Criteria:** Rule loads only for matching files

---

#### TC4: Test "Apply Intelligently" Mode

**Objective:** Verify AI decides when rule is relevant

**Configuration:**
- Rule: `tests.tdd-workflow`
- Mode: **Apply Intelligently**

**Test 4A: Relevant Context**
1. Open any file
2. Start new chat
3. Ask: "How should I write tests for this feature?"

**Expected Result:**
- ✅ Rule likely appears (AI recognizes testing context)
- ✅ Response references TDD workflow

**Test 4B: Irrelevant Context**
1. Open any file
2. Start new chat
3. Ask: "What dependencies does this project use?"

**Expected Result:**
- ❌ Rule likely does NOT appear (AI recognizes non-testing context)

**Pass Criteria:** AI makes reasonable decisions about relevance

---

#### TC5: Test "Apply Manually" Mode

**Objective:** Verify @-mention activation works

**Configuration:**
- Rule: `pr-creation-guidelines`
- Mode: **Apply Manually**

**Test 5A: Without @-mention**
1. Open any file
2. Start new chat
3. Ask: "How do I create a pull request?"

**Expected Result:**
- ❌ Rule does NOT appear automatically

**Test 5B: With @-mention**
1. Open any file
2. Start new chat
3. Type: `@pr-creation-guidelines How do I create a PR?`

**Expected Result:**
- ✅ Rule appears in context
- ✅ Rule stays loaded for rest of conversation
- ✅ Response references PR guidelines

**Pass Criteria:** Rule only loads when explicitly mentioned

---

### Success Criteria

- [ ] All 19 rules visible in settings
- [ ] "Always Apply" works correctly (TC2 passed)
- [ ] "Apply to Specific Files" works correctly (TC3 passed)
- [ ] "Apply Intelligently" makes reasonable decisions (TC4 passed)
- [ ] "Apply Manually" requires @-mention (TC5 passed)
- [ ] No errors in Cursor console
- [ ] Performance is acceptable (responses < 5s)

---

## Cline CLI Testing

### Setup

**1. Verify `.clinerules/` folder exists:**
```bash
ls .clinerules/
# Expected: 20 files (00-meta.md + 01-19 rule files)
```

**2. Count files:**
```bash
ls .clinerules/ | wc -l
# Expected: 20
```

**3. Start Cline session:**
- Open VSCode/Editor with Cline extension
- Open terminal in monorepo root
- Initialize Cline session

---

### Test Suite

#### TC1: Verify Rule Loading

**Objective:** Confirm all rules appear in Cline's interface

**Steps:**
1. Open Cline's rule popover menu
2. Observe rule list

**Expected Result:**
- ✅ 20 files listed (00-meta + 01-19 rules)
- ✅ Meta-instructions appear first
- ✅ Each rule has toggle switch
- ✅ All rules start enabled (default)

**Pass Criteria:** Complete rule list with controls

---

#### TC2: Test Rule Toggling

**Objective:** Verify disabling rules prevents their use

**Configuration:**
- Enable: Only rules 01-02 (foundation)
- Disable: Rules 03-19

**Steps:**
1. Toggle OFF all rules except 01-02
2. Ask: "What are the monorepo standards?"
3. Observe response

**Expected Result:**
- ✅ Response references foundation rules (01-02)
- ❌ Response does NOT reference disabled rules

**Test 2B: Enable Specific Rules**
1. Enable rules 07-08 (React + Storybook)
2. Ask: "How should I build React components?"

**Expected Result:**
- ✅ Response references React and Storybook rules
- ❌ Response does NOT reference backend rules

**Pass Criteria:** Disabled rules don't affect responses

---

#### TC3: Test Rule Precedence

**Objective:** Verify meta-instructions guide behavior

**Configuration:**
- Enable: All rules

**Steps:**
1. Enable all 19 rules
2. Ask about potentially conflicting guidance
3. Observe which rules take precedence

**Expected Result:**
- ✅ Foundation rules (01-02) take precedence
- ✅ Meta-instructions followed
- ✅ No contradictory advice

**Pass Criteria:** Consistent guidance despite multiple rules

---

#### TC4: Test Context Handoff

**Objective:** Verify `new_task` resets context appropriately

**Steps:**
1. Enable 10 rules for frontend task
2. Complete task (consume 60-80% of context)
3. Run `new_task` command
4. Verify context reset

**Expected Result:**
- ✅ Context window resets to 0%
- ✅ Previously enabled rules still available
- ✅ New conversation starts fresh

**Pass Criteria:** Context handoff works smoothly

---

### Success Criteria

- [ ] All 19 rules + meta-instructions visible (TC1 passed)
- [ ] Rule toggling works correctly (TC2 passed)
- [ ] Meta-instructions guide precedence (TC3 passed)
- [ ] Context handoff with `new_task` works (TC4 passed)
- [ ] Token usage manageable (< 200K limit)

---

## Codex CLI Testing

### Setup

**1. Verify hierarchical AGENTS.md files exist:**
```bash
find . -name "AGENTS.md" -type f
# Expected: 15 files (root + 14 contexts)
```

**2. Verify content:**
```bash
cat AGENTS.md | head -20
# Should show rules with scope filtering
```

**3. Start Codex session:**
```bash
codex --project .
```

---

### Test Suite

#### TC1: Verify Hierarchical Loading

**Objective:** Confirm AGENTS.md files load at multiple levels

**Steps:**
1. Start Codex in root directory
2. Run `/status` command
3. Observe loaded files

**Expected Result:**
- ✅ Shows "root AGENTS.md" loaded
- ✅ Shows loaded contexts
- ✅ Foundation rules included

**Pass Criteria:** Root AGENTS.md loads successfully

---

#### TC2: Test Context-Specific Loading

**Objective:** Verify context rules load when navigating

**Test 2A: Frontend Context**
1. Navigate to `apps/client/` directory
2. Run `/status` command

**Expected Result:**
- ✅ Shows root + apps/client AGENTS.md loaded
- ✅ React rules available
- ❌ Backend rules NOT in context

**Test 2B: Backend Context**
1. Navigate to `apps/server/` directory
2. Run `/status` command

**Expected Result:**
- ✅ Shows root + apps/server AGENTS.md loaded
- ✅ Express rules available
- ❌ React rules NOT in context

**Pass Criteria:** Context-specific rules load correctly

---

#### TC3: Test Scope Filtering

**Objective:** Verify only appropriate rules load per context

**Steps:**
1. Navigate to `apps/client/`
2. Ask: "How should I structure Express routes?"

**Expected Result:**
- ❌ Response indicates Express rules not in context
- ✅ Response suggests React/frontend guidance instead

**Pass Criteria:** Scope filtering prevents wrong rules

---

#### TC4: Test Task Sandboxing

**Objective:** Verify each task has isolated environment

**Steps:**
1. Start Task A in `apps/client/`
2. Note loaded rules (should include React)
3. Start Task B in `apps/server/`
4. Note loaded rules (should include Express, NOT React)

**Expected Result:**
- ✅ Task A context includes React rules
- ✅ Task B context includes Express rules
- ✅ Tasks don't share context

**Pass Criteria:** Tasks isolated correctly

---

### Success Criteria

- [ ] Hierarchical loading works (TC1 passed)
- [ ] Context-specific loading works (TC2 passed)
- [ ] Scope filtering works (TC3 passed)
- [ ] Task sandboxing works (TC4 passed)
- [ ] `/status` command provides useful info

---

## Windsurf IDE Testing

### Setup

**1. Verify `.windsurfrules` file exists:**
```bash
ls -la .windsurfrules
# Expected: Single file with all rules
```

**2. Check file size:**
```bash
wc -c .windsurfrules
# Expected: < 250,000 characters (ideally < 200K)
```

**3. Open Windsurf IDE:**
- Launch Windsurf in monorepo root
- Wait for rule loading

---

### Test Suite

#### TC1: Verify Rule Loading

**Objective:** Confirm all rules load without errors

**Steps:**
1. Check Windsurf's rule panel/settings
2. Observe rule list

**Expected Result:**
- ✅ All 19 rules listed
- ✅ Activation metadata shown
- ❌ No rules exceed 12K characters
- ❌ No loading errors

**Pass Criteria:** All rules load successfully

---

#### TC2: Test "Always On" Activation

**Objective:** Verify `alwaysApply: true` works

**Configuration:**
- Rules with `alwaysApply: true`

**Steps:**
1. Open any file
2. Start new chat
3. Ask about monorepo structure

**Expected Result:**
- ✅ Foundation rules active
- ✅ Response references core principles

**Pass Criteria:** "Always On" rules always present

---

#### TC3: Test "Glob-Based" Activation

**Objective:** Verify glob patterns work

**Test 3A: React File**
1. Open `apps/client/src/App.tsx`
2. Start new chat
3. Ask about component structure

**Expected Result:**
- ✅ React rules activate
- ✅ Response references React patterns

**Test 3B: Express File**
1. Open `apps/server/src/server.ts`
2. Start new chat
3. Ask about routing

**Expected Result:**
- ✅ Express rules activate
- ❌ React rules do NOT activate
- ✅ Response references Express patterns

**Pass Criteria:** Glob-based activation works correctly

---

#### TC4: Test "Model Decision" Activation

**Objective:** Verify LLM decides when to load rules

**Configuration:**
- Rules without `alwaysApply` or `globs`

**Steps:**
1. Open file without specific patterns
2. Ask context-relevant question
3. Observe which rules activate

**Expected Result:**
- ✅ Windsurf's AI activates relevant rules
- ❌ Irrelevant rules stay inactive

**Pass Criteria:** Model makes reasonable decisions

---

### Success Criteria

- [ ] All rules load without errors (TC1 passed)
- [ ] "Always On" activation works (TC2 passed)
- [ ] "Glob-Based" activation works (TC3 passed)
- [ ] "Model Decision" activation works (TC4 passed)
- [ ] No performance issues with 19 rules
- [ ] All rules under 12K characters

---

## Gemini CLI Testing

### Setup

**1. Verify hierarchical GEMINI.md files exist:**
```bash
find . -name "GEMINI.md" -type f
# Expected: 15 files (root + 14 contexts)
```

**2. Verify @import directives:**
```bash
grep -r "@import" --include="GEMINI.md"
# Should show relative path imports
```

**3. Start Gemini session:**
```bash
gemini --project .
```

---

### Test Suite

#### TC1: Verify Import Resolution

**Objective:** Confirm @import directives resolve correctly

**Steps:**
1. Start Gemini in root directory
2. Run `/memory show` command
3. Observe loaded rules

**Expected Result:**
- ✅ Shows foundation rules from root imports
- ✅ Shows resolved import paths
- ❌ No circular import errors

**Pass Criteria:** All imports resolve successfully

---

#### TC2: Test Hierarchical Loading

**Objective:** Verify context-specific imports work

**Test 2A: Frontend Context**
1. Navigate to `apps/client/`
2. Run `/memory show` command

**Expected Result:**
- ✅ Shows root + apps/client imports
- ✅ React rules imported correctly
- ❌ Backend rules NOT imported

**Test 2B: Backend Context**
1. Navigate to `apps/server/`
2. Run `/memory show` command

**Expected Result:**
- ✅ Shows root + apps/server imports
- ✅ Express rules imported correctly
- ❌ React rules NOT imported

**Pass Criteria:** Hierarchical imports work correctly

---

#### TC3: Test Import Depth

**Objective:** Verify max depth configuration works

**Steps:**
1. Check for deeply nested imports
2. Verify max depth not exceeded (default: 5)
3. Confirm no infinite loops

**Expected Result:**
- ✅ Max depth respected
- ❌ No circular import errors
- ✅ Build script validates imports

**Pass Criteria:** Import depth limits work

---

#### TC4: Test Memory Refresh

**Objective:** Verify updates propagate after rule changes

**Steps:**
1. Note current rule content
2. Edit a rule in `rules-source/`
3. Run `pnpm rules:build`
4. Run `/memory refresh` in Gemini
5. Verify updated rule content loaded

**Expected Result:**
- ✅ Updated content appears after refresh
- ✅ No errors during refresh
- ✅ All imports re-resolved

**Pass Criteria:** Memory refresh picks up changes

---

### Success Criteria

- [ ] @import directives resolve (TC1 passed)
- [ ] Hierarchical loading works (TC2 passed)
- [ ] Import depth limits respected (TC3 passed)
- [ ] Memory refresh works (TC4 passed)
- [ ] No circular import errors

---

## Cross-CLI Consistency Testing

### Purpose
Verify same task produces consistent results across all CLIs

### Test Scenario

**Task:** "Create a new React component following atomic design principles"

### Expected Behavior (All CLIs)

**Should be active:**
- ✅ Foundation rule (monorepo-structure)
- ✅ React rules (atomic-design, bulletproof, storybook)
- ✅ Component design decision tree

**Should NOT be active:**
- ❌ Backend rules (express, functional-node)
- ❌ Documentation rules (unless mentioned)

### Testing Process

**1. Cursor Test:**
1. Open `apps/client/src/components/NewComponent.tsx`
2. Ask: "Create a button component following atomic design"
3. Note which rules appear in context
4. Evaluate response quality

**2. Cline Test:**
1. Enable React rules (03-08)
2. Ask same question
3. Note which rules are used
4. Evaluate response quality

**3. Codex Test:**
1. Navigate to `apps/client/`
2. Ask same question
3. Run `/status` to see loaded rules
4. Evaluate response quality

**4. Windsurf Test:**
1. Open same file
2. Ask same question
3. Check rule activation
4. Evaluate response quality

**5. Gemini Test:**
1. Navigate to `apps/client/`
2. Ask same question
3. Run `/memory show` to see imports
4. Evaluate response quality

### Comparison Matrix

| Aspect | Cursor | Cline | Codex | Windsurf | Gemini |
|--------|--------|-------|-------|----------|--------|
| Correct rules loaded | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| Response quality | 1-5 | 1-5 | 1-5 | 1-5 | 1-5 |
| Response time (s) | ___ | ___ | ___ | ___ | ___ |
| Token usage | ___ | ___ | ___ | ___ | ___ |
| Incorrect rules loaded | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No |

### Success Criteria

- [ ] All CLIs load correct rules (React, not backend)
- [ ] Response quality consistent (variation < 1 point)
- [ ] No CLI loads incorrect rules
- [ ] Performance acceptable across all CLIs

---

## Performance Benchmarking

### Metrics to Track

**1. Initial Load Time**
- How long to load all rules on first session
- Measured from CLI start to ready state

**2. Context Window Usage**
- Percentage of available tokens consumed by rules
- Measured using CLI's context commands

**3. Response Quality**
- Does AI follow rules correctly? (1-5 scale)
- Are responses accurate and helpful?

**4. Activation Accuracy**
- Do correct rules activate for context?
- Do incorrect rules stay inactive?

### Benchmark Tasks

**Task 1: Create React Component**
```
File: apps/client/src/components/NewButton.tsx
Task: "Create a button component following atomic design"
Expected Rules: React, atomic design, storybook
```

**Task 2: Create Express Endpoint**
```
File: apps/server/src/routes/users.ts
Task: "Create a RESTful endpoint for user CRUD"
Expected Rules: Express architecture, functional patterns
```

**Task 3: Write Unit Test**
```
File: packages/ui/src/Button.test.tsx
Task: "Write comprehensive unit tests"
Expected Rules: Testing rules, TDD workflow
```

**Task 4: Update Documentation**
```
File: docs/features/authentication.md
Task: "Document the authentication flow"
Expected Rules: Documentation strategy
```

### Results Template

| Metric | Cursor | Cline | Codex | Windsurf | Gemini |
|--------|--------|-------|-------|----------|--------|
| **Initial Load Time** | ___s | ___s | ___s | ___s | ___s |
| **Context Usage (Task 1)** | __% | __% | __% | __% | __% |
| **Context Usage (Task 2)** | __% | __% | __% | __% | __% |
| **Response Quality (avg)** | _/5 | _/5 | _/5 | _/5 | _/5 |
| **Activation Accuracy** | __% | __% | __% | __% | __% |
| **False Positives** | # | # | # | # | # |
| **False Negatives** | # | # | # | # | # |

### Analysis Guidelines

**Good Performance:**
- Initial load < 2 seconds
- Context usage < 40% for rules
- Response quality ≥ 4/5
- Activation accuracy ≥ 90%

**Needs Optimization:**
- Initial load > 5 seconds
- Context usage > 60% for rules
- Response quality < 3/5
- Activation accuracy < 75%

---

## Deliverables

### Required Outputs

1. **Test Results Document**
   - Results for all test cases
   - Pass/fail status per CLI
   - Issues discovered

2. **Performance Benchmarks**
   - Completed metrics table
   - Analysis and recommendations
   - Performance comparison chart

3. **Issue Reports**
   - Bugs discovered during testing
   - Configuration problems
   - Unexpected behavior

4. **Optimization Recommendations**
   - CLI-specific improvements
   - Rule configuration tweaks
   - Context management tips

### Reporting Format

**For each CLI:**
```markdown
## [CLI Name] Test Results

### Summary
- Total Tests: X
- Passed: Y
- Failed: Z
- Pass Rate: __%%

### Failed Tests
- TC#: [Description] - [Root Cause]

### Performance
- Initial Load: ___s
- Avg Context Usage: __%%
- Response Quality: _/5

### Issues Discovered
1. [Issue description]
2. [Issue description]

### Recommendations
1. [Recommendation]
2. [Recommendation]
```

---

## Related Documentation

- [CLI_COMPARISON_MATRIX.md](./CLI_COMPARISON_MATRIX.md) - Feature comparison
- [CURSOR_ACTIVATION_MODES_GUIDE.md](./CURSOR_ACTIVATION_MODES_GUIDE.md) - Cursor setup
- [RULE_SYSTEM.md](./RULE_SYSTEM.md) - System architecture
- [ADVANCED_CONTEXT_OPTIMIZATION.md](./ADVANCED_CONTEXT_OPTIMIZATION.md) - Optimization techniques

---

**Testing Checklist:**
- [ ] Cursor tests complete
- [ ] Cline tests complete
- [ ] Codex tests complete
- [ ] Windsurf tests complete
- [ ] Gemini tests complete
- [ ] Cross-CLI consistency verified
- [ ] Performance benchmarks recorded
- [ ] Issues documented
- [ ] Results reported to team
