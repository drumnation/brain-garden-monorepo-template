# Project Viewer Interface Design

## Enhanced Project Cards with Badges, Documentation Status, and Quick Actions

### Example: High-Value Project (Fully Documented)

```
┌─────────────────────────────────────────────────────────────┐
│ ✨ cannabis-codex                            [USING] 🟢    │
│ 🏷️  pnpm monorepo • turborepo • brain-garden • typescript  │
├─────────────────────────────────────────────────────────────┤
│ 🎯 Cannabis strain tracking and discovery                  │
│ 📊 847 strains • 247 commits • 127hrs • Last: Today 2:30pm│
│ 🚀 Deployed: https://cannabiscodex.app ✅                  │
│                                                             │
│ 📋 Documentation Status:                                   │
│   ✅ PRD  ✅ Project Overview  ✅ Architecture Docs        │
│   ✅ BMAD  ✅ .cursorrules  ✅ CLAUDE.md                   │
│                                                             │
│ 🛠️  Architecture:                                          │
│   ✅ Brain Garden (.brain/)                                │
│   ✅ Tooling (/tooling/)                                   │
│   ✅ pnpm Monorepo (workspace-based)                       │
│                                                             │
│ 🌐 Git:                                                     │
│   Origin: github.com/you/cannabis-codex                    │
│   Branch: main • 247 commits • Up to date                 │
│                                                             │
│ [Screenshot preview - last deployed state]                 │
│                                                             │
│ 💬 "Production app, daily use, high value, well-documented"│
│                                                             │
│ ⚡ Quick Actions:                                          │
│ [💻 Open in Cursor] [💎 Open in Crystal] [📋 Nimbalist]  │
│ [🔄 Pull Latest] [🚀 Deploy] [📸 Capture Screenshot]     │
└─────────────────────────────────────────────────────────────┘
```

### Example: Missing Documentation (Needs Attention)

```
┌─────────────────────────────────────────────────────────────┐
│ 🔧 scheduling-station                       [BUILDING] 🟡   │
│ 🏷️  npm • react • node.js                                  │
├─────────────────────────────────────────────────────────────┤
│ 🎯 Appointment scheduling for small businesses             │
│ 📊 15 appointments • 89 commits • 45hrs • Last: 2 days ago │
│                                                             │
│ ⚠️  Missing Documentation:                                 │
│   ❌ PRD  ❌ Project Overview  ❌ Architecture Docs        │
│   ❌ BMAD  ✅ .cursorrules  ❌ CLAUDE.md                   │
│                                                             │
│ 🛠️  Architecture:                                          │
│   ❌ No Brain Garden setup                                 │
│   ❌ No /tooling/ folder                                   │
│   ⚠️  Standard npm project (not monorepo)                  │
│                                                             │
│ 🌐 Git:                                                     │
│   Origin: github.com/you/scheduling-station                │
│   Branch: main • 89 commits • 2 days old                  │
│                                                             │
│ 💬 "Close to launch, needs documentation"                  │
│                                                             │
│ 🎯 Suggested Actions:                                      │
│ [📋 Generate PRD] [🏗️ Generate Architecture Docs]         │
│ [🧠 Setup Brain Garden] [📝 Create Project Overview]      │
│                                                             │
│ ⚡ Quick Actions:                                          │
│ [💻 Open in Cursor] [💎 Open in Crystal] [🔄 Pull Latest]│
└─────────────────────────────────────────────────────────────┘
```

### Example: Clone to Explore

```
┌─────────────────────────────────────────────────────────────┐
│ 📦 n8n                                      [EXPLORING] ⚪  │
│ 🏷️  pnpm monorepo • turborepo • typescript                │
├─────────────────────────────────────────────────────────────┤
│ 🎯 Workflow automation tool (external project)             │
│ 📊 0 your commits • 4,521 total • Last: 60 days ago       │
│                                                             │
│ 🔍 Ownership: Cloned (0% yours)                            │
│   Origin: github.com/n8n-io/n8n                            │
│   You haven't made any commits yet                         │
│                                                             │
│ 💾 Space: 1.8GB (Can delete to save space)                │
│                                                             │
│ 💬 "Exploring workflow automation, not modified"           │
│                                                             │
│ ⚡ Quick Actions:                                          │
│ [💻 Open in Cursor] [🗑️ Delete (Safe - No Changes)]      │
│ [🔄 Update from Upstream] [🍴 Fork to Customize]         │
└─────────────────────────────────────────────────────────────┘
```

---

## Badge System

### Architecture Badges

| Badge | Meaning | Indicator File/Folder |
|-------|---------|----------------------|
| 🧠 Brain Garden | Has `.brain/` folder | `.brain/` exists |
| 🛠️ Tooling | Has `/tooling/` folder | `tooling/` exists |
| 📦 pnpm | pnpm workspace | `pnpm-workspace.yaml` |
| 🏗️ Turborepo | Uses Turborepo | `turbo.json` |
| 🔷 NX | NX monorepo | `nx.json` |
| 🎯 Lerna | Lerna monorepo | `lerna.json` |
| ⚛️ React | React app | `package.json` dependencies |
| 🟦 TypeScript | TypeScript project | `tsconfig.json` |
| 🐍 Python | Python project | `requirements.txt` or `Pipfile` |
| 🦀 Rust | Rust project | `Cargo.toml` |
| 🐹 Go | Go project | `go.mod` |
| 🐳 Docker | Has Dockerfile | `Dockerfile` |

