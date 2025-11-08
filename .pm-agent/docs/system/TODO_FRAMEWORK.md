# PM Agent Todo Tracking Framework

## 🎯 Purpose

**Why This Exists:**

The PM Agent needs a persistent, queryable record of:
1. **What's being worked on right now** (active session todos)
2. **What needs to be done** (backlog per project)
3. **What was accomplished** (historical record)
4. **What got blocked** (impediments and context)

This creates a continuous thread of work across sessions, making it easy for:
- **The PM agent** to remember where you left off
- **Any agent** operating in this repo to understand current tasks
- **The developer** to see progress over time
- **Future sessions** to pick up context instantly

## 📐 Architecture

### Three-Layer System

```
┌─────────────────────────────────────────────────────┐
│  SESSION TODOS (Ephemeral - Current Work)          │
│  - What Claude is doing RIGHT NOW                  │
│  - Mirrors Claude Code's TodoWrite tool            │
│  - Cleared at session end → moved to completed     │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│  PROJECT TODOS (Persistent - What Needs Doing)     │
│  - Per-project backlog                             │
│  - Survives sessions                               │
│  - Gets refined as agent learns about codebase     │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│  COMPLETED TODOS (Historical - Accomplishments)    │
│  - Permanent record of what was done               │
│  - Includes context, learnings, blockers           │
│  - Queryable for patterns                          │
└─────────────────────────────────────────────────────┘
```

### File Structure

```
.pm-agent/
├── todos/
│   ├── session-todos.json           # Current session (ephemeral)
│   ├── project-todos.json           # Per-project backlog
│   ├── completed-todos.json         # Historical accomplishments
│   └── blocked-todos.json           # Impediments to track
│
├── scripts/
│   ├── todo-manager.js              # Core todo logic
│   ├── todo-cli.js                  # Command-line interface
│   └── todo-session-bridge.js       # Claude Code integration
│
└── docs/
    ├── TODO_FRAMEWORK.md            # This file
    └── PM_AGENT_BMAD.md             # BMAD documentation
```

## 🔧 Schema Definitions

### Session Todo (Ephemeral)
```json
{
  "id": "todo_sess_abc123",
  "sessionId": "claude_session_xyz",
  "content": "Fix Docker networking in brain-garden-os",
  "activeForm": "Fixing Docker networking in brain-garden-os",
  "status": "in_progress",
  "createdAt": "2025-11-07T17:30:00Z",
  "startedAt": "2025-11-07T17:32:00Z",
  "completedAt": null,
  "project": "brain-garden-os",
  "context": {
    "files": ["docker-compose.yml", "src/config/network.ts"],
    "relatedIssues": ["Port 8090 conflict"],
    "dependencies": []
  }
}
```

### Project Todo (Persistent)
```json
{
  "id": "todo_proj_def456",
  "project": "scheduling-station-app",
  "title": "Implement recurring appointments",
  "description": "Add support for weekly/monthly recurring appointments",
  "priority": "high",
  "status": "backlog",
  "estimatedHours": 3,
  "tags": ["feature", "calendar"],
  "createdAt": "2025-11-05T10:00:00Z",
  "updatedAt": "2025-11-07T14:20:00Z",
  "createdBy": "pm-agent",
  "context": {
    "relatedFiles": ["src/appointments/recurring.ts"],
    "dependencies": ["User model refactor"],
    "notes": "User requested this feature. Similar to Google Calendar."
  },
  "history": [
    {
      "date": "2025-11-05",
      "action": "created",
      "note": "User mentioned this in conversation"
    },
    {
      "date": "2025-11-07",
      "action": "refined",
      "note": "Added specific requirements after codebase review"
    }
  ]
}
```

### Completed Todo (Historical)
```json
{
  "id": "todo_comp_ghi789",
  "originalId": "todo_sess_abc123",
  "project": "brain-garden-os",
  "title": "Fix Docker networking",
  "completedAt": "2025-11-07T18:15:00Z",
  "sessionId": "claude_session_xyz",
  "durationMinutes": 45,
  "outcome": "success",
  "accomplishment": {
    "what": "Fixed Docker compose port conflict by changing 8090 → 8091",
    "how": "Modified docker-compose.yml and updated .env.example",
    "impact": "Dashboard now runs without conflicts",
    "filesChanged": ["docker-compose.yml", ".env.example", "README.md"],
    "commits": ["abc123ef: Fix Docker networking port conflict"],
    "learnings": [
      "Port 8090 conflicts with AirPlay on macOS",
      "Always document port changes in README"
    ]
  },
  "blockers": [],
  "tags": ["devops", "docker", "bugfix"]
}
```

### Blocked Todo (Impediments)
```json
{
  "id": "todo_block_jkl012",
  "project": "parenting-copilot",
  "title": "Fix authentication tests",
  "blockedAt": "2025-11-07T16:00:00Z",
  "blocker": {
    "type": "technical",
    "description": "Tests require external API credentials that aren't available",
    "possibleSolutions": [
      "Mock the external API",
      "Get test API keys from service provider",
      "Refactor to use dependency injection"
    ],
    "priority": "medium",
    "unblockEstimate": "2 hours once credentials available"
  },
  "context": {
    "attemptedSolutions": [
      "Tried using production credentials - failed (rate limited)",
      "Looked for mock library - none available"
    ],
    "relatedDocs": ["tests/README.md", "docs/authentication.md"]
  }
}
```

