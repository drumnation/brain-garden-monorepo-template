# Git-Tracked Dev Folder Structure

**New Requirement:** Make Dev folder a git repo to track PM agent system, but NOT track actual projects.

---

## 🎯 Proposed Structure

```
Dev/                                    # ← Git repo root
├── .git/                              # Git tracking
├── .gitignore                         # Ignore /projects
├── README.md                          # PM agent overview
├── CLAUDE.md                          # PM agent operating manual
├── STEVE_STARTUP.md                   # Welcome guide
├── CHANGELOG.md                       # What's been done
│
├── .pm-agent/                         # ✅ TRACKED
│   ├── project-registry.json          # Project metadata (tracked)
│   ├── todos/                         # Todo system (tracked)
│   ├── scripts/                       # Automation (tracked)
│   ├── docs/                          # Documentation (tracked)
│   ├── session-notes/                 # Session summaries (tracked)
│   └── screenshots/                   # Visual memory (tracked?)
│
├── .brain/                            # ✅ TRACKED (if using Brain Garden)
│   └── [Brain Garden config]
│
├── .cursor/                           # ✅ TRACKED (if useful)
│   ├── rules/
│   └── prompts/
│
└── projects/                          # ❌ NOT TRACKED (gitignored)
    ├── WORK/
    ├── LEGAL/
    ├── SINGULARITY/
    └── LEARNING/
```

---

## 📝 .gitignore

```gitignore
# Ignore all actual projects
/projects/

# But track project metadata
!.pm-agent/
!.pm-agent/**

# Node modules and build artifacts
node_modules/
dist/
build/
*.log

# Environment files
.env
.env.local

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Temporary files
tmp/
temp/
*.tmp
```

---

## 🔄 Updated Organization Options

### Option D-Git (Hybrid + Git-Tracked)

```
Dev/                                   # Git repo root
├── README.md
├── CLAUDE.md
├── STEVE_STARTUP.md
├── .pm-agent/                         # Tracked
│   ├── project-registry.json
│   ├── todos/
│   ├── scripts/
│   └── docs/
│
└── projects/                          # NOT tracked
    ├── WORK/
    │   ├── active/
    │   ├── reference/
    │   └── archive/
    │
    ├── LEGAL/
    │   ├── active/
    │   ├── templates/
    │   └── closed/
    │
    ├── SINGULARITY/
    │   ├── NOW/                       # 🔥 Active focus
    │   ├── NEXT/                      # Queued up
    │   ├── PAUSED/                    # On hold
    │   ├── SHIPPED/                   # Live products
    │   ├── ARCHIVED/                  # Done, keeping
    │   ├── tools/                     # Internal tooling
    │   └── templates/                 # Reusable starters
    │
    └── LEARNING/
        ├── active/
        ├── experiments/
        ├── forks/
        └── reference/
```

---

## 🎨 Alternative Names for Projects Folder

Instead of `projects/`, consider:

1. **`src/`**
   - Pros: Short, common convention
   - Cons: Implies source code (but contains many types)

2. **`workspace/`**
   - Pros: Clear what it is
   - Cons: Longer

3. **`dev/`**
   - Pros: Clear, short
   - Cons: Nested Dev/dev is weird

4. **`code/`**
   - Pros: Simple, clear
   - Cons: Not everything is code

5. **`projects/`** (Recommended)
   - Pros: Exactly what it contains
   - Cons: Slightly longer

**Recommendation:** Use `projects/` - most accurate

---

## 📋 What Gets Tracked vs Not

### ✅ TRACKED (Version Controlled)

**PM Agent System:**
- `CLAUDE.md` - Operating manual
- `STEVE_STARTUP.md` - Welcome guide
- `README.md` - Overview
- `.pm-agent/` - Entire folder
  - `scripts/` - All automation
  - `docs/` - All documentation
  - `todos/` - Todo tracking data
  - `project-registry.json` - Metadata (paths, not code)
  - `session-notes/` - Session summaries

**Knowledge Base:**
- `.brain/` - Brain Garden config (if using)
- `.cursor/` - Cursor rules (if useful)

**Benefits of tracking these:**
- 📈 Version history of PM agent improvements
- 🔄 Rollback if something breaks
- 📊 Track evolution of organization system
- 🤝 Share PM agent setup with others (future)
- 💾 Backup of metadata and scripts

---

### ❌ NOT TRACKED (Gitignored)

**Everything in `projects/`:**
- All actual code repositories
- All node_modules
- All build artifacts
- All data files

**Why not track:**
- 🚫 Each project has its own git repo
- 🚫 Would be massive (446GB currently!)
- 🚫 Nested git repos are messy
- 🚫 Don't need version control of version control

**But project-registry.json IS tracked:**
- Contains metadata about projects
- Doesn't contain actual code
- Just paths, stats, categorization

---

## 🚀 Migration Strategy with Git

### Phase 1: Setup Git Tracking

```bash
cd ~/Dev

# Create gitignore FIRST
cat > .gitignore << 'EOF'
# Ignore all projects
/projects/
/src/

# Track PM agent system
!.pm-agent/
!.pm-agent/**

# Standard ignores
node_modules/
.DS_Store
.env
*.log
EOF

# Initialize git repo
git init

# Initial commit (just PM agent system)
git add .gitignore
git add README.md CLAUDE.md STEVE_STARTUP.md CHANGELOG.md
git add .pm-agent/

git commit -m "Initial PM agent system setup

- Add PM agent operating manual (CLAUDE.md)
- Add todo tracking system
- Add project scanner and organization scripts
- Add BMAD documentation
- Add project registry (metadata only, not code)
"
```

### Phase 2: Create Projects Folder

