<!--
PRD Template v2.0
Based on BMAD Method PRD template

Instructions:
1. Copy this template to create a new PRD
2. Replace all [PLACEHOLDER] text with actual content
3. Update YAML frontmatter with appropriate values
4. Fill in all sections completely
5. Remove this instruction block when done

For examples, see: docs/architecture/prd.md
-->

---
title: "[Project Name] - Product Requirements Document (PRD)"
description: "[Brief description of the product/feature - 1 sentence]"
keywords: [prd, requirements, [domain], [feature]]
last_updated: "YYYY-MM-DD"
---

# [Project Name] - Product Requirements Document (PRD)

## Goals and Background Context

### Goals

<!-- List 3-5 primary goals for this product/feature. Format each as:
- **Goal Title**: Brief description explaining the strategic intent
Use business language focused on value delivered, not implementation details.
Example: "Modernize Legacy System: Replace outdated backend with modern React/TypeScript"
-->

1. **[Goal 1 Title]**
   - [Description of goal and strategic intent]

2. **[Goal 2 Title]**
   - [Description of goal and strategic intent]

3. **[Goal 3 Title]**
   - [Description of goal and strategic intent]

### Background Context

<!-- Write 2-3 paragraphs providing context:
- Why this product/feature is needed
- Historical context or previous attempts
- Key business drivers
- Current state and limitations
- Success criteria
Example: "CME is a modernization project following an 8-month pause, now pivoting to plugin development..."
-->

[Paragraph 1: Context and why this is needed]

[Paragraph 2: Historical context or constraints]

[Paragraph 3: Success criteria or strategic importance]

### Change Log

<!-- Track document versions for audit trail -->

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| YYYY-MM-DD | v1.0 | [Description of initial creation or major update] | [Your Name] |

---

## Requirements

### Functional Requirements

<!-- List all functional requirements with consistent FR-### numbering.
Format: FR-###: Requirement Title
Each requirement should:
- Be testable and measurable
- Describe specific user-facing functionality
- Include relevant acceptance criteria
- Use business language

Example: "FR-001: User Authentication via API
Users authenticate using username/password credentials
Authentication proxied to external API with token-based sessions..."
-->

**FR-001: [Requirement Title]**
- [Detailed description of the functional requirement]
- [Key feature or capability]
- [Integration points if applicable]

**FR-002: [Requirement Title]**
- [Detailed description of the functional requirement]
- [Key feature or capability]
- [Integration points if applicable]

**FR-003: [Requirement Title]**
- [Detailed description of the functional requirement]
- [Key feature or capability]
- [Integration points if applicable]

### Non-Functional Requirements

<!-- List all non-functional requirements with consistent NFR-### numbering.
Format: NFR-###: Requirement Title
These describe quality attributes: performance, security, scalability, etc.

Example: "NFR-001: Response Time Performance
- API response time < 2 seconds for typical requests
- Client-side rendering < 1 second for page transitions"
-->

**NFR-001: [Performance/Quality Requirement Title]**
- [Specific metric or performance target]
- [Measurement criteria]
- [Rationale]

**NFR-002: [Performance/Quality Requirement Title]**
- [Specific metric or performance target]
- [Measurement criteria]
- [Rationale]

---

## User Interface Design Goals

<!-- Optional section - include if UI/UX is a primary concern for this product -->
<!-- If not applicable, remove this entire section -->

### Overall UX Vision

<!-- Describe the high-level UX vision in 2-3 sentences.
What should users feel when using this interface?
What is the primary user job to be done?

Example: "Provide an intuitive, fast approval workflow where admins review content with minimal clicks"
-->

[Description of UX vision and primary user goals]

### Key Interaction Paradigms

<!-- Describe the primary interaction patterns:
- How do users navigate?
- What are the primary workflows?
- Any novel or complex interactions?

Example: "Dashboard-based approval queue, drag-and-drop template editing, real-time preview"
-->

