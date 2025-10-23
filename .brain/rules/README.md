# Brain Garden Rules System

This directory contains the **source of truth** for all AI assistant rules in the monorepo.

## Structure

```
.brain/rules/
├── agent/              # Agent-specific procedures and patterns
│   ├── pattern/        # Agent behavior patterns
│   ├── procedures/     # Agent workflows and procedures
│   └── setup/          # Agent initialization
├── core/               # Core development rules
│   ├── architecture/   # Project architecture and goals
│   ├── documentation/  # Documentation standards
│   ├── patterns/       # Code patterns and best practices
│   ├── quality/        # Testing and validation
│   └── syntax/         # Language-specific syntax rules
```

## Rule File Format

Each `.rules.mdc` file should include YAML frontmatter:

```yaml
---
description: Brief description of when to apply this rule
globs:
  - "**/*.ts"  # File patterns this rule applies to
alwaysApply: true  # or false
scopes:
  - monorepo  # Which contexts include this rule
  - global
---
```

## Available Scopes

- `global` - Applies everywhere
- `monorepo` - Monorepo-wide rules
- `react`, `frontend`, `ui`, `components` - Frontend contexts
- `express`, `backend`, `api`, `node` - Backend contexts
- `tooling` - Tooling packages
- `shared` - Shared packages

## Modifying Rules

1. Edit `.rules.mdc` files in this directory
2. Run `pnpm rules:build` to regenerate outputs
3. Verify changes in `docs/ai-platforms/`
4. Commit both source and generated files

## Generated Outputs

Rules are compiled into platform-specific formats:
- `docs/ai-platforms/CLAUDE.md` - Claude hierarchical format
- `docs/ai-platforms/AGENTS.md` - Autonomous agents format
- `docs/ai-platforms/GEMINI.md` - Google Gemini format
- `docs/ai-platforms/.clinerules` - Cline format
- `docs/ai-platforms/.windsurfrules` - Windsurf format

## Build Commands

```bash
pnpm rules:build        # Generate all platform files
pnpm rules:watch        # Auto-rebuild on changes
pnpm rules:build:verify # Build and verify
```
