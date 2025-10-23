# Hierarchical Rule System - Visual Workflow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Single Source of Truth                      │
│              .cursor/rules/*.mdc (20 files)                  │
│                                                               │
│  Each with frontmatter:                                       │
│  - description: "When to apply"                               │
│  - globs: ["file/patterns/**/*"]  ← For Cursor              │
│  - scopes: ["react", "ui"]         ← For hierarchical        │
│  - alwaysApply: true/false         ← For Cursor              │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ pnpm rules:build
                            ↓
┌─────────────────────────────────────────────────────────────┐
│            build-consolidated-rules.ts                       │
│         (Filters rules by scope matching)                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ↓                   ↓                   ↓
   Hierarchical        Single-File         Cursor
   (Claude,Gemini,     (Cline,            (Reads .mdc
    Codex)             Windsurf)           directly)
        │                   │
        ↓                   ↓
┌──────────────┐   ┌──────────────┐
│ 15 Files     │   │ 2 Files      │
├──────────────┤   ├──────────────┤
│ /CLAUDE.md   │   │ .clinerules  │
│ /GEMINI.md   │   │ .windsurfrules│
│ /AGENTS.md   │   └──────────────┘
├──────────────┤
│ apps/client/ │
│ ├─CLAUDE.md  │
│ ├─GEMINI.md  │
│ └─AGENTS.md  │
├──────────────┤
│ apps/server/ │
│ ├─CLAUDE.md  │
│ ├─GEMINI.md  │
│ └─AGENTS.md  │
├──────────────┤
│packages/     │
│shared-ui/    │
│ ├─CLAUDE.md  │
│ ├─GEMINI.md  │
│ └─AGENTS.md  │
├──────────────┤
│ services/    │
│ ├─CLAUDE.md  │
│ ├─GEMINI.md  │
│ └─AGENTS.md  │
└──────────────┘
```

## Scope Matching Logic

```
Rule: atomic-design-component-strategy.rules.mdc
─────────────────────────────────────────────────
scopes: ["react", "ui", "components"]

        ↓ Matches?

┌─────────────────────────────────────────────────────────┐
│ Context: Monorepo Root                                   │
│ scopes: ["monorepo", "global", "core"]                  │
│ Match? NO (no overlap)                                   │
│ Result: ❌ Not included in /CLAUDE.md                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Context: React/Frontend                                  │
│ scopes: ["monorepo", "global", "react", "frontend",     │
│          "ui", "components"]                             │
│ Match? YES (react, ui, components overlap)              │
│ Result: ✅ Included in apps/client/CLAUDE.md           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Context: Express/Backend                                 │
│ scopes: ["monorepo", "global", "express", "backend",    │
│          "api", "node"]                                  │
│ Match? NO (no overlap)                                   │
│ Result: ❌ Not included in apps/server/CLAUDE.md       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Context: Shared UI Packages                              │
│ scopes: ["monorepo", "global", "react", "ui",           │
│          "components", "storybook"]                      │
│ Match? YES (react, ui, components overlap)              │
│ Result: ✅ Included in packages/shared-ui/CLAUDE.md    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Context: Services                                        │
│ scopes: ["monorepo", "global", "services", "backend",   │
│          "node"]                                         │
│ Match? NO (no overlap)                                   │
│ Result: ❌ Not included in services/CLAUDE.md          │
└─────────────────────────────────────────────────────────┘
```

## Token Efficiency Comparison

### Before (Single CLAUDE.md)

```
Developer working in apps/client/ (React)
──────────────────────────────────────────
Loads: /CLAUDE.md (140KB)
Contains:
  ✓ React/UI rules (needed)
  ✗ Express/Backend rules (not needed)
  ✗ Service rules (not needed)
  ✗ Monorepo-only rules (not needed)

Token usage: ~140KB
Relevant context: ~40% (56KB)
Wasted tokens: ~60% (84KB)
```

### After (Hierarchical CLAUDE.md)

```
Developer working in apps/client/ (React)
──────────────────────────────────────────
Loads: apps/client/CLAUDE.md (50KB)
Contains:
  ✓ React/UI rules (needed)
  ✓ Core monorepo rules (needed)
  ✓ Testing/validation rules (needed)
  ✗ Express/Backend rules (filtered out)
  ✗ Service rules (filtered out)

Token usage: ~50KB
Relevant context: ~95% (47.5KB)
Wasted tokens: ~5% (2.5KB)

