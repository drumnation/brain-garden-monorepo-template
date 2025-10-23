---
title: "GitHub Issue Template Guide"
description: "Guide for creating well-structured GitHub issues for agent consumption"
keywords: [github, issues, templates, agents, workflow]
last_updated: "2025-10-21"
---

# GitHub Issue Template Guide

Guide for creating GitHub issues that AI agents can easily parse and work from, enabling efficient ticket-based development workflows.

## Purpose

This guide explains how to structure GitHub issues to maximize AI agent effectiveness. Well-structured issues enable agents to:
- Automatically extract acceptance criteria
- Identify related files for context loading
- Determine appropriate workflow complexity
- Track progress through checkboxes
- Link documentation and related issues

## Quick Start

**Use the templates in `.github/ISSUE_TEMPLATE/`:**
- `bug-fix.md` - For bug reports
- `enhancement.md` - For enhancements and new capabilities

GitHub will present these templates when creating new issues.

## Required Elements

### 1. Clear Title

**Format:** `[TYPE] Brief description`

**Types:**
- `[BUG]` - Something is broken
- `[ENHANCEMENT]` - New capability or improvement
- `[CHORE]` - Maintenance work (dependencies, tooling)
- `[REFACTOR]` - Code improvement without functionality change

**Examples:**
- `[BUG] Button alignment broken on mobile`
- `[ENHANCEMENT] Add dark mode theme support`
- `[CHORE] Update React from 18.2 to 18.3`
- `[REFACTOR] Simplify authentication flow`

**Why it matters:**
- Agents extract issue type from title
- Type determines initial workflow routing
- Helps with issue filtering and organization

### 2. Description

Provide context and background:

**What:**
- Clear explanation of what needs to be done
- Current state vs. desired state (for bugs)
- Problem being solved (for enhancements)

**Why:**
- Business value or impact
- User pain point being addressed
- Technical debt being resolved

**How (Optional):**
- Suggested approach
- Design considerations
- Constraints or requirements

**Example:**
```markdown
## Bug Description
The submit button on the user profile page is misaligned on mobile devices (< 768px), causing it to overflow the container and partially cut off the button text.

This affects user experience as users on mobile cannot see the full "Save Profile" text, leading to confusion.
```

### 3. Acceptance Criteria

**Format:** Checkbox list with specific, testable conditions

**Guidelines:**
- Use checkboxes (`- [ ]`) for tracking
- Be specific and measurable
- Cover happy path and edge cases
- Include testing requirements
- Mention documentation if needed

**Example:**
```markdown
## Acceptance Criteria

- [ ] Button aligns correctly on mobile devices (< 768px)
- [ ] Button text is fully visible on all screen sizes
- [ ] Button maintains proper alignment on desktop (>= 768px)
- [ ] No regression in other button components
- [ ] Unit tests added to verify alignment
- [ ] CHANGELOG.md updated with fix
```

**Why it matters:**
- Agents use checkboxes to track completion
- Each criterion becomes a test case
- QA agent validates all criteria
- Clear definition of "done"

### 4. Related Files/Packages

**Format:** List affected files with absolute paths from repo root

**Guidelines:**
- Use absolute paths: `packages/[name]/src/[file].ts`
- Include test files if they need updating
- Mention configuration files if relevant
- List all packages affected (for multi-package changes)

**Example:**
```markdown
## Related Files/Packages

**Primary Files:**
- `packages/shared-ui/src/components/1-atoms/Button/Button.tsx`
- `packages/shared-ui/src/components/1-atoms/Button/Button.unit.test.tsx`

**Affected Apps:**
- `apps/admin/src/pages/UserProfile.tsx` (uses Button component)
- `apps/client/src/pages/Settings.tsx` (uses Button component)

**Documentation:**
- `packages/shared-ui/README.md` (if API changes)
```

**Why it matters:**
- Agents load these files for context
- Helps determine workflow complexity
- Identifies scope of changes
- Guides test strategy

### 5. Related Documentation

**Format:** Links to existing documentation

**Guidelines:**
- Link to feature docs if applicable
- Link to architecture docs for design context
- Link to ADRs if architectural decisions involved
- Link to related issues or PRs

**Example:**
```markdown
## Related Documentation

**Feature Documentation:**
- [Admin Panel Feature](/docs/features/admin-panel/README.md)
- [Shared UI Components](/docs/features/shared-ui/README.md)

**Architecture:**
- [Component Architecture](/docs/architecture/component-structure.md)
- [ADR-003: Atomic Design Pattern](/docs/architecture/decisions/003-atomic-design.md)

**Related Issues:**
- #45 - Original button component implementation
- #89 - Mobile responsiveness epic
```

