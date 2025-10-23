---
title: "Guides & Tutorials"
description: "How-to guides, tutorials, and operational procedures"
keywords: [guides, tutorials, how-to, operations, procedures, developer-tools]
last_updated: "2025-01-22"
---

# Guides & Tutorials

This folder contains step-by-step how-to guides, tutorials, and operational procedures for working with the Content Manager Express platform.

## Purpose

The guides documentation provides practical, actionable information for:

- **Step-by-step how-to guides** for common development tasks
- **Tutorials** for learning key concepts and workflows
- **Operational procedures** for deployment, monitoring, and troubleshooting
- **Development workflow documentation** for contributing to the codebase

## Guide Categories

Guides are organized into the following categories:

### Getting Started

- Development environment setup
- First-time contributor guide
- Understanding the monorepo structure

### Development Workflows

- Creating a new feature
- Adding a new package
- Working with worktrees
- Running tests (TDD workflow)

### Deployment & Operations

- **Laravel Forge deployment** - See [forge-cli-setup.md](/docs/guides/deployment/forge-cli-setup.md)
- Environment configuration
- CI/CD pipeline
- Monitoring and logging

### Troubleshooting

- Common errors and solutions
- Port conflicts
- Database connection issues
- Build failures

## Existing Guides

The following guides are currently available:

### Developer Tools

- **[Developer Tools Overview](/docs/guides/developer-tools/)** - Comprehensive guide to development tools, validation, testing, logging, and workflows
  - **[Quick Reference](/docs/guides/developer-tools/quick-reference.md)** - Fast command lookup and decision trees
  - **[Validation Tools](/docs/guides/developer-tools/validation-tools.md)** - brain-monitor, testing, linting, and type checking
  - **[Development Workflows](/docs/guides/developer-tools/development-workflow.md)** - Common development patterns and workflows
  - **[Logging & Debugging](/docs/guides/developer-tools/logging-debugging.md)** - @kit/logger, log monitoring, and debugging strategies
  - **[Code Generation](/docs/guides/developer-tools/code-generation.md)** - Package generators and templates
  - **[Environment Management](/docs/guides/developer-tools/environment-management.md)** - @kit/env-loader and environment setup
  - **[Monorepo Tools](/docs/guides/developer-tools/monorepo-tools.md)** - Turbo, pnpm workspaces, and monorepo management
  - **[Troubleshooting](/docs/guides/developer-tools/troubleshooting.md)** - Common issues and solutions

### Deployment & Operations

- **[forge-cli-setup.md](/docs/guides/deployment/forge-cli-setup.md)** - Laravel Forge CLI setup and usage guide
  - Prerequisites and installation steps
  - Authentication with Forge API
  - Common commands for server and site management
  - CI/CD integration examples

### Plugin Development

- **[plugin-development.md](/docs/guides/plugin-development.md)** - Complete guide for creating plugins using the plugin generator (`pnpm gen:library`)
  - Quick start with step-by-step generator usage
  - Generated files and plugin structure requirements
  - Post-generation development workflow
  - Redux state management and component patterns
  - Testing, troubleshooting, and best practices

## Planned Guides

The following guides are planned for creation in subsequent phases:

- **`getting-started.md`** - Quick start guide for new developers
- **`creating-features.md`** - How to create a new feature following TDD workflow
- **`testing-guide.md`** - Comprehensive testing guide (unit, integration, e2e)
- **`deployment-guide.md`** - Complete deployment procedures and best practices
- **`troubleshooting.md`** - Common issues and solutions with debugging steps

## Guide Standards

When writing guides:

1. **Use step-by-step format** - Clear numbered steps for procedures
2. **Include code examples** - Provide command snippets and code samples
3. **Add prerequisites section** - List required tools, permissions, or setup
4. **Include troubleshooting** - Add a troubleshooting section at the end
5. **Use YAML frontmatter** - Include proper frontmatter in all guide documents
6. **Keep focused** - Each guide should cover a single task or topic

## For AI Agents

When helping users with common tasks, AI agents should:

1. **Reference existing guides** when answering questions about covered topics
2. **Update guides** when procedures or commands change
3. **Create new guides** for frequently asked questions or common problems
4. **Keep command examples up-to-date** - Verify commands work with current setup
5. **Link to related guides** - Cross-reference guides for related topics

## Related Documentation

- **Root README**: [README.md](/README.md) - Monorepo overview and getting started
- **Development Standards**: [AGENTS.md](/AGENTS.md) - Development standards and workflow
- **Architecture Documentation**: [/docs/architecture/](/docs/architecture/) - System understanding
- **Feature Documentation**: [/docs/features/](/docs/features/) - Feature-specific documentation

---

**Note**: This folder will be expanded with additional guides as common questions and procedures are identified. Check the [maintenance documentation](/docs/maintenance/) for templates and standards for creating new guides.
