<!--
ADR Template (MADR Format)

Instructions:
1. Copy this template to create a new ADR
2. Assign the next sequential ADR number (ADR-NNN)
3. Replace all [PLACEHOLDER] text with actual content
4. Update the filename: ADR-NNN-short-descriptive-title.md
5. Fill in all sections completely
6. Update /docs/architecture/decisions/README.md index
7. Remove this instruction block when done

Reference: MADR (Markdown Architecture Decision Records)
- https://adr.github.io/madr/
- https://adr.github.io/
-->

# ADR-NNN: [Short Descriptive Title]

- **Status:** [proposed | accepted | rejected | superseded by ADR-XXX]
- **Date:** YYYY-MM-DD
- **Deciders:** [Names or roles of decision makers, e.g., "Tech Lead, Product Manager, Senior Engineer"]
- **Tags:** [Optional: technology, domain, category - e.g., "frontend, performance, testing"]

---

## Context and Problem Statement

<!-- Describe the problem that necessitates this decision.
- What problem are we trying to solve?
- Why is this decision important?
- What is the scope of the decision?
- What constraints do we face?

Be specific and provide context that helps future readers understand why this decision was necessary.
Example: "The frontend currently uses inline styling, making it difficult to maintain consistent themes across components. We need a solution that allows runtime theme switching while keeping CSS bundles small."
-->

[Explain the problem and why this decision is necessary]

[Describe the scope and constraints]

[Explain why this decision is important to the project]

---

## Decision Drivers

<!-- List the key forces or requirements that drive this decision.
These are the "why" behind the decision - business requirements, technical constraints, team capabilities, etc.

Format: "- **[Title]**: [Description]"
Examples:
- **Performance**: Need sub-100ms theme switching
- **Maintainability**: Team has limited CSS expertise
- **Budget**: Limited time for implementation
- **Integration**: Must work with existing Redux state management
-->

- **[Driver 1 - e.g., Performance]**: [Description and importance]
- **[Driver 2 - e.g., Team Capability]**: [Description and importance]
- **[Driver 3 - e.g., Technical Constraint]**: [Description and importance]
- **[Driver 4 - e.g., Business Requirement]**: [Description and importance]

---

## Considered Options

<!-- List all serious options that were considered.
For each option, provide 1-2 sentence description.
Save detailed pros/cons for the next section.

Format: "- **Option [X]: [Name]** - [Brief description]"
Examples:
- **Option A: CSS Modules** - Scope CSS to components...
- **Option B: styled-components** - CSS-in-JS with dynamic styling...
- **Option C: Tailwind CSS** - Utility-first CSS framework...
- **Option D: CSS Variables** - Native CSS custom properties...
-->

- **Option A: [Name]** - [One or two sentence description of the approach]

- **Option B: [Name]** - [One or two sentence description of the approach]

- **Option C: [Name]** - [One or two sentence description of the approach]

- **Option D: [Name]** - [One or two sentence description of the approach]

---

## Decision Outcome

<!-- State which option was chosen and explain why.
Include any key trade-offs accepted by making this choice.

Example:
"Chosen option: **Option B: styled-components**

We chose styled-components because it allows runtime theme switching with minimal performance impact and integrates seamlessly with Redux. The CSS-in-JS approach lets us manage theme state alongside other application state. We accept the trade-off of slightly larger JavaScript bundle size for the benefit of consistency and developer experience."
-->

**Chosen option:** "[Option X: Name]"

**Rationale:**
[Explain why this option was chosen over others]

[Explain alignment with decision drivers]

**Key Trade-offs Accepted:**
- [Trade-off 1: What we gain vs what we lose]
- [Trade-off 2: What we gain vs what we lose]

---

## Pros and Cons of the Options

<!-- Detailed pros and cons for each option considered.
This section helps future readers understand the decision reasoning and what alternatives were rejected and why.

Format for each option:
### Option [X]: [Name]

**Pros:**
- [Advantage 1]
- [Advantage 2]
- [Advantage 3]

**Cons:**
- [Disadvantage 1]
- [Disadvantage 2]
- [Disadvantage 3]
-->

### Option A: [Name]

**Pros:**
- [Advantage 1 with explanation]
- [Advantage 2 with explanation]
- [Advantage 3 with explanation]

**Cons:**
- [Disadvantage 1 with explanation]
- [Disadvantage 2 with explanation]

### Option B: [Name]

**Pros:**
- [Advantage 1 with explanation]
- [Advantage 2 with explanation]

