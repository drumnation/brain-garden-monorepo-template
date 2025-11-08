# Handoff to Next Session - PM Agent Implementation

**Date:** 2025-11-07
**Context Limit Reached:** Ready to continue implementation

---

## 🎯 THE BREAKTHROUGH - What We Figured Out

### The Real Problem
User builds apps **FAST** with AI (30min - 3hrs). Accumulates 190+ projects. **Memory fails** - can't remember what projects do, throws away good code, rebuilds same things.

**Solution:** PM agent = **AI-powered project memory system** with:
- Database-backed metadata (projects never move!)
- Viewer interface (visual project dashboard)
- Lifecycle tracking (using/building/reference)
- Smart search & discovery

---

## ✅ FINAL DECISIONS MADE

### 1. Structure = STABLE (By Type, Not State)

```
projects/
├── WORK/        # Day job (scala)
├── APPS/        # All apps (using, building, reference - ALL HERE)
│   ├── cannabis-codex/           # ← Stable path forever
│   ├── parenting-pilot/          # ← Stable path forever
│   ├── parenting-pilot-v2/       # ← Old version, stable path
│   └── [all apps stay here]
├── TOOLS/       # Tools built (cursor-tools, mcp-servers, crystal)
└── LEARNING/    # Clones, experiments, forks
```

**CRITICAL:** Projects NEVER move. State tracked in database/metadata only.

### 2. State = Database/Metadata Only

```javascript
// Database schema (SQLite or JSON with indexing)
{
  "projects": [
    {
      "name": "cannabis-codex",
      "path": "projects/APPS/cannabis-codex",  // NEVER CHANGES

      // Lifecycle (changes via DB updates, not file moves!)
      "lifecycle": "using",           // using|building|reference|abandoned
      "lastUsed": "2025-11-07",
      "usageFrequency": "daily",

      // Real usage data
      "opens": 247,
      "realData": true,
      "dataVolume": "847 strains",

      // Version tracking
      "version": {
        "current": true,
        "number": 1,
        "previousVersions": []
      }
    }
  ]
}
```

### 3. Viewer Interface (To Build)

**Purpose:** Visual dashboard to see project states without moving files

**Features needed:**
- List projects by lifecycle state (using/building/reference)
- Search by purpose/problem solved
- Usage statistics (opens, last used, real data?)
- Version tracking visualization
- Quick actions (promote to using, mark as reference, delete)

---

## 📋 IMPLEMENTATION PLAN

### Phase 1: Database Foundation (Week 1)

**Tasks:**
- [ ] Choose DB (SQLite recommended for simplicity)
- [ ] Design schema (see SCHEMA.md below)
- [ ] Build DB access layer (read/write/query)
- [ ] Create migration script (scan existing projects → populate DB)
- [ ] Test queries (list by state, search, version tracking)

**Files to create:**
```
.pm-agent/
├── db/
│   ├── pm-agent.db              # SQLite database
│   ├── schema.sql               # DB schema
│   └── migrations/              # DB migrations
├── src/
│   ├── db-access.js             # CRUD operations
│   ├── query-builder.js         # Query helpers
│   └── sync.js                  # Sync filesystem → DB
└── scripts/
    ├── init-db.js               # Initialize database
    ├── migrate-existing.js      # Import current projects
    └── sync-projects.js         # Keep DB in sync
```

### Phase 2: CLI Commands (Week 2)

**Tasks:**
- [ ] `pm-list --using` - Show apps being used
- [ ] `pm-list --building` - Show apps in development
- [ ] `pm-list --reference` - Show old versions
- [ ] `pm-search <query>` - Search by purpose/name
- [ ] `pm-promote <name>` - Change state (building → using)
- [ ] `pm-track <name>` - Show usage history
- [ ] `pm-versions <app-family>` - Show all versions

**Implementation:**
```bash
# .pm-agent/cli/pm-cli.js
#!/usr/bin/env node

const db = require('../src/db-access');
const queries = require('../src/query-builder');

// pm-list --using
if (cmd === 'list' && args.using) {
  const projects = db.query(queries.byLifecycle('using'));
  console.log(formatProjectList(projects));
}

// pm-promote cannabis-codex
if (cmd === 'promote') {
  const project = args[0];
  db.update(project, { lifecycle: 'using' });
  console.log(`✅ ${project} promoted to 'using'`);
}
```

