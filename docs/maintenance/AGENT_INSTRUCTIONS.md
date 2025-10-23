---
title: "Agent Instructions for Documentation Maintenance"
description: "Comprehensive guide for AI agents on maintaining CME documentation"
keywords: [agents, documentation, maintenance, guidelines, bmad, coordination, ticket-workflow]
last_updated: "2025-01-22"
---

# Agent Instructions for Documentation Maintenance

## Introduction

This document provides comprehensive instructions for AI agents maintaining documentation in the Content Manager Express (CME) monorepo. Following these guidelines ensures high-quality, consistent, and up-to-date documentation throughout the project lifecycle.

**Purpose:** Guide AI agents in maintaining high-quality, consistent documentation across the CME monorepo.

**Scope:** All documentation in `/docs`, package READMEs, and CHANGELOG files.

**Audience:** AI agents (Cursor, GitHub Copilot, Claude, ChatGPT, etc.) working on the CME codebase.

**Prerequisites:** Before using this guide, read:
- [AGENTS.md](/AGENTS.md) - Development standards and rules
- [DOCUMENTATION_STANDARDS.md](/docs/maintenance/DOCUMENTATION_STANDARDS.md) - Style guide and formatting conventions

## Core Principles

### Documentation as Code
Treat documentation with the same rigor as code:
- Version control all documentation changes
- Review documentation in pull requests
- Update documentation atomically with code changes
- Test documentation (verify links, examples, diagrams)

### Single Source of Truth
Avoid duplication across documentation:
- Use links to reference existing documentation
- Maintain one authoritative source per concept
- Update cross-references when content moves
- Consolidate duplicate information

### Keep It Current
Update documentation immediately when code changes:
- Documentation updates are part of the Definition of Done
- Outdated docs are worse than no docs
- Mark deprecated features clearly
- Remove documentation for deleted features

### Three-Tier Hierarchy
Follow the established documentation hierarchy from [AGENTS.md](/AGENTS.md):

1. **Package-level:** `packages/[name]/docs/` or `packages/[name]/README.md`
   - Implementation details specific to the package
   - API documentation
   - Package-specific configuration

2. **Feature-level:** `/docs/features/[name]/`
   - Cross-package feature documentation
   - Requirements and architecture
   - API contracts and testing strategy

3. **Global:** `/docs/architecture/`
   - System-wide architecture
   - Cross-cutting concerns
   - Technology decisions (ADRs)

### BMAD Method Alignment
Follow BMAD method patterns for architecture documentation:
- Multi-file architecture strategy (separate concerns)
- Feature-driven documentation approach
- Agent orchestration and handoff workflows
- Planning → Implementation → Testing → Documentation flow

Reference: [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD)

## BMAD Method Agent Coordination Patterns

### Agent Personas

The CME monorepo includes BMAD-inspired agent personas in `.brain/prompts/agents/`:

**Planning Agents:**
- **PM** - Product Manager for requirements and feature definition
- **Analyst** - Business Analyst for requirements analysis and user research
- **Architect** - Technical Architect for system design and ADRs

**Execution Agents:**
- **SM** - Scrum Master for story breakdown and sprint planning
- **Dev** - Developer for implementation following TDD
- **QA** - Quality Assurance for validation and testing

**Orchestrator:**
- **Orchestrator** - Meta-agent for coordinating multi-agent workflows

**How to Use:**
- Invoke individual agent: "Act as Product Manager and define requirements for [feature]"
- Use orchestrator: "Use the orchestrator to coordinate PM → Architect → SM workflow"
- Switch agents: "Switch to Architect mode and design the technical architecture"

Each agent has:
- Role definition and responsibilities
- Input requirements and output artifacts
- Quality checklist for handoff validation
- Integration with existing Brain Garden prompts

See `.brain/prompts/agents/README.md` for complete documentation.

### Orchestrator Model
The BMAD method employs specialized agents that coordinate through well-defined handoffs:

**Planning Agents** (Analyst/PM/Architect)
- Produce Product Requirements Documents (PRDs)
- Create architecture documentation
- Define system boundaries and interfaces
- Output: PRD, architecture diagrams, ADRs

