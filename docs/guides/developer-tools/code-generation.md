---
title: "Code Generation Tools"
description: "Guide to scaffolding and code generation utilities in CME"
keywords: [code-generation, scaffolding, generators, templates, boilerplate]
last_updated: "2025-01-22"
---

# Code Generation Tools

Guide to scaffolding and code generation utilities in the Content Manager Express monorepo.

## Overview

Code generation tools help maintain consistency and reduce boilerplate by automatically generating packages, documentation, and configurations following established patterns.

**Benefits:**
- Consistent project structure
- Reduced manual work
- Fewer configuration errors
- Faster project setup

## Package Generator

Tool for creating new packages with consistent structure.

### Command

```bash
pnpm gen:library
```

### Interactive Prompts

The generator asks for:

**1. Package Name**
```
? Package name: @scala-cme/data-export
```

**Naming conventions:**
- Apps: `@scala-cme/[app-name]`
- Packages: `@scala-cme/[package-name]`
- Tooling: `@kit/[tool-name]`

**2. Description**
```
? Description: Data export utilities for CSV, Excel, PDF
```

Brief description of package purpose.

**3. Package Type**
```
? Package type: (Use arrow keys)
  ❯ library   - Shared library package
    ui        - UI component library
    utility   - Utility/helper package
```

Type determines tsconfig preset and structure.

### Generated Structure

The generator creates:

```
packages/[package-name]/
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript configuration
├── README.md              # Package documentation
├── CHANGELOG.md           # Version history (Keep a Changelog format)
└── src/
    └── index.ts           # Main entry point
```

### Generated Files

#### package.json

```json
{
  "name": "@scala-cme/data-export",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./*": "./src/*.ts"
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": ["src"],
  "scripts": {
    "clean": "rimraf node_modules .turbo",
    "format": "prettier --check \"**/*.{ts,tsx,md}\"",
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "devDependencies": {
    "@kit/eslint-config": "workspace:*",
    "@kit/prettier-config": "workspace:*",
    "@kit/testing": "workspace:*",
    "@kit/tsconfig": "workspace:*"
  },
  "eslintConfig": {
    "root": true,
    "extends": ["@kit/eslint-config/base"]
  },
  "prettier": "@kit/prettier-config"
}
```

**Key features:**
- ESM-only (`"type": "module"`)
- Exports source directly (`"main": "./src/index.ts"`)
- Workspace dependencies (`workspace:*`)
- Pre-configured scripts
- Shared tooling configs

#### tsconfig.json

```json
{
  "extends": "@kit/tsconfig/node",
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

**Note:** No `outDir` or `declaration` - packages export source directly.

#### README.md

```markdown
# @scala-cme/data-export

> Brief package description

## Installation

\`\`\`bash
pnpm add @scala-cme/data-export
\`\`\`

## Usage

\`\`\`typescript
import {exportData} from '@scala-cme/data-export';
\`\`\`

## API

...
```

#### CHANGELOG.md

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Initial release
```

Follows [Keep a Changelog](https://keepachangelog.com/) format.

### Post-Generation Steps

After generation:

**1. Review Files**
```bash
ls -la packages/[package-name]/
```

**2. Install Dependencies**
```bash
pnpm install
```

**3. Setup Environment**
```bash
pnpm setup:env
```

**4. Implement Functionality**
```bash
cd packages/[package-name]/src
# ... create your modules ...
```

**5. Write Tests**
```typescript
// src/exporter.unit.test.ts
import {describe, it, expect} from 'vitest';
import {exportToCSV} from './exporter';

describe('exportToCSV', () => {
  it('should export data to CSV format', () => {
    const data = [{name: 'John', age: 30}];
    const result = exportToCSV(data);
    expect(result).toContain('name,age');
  });
});
```

**6. Validate**
```bash
cd ../..
pnpm brain:typecheck-failures
pnpm brain:test-failures-unit
```

### Location

- **Generator Code:** `/tooling/generators/create-library/index.ts`
- **Templates:** `/tooling/generators/create-library/templates.ts`

## Documentation Templates

Templates for creating consistent documentation.

### Feature Template

Complete structure for feature documentation.

**Location:** `/docs/maintenance/templates/feature-template/`

**Structure:**
```
feature-template/
├── README.md          # Overview and navigation
├── requirements.md    # FR, NFR, user stories
├── architecture.md    # Technical design
├── api.md            # API contracts
└── testing.md        # Test strategy
```

**When to use:**
- Creating new feature documentation
- Large features requiring comprehensive docs
- Cross-package features
- MVP milestone features

**How to use:**

1. Copy template to feature location:
```bash
cp -r docs/maintenance/templates/feature-template docs/features/[feature-name]
```

2. Fill all sections completely
3. Replace all `[PLACEHOLDER]` text
4. Add YAML frontmatter with `last_updated`
5. Use absolute paths from repo root
6. Add code references with line numbers
7. Include Mermaid diagrams where appropriate
8. Remove template instructions

**Example usage:**
```bash
# Create data export feature docs
cp -r docs/maintenance/templates/feature-template docs/features/data-export

