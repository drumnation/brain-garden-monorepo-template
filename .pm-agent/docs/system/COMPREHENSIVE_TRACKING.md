# PM Agent - Comprehensive Project Tracking

## What You Can Now Track (CI/CD-Like Dashboard)

### 🎯 Project Identity & Ownership
- ✅ Name, path, type
- ✅ Ownership (yours, fork, clone)
- ✅ Contribution percentage (0-100%)
- ✅ Git origin + upstream URLs
- ✅ Purpose & AI-generated summary
- ✅ Lifecycle state (using, building, paused, reference)

### 📦 Tech Stack (Real Dependencies)
- ✅ Every package with version
- ✅ Production vs dev dependencies
- ✅ Category (frontend, backend, database, testing, devops, ui-library)
- ✅ Logos & emojis for display
- ✅ Tech stack overlap analysis

**Example Query:**
```sql
SELECT name, GROUP_CONCAT(package_name || ' ' || version) as stack
FROM projects p
JOIN stack_dependencies sd ON p.id = sd.project_id
WHERE p.name = 'awesome-claude-agents';
```

### 🧪 Testing Infrastructure
- ✅ Test framework (Jest, Vitest, Playwright, Cypress)
- ✅ Total tests count
- ✅ Has unit/integration/E2E tests
- ✅ Coverage enabled & percentage
- ✅ Test config files
- ✅ Runs in CI

**Dashboard Signal:**
```
🧪 Testing:
  🃏 Jest (247 tests) • 🎭 Playwright (15 E2E)
  Coverage: 82% ✅ (threshold: 80%)
```

### 🔄 CI/CD & Validation
- ✅ CI platform (GitHub Actions, GitLab CI, Circle CI)
- ✅ CI config file
- ✅ Runs linter (ESLint, etc.)
- ✅ Runs type checker (TypeScript)
- ✅ Has pre-commit hooks
- ✅ Last CI status

**Dashboard Signal:**
```
🔄 Validation:
  ✅ CI: GitHub Actions
  ✅ Linter: ESLint
  ✅ TypeScript
  ✅ Pre-commit: Husky
```

### 🏥 Real-Time Health (CI/CD-Like)
- ✅ **Does it build?** (actual run)
- ✅ **Build time** (seconds)
- ✅ **Build errors** (captured)
- ✅ **Tests pass?** (actual run)
- ✅ **Test counts** (passing/failing/skipped)
- ✅ **Linter errors** (on main branch)
- ✅ **Type errors** (on main branch)
- ✅ **Git status** (clean/dirty)
- ✅ **Health score** (0-100 calculated)

**Health Score Formula:**
```
= Build (30pts)
+ Tests (30pts)
+ Linter clean (20pts)
+ Types clean (10pts)
+ Git clean (10pts)
```

**Dashboard Signal:**
```
🏥 Health: 87/100 ✅
  ✅ Builds in 23s
  ✅ Tests: 247/247 passing
  ✅ Lint: 0 errors
  ✅ Types: 0 errors
  ⚠️  Git: 3 uncommitted changes
```

### 🤖 Agent Configurations
- ✅ Cursor (.cursorrules)
- ✅ Claude Code (CLAUDE.md)
- ✅ Brain Garden (.brain/)
- ✅ Total rules count
- ✅ Config content

**Dashboard Signal:**
```
🤖 Agent Config:
  ✅ Cursor (.cursorrules - 45 rules)
  ✅ Claude Code (CLAUDE.md)
  ✅ Brain Garden (.brain/)
```

### 🎨 Architecture Indicators
- ✅ Has .brain/ folder
- ✅ Has /tooling/ folder
- ✅ Monorepo type (pnpm, turborepo, nx, lerna, rush)
- ✅ Documentation status (PRD, BMAD, Architecture)

**Dashboard Signal:**
```
🏗️ Architecture:
  🧠 Brain Garden
  🛠️ Tooling
  📦 pnpm monorepo
  🔥 Turborepo
```

### 📊 Developer Activity Signals
- ✅ Total Claude Code sessions
- ✅ Total tokens used
- ✅ Average session duration
- ✅ Last Claude session date
- ✅ Memory files count (.brain/)
- ✅ Total branches
- ✅ Active branches (not merged)
- ✅ Worktrees count
- ✅ Commits last 30 days
- ✅ Files changed last 30 days
- ✅ Momentum score (0-100)

**Dashboard Signal:**
```
📊 Activity:
  💬 47 Claude sessions (avg 23min)
  🎯 1.2M tokens used
  🧠 23 memory files
  🌿 8 active branches
  📈 Momentum: 85/100 (high)
```

### 💾 Space Usage
- ✅ Total project size
- ✅ node_modules size
- ✅ .git size
- ✅ Worktrees count & size
- ✅ Space recovery opportunities

**Dashboard Signal:**
```
💾 Space:
  Total: 2.3GB
  node_modules: 800MB (can delete)
  Worktrees: 3 (450MB)
```

---

## Full Project Card Example

