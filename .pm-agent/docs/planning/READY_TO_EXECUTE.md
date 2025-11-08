# Ready to Execute - Complete Migration Plan

**Status:** All analysis complete, waiting on final space numbers from intelligent scan

---

## ✅ Decisions Made

1. **Organization:** Stable domain-based structure (projects stay put)
2. **Crystal:** `/Users/dmieloch/Dev/singularity-core/crystal-fork` is the keeper
3. **Worktrees:** Clean up 200+ in parenting-pilot
4. **Parenting:** Evaluate n8n approach vs custom app (11.6GB at stake)
5. **Archive:** dot2dot-reborn, old parenting versions
6. **Git:** Version control PM agent system, not projects
7. **Path stability:** Active projects NEVER move, only archives can move

---

## 📐 Final Structure

```
Dev/                                   # Git repo root
├── .git/                             # Tracks PM agent only
├── .gitignore                        # Ignores /projects
├── CLAUDE.md                         # ✅ Tracked
├── STEVE_STARTUP.md                  # ✅ Tracked
├── README.md                         # ✅ Tracked
├── .pm-agent/                        # ✅ Tracked
│   ├── project-registry.json         # ✅ Tracked (metadata only)
│   ├── todos/                        # ✅ Tracked
│   ├── scripts/                      # ✅ Tracked
│   └── docs/                         # ✅ Tracked
│
└── projects/                         # ❌ NOT tracked (.gitignored)
    ├── WORK/
    │   └── scala/                    # ← Stays here forever
    │
    ├── LEGAL/
    │   └── case-hero/                # ← Stays here forever
    │
    ├── SINGULARITY/
    │   ├── products/                 # Customer-facing (STABLE PATHS)
    │   │   ├── brain-garden-os/     # ← Never moves
    │   │   ├── cannabis-codex/      # ← Never moves
    │   │   ├── scheduling-station/  # ← Never moves
    │   │   ├── vanacore/            # ← Never moves
    │   │   └── parenting-pilot/     # ← Never moves (even when paused!)
    │   │
    │   ├── tools/                    # Internal tooling (STABLE PATHS)
    │   │   ├── cursor-tools/        # ← Never moves
    │   │   ├── mcp-servers/         # ← Never moves
    │   │   ├── parallel-claude/     # ← Never moves
    │   │   └── knowledge/           # ← Never moves
    │   │
    │   ├── platforms/                # Infrastructure (STABLE PATHS)
    │   │   ├── crystal/             # ← NEVER MOVES (your crystal fork!)
    │   │   ├── n8n/                 # ← Never moves
    │   │   └── code-relay/          # ← Never moves
    │   │
    │   ├── extensions/               # Browser/IDE (STABLE PATHS)
    │   │   ├── chrome-extensions/
    │   │   └── vscode-extensions/
    │   │
    │   ├── templates/                # Reusables (STABLE PATHS)
    │   │   └── brain-garden-monorepo/
    │   │
    │   └── archive/                  # Done projects (CAN MOVE)
    │       ├── 2024/
    │       │   ├── Q1/ (cheddar, evisum)
    │       │   ├── Q2/ (wlmt)
    │       │   └── Q3/ (gratitude)
    │       └── 2025/
    │           └── Q1/ (dot2dot, old parenting versions)
    │
    └── LEARNING/
        ├── forks/
        └── experiments/
```

---

## 🚀 Execution Phases

### Phase 0: Backup & Safety (CRITICAL)
```bash
# 1. Take Time Machine snapshot (if available)
# 2. Or create tar backup
tar -czf ~/Desktop/dev-backup-$(date +%Y%m%d).tar.gz ~/Dev

# 3. Initialize git FIRST (before moving anything)
cd ~/Dev
cat > .gitignore << 'EOF'
/projects/
/src/
node_modules/
.DS_Store
.env
EOF

git init
git add .gitignore CLAUDE.md STEVE_STARTUP.md README.md .pm-agent/
git commit -m "Initial PM agent system"
```

---

### Phase 1: Create Structure (5 min)
```bash
# Create projects/ folder structure
mkdir -p projects/{WORK,LEGAL,SINGULARITY,LEARNING}
mkdir -p projects/SINGULARITY/{products,tools,platforms,extensions,templates,archive}
mkdir -p projects/SINGULARITY/archive/{2024/{Q1,Q2,Q3,Q4},2025/Q1}
mkdir -p projects/WORK/{active,reference,archive}
mkdir -p projects/LEGAL/{active,templates,closed}
mkdir -p projects/LEARNING/{forks,experiments}

# Commit structure (empty folders)
git add projects/
git commit -m "Add projects folder structure"
```

