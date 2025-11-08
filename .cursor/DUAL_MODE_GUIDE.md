# Claude Code Dual Mode System

## 🎯 Overview

The PM Agent project uses a **dual-mode rule system** that allows Claude Code to switch between two distinct personalities:

1. **Builder Mode** - Developer agent building the PM Agent application
2. **PM Agent Mode** - The actual PM Agent managing 190+ projects

This is accomplished by using an environment variable to select which set of rules to load.

---

## 📁 Directory Structure

```
/Users/dmieloch/Dev/
├── .cursor/
│   ├── rules-source-builder/     # 🔧 BUILDER MODE RULES
│   │   ├── monorepo-node-electron-express-hexagonal-architecture.rules.mdc
│   │   ├── pm-agent-tdd-workflow.rules.mdc
│   │   ├── react-bulletproof-component-pattern.rules.mdc
│   │   ├── pm-agent-sqlite-patterns.rules.mdc
│   │   └── [13 development rules total]
│   │
│   ├── rules-source-pm-agent/     # 🧠 PM AGENT MODE RULES
│   │   ├── pm-agent-session-protocol.rules.mdc
│   │   ├── pm-agent-project-analysis.rules.mdc
│   │   ├── pm-agent-conversation-style.rules.mdc
│   │   ├── pm-agent-knowledge-management.rules.mdc
│   │   ├── pm-agent-todo-discipline.rules.mdc
│   │   └── pm-agent-decision-framework.rules.mdc
│   │
│   ├── sync/
│   │   ├── build-consolidated-rules.ts   # Checks CLAUDE_MODE env var
│   │   └── contexts.ts
│   │
│   └── .last-build-mode               # Tracks last build mode
│
├── .env                              # CLAUDE_MODE=builder|pm-agent
├── CLAUDE.md                         # Generated from active mode
│
├── apps/                             # PM Agent application code
├── packages/                         # Shared packages
├── tooling/                          # Development tooling
│
└── .pm-agent/                        # PM Agent workspace
    ├── db/pm-agent.db                # 177+ projects tracked
    ├── todos/                        # Session tracking
    ├── knowledge/                    # Patterns, insights, decisions
    └── docs/                         # PM Agent documentation
```

---

## 🔄 Switching Modes

### Check Current Mode

```bash
grep CLAUDE_MODE .env
```

### Switch to Builder Mode

```bash
# Method 1: Update .env manually
echo "CLAUDE_MODE=builder" > .env
npm run rules:build

# Method 2: Use script (once created)
npm run claude:builder
```

### Switch to PM Agent Mode

```bash
# Method 1: Update .env manually
echo "CLAUDE_MODE=pm-agent" > .env
npm run rules:build

# Method 2: Use script (once created)
npm run claude:pm
```

---

## 🔧 Builder Mode

**Purpose:** Build the PM Agent application itself

**Rules Location:** `.cursor/rules-source-builder/`

**What Claude Does:**
- ✅ Develop apps in `apps/` (viewer, main, api)
- ✅ Build packages in `packages/` (core logic)
- ✅ Write tests (TDD with E2E > Integration > Unit)
- ✅ Follow hexagonal architecture
- ✅ Use React bulletproof patterns for UI
- ✅ Implement SQLite repository patterns

**Rules Included (13 total):**
1. Hexagonal architecture (Electron + Express adapters)
2. TDD workflow with Brain Garden
3. SQLite database patterns
4. PM Agent domain logic
5. PM Agent motivation system
6. React bulletproof component pattern
7. Component design decision tree (desktop)
8. Brain monitor validation
9. Monorepo structure
10. Node functional patterns
11. Documentation strategy
12. Package docs & versioning
13. PR creation guidelines

**When to Use:**
- Developing PM Agent features
- Adding new packages
- Writing tests
- Refactoring code
- Building the Electron app

---

## 🧠 PM Agent Mode

**Purpose:** BE the PM Agent (Steve) managing projects

**Rules Location:** `.cursor/rules-source-pm-agent/`

**What Claude Does:**
- ✅ Load session context from `.pm-agent/todos/`
- ✅ Query project database (`.pm-agent/db/pm-agent.db`)
- ✅ Generate motivation verdicts
- ✅ Track accomplishments
- ✅ Maintain knowledge base (`.pm-agent/knowledge/`)
- ✅ Communicate as Steve (warm, professional, direct)
- ✅ Help with ADHD-friendly organization

**Rules Included (6 behavior rules):**
1. **Session Protocol** - Load context, surface recommendations
2. **Project Analysis** - Calculate quality scores, motivation verdicts
3. **Conversation Style** - Steve persona, ADHD-friendly communication
4. **Knowledge Management** - Patterns, insights, decisions
5. **Todo Discipline** - Track ALL work, mandatory accomplishments
6. **Decision Framework** - Resume, pause, archive, finish recommendations

**When to Use:**
- Managing projects in Dev workspace
- Getting status updates
- Deciding what to work on
- Context switching between projects
- Reviewing progress

---

## ⚠️ Mode Sync Warning

The build script tracks which mode was last built. If you change `CLAUDE_MODE` in `.env` without rebuilding, you'll get a warning:

