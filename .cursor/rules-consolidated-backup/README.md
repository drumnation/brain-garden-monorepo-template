# Consolidated Rules - Historical Archive

This directory contains the **old consolidated rule files** that were used before the modular rule system was introduced.

## ⚠️ IMPORTANT: These Files Are Deprecated

**Status:** PRESERVED FOR REFERENCE ONLY  
**Last Updated:** October 21, 2025  
**Superseded By:** Modular rules in `.cursor/rules-source/`

## Why These Files Are Preserved

These consolidated files represent the state of the project's development rules before they were refactored into a modular, scope-based system. They are kept here for:

1. **Historical Reference** - Understanding how rules evolved
2. **Migration Validation** - Ensuring no rules were lost during the refactor
3. **Recovery Purposes** - In case critical content needs to be recovered

## Current System

The active rule system is now located in:
- **Source Rules:** `.cursor/rules-source/*.mdc` (19 modular rule files)
- **Build Script:** `.cursor/sync/build-consolidated-rules.ts`
- **Contexts:** `.cursor/sync/contexts.ts`

### Generated Outputs

The modular system generates platform-specific rule files:

1. **Cursor** - Reads `.mdc` files directly from `.cursor/rules/` (symlink to `rules-source/`)
2. **Cline** - Uses `.clinerules/` folder with numbered rule files
3. **Windsurf** - Uses `.windsurfrules` single file with activation metadata
4. **Gemini** - Uses `GEMINI.md` files with `@import` directives
5. **Claude** - Uses `CLAUDE.md` files in hierarchical contexts
6. **Other Agents** - Uses `AGENTS.md` files in hierarchical contexts

## Migration Summary

### What Changed

**Before (Consolidated):**
- Single large files per platform
- Manual synchronization between platforms
- No scope-based filtering
- Difficult to maintain consistency

**After (Modular):**
- 19 focused rule files with frontmatter
- Automated generation for all platforms
- Scope-based contextual filtering
- Single source of truth

### Rule Mapping

The consolidated rules were split into these modular files:

| Old Section | New File |
|------------|----------|
| Monorepo Structure | `monorepo-structure-and-configuration.rules.mdc` |
| Testing Strategy | `tests.tdd-workflow.rules.mdc`, `tests.unified-testing.rules.mdc` |
| Validation | `brain-monitor-validation.rules.mdc`, `tests.continuous-validation.rules.mdc` |
| Frontend Patterns | `component-design-decision-tree.rules.mdc`, `atomic-design-component-strategy.rules.mdc` |
| React Standards | `react-bulletproof-component-pattern.rules.mdc` |
| Mobile Design | `mobile-first-design.rules.mdc`, `platform-pathways-pattern.rules.mdc` |
| Backend Architecture | `monorepo-node-express-architecture.rules.mdc` |
| Functional Patterns | `node.functional-isolated-concerns.rules.mdc` |
| Documentation | `monorepo-documentation-strategy.rules.mdc`, `monorepo-package-docs-versioning.rules.mdc` |
| Workflow | `pr-creation-guidelines.mdc` |
| TestIDs | `testid.rules.mdc` |
| Storybook | `storybook-first-composition.rules.mdc` |
| Proxy Rules | `cm-proxy-rules.mdc`, `project-wide-proxy-rules.mdc` |

## Recovery Instructions

If you need to recover content from these files:

1. **Identify the missing content** in the consolidated files
2. **Check if it exists** in the current modular files
3. **If missing**, create a new rule file in `.cursor/rules-source/`
4. **Add appropriate frontmatter** with scopes and activation settings
5. **Run `pnpm rules:build`** to regenerate all platform files
6. **Run `pnpm rules:verify`** to ensure correct distribution

## Do Not Modify These Files

These files should not be edited directly. Any changes should be made to the modular rule files in `.cursor/rules-source/`.

To regenerate the current rules:
```bash
pnpm rules:build        # Build all platform files
pnpm rules:verify       # Verify distribution
pnpm rules:build:verify # Build and verify
```

## Contact

For questions about the rule system migration, check:
- `.cursor/rules-source/README.md` - Current system documentation
- `.cursor/sync/build-consolidated-rules.ts` - Build script implementation
- `scripts/verify-rule-distribution.ts` - Verification script

---

*This archive is part of the Repository Documentation Cleanup Campaign (Phase 3)*
