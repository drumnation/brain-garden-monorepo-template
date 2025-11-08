# Three-Phase Roadmap: Building the Living Development Intelligence System

**Vision:** Transform Dev folder into an AI-powered workspace where the PM Agent maintains continuous awareness of all projects, tracks progress autonomously, and proactively guides development.

---

## Phase 1: Cleanup & Organization (Weeks 1-4)

**Status:** 🚧 In Progress
**Goal:** Reclaim disk space, establish order, build foundation

### Current Reality (Discovered 2025-11-07):
```
Total Projects: 190
├── Active: 3 projects (1.6%)
├── Recently active: 8 projects (4.2%)
├── On hold: 45 projects (23.7%)
├── Stale: 87 projects (45.8%)      ← MAJOR CLEANUP OPPORTUNITY
└── Archived: 39 projects (20.5%)

Space Usage: 446.8 GB
├── Potential recovery: 130-170 GB
├── node_modules waste: ~100 GB
├── Worktree duplicates: ~40 GB
└── Docker cleanup: ~50 GB
```

### Phase 1 Objectives:

#### 1.1 Interactive Project Categorization ⏳
**Task:** Review all 190 projects with human developer

Process:
- Load project-registry.json
- Present each project with metadata:
  - Last activity date
  - Size (total + node_modules)
  - Tech stack
  - Git status
- Developer decides:
  - Keep as active (move to src/active/)
  - Mark as on-hold (move to src/on-hold/)
  - Archive (move to src/archive/YYYY/)
  - Delete entirely (with confirmation!)

**Output:** Categorized project structure

#### 1.2 Execute Space Recovery 💾
**Task:** Safely reclaim 100+ GB

Actions:
1. **Remove node_modules from stale projects (87 projects)**
   ```bash
   # Safe script that:
   - Lists projects untouched 6+ months
   - Shows space to be freed
   - Requires confirmation
   - Removes node_modules (code preserved!)
   - Logs actions
   ```
   **Expected savings:** 60-80 GB

2. **Clean up abandoned worktrees**
   ```bash
   # Focus on: parenting-pilot (205 worktrees!)
   - List all worktrees
   - Identify abandoned ones
   - Clean up safely
   - Keep only active branches
   ```
   **Expected savings:** 30-40 GB

3. **Docker system prune**
   ```bash
   docker system prune -a --volumes
   ```
   **Expected savings:** 40-50 GB

**Target:** Recover 130-170 GB

#### 1.3 Reorganize Folder Structure 📁
**Task:** Move from chaos to clarity

Current (Chaotic):
```
~/Dev/
├── singularityApps/
├── singularity-core/
├── experiments/
├── scala/
├── parenting-communication/
├── [... 15 more top-level folders]
```

Target (Organized):
```
~/Dev/                     # PM Agent repo root
├── README.md
├── CHANGELOG.md
├── CLAUDE.md
├── docs/
├── .pm-agent/
│
└── src/                   # All dev projects moved here
    ├── active/            # 3-10 projects max
    │   ├── brain-garden-os/
    │   ├── scheduling-station/
    │   └── [currently active]
    │
    ├── brain-garden/      # Centralized ecosystem
    │   ├── brain-garden-os/
    │   ├── brain-garden-studio/
    │   └── project-brain-monorepo/
    │
    ├── on-hold/           # Might return to (45 projects)
    │   └── [paused projects]
    │
    ├── experiments/       # Learning & prototypes
    │   └── [experimental work]
    │
    └── archive/           # Completed or abandoned
        ├── 2024/
        └── 2025/
```

**Benefits:**
- Clear separation: PM agent vs dev projects
- Easy to find active work
- ADHD-friendly (max 10 visible active)
- Guilt-free on-hold status

#### 1.4 Initialize Git Repository 🔄
**Task:** Make Dev folder version controlled