```
🚨 MODE MISMATCH!
   .env says: pm-agent
   Rules built for: builder

   Run: npm run rules:build
```

This prevents accidentally using the wrong rules.

---

## 📦 Package.json Scripts

```json
{
  "scripts": {
    "// ========== Claude Mode ==========": "",
    "claude:builder": "echo 'CLAUDE_MODE=builder' > .env && npm run rules:build",
    "claude:pm": "echo 'CLAUDE_MODE=pm-agent' > .env && npm run rules:build",
    "claude:mode": "grep CLAUDE_MODE .env || echo 'CLAUDE_MODE not set'",

    "// ========== Rules Management ==========": "",
    "rules:build": "tsx .cursor/sync/build-consolidated-rules.ts",
    "rules:watch": "tsx watch --watch-path=.cursor/rules-source-* .cursor/sync/build-consolidated-rules.ts"
  }
}
```

---

## 🎯 Typical Workflow

### Building the PM Agent App

```bash
# 1. Switch to builder mode
echo "CLAUDE_MODE=builder" > .env
npm run rules:build

# 2. Start Claude Code in /Users/dmieloch/Dev
# Claude now acts as developer agent

# 3. Build features
# - Write tests first (TDD)
# - Follow hexagonal architecture
# - Use Brain Garden tooling

# 4. Commit changes
git add .
git commit -m "feat: add motivation dashboard"
```

### Using PM Agent

```bash
# 1. Switch to PM agent mode
echo "CLAUDE_MODE=pm-agent" > .env
npm run rules:build

# 2. Start Claude Code in /Users/dmieloch/Dev
# Claude now acts as Steve, the PM Agent

# 3. Get project status
# "Hey Steve, what should I work on today?"

# 4. Load context for specific project
# "Show me the status of cannabis-codex"

# 5. Make decisions
# "Should I resume brain-garden-os or start something new?"
```

---

## 🔍 How It Works

### Build Script Logic

```typescript
// .cursor/sync/build-consolidated-rules.ts

// 1. Read CLAUDE_MODE from .env
const mode = getClaudeMode(); // 'builder' or 'pm-agent'

// 2. Check if mode changed since last build
checkRulesSyncStatus(mode); // Warns if different

// 3. Select rules directory
const RULES_DIR = `.cursor/rules-source-${mode}/`;

// 4. Build rules from selected directory
buildRules(RULES_DIR);

// 5. Save current mode
writeFileSync('.cursor/.last-build-mode', mode);
```

### Context Selection

**Builder Mode:**
- Contexts: `apps/`, `packages/`, `tooling/`
- Focus: PM Agent monorepo structure

**PM Agent Mode:**
- Contexts: Root workspace, `.pm-agent/`
- Focus: All 190+ projects in Dev/

---

## 📚 Documentation

### Builder Mode Docs
- See rules in `.cursor/rules-source-builder/`
- Each rule has detailed examples
- Focus on code quality, testing, architecture

### PM Agent Mode Docs
- See rules in `.cursor/rules-source-pm-agent/`
- Each rule has usage examples
- Focus on PM behavior, recommendations, knowledge

### PM Agent Workspace Docs
- `.pm-agent/docs/PM_AGENT_BMAD.md` - Complete operating manual
- `.pm-agent/docs/MOTIVATION_SYSTEM.md` - Motivation philosophy
- `.pm-agent/docs/TODO_FRAMEWORK.md` - Todo tracking system

---

## 🚀 Getting Started

### First Time Setup

```bash
# 1. Ensure .env exists
if [ ! -f .env ]; then
  echo "CLAUDE_MODE=builder" > .env
fi

# 2. Build rules for current mode
npm run rules:build

# 3. Start using Claude Code
```

### Daily Use

```bash
# Check current mode
npm run claude:mode

# Switch modes as needed
npm run claude:builder  # To develop
npm run claude:pm       # To manage projects
```

---

## ❓ FAQ

**Q: Can I have both modes active at once?**
A: No. One mode at a time. Switch by changing `.env` and rebuilding.

**Q: What happens if I forget to rebuild after changing mode?**
A: The build script will warn you about the mismatch.

**Q: Can I edit rules while in a mode?**
A: Yes! Edit files in `.cursor/rules-source-builder/` or `-pm/`, then run `npm run rules:build`.

**Q: Where are the generated rules?**
A: `CLAUDE.md`, `AGENTS.md`, etc. at root and in subdirectories.

**Q: Can I add more rules?**
A: Yes! Add new `.rules.mdc` files to the appropriate directory and rebuild.

---

## 🎓 Understanding the Two Modes

### Builder Mode is for DEVELOPING the tool
- Writing code
- Running tests
- Building features
- Fixing bugs
- Following software engineering best practices

### PM Agent Mode is for USING the tool
- Managing projects
- Getting recommendations
- Loading context
- Making decisions
- Acting as Steve (the PM)

---

**Think of it like this:**
- **Builder Mode** = You're building a calculator
- **PM Agent Mode** = You're using the calculator to do math

Same Claude Code, different rules, different behaviors!
