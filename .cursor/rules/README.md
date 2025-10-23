# Cursor Rules

This directory contains **ONLY the 9 focused rule files** that Cursor loads directly.

## Meta-Rules (Read First)

- `00-meta-rules-system.rules.mdc` - **Rules system architecture and modification protocol**
  - **Purpose:** Defines how the rules system works, how to modify rules, and documentation placement policy
  - **Always applies:** `alwaysApply: true` - This rule is included in ALL contexts
  - **CRITICAL:** Read this first to understand the rules workflow and never edit generated files

## Active Rules

- `01-foundation.rules.mdc` - Core monorepo foundation
- `02-validation-testing.rules.mdc` - Brain monitor & TDD
- `03-frontend-patterns.rules.mdc` - Component patterns
- `04-react-standards.rules.mdc` - React best practices
- `05-backend-express.rules.mdc` - Express architecture
- `06-backend-functional.rules.mdc` - Functional patterns
- `07-documentation.rules.mdc` - Documentation & versioning
- `08-workflow.rules.mdc` - PR creation & commands
- `09-ai-documentation-maintenance.rules.mdc` - AI documentation maintenance

## Backup

- `_backup/` - Original 19 verbose rules (not loaded by Cursor)

## Usage

**⚠️ IMPORTANT: Never edit generated files (CLAUDE.md, GEMINI.md, AGENTS.md, .clinerules, .windsurfrules) directly!**

**Edit a rule:**
```bash
# Edit any of the 00-09 .rules.mdc files
# Then regenerate platform files:
pnpm rules:build
```

**Watch mode:**
```bash
pnpm rules:watch
```

## Other Directories

- **`.cursor/sync/`** - Build script (`build-consolidated-rules.ts`)
- **`.cursor/docs/`** - All documentation (README, guides, etc.)

This keeps the rules directory clean with ONLY rule files!