```bash
# Create projects folder structure
mkdir -p projects/{WORK,LEGAL,SINGULARITY,LEARNING}
mkdir -p projects/SINGULARITY/{NOW,NEXT,PAUSED,SHIPPED,ARCHIVED,tools,templates}
mkdir -p projects/WORK/{active,reference,archive}
mkdir -p projects/LEGAL/{active,templates,closed}
mkdir -p projects/LEARNING/{active,experiments,forks,reference}

# Commit the structure (folders only, no content)
git add projects/.gitkeep  # Or use .keep files in each folder
git commit -m "Add projects folder structure

- WORK: Day job projects
- LEGAL: Legal client work
- SINGULARITY: Personal LLC projects
- LEARNING: Experiments and learning
"
```

### Phase 3: Move Existing Projects

```bash
# This happens OUTSIDE of git tracking
# (projects/ is gitignored)

# Move scala
mv scala projects/WORK/active/

# Move legal
mv legalDocumentsAI projects/LEGAL/active/

# Move active LLC projects
mv singularity-core/cannabiscodex projects/SINGULARITY/NOW/
mv singularity-core/brain-garden-os projects/SINGULARITY/NOW/

# etc...

# Update project-registry.json with new paths
node .pm-agent/scripts/scan-projects.js --update-paths

# Commit the METADATA change (not the projects themselves)
git add .pm-agent/project-registry.json
git commit -m "Update project locations after reorganization

Moved projects to new structure:
- WORK/: Scala projects
- LEGAL/: Legal client work
- SINGULARITY/: LLC products
- LEARNING/: Experiments

Total: 190 projects reorganized
"
```

---

## 📊 project-registry.json Structure

Since this file IS tracked, it becomes the source of truth:

```json
{
  "version": "1.0",
  "lastUpdated": "2025-11-07T10:00:00Z",
  "totalProjects": 190,
  "structure": {
    "root": "/Users/dmieloch/Dev",
    "projectsFolder": "projects"
  },
  "projects": [
    {
      "id": "brain-garden-os",
      "name": "Brain Garden OS",
      "path": "projects/SINGULARITY/NOW/brain-garden-os",
      "absolutePath": "/Users/dmieloch/Dev/projects/SINGULARITY/NOW/brain-garden-os",
      "context": "SINGULARITY",
      "status": "NOW",
      "category": "brain-garden",
      "lastWorked": "2025-11-07",
      "gitRepo": "https://github.com/user/brain-garden-os",
      "sizeGB": 3.8,
      "hasNodeModules": true
    }
  ]
}
```

**Tracked in git:**
- ✅ Metadata (paths, sizes, dates)
- ✅ Organization (context, status)
- ✅ Relationships (category, dependencies)

**Not tracked:**
- ❌ Actual code (in projects/, gitignored)
- ❌ node_modules
- ❌ Build artifacts

---

## 🎯 Benefits of This Approach

### 1. **PM Agent System is Portable**
```bash
# Clone your PM agent setup to a new machine
git clone your-pm-agent-repo Dev
cd Dev
npm install  # If PM agent scripts need deps
node .pm-agent/scripts/scan-projects.js  # Scan whatever projects exist
```

### 2. **Track Evolution**
```bash
# See how organization evolved
git log --oneline .pm-agent/

# See when project was moved
git log -p .pm-agent/project-registry.json | grep "brain-garden-os"

# Rollback if organization change didn't work
git revert abc123
```

### 3. **Share Knowledge**
```bash
# Your PM agent could be open sourced!
# Others could use your organizational system
# But keep actual projects private
```

### 4. **Backup Metadata**
```bash
# Push to GitHub (private repo)
git remote add origin git@github.com:dmieloch/dev-pm-agent.git
git push -u origin main

# Metadata backed up, actual projects NOT pushed
```

---

## 🤔 Decision: src/ vs projects/?

**Option 1: `/src`**
```
Dev/
├── .pm-agent/
└── src/           # All projects here
```

**Option 2: `/projects`**
```
Dev/
├── .pm-agent/
└── projects/      # All projects here
```

**Option 3: `/workspace`**
```
Dev/
├── .pm-agent/
└── workspace/     # All projects here
```

**Recommendation:** `/projects` - most descriptive

---

## 📝 Updated .gitignore (Final)

```gitignore
# ============================================
# IGNORE ALL PROJECTS (they have their own git repos)
# ============================================
/projects/

# ============================================
# TRACK PM AGENT SYSTEM
# ============================================
# These are explicitly tracked:
# - .pm-agent/
# - CLAUDE.md
# - STEVE_STARTUP.md
# - README.md
# - CHANGELOG.md

# ============================================
# STANDARD IGNORES
# ============================================

# Dependencies
node_modules/
.pnp/
.pnp.js

# Build outputs
dist/
build/
*.tsbuildinfo

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment
.env
.env.local
.env.*.local

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
Thumbs.db

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# Temporary
tmp/
temp/
*.tmp
.cache/

# Screenshots might be too big
# .pm-agent/screenshots/
```

---

## 🚀 Implementation Steps

1. **Create .gitignore** (prevents accidental tracking)
2. **Initialize git** (make Dev a repo)
3. **Commit PM agent system** (just the framework)
4. **Create projects/ folder** (empty structure)
5. **Move actual projects** (happens outside git)
6. **Update registry** (commit metadata changes)
7. **Setup remote** (optional: push to GitHub)

---

Ready to execute? This gives you:
- ✅ Version-controlled PM agent system
- ✅ Trackable organization evolution
- ✅ Portable setup (clone to new machine)
- ✅ Backed-up metadata
- ✅ Shareable framework
- ✅ Git history of improvements

But keeps:
- ❌ Actual projects out of this repo
- ❌ Each project's own git repo intact
- ❌ No nested git mess

Let me know and I'll generate the exact commands! 🚀