## 🔄 Lifecycle Flow

### 1. Session Start
```javascript
// PM agent loads context
const todos = todoManager.getSessionContext({
  project: getCurrentProject(),
  lastNSessions: 3
});

// Shows developer:
// - Completed todos from last session
// - Active project todos
// - Any blockers to be aware of
```

### 2. During Session
```javascript
// As agent works, it creates session todos
todoManager.createSessionTodo({
  content: "Implement user authentication",
  project: "scheduling-station-app"
});

// Updates status in real-time
todoManager.updateTodoStatus(todoId, "in_progress");
todoManager.updateTodoStatus(todoId, "completed", {
  accomplishment: { ... }
});
```

### 3. Session End
```javascript
// Auto-capture at session end
todoManager.captureSessionSummary({
  sessionId: currentSessionId,
  completedTodos: [...],
  inProgressTodos: [...],
  newBlockers: [...]
});

// Moves completed → historical
// Moves in_progress → project todos (if not done)
// Records blockers separately
```

## 🎯 Integration with PM Agent

### Startup Protocol
When PM agent starts (via CLAUDE.md), it:

1. **Loads last session summary:**
```javascript
const lastSession = todoManager.getLastSessionSummary();
console.log(`
Last time (${lastSession.date}):
✅ Completed: ${lastSession.completed.length} tasks
⏳ In progress: ${lastSession.inProgress.length} tasks
🚫 Blocked: ${lastSession.blockers.length} items
`);
```

2. **Surfaces project-specific context:**
```javascript
const projectContext = todoManager.getProjectTodos({
  project: currentProject,
  status: ["backlog", "in_progress"]
});
```

3. **Identifies patterns:**
```javascript
const insights = todoManager.analyzePatterns({
  project: currentProject,
  timeframe: "last-30-days"
});
// "You often work on authentication on weekday evenings"
// "Docker issues appear in 3 projects - consider documenting solution"
```

### During Session
PM agent uses this to:
- Track what it's doing (transparency)
- Build accomplishment record (for developer satisfaction)
- Identify blockers early (flag impediments)
- Maintain project backlogs (refine todos as it learns)

### Commands Available

```bash
# Session management
pm-todo list                          # Current session todos
pm-todo add "Fix Docker networking"   # Create new todo
pm-todo done <id>                     # Mark completed

# Project management
pm-todo project scheduling-station-app    # Show project backlog
pm-todo add-project "Implement feature X" # Add to project backlog
pm-todo refine <id>                       # Update todo with more detail

# Historical queries
pm-todo accomplished --project brain-garden-os    # What was done
pm-todo accomplished --last-week                  # Recent work
pm-todo patterns                                  # Detect patterns

# Blockers
pm-todo blocked                       # Show current blockers
pm-todo unblock <id> "Got API keys"   # Resolve blocker
```

## 📊 Analytics & Insights

The todo system enables:

### Velocity Tracking
```javascript
{
  "project": "brain-garden-os",
  "last30Days": {
    "todosCompleted": 23,
    "avgCompletionTime": "45 minutes",
    "velocity": "1.2 todos/session"
  }
}
```

### Pattern Detection
```javascript
{
  "patterns": [
    "Docker configuration issues recur across 3 projects",
    "Authentication work concentrated in evening sessions",
    "Tests often blocked on external dependencies"
  ],
  "recommendations": [
    "Create reusable Docker template",
    "Document authentication pattern",
    "Setup mock server for tests"
  ]
}
```

### Accomplishment Feed
```javascript
// For developer motivation
{
  "thisWeek": {
    "projectsWorkedOn": 3,
    "featuresCompleted": 5,
    "bugsFixed": 7,
    "linesOfCode": 1247,
    "highlight": "Completed agent communication system with full threading support"
  }
}
```

## 🧠 Memory Integration

Todos integrate with three memory systems:

1. **claude-mem (Automatic)**
   - Captures todo creation/completion as observations
   - Enables semantic search ("when did I fix Docker?")

2. **Project Registry (Structured)**
   - Links todos to project metadata
   - Tracks project health based on todo completion

3. **Brain Garden Memory (Knowledge)**
   - Stores learnings from completed todos
   - Builds cross-project knowledge base

## 🎓 BMAD Principles Applied

**Behavior:** How agent works with todos
**Motivation:** Why this system exists
**Appearance:** What developer sees
**Design:** Technical architecture

See `PM_AGENT_BMAD.md` for full BMAD documentation.

## 🚀 Getting Started

```bash
# Initialize the todo system
cd /Users/dmieloch/Dev
node .pm-agent/scripts/todo-manager.js init

# Start using it
node .pm-agent/scripts/todo-cli.js add "Your first todo"
```

## 🔮 Future Enhancements

- [ ] Visual todo dashboard (web UI)
- [ ] GitHub Issues sync (bidirectional)
- [ ] AI-powered todo refinement (as agent learns codebase)
- [ ] Voice-to-todo (for ADHD brain dump)
- [ ] Pomodoro integration (time tracking)
- [ ] Team collaboration (if multiple agents work on project)

---

**This system ensures nothing gets lost between sessions.**

Every insight, every blocker, every accomplishment - captured and queryable.
