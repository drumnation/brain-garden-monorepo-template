# FINAL MODEL - Stable Paths + Metadata Tracking

**CRITICAL RULE:** Projects NEVER move. State is METADATA ONLY.

---

## ❌ WRONG (What I Keep Suggesting)

```
APPS/
├── using/          # ❌ Projects move here when you start using them
├── building/       # ❌ Projects move here when actively developing
└── reference/      # ❌ Projects move here when superseded
```

**Why this is WRONG:**
- Moving cannabis-codex from building/ → using/ breaks paths
- Crystal configs break
- IDE workspaces break
- Docker volumes break
- ANY state change = paths break

---

## ✅ RIGHT (Final Answer)

### Structure: Based on STABLE Characteristics

```
projects/
├── WORK/                    # Domain: Day job (STABLE)
│   └── scala/              # ← NEVER MOVES
│
├── APPS/                    # Type: Your apps (STABLE)
│   ├── cannabis-codex/     # ← NEVER MOVES (even when state changes!)
│   ├── scheduling-station/ # ← NEVER MOVES
│   ├── parenting-pilot/    # ← NEVER MOVES
│   ├── medical-billing/    # ← NEVER MOVES
│   ├── case-hero/          # ← NEVER MOVES
│   └── vanacore/           # ← NEVER MOVES
│
├── TOOLS/                   # Type: Tools you built (STABLE)
│   ├── crystal/            # ← NEVER MOVES
│   ├── cursor-tools/       # ← NEVER MOVES
│   ├── mcp-servers/        # ← NEVER MOVES
│   └── parallel-claude/    # ← NEVER MOVES
│
└── LEARNING/                # Type: Clones/experiments (STABLE)
    ├── n8n/                # ← NEVER MOVES
    └── forks/              # ← NEVER MOVES
```

### State: Tracked in METADATA ONLY

```json
{
  "projects": [
    {
      "name": "cannabis-codex",
      "path": "projects/APPS/cannabis-codex",  // NEVER CHANGES

      "lifecycle": "using",           // ← METADATA ONLY
      "lastUsed": "2025-11-07",
      "usageFrequency": "daily",
      "realData": true,
      "dataVolume": "847 strains"
    },
    {
      "name": "parenting-pilot",
      "path": "projects/APPS/parenting-pilot",  // NEVER CHANGES

      "lifecycle": "building",        // ← METADATA ONLY
      "daysBuilding": 78,
      "gettingThere": false
    },
    {
      "name": "scheduling-station",
      "path": "projects/APPS/scheduling-station",  // NEVER CHANGES

      "lifecycle": "building",        // ← METADATA ONLY
      "gettingThere": true,
      "almostReady": true
    }
  ]
}
```

---

## 🎯 How This Actually Works

### When State Changes (Path UNCHANGED!)

```bash
# Cannabis-codex goes from building → using
pm-promote cannabis-codex

# What happens:
# 1. Update metadata: lifecycle: "building" → "using"
# 2. Path: projects/APPS/cannabis-codex (UNCHANGED!)
# 3. Crystal configs: Still work ✅
# 4. IDE workspaces: Still work ✅
# 5. Docker volumes: Still work ✅

✅ State changed, path didn't!
```

### PM Agent Shows State via Queries

```bash
pm-list --using

# Output:
🟢 USING (5 apps):

  projects/APPS/cannabis-codex
    └─ Daily use, 847 strains, last used today

  projects/APPS/medical-billing
    └─ Active, 200 records, last used 3 days ago

  projects/TOOLS/cursor-focus-ts
    └─ Daily use, 203 opens this week

# Paths are stable, state comes from metadata!
```

```bash
pm-list --building

# Output:
🔨 BUILDING (3 apps):

  projects/APPS/scheduling-station
    └─ 45 days building, 20 opens, getting close!

  projects/APPS/parenting-pilot
    └─ 78 days building, 2 opens, stalled ⚠️

  projects/APPS/case-hero
    └─ 15 days building, client work
```

