---
title: "Developer Tools - Overview"
description: "Comprehensive guide to development tools in the CME monorepo"
keywords: [developer-tools, tooling, validation, testing, logging, monorepo, brain-monitor]
last_updated: "2025-01-22"
---

# Developer Tools - Overview

Comprehensive guide to the development tools ecosystem in the Content Manager Express monorepo.

## Introduction

The CME monorepo includes a rich ecosystem of developer tools designed to streamline validation, testing, logging, code generation, and workflow management. This documentation hub consolidates guidance from individual tool READMEs and provides workflow-oriented documentation for agents and developers.

## Quick Start for Agents

Most common tasks with direct links:

| Need | Documentation |
|------|---------------|
| **Fast command lookup** | [Quick Reference](/docs/guides/developer-tools/quick-reference.md) |
| **Validate code before committing** | [Validation Tools](/docs/guides/developer-tools/validation-tools.md) |
| **Debug runtime issues** | [Logging & Debugging](/docs/guides/developer-tools/logging-debugging.md) |
| **Create new package** | [Code Generation](/docs/guides/developer-tools/code-generation.md) |
| **Setup environment** | [Environment Management](/docs/guides/developer-tools/environment-management.md) |
| **Explore API documentation** | [API Documentation](/docs/guides/developer-tools/api-documentation.md) |
| **Understand workflows** | [Development Workflows](/docs/guides/developer-tools/development-workflow.md) |
| **Fix common issues** | [Troubleshooting](/docs/guides/developer-tools/troubleshooting.md) |

## Tool Categories

### Validation Tools
Quality assurance and code validation tools.

