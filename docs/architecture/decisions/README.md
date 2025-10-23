---
title: "Architecture Decision Records (ADRs)"
description: "Index of architectural decisions for the CME project"
keywords: [adr, decisions, architecture, design]
last_updated: "2025-10-21"
---

# Architecture Decision Records (ADRs)

## Purpose

Architecture Decision Records (ADRs) are a critical component of this project's technical documentation. They serve to:

- **Document significant architectural decisions** made throughout the project lifecycle
- **Provide context, rationale, and consequences** for each decision to help current and future team members understand the reasoning behind choices
- **Create a historical record** that captures the evolution of the system architecture over time
- **Help new team members** quickly understand why decisions were made, reducing ramp-up time and preventing the re-litigation of settled questions

ADRs are lightweight documents that capture the key information about important architectural choices without creating excessive documentation overhead.

## ADR Format

This project uses the **MADR (Markdown Architectural Decision Records)** format for all ADRs. MADR provides a structured yet flexible template that balances completeness with ease of use.

Each ADR follows a consistent template that includes:
- Decision metadata (title, status, date, deciders)
- Context and problem statement
- Considered options
- Decision outcome with rationale
- Consequences (positive, negative, neutral)
- Links to related decisions and resources

For the complete template, see: [`adr-template.md`](../../maintenance/templates/adr-template.md)

ADRs are numbered sequentially using the format: `ADR-001-title.md`, `ADR-002-title.md`, etc.

## ADR Lifecycle

Each ADR has a lifecycle status that indicates its current state:

- **Proposed:** The decision is under consideration and has not yet been finalized. Team members can review and provide feedback.
- **Accepted:** The decision has been approved and is being implemented or has been implemented.
- **Rejected:** The decision was considered but ultimately not adopted. The ADR remains for historical context.
- **Superseded:** The decision has been replaced by a newer ADR. The superseded ADR should reference the ADR that replaces it.

ADRs should never be deleted, as they provide valuable historical context even when superseded or rejected.

## When to Create an ADR

Create an ADR when you need to make decisions about:

- **Significant technology choices:** Selection of frameworks, libraries, databases, or other foundational technologies
- **Architectural patterns and design decisions:** Choices about system structure, communication patterns, or design principles
- **Changes to system structure or organization:** Modifications to the monorepo structure, module boundaries, or deployment architecture
- **Security or performance trade-offs:** Decisions that balance security, performance, maintainability, or other quality attributes
- **Breaking changes to APIs or interfaces:** Changes that affect contracts between system components or external integrations
- **Migration strategies:** Plans for evolving from one architecture or technology to another

Not every decision requires an ADR. Use your judgment: if a decision will have lasting impact and others would benefit from understanding the reasoning, it deserves an ADR.

## ADR Naming Convention

ADRs follow a strict naming convention to ensure consistency and easy reference:

**Format:** `ADR-NNN-short-descriptive-title.md`

- **NNN:** Three-digit sequential number (001, 002, 003, ...)
- **Title:** Lowercase with hyphens, descriptive but concise

**Examples:**
- `ADR-001-use-pnpm-workspaces.md`
- `ADR-002-adopt-turborepo.md`
- `ADR-003-esm-only-architecture.md`

The number should be assigned sequentially based on when the ADR is created, not when the decision was originally made (important for retroactive ADRs).

## Creating a New ADR

Follow these steps to create a new ADR:

1. **Copy the template** from [`adr-template.md`](../../maintenance/templates/adr-template.md)
2. **Assign the next sequential number** by checking the current ADR index below
3. **Fill in all sections** with relevant information, following the MADR format precisely
4. **Include links** to related ADRs, GitHub issues, pull requests, or other relevant resources
5. **Update this README** by adding the new ADR to the index table below
6. **Follow MADR format** to ensure consistency across all decision records

## ADR Index

This table provides a quick reference to all architectural decisions. ADRs are listed in chronological order by number.

| Number | Title | Status | Date | Summary |
|--------|-------|--------|------|----------|
| _No ADRs created yet_ | | | | |

## Retroactive ADRs

Many significant architectural decisions were made before the ADR process was established. We recommend creating retroactive ADRs to document these existing decisions, which will help:

- Provide context for current architecture
- Explain why certain patterns or technologies are in use
- Guide future decisions that build on or modify existing choices

**Suggested retroactive ADRs to create:**

1. **ADR-001:** Use pnpm workspaces for monorepo management
2. **ADR-002:** Adopt Turborepo for build orchestration
3. **ADR-003:** ESM-only architecture (no CommonJS)
4. **ADR-004:** Export TypeScript source directly (no build for libraries)
5. **ADR-005:** Functional DI pattern for backend services
6. **ADR-006:** Redux Toolkit for state management
7. **ADR-007:** CM proxy architecture for legacy integration
8. **ADR-008:** Plugin-based extensibility
9. **ADR-009:** Migrate from AWS ECS to Laravel Forge
10. **ADR-010:** Brain monitor for validation orchestration

These can be created over time as needed, prioritizing those that are most relevant to current work.

## For AI Agents

When working on this codebase as an AI agent, follow these guidelines regarding ADRs:

- **When making architectural decisions,** create an ADR to document the decision, even if you're implementing it immediately
- **Update this README index** whenever you add a new ADR to keep the index current
- **Reference related ADRs** in architecture documentation to provide context and traceability
- **Link to ADRs from code comments** when implementing significant design choices that warrant explanation
- **Keep ADRs up-to-date** when decisions are superseded, updating both the old ADR (mark as superseded) and creating the new one

ADRs are a collaboration tool between human developers and AI agents, ensuring decisions are transparent and traceable.

## Related Documentation

- [ADR Template](../../maintenance/templates/adr-template.md) - Template for creating new ADRs
- [Architecture Documentation](../) - Overall system architecture documentation
- [Agent Instructions](../../maintenance/AGENT_INSTRUCTIONS.md) _(to be created)_ - Guidelines for AI agents
- [MADR Documentation](https://adr.github.io/madr/) - Official MADR format documentation
- [ADR GitHub Organization](https://adr.github.io/) - Community resources and best practices for ADRs
