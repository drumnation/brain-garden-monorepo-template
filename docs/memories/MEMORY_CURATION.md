# Memory Curation System

**Purpose:** Document how the PM Agent manages its multi-layered memory system to maintain relevance, accuracy, and efficiency over time.

## 🧠 Memory Architecture Overview

The PM Agent uses **four layers** of memory with different characteristics:

```
┌─────────────────────────────────────────┐
│  Layer 1: claude-mem (Automatic)        │  <- Session history, tool usage
│  Lifecycle: Auto, 30-day sliding window │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  Layer 2: project-registry.json         │  <- Structured metadata
│  Lifecycle: On-demand scan, 7-day cache │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  Layer 3: docs/memories/ (Curated)      │  <- Long-term insights
│  Lifecycle: Manual curation, periodic   │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  Layer 4: Brain Garden (Semantic)       │  <- Knowledge graph
│  Lifecycle: Episode-based, relationship │
└─────────────────────────────────────────┘
```

## 📁 docs/ Folder Structure

```
docs/
├── memories/MEMORY_CURATION.md           # This file
├── memories/                    # Long-term insights
│   ├── 2025-11-07-space-crisis.md
│   ├── 2025-11-07-worktree-patterns.md
│   └── architecture-decisions/
├── project-snapshots/           # Point-in-time project states
│   ├── brain-garden-os-2025-11.md
│   └── scheduling-station-2025-11.md
├── decisions/                   # Architectural & strategic decisions
│   ├── 001-multi-layered-memory.md
│   └── 002-src-folder-structure.md
├── patterns/                    # Observed patterns over time
│   ├── developer-work-cycles.md
│   └── project-lifecycle-patterns.md
└── goals/                       # Strategic goals & progress
    ├── 2025-q4-cleanup.md
    └── 2026-q1-automation.md
```

## 🔄 Memory Lifecycle

### Layer 1: claude-mem (Automatic)

**What it stores:**
- Tool usage (files read, commands run)
- Decisions made during sessions
- Problems encountered & solutions
- Code changes & rationale

**Lifecycle:**
- **Retention:** 30 days sliding window
- **Curation:** Automatic (done by claude-mem)
- **Pruning:** Old observations auto-archived
- **Access:** MCP search tools

**PM Agent role:** Query for recent context

### Layer 2: project-registry.json (Structured)

**What it stores:**
```json
{
  "projectName": "brain-garden-os",
  "status": "active-development",
  "lastCommit": "2025-11-05",
  "health": { "builds": true, "tests": "47/50" },
  "size": { "total": "3.8GB", "nodeModules": "1.2GB" }
}
```

**Lifecycle:**
- **Retention:** Current state always, historical in git
- **Curation:** Scan on-demand or scheduled (daily?)
- **Pruning:** Old entries removed when projects deleted
- **Access:** Direct file read + jq queries

**PM Agent role:** Maintain current, trigger scans

### Layer 3: docs/memories/ (Curated)

**What it stores:**
- Significant insights ("Discovered parenting-pilot has 205 worktrees!")
- Architectural decisions ("Why we chose multi-layered memory")
- Lessons learned ("Worktree best practices")
- Strategic context ("Goal: Build autonomous PM agent")

**Lifecycle:**
- **Retention:** Indefinite (until obsolete)
- **Curation:** Manual (PM agent with human approval)
- **Pruning:** Quarterly review, mark as `[OBSOLETE]`
- **Access:** File system, grep, full-text search

**PM Agent role:** Active curator, periodic reviewer

### Layer 4: Brain Garden Memory (Semantic)

**What it stores:**
- Cross-project relationships
- Developer patterns ("Works on Brain Garden in evenings")
- Technical insights ("JWT refresh pattern used in 3 projects")
- Evolution over time (time-aware facts)

**Lifecycle:**
- **Retention:** Indefinite with temporal metadata
- **Curation:** Automatic relationship building
- **Pruning:** Facts marked invalid when superseded
- **Access:** MCP brain-memory search tools

**PM Agent role:** Add episodes, query for insights

## 🗑️ Memory Flushing Protocol

### When to Flush Memory:

#### 1. Project Deletion
```markdown
Event: Project completely removed from filesystem

Actions:
- Remove from project-registry.json
- Archive docs/project-snapshots/[project].md → archived/
- Update cross-references in memories/
- Mark Brain Garden facts as invalid
- Keep deletion record in CHANGELOG
```

#### 2. Obsolete Insights
```markdown
Event: Information no longer accurate or relevant

Example: "parenting-pilot uses Redux" (now uses Zustand)

Actions:
- Mark memory file with [OBSOLETE - DATE]
- Create new memory with current truth
- Link old → new for context
- Update project snapshot
```

#### 3. Completed Goals
```markdown
Event: Goal achieved, no longer in active work

Example: "Goal: Recover 100GB disk space" ✅ Done!

Actions:
- Move from goals/active/ → goals/completed/
- Add completion date and final outcome
- Extract learnings to patterns/
- Update README with new status
```

#### 4. Stale Patterns
```markdown
Event: Pattern no longer observed (developer behavior changed)

Example: "Developer context-switches every 2 hours"
(Now: More focused, 4-hour blocks)

Actions:
- Append [PATTERN CHANGED - DATE] to old pattern
- Create new pattern file
- Analyze what caused the change
- Store as evolution data
```

### Flushing Schedule

**Daily:**
- Remove temporary analysis files
- Clear scan cache if stale
- Archive completed session notes

**Weekly:**
- Review project-snapshots/ for updates
- Identify obsolete memories
- Update goal progress
- Generate weekly summary

**Monthly:**
- Review all memories/ for accuracy
- Flush truly obsolete content
- Consolidate related insights
- Update patterns/

