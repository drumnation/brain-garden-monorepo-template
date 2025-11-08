# Better Organization System - Sustainable & Clear

**Problem:** Current system gets disorganized within months. Need something that stays organized with minimal effort.

**Current Structure (What You Told Me):**
```
Dev/
├── legalDocumentsAI/         # Legal projects (Cursor work)
├── scala/                    # Day job
├── singularity-core/         # Personal LLC projects
├── singularityApps/          # More personal LLC projects
├── experiments/              # Cloned repos, some graduate
└── [root level accidents]    # Projects added at root by mistake
```

**Problems:**
1. **No clear rules** - Where does a new project go?
2. **singularity-core becomes dumping ground** - Gets messy fast
3. **experiments unclear** - When/how do things graduate?
4. **Root level accidents** - No enforcement of structure
5. **Within months it's chaos** - Not sustainable

---

## 🎯 Proposed System: Context-Based + Status-Based

**Key Principle:** Every project has TWO attributes:
1. **Context** (WHO/WHAT) - Legal, Work, Personal, Learning
2. **Status** (STAGE) - Active, Experimental, On-Hold, Done

This creates a **matrix** that's clear and sustainable.

### New Structure

```
Dev/
│
├── WORK/                                  # Day job (Scala)
│   ├── active/                           # Currently working on
│   ├── reference/                        # Keep for reference
│   └── archive/                          # Done, keep for history
│
├── LEGAL/                                 # Legal projects
│   ├── active/                           # Active cases
│   ├── templates/                        # Reusable templates
│   └── archive/                          # Completed cases
│
├── SINGULARITY/                           # Personal LLC
│   ├── active/                           # Current products
│   │   ├── brain-garden-os/
│   │   ├── scheduling-station/
│   │   └── cannabis-codex/
│   ├── experiments/                      # Trying new ideas
│   ├── templates/                        # Reusable templates
│   ├── libraries/                        # Shared libraries
│   └── archive/                          # Done projects
│
├── LEARNING/                              # Education & experiments
│   ├── experiments/                      # Cloned repos, trying things
│   ├── tutorials/                        # Following tutorials
│   ├── courses/                          # Course projects
│   └── sandbox/                          # Quick tests
│
└── PERSONAL/                              # Personal projects (non-LLC)
    ├── active/
    ├── side-projects/
    └── archive/
```

---

## 📏 Clear Rules - Where Does It Go?

### Decision Tree

**Step 1: What context?**
- Day job code? → `WORK/`
- Legal client work? → `LEGAL/`
- Personal LLC product? → `SINGULARITY/`
- Learning/experimenting? → `LEARNING/`
- Personal (non-LLC)? → `PERSONAL/`

**Step 2: What status?**
- Actively developing? → `active/`
- Trying something out? → `experiments/`
- Done but keeping? → `archive/`
- Templates for reuse? → `templates/`

**Example:**
- Brain Garden (LLC product, active) → `SINGULARITY/active/brain-garden-os/`
- Cloned tutorial repo → `LEARNING/experiments/nextjs-tutorial/`
- Legal template → `LEGAL/templates/custody-agreement-template/`
- Scala day job project → `WORK/active/analytics-pipeline/`

---

## 🔄 Graduation Paths

### From Experiments to Real Projects

**Rule:** If you create a GitHub repo, it graduates from experiments.

```bash
# Start: Clone someone's repo
LEARNING/experiments/cool-nextjs-thing/

# After: You fork it, add features, create your own repo
→ SINGULARITY/active/my-nextjs-product/

# If it's just learning:
→ LEARNING/tutorials/nextjs-learned-from-cool-thing/
   (delete the clone, keep your notes)
```

**PM Agent Auto-Detection:**
```javascript
// If in experiments/ and has new GitHub remote with your username
if (inExperiments && hasGitRemote && remoteOwner === 'dmieloch') {
  suggest(`Move to SINGULARITY/active/${repoName}?`);
}
```

---

## 🚫 Preventing Disorganization

### Rule 1: No Root-Level Projects
**PM Agent enforces this:**
```javascript
// On git clone or new project
if (projectPath === `${devFolder}/${projectName}`) {
  block('Cannot create project at root level!');
  suggest('Choose a context: WORK, LEGAL, SINGULARITY, LEARNING, or PERSONAL');
}
```

### Rule 2: Active Folder Limits
**Keep active folders manageable:**
```javascript
// Max projects per active/ folder
const limits = {
  'SINGULARITY/active': 8,
  'LEGAL/active': 5,
  'WORK/active': 5,
  'LEARNING/experiments': 15  // Higher for experiments
};

if (activeProjects > limit) {
  alert(`${context}/active has ${activeProjects} projects (limit: ${limit})`);
  suggest('Move some to on-hold/ or archive/?');
}
```

### Rule 3: Monthly Maintenance
**PM Agent weekly reminder:**
```markdown
🧹 Weekly Cleanup Reminder:

SINGULARITY/experiments: 12 projects
  - 7 haven't been touched in 2+ months → Archive?
  - 3 have your GitHub repos → Graduate to active/?
  - 2 are still experimental → Keep

Action needed? (y/n)
```

---

## 🔧 singularity-core & singularityApps Migration

**Current Problem:** These became dumping grounds with 262 and 840 node_modules respectively!

**Solution: Dissolve them into new structure**