**Scrum Master Agent**
- Consumes PRDs and architecture docs
- Generates detailed user stories and tasks
- Creates acceptance criteria
- Output: Sprint backlog, story tickets

**Development Agents**
- Consume stories and architecture docs
- Implement features following TDD workflow
- Update code references in documentation
- Output: Working code, unit tests, updated docs

**QA Agents**
- Consume requirements and test strategy
- Execute test plans and update test documentation
- Validate against acceptance criteria
- Output: Test reports, updated testing.md

### Multi-File Architecture Strategy
Separate concerns across multiple focused documents rather than monolithic files:

**Feature Documentation Structure:**
```
/docs/features/[feature-name]/
├── README.md           # Overview and navigation
├── requirements.md     # FR, NFR, user stories
├── architecture.md     # Technical design
├── api.md             # API contracts
└── testing.md         # Test strategy
```

**Architecture Documentation Structure:**
```
/docs/architecture/
├── system-overview.md  # High-level architecture
├── frontend.md         # Frontend-specific details
├── backend.md          # Backend-specific details
├── database.md         # Data layer
├── infrastructure.md   # Deployment and CI/CD
└── security.md         # Security architecture
```

This separation allows:
- Parallel work by specialized agents
- Focused updates without merge conflicts
- Clear ownership of documentation sections
- Easier navigation for specific concerns

### Ticket-Based Workflow Integration

#### Overview

The CME monorepo supports two complementary workflow approaches:

1. **Feature-Based Workflow** - For large features requiring comprehensive documentation
2. **Ticket-Based Workflow** - For day-to-day development work from GitHub Issues

#### When to Use Each Approach

**Feature-Based Workflow (Full BMAD):**
- Large features spanning multiple packages (e.g., "Authentication System")
- MVP milestone features from `/docs/architecture/prd.md`
- Cross-cutting concerns (e.g., "Plugin Architecture")
- Features requiring PRD, architecture docs, and ADRs
- Features documented in `/docs/features/[name]/`

**Ticket-Based Workflow:**
- Bug fixes and small enhancements
- Single-package or focused multi-package changes
- Refactoring and code improvements
- Chores (dependency updates, tooling changes)
- UI tweaks and styling improvements

#### Ticket-Based Workflow Types

**Simple Workflow (Dev → QA):**
- Bug fixes in existing code
- Styling and UI tweaks
- Single-package changes
- Quick wins (< 1 day)
- Workflow: `@.brain/prompts/workflows/ticket-based/simple-ticket-workflow.md`

**Complex Workflow (SM → Dev → QA):**
- Multi-package changes requiring task breakdown
- Enhancements affecting multiple features
- Medium complexity (1-3 days)
- Workflow: `@.brain/prompts/workflows/ticket-based/complex-ticket-workflow.md`

#### GitHub Issue Integration

Agents fetch issue context using the GitHub MCP server:
- Server ID: `edec762f-192d-442f-ad1e-66ea002f3264`
- Server Name: "GitHub"
- Capabilities: List issues, search issues, get issue details, comment on issues

**Starting Work from GitHub Issue:**
1. Run `@.brain/prompts/routine/planning/work-from-github-issue.prompt.md`
2. Provide issue number when prompted
3. Agent fetches issue context and determines appropriate workflow
4. Execute workflow (simple, complex, or full BMAD)
5. Close issue when complete

#### Documentation Updates for Tickets

**Always Update:**
- `CHANGELOG.md` (if user-facing change)
- Package `README.md` (if API changed)
- Existing feature docs (if behavior changed)

**Never Create:**
- New feature docs for tickets (use full BMAD workflow instead)
- Feature plans for small changes
- Architecture docs for bug fixes

#### Workflow Selection

Use `@.brain/prompts/routine/planning/determine-workflow-type.prompt.md` to analyze your task and get a workflow recommendation based on:
- Scope (single vs. multi-package)
- Complexity (simple vs. requires design)
- Duration (< 1 day vs. multi-day)
- Documentation (existing feature vs. new feature)