**Cons:**
- [Disadvantage 1 with explanation]
- [Disadvantage 2 with explanation]
- [Disadvantage 3 with explanation]

### Option C: [Name]

**Pros:**
- [Advantage 1 with explanation]
- [Advantage 2 with explanation]

**Cons:**
- [Disadvantage 1 with explanation]
- [Disadvantage 2 with explanation]

---

## Consequences

### Positive Consequences

<!-- List the benefits or positive outcomes of this decision -->

- [Benefit 1 - what improvement this enables]
- [Benefit 2 - what improvement this enables]
- [Benefit 3 - what improvement this enables]

### Negative Consequences

<!-- List the costs, risks, or negative impacts of this decision -->

- [Cost or risk 1 - what we may need to manage]
- [Cost or risk 2 - what we may need to manage]

### Neutral Consequences

<!-- List impacts that are neither clearly positive nor negative -->

- [Impact 1 - context on how this affects the system]
- [Impact 2 - context on how this affects the system]

### Follow-on Decisions Required

<!-- List any decisions that must be made after this one -->

- **[Decision 1]**: [What needs to be decided and why]
- **[Decision 2]**: [What needs to be decided and why]

---

## Implementation Notes

<!-- OPTIONAL - Include if this decision requires implementation guidance

Provide practical implementation details:
- How to implement this decision
- Migration strategy if replacing existing solution
- Rollout plan
- Timeline
- Dependencies
- Team responsibilities
-->

### Migration Strategy

<!-- If this replaces an existing solution, how do we migrate? -->

[Describe the approach to transitioning to this decision]

### Rollout Plan

<!-- How will this be deployed? Phased or all at once? -->

1. [Phase 1 - what happens first]
2. [Phase 2 - what happens next]
3. [Phase 3 - completion]

### Timeline

<!-- Estimated timeline for implementation -->

- **Planning & Setup:** [Duration]
- **Development:** [Duration]
- **Testing:** [Duration]
- **Rollout:** [Duration]
- **Stabilization:** [Duration]

### Dependencies

<!-- What must happen before this can be implemented -->

- [Dependency 1 - what is required]
- [Dependency 2 - what is required]

### Team Responsibilities

<!-- Who is responsible for what -->

- **[Team/Person 1]**: [Responsibility]
- **[Team/Person 2]**: [Responsibility]

---

## Links

### Related ADRs

<!-- Link to related architectural decisions -->

- [ADR-XXX: Related Decision Title](./ADR-XXX-title.md) - [Relationship description]
- [ADR-YYY: Related Decision Title](./ADR-YYY-title.md) - [Relationship description]

### GitHub Issues

<!-- Link to GitHub issues or discussions related to this decision -->

- [#123 - Issue Title](https://github.com/[org]/[repo]/issues/123)
- [#456 - Issue Title](https://github.com/[org]/[repo]/issues/456)

### Pull Requests

<!-- Link to PRs implementing this decision -->

- [#789 - Implementation PR Title](https://github.com/[org]/[repo]/pull/789)

### External References

<!-- Link to external documentation, standards, or references -->

- [MADR Documentation](https://adr.github.io/madr/) - Reference guide for writing ADRs
- [ADR.github.io](https://adr.github.io/) - Best practices for Architectural Decision Records
- [Technology Documentation](https://example.com/docs) - External reference relevant to this decision
- [Architecture Pattern Reference](https://example.com/patterns) - Related architectural patterns

### Architecture Documentation

<!-- Link to architecture docs that are affected or related to this decision -->

- [System Overview](../system-overview.md) - High-level architecture overview
- [Component Architecture](../frontend.md) - Detailed architecture of affected component
- [API Specification](../backend.md) - Related API or backend changes

---

## Notes

<!-- Additional context or notes that don't fit into other sections -->

[Any additional context or clarifications]

---

**Document Status:** [DRAFT | IN REVIEW | ACCEPTED | IMPLEMENTED | SUPERSEDED]
**Last Updated:** YYYY-MM-DD by [Author Name]
**Review Date:** [When this ADR should be reviewed again, if applicable]

---

## References

For guidance on writing Architecture Decision Records, see:
- **MADR Format:** https://adr.github.io/madr/ - Template and best practices
- **ADR Best Practices:** https://adr.github.io/ - General guidance on ADRs
- **Example ADRs in this repository:** [Link to other ADRs in /docs/architecture/decisions/]