```bash
# Audit what's in there:
singularity-core/
  ├── brain-garden-os/        → SINGULARITY/active/
  ├── parenting-pilot/        → SINGULARITY/active/
  ├── old-experiment-1/       → SINGULARITY/archive/
  ├── old-experiment-2/       → DELETE (no value)
  └── random-clone/           → LEARNING/experiments/ or DELETE

singularityApps/
  ├── cannabis-codex/         → SINGULARITY/active/
  ├── scheduling-station/     → SINGULARITY/active/
  ├── [40+ old projects]      → AUDIT individually
```

**PM Agent helps:**
```bash
# Interactive migration
node .pm-agent/scripts/migrate-singularity.js

# For each project:
# - Shows: name, size, last commit, has repo
# - Asks: Keep → where? | Archive | Delete
# - Generates: mv commands
```

---

## 📦 Templates System

**Problem:** You repurpose projects (scheduling-station → monorepo-template)

**Solution:** Dedicated templates/ folders

```
SINGULARITY/templates/
  ├── monorepo-template/           # Your standard monorepo setup
  ├── nextjs-app-template/         # Standard Next.js setup
  └── express-api-template/        # Standard Express API

LEGAL/templates/
  ├── custody-agreement-template/
  └── contract-analyzer-template/
```

**Usage:**
```bash
# Instead of cloning & repurposing:
cp -r SINGULARITY/templates/monorepo-template SINGULARITY/active/new-project

# PM Agent helper:
pm-new-project --template monorepo --name my-new-saas

# This:
# 1. Copies template
# 2. Renames package.json
# 3. Initializes new git repo
# 4. Puts in SINGULARITY/active/
```

---

## 🎓 Learning vs Building

**Clear Distinction:**

### LEARNING/ (No pressure, temporary)
- Cloned repos
- Tutorials
- Experiments
- Delete freely when done

### SINGULARITY/ (Real products)
- Has GitHub repo
- Has customers or potential
- Maintained long-term

**Graduation:**
```bash
# When experiment becomes real:
mv LEARNING/experiments/cool-idea \
   SINGULARITY/active/cool-product

# PM Agent asks:
# - Create GitHub repo?
# - Update package.json?
# - Remove original clone source?
```

---

## 📊 PM Agent Maintenance

### Daily
```javascript
// Check for misplaced projects
if (projectInRootLevel) {
  alert('Project at root level! Move to context folder');
}
```

### Weekly
```javascript
// Cleanup suggestions
const staleExperiments = findStale('LEARNING/experiments', 60);
const inactiveActive = findStale('*/active', 90);

suggest(`
  LEARNING/experiments: ${staleExperiments.length} projects 60+ days old
  Active folders: ${inactiveActive.length} projects 90+ days inactive

  Review and archive?
`);
```

### Monthly
```javascript
// Full audit
generateReport(`
  📊 Monthly Project Report

  SINGULARITY/active: ${activeCount} projects (limit: 8)
  LEARNING/experiments: ${expCount} projects
  Space used: ${totalGB} GB
  Stale projects: ${staleCount}

  Recommendations: [...]
`);
```

---

## 🚀 Migration Plan

### Phase 1: Create New Structure (30 min)
```bash
mkdir -p WORK/{active,reference,archive}
mkdir -p LEGAL/{active,templates,archive}
mkdir -p SINGULARITY/{active,experiments,templates,libraries,archive}
mkdir -p LEARNING/{experiments,tutorials,courses,sandbox}
mkdir -p PERSONAL/{active,side-projects,archive}
```

### Phase 2: Move Obvious Ones (1 hour)
```bash
# Clear mappings
mv scala/ WORK/

mv legalDocumentsAI/* LEGAL/active/

# Active Singularity projects (you'll know which)
mv singularity-core/brain-garden-os SINGULARITY/active/
mv singularity-core/cannabis-codex SINGULARITY/active/
# etc.
```

### Phase 3: Audit singularity-core & singularityApps (2-3 hours)
```bash
# Use PM agent's intelligent analysis
# For each project, decide:
# - SINGULARITY/active (real product)
# - SINGULARITY/archive (done, keep)
# - LEARNING/experiments (was just testing)
# - DELETE (temporary, no value)
```

### Phase 4: Clean Up Root Level (30 min)
```bash
# Move accidental root projects to proper context
```

---

## ✅ Success Metrics

**After migration, you should be able to answer instantly:**

1. "Where are my LLC products?" → `SINGULARITY/active/`
2. "Where are my experiments?" → `LEARNING/experiments/`
3. "Where's my day job code?" → `WORK/active/`
4. "What's this folder?" → Context + Status tells you immediately

**Sustainability Test:**
- ✅ New project? Decision tree tells you where
- ✅ Repo cloned? Goes to LEARNING/experiments/
- ✅ Experiment graduates? Move to SINGULARITY/active/
- ✅ Project done? Move to archive/
- ✅ PM agent enforces limits
- ✅ Weekly reminders keep it clean

**Result:** System stays organized with minimal effort! 🎉

---

## 🤔 Your Feedback Needed

Before we execute this:

1. **Does this context mapping make sense?**
   - WORK (scala)
   - LEGAL (legal projects)
   - SINGULARITY (LLC)
   - LEARNING (experiments)
   - PERSONAL (non-LLC)

2. **Are the status categories right?**
   - active
   - experiments
   - templates
   - archive

3. **Any other contexts you need?**
   - CLIENT_WORK? (if you have non-legal clients)
   - OPEN_SOURCE? (if you contribute to OSS)
   - FREELANCE? (if different from LLC)

4. **Limits feel right?**
   - 8 active LLC projects
   - 5 active legal projects
   - 15 experiments max

Let me know and I'll build the migration scripts! 🚀