### Agent Handoff Workflow
Documentation follows the BMAD agent handoff pattern:

1. **Planning → Stories**
   - Planning agents create PRD and architecture docs
   - Scrum Master agent consumes these to generate stories
   - Documentation output: PRD, architecture docs, ADRs

2. **Stories → Code**
   - Development agents consume stories and architecture
   - Implement features with code
   - Documentation output: Code references, API docs

3. **Code → Test**
   - QA agents consume requirements and test strategy
   - Execute tests and validate
   - Documentation output: Test reports, updated testing.md

4. **Test → Documentation**
   - Documentation agents review all outputs
   - Ensure consistency and completeness
   - Documentation output: Updated indexes, cross-references

### Feature-Driven Approach
Document features as cohesive units that span multiple packages:

**Feature = User-Facing Capability**
- Example: "Authentication" spans packages (shared-redux, navigation-ui) and apps (client, server)
- Feature docs live in `/docs/features/authentication/`
- Package docs focus on implementation details
- Feature docs focus on user workflows and integration

**Benefits:**
- Documentation mirrors user mental model
- Easier onboarding (features vs. technical implementation)
- Clear traceability from requirements to code
- Natural organization for acceptance testing

## Documentation Update Triggers

### When to Update Documentation

Always update documentation when:

✅ **Adding new features** → Create feature documentation in `/docs/features/[name]/`

✅ **Modifying architecture** → Update relevant files in `/docs/architecture/`

✅ **Adding API endpoints** → Update `api.md` files with request/response examples

✅ **Changing deployment process** → Update `/docs/guides/` operational documentation

✅ **Making architectural decisions** → Create ADR in `/docs/architecture/decisions/`

✅ **Adding new packages** → Create package README.md with API documentation

✅ **Modifying Redux state** → Update `frontend.md` and feature architecture

✅ **Changing database schema** → Update `database.md` with schema diagrams

✅ **Updating dependencies** → Update package.json and CHANGELOG.md

✅ **Fixing bugs** → Update CHANGELOG.md with fix description

✅ **Working on GitHub issue** → Update CHANGELOG.md and related docs (do NOT create new feature docs)

✅ **Adding environment variables** → Update `.env.example` and relevant docs

✅ **Modifying authentication/authorization** → Update `security.md`

✅ **Changing CI/CD pipeline** → Update `infrastructure.md`

## Task 1: Updating Architecture Documentation

### When
Update architecture documentation when system architecture changes:
- Adding new services or packages
- Changing component relationships
- Modifying technology stack
- Updating deployment infrastructure
- Changing security patterns

### Files to Update

| Change Type | File to Update | What to Update |
|-------------|----------------|----------------|
| Monorepo structure | `/docs/architecture/system-overview.md` | Structure diagrams, package list |
| React/Redux changes | `/docs/architecture/frontend.md` | Component hierarchy, state management |
| Express/services | `/docs/architecture/backend.md` | Service architecture, middleware |
| Schema changes | `/docs/architecture/database.md` | ERD, data models |
| Deployment changes | `/docs/architecture/infrastructure.md` | CI/CD, hosting |
| Auth/authz changes | `/docs/architecture/security.md` | Security patterns, flows |

### Step-by-Step Process

1. **Identify affected documentation**
   - Determine which architecture doc(s) need updates
   - Consider cross-cutting concerns (e.g., new auth pattern affects security.md AND frontend.md)

2. **Read current documentation**
   - Use Read tool to understand existing content
   - Note the current structure and patterns
   - Identify specific sections to update

3. **Update relevant sections**
   - Add new information with clear, concise descriptions
   - Maintain existing formatting and structure
   - Ensure consistency with established terminology

4. **Update or add diagrams**
   - Add Mermaid diagrams if component relationships changed
   - Update sequence diagrams for flow changes
   - Keep diagrams simple and focused

5. **Update code references**
   - Use absolute file paths from repo root
   - Include line numbers for specific code: `file.ts:123`
   - Example: `packages/shared-redux/src/slices/user/userSlice.ts:45`