- [Interaction paradigm 1]
- [Interaction paradigm 2]
- [Interaction paradigm 3]

### Core Screens and Views

<!-- List the main screens/pages in the application:
- Dashboard
- Message Editor
- Approval Queue
- Admin Settings
etc.
Include brief description of purpose
-->

1. **[Screen 1 Name]** - [Purpose and key elements]
2. **[Screen 2 Name]** - [Purpose and key elements]
3. **[Screen 3 Name]** - [Purpose and key elements]

### Accessibility

<!-- Specify accessibility standards: None / WCAG AA / WCAG AAA -->

**Target Standard:** WCAG AA

**Key Requirements:**
- [Specific accessibility requirement]
- [Specific accessibility requirement]

### Branding

<!-- Any branding guidelines for the UI:
- Color palette
- Typography
- Logo usage
- Visual style
-->

- **Primary Colors:** [List colors]
- **Typography:** [Font families and sizes]
- **Visual Style:** [Description of visual approach - modern, minimal, corporate, etc.]

### Target Devices and Platforms

<!-- What devices and browsers should be supported? -->

- **Desktop:** [Browsers and versions]
- **Tablet:** [Support required? Yes/No]
- **Mobile:** [Support required? Yes/No]

---

## Technical Assumptions

### Repository Structure

<!-- Describe the expected monorepo/repository structure:
- Where will code live?
- Any new packages/applications needed?
- Directory organization

Example: "Built as pnpm monorepo with packages in /packages and applications in /apps"
-->

[Description of repository structure]

### Service Architecture

<!-- Describe the high-level service architecture:
- What services are involved?
- How do they communicate?
- Any external integrations?

Example: "React frontend proxied through Express middleware to legacy Content Manager API"
-->

[Description of service architecture]

### Testing Requirements

<!-- What types of tests are required?
- Unit test coverage target?
- Integration tests needed?
- E2E test scenarios?

Example: "E2E tests for approval workflow, unit tests for validation, integration tests for API proxy"
-->

- **Unit Tests:** [Coverage target and scope]
- **Integration Tests:** [Scope and critical paths]
- **E2E Tests:** [Key user workflows to test]

### Additional Technical Assumptions

<!-- Any other technical constraints or decisions that affect design:
- Technology stack decisions
- Platform limitations
- Scalability assumptions
- Security frameworks
-->

- [Technical assumption 1]
- [Technical assumption 2]
- [Technical assumption 3]

---

## Epic List

<!-- Provide a numbered list of all epics for this product.
Each epic is a large piece of functionality that can be broken into user stories.
Keep descriptions brief - details come in Epic Details section below.

Example:
1. User Authentication
2. Role-Based Access Control
3. Message Creation and Editing
4. Approval Workflow
5. Publishing and Distribution
-->

1. **[Epic 1 Name]** - [One-line description]
2. **[Epic 2 Name]** - [One-line description]
3. **[Epic 3 Name]** - [One-line description]
4. **[Epic 4 Name]** - [One-line description]

---

## Epic Details

<!-- For each epic from the Epic List above, provide detailed breakdown.
Copy this section template for each epic. Format consistently.
Each epic should have: Description, User Stories, Acceptance Criteria, Technical Notes
-->

### Epic 1: [Epic Name]

#### Description

<!-- 2-3 sentences explaining what this epic accomplishes and why it matters -->