---

## 📋 Version Tracking (Still No Moving!)

### Old Versions Live in Same Location

```
projects/APPS/
├── parenting-pilot/              # ← Current version
├── parenting-pilot-v2/           # ← Old version (reference)
└── parenting-pilot-v1/           # ← Older version (reference)
```

**Each has its own folder, NEVER moves:**

```json
{
  "appFamily": "parenting-pilot",
  "versions": [
    {
      "name": "parenting-pilot",
      "path": "projects/APPS/parenting-pilot",  // NEVER CHANGES
      "version": 3,
      "lifecycle": "building",
      "isCurrent": true
    },
    {
      "name": "parenting-pilot-v2",
      "path": "projects/APPS/parenting-pilot-v2",  // NEVER CHANGES
      "version": 2,
      "lifecycle": "reference",
      "supersededBy": "parenting-pilot",
      "usefulPatterns": ["Auth flow", "RN setup"],
      "extracted": false
    },
    {
      "name": "parenting-pilot-v1",
      "path": "projects/APPS/parenting-pilot-v1",  // NEVER CHANGES
      "version": 1,
      "lifecycle": "reference",
      "supersededBy": "parenting-pilot-v2",
      "usefulPatterns": ["Voice recording"],
      "extracted": true,
      "canDelete": true  // Patterns extracted, safe to delete
    }
  ]
}
```

---

## 🗑️ Deletion is the ONLY Move

**ONLY time paths change: When deleting (one-way, final)**

```bash
pm-delete parenting-pilot-v1

# Confirms:
"Delete parenting-pilot-v1?
  • Patterns extracted: Yes ✅
  • Superseded by: v2, v3
  • Safe to delete: Yes ✅

This will:
  1. Move to .pm-agent/deleted/ (30-day safety)
  2. Permanently delete after 30 days

Continue? (y/n)"
```

**Safety deleted folder:**
```
.pm-agent/
└── deleted/
    └── 2025-11/
        └── parenting-pilot-v1/  # 30-day grace period
```

---

## 🎯 PM Agent Commands (Metadata Queries)

### Query by State
```bash
pm-list --using           # Show apps you're using
pm-list --building        # Show apps in development
pm-list --reference       # Show old versions kept for patterns
pm-list --abandoned       # Show failed attempts

# All return PATHS (which never change)
# State comes from metadata
```

### Update State (Metadata Only)
```bash
pm-set-using cannabis-codex
# Updates: lifecycle: "using"
# Path: UNCHANGED

pm-set-reference parenting-pilot-v2
# Updates: lifecycle: "reference"
# Path: UNCHANGED
```

### Track Progression
```bash
pm-track scheduling-station

# Shows history:
"scheduling-station progression:

  2025-09-23: Created (lifecycle: building)
  2025-10-15: First real data (5 appointments)
  2025-11-01: Usage increasing (15 appointments)
  2025-11-07: High usage! (20 opens in 30 days)

  Recommendation: Promote to 'using' soon!"

# Path never changed: projects/APPS/scheduling-station
```

---

## 🏗️ Final Structure (One-Time Setup)

```
projects/
├── WORK/
│   └── scala/                        # Day job
│
├── APPS/                              # All your apps (STABLE PATHS)
│   ├── brain-garden-os/              # App (state in metadata)
│   ├── cannabis-codex/               # App (state in metadata)
│   ├── cannabis-codex-v1/            # Old version (reference)
│   ├── scheduling-station/           # App (state in metadata)
│   ├── medical-billing/              # App (state in metadata)
│   ├── parenting-pilot/              # App v3 (state in metadata)
│   ├── parenting-pilot-v2/           # Old version (reference)
│   ├── parenting-pilot-v1/           # Older version (can delete)
│   ├── case-hero/                    # App (state in metadata)
│   ├── vanacore/                     # App (state in metadata)
│   └── [all your other apps]         # Each has STABLE PATH
│
├── TOOLS/                             # Tools you built (STABLE PATHS)
│   ├── crystal/                      # YOUR CRYSTAL FORK
│   ├── cursor-tools/
│   ├── mcp-servers/
│   ├── parallel-claude/
│   └── knowledge/
│
└── LEARNING/                          # Clones/experiments (STABLE PATHS)
    ├── n8n/
    ├── forks/
    └── experiments/
```