6. **Update YAML frontmatter**
   - Change `last_updated` to current date (YYYY-MM-DD format)
   - Verify all other frontmatter fields are accurate

7. **Verify links**
   - Test all internal links (absolute paths from repo root)
   - Ensure external links are valid
   - Check cross-references to other documentation

8. **Check system-overview.md**
   - For cross-cutting changes, update system-overview.md
   - Ensure high-level diagrams reflect changes
   - Update technology stack table if needed

### Example

**Scenario:** Adding a new Redux slice for user preferences

**Updates Required:**
1. `frontend.md` - State Management section
   - Add new slice to Redux state diagram
   - Document slice location: `packages/shared-redux/src/slices/preferences/preferencesSlice.ts`
   - Document state shape, actions, selectors
2. `system-overview.md` - If this represents new feature
   - Add to feature list
   - Update high-level architecture diagram

## Task 2: Creating Feature Documentation

### When
Create feature documentation when implementing new user-facing functionality that spans multiple packages or represents a distinct capability.

**Examples:**
- User authentication and session management
- Content search and filtering
- User profile management
- Multi-language support

### Template
Use `/docs/maintenance/templates/feature-template/` as starting point.

### Step-by-Step Process

1. **Copy template**
   ```bash
   cp -r /docs/maintenance/templates/feature-template /docs/features/[feature-name]
   ```

2. **Fill in README.md**
   - **Feature overview:** Brief description and current status
   - **Code locations:** List all packages, apps, services involved
   - **Key files:** Absolute paths to main implementation files
   - **Feature dependencies:** Other features this depends on
   - **User workflows:** High-level user interaction flows
   - **Configuration:** Environment variables and settings

3. **Fill in requirements.md**
   - **Functional requirements:** FR-001 format with descriptions
   - **Non-functional requirements:** NFR-001 format (performance, security, etc.)
   - **User stories:** US-001 format with "As a... I want... So that..."
   - **Acceptance criteria:** Specific, testable conditions
   - **Requirements traceability matrix:** Map requirements to implementation

4. **Fill in architecture.md**
   - **Component diagram:** Mermaid diagram showing component relationships
   - **Data flow diagram:** Sequence diagram showing interactions
   - **State management:** Redux slices, actions, selectors (if applicable)
   - **Code references:** Absolute paths to implementation files
   - **Design patterns:** Patterns used and rationale
   - **Dependencies:** External libraries and internal packages

5. **Fill in api.md**
   - **All API endpoints:** Complete list with methods and paths
   - **Request examples:** Sample request bodies with all fields
   - **Response examples:** Sample responses (success and error cases)
   - **Error codes:** All possible error responses with descriptions
   - **Client integration:** Code examples for consuming the API

6. **Fill in testing.md**
   - **Test strategy:** Unit, integration, E2E approach
   - **Test cases:** TC-001 format with expected results
   - **Test data:** Sample data and fixtures used
   - **Mocking strategy:** How external dependencies are mocked
   - **Coverage targets:** Expected coverage percentages
   - **Test locations:** Absolute paths to test files

7. **Update feature index**
   - Add entry to `/docs/features/FEATURE_MAP.md`
   - Include feature name, status, and link to README

8. **Update features README** (if needed)
   - Add to `/docs/features/README.md` if introducing new category
   - Ensure navigation is clear

### Reference Example
See `/docs/features/authentication/` for a complete, production-ready implementation.

## Task 3: Maintaining the Root Index

### When
Update the root documentation index when:
- Adding new major documentation sections
- Reorganizing documentation structure
- Archiving or removing documentation
- Adding new features or architecture docs

### File
`/docs/README.md`

### Step-by-Step Process

1. **Read current README**
   - Understand existing navigation structure
   - Note the four main categories: Architecture, Features, Guides, Maintenance

2. **Add new section**
   - Place in appropriate category
   - Use consistent formatting with existing entries
   - Include descriptive text (one sentence)

3. **Update Quick Links table**
   - Add link to new documentation
   - Use absolute path from repo root: `/docs/path/to/file.md`
   - Keep table columns aligned for readability