| Tool | Purpose | Documentation |
|------|---------|---------------|
| **brain-monitor** | Centralized validation orchestrator with shared reporting | [Validation Tools](/docs/guides/developer-tools/validation-tools.md#brain-monitor) |
| **@kit/testing** | Unified testing infrastructure (Vitest, Playwright) | [Validation Tools](/docs/guides/developer-tools/validation-tools.md#kittesting) |
| **ESLint** | Code quality and consistency linting | [Validation Tools](/docs/guides/developer-tools/validation-tools.md#eslint) |
| **Prettier** | Automatic code formatting | [Validation Tools](/docs/guides/developer-tools/validation-tools.md#prettier) |
| **TypeScript** | Static type checking | [Validation Tools](/docs/guides/developer-tools/validation-tools.md#typescript) |

### Development Tools
Core development and build orchestration tools.

| Tool | Purpose | Documentation |
|------|---------|---------------|
| **Turbo** | Build orchestration with intelligent caching | [Monorepo Tools](/docs/guides/developer-tools/monorepo-tools.md#turbo) |
| **pnpm Workspaces** | Monorepo package management | [Monorepo Tools](/docs/guides/developer-tools/monorepo-tools.md#pnpm-workspaces) |
| **manypkg** | Workspace package.json validation | [Monorepo Tools](/docs/guides/developer-tools/monorepo-tools.md#manypkg) |

### Code Generation
Scaffolding and template utilities.

| Tool | Purpose | Documentation |
|------|---------|---------------|
| **Package Generator** | Create new packages with consistent structure | [Code Generation](/docs/guides/developer-tools/code-generation.md#package-generator) |
| **Documentation Templates** | Feature, PRD, ADR, and architecture templates | [Code Generation](/docs/guides/developer-tools/code-generation.md#documentation-templates) |

### Logging & Debugging
Observability and debugging tools.

| Tool | Purpose | Documentation |
|------|---------|---------------|
| **@kit/logger** | Structured logging for Node.js and browser | [Logging & Debugging](/docs/guides/developer-tools/logging-debugging.md#kitlogger) |
| **brain-monitor logs** | Real-time log collection from all dev servers | [Logging & Debugging](/docs/guides/developer-tools/logging-debugging.md#brain-monitor-logs) |

### Environment Management
Configuration and environment setup tools.

| Tool | Purpose | Documentation |
|------|---------|---------------|
| **@kit/env-loader** | Environment variable management | [Environment Management](/docs/guides/developer-tools/environment-management.md#kitenv-loader) |
| **setup-env script** | Auto-configuration for ports and .env files | [Environment Management](/docs/guides/developer-tools/environment-management.md#setup-env-script) |

### API Documentation
Interactive API exploration and testing tools.

| Tool | Purpose | Documentation |
|------|---------|---------------|
| **Proxy Swagger** | Interactive docs for proxy server API | [API Documentation](/docs/guides/developer-tools/api-documentation.md#proxy-swagger) |
| **CM Swagger** | Interactive docs for Content Manager API | [API Documentation](/docs/guides/developer-tools/api-documentation.md#cm-swagger) |

## Documentation Structure

This guide is organized into focused documents following the BMAD multi-file architecture strategy:

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [quick-reference.md](/docs/guides/developer-tools/quick-reference.md) | Fast command lookup and decision trees | Need a specific command quickly |
| [validation-tools.md](/docs/guides/developer-tools/validation-tools.md) | Comprehensive validation tool guide | Understanding quality assurance tools |
| [development-workflow.md](/docs/guides/developer-tools/development-workflow.md) | Common workflows and tool integration | Learning development patterns |
| [logging-debugging.md](/docs/guides/developer-tools/logging-debugging.md) | Observability and debugging strategies | Troubleshooting runtime issues |
| [code-generation.md](/docs/guides/developer-tools/code-generation.md) | Scaffolding utilities and templates | Creating new packages or documentation |
| [environment-management.md](/docs/guides/developer-tools/environment-management.md) | Configuration and setup tools | Managing environment variables |
| [api-documentation.md](/docs/guides/developer-tools/api-documentation.md) | Dual swagger system guide | Exploring or testing API endpoints |
| [monorepo-tools.md](/docs/guides/developer-tools/monorepo-tools.md) | Workspace management tools | Understanding monorepo architecture |
| [troubleshooting.md](/docs/guides/developer-tools/troubleshooting.md) | Common issues and solutions | Fixing tool-related problems |

## Tool Status Matrix

### Available and Maintained

| Tool | Status | Recommended Use Cases |
|------|--------|----------------------|
| brain-monitor | ✅ Active | All validation workflows, watch mode development |
| @kit/logger | ✅ Active | All logging needs (Node.js and browser) |
| @kit/testing | ✅ Active | All test types (unit, integration, e2e) |
| @kit/env-loader | ✅ Active | Environment variable management |
| Turbo | ✅ Active | Build orchestration, parallel execution |
| pnpm | ✅ Active | Package management, workspace protocol |
| ESLint | ✅ Active | Code quality enforcement |
| Prettier | ✅ Active | Code formatting |
| TypeScript | ✅ Active | Static type checking |
| Proxy Swagger | ✅ Active | API exploration, endpoint testing, frontend development |
| CM Swagger | ✅ Active | CM API exploration, proxy development, integration work |

### Deprecated or Superseded

None currently. All tools listed are actively maintained.

## Getting Started

Recommended reading order for new developers and agents:

1. **Start with Quick Reference** - Get familiar with common commands
   - Read: [quick-reference.md](/docs/guides/developer-tools/quick-reference.md)
   - Focus on: Validation commands, development commands, decision trees

2. **Understand Validation Workflow** - Learn the quality assurance process
   - Read: [validation-tools.md](/docs/guides/developer-tools/validation-tools.md)
   - Focus on: brain-monitor workflow, test types, validation order

3. **Learn Development Workflows** - See how tools work together
   - Read: [development-workflow.md](/docs/guides/developer-tools/development-workflow.md)
   - Focus on: Starting development session, before committing workflow

4. **Explore Specific Tools** - Deep dive into individual tool capabilities
   - Read documentation for specific tools as needed
   - Reference individual tool READMEs in `/tooling/[tool]/README.md`

5. **Explore API Documentation** - Understand the dual swagger system
   - Read: [api-documentation.md](/docs/guides/developer-tools/api-documentation.md)
   - Focus on: Proxy vs CM swagger, when to use each, testing workflows

6. **Master Troubleshooting** - Become effective at solving common issues
   - Read: [troubleshooting.md](/docs/guides/developer-tools/troubleshooting.md)
   - Bookmark for quick reference when issues arise

## Related Documentation

### Individual Tool READMEs
Detailed configuration and implementation documentation:
- [brain-monitor README](/tooling/brain-monitor/README.md)
- [@kit/logger README](/tooling/logger/README.md)
- [@kit/testing README](/tooling/testing/README.md)
- [@kit/env-loader README](/tooling/env-loader/README.md)
- [Proxy Swagger README](/apps/server/src/swagger/README.md)
- [CM Swagger README](/services/cm-swagger/README.md)

### Agent and Development Standards
Core development rules and guidelines:
- [AGENT_INSTRUCTIONS.md](/docs/maintenance/AGENT_INSTRUCTIONS.md) - Comprehensive agent guide
- [AGENTS.md](/AGENTS.md) - Consolidated development rules
- [DOCUMENTATION_STANDARDS.md](/docs/maintenance/DOCUMENTATION_STANDARDS.md) - Documentation style guide

### Operational Guides
Related operational documentation:
- [Deployment Guides](/docs/guides/deployment/) - Forge CLI, CI/CD, infrastructure
- [Architecture Documentation](/docs/architecture/) - System-wide architectural decisions
- [Feature Documentation](/docs/features/) - Feature-specific implementation details

## Contributing

When updating this documentation:

1. **Update Trigger Events** - Modify documentation when:
   - Adding new developer tools
   - Changing tool configurations
   - Adding new commands to root `package.json`
   - Changing validation workflows
   - Adding new generators or templates

2. **Update Locations** - Files to update:
   - This README.md - For new tool categories or major changes
   - Specific tool documentation - For tool-specific changes
   - Quick reference - For new commands or workflows
   - Troubleshooting - For new common issues

3. **Maintain Cross-References** - Ensure:
   - All links are absolute paths from repo root
   - Bidirectional links between related documents
   - Tool READMEs link back to this guide
   - YAML frontmatter includes `last_updated` date

4. **Follow Standards** - Use:
   - YAML frontmatter with complete metadata
   - Code references with line numbers where applicable
   - Clear section headings and tables
   - Mermaid diagrams for complex workflows