**Quarterly:**
- Deep memory audit
- Archive old snapshots
- Prune Brain Garden invalid facts
- Review and update CLAUDE.md

## 📝 Curation Guidelines

### What Deserves Long-Term Memory (docs/memories/):

✅ **DO Store:**
- Critical insights ("205 worktrees is unprecedented!")
- Architectural decisions with rationale
- Patterns that repeat across projects
- Strategic goals and milestones
- Lessons learned from failures
- Cross-project relationships
- Technical discoveries

❌ **DON'T Store:**
- Routine operations ("Ran tests")
- Temporary debugging notes
- One-off fixes
- Session summaries (those go in claude-mem)
- Duplicate information
- Trivial observations

### Memory File Format:

```markdown
# Title of Insight/Decision

**Date:** 2025-11-07
**Category:** insight | decision | pattern | goal
**Status:** active | obsolete | archived
**Related Projects:** brain-garden-os, scheduling-station

## Context
Why this matters, what led to this insight

## Details
The actual insight, decision, or pattern description

## Implications
How this affects future work

## Related Memories
- Link to related memory files
- Cross-references

## Updates
- 2025-11-15: Updated with new findings
- 2025-12-01: Marked as [PATTERN CHANGED]
```

## 🔍 Querying Memory

### For PM Agent (Session Startup):

```javascript
// 1. Query claude-mem for recent context
const recentSessions = await claudeMem.search({
  query: "recent PM agent activity",
  last_n_days: 7
});

// 2. Load project registry
const projects = JSON.parse(
  fs.readFileSync('.pm-agent/project-registry.json')
);

// 3. Read recent memories
const recentMemories = execSync(
  'ls -t docs/memories/*.md | head -10'
).toString().split('\n')
  .map(file => fs.readFileSync(file, 'utf8'));

// 4. Query Brain Garden for patterns
const patterns = await brainMemory.searchFacts({
  query: "developer work patterns recent projects",
  max_facts: 10
});

// 5. Synthesize context summary
const context = {
  recentWork: recentSessions,
  projectStates: projects.projects.filter(p => p.status === 'active-development'),
  insights: recentMemories,
  patterns: patterns
};

return context;
```

### For Human Developer:

```bash
# Search all memories
grep -r "authentication" docs/

# Find recent insights
ls -lt docs/memories/ | head -10

# Check project snapshot
cat docs/project-snapshots/brain-garden-os-2025-11.md

# Review decisions
ls docs/decisions/

# Check goal progress
cat docs/goals/2025-q4-cleanup.md
```

## 🤖 Automated Curation Process

### End of Each Session:

1. **PM agent reviews session**
   - What was significant?
   - Any insights worth preserving?
   - Decisions made?
   - Patterns observed?

2. **If significant, create memory file:**
   ```bash
   # Prompt PM agent:
   "Should anything from this session be added to long-term memory?"

   # If yes:
   echo "[Memory content]" > docs/memories/YYYY-MM-DD-insight-title.md
   ```

3. **Update project snapshots if needed:**
   ```bash
   # If project state changed significantly:
   node .pm-agent/scripts/update-snapshot.js --project brain-garden-os
   ```

4. **Update README/CHANGELOG:**
   ```bash
   # If system changed:
   # PM agent updates README.md
   # PM agent adds entry to CHANGELOG.md
   ```

### Memory Review (Weekly):

```javascript
// Automated script: review-memories.js

// 1. Find memories older than 90 days
const oldMemories = glob('docs/memories/*.md')
  .filter(file => {
    const age = Date.now() - fs.statSync(file).mtime;
    return age > 90 * 24 * 60 * 60 * 1000;
  });

// 2. Check if still relevant
for (const memory of oldMemories) {
  const content = fs.readFileSync(memory, 'utf8');
  const projects = extractProjectReferences(content);

  // If all mentioned projects are archived/deleted
  if (projects.every(p => isArchived(p))) {
    // Mark for review
    console.log(`Consider archiving: ${memory}`);
  }
}

// 3. Generate review report
const report = generateMemoryReport(oldMemories);
fs.writeFileSync('docs/.memory-review-report.md', report);
```

## 📊 Memory Health Metrics

Track these to ensure memory system stays healthy:

```javascript
const metrics = {
  totalMemories: glob('docs/memories/*.md').length,
  memoriesLastMonth: countRecentFiles('docs/memories/', 30),
  obsoleteMemories: grep('[OBSOLETE]', 'docs/memories/').length,
  projectSnapshots: glob('docs/project-snapshots/*.md').length,
  activations: glob('docs/goals/active/*.md').length,
  avgMemoryAge: calculateAvgAge('docs/memories/'),

  // Ideal ranges:
  idealTotal: '50-200 memories',
  idealObsolete: '< 10%',
  idealAvgAge: '< 60 days'
};
```

If metrics outside ideal ranges → trigger review!

## 🎯 Integration with Documentation Updates

Whenever memory is curated, update documentation:

```markdown
Memory Added → Update README if:
- New insight affects system architecture
- Pattern discovered changes workflows
- Goal completed or changed

Memory Marked Obsolete → Update CHANGELOG:
- Record what changed
- Link to new memory if applicable
- Document evolution

New Decision → Update CLAUDE.md:
- Add to protocols if process change
- Update operating manual if behavior change
```

## 🔮 Future Enhancements

**Planned:**
- Automated obsolescence detection (AI reviews old memories)
- Memory clustering (group related insights)
- Visual memory timeline
- Memory export (generate reports)
- Cross-session pattern mining

---

**Remember:** The goal of memory curation is to maintain a **living knowledge base** that stays relevant, accurate, and useful over time. Not all information deserves long-term memory - curate thoughtfully!

**Maintained by:** PM Agent
**Last Updated:** 2025-11-07