4. **Ensure consistent formatting**
   - Match heading levels with existing structure
   - Use same link format as other entries
   - Maintain alphabetical order within categories (if applicable)

5. **Update YAML frontmatter**
   - Update `last_updated` to current date (YYYY-MM-DD)
   - Verify other fields are accurate

6. **Verify all links**
   - Test every link works correctly
   - Ensure absolute paths are correct
   - Check for broken or outdated links

### Maintenance Checklist

✅ All major documentation folders have entries

✅ Links use absolute paths from repo root (`/docs/...`)

✅ Descriptions are concise and accurate (one sentence)

✅ Navigation is intuitive and logical

✅ No broken links

✅ Categories are clear and well-organized

## Task 4: Using Templates

### Available Templates

| Template | Location | Use Case |
|----------|----------|----------|
| Feature Template | `/docs/maintenance/templates/feature-template/` | Complete feature documentation |
| PRD Template | `/docs/maintenance/templates/prd-template.md` | BMAD-style Product Requirements |
| Architecture Template | `/docs/maintenance/templates/architecture-template.md` | Architecture documents |
| ADR Template | `/docs/maintenance/templates/adr-template.md` | Architecture Decision Records |

### How to Use Templates

1. **Copy template to appropriate location**
   - For features: `/docs/features/[feature-name]/`
   - For architecture: `/docs/architecture/`
   - For ADRs: `/docs/architecture/decisions/`

2. **Replace all placeholders**
   - Find all `[PLACEHOLDER]` text
   - Replace with actual content
   - Do not leave any placeholder text

3. **Update YAML frontmatter**
   - Fill in `title` with document title
   - Write concise `description`
   - Add relevant `keywords`
   - Set `last_updated` to current date

4. **Fill in all sections completely**
   - Every section should have real content
   - Add diagrams where appropriate
   - Include code references with absolute paths

5. **Remove instruction blocks**
   - Delete any template instructions
   - Remove comments meant for template users
   - Clean up formatting

6. **Add links to related documentation**
   - Link to architecture docs
   - Link to related features
   - Link to relevant ADRs

7. **Update relevant indexes**
   - Add to `/docs/README.md`
   - Add to `/docs/features/FEATURE_MAP.md` (for features)
   - Add to `/docs/architecture/decisions/README.md` (for ADRs)

### Template Customization

Templates are starting points, not rigid structures:
- Add sections specific to your use case
- Remove sections that aren't applicable
- Adjust heading hierarchy as needed
- Maintain consistent formatting throughout

## Task 5: Creating Architecture Decision Records (ADRs)

### When
Create ADRs when making significant architectural decisions:
- Technology choices (frameworks, libraries, tools)
- Design pattern selections
- Migration strategies
- Infrastructure decisions
- Security architecture choices

**Examples:**
- "Use pnpm workspaces for monorepo management"
- "Adopt Turborepo for build orchestration"
- "ESM-only architecture (no CommonJS)"
- "Migrate from Heroku to Laravel Forge"

### Template
`/docs/maintenance/templates/adr-template.md`

### Location
`/docs/architecture/decisions/ADR-NNN-title.md`

### Step-by-Step Process

1. **Determine ADR number**
   - Check `/docs/architecture/decisions/README.md` for next sequential number
   - Use three-digit format: ADR-001, ADR-002, etc.

2. **Copy ADR template**
   - Copy template to decisions folder
   - Name file: `ADR-NNN-short-title.md`
   - Example: `ADR-005-adopt-turborepo.md`

3. **Fill in all sections**

   **Status:**
   - Set to `proposed`, `accepted`, `rejected`, or `superseded`
   - Add date and superseding ADR if applicable

   **Context and Problem Statement:**
   - Describe the problem or opportunity
   - Explain why a decision is needed
   - Provide relevant background

   **Decision Drivers:**
   - List factors influencing the decision
   - Include technical, business, and team considerations

   **Considered Options:**
   - List all options evaluated
   - For each option, document:
     - Pros (advantages)
     - Cons (disadvantages)
   - Be objective and thorough

   **Decision Outcome:**
   - State the chosen option clearly
   - Explain rationale for the choice
   - Reference decision drivers

   **Consequences:**
   - **Positive:** Benefits of this decision
   - **Negative:** Drawbacks or costs
   - **Neutral:** Other impacts

