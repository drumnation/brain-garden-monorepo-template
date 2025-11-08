# The REAL Problem - Project Memory & Discovery

**The Insight:** Your issue isn't file organization - it's **project amnesia**.

## 😰 The Problem

### What's Actually Happening

```
AI builds project super fast (30 min)
      ↓
You move to next thing
      ↓
2 months later...
      ↓
"Wait, did I already build something for X?"
      ↓
Can't remember what half these projects do
      ↓
Throw away good code because memory sucks
      ↓
Re-build the same thing 6 months later
```

**Root cause:** AI coding is so fast, you accumulate projects faster than you can remember them.

### The REAL Questions You Need Answered

1. **"What does this project do?"** (can't remember)
2. **"Why did I build it?"** (what problem did it solve?)
3. **"Is it valuable?"** (should I keep it?)
4. **"Did I already build something for X?"** (search/discovery)
5. **"What's working? What's abandoned?"** (objective status)
6. **"Is this worth finishing?"** (value assessment)

### What You DON'T Need

❌ Customer-facing products (most are for you!)
❌ Shipped/paused/active folders (too much movement)
❌ Complex organization (keep it simple)

### What You DO Need

✅ **Captured knowledge** - What each project does
✅ **Search/discovery** - "Show me projects about X"
✅ **Objective tracking** - Used recently? Tests pass? Deployed?
✅ **Value assessment** - Worth keeping? Duplicate of something else?
✅ **AI memory assistant** - Remembers everything for you

---

## 🎯 The Solution: PM Agent as AI Memory

**Reframe:** PM agent isn't a file organizer. It's your **external project memory.**

### Core Features Needed

#### 1. Auto-Capture Project Purpose (On Creation)

When you create a project, capture WHY:

```bash
# AI coding session ends
claude-code session-end

# PM agent asks:
"I see you created medical-billing-optimizer.
What does it do? (1 sentence)"
> Optimizes medical billing codes for maximum reimbursement

"What problem does it solve?"
> Reduces billing errors and increases revenue for medical practices

"Is this for a client, personal use, or experiment?"
> Experiment to test if I can build a SaaS

# Saved to project-registry.json
```

#### 2. Auto-Track Real Usage (Objective Data)

```javascript
{
  "name": "medical-billing-optimizer",
  "purpose": "Optimizes medical billing codes for maximum reimbursement",
  "problem": "Reduces billing errors and increases revenue",
  "type": "experiment-saas",

  "realUsage": {
    "lastOpened": "2025-11-07",
    "daysInactive": 3,
    "timesOpened": 47,              // Actually using it!
    "hasTests": true,
    "testsPass": true,
    "hasDeployment": false,
    "hasRealUsers": false,
    "linesOfCode": 2847
  },

  "aiGenerated": true,
  "buildTime": "45 minutes",
  "builtWith": "Claude Code"
}
```

#### 3. Smart Search (Discovery)

```bash
# 2 months later, you forget you built it
pm-search "medical billing"

# Output:
Found 1 project:

  📦 medical-billing-optimizer
     Purpose: Optimizes medical billing codes for maximum reimbursement
     Last used: 3 days ago (you're actually using this!)
     Status: Tests passing, no deployment
     Location: /Users/dmieloch/Dev/projects/experiments/medical-billing-optimizer
```

#### 4. Value Assessment (Should I Keep This?)

```bash
pm-assess medical-billing-optimizer

# AI analyzes:
# - Last used recently? ✅ 3 days ago
# - Actually opened? ✅ 47 times
# - Tests exist? ✅ Yes, passing
# - Real data? ✅ Has database with 200 records
# - Deployed? ❌ No
# - Similar projects? ❌ None

Assessment: KEEP - High value

Reasons:
✅ You're actively using it (47 opens, last 3 days ago)
✅ Has real data (200 records)
✅ Tests are passing
✅ Unique - no other medical billing projects

Recommendation: Consider deploying - you're clearly using it!
```

#### 5. Duplicate Detection

```bash
pm-check-duplicates

# Output:
🔍 Found potential duplicates:

Cannabis projects (3 found):
  📦 cannabis-codex       (2.2GB, last used 2 days ago, active dev)
  📦 cannacodex          (879MB, last used 90 days ago, Python version)
  📦 cannabis-matcher    (234MB, last used 180 days ago, embedded in cannabis-codex)

Recommendation:
  KEEP: cannabis-codex (actively using)
  DELETE: cannacodex (Python experiment, superseded)
  DELETE: cannabis-matcher (embedded in main project)

Would save: 1.1GB
```

#### 6. "What Did I Build?" Report

```bash
pm-inventory --last-6-months

# Output:
📊 Projects Created Last 6 Months (23 total):

By Category:
  🧪 Experiments: 15 projects
  🛠️  Tools: 5 projects
  💼 Client work: 2 projects
  🎓 Learning: 1 project

By Status:
  ✅ Active (used last 30 days): 8 projects
  ⏸️  Paused (31-90 days): 7 projects
  🗑️  Abandoned (90+ days): 8 projects

Valuable finds:
  • medical-billing-optimizer - Using actively! (47 opens)
  • cursor-focus-ts - Using daily (203 opens)
  • parallel-claude - Used occasionally (12 opens)

Candidates for deletion:
  • temp-test-project (0 opens, 180 days old)
  • quick-poc-thing (2 opens, 120 days old)
  • another-calendar-app (0 opens, 90 days old) - duplicate?
```

---

## 🏗️ Simplified Structure (For Your Reality)

Since most projects are experiments/tools for yourself:

```
projects/
├── WORK/                          # Actual client/job work
│   └── scala/                     # Day job
│
├── EXPERIMENTS/                   # Everything else (90% of your projects)
│   ├── active/                    # Working on now (metadata tracks this)
│   ├── tools/                     # Built tools that work
│   ├── learning/                  # Tutorials, forks, trying things
│   └── archive/                   # Done, keeping code
│
└── .pm-agent/                     # THE BRAIN
    ├── project-registry.json      # Knows everything about every project
    ├── project-knowledge/         # AI-captured knowledge
    │   ├── medical-billing-optimizer.md
    │   ├── cannabis-codex.md
    │   └── cursor-focus-ts.md
    └── screenshots/               # Visual memory
```

**Why this works:**
- ✅ Simple structure (work vs experiments)
- ✅ Intelligence in metadata, not folders
- ✅ PM agent = your project memory
- ✅ Search/discovery by purpose, not name
- ✅ Objective value assessment (data, not feelings)

---

## 📝 Enhanced project-registry.json

```json
{
  "projects": [
    {
      "name": "medical-billing-optimizer",
      "path": "projects/EXPERIMENTS/active/medical-billing-optimizer",

      "knowledge": {
        "purpose": "Optimizes medical billing codes for maximum reimbursement",
        "problem": "Medical practices lose revenue due to incorrect coding",
        "solution": "AI-powered code suggestion based on diagnosis",
        "technicalApproach": "Next.js frontend, Express API, PostgreSQL, OpenAI",
        "uniqueValue": "First tool I've built for medical billing domain",

        "createdWhen": "2025-09-15",
        "createdWhy": "Exploring SaaS opportunity in medical tech",
        "aiAssisted": true,
        "buildTime": "45 minutes initial, 3 hours total",

        "status": "actively-developing",
        "lastThought": "Working well, considering deployment",
        "nextSteps": ["Add authentication", "Deploy to Railway", "Test with real practice"]
      },

      "usage": {
        "lastOpened": "2025-11-07",
        "totalOpens": 47,
        "daysActive": 25,
        "daysInactive": 3,
        "averageSessionLength": "45 minutes",

        "hasRealData": true,
        "recordCount": 200,
        "hasDeploy": false,
        "hasTests": true,
        "testsPassing": true,
        "lastTestRun": "2025-11-07"
      },

      "value": {
        "assessed": "high",
        "reasons": [
          "Actually using it (47 opens)",
          "Has real data (200 records)",
          "Tests passing",
          "Unique - no duplicates",
          "Clear next steps"
        ],
        "recommendation": "KEEP - Consider deploying"
      }
    }
  ]
}
```

---

## 🤖 PM Agent Intelligence Features

### Feature 1: Session-End Knowledge Capture

```bash
# After every coding session
claude-code session-end

# PM agent:
"I see you worked on medical-billing-optimizer for 45 minutes.

Quick capture (30 seconds):
1. What did you accomplish?
   > Added authentication with Clerk

2. What's next?
   > Deploy to Railway and test with real data

3. Any blockers?
   > Need Railway account setup

Saved! I'll remember this."
```

### Feature 2: Weekly Review

```bash
pm-review

# Output:
📊 Weekly Review - Nov 1-7, 2025

You worked on 5 projects:
  🔥 cannabis-codex (8 hours) - Active development
  🛠️  cursor-focus-ts (2 hours) - Bug fixes
  💼 case-hero (4 hours) - Client work
  🧪 medical-billing-optimizer (3 hours) - New feature
  📚 n8n-workflows (1 hour) - Learning

Accomplishments:
  ✅ Shipped cannabis vape matcher
  ✅ Fixed cursor focus bug
  ✅ Client case analysis working

Stale projects (90+ days):
  🗑️  7 projects haven't been touched

  High value but stale:
    • parallel-claude (used to use daily, now 120 days)
      Recommendation: Archive or restart?

  Low value, delete?
    • temp-test-123 (never used, 180 days)
    • quick-poc (2 opens, 120 days)

Would you like to review stale projects? (y/n)
```

### Feature 3: Natural Language Search

```bash
pm-search "what do I have for tracking medical stuff"

# AI-powered search:
Found 2 projects:

1. medical-billing-optimizer
   Purpose: Optimizes medical billing codes
   Last used: 3 days ago
   Value: High (actively using)

2. medical-supply-monorepo
   Purpose: Medical supply chain management
   Last used: 120 days ago
   Value: Low (abandoned, 1 year old)

Would you like details on either? (1/2)
```

### Feature 4: Value-Based Cleanup

```bash
pm-cleanup --smart

# AI analyzes all projects:
📊 Smart Cleanup Analysis

DELETE SAFELY (Low value, old, no data):
  • temp-test-123 (0 opens, 180 days, 45MB)
  • quick-poc-thing (2 opens, 120 days, 234MB)
  • another-calendar-app (0 opens, 90 days, 567MB)
  Total: 846MB

REVIEW NEEDED (High potential but abandoned):
  • parallel-claude (was valuable, 120 days inactive)
    Last thought: "Working well, use for batch processing"
    Recommendation: Try using again? Or archive?

KEEP (Active or valuable):
  • cannabis-codex (using actively)
  • medical-billing-optimizer (using actively)
  • cursor-focus-ts (using daily)

Execute delete? This will:
  1. Move to archive/2025-Q1-deleted/
  2. Keep for 30 days (safety)
  3. Permanently delete after 30 days

Continue? (y/n)
```

---

## 🎯 This Solves Your Real Problem

### Before (Current State)
- 😰 Can't remember what projects do
- 😰 Throw away good code
- 😰 Re-build same things
- 😰 No objective value assessment
- 😰 Memory sucks (your words!)

### After (With Enhanced PM Agent)
- ✅ AI remembers everything
- ✅ Search by purpose/problem
- ✅ Objective value tracking (usage data)
- ✅ Automatic duplicate detection
- ✅ Weekly review of stale projects
- ✅ Smart cleanup (keep valuable, delete noise)

---

## 🚀 What to Build

### Phase 1: Knowledge Capture (Week 1)
1. Session-end knowledge capture hook
2. Auto-track project opens/usage
3. Simple purpose/problem/value schema

### Phase 2: Discovery (Week 2)
1. Natural language search
2. Duplicate detection
3. Value assessment algorithm

### Phase 3: Intelligence (Week 3)
1. Weekly review system
2. Smart cleanup recommendations
3. "Did I build this already?" check before starting new projects

---

## 🤔 Questions for You

1. **Medical supply monorepo - worth keeping?**
   - Has office-networking work you value
   - But monorepo is "lifeless"
   - Extract networking project, archive the rest?

2. **Most projects are experiments - confirm?**
   - Not customer-facing products?
   - Built for yourself to solve problems?
   - Or just trying new tech?

3. **What makes a project "valuable" to you?**
   - Actually using it?
   - Learned something?
   - Could become a product?
   - Solved a real problem?

4. **How far back do you want PM agent to remember?**
   - All 190 projects?
   - Or just focus on last 6-12 months?
   - Older stuff can be bulk-archived?

---

**This is what PM agent should be:**

Not a file organizer.

**An AI that remembers your projects better than you do.**

Sound right? 🎯