### Phase 3: Viewer Interface (Week 3-4)

**Tech Stack:**
- **Electron app** (for filesystem control!)
- Reads from SQLite DB
- Native OS integration (open terminals, file explorer)

**Pages:**

#### 3.1 Dashboard
```
┌─────────────────────────────────────────────┐
│  PM Agent - Project Dashboard              │
├─────────────────────────────────────────────┤
│                                             │
│  🟢 USING (5 apps)                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • cannabis-codex (847 strains, daily)     │
│  • cursor-focus-ts (203 opens this week)   │
│  • medical-billing (200 records)           │
│                                             │
│  🔨 BUILDING (3 apps)                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • scheduling-station (45 days, close!)    │
│  • case-hero (15 days, client work)        │
│  • vanacore (stalled ⚠️)                   │
│                                             │
│  📚 REFERENCE (8 old versions)             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • parenting-pilot-v2 (patterns: Auth)     │
│  • cannabis-codex-v1 (can delete)          │
│                                             │
└─────────────────────────────────────────────┘
```

#### 3.2 Project Detail View
```
┌─────────────────────────────────────────────┐
│  cannabis-codex                             │
├─────────────────────────────────────────────┤
│  Path: projects/APPS/cannabis-codex        │
│  State: USING ✅                           │
│                                             │
│  Usage:                                     │
│  • Last used: Today                        │
│  • Frequency: Daily                        │
│  • Opens: 247 total                        │
│  • Real data: 847 strains                  │
│                                             │
│  History:                                   │
│  • 2025-07-15: Created (building)          │
│  • 2025-08-30: Promoted to using           │
│                                             │
│  Actions:                                   │
│  [📂 Open in Cursor] [💻 Open in VSCode]  │
│  [📁 Show in Finder] [🗂️  Open in iTerm]  │
│  [Mark as Reference] [View Stats]          │
│                                             │
│  Quick Launch (configurable):              │
│  • cursor . (default)                      │
│  • code .                                  │
│  • iterm (cd to folder)                    │
└─────────────────────────────────────────────┘
```

**Configurable Terminal Commands:**
```json
// User config: .pm-agent/config.json
{
  "quickLaunch": {
    "cursor": {
      "command": "cursor .",
      "label": "Open in Cursor",
      "icon": "📂"
    },
    "vscode": {
      "command": "code .",
      "label": "Open in VSCode",
      "icon": "💻"
    },
    "iterm": {
      "command": "iterm",
      "label": "Open in iTerm",
      "icon": "🗂️"
    },
    "finder": {
      "command": "open .",
      "label": "Show in Finder",
      "icon": "📁"
    }
  }
}
```

#### 3.3 Search Interface
```
┌─────────────────────────────────────────────┐
│  Search Projects                            │
├─────────────────────────────────────────────┤
│  [Search: medical billing           ] 🔍  │
│                                             │
│  Found 2 projects:                          │
│                                             │
│  📦 medical-billing-optimizer              │
│     Purpose: Optimizes medical billing     │
│     State: USING (47 opens)                │
│     Last used: 3 days ago                  │
│                                             │
│  📦 medical-supply-monorepo                │
│     Purpose: Supply chain management       │
│     State: REFERENCE (120 days idle)       │
│     Last used: 120 days ago                │
└─────────────────────────────────────────────┘
```

**Implementation (Electron App):**
```
.pm-agent/viewer/
├── package.json
├── electron/
│   ├── main.js               # Electron main process
│   ├── preload.js            # Secure IPC bridge
│   └── ipc-handlers.js       # Handle terminal launches
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx     # Main dashboard
│   │   ├── ProjectDetail.jsx # Detail view
│   │   └── Search.jsx        # Search interface
│   ├── components/
│   │   ├── ProjectCard.jsx
│   │   ├── QuickLaunchButtons.jsx  # Terminal launch buttons
│   │   ├── LifecycleChart.jsx
│   │   └── UsageGraph.jsx
│   └── lib/
│       ├── db-client.js      # DB access
│       └── terminal-launcher.js  # Launch terminals
└── config.json               # User terminal preferences
```

