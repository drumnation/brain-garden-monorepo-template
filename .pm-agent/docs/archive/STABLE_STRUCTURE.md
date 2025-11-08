# Stable Structure - Projects Stay Put!

**Critical Insight:** Moving projects breaks absolute paths (Crystal, IDEs, configs)

**Solution:** Organize by DOMAIN, track STATUS via metadata, not folders.

---

## 🎯 The Problem with NOW/NEXT/PAUSED

```
SINGULARITY/NOW/cannabis-codex/     # Project starts here

# 2 months later, paused...
SINGULARITY/PAUSED/cannabis-codex/  # Moved here - BREAKS PATHS!

# Crystal project config: /Users/dmieloch/Dev/SINGULARITY/NOW/cannabis-codex
# ❌ Now broken!
# ❌ IDE workspace broken!
# ❌ Docker volumes broken!
# ❌ Build configs broken!
```

**You're 100% right:** Projects need to STAY PUT after initial organization.

---

## ✅ Stable Solution: Domain-Based + Metadata Status

**Philosophy:** Organize once by DOMAIN (stable), track STATUS in metadata (flexible)

```
projects/
├── WORK/                              # Domain: Day job
│   └── scala/                         # Stays here forever
│
├── LEGAL/                             # Domain: Legal practice
│   └── case-hero/                     # Stays here forever
│
├── SINGULARITY/                       # Domain: Personal LLC
│   ├── products/                      # Customer-facing apps
│   │   ├── brain-garden-os/          # ← Stays here forever
│   │   ├── cannabis-codex/           # ← Stays here forever
│   │   ├── scheduling-station/       # ← Stays here forever
│   │   ├── vanacore/                 # ← Stays here forever
│   │   └── medical-supply/           # ← Stays here forever
│   │
│   ├── tools/                         # Internal tooling
│   │   ├── cursor-tools/             # ← Stays here forever
│   │   ├── mcp-servers/              # ← Stays here forever
│   │   ├── parallel-claude/          # ← Stays here forever
│   │   └── knowledge/                # ← Stays here forever
│   │
│   ├── platforms/                     # Infrastructure projects
│   │   ├── crystal-fork/             # ← Stays here forever
│   │   ├── n8n/                      # ← Stays here forever
│   │   └── code-relay/               # ← Stays here forever
│   │
│   ├── extensions/                    # Browser/IDE extensions
│   │   ├── chrome-extensions/        # ← Stays here forever
│   │   └── vscode-extensions/        # ← Stays here forever
│   │
│   ├── templates/                     # Reusable starters
│   │   └── brain-garden-monorepo-template/  # ← Stays here forever
│   │
│   └── archive/                       # Done, keeping code
│       ├── cheddar/                   # ← Stays here forever
│       ├── evisum/                    # ← Stays here forever
│       └── wlmt/                      # ← Stays here forever
│
└── LEARNING/                          # Domain: Experiments & learning
    ├── forks/                         # Forked repos
    │   └── [forked-repos]/            # ← Stays here forever
    │
    └── experiments/                   # Trying new things
        └── [experiments]/             # ← Stays here forever
```

---

## 📊 Status Tracked in Metadata, Not Folders

### project-registry.json

```json
{
  "projects": [
    {
      "name": "cannabis-codex",
      "path": "projects/SINGULARITY/products/cannabis-codex",
      "domain": "SINGULARITY",
      "type": "products",

      "status": "active",              // ← METADATA, not folder!
      "priority": "high",
      "lastWorked": "2025-11-07",
      "phase": "development",          // development, testing, shipped, paused

      "absolutePath": "/Users/dmieloch/Dev/projects/SINGULARITY/products/cannabis-codex"
    },
    {
      "name": "parenting-pilot",
      "path": "projects/SINGULARITY/products/parenting-pilot",
      "domain": "SINGULARITY",
      "type": "products",

      "status": "paused",              // ← Just metadata!
      "priority": "low",
      "lastWorked": "2025-08-21",
      "phase": "paused",

      "pausedReason": "Evaluating n8n workflow approach instead"
    },
    {
      "name": "brain-garden-os",
      "path": "projects/SINGULARITY/products/brain-garden-os",
      "domain": "SINGULARITY",
      "type": "products",

      "status": "active",
      "priority": "critical",
      "lastWorked": "2025-11-07",
      "phase": "shipped",              // Live in production!

      "productionUrl": "https://brain-garden-os.com"
    }
  ]
}
```

---

## 🎯 PM Agent Queries Metadata, Not Folders

### "What am I working on NOW?"

```bash
pm-status --active

# Queries project-registry.json for status: "active"
# Shows from metadata, not folder location
```

