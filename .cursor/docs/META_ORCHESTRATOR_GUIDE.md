---
title: "Meta-Orchestrator Pattern for Complex Tasks"
description: "Guide for coordinating multiple AI sub-agents to research, implement, and validate changes"
keywords: [meta-orchestrator, sub-agents, mcp, e2e, testing, coordination]
last_updated: "2025-01-08"
---

# Meta-Orchestrator Pattern for Complex Tasks

## Overview

The meta-orchestrator pattern is a coordination strategy for handling complex technical issues that span multiple systems, require specialized research, or need comprehensive validation across different layers of the application.

**Key Concept:**
A primary agent acts as the orchestrator, coordinating multiple specialized sub-agents that each handle a specific aspect of the task. The orchestrator integrates their findings and ensures consistency across all changes.

**When to Use:**
- Complex issues spanning multiple packages or systems
- Need for specialized research (e.g., understanding framework internals)
- Requirement for visual validation (screenshots, UI state)
- Multiple testing layers (unit, integration, E2E)
- Cross-cutting concerns affecting architecture

## Sub-Agent Roles

### Research Agent
**Responsibility:** Investigates codebase, reads documentation, traces dependencies

**Tasks:**
- Analyze existing implementations
- Trace how systems interact
- Read framework documentation
- Identify root causes of issues
- Document findings in structured format

**Example (Env-Loader Fix):**
- Traced how Vite loads environment variables
- Examined browser env-loader implementation
- Identified mismatch between Vite's mechanism and env-loader expectations
- Documented the three-layer architecture

### Implementation Agent
**Responsibility:** Makes code changes following research findings

**Tasks:**
- Modify source code based on research
- Follow established patterns and conventions
- Ensure backward compatibility
- Add inline documentation
- Handle edge cases

**Example (Env-Loader Fix):**
- Modified `vite.config.ts` to load from monorepo root
- Added runtime initialization in `main.tsx`
- Used Vite's standard `import.meta.env` mechanism
- Added debug logging for troubleshooting

### Testing Agent
**Responsibility:** Writes unit and integration tests

**Tasks:**
- Create colocated unit tests
- Write integration tests for cross-component behavior
- Ensure test coverage for edge cases
- Validate error handling
- Document test purpose and expectations

**Example (Env-Loader Fix):**
- Unit tests for browser env-loader integration
- Integration tests for AgentCopilot env var validation
- Vite-specific tests for monorepo env loading
- Tests for missing/invalid configuration scenarios

### E2E Agent
**Responsibility:** Runs browser tests, captures screenshots, validates UI state

**Tasks:**
- Write Playwright/Cypress tests
- Capture screenshots for visual regression
- Monitor console logs and network requests
- Validate user-facing behavior
- Document expected vs. actual states

**Example (Env-Loader Fix):**
- E2E test showing error banner without API key
- E2E test showing banner disappears with valid config
- Screenshot validation for visual regression detection
- Console log validation for initialization

### Documentation Agent
**Responsibility:** Updates README, CHANGELOG, feature docs

**Tasks:**
- Update package README files
- Add entries to CHANGELOG files
- Create feature-level documentation
- Add troubleshooting guides
- Link related documentation

**Example (Env-Loader Fix):**
- Updated env-loader README with Vite section
- Created feature documentation in `docs/features/`
- Updated CHANGELOGs for env-loader and web app
- Added troubleshooting sections

## Coordination Protocol

### Phase 1: Task Breakdown
**Orchestrator's Role:**
1. Analyze the problem statement
2. Identify required sub-agents
3. Define clear boundaries for each sub-task
4. Specify expected outputs from each agent
5. Document dependencies between tasks

