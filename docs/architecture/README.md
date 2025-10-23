---
title: "Architecture Documentation"
description: "System-wide architecture templates and documentation"
keywords: [architecture, system-design, templates, technical-specs]
last_updated: "2025-10-23"
---

# Architecture Documentation

> **⚠️ IMPORTANT: TEMPLATES ONLY ⚠️**  
> The files in this folder are currently **TEMPLATES** for architecture documentation.
> They are NOT actual project documentation yet.
> Use these templates to create your own architecture documentation.

## Purpose

The architecture documentation provides a comprehensive view of the system, including:

- **System architecture templates** covering frontend, backend, database, and infrastructure
- **Architecture Decision Records (ADRs)** for documenting significant architectural choices
- **Cross-cutting technical concerns** such as security, performance, and scalability
- **Product Requirements Document (PRD)** template for documenting features and requirements

## Available Templates

The following architecture documentation templates are available:

### Core Architecture Templates

| Template | File | Purpose |
|----------|------|---------|
| **System Overview** | [system-overview.md](./system-overview.md) | High-level system architecture and component relationships |
| **Backend Architecture** | [backend.md](./backend.md) | Backend server architecture, API design, middleware, services |
| **Frontend Architecture** | [frontend.md](./frontend.md) | Frontend architecture, components, state management, routing |
| **Database Architecture** | [database.md](./database.md) | Database schema, migrations, query patterns, data access |
| **Infrastructure** | [infrastructure.md](./infrastructure.md) | Deployment, CI/CD, monitoring, infrastructure setup |
| **Security Architecture** | [security.md](./security.md) | Authentication, authorization, security best practices |
| **Product Requirements** | [prd.md](./prd.md) | Product requirements document template |

### Architecture Decision Records

The **[decisions/](./decisions/)** directory contains templates and guidance for creating Architecture Decision Records (ADRs).

ADRs document significant architectural decisions with their context, rationale, and consequences. See [decisions/README.md](./decisions/README.md) for more information.

## How to Use These Templates

1. **Choose a template** that matches the documentation you need to create
2. **Copy the template** and rename it if needed (or edit in place)
3. **Replace all bracketed placeholders** `[like this]` with your actual information
4. **Remove the warning notice** at the top when you convert it to real documentation
5. **Update the frontmatter** (especially `status` and `last_updated`)
6. **Add sections** specific to your project needs
7. **Remove sections** that don't apply
8. **Include code examples** from your actual codebase
9. **Add diagrams** if they help explain the architecture

## Documentation Standards

When creating architecture documentation from these templates:

- **Include YAML frontmatter** with title, description, keywords, and last_updated date
- **Use clear section headings** for easy navigation
- **Link to actual code** using file paths with line numbers when referencing implementation
- **Include diagrams** (Mermaid, PlantUML, or images) for visual clarity
- **Cross-reference** related documents
- **Keep documentation updated** as the system evolves
- **Use code examples** to illustrate patterns and implementations

## Template Features

Each template includes:

- **⚠️ Warning notice** indicating it's a template (remove when converting to real docs)
- **Section structure** with common patterns for that type of documentation
- **Placeholder text** in `[brackets]` to replace with actual content
- **Examples** of what to include in each section
- **Instructions** at the bottom for completing the template
- **Cross-reference sections** for linking related documentation

## For AI Agents

When working on this codebase as an AI agent:

1. **Recognize these are templates** - Don't treat template content as actual project documentation
2. **When creating architecture docs**, use these templates as a starting point
3. **Fill in real information** - Replace all placeholders with actual project details
4. **Remove template warnings** when converting to real documentation
5. **Update this README** when you add new architecture documentation
6. **Reference architecture docs** in code comments when implementing significant design choices
7. **Keep documentation synchronized** with code changes

## Converting Templates to Documentation

When you're ready to convert a template to real documentation:

1. ✅ Replace the warning notice with actual overview content
2. ✅ Fill in all `[placeholder]` text with real information
3. ✅ Update the frontmatter `status` field to remove "TEMPLATE" designation
4. ✅ Update `last_updated` date
5. ✅ Remove template instructions section at the bottom
6. ✅ Add actual code examples from your codebase
7. ✅ Include real file paths and line number references
8. ✅ Add diagrams specific to your architecture
9. ✅ Update this README to indicate the file is no longer a template

## Related Documentation

- **Maintenance Documentation**: [/docs/maintenance/](/docs/maintenance/) - Documentation standards and templates
- **Developer Guides**: [/docs/guides/](/docs/guides/) - Development workflow and tools
- **Features Documentation**: [/docs/features/](/docs/features/) - Feature-specific documentation
- **Root Documentation**: [/docs/README.md](/docs/README.md) - Central documentation hub

## Template Maintenance

These templates are maintained to reflect best practices in architecture documentation. If you find improvements or missing sections:

1. Update the template to be more helpful
2. Document the change in this README
3. Consider if other templates need similar updates
4. Keep templates generic and broadly applicable

---

**Note**: This folder currently contains **templates only**. Once you create actual architecture documentation, update this README to reflect which files are real documentation vs. templates.

**Last Updated**: 2025-10-23  
**Status**: Templates ready for use