```bash
cd ~/Dev
git init
git add README.md CHANGELOG.md CLAUDE.md docs/ .pm-agent/
git commit -m "feat: Initialize PM Agent - Living Development Intelligence System

🤖 Created PM Agent workspace with:
- Multi-layered memory system
- Project registry for 190 projects
- Space analysis (130GB recovery identified)
- Documentation infrastructure
- Automated maintenance protocols

🧠 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

**What gets tracked:**
- ✅ README.md, CHANGELOG.md, CLAUDE.md
- ✅ docs/ (curated memories)
- ✅ .pm-agent/ (scripts, registry, reports)
- ❌ src/ (dev projects have their own repos)

#### 1.5 Install claude-mem 🧠
**Task:** Enable persistent memory

```bash
# In Claude Code
> /plugin marketplace add thedotmack/claude-mem
> /plugin install claude-mem
# Restart Claude Code
```

**Verification:**
- Web UI accessible at localhost:37777
- MCP search tools available
- Session history captured

### Phase 1 Success Metrics:
- [ ] All 190 projects categorized
- [ ] 100+ GB disk space recovered
- [ ] src/ folder structure established
- [ ] Dev folder is git repository
- [ ] claude-mem installed & functional
- [ ] Documentation complete & current

### Phase 1 Deliverables:
1. ✅ Project registry with full metadata
2. ✅ Space analysis report
3. ⏳ Categorized src/ structure
4. ⏳ Cleanup scripts (safe, tested)
5. ⏳ Git repository with history
6. ⏳ Updated documentation

**Estimated Duration:** 2-4 weeks

---

## Phase 2: Intelligence & Knowledge (Weeks 5-16)

**Status:** 📋 Planned
**Goal:** Build PM agent as authoritative knowledge source

### Phase 2 Objectives:

#### 2.1 Mine Historical Data 🔍
**Task:** Extract insights from past work

**Data sources:**
1. **Claude Code session history**
   - Parse ~/.claude/history/
   - Extract:
     - What was attempted
     - What was accomplished
     - Decisions made
     - Blockers encountered
   - Store in docs/project-snapshots/

2. **Git history (local + remote)**
   - For each of 190 projects:
     - Full commit history
     - Branch patterns
     - Contributor activity
     - Development velocity
   - Identify patterns across projects

3. **GitHub data (if available)**
   - Issues, PRs, projects
   - Milestones & releases
   - Collaboration patterns
   - CI/CD results

**Output:** Rich historical context for each project

#### 2.2 Build Dashboard UI 🎨
**Task:** Visual project management interface

**Technology Stack:**
- Framework: React + Next.js
- Styling: Tailwind CSS
- State: Zustand
- Data: Read from project-registry.json
- Real-time: WebSocket for live updates

**Features:**

**View 1: Kanban Board**
```
┌─ Active ──────┐ ┌─ On Hold ─────┐ ┌─ Blocked ─────┐
│ brain-garden  │ │ crystal-fork  │ │ parenting-    │
│ 🟢 Healthy    │ │ 🟡 Outdated   │ │ 🔴 Tests fail │
│ Last: 2d ago  │ │ Last: 45d ago │ │ Last: 3d ago  │
│ [Screenshot]  │ │               │ │               │
└───────────────┘ └───────────────┘ └───────────────┘

┌─ Completed ───┐ ┌─ Archived ────┐
│ project-xyz   │ │ old-project   │
│ ✅ Shipped    │ │ 📦 Stored     │
└───────────────┘ └───────────────┘
```

**View 2: List View**
```
Project Name          Status    Last Active    Health  Size    Actions
─────────────────────────────────────────────────────────────────────
brain-garden-os       Active    2 days ago     🟢      3.8GB   [View]
scheduling-station    Active    15 days ago    🟡      3.6GB   [View]
crystal-fork          On Hold   45 days ago    🟡      12GB    [Clean]
parenting-pilot       Blocked   3 days ago     🔴      8.2GB   [Fix]
...
```

**Project Detail View:**
- Full project metadata
- Git activity graph
- Health status breakdown
- Quick start command
- Screenshots gallery
- Recent commits
- Next actions
- Related projects

**Global Features:**
- Search/filter projects
- Sort by any column
- Bulk actions
- Space usage visualization
- Goal progress tracking
- Export reports

**Dashboard Location:** `.pm-agent/dashboard/`
**Access:** http://localhost:3000

#### 2.3 Project Health Monitoring 🏥
**Task:** Continuous health assessment

**Health Checks (Automated):**
```javascript
const healthChecks = {
  builds: 'Does `npm run build` succeed?',
  tests: 'Do tests pass? How many?',
  dependencies: 'Are dependencies up-to-date?',
  security: 'Any vulnerabilities?',
  deploy: 'Does deployment config work?',
  documentation: 'Is README current?'
};
```

**Health Score Calculation:**
```javascript
const score = {
  🟢 Green (80-100%): All checks pass, actively maintained
  🟡 Yellow (50-79%): Some issues, still functional
  🔴 Red (0-49%): Critical issues, needs attention
};
```

**Monitoring Frequency:**
- Active projects: Daily
- On-hold projects: Weekly
- Archived projects: Never

#### 2.4 GitHub Projects Integration 📊
**Task:** Sync with GitHub for project management

**Features:**
- Auto-create GitHub Project for each active project
- Sync accomplishments → Issues/Cards
- Update status based on Claude sessions
- Link commits → Project cards
- Generate PR descriptions from session summaries

**Example Sync:**
```
Claude Session Accomplishment:
"Implemented JWT refresh token rotation"