**Why it matters:**
- Agents understand full context
- Prevents duplicating architectural decisions
- Links related work
- Guides implementation approach

### 6. Complexity Estimate (For Enhancements)

**Options:**
- **Simple** (< 1 day, single package) → Dev → QA workflow
- **Complex** (1-3 days, multi-package) → SM → Dev → QA workflow
- **Large Feature** (multiple sprints) → Full BMAD workflow

**Include justification:**
```markdown
## Complexity Estimate

- [x] Simple (< 1 day, single package)

**Justification:**
Single component fix in shared-ui package. No architectural changes needed. Straightforward CSS adjustment with unit test.
```

**Why it matters:**
- Agents use this to select workflow
- Helps with sprint planning
- Sets expectations for timeline
- Routes to appropriate agents (Dev vs. SM vs. PM)

## Best Practices

### Use Checkbox Lists

Checkboxes enable progress tracking:

```markdown
## Implementation Tasks
- [x] Task 1 complete
- [x] Task 2 complete
- [ ] Task 3 in progress
- [ ] Task 4 pending
```

Agents and humans can see progress at a glance.

### Be Specific

**Bad:**
```markdown
- [ ] Fix the button
```

**Good:**
```markdown
- [ ] Button aligns to center on mobile (< 768px)
- [ ] Button maintains right alignment on desktop (>= 768px)
- [ ] Button text remains fully visible on all screen sizes
```

### Include Context

**Bad:**
```markdown
Button is broken on mobile.
```

**Good:**
```markdown
The submit button on the user profile page overflows its container on mobile devices (screen width < 768px). This started after PR #234 when we updated the form layout. The button text "Save Profile" gets cut off, showing only "Save Pro".
```

### Link Everything

Connect related information:
- Link to feature docs
- Link to architecture decisions
- Link to related issues
- Link to PRs that may have caused bugs
- Link to discussions about the feature

### Use Labels

Apply appropriate labels:
- `bug` - Bugs
- `enhancement` - Enhancements
- `chore` - Chores
- `good first issue` - Good for new contributors
- `high priority` - Urgent issues
- `needs design` - Requires design input

### Update as You Go

Keep the issue current:
- Check off acceptance criteria as completed
- Add comments with progress updates
- Update complexity estimate if it changes
- Link PRs when created

## Agent Integration

### How Agents Process Issues

**1. Fetch Issue:**
```markdown
Use GitHub MCP to fetch issue #[NUMBER]
Extract: title, description, labels, acceptance criteria
```

**2. Determine Workflow:**
```markdown
Analyze: scope, complexity, duration, documentation needs
Score: 4-12 points
Route to: Simple (4-6), Complex (7-9), or Full BMAD (10-12)
```

**3. Load Context:**
```markdown
Read: related files, feature docs, architecture docs
Understand: current state, constraints, design patterns
```

**4. Execute Workflow:**
```markdown
Simple: Dev → QA
Complex: SM → Dev → QA
Full BMAD: PM → Analyst → Architect → SM → Dev → QA
```

**5. Track Progress:**
```markdown
Comment on issue with updates
Check off acceptance criteria
Link PR when created
Close issue when PR merged
```

### What Agents Extract

**From Title:**
- Issue type (bug, enhancement, chore)
- High-level description

**From Description:**
- Problem statement
- Context and background
- Proposed solution

**From Acceptance Criteria:**
- Testable conditions
- Definition of done
- Progress tracking

**From Related Files:**
- Files to read for context
- Packages affected
- Scope determination

**From Related Documentation:**
- Feature context
- Architectural constraints
- Related work

**From Complexity Estimate:**
- Workflow selection
- Agent routing
- Timeline estimation

## Examples of Well-Structured Issues

### Example 1: Bug Fix (Simple Workflow)

```markdown
---
title: "[BUG] Button alignment broken on mobile"
labels: bug
---

## Bug Description

The submit button on the user profile page is misaligned on mobile devices (< 768px), causing button text to be cut off.

## Steps to Reproduce

1. Open user profile page on mobile device or browser at < 768px width
2. Observe submit button at bottom of form
3. Notice button text "Save Profile" is partially cut off

## Expected Behavior

Button should be centered and fully visible with complete text on all screen sizes.

## Actual Behavior

Button overflows container, text shows only "Save Pro" on mobile.

## Acceptance Criteria

- [ ] Button aligns to center on mobile (< 768px)
- [ ] Button text fully visible on all screen sizes
- [ ] Button maintains proper styling on desktop
- [ ] No regression in other components
- [ ] Unit test added to verify alignment

## Related Files/Packages

- `packages/shared-ui/src/components/1-atoms/Button/Button.tsx`
- `packages/shared-ui/src/components/1-atoms/Button/Button.unit.test.tsx`
- `apps/admin/src/pages/UserProfile.tsx`

## Related Documentation

- [Shared UI Components](/docs/features/shared-ui/README.md)
- [ADR-003: Atomic Design](/docs/architecture/decisions/003-atomic-design.md)

## Environment

- Browser: Chrome 120
- OS: iOS 17 (iPhone)
- Node version: 20.11.0
```