# Edit files
# docs/features/data-export/README.md
# docs/features/data-export/requirements.md
# docs/features/data-export/architecture.md
# docs/features/data-export/api.md
# docs/features/data-export/testing.md

# Update relevant indexes
# docs/features/README.md
# docs/README.md
```

### PRD Template

Product Requirements Document template.

**Location:** `/docs/maintenance/templates/prd-template.md`

**When to use:**
- Planning large features
- MVP definition
- Product specification
- Stakeholder alignment

**Sections:**
- Executive Summary
- Problem Statement
- Goals and Success Metrics
- User Stories
- Functional Requirements
- Non-Functional Requirements
- Technical Approach
- Milestones

### Architecture Template

Architecture documentation template.

**Location:** `/docs/maintenance/templates/architecture-template.md`

**When to use:**
- Documenting system architecture
- Component relationships
- Data flow diagrams
- Technology decisions

**Sections:**
- Overview
- System Context
- Component Architecture
- Data Architecture
- Integration Points
- Technology Stack
- Deployment Architecture

### ADR Template

Architecture Decision Record template.

**Location:** `/docs/maintenance/templates/adr-template.md`

**When to use:**
- Documenting architectural decisions
- Technology choices
- Pattern selections
- Trade-off analysis

**Format:**
```markdown
# ADR-XXX: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[Situation and problem statement]