---

### Phase 2: Move High-Value Items (30 min)

**Order matters - most important first (minimize risk):**

#### 2.1 Crystal (MOST CRITICAL)
```bash
# THE crystal fork (your main one)
mv singularity-core/crystal-fork projects/SINGULARITY/platforms/crystal

# Delete duplicates
rm -rf singularity-core/crystal
rm -rf singularityApps/forks/crystal
rm -rf experiments/crystal

# Update registry
node .pm-agent/scripts/scan-projects.js --update-paths

# Commit metadata change
git add .pm-agent/project-registry.json
git commit -m "Move crystal-fork to platforms/ (stable path)"
```

**After this, rebuild Crystal projects with new path:**
```
/Users/dmieloch/Dev/projects/SINGULARITY/platforms/crystal
```

#### 2.2 Core Products (Active Development)
```bash
# Brain Garden products
mv singularityApps/core/brain-garden-os projects/SINGULARITY/products/
mv singularityApps/core/brain-garden-studio projects/SINGULARITY/products/

# Cannabis Codex
mv singularity-core/cannabiscodex projects/SINGULARITY/products/cannabis-codex

# Scheduling Station (the repurposed one)
mv singularity-core/scheduling-station projects/SINGULARITY/products/scheduling-station

# Vanacore
mv singularity-core/vanacore-monorepo projects/SINGULARITY/products/vanacore

# Update & commit
node .pm-agent/scripts/scan-projects.js --update-paths
git add .pm-agent/project-registry.json
git commit -m "Move active products to products/ (stable paths)"
```

#### 2.3 Essential Tools
```bash
# Cursor tools
mv singularityApps/cursor-tools projects/SINGULARITY/tools/

# MCP servers
mv singularityApps/mcp-servers projects/SINGULARITY/tools/

# Parallel Claude
mv singularity-core/parallel-claude projects/SINGULARITY/tools/

# Knowledge
mv singularity-core/knowledge projects/SINGULARITY/tools/

# Update & commit
node .pm-agent/scripts/scan-projects.js --update-paths
git add .pm-agent/project-registry.json
git commit -m "Move tools to tools/ (stable paths)"
```

#### 2.4 Work & Legal (Simple)
```bash
# Work
mv scala projects/WORK/active/

# Legal
mv legalDocumentsAI projects/LEGAL/active/

# Update & commit
git add .pm-agent/project-registry.json
git commit -m "Move work and legal projects"
```

---

### Phase 3: Parenting Decision Point (STOP HERE)

**At this point, STOP and decide:**

Option A: Keep custom app
```bash
mv singularity-core/parenting-pilot projects/SINGULARITY/products/

# Clean worktrees (keep main + 3 active)
cd projects/SINGULARITY/products/parenting-pilot
git worktree list > ~/Desktop/parenting-worktrees.txt
# Review, then delete old ones

# Delete old versions
rm -rf singularityApps/parenting/parenting-pilot-monorepo  # 5.6GB
rm -rf singularityApps/parenting/parenting-pilot           # 878MB
rm -rf singularityApps/coparenting-copilot-monorepo        # 2.6GB (unless email feature unique)

# Space saved: ~9GB
```

Option B: Pivot to n8n
```bash
mv experiments/n8n projects/SINGULARITY/tools/

# Archive all custom versions
mv singularity-core/parenting-pilot projects/SINGULARITY/archive/2025/Q1/
mv singularityApps/parenting/parenting-pilot-monorepo projects/SINGULARITY/archive/2025/Q1/
mv singularityApps/parenting/parenting-pilot projects/SINGULARITY/archive/2025/Q1/
mv singularityApps/coparenting-copilot-monorepo projects/SINGULARITY/archive/2025/Q1/

# Space saved when you eventually delete: 11.6GB
```

**Your call!**

---

### Phase 4: Cleanup & Archive (1-2 hours)

#### 4.1 Archive Old Projects
```bash
# dot2dot
mv dot2dot-reborn projects/SINGULARITY/archive/2025/Q1/

# Old LLC projects from singularityApps/0. archived/
mv singularityApps/0.\ archived/cheddar projects/SINGULARITY/archive/2024/Q2/
mv singularityApps/0.\ archived/evisum projects/SINGULARITY/archive/2024/Q1/
mv singularityApps/0.\ archived/wlmt projects/SINGULARITY/archive/2024/Q2/
mv singularityApps/0.\ archived/gratitude projects/SINGULARITY/archive/2024/Q3/
```