### Documentation Badges

| Badge | Meaning | Indicator File |
|-------|---------|---------------|
| 📋 PRD | Has Product Requirements Doc | `docs/PRD.md` or `PRD.md` |
| 📖 Overview | Has project overview | `PROJECT-OVERVIEW.md` or `docs/project-overview.md` |
| 🏗️ Architecture | Architecture documentation | `ARCHITECTURE.md` or `docs/architecture/` |
| 📐 BMAD | BMAD-style docs | `docs/BMAD.md` or `BMAD/` folder |
| 🎯 Cursor Rules | Cursor configuration | `.cursorrules` or `.cursor/` |
| 🤖 Claude | Claude configuration | `CLAUDE.md` |

### Lifecycle Status

| Status | Color | Emoji | Meaning |
|--------|-------|-------|---------|
| Using | 🟢 Green | ✨ | Active production use |
| Building | 🟡 Yellow | 🔨 | In development |
| Paused | 🟠 Orange | ⏸️ | Temporarily paused |
| Reference | 🔵 Blue | 📚 | Old version, kept for patterns |
| Exploring | ⚪ Gray | 📦 | Cloned to explore |

---

## Quick Actions System

### Default Quick Actions (All Projects)

```javascript
const defaultActions = [
  {
    type: 'open_tool',
    label: 'Open in Cursor',
    icon: '💻',
    command: 'cursor .',
    order: 1
  },
  {
    type: 'open_tool',
    label: 'Open in Crystal',
    icon: '💎',
    command: 'crystal .',
    order: 2
  },
  {
    type: 'open_tool',
    label: 'Open in Nimbalist',
    icon: '📋',
    command: 'nimbalist .',
    order: 3
  }
];
```

### Conditional Quick Actions (Based on Project State)

```javascript
// If missing PRD
{
  type: 'claude_workflow',
  label: 'Generate PRD',
  icon: '📋',
  command: 'claude-workflow generate-prd',
  showWhen: 'has_prd === false'
}

// If missing architecture docs
{
  type: 'claude_workflow',
  label: 'Generate Architecture Docs',
  icon: '🏗️',
  command: 'claude-workflow generate-architecture',
  showWhen: 'has_architecture_docs === false'
}

// If no Brain Garden setup
{
  type: 'claude_workflow',
  label: 'Setup Brain Garden',
  icon: '🧠',
  command: 'claude-workflow setup-brain-garden',
  showWhen: 'has_brain_folder === false'
}

// If git repo
{
  type: 'git_operation',
  label: 'Pull Latest',
  icon: '🔄',
  command: 'git pull',
  showWhen: 'always'
}

// If deployed
{
  type: 'open_url',
  label: 'Open Deployed App',
  icon: '🚀',
  command: 'open {deployed_url}',
  showWhen: 'deployed === true'
}
```

### Custom Quick Actions (Per Project)

Projects can have custom actions added:

```sql
INSERT INTO quick_actions (project_id, action_type, label, icon, command)
VALUES
  (123, 'launch_script', 'Run Tests', '🧪', 'npm test'),
  (123, 'launch_script', 'Build Prod', '🏗️', 'npm run build'),
  (123, 'open_url', 'View Storybook', '📚', 'npm run storybook');
```

---

## Project Viewer Filters & Sorting

### Filter Options

```
View:
  [ All Projects ]
  [ ✨ My Projects Only ]
  [ 🔧 Customized Forks ]
  [ 📦 Exploring (Clones) ]

Status:
  [ 🟢 Using ]
  [ 🟡 Building ]
  [ ⏸️ Paused ]
  [ 📚 Reference ]

Documentation:
  [ ✅ Fully Documented ]
  [ ⚠️  Missing Docs ]
  [ ❌ No Docs ]

Architecture:
  [ 🧠 Brain Garden ]
  [ 🛠️ Has Tooling ]
  [ Monorepos Only ]

Sort By:
  [ Last Worked On ]
  [ Value Score ]
  [ Space Usage ]
  [ Commits ]
  [ Alphabetical ]
```

### Search

```
[ Search projects... ]
  - Search by name
  - Search by purpose
  - Search by tech stack
  - Search by documentation content
```

---

## Workflow Integration

### Claude Code Workflow Buttons

When clicked, these launch Claude Code with a specific workflow:

**Generate PRD:**
```bash
cd {project_path}
claude-code --workflow generate-prd
```

**Generate Architecture Docs:**
```bash
cd {project_path}
claude-code --workflow generate-architecture
```

**Setup Brain Garden:**
```bash
cd {project_path}
claude-code --workflow setup-brain-garden
```

### Workflows Create Files

The workflows create the expected files and update the database:

```javascript
// After generating PRD
db.run(`
  UPDATE projects
  SET has_prd = 1, has_bmad_docs = 1
  WHERE id = ?
`, [projectId]);
```

---

## Summary

**Key Features:**
1. **Badges** - Instant visual recognition of project architecture
2. **Documentation Status** - Know what's missing at a glance
3. **Quick Actions** - One-click launch of tools or workflows
4. **Smart Suggestions** - Contextual actions based on project state
5. **Git Integration** - Full git management from viewer
6. **Space Management** - See which projects are eating space

**Result:**
The PM Agent becomes an **active assistant** that:
- Shows you what's missing
- Generates missing documentation
- Launches tools instantly
- Helps you maintain and organize projects
- Saves you from forgetting what projects do