**Electron Features:**
- **Filesystem access** - Full access to project folders
- **Terminal launching** - Spawn `cursor .`, `code .`, etc.
- **Native integration** - Open Finder, file explorer
- **System tray** - Quick access to PM viewer
- **Auto-start** - Launch on system start (optional)

### Phase 4: Quick Launch Integration (Week 5)

**Tasks:**
- [ ] Electron IPC for terminal launching
- [ ] Config file for terminal preferences
- [ ] Quick action buttons on each project
- [ ] "Open in..." menu (Cursor, VSCode, iTerm, Finder)
- [ ] Keyboard shortcuts (Cmd+O for open in Cursor, etc.)

**Terminal Launcher:**
```javascript
// electron/terminal-launcher.js
const { exec } = require('child_process');
const path = require('path');

function openInCursor(projectPath) {
  const fullPath = path.join(process.env.HOME, 'Dev', projectPath);
  exec(`cd "${fullPath}" && cursor .`, (error) => {
    if (error) console.error('Failed to open in Cursor:', error);
  });
}

function openInVSCode(projectPath) {
  const fullPath = path.join(process.env.HOME, 'Dev', projectPath);
  exec(`cd "${fullPath}" && code .`, (error) => {
    if (error) console.error('Failed to open in VSCode:', error);
  });
}

// Configurable from config.json
function launchTerminal(projectPath, terminalType) {
  const config = require('../config.json');
  const command = config.quickLaunch[terminalType].command;
  const fullPath = path.join(process.env.HOME, 'Dev', projectPath);

  exec(`cd "${fullPath}" && ${command}`, (error) => {
    if (error) console.error(`Failed to launch ${terminalType}:`, error);
  });
}

module.exports = { openInCursor, openInVSCode, launchTerminal };
```

### Phase 5: Auto-Tracking (Week 6)

**Tasks:**
- [ ] File watcher (detect project opens)
- [ ] Usage tracker (count opens, track last used)
- [ ] Session-end hook (capture what was done)
- [ ] Auto-promote suggestions (building → using)

**Hook into Claude Code:**
```javascript
// .pm-agent/hooks/session-end.js
// Called when Claude Code session ends

const db = require('../src/db-access');

// Detect which projects were opened this session
const openedProjects = getOpenedProjects();

openedProjects.forEach(project => {
  db.incrementOpens(project);
  db.updateLastUsed(project, new Date());

  // Auto-promote suggestion
  if (shouldPromote(project)) {
    console.log(`💡 ${project} is being used frequently. Promote to 'using'?`);
  }
});
```

---

## 📊 DATABASE SCHEMA

```sql
-- projects table
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  path TEXT NOT NULL,
  type TEXT NOT NULL,              -- app, tool, learning, work
  lifecycle TEXT DEFAULT 'building', -- using, building, reference, abandoned

  -- Usage tracking
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_used DATETIME,
  total_opens INTEGER DEFAULT 0,

  -- Metadata
  purpose TEXT,                     -- What does it do?
  problem_solved TEXT,              -- What problem does it solve?
  has_real_data BOOLEAN DEFAULT 0,
  data_volume TEXT,                 -- "847 strains", "200 records"

  -- Version tracking
  is_current_version BOOLEAN DEFAULT 1,
  version_number INTEGER DEFAULT 1,
  superseded_by TEXT,               -- Foreign key to newer version

  -- Build info
  ai_assisted BOOLEAN DEFAULT 1,
  build_time_minutes INTEGER,
  tech_stack TEXT,                  -- JSON array

  FOREIGN KEY (superseded_by) REFERENCES projects(name)
);

-- lifecycle_history table
CREATE TABLE lifecycle_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  from_state TEXT,
  to_state TEXT NOT NULL,
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reason TEXT,

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- useful_patterns table (for reference versions)
CREATE TABLE useful_patterns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  pattern_name TEXT NOT NULL,
  description TEXT,
  extracted BOOLEAN DEFAULT 0,

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- app_families table (version grouping)
CREATE TABLE app_families (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  family_name TEXT NOT NULL UNIQUE,
  current_version TEXT NOT NULL,

  FOREIGN KEY (current_version) REFERENCES projects(name)
);

-- Create indexes
CREATE INDEX idx_lifecycle ON projects(lifecycle);
CREATE INDEX idx_last_used ON projects(last_used);
CREATE INDEX idx_type ON projects(type);
CREATE INDEX idx_current_version ON projects(is_current_version);
```

