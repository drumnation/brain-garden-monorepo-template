---
title: "Documentation Maintenance"
description: "Templates, standards, and agent instructions for documentation"
keywords: [maintenance, templates, standards, agents, documentation]
last_updated: "2025-10-21"
---

# Documentation Maintenance

This folder contains resources for maintaining consistent, high-quality documentation across the Content Manager Express monorepo.

## Purpose

The maintenance documentation provides:

- **Documentation templates** for consistency across all documentation types
- **Documentation standards** and style guide for formatting and conventions
- **Instructions for AI agents** on how to maintain documentation
- **Guidelines** for keeping documentation synchronized with code

## Contents

The maintenance folder is organized into the following sections:

### Agent Instructions

- **`AGENT_INSTRUCTIONS.md`** - Comprehensive guide for AI agents on maintaining documentation
  - Guidelines for updating architecture docs when system changes
  - Guidelines for creating feature docs for new features
  - Guidelines for maintaining the root index
  - Instructions for using templates effectively
  - Documentation update triggers and checklists
  - BMAD method agent coordination patterns
  - Best practices for documentation maintenance

### Documentation Standards

- **`DOCUMENTATION_STANDARDS.md`** - Style guide and conventions for all CME documentation
  - YAML frontmatter requirements and field specifications
  - Markdown formatting standards (headings, lists, emphasis, code)
  - Link formatting conventions (internal, external, code references)
  - Code snippet formatting with language identifiers
  - Mermaid diagram standards and best practices
  - Table formatting guidelines
  - File naming conventions
  - Writing style guidelines (tone, clarity, consistency)
  - Validation and quality checks

### Templates

- **`templates/feature-template/`** - Complete template for feature documentation
  - `README.md` - Feature overview and navigation
  - `requirements.md` - Functional/non-functional requirements
  - `architecture.md` - Technical design and implementation
  - `api.md` - API endpoints and contracts
  - `testing.md` - Test strategy and test cases
- **`templates/prd-template.md`** - BMAD-style PRD template
- **`templates/architecture-template.md`** - Architecture document template
- **`templates/adr-template.md`** - Architecture Decision Record template

## Documentation Hierarchy

Content Manager Express follows a three-tier documentation hierarchy as defined in [AGENTS.md](/AGENTS.md):

1. **Package-level** (`packages/[name]/docs/`) - Implementation details specific to a package
2. **Feature-level** (`/docs/features/[name]/`) - Cross-package feature documentation
3. **Global** (`/docs/architecture/`) - System-wide architectural documentation

This hierarchy ensures documentation is placed at the appropriate level of abstraction and avoids duplication.

## YAML Frontmatter Standard

All markdown documentation files in the CME monorepo must include YAML frontmatter with the following structure:

```yaml
---
title: "Document Title"
description: "Brief description of the document content"
keywords: [keyword1, keyword2, keyword3]
last_updated: "YYYY-MM-DD"
---
```

**Field Descriptions:**

- **`title`** - Human-readable title of the document
- **`description`** - One or two sentence description of what the document covers
- **`keywords`** - Array of relevant keywords for searching and categorization
- **`last_updated`** - Date in YYYY-MM-DD format when the document was last modified

## Documentation Update Triggers

Documentation should be updated in the following scenarios:

- **Adding new features** → Create feature documentation in `/docs/features/[feature-name]/`
- **Modifying architecture** → Update relevant architecture docs in `/docs/architecture/`
- **Adding API endpoints** → Update `api.md` files in feature documentation
- **Changing deployment process** → Update guides in `/docs/guides/deployment/`
- **Making architectural decisions** → Create Architecture Decision Record (ADR)

## Using the Feature Template

**To Document a New Feature:**

1. Copy the entire `templates/feature-template/` folder to `/docs/features/[feature-name]/`
2. Replace all `[PLACEHOLDER]` text with actual content
3. Update YAML frontmatter in all files with appropriate values
4. Fill in all sections completely
5. Link to actual code locations using absolute paths
6. Remove instruction blocks from template files
7. Update `/docs/features/FEATURE_MAP.md` with the new feature
8. Update `/docs/features/README.md` if needed

**Example Implementation:**

See `/docs/features/authentication/` for a complete example of the feature template in use.

**Template Files:**
- `README.md` - Feature overview, code locations, quick links
- `requirements.md` - Functional requirements, user stories, acceptance criteria
- `architecture.md` - Technical design, component diagrams, data flow
- `api.md` - API endpoints, request/response examples, error codes
- `testing.md` - Test strategy, test cases, test data

## For AI Agents

AI agents working on the CME codebase should:

1. **Read `AGENT_INSTRUCTIONS.md`** before making documentation changes for comprehensive guidance
2. **Follow `DOCUMENTATION_STANDARDS.md`** for formatting and style consistency
3. **Use templates** from `templates/` for consistency when creating new documentation
4. **Update root index** (`/docs/README.md`) when adding new major documentation sections
5. **Keep dates current** - Update `last_updated` in YAML frontmatter when modifying documents
6. **Link correctly** - Use absolute paths from repository root for all internal links
7. **Use the feature template** in `templates/feature-template/` when creating new feature documentation
8. **Reference the authentication feature** (`/docs/features/authentication/`) as an example

## BMAD Method Reference

Architecture documentation should follow BMAD method patterns:

- **Repository**: https://github.com/bmad-code-org/BMAD-METHOD
- **Key Concepts**:
  - Multi-file architecture strategy
  - Structured PRD format
  - Agent coordination patterns
- **Application**: Use BMAD patterns for PRDs, system design, and architectural planning

## Related Documentation

- **Development Standards**: [AGENTS.md](/AGENTS.md) - Complete development rules and standards
- **Root Documentation Index**: [/docs/README.md](/docs/README.md) - Central documentation hub
- **Architecture Documentation**: [/docs/architecture/](/docs/architecture/) - Examples of architecture documentation

---

**Note**: The maintenance documentation is now complete with comprehensive agent instructions, documentation standards, and templates. All resources are ready for use in maintaining high-quality documentation across the CME monorepo.