Savings: 64% reduction in tokens!
```

## Daily Workflow

```
┌─────────────────────────────────────────────────────┐
│ 1. Edit Rule                                         │
│    $ code .cursor/rules/my-rule.rules.mdc            │
│                                                       │
│    Add/update scopes:                                 │
│    scopes: ["react", "ui", "components"]             │
└─────────────────────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────────┐
│ 2. Regenerate (Manual)                               │
│    $ pnpm rules:build                                │
│                                                       │
│    OR                                                 │
│                                                       │
│ 2. Auto-Regenerate (Watch Mode)                      │
│    $ pnpm rules:watch                                │
│    (Automatically rebuilds on any .mdc change)       │
└─────────────────────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────────┐
│ 3. Verify Output                                     │
│    $ head -100 apps/client/CLAUDE.md                 │
│    $ head -100 apps/server/CLAUDE.md                 │
│                                                       │
│    Check that rules appear in expected contexts      │
└─────────────────────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────────┐
│ 4. Commit Changes                                    │
│    $ git add .cursor/rules/*.mdc                     │
│    $ git add */CLAUDE.md */GEMINI.md */AGENTS.md    │
│    $ git add .clinerules .windsurfrules              │
│    $ git commit -m "docs: update development rules"  │
└─────────────────────────────────────────────────────┘
```

## Scope Decision Tree

```
                    New Rule to Add?
                           │
                           ↓
              ┌────────────┴────────────┐
              │                         │
         Applies to ALL           Specific to
         contexts?                technology?
              │                         │
              ↓                         ↓
        scopes: [global]    ┌──────────┴──────────┐
                            │                     │
                         React/UI?          Backend/API?
                            │                     │
                            ↓                     ↓
                    scopes: [react,       scopes: [express,
                            ui,                   backend,
                            components]           api]


                    Specific to
                    package type?
                           │
              ┌────────────┼────────────┐
              │            │            │
         Storybook?    Services?    Monorepo
              │            │         structure?
              ↓            ↓            ↓
        scopes:      scopes:      scopes:
        [react,      [node,       [monorepo]
         ui,         services,
         storybook]  backend]
```

## Example Scope Combinations

```
┌──────────────────────────────────────────────────────────┐
│ Universal Testing Rule                                    │
│ scopes: [global]                                          │
│                                                            │
│ Appears in ALL 5 contexts                                 │
│ ✅ /CLAUDE.md                                             │
│ ✅ apps/client/CLAUDE.md                                  │
│ ✅ apps/server/CLAUDE.md                                  │
│ ✅ packages/shared-ui/CLAUDE.md                           │
│ ✅ services/CLAUDE.md                                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ React Component Pattern                                   │
│ scopes: [react, ui, components]                           │
│                                                            │
│ Appears in 2 contexts                                     │
│ ❌ /CLAUDE.md                                             │
│ ✅ apps/client/CLAUDE.md                                  │
│ ❌ apps/server/CLAUDE.md                                  │
│ ✅ packages/shared-ui/CLAUDE.md                           │
│ ❌ services/CLAUDE.md                                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Express Backend Pattern                                   │
│ scopes: [express, backend, api]                           │
│                                                            │
│ Appears in 1 context                                      │
│ ❌ /CLAUDE.md                                             │
│ ❌ apps/client/CLAUDE.md                                  │
│ ✅ apps/server/CLAUDE.md                                  │
│ ❌ packages/shared-ui/CLAUDE.md                           │
│ ❌ services/CLAUDE.md                                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Node.js General Pattern                                   │
│ scopes: [node, backend, services]                         │
│                                                            │
│ Appears in 2 contexts                                     │
│ ❌ /CLAUDE.md                                             │
│ ❌ apps/client/CLAUDE.md                                  │
│ ✅ apps/server/CLAUDE.md                                  │
│ ❌ packages/shared-ui/CLAUDE.md                           │
│ ✅ services/CLAUDE.md                                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Monorepo Structure Rule                                   │
│ scopes: [monorepo]                                        │
│                                                            │
│ Appears in 1 context                                      │
│ ✅ /CLAUDE.md                                             │
│ ❌ apps/client/CLAUDE.md                                  │
│ ❌ apps/server/CLAUDE.md                                  │
│ ❌ packages/shared-ui/CLAUDE.md                           │
│ ❌ services/CLAUDE.md                                     │
└──────────────────────────────────────────────────────────┘
```

## Quick Reference: Commands

| What | Command |
|:-----|:--------|
| **Build once** | `pnpm rules:build` |
| **Watch mode** | `pnpm rules:watch` |
| **List generated files** | `find . -name "CLAUDE.md" -o -name "GEMINI.md" -o -name "AGENTS.md"` |
| **Check file sizes** | `ls -lh */CLAUDE.md */GEMINI.md */AGENTS.md` |
| **View frontend rules** | `head -100 apps/client/CLAUDE.md` |
| **View backend rules** | `head -100 apps/server/CLAUDE.md` |
| **Stage all changes** | `git add .cursor/rules/*.mdc */CLAUDE.md */GEMINI.md */AGENTS.md` |