**Output:**
```
🔥 Active Projects (8):

SINGULARITY/products:
  • cannabis-codex (high priority, 2 days ago)
  • brain-garden-os (critical, today)
  • scheduling-station (medium, 5 days ago)

SINGULARITY/tools:
  • cursor-tools (low, 10 days ago)

LEGAL:
  • case-hero (high, 3 days ago)
```

### "What's paused?"

```bash
pm-status --paused

# Queries for status: "paused"
```

### "What's shipped?"

```bash
pm-status --shipped

# Queries for phase: "shipped"
```

---

## 🏗️ Folder Structure Rules

### 1. Organize by WHAT IT IS (stable)

**Not by:**
- ❌ When you're working on it (changes)
- ❌ Priority (changes)
- ❌ Status (changes)

**But by:**
- ✅ Type of project (product, tool, platform)
- ✅ Domain (work, legal, LLC, learning)
- ✅ Purpose (stays constant)

### 2. Subfolders by TYPE

**SINGULARITY types:**
- `products/` - Things customers use (brain-garden, cannabis-codex, scheduling-station)
- `tools/` - Things you use to build products (cursor-tools, mcp-servers, parallel-claude)
- `platforms/` - Infrastructure things run on (crystal, n8n, code-relay)
- `extensions/` - Browser/IDE extensions
- `templates/` - Reusable starters
- `archive/` - Done, keeping code

**LEARNING types:**
- `forks/` - Repos you forked
- `experiments/` - Trying things out

---

## 📋 Migration: Where Does Everything Go?

### Current → New Location (ONE TIME MOVE)