```
┌─────────────────────────────────────────────────────────────┐
│ ✨ awesome-claude-agents              Health: 87/100 ✅     │
│ 🏷️  typescript • react • node.js • pnpm monorepo           │
├─────────────────────────────────────────────────────────────┤
│ 🎯 Collection of Claude AI agent examples and patterns     │
│                                                             │
│ 📊 Activity:                                               │
│   💬 47 sessions • 🎯 1.2M tokens • Last: 2 days ago      │
│   🧠 23 memory files • 🌿 8 active branches               │
│   📈 Momentum: 85/100 (high) • 23 commits this month      │
│                                                             │
│ 📦 Stack:                                                   │
│   🔷 TypeScript 5.0 • ⚛️ React 18.2 • 🚂 Express 4.18    │
│   💎 Prisma 5.0 • 🐘 PostgreSQL • 🎨 Tailwind CSS         │
│                                                             │
│ 🧪 Testing:                                                │
│   🃏 Jest (247 tests) • 🎭 Playwright (15 E2E)            │
│   Status: ✅ 247/247 passing • Coverage: 82% ✅           │
│                                                             │
│ 🔄 Validation:                                             │
│   ✅ CI: GitHub Actions (last run: success)                │
│   ✅ Linter: ESLint (0 errors)                             │
│   ✅ Types: TypeScript (0 errors)                          │
│   ✅ Pre-commit: Husky                                     │
│                                                             │
│ 🏥 Current Health:                                         │
│   ✅ Builds successfully (23s)                             │
│   ✅ All tests passing                                     │
│   ✅ No lint errors                                        │
│   ✅ No type errors                                        │
│   ⚠️  3 uncommitted changes on main                        │
│                                                             │
│ 🤖 Agent Config:                                           │
│   ✅ Cursor (.cursorrules - 45 rules)                      │
│   ✅ Claude Code (CLAUDE.md)                               │
│   ✅ Brain Garden (.brain/ - 23 memories)                  │
│                                                             │
│ 📋 Documentation:                                          │
│   ✅ PRD  ✅ Overview  ✅ Architecture  ✅ BMAD           │
│                                                             │
│ 💾 Space: 2.3GB (800MB recoverable from node_modules)     │
│                                                             │
│ ⚡ Quick Actions:                                          │
│ [💻 Cursor] [💎 Crystal] [🧪 Run Tests] [🏥 Health Check]│
│ [📋 Generate PRD] [🧠 Setup Brain Garden] [🚀 Deploy]    │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Health Dashboard (SQL View)

```sql
SELECT * FROM project_health_dashboard
ORDER BY health DESC
LIMIT 10;
```

**Output:**
```
name                  | builds | tests | git | lint | test_ratio | coverage | errors | sessions | momentum | health
---------------------|--------|-------|-----|------|------------|----------|--------|----------|----------|-------
awesome-claude-agents| ✅     | ✅    | ⚠️  | ✅   | 247/247    | 82%      | 0      | 47       | 85       | 87
platformer           | ✅     | ✅    | ✅  | ✅   | 45/45      | 91%      | 0      | 12       | 65       | 95
snake-game           | ✅     | ⚠️    | ✅  | ✅   | 23/25      | 78%      | 0      | 8        | 45       | 78
cheddar-node         | ❌     | ✅    | ✅  | ⚠️   | 34/34      | 85%      | 2      | 23       | 72       | 71
```

---

## Commands to Track All This

### Run Health Check
```bash
# Check specific project
node .pm-agent/scripts/health-check.js awesome-claude-agents

# Check all YOUR projects (top 10)
node .pm-agent/scripts/health-check.js
```

### View Health Dashboard
```bash
sqlite3 .pm-agent/db/pm-agent.db "SELECT * FROM project_health_dashboard LIMIT 20"
```

### Find Projects Needing Attention
```bash
# Projects with failing tests
sqlite3 .pm-agent/db/pm-agent.db "
  SELECT name, tests_failing
  FROM project_health ph
  JOIN projects p ON ph.project_id = p.id
  WHERE tests_failing > 0
"

# Projects that don't build
sqlite3 .pm-agent/db/pm-agent.db "
  SELECT name, build_error
  FROM project_health ph
  JOIN projects p ON ph.project_id = p.id
  WHERE builds = 0
"

# Projects with low health scores
sqlite3 .pm-agent/db/pm-agent.db "
  SELECT name, health_score
  FROM project_health ph
  JOIN projects p ON ph.project_id = p.id
  WHERE health_score < 60
  ORDER BY health_score
"
```

### Track Claude Code Usage
```bash
# Projects with most Claude activity
sqlite3 .pm-agent/db/pm-agent.db "
  SELECT p.name, act.total_claude_sessions, act.total_tokens_used
  FROM activity_signals act
  JOIN projects p ON act.project_id = p.id
  ORDER BY act.total_claude_sessions DESC
  LIMIT 20
"
```

---

## Next Steps

### 1. Claude Code Session Tracking
Create a hook that logs every Claude Code session:
```javascript
// .claude/hooks/session-end.js
const db = require('.pm-agent/src/db-access');

db.logSession({
  project: getCurrentProject(),
  tokens: session.tokensUsed,
  duration: session.duration,
  filesModified: session.filesChanged.length
});
```

### 2. Continuous Health Monitoring
```bash
# Run health checks daily
crontab -e
0 0 * * * cd ~/Dev/.pm-agent && node scripts/health-check.js
```

### 3. Project Viewer UI
Build Electron app that shows all this in real-time!

---

## The Vision

You now have a **CI/CD-like dashboard for ALL your projects**, tracking:

✅ Static metadata (ownership, tech stack, docs)
✅ Dynamic health (builds, tests, linting)
✅ Developer activity (Claude sessions, commits, branches)
✅ Real-time signals (does it work RIGHT NOW?)

**It's like having GitHub Actions + CircleCI + DataDog for every project on your machine!**