↓ Syncs to GitHub Project ↓

Issue Created/Updated:
Title: "JWT Refresh Token Rotation"
Status: Done
Labels: enhancement, authentication
Linked Commits: [abc123, def456]
Description: [Auto-generated from session]
```

#### 2.5 Screenshot & Visual Memory 📸
**Task:** Capture app states for context switching

**Automated Capture:**
```bash
# When Claude runs a project locally:
pm-screenshot capture \
  --project brain-garden-os \
  --caption "Dashboard with agent list" \
  --url http://localhost:3000

# Stored in:
.pm-agent/screenshots/brain-garden-os/2025-11-07-dashboard.png
```

**Visual Gallery:**
- Screenshots organized by project
- Chronological timeline
- Quick preview in dashboard
- Helps remember "what does this even do?"

### Phase 2 Success Metrics:
- [ ] Historical data mined from 190 projects
- [ ] Dashboard deployed and functional
- [ ] Health monitoring running
- [ ] GitHub integration operational
- [ ] Screenshot system capturing states
- [ ] PM agent can answer: "What's the current state of X?"

### Phase 2 Deliverables:
1. Claude session history parser
2. Git history analyzer
3. React dashboard (Kanban + List views)
4. Health check system
5. GitHub Projects sync
6. Screenshot manager
7. Knowledge graph populated

**Estimated Duration:** 8-12 weeks

---

## Phase 3: Autonomous Governance (Weeks 17-24)

**Status:** 🔮 Future
**Goal:** Self-maintaining system, always current, proactive

### Phase 3 Objectives:

#### 3.1 Background Automation System 🤖
**Task:** PM agent runs continuously, not just in Claude sessions

**Architecture:**
```
┌───────────────────────────────────────┐
│  Background Service (PM Agent Daemon) │
│  - Runs 24/7                          │
│  - Port: 37778                        │
│  - Process Manager: PM2               │
└───────────────────────────────────────┘
           ↓ (continuous monitoring)
┌───────────────────────────────────────┐
│  Monitoring Tasks (Cron-like)         │
│  - Every 5 min: Check for git changes│
│  - Every 1 hour: Update registry      │
│  - Every 6 hours: Health checks       │
│  - Daily: Mine new session data       │
│  - Weekly: Generate reports           │
└───────────────────────────────────────┘
           ↓ (updates)
┌───────────────────────────────────────┐
│  Live Data Store                      │
│  - project-registry.json (live)       │
│  - health-status.json (live)          │
│  - activity-feed.json (real-time)     │
└───────────────────────────────────────┘
           ↓ (powers)
┌───────────────────────────────────────┐
│  Dashboard (Live Updates via WS)      │
│  - Real-time project activity         │
│  - Health status changes              │
│  - Space usage trending               │
└───────────────────────────────────────┘
```

**Background Tasks:**
1. **Git Watch** - Detects new commits instantly
2. **Health Monitor** - Runs checks periodically
3. **Session Miner** - Processes new Claude sessions
4. **Memory Curator** - Reviews & flushes old memories
5. **Report Generator** - Creates daily/weekly summaries
6. **Alert System** - Notifies of critical issues

#### 3.2 Continuous Project Assessment 📈
**Task:** Always-current project understanding

**Real-time Tracking:**
```javascript
// Every git commit triggers:
1. Update project-registry.json
2. Analyze commit message
3. Update health status
4. Check if goals affected
5. Update dashboard
6. Notify if milestone reached
```

**Goals Tracking:**
```javascript
// Per-project goals stored in:
src/[project]/.pm-goals.json

{
  "project": "brain-garden-os",
  "goals": [
    {
      "id": "goal-1",
      "description": "Implement agent communication",
      "status": "in-progress",
      "progress": 75,
      "startDate": "2025-11-01",
      "targetDate": "2025-11-15",
      "milestones": [
        { "name": "Message queue", "done": true },
        { "name": "Threading", "done": true },
        { "name": "Persistence", "done": false }
      ]
    }
  ]
}