**singularityApps/core/ → SINGULARITY/products/**
```
core/brain-garden-os/           → products/brain-garden-os/
core/brain-garden-studio/       → products/brain-garden-studio/
core/parenting-communication/   → products/parenting-communication/
```

**singularity-core/ → Based on type**
```
cannabiscodex/                  → products/cannabis-codex/
parenting-pilot/                → products/parenting-pilot/
vanacore-monorepo/              → products/vanacore/
knowledge/                      → tools/knowledge/
parallel-claude/                → tools/parallel-claude/
crystal-fork/                   → platforms/crystal/
brain-garden-monorepo-template/ → templates/brain-garden-monorepo/
```

**singularityApps/ → Based on type**
```
cursor-tools/                   → tools/cursor-tools/
mcp-servers/                    → tools/mcp-servers/
chrome-extensions/              → extensions/chrome-extensions/
vscode-extensions/              → extensions/vscode-extensions/
forks/crystal/                  → DELETE (duplicate)
0. archived/                    → archive/
```

**Root level accidents → Based on type**
```
scheduling-station-app/         → products/scheduling-station/
scan-box/                       → tools/scan-box/ or archive/
vpn-monitoring/                 → tools/vpn-monitoring/ or archive/
dot2dot-reborn/                 → archive/dot2dot/
```

---

## 🎨 Visual Status via PM Agent

Instead of folder location showing status, PM agent provides views:

### Dashboard View

```bash
pm-dashboard
```

**Output:**
```
╔═══════════════════════════════════════════════════════════╗
║  PM Agent Dashboard - November 7, 2025                    ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║  🔥 ACTIVE (8 projects)                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  🔴 cannabis-codex        (high)    2 days ago            ║
║  🔴 brain-garden-os       (critical) today                ║
║  🟡 scheduling-station    (medium)  5 days ago            ║
║  🟡 case-hero             (high)    3 days ago            ║
║  🟢 cursor-tools          (low)     10 days ago           ║
║                                                            ║
║  ⏸️  PAUSED (3 projects)                                  ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  parenting-pilot          90 days ago                     ║
║  medical-supply           120 days ago                    ║
║  evisum                   180 days ago                    ║
║                                                            ║
║  🚀 SHIPPED (2 projects)                                  ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  brain-garden-os          ✅ Live                         ║
║  vanacore                 ✅ Live                         ║
║                                                            ║
╚═══════════════════════════════════════════════════════════╝
```

### Crystal Projects View

```bash
pm-crystal-projects
```

**Output:**
```
📂 Crystal Projects (stable paths):

SINGULARITY/products:
  /Users/dmieloch/Dev/projects/SINGULARITY/products/brain-garden-os
  /Users/dmieloch/Dev/projects/SINGULARITY/products/cannabis-codex
  /Users/dmieloch/Dev/projects/SINGULARITY/products/scheduling-station

SINGULARITY/tools:
  /Users/dmieloch/Dev/projects/SINGULARITY/tools/cursor-tools
  /Users/dmieloch/Dev/projects/SINGULARITY/tools/mcp-servers

Copy these paths into Crystal - they won't change! ✅
```

---

## 🔒 Path Stability Guarantees

### Active Projects (CRITICAL - Paths NEVER Change)
- ✅ Products stay in `products/` forever
- ✅ Tools stay in `tools/` forever
- ✅ Platforms stay in `platforms/` forever
- ✅ Crystal configs don't need rebuilding
- ✅ IDE workspaces stay working
- ✅ Docker volumes paths stay valid
- ✅ Build configs stay valid

**Status changes via METADATA only:**
```bash
# Cannabis-codex path: projects/SINGULARITY/products/cannabis-codex
pm-pause cannabis-codex    # Status: paused (PATH UNCHANGED!)
pm-activate cannabis-codex # Status: active (PATH UNCHANGED!)
```

### Archived Projects (Path Break Acceptable)

**When archiving, ONE-TIME path change is fine:**
```bash
# Final move when truly done
pm-archive cheddar

# Moves: products/cheddar/ → archive/2024/cheddar/
# Path breaks, but you don't care - it's archived!
```

**Archive can be organized by year, category, etc:**
```
archive/
├── 2024/
│   ├── Q1/
│   │   ├── cheddar/
│   │   └── evisum/
│   ├── Q2/
│   │   └── wlmt/
│   └── Q3/
│       └── gratitude/
└── 2025/
    └── Q1/
        └── medical-supply/
```

**Why this is OK:**
- ✅ Archived = not actively developing
- ✅ Don't open in Crystal anymore
- ✅ Don't open in IDE anymore
- ✅ Just keeping code for reference
- ✅ Can organize by date/category without breaking workflow

---

## 🎯 PM Agent Commands

### Status-based queries (metadata)
```bash
pm-status --active              # What am I working on?
pm-status --paused              # What's on hold?
pm-status --shipped             # What's live?
pm-status --priority high       # High-priority projects
pm-status --worked-last-week    # Recently touched
```

### Location-based queries (folders)
```bash
pm-list products                # All products
pm-list tools                   # All tools
pm-list archive                 # Archived projects
pm-find crystal                 # Where is it? (never moves!)
```

### Status updates (metadata only)
```bash
pm-pause cannabis-codex         # Mark as paused (folder stays put!)
pm-activate parenting-pilot     # Mark as active (folder stays put!)
pm-ship brain-garden-os         # Mark as shipped (folder stays put!)
```

---

## 📊 Final Structure (Stable!)

```
projects/
├── WORK/
│   └── scala/                             # ← NEVER MOVES
│
├── LEGAL/
│   └── case-hero/                         # ← NEVER MOVES
│
├── SINGULARITY/
│   ├── products/                          # Customer-facing
│   │   ├── brain-garden-os/              # ← NEVER MOVES
│   │   ├── cannabis-codex/               # ← NEVER MOVES
│   │   ├── scheduling-station/           # ← NEVER MOVES
│   │   ├── vanacore/                     # ← NEVER MOVES
│   │   ├── parenting-pilot/              # ← NEVER MOVES (even when paused!)
│   │   └── medical-supply/               # ← NEVER MOVES
│   │
│   ├── tools/                             # Internal tooling
│   │   ├── cursor-tools/                 # ← NEVER MOVES
│   │   ├── mcp-servers/                  # ← NEVER MOVES
│   │   ├── parallel-claude/              # ← NEVER MOVES
│   │   └── knowledge/                    # ← NEVER MOVES
│   │
│   ├── platforms/                         # Infrastructure
│   │   ├── crystal/                      # ← NEVER MOVES (YOUR CRYSTAL FORK!)
│   │   ├── n8n/                          # ← NEVER MOVES
│   │   └── code-relay/                   # ← NEVER MOVES
│   │
│   ├── extensions/                        # Browser/IDE
│   │   ├── chrome-extensions/            # ← NEVER MOVES
│   │   └── vscode-extensions/            # ← NEVER MOVES
│   │
│   ├── templates/                         # Reusables
│   │   └── brain-garden-monorepo/        # ← NEVER MOVES
│   │
│   └── archive/                           # Done projects
│       ├── cheddar/                       # ← NEVER MOVES
│       ├── evisum/                        # ← NEVER MOVES
│       └── wlmt/                          # ← NEVER MOVES
│
└── LEARNING/
    ├── forks/                             # Forked repos
    └── experiments/                       # Experiments
```

**Every project has ONE permanent home.**

**Status tracked in metadata, not location.**

**Paths never break.** ✅

---

## 🚀 This Solves Everything

1. ✅ **Organized** - Clear, logical structure
2. ✅ **Stable** - Projects never move after initial setup
3. ✅ **Crystal-safe** - Absolute paths stay valid forever
4. ✅ **IDE-safe** - Workspaces don't break
5. ✅ **Docker-safe** - Volume paths stay valid
6. ✅ **Flexible status** - Change metadata anytime (paused ↔ active)
7. ✅ **PM agent intelligence** - Queries for "what's active" via metadata
8. ✅ **One-time migration** - Reorganize once, done forever

---

**This is THE solution.** Thoughts?