**Example Task Breakdown:**
```markdown
## Task: Fix AgentCopilot "API key not configured" Error

### Sub-Tasks:
1. **Research** (Research Agent)
   - Output: Root cause analysis document
   - Dependencies: None

2. **Implementation** (Implementation Agent)
   - Output: Modified vite.config.ts and main.tsx
   - Dependencies: Research findings

3. **Testing** (Testing Agent)
   - Output: Unit and integration tests
   - Dependencies: Implementation complete

4. **E2E Validation** (E2E Agent)
   - Output: Browser tests with screenshots
   - Dependencies: Implementation complete

5. **Documentation** (Documentation Agent)
   - Output: Updated README, CHANGELOG, feature docs
   - Dependencies: All above complete
```

### Phase 2: Sub-Agent Execution
**Each Sub-Agent:**
1. Receives context and specific goals
2. Works autonomously within their domain
3. Reports findings in structured format
4. Flags blockers or dependencies
5. Returns control to orchestrator

**Structured Report Format:**
```markdown
## [Sub-Agent Role] Report

### Task Assigned
[Description of what was asked]

### Actions Taken
- Action 1
- Action 2
- ...

### Findings
[Key discoveries or results]

### Files Modified/Created
- path/to/file1.ts
- path/to/file2.md

### Dependencies/Blockers
[Any issues or dependencies on other work]

### Recommendations
[Suggestions for next steps or improvements]
```

### Phase 3: Integration Validation
**Orchestrator's Role:**
1. Collect reports from all sub-agents
2. Validate consistency across changes
3. Identify conflicts or gaps
4. Run integration validation
5. Document final state

**Integration Checklist:**
- [ ] All sub-agent reports received
- [ ] No conflicting changes identified
- [ ] Code changes align with research findings
- [ ] Tests validate implementation
- [ ] Documentation accurately reflects changes
- [ ] CHANGELOG entries added
- [ ] No new issues introduced

### Phase 4: Final Verification
**Orchestrator's Role:**
1. Run full test suite
2. Verify end-to-end flow
3. Check for regressions
4. Validate against original problem statement
5. Document completion

## MCP Integration

### What is MCP?
Model Context Protocol (MCP) enables AI agents to access tools like file systems, browsers, and APIs in a standardized way.

### How Sub-Agents Use MCP

**Research Agent + MCP:**
- File system access to read source code
- Grep/search tools to find patterns
- Web fetch to read framework documentation
- AST parsers to analyze code structure

**E2E Agent + MCP:**
- Browser control via Playwright
- Screenshot capture and comparison
- Network monitoring for API calls
- Console log collection

**Testing Agent + MCP:**
- Test runner execution
- Coverage report generation
- Test result parsing

### MCP Integration Example

```typescript
// E2E Agent using MCP to control browser
async function validateAgentCopilotState() {
  // MCP tool: Control browser
  const page = await mcpBrowser.newPage();

  // MCP tool: Navigate to app
  await page.goto('http://localhost:5180');

  // MCP tool: Capture screenshot
  const screenshot = await mcpBrowser.screenshot();

  // MCP tool: Analyze image with vision model
  const analysis = await mcpVision.analyzeScreenshot(screenshot, {
    prompt: "Does this show an error banner about API key configuration?"
  });

  return {
    hasError: analysis.hasErrorBanner,
    errorMessage: analysis.detectedText
  };
}
```

## Best Practices

### 1. Clear Task Scoping
**Good:**
```markdown
Research Agent: Investigate how Vite loads environment variables from
subdirectories and how import.meta.env is populated at build time.
```

**Bad:**
```markdown
Research Agent: Look into the environment variable issue.
```

### 2. Sufficient Context
Provide each sub-agent with:
- Problem statement
- Relevant file paths
- Expected outputs
- Success criteria
- Related documentation

### 3. Structured Outputs
Require sub-agents to return:
- What they did
- What they found
- What files they modified
- What blockers they encountered
- What they recommend next

### 4. Incremental Validation
Don't wait until the end to validate:
- Review research findings before implementation
- Run tests after each implementation step
- Check documentation as it's written
- Validate integration continuously