[Detailed description of the epic's purpose and value]

#### User Stories

<!-- User stories in format: "As a [role], I want [goal], so that [benefit]"
List 3-5 user stories that make up this epic.
-->

- As a [role], I want [goal], so that [benefit]
- As a [role], I want [goal], so that [benefit]
- As a [role], I want [goal], so that [benefit]

#### Acceptance Criteria

<!-- Numbered list of specific, testable acceptance criteria.
These define what "done" looks like for this epic.
-->

1. [Acceptance criterion 1 - testable and specific]
2. [Acceptance criterion 2 - testable and specific]
3. [Acceptance criterion 3 - testable and specific]
4. [Acceptance criterion 4 - testable and specific]

#### Technical Notes

<!-- Any implementation details, technical constraints, or architectural decisions relevant to this epic -->

- [Technical note 1]
- [Technical note 2]
- [Technical consideration or constraint]

---

### Epic 2: [Epic Name]

#### Description

[Detailed description of the epic's purpose and value]

#### User Stories

- As a [role], I want [goal], so that [benefit]
- As a [role], I want [goal], so that [benefit]
- As a [role], I want [goal], so that [benefit]

#### Acceptance Criteria

1. [Acceptance criterion 1 - testable and specific]
2. [Acceptance criterion 2 - testable and specific]
3. [Acceptance criterion 3 - testable and specific]

#### Technical Notes

- [Technical note 1]
- [Technical note 2]

---

### Epic 3: [Epic Name]

#### Description

[Detailed description of the epic's purpose and value]

#### User Stories

- As a [role], I want [goal], so that [benefit]
- As a [role], I want [goal], so that [benefit]

#### Acceptance Criteria

1. [Acceptance criterion 1 - testable and specific]
2. [Acceptance criterion 2 - testable and specific]
3. [Acceptance criterion 3 - testable and specific]

#### Technical Notes

- [Technical note 1]
- [Technical note 2]

---

## Checklist Results Report

<!-- This section documents the results of the PM checklist.
If you've completed the PM validation checklist, include summary results here.
This helps track what has been validated and what may need attention.
-->

**Checklist Completed:** [Yes/No]
**Date Completed:** YYYY-MM-DD
**Completed By:** [PM Name]

### Key Validations

- [ ] Goals clearly articulated and measurable
- [ ] Requirements are testable and unambiguous
- [ ] Acceptance criteria define clear success states
- [ ] Epic breakdown is appropriately sized
- [ ] User stories follow proper format
- [ ] Technical assumptions documented
- [ ] Dependencies and constraints identified
- [ ] Resources and timeline discussed

### Issues or Gaps

<!-- List any issues discovered during validation that need resolution -->

- [Issue 1 - recommend resolution]
- [Issue 2 - recommend resolution]

---

## Next Steps

### UX Expert Prompt

<!-- Provide context for UX expert to begin design work.
Include key considerations: target users, primary workflows, success metrics.
-->

**Input for UX/UI Team:**

Expand the UI Design Goals section with detailed wireframes and prototypes covering:
- [Primary workflow screens]
- [Complex interactions]
- [Responsive design considerations]

Key considerations:
- [User persona 1 and their needs]
- [User persona 2 and their needs]
- [Performance or accessibility constraints]

### Architect Prompt

<!-- Provide context for architect/tech lead to begin technical design.
Include key technical requirements: technology stack, performance targets, security needs.
-->

**Input for Architecture/Tech Lead Team:**

Create a detailed architecture document covering:
- Component structure and technology stack
- Data flow and API contracts
- Security architecture
- Performance optimization strategies
- Testing strategy

Key technical drivers:
- [Performance requirement and impact]
- [Scalability need]
- [Integration complexity]

Reference this PRD sections:
- Requirements: [Link to section]
- Technical Assumptions: [Link to section]

---

## Cross-References

<!-- Link to related documentation for context and traceability -->

- **Example PRD:** [docs/architecture/prd.md](../architecture/prd.md)
- **Architecture Documentation:** [Link to relevant architecture docs]
- **Feature Documentation:** [Link to feature-specific docs if applicable]
- **Related ADRs:** [Link to architectural decision records]
- **Issue Tracking:** [Link to GitHub issue or project board]

---

**Document Status:** [DRAFT | IN REVIEW | APPROVED | PUBLISHED]
**Last Updated:** YYYY-MM-DD by [Author Name]
