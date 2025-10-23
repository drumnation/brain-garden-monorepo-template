<!--
Feature README Template v1.0

Instructions:
1. Copy this entire feature-template folder to /docs/features/[feature-name]/
2. Replace all [PLACEHOLDER] text with actual content
3. Update YAML frontmatter with appropriate values
4. Fill in all sections completely
5. Link to actual code locations using absolute paths
6. Remove this instruction block when done
-->

---
title: "[Feature Name] Feature"
description: "[Brief description of what this feature does]"
keywords: [[feature-name], [domain], [technology]]
last_updated: "YYYY-MM-DD"
---

# [Feature Name] Feature

## Feature Overview

[Brief description (2-3 sentences) of what this feature does]

**Key Capabilities:**
- [Capability 1]
- [Capability 2]
- [Capability 3]

**Status:** [✅ Implemented | 🚧 In Progress | 📋 Planned]

## Quick Links

| Document | Description |
|----------|-------------|
| [Requirements](./requirements.md) | Feature requirements and acceptance criteria |
| [Architecture](./architecture.md) | Technical design and implementation |
| [API Documentation](./api.md) | API endpoints and contracts |
| [Testing](./testing.md) | Test strategy and test cases |

## Code Locations

### Packages Involved

- **`@scala-cme/[package-name]`** - [Description] (`/packages/[package-name]/`)
- **`@scala-cme/[another-package]`** - [Description] (`/packages/[another-package]/`)

### Apps Involved

- **`apps/[app-name]`** - [Description] (`/apps/[app-name]/src/`)
- **`apps/[another-app]`** - [Description] (`/apps/[another-app]/src/`)

### Key Files

**Client Components:**
- `packages/[package]/src/components/[Component].tsx:123` - [Description of what this file does]
- `packages/[package]/src/hooks/use[Hook].ts:45` - [Description]

**Redux State Management:**
- `packages/shared-redux/src/slices/[feature]/[feature]Slice.ts:67` - [Description]
- `packages/shared-redux/src/services/[feature].ts:89` - [Description]

**Server:**
- `apps/server/src/routes/[feature].ts:101` - [Description]
- `services/[service]/src/[module].ts:112` - [Description]

## Feature Dependencies

### Depends On
- [Feature/System 1] - [Why this dependency exists]
- [Feature/System 2] - [Why this dependency exists]
- [External Dependency] - [e.g., Content Manager API, third-party library]

### Depended On By
- [Feature 1] - [What depends on this feature]
- [Feature 2] - [What depends on this feature]

### External Dependencies
- [Third-party library name] - [Version] - [Purpose]
- [External API] - [Purpose]

## User Workflows

1. **[Primary Workflow Name]:** [Brief description of the workflow]
2. **[Secondary Workflow Name]:** [Brief description of the workflow]
3. **[Additional Workflow]:** [Brief description of the workflow]

*See [requirements.md](./requirements.md) for detailed workflow documentation and user stories.*

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `[VAR_NAME]` | Yes/No | `[value]` | [Description] |
| `[ANOTHER_VAR]` | Yes/No | `[value]` | [Description] |

### Configuration Files

- `.env` - [Description]
- `[config-file].json` - [Description]

### Feature Flags

- `[FEATURE_FLAG_NAME]` - [Description] (if applicable)

## Related Documentation

### Architecture Documentation
- [System Overview](/docs/architecture/system-overview.md) - [Relevance]
- [Frontend Architecture](/docs/architecture/frontend.md) - [Relevance]
- [Backend Architecture](/docs/architecture/backend.md) - [Relevance]
- [Security Architecture](/docs/architecture/security.md) - [If security-related]

### Related Features
- [Related Feature 1](/docs/features/[feature-name]/) - [How they relate]
- [Related Feature 2](/docs/features/[another-feature]/) - [How they relate]

### Package Documentation
- `/packages/[package-name]/README.md` - [Package-level implementation details]
- `/services/[service-name]/README.md` - [Service-level details]

### Guides
- [Getting Started](/docs/guides/getting-started.md) - [If relevant]
- [Deployment Guide](/docs/guides/deployment/) - [If relevant]

## For AI Agents

### Working with This Feature

[Provide guidance on how AI agents should approach working with this feature]

**Key considerations:**
- [Important aspect 1 to be aware of]
- [Important aspect 2 to be aware of]
- [Important aspect 3 to be aware of]

### Key Files to Modify

When changing this feature, AI agents should focus on:

**Client Side:**
- `[file-path]` - [When to modify]
- `[file-path]` - [When to modify]

**Server Side:**
- `[file-path]` - [When to modify]
- `[file-path]` - [When to modify]

**State Management:**
- `[file-path]` - [When to modify]
- `[file-path]` - [When to modify]

### Testing Requirements

When modifying this feature, ensure:
- [ ] Unit tests pass for all modified components
- [ ] Integration tests cover feature interactions
- [ ] E2E tests validate complete user workflows
- [ ] No regression in related features

### Documentation Update Triggers

Update this documentation when:
- [ ] Adding new UI components or screens
- [ ] Modifying API endpoints or contracts
- [ ] Changing authentication or authorization logic
- [ ] Adding new configuration requirements
- [ ] Modifying data models or state shape
- [ ] Changing external dependencies

---

**Example Implementation:** See [/docs/features/authentication/](/docs/features/authentication/) for a complete reference implementation of this template.