#### 4.2 Delete Duplicates & Temporary Projects
```bash
# Crystal duplicates (already deleted in 2.1)

# Root level accidents
mv scan-box projects/SINGULARITY/tools/  # Or delete if not needed
mv vpn-monitoring projects/SINGULARITY/tools/  # Or delete if not needed

# Delete experiments that are just clones (if not modified)
# Review experiments/ folder, delete unmodified clones
```

#### 4.3 Worktree Cleanup (BIG SPACE SAVINGS)
```bash
# For EACH project with worktrees:
find projects -name "worktrees" -type d

# For each one:
cd <project-path>
git worktree list
# Keep main + 5 active
# Delete old/merged branches

# Estimated: 50-70GB recovered
```

#### 4.4 Delete Stale node_modules (BIG SPACE SAVINGS)
```bash
# Find projects not touched in 180+ days
node .pm-agent/scripts/find-stale-node-modules.js

# Delete their node_modules
# Estimated: 40-50GB recovered
```

---

### Phase 5: Dissolve singularity-core & singularityApps (30 min)

**At this point, most projects are moved. Clean up what's left:**

```bash
# Audit what's left
ls -la singularity-core/
ls -la singularityApps/

# Move remaining valuable projects to appropriate locations
# Delete empty folders
# Delete duplicates
# Archive old projects

# When both folders are empty:
rmdir singularity-core
rmdir singularityApps
```

---

### Phase 6: Final Verification (15 min)

```bash
# 1. Scan for any remaining projects at root level
ls -d */ | grep -v projects | grep -v .pm-agent

# 2. Update registry with final state
node .pm-agent/scripts/scan-projects.js --full-scan

# 3. Verify Crystal paths
ls -la projects/SINGULARITY/platforms/crystal

# 4. Commit final state
git add .pm-agent/
git commit -m "Final reorganization complete

Summary:
- 190 projects reorganized
- Stable structure (projects never move)
- Crystal path: projects/SINGULARITY/platforms/crystal
- Space recovered: ~150GB (estimated)
- singularity-core dissolved
- singularityApps dissolved
"

# 5. Create GitHub repo (optional)
gh repo create dev-pm-agent --private
git remote add origin <your-repo-url>
git push -u origin main
```

---

## 🎯 Success Criteria

After migration, you should have:

1. ✅ All projects in organized locations
2. ✅ Stable paths (Crystal works, IDEs work)
3. ✅ Clear structure (easy to find things)
4. ✅ PM agent tracking everything
5. ✅ Git repo for PM agent system
6. ✅ 100-150GB space recovered
7. ✅ No root-level project chaos
8. ✅ No singularity-core dumping ground
9. ✅ No singularityApps crowding
10. ✅ Ready for sustainable maintenance

---

## 📋 Post-Migration Tasks

### Rebuild Crystal Projects (ONE TIME)
```bash
# Open Crystal
# Remove all old project paths
# Add new stable paths:
/Users/dmieloch/Dev/projects/SINGULARITY/products/brain-garden-os
/Users/dmieloch/Dev/projects/SINGULARITY/products/cannabis-codex
/Users/dmieloch/Dev/projects/SINGULARITY/products/scheduling-station
# etc.

# Save Crystal config
# DONE - paths will never change again!
```

### Update IDE Workspaces (if needed)
```bash
# VSCode, Cursor, etc. might have old paths
# Update workspace files with new paths
# One time fix, then stable forever
```

### PM Agent Maintenance Rules
```bash
# Weekly
pm-status --stale                     # Check for inactive projects
pm-cleanup --suggest                  # Get cleanup suggestions

# Monthly
pm-space-analysis                     # Check space usage
pm-worktree-audit                     # Check for worktree explosion

# When archiving
pm-archive <project-name>             # Handles move to archive/
```

---

## 🎉 Final Result

```
Before:
- 446GB, chaotic, hard to find things
- Projects everywhere
- Duplicates, worktrees everywhere
- No structure

After:
- ~290GB, organized, easy navigation
- Clear structure
- Stable paths (Crystal works!)
- PM agent maintains it
- Git-tracked metadata
- Sustainable forever
```

---

**Ready to execute?**

Let me know and I'll walk through it step by step! 🚀

Or wait for the intelligent scan to finish for exact space numbers.