// PM agent tracks progress automatically!
```

#### 3.3 Pattern Detection Engine 🧠
**Task:** Learn from developer behavior

**Patterns to Detect:**
1. **Work Cycles**
   - "Developer works on brain-garden in evenings"
   - "Scheduling-station gets 3-hour blocks monthly"
   - "Context switches between 3-5 projects weekly"

2. **Project Lifecycle**
   - "Monorepos take 2x longer than simple apps"
   - "Frontend projects see more frequent commits"
   - "Projects with tests have fewer reverts"

3. **Technical Patterns**
   - "Redux → Zustand migration happening across projects"
   - "Monorepo pattern preferred for related apps"
   - "Authentication always uses JWT with refresh tokens"

4. **Blockers & Solutions**
   - "Docker port conflicts common → auto-suggest fix"
   - "Type errors often fixed by strict tsconfig → recommend"

**How Patterns Are Used:**
- Proactive suggestions
- Better context switching
- Predict next actions
- Recommend best practices

#### 3.4 Proactive Recommendations 💡
**Task:** PM agent suggests actions unprompted

**Examples:**

**Situation 1: Stale Project**
```
PM Agent Notice:
"🔔 You haven't worked on crystal-fork in 47 days, but you were
on a roll before that (15 commits in 3 days). Want to continue?

Last TODO: 'Add test coverage for parser module'
Quick start: cd src/on-hold/crystal-fork && npm test"
```

**Situation 2: Space Issue**
```
PM Agent Notice:
"💾 Disk space dropping below 100GB. Found 5 projects with stale
node_modules totaling 23GB. Run cleanup?

[Yes, clean up] [Show details] [Remind me later]"
```

**Situation 3: Goal Reminder**
```
PM Agent Notice:
"🎯 brain-garden-os goal 'Implement agent communication' is 75%
complete with target date Nov 15 (8 days away). Last milestone:
'Persistence' still pending. Schedule time to finish?"
```

**Situation 4: Pattern Alert**
```
PM Agent Notice:
"📊 Noticed you context-switch between brain-garden projects
frequently. Would you like me to create a workspace that loads
all 3 projects together?"
```

#### 3.5 Self-Documenting System 📝
**Task:** PM agent maintains its own documentation

**Auto-Updates:**
- README.md updated when:
  - New phase begins
  - Project count changes significantly
  - New features added

- CHANGELOG.md updated when:
  - Version milestones reached
  - Major features completed
  - System architecture changes

- docs/memories/ curated when:
  - Significant insights discovered
  - Patterns confirmed over time
  - Decisions made

**Weekly Self-Review:**
```javascript
// Every Sunday at midnight:
1. Review all memories from past week
2. Identify obsolete information
3. Flush outdated memories
4. Consolidate related insights
5. Update documentation
6. Generate weekly report
7. Commit changes to git
```

### Phase 3 Success Metrics:
- [ ] Background service runs 24/7
- [ ] Project updates happen in real-time
- [ ] Goals tracked automatically
- [ ] Patterns detected and used
- [ ] Proactive suggestions made
- [ ] Documentation stays current without manual effort
- [ ] PM agent truly autonomous

### Phase 3 Deliverables:
1. Background daemon service
2. Real-time monitoring system
3. Pattern detection engine
4. Proactive suggestion system
5. Auto-documentation system
6. Alert & notification system
7. Self-maintaining knowledge base

**Estimated Duration:** 6-8 weeks

---

## Success Definition

**Phase 1:** "I can find my projects and recovered 100GB"
**Phase 2:** "I can see all project status at a glance"
**Phase 3:** "My AI PM agent runs my dev workspace autonomously"

## Long-term Vision (6+ months)

**The Dream State:**
```
Human Developer wakes up, checks dashboard:

PM Agent Report:
"Good morning! Here's what happened while you slept:

🎉 brain-garden-os: CI passed on main, ready to deploy
⚠️  scheduling-station: Dependency vulnerabilities detected, PR created
📊 crystal-fork: No activity in 60 days, suggest archiving?
💡 Pattern noticed: You're most productive 7-9pm, should I schedule
   focus time for complex tasks then?

Today's recommended focus:
1. Deploy brain-garden-os (15 min)
2. Review crystal-fork decision (5 min)
3. Continue parenting-copilot feature (2 hours blocked)

Your workspace is ready. All projects healthy. 🟢"
```

**That's the goal!** 🎯

---

**Maintained by:** PM Agent
**Last Updated:** 2025-11-07
**Current Phase:** 1 (Cleanup & Organization)
