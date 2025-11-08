# Project Reorganization Plan
**Generated:** 2025-11-07
**PM Agent Framework:** Active
**Total Projects:** 190
**Current Space:** 446.8 GB
**Target Space:** ~300 GB
**Recovery Goal:** 150 GB

---

## 🎯 Reorganization Goals

1. **Save 150GB of disk space** (through cleanup)
2. **Create ADHD-friendly structure** (easy navigation)
3. **Enable PM agent workflows** (automatic tracking)
4. **Reduce cognitive load** (clear organization)
5. **Prevent future bloat** (proactive monitoring)

---

## 📐 Target Folder Structure

Based on PM Agent BMAD framework (see `.pm-agent/docs/PM_AGENT_BMAD.md`):

```
/Users/dmieloch/Dev/
│
├── CLAUDE.md                           # PM Agent operating manual
├── STEVE_STARTUP.md                    # Welcome guide
├── README.md                           # Overview
├── CHANGELOG.md                        # What's been done
│
├── .pm-agent/                          # PM Agent workspace
│   ├── project-registry.json           # All project metadata
│   ├── todos/                          # Todo tracking system
│   ├── scripts/                        # Automation tools
│   ├── session-notes/                  # Session summaries
│   ├── screenshots/                    # Visual memory
│   └── docs/                           # Documentation
│       ├── PM_AGENT_BMAD.md
│       ├── TODO_FRAMEWORK.md
│       └── PROJECT_REORGANIZATION_PLAN.md (this file)
│
├── active/                             # 5-10 CURRENT projects only
│   ├── brain-garden-os/
│   ├── scheduling-station-app/
│   └── [max 8 more]
│
├── brain-garden/                       # Brain Garden ecosystem hub
│   ├── brain-garden-os/
│   ├── brain-garden-studio/
│   ├── project-brain-monorepo/
│   └── [all Brain Garden projects consolidated]
│
├── on-hold/                            # Paused projects (might return)
│   ├── parenting-copilot/
│   ├── scan-box/
│   └── [projects paused but not archived]
│
├── experiments/                        # Learning & prototypes
│   ├── [keep interesting experiments]
│   └── [remove node_modules from old ones]
│
├── learning/                           # Educational projects
│   ├── scala/
│   ├── notebooks/
│   └── code-challenges/
│
├── archive/                            # Completed/inactive projects
│   ├── 2024/
│   │   ├── Q1/
│   │   ├── Q2/
│   │   ├── Q3/
│   │   └── Q4/
│   └── 2025/
│       └── Q1/
│
└── _to-review/                         # Temporary staging (decide fate)
    ├── singularity-core/               # Contains 262 node_modules!
    ├── singularityApps/                # Contains 840 node_modules!
    └── [other legacy folders]
```

---

## 🚨 Critical Space Recovery Actions

### Phase 1: Safe & High Impact (130-150 GB Recovery)

#### 1.1 Remove node_modules from Stale Projects
**Target:** 50-60 GB recovery
**Risk:** ZERO (can reinstall anytime)

```bash
# Projects not touched in 6+ months
find ~/Dev -name "node_modules" -type d -mtime +180 \
  -exec du -sh {} \; \
  -exec rm -rf {} \;

# Specific high-value targets:
# - parenting-communication (181 days idle, large node_modules)
# - scala/* (many 6+ month old projects)
# - experiments/* (old learning projects)
```

**Estimated savings:** 50-60 GB

#### 1.2 Clean Up Worktree Nightmare
**Target:** 50-70 GB recovery
**Risk:** LOW (review first, then delete)

**CRITICAL FINDINGS:**
```
parenting-pilot: 205 worktrees (!!! Madone!)
crystal fork: 38 worktrees (DUPLICATED in two locations!)
plaid-datastore: 7 worktrees
muse-brain-controller: 6 worktrees
```