4. **Update ADR index**
   - Add entry to `/docs/architecture/decisions/README.md`
   - Include number, title, status, date
   - Maintain chronological order

5. **Link from relevant docs**
   - Add link to ADR from architecture documentation
   - Example: In `infrastructure.md`, link to ADR about deployment platform choice

6. **Update YAML frontmatter**
   - Set `last_updated` to current date
   - Ensure all fields are complete

## Task 6: Updating Package Documentation

### When
Update package documentation when:
- Creating a new package
- Modifying package API (exports, functions, components)
- Adding new features to a package
- Changing configuration or usage patterns

### Required Files
Per [AGENTS.md](/AGENTS.md), each package must have:
- `README.md` - Overview, installation, usage, API
- `CHANGELOG.md` - Keep a Changelog format
- `package.json` - SemVer version

### README.md Structure

**Package name and description**
```markdown
# @scala-cme/package-name

Brief description of package purpose and capabilities.
```

**Installation instructions**
```markdown
## Installation

This package is part of the CME monorepo and installed via workspace dependencies.

## Dependencies

List any external dependencies and their versions.
```

**Usage examples**
```markdown
## Usage

\`\`\`typescript
import { functionName } from '@scala-cme/package-name';

// Example usage
const result = functionName(param);
\`\`\`
```

**API documentation**
```markdown
## API

### Functions

#### `functionName(param: Type): ReturnType`

Description of function purpose and behavior.

**Parameters:**
- `param` (Type) - Parameter description

**Returns:** ReturnType - Description of return value

**Example:**
\`\`\`typescript
const result = functionName('value');
\`\`\`
```

**Configuration options**
```markdown
## Configuration

Document any configuration files, environment variables, or settings.
```

**Links to related documentation**
```markdown
## Related Documentation

- [Feature Name](/docs/features/feature-name/README.md)
- [Architecture](/docs/architecture/frontend.md)
```

### CHANGELOG.md Updates

Follow **Keep a Changelog** format:

```markdown
# Changelog

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features in development

## [1.2.0] - 2025-10-21

### Added
- New export function `functionName`
- Support for new configuration option

### Changed
- Improved performance of `existingFunction`

### Fixed
- Fixed bug in error handling
```

**On Release:**
- Move `[Unreleased]` items to `[x.y.z] - YYYY-MM-DD`
- Create new empty `[Unreleased]` section
- Update version in `package.json`

**Versioning (SemVer):**
- **MAJOR** (x.0.0) - Breaking API changes
- **MINOR** (0.x.0) - New features (backward compatible)
- **PATCH** (0.0.x) - Bug fixes (backward compatible)

## Documentation Quality Checklist

### Before Committing Documentation Changes

✅ **YAML frontmatter is complete and correct**
   - All required fields present: title, description, keywords, last_updated
   - Date format is YYYY-MM-DD
   - Keywords are relevant and lowercase

✅ **`last_updated` date is current**
   - Matches current date when modifying documentation
   - Format is YYYY-MM-DD

✅ **All code references use absolute paths**
   - Paths start from repository root
   - Include line numbers for specific code: `file.ts:123`
   - Example: `packages/package-name/src/file.ts`

✅ **All internal links work**
   - Test by clicking every link
   - Use absolute paths from repo root: `/docs/path/file.md`
   - Check section links: `#section-heading`

✅ **Mermaid diagrams render correctly**
   - Use ` ```mermaid ` code blocks
   - Test rendering in markdown preview
   - Keep diagrams simple and readable

✅ **Code snippets have proper syntax highlighting**
   - Always specify language: ` ```typescript `
   - Ensure code is syntactically correct
   - Include comments for complex logic

✅ **No placeholder text remains**
   - No `[PLACEHOLDER]` or `TODO` text
   - All template instructions removed
   - All sections filled completely

✅ **Spelling and grammar are correct**
   - Use spell checker
   - Read for clarity
   - Ensure professional tone