## Decision
[The change we're proposing or have agreed to]

## Consequences
[Positive and negative outcomes]

## Alternatives Considered
[Other options and why not chosen]
```

### GitHub Issue Template

Well-structured issue template.

**Location:** `/docs/maintenance/templates/github-issue-template.md`

**When to use:**
- Creating structured issues
- Bug reports
- Feature requests
- Ensuring complete information

**Sections:**
- Issue Type
- Description
- Steps to Reproduce (bugs)
- Expected Behavior
- Actual Behavior
- Acceptance Criteria
- Related Issues

## Generator Customization

Extending and customizing generators.

### Location of Generator Code

```
tooling/generators/
├── create-library/
│   ├── index.ts        # Main generator logic
│   ├── templates.ts    # File templates
│   └── utils.ts        # Helper functions
└── utils.ts            # Shared utilities
```

### Template System

Templates use string interpolation:

```typescript
// templates.ts
export const packageJsonTemplate = (packageName: string, description: string) => `{
  "name": "${packageName}",
  "description": "${description}",
  "version": "1.0.0",
  ...
}`;
```

### Adding New Generators

Follow existing patterns:

**1. Create generator directory:**
```bash
mkdir tooling/generators/create-[type]
```

**2. Create generator files:**
```typescript
// index.ts
import prompts from 'prompts';
import {writeFile} from 'fs/promises';

export async function generate() {
  const answers = await prompts([
    {
      type: 'text',
      name: 'name',
      message: 'Component name:',
    },
  ]);

  // Generate files...
}
```

**3. Create templates:**
```typescript
// templates.ts
export const componentTemplate = (name: string) => `
export const ${name} = () => {
  return <div>${name}</div>;
};
`;
```

**4. Add script to root package.json:**
```json
{
  "scripts": {
    "gen:[type]": "tsx tooling/generators/create-[type]/index.ts"
  }
}
```

### Utility Functions

Shared utilities in `/tooling/generators/utils.ts`:

```typescript
// Create directory
export async function ensureDir(path: string): Promise<void>

// Write file
export async function writeTemplate(
  path: string,
  content: string
): Promise<void>

// Validate package name
export function validatePackageName(name: string): boolean

// Convert to camel case
export function toCamelCase(str: string): string

// Convert to pascal case
export function toPascalCase(str: string): string
```

## Scaffolding Best Practices

### Always Use Generators for Consistency

```bash
# ✅ Good - use generator
pnpm gen:library

# ❌ Bad - manual creation
mkdir packages/new-package
touch packages/new-package/package.json
# ... manual setup ...
```

**Why:** Generators ensure:
- Consistent structure
- Complete configuration
- Proper naming conventions
- All required files

### Review Generated Code Before Committing

```bash
# Generate package
pnpm gen:library

# Review files
cat packages/new-package/package.json
cat packages/new-package/tsconfig.json

# Make adjustments if needed
# Then commit
```

**Why:** Generators provide defaults that might need customization.

### Customize Templates for Project Needs

Update generator templates when patterns change:

```typescript
// tooling/generators/create-library/templates.ts
export const packageJsonTemplate = (name: string, desc: string) => {
  // Update with new shared dependencies
  // Update with new scripts
  // Update with new configuration
  return `...`;
};
```

**When to update:**
- Adding new shared tooling
- Changing package structure
- Updating best practices

### Update Generators When Patterns Change

Keep generators in sync with project evolution:

**Triggers for generator updates:**
- New tooling packages
- Changed file structure
- New testing patterns
- Updated tsconfig presets
- New ESLint rules

### Document Custom Generators

If adding custom generators:

```markdown
# Custom Generator: create-feature

## Purpose
Scaffolds complete feature with components, tests, and docs.

## Usage
\`\`\`bash
pnpm gen:feature
\`\`\`

## Prompts
- Feature name
- Feature category
- Include Storybook stories (Y/n)

## Generated Structure
...
```

## Manual Scaffolding

When generators aren't available, follow these guidelines.

### Copy Existing Similar Package

```bash
# Find similar package
ls packages/

# Copy structure
cp -r packages/existing-package packages/new-package

# Clean up
rm -rf packages/new-package/src/*
rm -rf packages/new-package/node_modules
```

### Follow Naming Conventions

From AGENTS.md:

**Apps:**
```
@scala-cme/client
@scala-cme/server
@scala-cme/admin
```

**Packages:**
```
@scala-cme/shared-ui
@scala-cme/shared-redux
@scala-cme/data-export
```

**Tooling:**
```
@kit/logger
@kit/testing
@kit/eslint-config
```

### Use Appropriate tsconfig Preset

From `@kit/tsconfig`:

| Preset | Use Case |
|--------|----------|
| `@kit/tsconfig/base` | Shared base |
| `@kit/tsconfig/node` | Node.js apps |
| `@kit/tsconfig/react` | React apps |
| `@kit/tsconfig/library` | Library packages |

```json
{
  "extends": "@kit/tsconfig/react",
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### Follow package.json Structure

Standard package.json for libraries:

```json
{
  "name": "@scala-cme/[package-name]",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./*": "./src/*.ts"
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": ["src"],
  "scripts": {
    "clean": "rimraf node_modules .turbo",
    "format": "prettier --check \"**/*.{ts,tsx,md}\"",
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "devDependencies": {
    "@kit/eslint-config": "workspace:*",
    "@kit/prettier-config": "workspace:*",
    "@kit/testing": "workspace:*",
    "@kit/tsconfig": "workspace:*"
  },
  "eslintConfig": {
    "root": true,
    "extends": ["@kit/eslint-config/base"]
  },
  "prettier": "@kit/prettier-config"
}
```

### Create README.md and CHANGELOG.md

**README.md structure:**
```markdown
# @scala-cme/[package-name]

> Brief description

## Installation

\`\`\`bash
pnpm add @scala-cme/[package-name]
\`\`\`

## Usage

\`\`\`typescript
import {feature} from '@scala-cme/[package-name]';
\`\`\`

## API

### `feature(param)`
Description...
```

**CHANGELOG.md:**
```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- Initial release
```

## Template Usage Workflow

Step-by-step process for using documentation templates.

### Step 1: Identify Appropriate Template

| Need | Template |
|------|----------|
| Feature documentation | `/docs/maintenance/templates/feature-template/` |
| Product requirements | `/docs/maintenance/templates/prd-template.md` |
| Architecture docs | `/docs/maintenance/templates/architecture-template.md` |
| Decision record | `/docs/maintenance/templates/adr-template.md` |
| GitHub issue | `/docs/maintenance/templates/github-issue-template.md` |

### Step 2: Copy to Target Location

```bash
# Feature documentation
cp -r docs/maintenance/templates/feature-template docs/features/[feature-name]

# Single file template
cp docs/maintenance/templates/prd-template.md docs/features/[feature-name]/requirements.md
```

### Step 3: Replace All Placeholders

Search for and replace:
- `[FEATURE-NAME]`
- `[DESCRIPTION]`
- `[DATE]`
- `[AUTHOR]`
- All other `[PLACEHOLDER]` text

### Step 4: Fill YAML Frontmatter

```yaml
---
title: "Feature Name"
description: "Brief description"
keywords: [feature, api, implementation]
last_updated: "2025-01-22"
---
```

### Step 5: Complete All Sections

Don't skip sections:
- Fill every section completely
- Remove sections if not applicable (mark as N/A)
- Don't leave `TODO` or placeholder text

### Step 6: Remove Template Instructions

Delete all template instructions and guidance text:
- Remove instruction paragraphs
- Remove example text marked as examples
- Keep only actual documentation content

### Step 7: Update Relevant Indexes

Update navigation:
```markdown
# docs/features/README.md
- [Data Export](/docs/features/data-export/) - Export functionality

# docs/README.md
- [Features](/docs/features/) - Feature documentation
```

## Related Documentation

- [Quick Reference](/docs/guides/developer-tools/quick-reference.md) - Command lookup for generators
- [Development Workflows](/docs/guides/developer-tools/development-workflow.md) - Generator usage in workflows
- [Documentation Standards](/docs/maintenance/DOCUMENTATION_STANDARDS.md) - Documentation style guide
- [Agent Instructions](/docs/maintenance/AGENT_INSTRUCTIONS.md) - Complete documentation guidance
- [AGENTS.md](/AGENTS.md) - Naming conventions and structure patterns