**Action Plan:**
```bash
# 1. PARENTING-PILOT (205 worktrees!)
cd singularity-core/parenting-pilot
git worktree list > ~/Dev/.pm-agent/worktree-audit-parenting.txt

# Review and keep only:
# - main worktree
# - 5-10 most recent feature branches
# Remove: ~195 worktrees

# Each worktree has full node_modules (~200MB)
# 195 * 200MB = ~40GB savings!

# 2. CRYSTAL FORK DUPLICATION
# Two copies of same project:
# - singularityApps/forks/crystal (19 worktrees)
# - singularity-core/crystal-fork (19 worktrees)

# Pick ONE location (probably singularity-core)
# Delete the other completely
# Savings: ~15-20GB

# 3. Other monorepos
# Review and clean up 5-7 worktree projects
# Keep max 3-5 worktrees per project
```

**Estimated savings:** 50-70 GB

#### 1.3 Docker System Cleanup
**Target:** 40-50 GB recovery
**Risk:** LOW (preserves active containers)

```bash
# One command cleanup
docker system prune -a --volumes

# This removes:
# - Unused images
# - Build cache
# - Dangling volumes
# - Preserves running containers

# Current Docker usage: 101.6 GB
# Expected recovery: 40-50 GB
```

**Phase 1 Total Recovery: 140-180 GB** ✅

---

### Phase 2: Project Organization (0 GB, but huge sanity gain!)

#### 2.1 Create New Folder Structure

```bash
# Create the new structure
cd ~/Dev
mkdir -p active brain-garden on-hold experiments learning archive/2024/{Q1,Q2,Q3,Q4} archive/2025/Q1 _to-review
```

#### 2.2 Move Projects Based on Activity