✅ **Formatting follows DOCUMENTATION_STANDARDS.md**
   - Consistent heading hierarchy
   - Proper list formatting
   - Correct emphasis and code formatting

✅ **Related documentation is updated**
   - Updated indexes (README.md, FEATURE_MAP.md)
   - Added cross-references
   - Linked to related docs

✅ **Examples are accurate and tested**
   - Code examples work as written
   - Examples reflect current implementation
   - Examples follow best practices

## Common Pitfalls to Avoid

❌ **Don't duplicate content**
- Use links to reference existing documentation
- Maintain single source of truth
- Consolidate duplicate information

❌ **Don't use relative paths**
- Always use absolute paths from repo root
- Format: `/docs/path/to/file.md`
- Relative paths break when docs move

❌ **Don't leave placeholders**
- Complete all sections or remove them
- No `[PLACEHOLDER]` or `TODO` text
- Remove template instructions

❌ **Don't forget YAML frontmatter**
- Every markdown file in `/docs` needs it
- All required fields must be present
- Date format must be YYYY-MM-DD

❌ **Don't skip date updates**
- Update `last_updated` when modifying docs
- Date reflects when content was last changed
- Helps readers assess currency

❌ **Don't break links**
- Verify all links work after changes
- Update links when moving files
- Test both internal and external links

❌ **Don't ignore the hierarchy**
- Place docs at correct level (package/feature/global)
- Follow three-tier hierarchy
- Don't mix concerns across levels

❌ **Don't write code in docs**
- Reference code locations with absolute paths
- Link to implementation files
- Don't duplicate code in documentation

❌ **Don't forget cross-references**
- Link related documentation together
- Add "Related Documentation" sections
- Build documentation navigation network

## Agent Coordination Best Practices

### Multi-Agent Workflows
Inspired by the BMAD method, different agent types focus on different documentation aspects:

**Agent Roles:**
- Use PM agent for product requirements and feature definition
- Use Analyst agent for requirements analysis and user research
- Use Architect agent for technical design and ADRs
- Use SM agent for story breakdown and sprint planning
- Use Dev agent for implementation following TDD
- Use QA agent for validation and E2E testing
- Use Orchestrator for coordinating multi-agent workflows

**Planning Agents**
- Focus on PRD and architecture documentation
- Create ADRs for architectural decisions
- Define requirements and system design
- Output: PRDs, architecture docs, ADRs

**Development Agents**
- Update feature documentation during implementation
- Maintain code references and examples
- Update API documentation
- Output: Updated feature docs, code references

**QA Agents**
- Update testing documentation
- Document test cases and strategies
- Maintain test coverage information
- Output: Updated testing.md, test reports

**Documentation Agents**
- Maintain consistency across all documentation
- Update indexes and cross-references
- Ensure standards compliance
- Output: Updated indexes, fixed links, consistent formatting

### Handoff Points

Documentation updates should occur at these natural handoff points:

**After Architectural Decisions**
- Create or update architecture documentation
- Create ADR to document the decision
- Update relevant system diagrams
- Link ADR from architecture docs

**After Feature Implementation**
- Create or update feature documentation
- Update code references with absolute paths
- Document API endpoints
- Update package READMEs

**After API Changes**
- Update api.md files with new endpoints
- Include request/response examples
- Document error responses
- Update client integration examples

**After Testing**
- Update testing.md with new test cases
- Document test strategy changes
- Update coverage information
- Link to test files

### Communication

Use documentation to communicate across agents and time:

**ADRs Document Decisions**
- Capture context for future agents
- Explain rationale behind choices
- Provide alternatives considered
- Help onboarding and future decisions

**CHANGELOG Communicates Changes**
- Documents what changed and when
- Helps users understand impact
- Provides migration guidance
- Tracks version history

**Cross-References Provide Context**
- Link related documentation together
- Build knowledge graph
- Help readers navigate
- Reduce duplication

## Quick Reference

### Documentation Hierarchy

