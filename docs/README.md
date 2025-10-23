---
title: "Content Manager Express - Documentation"
description: "Central documentation hub for the CME monorepo"
keywords: [documentation, monorepo, architecture, features, guides, developer-tools]
last_updated: "2025-10-22"
---

# Content Manager Express - Documentation

Welcome to the central documentation hub for the Content Manager Express monorepo. This documentation provides comprehensive guidance for developers, AI agents, and team members working on the CME platform.

## Overview

Content Manager Express is a modern digital signage content management system built as a TypeScript monorepo. This documentation is organized into four main sections to help you navigate the codebase, understand the architecture, and contribute effectively.

## Quick Links

| Section | Description | Path |
|---------|-------------|------|
| **Architecture** | System design, PRDs, and technical architecture | [/docs/architecture/](/docs/architecture/) |
| **Features** | Feature-specific documentation organized by domain | [/docs/features/](/docs/features/) |
| **Guides** | How-to guides, tutorials, and operational procedures | [/docs/guides/](/docs/guides/) |
| **Developer Tools** | Comprehensive guide to development tools and workflows | [/docs/guides/developer-tools/](/docs/guides/developer-tools/) |
| **Maintenance** | Templates, standards, and agent instructions | [/docs/maintenance/](/docs/maintenance/) |
| **Audit Report** | Documentation completeness audit and metrics | [/docs/DOCUMENTATION_AUDIT_REPORT.md](/docs/DOCUMENTATION_AUDIT_REPORT.md) |
| **Post-Merge Tasks** | Tracking for remaining documentation work | [/docs/POST_MERGE_TASKS.md](/docs/POST_MERGE_TASKS.md) |

## Architecture Documentation

Comprehensive technical architecture documentation for the CME platform:

| Document | Description |
|----------|-------------|
| **[System Overview](/docs/architecture/system-overview.md)** | Complete monorepo architecture map including apps, packages, services, tooling, request flow, data storage strategy, and build pipeline |
| **[Frontend Architecture](/docs/architecture/frontend.md)** | React 18.3 application structure, Redux Toolkit state management, component architecture (atomic design), routing, plugin system, i18n (19 languages), and styling with styled-components |
| **[Backend Architecture](/docs/architecture/backend.md)** | Express 4.18 server structure, CM proxy service, authentication middleware, functional DI pattern, API design, and service layer |
| **[Database Architecture](/docs/architecture/database.md)** | PostgreSQL schema, hybrid storage strategy (local + CM API), connection pooling, query patterns, and data access layer |
| **[Infrastructure](/docs/architecture/infrastructure.md)** | Laravel Forge deployment, CI/CD pipelines (GitHub Actions), environment configuration, worktree setup with auto-generated ports, and monitoring |
| **[Security](/docs/architecture/security.md)** | Authentication (token-based), authorization (RBAC), permission model, credential management, and security best practices |

For architectural decisions and their rationale, see [Architecture Decision Records (ADRs)](/docs/architecture/decisions/).

## Documentation Standards

All documentation in this repository follows strict standards for consistency and maintainability:

- **Development Rules**: See [AGENTS.md](/AGENTS.md) for complete development standards
- **Documentation Standards**: See [/docs/maintenance/DOCUMENTATION_STANDARDS.md](/docs/maintenance/DOCUMENTATION_STANDARDS.md) for style guide and conventions
- **YAML Frontmatter**: All markdown files include frontmatter with title, description, keywords, and last_updated date

## For AI Agents

If you're an AI agent working on this codebase:

1. **Navigate Features**: **START WITH** [Feature Map](/docs/features/FEATURE_MAP.md) to understand which packages/apps contain which features
2. **Agent Instructions**: Read [/docs/maintenance/AGENT_INSTRUCTIONS.md](/docs/maintenance/AGENT_INSTRUCTIONS.md) for documentation maintenance guidelines
3. **Understand the System**: Review [/docs/architecture/](/docs/architecture/) for system-wide architecture (start with [System Overview](/docs/architecture/system-overview.md))
4. **Follow Standards**: Adhere to [AGENTS.md](/AGENTS.md) for all development work
5. **Use Developer Tools**: Reference [/docs/guides/developer-tools/](/docs/guides/developer-tools/) for validation, testing, logging, and workflow guidance
6. **Use Templates**: Reference [/docs/maintenance/templates/](/docs/maintenance/templates/) for consistent documentation

### 📊 Documentation Completeness Status

Current documentation coverage as of 2025-10-22:
- **Package Documentation**: 100% complete (24/24 packages with README + CHANGELOG)
- **Feature Documentation**: 53% complete (8/15 implemented features)
- **Infrastructure**: 100% complete (agent instructions, rules system, templates)

For detailed audit results, see [Documentation Audit Report](/docs/DOCUMENTATION_AUDIT_REPORT.md).
For remaining work, see [Post-Merge Tasks](/docs/POST_MERGE_TASKS.md).

### 🗺️ Feature Navigation for Agents

**Most Important:** The [Feature Map](/docs/features/FEATURE_MAP.md) is your primary navigation tool in this monorepo. It maps features to packages and apps, showing you exactly where to find code for:
- Authentication, Permissions, Roles
- Admin UI, Navigation, Plugin System
- i18n, State Management, UI Components
- Planned features (Messages, Templates, Media, Approval Workflow)

## Getting Started

New to the project? Start with these resources:

- **Monorepo Setup**: [Root README.md](/README.md) - Installation, environment setup, and running the development environment
- **System Architecture**: [System Overview](/docs/architecture/system-overview.md) - High-level architecture and monorepo structure
- **Development Standards**: [AGENTS.md](/AGENTS.md) - Complete development rules for the entire monorepo
- **Developer Tools**: [/docs/guides/developer-tools/](/docs/guides/developer-tools/) - Comprehensive guide to validation, testing, logging, and development workflows
- **Operational Guides**: [/docs/guides/](/docs/guides/) - Step-by-step how-to guides for common tasks
- **Technology Stack**: See [README.md#technology-stack](/README.md#technology-stack) for frontend, backend, and tooling details

## Project-Specific Documentation

- **CME Project Documentation**: [/docs/cme/](/docs/cme/) - Project-specific analysis, readiness assessments, and MVP planning

## Contributing

When contributing to this documentation:

1. **Follow the Hierarchy**: Use the three-tier documentation hierarchy (package → feature → global) as defined in [AGENTS.md](/AGENTS.md)
2. **Include Frontmatter**: All markdown files must include YAML frontmatter
3. **Keep Updated**: Update the `last_updated` date when modifying documentation
4. **Link Correctly**: Use absolute paths from repository root for all internal links
5. **Use Templates**: Reference templates in [/docs/maintenance/templates/](/docs/maintenance/templates/)
6. **Follow Standards**: Adhere to [DOCUMENTATION_STANDARDS.md](/docs/maintenance/DOCUMENTATION_STANDARDS.md)

## Documentation Hierarchy

Content Manager Express follows a three-tier documentation hierarchy:

1. **Package-level** (`packages/[name]/docs/`) - Implementation details specific to a package
2. **Feature-level** (`/docs/features/[name]/`) - Cross-package feature documentation
3. **Global** (`/docs/architecture/`) - System-wide architectural documentation

This hierarchy ensures documentation is placed at the appropriate level of abstraction and avoids duplication.

---

**Need Help?** If you can't find what you're looking for, check the [Troubleshooting](/README.md#troubleshooting) section in the root README or reach out to the development team.