**Rules:**
- **active/**: Last worked < 30 days + currently developing
- **on-hold/**: Last worked 30-180 days + plan to return
- **archive/**: Last worked > 180 days OR completed
- **brain-garden/**: All Brain Garden ecosystem projects
- **experiments/**: Learning projects, POCs, experiments
- **learning/**: Educational projects (scala, notebooks, etc.)

**Automated Categorization:**
```bash
# Use PM agent's project registry to determine fate
node .pm-agent/scripts/categorize-projects.js --dry-run

# This will suggest moves based on:
# - lastWorkedDate
# - commitActivity
# - projectType
# - category in registry
```

#### 2.3 Specific Moves

**To active/:**
```
- scheduling-station-app (last worked: 15 days ago)
- parenting-copilot (if actively developing)
- [any project worked on in last 30 days]
```

**To brain-garden/:**
```
- brain-garden-os
- brain-garden-studio
- project-brain-monorepo
- [any Brain Garden related projects scattered around]
```

**To on-hold/:**
```
- scan-box (last worked: 3 months ago)
- parenting-communication (last worked: 181 days, but might return)
- [projects paused but planning to resume]
```

**To archive/2024/:**
```
- vpn-monitoring (last worked: 211 days)
- dot2dot-reborn (likely completed)
- [projects > 180 days AND no plans to resume]
```

**To learning/:**
```
- scala/ (learning projects)
- notebooks/ (jupyter notebooks)
- code-challenges/ (practice problems)
```

**To _to-review/:**
```
- singularity-core (262 node_modules - needs audit)
- singularityApps (840 node_modules - needs audit)
```

---

### Phase 3: Deep Cleaning Decisions (30-50 GB)

#### 3.1 Audit singularity-core & singularityApps

**Current state:**
- singularity-core: 138 GB, 262 node_modules
- singularityApps: 154 GB, 840 node_modules
- **Combined:** 292 GB (65% of Dev folder!)

**Questions to answer:**
1. Are these active monorepos?
2. How many projects are still relevant?
3. Can we consolidate?
4. Should we archive old sub-projects?

**Suggested approach:**
```bash
# 1. Inventory all sub-projects
find singularity-core singularityApps -name "package.json" -type f | \
  xargs -I {} dirname {} > ~/Dev/.pm-agent/singularity-inventory.txt

# 2. For each sub-project, check:
# - Last commit date
# - Last modified date
# - Size of node_modules

# 3. Categorize:
# - Active (keep node_modules)
# - Inactive (remove node_modules, keep code)
# - Archived (move to archive/)
# - Delete (truly abandoned, no value)
```

**Expected outcome:**
- Keep: 50 active sub-projects (~50GB with node_modules)
- Archive code only: 100 sub-projects (~20GB without node_modules)
- Delete: 40 abandoned experiments (~0GB, removed)

**Savings:** 30-50 GB

#### 3.2 Scala Folder Audit

**Current:** 67 GB (15% of Dev folder)

**Questions:**
1. Are you still learning Scala?
2. Which projects are valuable?
3. Can we remove node_modules/build artifacts?

**Suggested:**
- Move to learning/scala/
- Remove build artifacts from old projects
- Archive completed learning projects
- Keep only valuable reference projects

**Savings:** 10-20 GB

---

## 📊 Expected Results

### Before Reorganization
```
Total: 446.8 GB
Structure: Chaotic
Projects: 190 (scattered)
node_modules: 1,100+
Worktrees: 300+
Navigation: Difficult
ADHD-friendly: ❌
```

### After Reorganization
```
Total: ~290-300 GB (150GB saved!)
Structure: Organized
Projects: 190 (categorized)
node_modules: ~200 (only active projects)
Worktrees: ~50 (only needed)
Navigation: Easy
ADHD-friendly: ✅
```

---

## 🤖 PM Agent Integration

### Automatic Monitoring

PM agent will maintain this structure by:

1. **Daily scans**
   ```javascript
   // Check for projects that should move categories
   if (project.lastWorked > 30 days && location === 'active/') {
     suggest('Move to on-hold/', project);
   }
   ```

2. **Space alerts**
   ```javascript
   // Proactive cleanup suggestions
   if (project.nodeModules > 2GB && project.lastWorked > 180 days) {
     suggest('Remove node_modules to save space', project);
   }
   ```

3. **Worktree monitoring**
   ```javascript
   // Prevent worktree explosion
   if (project.worktreeCount > 10) {
     alert('Consider cleaning up worktrees', project);
   }
   ```

4. **Weekly reports**
   ```markdown
   # Weekly Space Report

   📊 This Week:
   - Space saved: 15GB (old node_modules removed)
   - Projects archived: 3
   - Active projects: 7 (within limit!)

   💡 Suggestions:
   - parenting-copilot hasn't been touched in 45 days. Move to on-hold?
   - Docker images accumulated 5GB. Run prune?
   ```

---

## 🚀 Execution Plan

### Step 1: Preparation (Do First)
```bash
# 1. Create comprehensive backup
# (Optional but recommended for peace of mind)

# 2. Create new folder structure
cd ~/Dev
mkdir -p active brain-garden on-hold experiments learning archive/2024/{Q1,Q2,Q3,Q4} archive/2025/Q1 _to-review

# 3. Initialize todo tracking for this session
node .pm-agent/scripts/todo-manager.js start-session
node .pm-agent/scripts/todo-manager.js add "Complete Phase 1 space cleanup"
node .pm-agent/scripts/todo-manager.js add "Reorganize projects into new structure"
node .pm-agent/scripts/todo-manager.js add "Audit singularity folders"
```

### Step 2: Phase 1 Execution (Space Recovery)
```bash
# 2.1 Create audit scripts
node .pm-agent/scripts/create-cleanup-script.js

# This will generate:
# - cleanup-stale-node-modules.sh
# - cleanup-worktrees.sh
# - cleanup-docker.sh

# 2.2 Review generated scripts (IMPORTANT!)
cat .pm-agent/scripts/generated/cleanup-stale-node-modules.sh

# 2.3 Execute (after review)
bash .pm-agent/scripts/generated/cleanup-stale-node-modules.sh
bash .pm-agent/scripts/generated/cleanup-worktrees.sh
bash .pm-agent/scripts/generated/cleanup-docker.sh

# 2.4 Verify space recovery
df -h ~/Dev
```

### Step 3: Phase 2 Execution (Organization)
```bash
# 3.1 Generate move script from project registry
node .pm-agent/scripts/generate-move-script.js --output .pm-agent/scripts/generated/move-projects.sh

# 3.2 Review (CRITICAL - check destinations)
cat .pm-agent/scripts/generated/move-projects.sh

# 3.3 Execute moves
bash .pm-agent/scripts/generated/move-projects.sh

# 3.4 Update project registry with new paths
node .pm-agent/scripts/scan-projects.js --update-paths
```

### Step 4: Phase 3 Execution (Deep Cleaning)
```bash
# 4.1 Audit singularity folders
node .pm-agent/scripts/audit-monorepos.js \
  --targets singularity-core,singularityApps \
  --output .pm-agent/singularity-audit.json

# 4.2 Review audit results (interactive)
node .pm-agent/scripts/review-audit.js

# 4.3 Execute decisions
node .pm-agent/scripts/execute-audit-decisions.js
```

### Step 5: Verification & Documentation
```bash
# 5.1 Rescan projects with new structure
node .pm-agent/scripts/scan-projects.js

# 5.2 Verify space savings
df -h ~/Dev
docker system df

# 5.3 Generate completion report
node .pm-agent/scripts/generate-report.js \
  --type reorganization \
  --output .pm-agent/REORGANIZATION_COMPLETE_REPORT.md

# 5.4 Capture accomplishments
node .pm-agent/scripts/todo-manager.js summary
```

---

## ✅ Success Criteria

**Space:**
- [ ] Recovered 150+ GB of disk space
- [ ] Dev folder under 300 GB
- [ ] System disk usage below 75%

**Organization:**
- [ ] All projects categorized (active/on-hold/archive)
- [ ] Max 10 projects in active/
- [ ] Brain Garden projects consolidated
- [ ] Clear folder structure visible

**Maintainability:**
- [ ] PM agent scanning new structure successfully
- [ ] Todo system tracking all changes
- [ ] Project registry updated with new paths
- [ ] Documentation complete

**Developer Experience:**
- [ ] Easy to find any project
- [ ] Context switching painless
- [ ] No more worktree nightmares
- [ ] ADHD-friendly navigation

---

## 🎓 Lessons for Future

### Prevent Worktree Explosion
```bash
# Add to .pm-agent/scripts/health-monitor.js
function checkWorktreeCount(project) {
  const count = getWorktreeCount(project);
  if (count > 10) {
    alert(`⚠️  ${project.name} has ${count} worktrees. Consider cleanup.`);
  }
}
```

### Proactive node_modules Management
```bash
# Weekly cleanup of stale dependencies
node .pm-agent/scripts/weekly-cleanup.js

# Automatically removes node_modules from:
# - Projects not touched in 90+ days
# - Archived projects
# - Experiments older than 6 months
```

### Space Monitoring
```bash
# PM agent daily check
if (devFolderSize > 400GB) {
  alert('Dev folder exceeding 400GB. Time for cleanup!');
  suggest(getCleanupOpportunities());
}
```

---

## 🤝 Next Steps

1. **Review this plan** - Make sure you agree with categorizations
2. **Create cleanup scripts** - Generate automation for Phase 1
3. **Execute Phase 1** - Safe space recovery (150GB)
4. **Execute Phase 2** - Project reorganization
5. **Execute Phase 3** - Deep cleaning audit
6. **Verify & celebrate** - You'll have a clean, organized Dev folder!

**Estimated time:** 2-3 hours (mostly automated)
**Impact:** MASSIVE improvement in organization and space
**Long-term benefit:** PM agent keeps it clean forever

---

**Ready to transform your Dev folder?** 🚀

Let's start with Phase 1 - the safe, high-impact cleanup!