```
Package-level:  packages/[name]/docs/ or packages/[name]/README.md
                ↓ (Implementation details, package API)

Feature-level:  /docs/features/[name]/
                ↓ (Cross-package features, requirements, architecture)

Global:         /docs/architecture/
                ↓ (System-wide architecture, cross-cutting concerns)
```

### Key Files

| File | Purpose |
|------|---------|
| `/docs/README.md` | Root documentation index |
| `/docs/architecture/README.md` | Architecture documentation index |
| `/docs/features/README.md` | Features documentation index |
| `/docs/features/FEATURE_MAP.md` | Feature status tracking |
| `/docs/architecture/decisions/README.md` | ADR index |
| `/AGENTS.md` | Development standards and rules |
| `/docs/maintenance/DOCUMENTATION_STANDARDS.md` | Style guide and conventions |
| `.brain/prompts/workflows/ticket-based/` | Ticket-based workflow prompts |
| `.brain/prompts/routine/planning/work-from-github-issue.prompt.md` | GitHub issue integration |

### Templates Location

`/docs/maintenance/templates/`
- `feature-template/` - Complete feature documentation structure
- `prd-template.md` - Product Requirements Document
- `architecture-template.md` - Architecture documentation
- `adr-template.md` - Architecture Decision Record
- `github-issue-template.md` - GitHub issue creation guide

### Agent Prompts

**Planning agents:** `.brain/prompts/agents/pm.md`, `analyst.md`, `architect.md`
**Execution agents:** `.brain/prompts/agents/sm.md`, `dev.md`, `qa.md`
**Orchestrator:** `.brain/prompts/agents/orchestrator.md`
**Checklists:** `.brain/prompts/agents/checklists/`
**Workflows (BMAD):** `.brain/prompts/workflows/bmad/`
**Workflows (Ticket-Based):** `.brain/prompts/workflows/ticket-based/`

### Developer Tools

| Tool Category | Documentation |
|---------------|---------------|
| Quick Reference | `/docs/guides/developer-tools/quick-reference.md` |
| Validation Tools | `/docs/guides/developer-tools/validation-tools.md` |
| Development Workflows | `/docs/guides/developer-tools/development-workflow.md` |
| Logging & Debugging | `/docs/guides/developer-tools/logging-debugging.md` |
| Code Generation | `/docs/guides/developer-tools/code-generation.md` |
| Environment Management | `/docs/guides/developer-tools/environment-management.md` |
| Monorepo Tools | `/docs/guides/developer-tools/monorepo-tools.md` |
| Troubleshooting | `/docs/guides/developer-tools/troubleshooting.md` |

### Examples

**Feature Documentation:**
- `/docs/features/authentication/` - Complete implementation reference

**Architecture Documentation:**
- `/docs/architecture/security.md` - Security architecture patterns
- `/docs/architecture/frontend.md` - Frontend architecture

**ADRs:**
- `/docs/architecture/decisions/` - Architecture decisions index

## Related Resources

### Internal Documentation

- [AGENTS.md](/AGENTS.md) - Development standards and rules for the CME monorepo
- [DOCUMENTATION_STANDARDS.md](/docs/maintenance/DOCUMENTATION_STANDARDS.md) - Style guide and formatting conventions
- [/docs/README.md](/docs/README.md) - Root documentation index and navigation
- [/docs/maintenance/README.md](/docs/maintenance/README.md) - Maintenance documentation overview
- [/docs/guides/developer-tools/](/docs/guides/developer-tools/) - Comprehensive developer tools guide

### External Resources

- [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) - Agent coordination patterns for documentation
- [Keep a Changelog](https://keepachangelog.com/) - CHANGELOG format specification
- [Semantic Versioning](https://semver.org/) - Version numbering standard (SemVer 2.0.0)
- [Mermaid Documentation](https://mermaid.js.org/) - Diagram syntax and examples
- [MADR](https://adr.github.io/madr/) - Markdown Architecture Decision Records format

---

This guide provides comprehensive, actionable instructions for AI agents to maintain documentation consistently and effectively throughout the CME monorepo lifecycle. Follow these guidelines to ensure all documentation remains high-quality, current, and valuable to the team.