---

## 🚀 NEXT STEPS (For Next Session)

### Immediate (Do First)
1. **Initialize database**
   ```bash
   cd .pm-agent
   node scripts/init-db.js
   ```

2. **Migrate existing projects**
   ```bash
   node scripts/migrate-existing.js
   # Scans projects/ folder, populates DB
   ```

3. **Test queries**
   ```bash
   node scripts/pm-cli.js list --using
   node scripts/pm-cli.js list --building
   ```

### Short-term (Week 1-2)
1. Build CLI commands
2. Create basic viewer (HTML/JS)
3. Implement auto-tracking

### Medium-term (Week 3-4)
1. Full viewer interface
2. Search functionality
3. Usage analytics

---

## 📁 KEY FILES TO READ

**Created this session:**
1. `.pm-agent/FINAL_MODEL.md` - THE answer (stable paths + metadata)
2. `.pm-agent/APP_LIFECYCLE_MODEL.md` - How apps progress (using/building/reference)
3. `.pm-agent/THE_REAL_PROBLEM.md` - Core problem (project amnesia)
4. `.pm-agent/STABLE_STRUCTURE.md` - Path stability requirements
5. `.pm-agent/GIT_TRACKED_STRUCTURE.md` - Git repo setup
6. This file - Complete handoff

**Existing:**
- `.pm-agent/project-registry.json` - Current project metadata
- `.pm-agent/scripts/todo-manager.js` - Working todo system
- `.pm-agent/scripts/scan-projects.js` - Project scanner

---

## 🎯 SUCCESS CRITERIA

When complete, user should be able to:

1. **Never lose track of projects**
   - "What does this project do?" → DB has answer
   - "Did I build something for X?" → Search finds it

2. **See objective state**
   - Dashboard shows: 5 using, 3 building, 8 reference
   - Based on REAL usage data, not memory

3. **Track app lifecycle**
   - See apps progressing toward "using" state
   - Auto-suggestions when ready to promote

4. **Manage versions easily**
   - See v1, v2, v3 of same app
   - Track which patterns extracted
   - Delete old versions safely

5. **Never move projects**
   - Paths stable forever
   - Crystal configs never break
   - State changes via metadata only

---

## ⚠️ CRITICAL REMINDERS

1. **NEVER move projects based on state!**
   - State = metadata only
   - Paths = stable forever

2. **Database is source of truth**
   - Not folder names
   - Not file organization

3. **User builds REAL apps**
   - Not just experiments
   - Goal: Get to "using it" stage fast
   - Some make it, some get restarted

4. **Memory is the problem**
   - AI builds so fast → accumulates projects
   - Can't remember what they do
   - Throws away good code
   - PM agent = external memory

---

## 🔧 TECH STACK DECISIONS

**Database:** SQLite
- Simple, file-based
- No server needed
- Fast queries
- Easy backup (just copy .db file)

**Viewer:** Electron app
- Native desktop app (filesystem access)
- Reads from SQLite
- Launches terminals (cursor ., code ., etc.)
- Quick action buttons for each project
- Configurable launch commands

**CLI:** Node.js
- Already using for other scripts
- Easy DB access
- Cross-platform

---

## 💬 USER CONTEXT

- Has 190+ projects (446GB currently)
- Uses Crystal (paths MUST stay stable!)
- Builds apps fast with AI
- Most apps are for himself (not customer-facing)
- Key projects:
  - crystal-fork (THE one to keep, at singularity-core/crystal-fork)
  - cannabis-codex (active development)
  - parenting-pilot (multiple versions, evaluating n8n instead)
  - medical-billing-optimizer (high usage, should promote)

- Current problems:
  - Can't remember what projects do
  - Throws away good code
  - Rebuilds same things
  - No objective view of value
  - Projects scattered

---

## 🎉 BOTTOM LINE

**Build:** Database-backed PM agent with viewer interface

**Purpose:** AI-powered project memory that never forgets

**Structure:** APPS/ TOOLS/ WORK/ LEARNING/ (stable forever)

**State:** Tracked in SQLite DB (changes freely)

**Next:** Implement Phase 1 (database foundation)

---

**Ready to build this! 🚀**