**Why this is good:**
- Clear description with reproduction steps
- Specific acceptance criteria
- Files identified with absolute paths
- Linked to relevant documentation
- Environment details provided

**Agent will:**
- Classify as Simple (single package, bug fix)
- Route to Dev → QA workflow
- Load Button component and tests
- Implement fix with TDD
- Update CHANGELOG.md

---

### Example 2: Enhancement (Complex Workflow)

```markdown
---
title: "[ENHANCEMENT] Add user preferences across apps"
labels: enhancement
---

## Enhancement Description

Add user preferences feature allowing users to customize theme and notification settings across admin and client applications.

## Problem Statement

Users currently cannot personalize their experience. Adding preferences improves UX and allows users to customize the interface to their needs.

## Proposed Solution

Implement Redux-based preferences management with:
- Theme selection (light/dark)
- Notification settings (on/off, email preferences)
- Persistence via backend API and local storage
- UI in both admin and client apps

## Acceptance Criteria

- [ ] Users can select theme (light/dark) in settings
- [ ] Preferences persist across browser sessions
- [ ] Settings UI available in admin and client apps
- [ ] Theme changes apply immediately without refresh
- [ ] Notification preferences saved to backend
- [ ] Unit tests for Redux slice
- [ ] Integration tests for persistence
- [ ] E2E tests for UI workflow
- [ ] Documentation updated (CHANGELOG, READMEs)

## Related Files/Packages

**New Files:**
- `packages/shared-redux/src/slices/preferencesSlice.ts`
- `packages/admin-ui/src/components/PreferencesPanel.tsx`
- `packages/client/src/pages/Settings.tsx`

**Modified Files:**
- `packages/shared-redux/src/store.ts` (add preferences slice)
- `apps/admin/src/App.tsx` (apply theme)
- `apps/client/src/App.tsx` (apply theme)

## Related Documentation

- [Shared Redux State](/docs/features/shared-redux/README.md)
- [Admin UI](/docs/features/admin-panel/README.md)
- [Client App](/docs/features/client/README.md)

## Complexity Estimate

- [ ] Simple
- [x] Complex (1-3 days, multi-package)
- [ ] Large Feature

**Justification:**
Spans 3 packages (shared-redux, admin-ui, client). Requires task breakdown for Redux implementation, UI components, and testing. Needs coordination but doesn't require new architecture.

## Design Considerations

**State Management:**
```typescript
interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: {
    enabled: boolean;
    email: boolean;
  };
}
```

**API Endpoints:**
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update preferences

## Testing Strategy

**Unit Tests:**
- Redux slice actions and reducers
- Preference validation logic

**Integration Tests:**
- Redux slice with backend API
- Preference persistence

**E2E Tests:**
- Complete preference update workflow
- Theme switching in both apps
```

**Why this is good:**
- Clear problem and solution
- Comprehensive acceptance criteria
- All affected files identified
- Complexity correctly estimated as Complex
- Design considerations provided
- Testing strategy defined

**Agent will:**
- Classify as Complex (multi-package, task breakdown needed)
- Route to SM → Dev → QA workflow
- SM breaks down into MECE tasks
- Dev implements tasks in order
- QA validates all criteria with E2E tests

---

## Related Resources

**GitHub Templates:**
- [Bug Fix Template](/.github/ISSUE_TEMPLATE/bug-fix.md)
- [Enhancement Template](/.github/ISSUE_TEMPLATE/enhancement.md)
- [Template Configuration](/.github/ISSUE_TEMPLATE/config.yml)

**Workflow Documentation:**
- [Ticket-Based Workflows](/.brain/prompts/workflows/ticket-based/README.md)
- [Work from GitHub Issue](/.brain/prompts/routine/planning/work-from-github-issue.prompt.md)
- [Determine Workflow Type](/.brain/prompts/routine/planning/determine-workflow-type.prompt.md)

**Agent Instructions:**
- [AGENT_INSTRUCTIONS.md](/docs/maintenance/AGENT_INSTRUCTIONS.md)
- [AGENTS.md](/AGENTS.md)
