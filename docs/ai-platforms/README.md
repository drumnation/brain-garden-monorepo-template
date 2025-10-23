# AI Platform Instructions

This directory contains auto-generated instruction files for various AI platforms.

## Generated Files

- **CLAUDE.md** - Hierarchical rules for Claude (monorepo root context)
- **AGENTS.md** - Concise, action-oriented format for autonomous agents
- **GEMINI.md** - Structured format with decision points for Google Gemini
- **.clinerules** - Single-file format for Cline
- **.windsurfrules** - Single-file format for Windsurf

## Source

All files are auto-generated from `.brain/rules/**/*.rules.mdc`.

**DO NOT EDIT THESE FILES DIRECTLY.**

To modify rules:
1. Edit source files in `.brain/rules/`
2. Run `pnpm rules:build`
3. Commit both source and generated files

## Build Commands

```bash
pnpm rules:build        # Generate all files
pnpm rules:watch        # Auto-rebuild on changes
pnpm rules:build:verify # Build and verify distribution
```

## Scopes

This directory contains rules for the **monorepo root context** with scopes:
- `monorepo` - Monorepo-wide rules
- `global` - Universal rules applying everywhere

For context-specific rules, see:
- `apps/*/CLAUDE.md` - App-specific contexts
- `packages/*/CLAUDE.md` - Package-specific contexts
- `tooling/CLAUDE.md` - Tooling context