**Every project gets ONE location. FOREVER.**

---

## 📊 project-registry.json (The Intelligence)

```json
{
  "projects": [
    {
      "name": "cannabis-codex",
      "path": "projects/APPS/cannabis-codex",
      "type": "app",

      "lifecycle": {
        "state": "using",
        "stateHistory": [
          { "date": "2025-07-15", "state": "building" },
          { "date": "2025-08-30", "state": "using" }
        ]
      },

      "usage": {
        "lastUsed": "2025-11-07",
        "frequency": "daily",
        "opens": 247,
        "realData": true,
        "dataVolume": "847 strains"
      },

      "version": {
        "current": true,
        "number": 1,
        "previousVersions": []
      }
    },
    {
      "name": "parenting-pilot",
      "path": "projects/APPS/parenting-pilot",
      "type": "app",

      "lifecycle": {
        "state": "building",
        "stateHistory": [
          { "date": "2025-08-21", "state": "building" }
        ],
        "daysInState": 78,
        "gettingThere": false,
        "recommendation": "Consider v4 or pivot to n8n"
      },

      "usage": {
        "lastUsed": "2025-08-25",
        "frequency": "rare",
        "opens": 2,
        "realData": false
      },

      "version": {
        "current": true,
        "number": 3,
        "previousVersions": [
          "parenting-pilot-v2",
          "parenting-pilot-v1"
        ]
      }
    },
    {
      "name": "parenting-pilot-v2",
      "path": "projects/APPS/parenting-pilot-v2",
      "type": "app",

      "lifecycle": {
        "state": "reference",
        "supersededBy": "parenting-pilot",
        "usefulPatterns": [
          "Authentication with Clerk",
          "React Native setup"
        ],
        "extracted": false,
        "canDelete": false
      },

      "version": {
        "current": false,
        "number": 2,
        "supersededBy": "parenting-pilot"
      }
    }
  ]
}
```

---

## 🎯 The Rules (FINAL)

### 1. Folder Structure = STABLE TYPE
- WORK/ = day job
- APPS/ = your apps
- TOOLS/ = tools you built
- LEARNING/ = clones/experiments

### 2. State = METADATA ONLY
- using, building, reference, abandoned
- Tracked in project-registry.json
- NEVER in folder names
- NEVER requires moving

### 3. Paths NEVER Change
- projects/APPS/cannabis-codex
- ALWAYS stays there
- Crystal configs work forever
- IDE workspaces work forever

### 4. Query by State, Not Location
```bash
pm-list --using         # Show paths + metadata
pm-list --building      # Show paths + metadata
pm-list --reference     # Show paths + metadata
```

### 5. Deletion is One-Way
- ONLY move when deleting permanently
- 30-day grace period in .pm-agent/deleted/
- Then gone forever

---

## ✅ This Finally Solves Everything

1. ✅ **Stable paths** - Crystal/IDE never break
2. ✅ **Track lifecycle** - using/building/reference in metadata
3. ✅ **Version tracking** - v1, v2, v3 each have own stable path
4. ✅ **Query by state** - pm-list --using shows what you're using
5. ✅ **NO moving** - State changes = metadata update only
6. ✅ **Simple structure** - APPS/, TOOLS/, LEARNING/ (by type, not state)
7. ✅ **One-time setup** - Reorganize once, paths stable forever

---

**THIS IS IT. No more moving projects around!**

State = metadata. Paths = forever stable. 🎯