### 5. Document the Strategy
In your implementation plan, include:
```markdown
## Meta-Orchestrator Approach

**Primary Agent:** Coordinates overall task execution
**Sub-Agents:**
- Research: Traces env var loading pipeline
- Implementation: Fixes Vite config and adds runtime init
- Testing: Writes unit/integration/E2E tests
- Documentation: Updates all docs and CHANGELOGs

**Integration Points:**
- Research findings inform implementation approach
- Tests validate implementation correctness
- Documentation reflects actual changes made
```

## Tools and Commands

### Validation Commands
```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm --filter web test

# Run E2E tests
pnpm --filter web test:e2e

# Typecheck all packages
pnpm typecheck

# Lint all code
pnpm lint
```

### Orchestration Commands
```bash
# Start dev server for E2E testing
pnpm --filter web dev

# Build all packages
pnpm build

# Run validation suite
pnpm brain:validate
```

### MCP-Enabled Testing
```bash
# Playwright with screenshot capture
pnpm --filter web playwright test --screenshot=on

# Playwright with visual comparison
pnpm --filter web playwright test --update-snapshots
```

## Real-World Example: Environment Loader Fix

### Problem Statement
AgentCopilot shows "OpenAI API key not configured" error even though `VITE_OPENAI_API_KEY` is present in the root `.env` file.

### Orchestrator's Strategy

**Phase 1: Research (Research Agent)**
- Task: Understand how Vite loads env vars and how browser env-loader accesses them
- Output: Root cause analysis showing Vite loads from `apps/web` instead of monorepo root

**Phase 2: Implementation (Implementation Agent)**
- Task: Fix Vite config to load from monorepo root and add runtime initialization
- Output: Modified `vite.config.ts` and `main.tsx`

**Phase 3: Testing (Testing Agent)**
- Task: Write comprehensive tests for the fix
- Output:
  - `apps/web/src/utils/env.test.ts` (unit)
  - `AgentCopilot.integration.test.tsx` (integration)
  - `tooling/env-loader/src/vite-integration.test.ts` (package)

**Phase 4: E2E Validation (E2E Agent)**
- Task: Create browser tests with screenshot validation
- Output: `apps/web/testing/e2e/agent-copilot-env.browser.e2e.ts`

**Phase 5: Documentation (Documentation Agent)**
- Task: Update all relevant documentation
- Output:
  - `docs/features/env-loader-vite-integration/README.md`
  - Updated `tooling/env-loader/README.md`
  - Updated CHANGELOGs for env-loader and web app

### Integration Validation
- All tests pass
- Error banner disappears when API key is present
- Console logs show env vars loaded from monorepo root
- Documentation accurately reflects implementation

## When NOT to Use Meta-Orchestrator

**Simple Tasks:**
- Single file changes
- Straightforward bug fixes
- Adding a simple component
- Minor documentation updates

**Already Well-Understood:**
- Following established patterns
- Routine maintenance tasks
- Standardized refactoring

**Time-Sensitive:**
- Hotfixes for production issues
- Quick configuration changes
- Urgent dependency updates

**Use direct implementation instead:**
```markdown
For simple tasks, the overhead of coordinating multiple agents
outweighs the benefits. A single agent or direct implementation
is more efficient.
```

## Future Enhancements

- [ ] Automated sub-agent selection based on task analysis
- [ ] MCP integration for real-time agent coordination
- [ ] Visual dashboards for orchestration progress
- [ ] Agent performance metrics and optimization
- [ ] Template library for common orchestration patterns
- [ ] Cross-repository orchestration for polyrepo workflows

## Related Documentation

- **Testing Guide:** `docs/testing/TESTING_GUIDE.md`
- **Architecture Decisions:** `docs/architecture/ADR/`
- **Contribution Guide:** `CONTRIBUTING.md`
- **Agent Workflows:** `.cursor/docs/AGENT_WORKFLOWS.md`
