# App Lifecycle Model - How Your Apps Actually Work

**Key Insight:** You build REAL apps, not experiments. The question is: "Which ones get to the stage where I'm actually using them?"

---

## 🎯 The Real Lifecycle

```
Start new app
    ↓
Build fast (AI-assisted, 30 min - 3 hours)
    ↓
    ┌─────────────────────────┐
    │                         │
    ▼                         ▼
WINS                    DOESN'T WORK
(using it!)             (start over)
    │                         │
    ▼                         ▼
Keep iterating          New version
Solid codebase             │
Daily use                  ▼
                      Old version = REFERENCE
                      (has useful patterns)
                           │
                           ▼
                      Eventually DELETE
                      (extracted what's useful)
```

---

## 📊 The Four States

### 1. **USING** (The Winners)
Apps that made it to "actually using regularly"

**Characteristics:**
- ✅ Opens daily/weekly
- ✅ Has real data (you put stuff in it)
- ✅ Code is solid
- ✅ Keeps getting better (active iteration)
- ✅ You'd notice if it broke

**Examples:**
- cannabis-codex (if you're using the vape matcher)
- cursor-tools (if you use them daily)
- brain-garden-os (if it's running)

**PM Agent tracks:**
- Last used date
- Usage frequency
- Has real data?
- Iteration velocity

### 2. **BUILDING** (Trying to Get There)
Apps you're actively developing to get to "using it" stage

**Characteristics:**
- 🔨 Recent commits (last 7-30 days)
- 🔨 Not using daily yet
- 🔨 Still figuring it out
- 🔨 Might succeed or get restarted

**Examples:**
- scheduling-station (if actively building)
- medical-billing-optimizer (if trying to get it working)

**PM Agent tracks:**
- Days since first commit
- Is velocity increasing? (getting there?)
- Or stalled? (might restart?)

### 3. **REFERENCE** (Old Versions That Worked)
Previous versions of apps you started over on

**Characteristics:**
- 📚 Replaced by newer version
- 📚 Has useful code/patterns
- 📚 Not running anymore
- 📚 Keep for finding "what worked"

**Examples:**
- parenting-pilot-v1 (superseded by v2)
- cannabis-codex-old (before current version)
- medical-supply-v1 (before monorepo)

**PM Agent tracks:**
- What's the current version?
- What was useful about this?
- Have you extracted the patterns?

### 4. **ABANDONED** (Never Got There)
Apps that didn't make it to "using it" stage

**Characteristics:**
- 💀 Built but never used
- 💀 Stale (90+ days, no opens)
- 💀 No real data
- 💀 Won't be restarted

**PM Agent suggests:**
- Delete if no value
- Archive if has learning

---

## 🏗️ Structure Based on Lifecycle

```
projects/
├── WORK/                          # Day job
│   └── scala/
│
├── APPS/                          # Your actual apps
│   ├── using/                     # ✅ USING (the winners!)
│   │   ├── cannabis-codex/       # Daily use
│   │   ├── cursor-focus-ts/      # Daily use
│   │   └── brain-garden-os/      # Using regularly
│   │
│   ├── building/                  # 🔨 BUILDING (active dev)
│   │   ├── scheduling-station/   # Trying to get working
│   │   ├── medical-billing/      # Building now
│   │   └── case-hero/            # Client work in progress
│   │
│   ├── reference/                 # 📚 Old versions (useful code)
│   │   ├── parenting-pilot-v1/
│   │   ├── parenting-pilot-v2/
│   │   ├── cannabis-codex-old/
│   │   └── medical-supply-v1/
│   │
│   └── archive/                   # 💀 Failed attempts (delete later)
│       └── [old failed projects]/
│
├── TOOLS/                         # Tools you built
│   ├── cursor-tools/
│   ├── mcp-servers/
│   └── parallel-claude/
│
└── LEARNING/                      # Cloned repos, tutorials
    ├── forks/
    └── experiments/
```

---

## 🎯 PM Agent Intelligence for Your Lifecycle

### Feature 1: Auto-Promote to USING

```bash
# PM agent detects:
# - scheduling-station opened 20 times in 30 days
# - Has real data (15 appointments)
# - Tests passing

pm-suggest-promote

Output:
🎉 Promotion candidate detected!

  scheduling-station (in building/)
  ✅ 20 opens in last 30 days
  ✅ Has real data (15 appointments)
  ✅ Tests passing
  ✅ You're using it!

  Move to using/? (y/n)
  > y

  Moved! This is a winner. 🎉
```

### Feature 2: Track App Versions

```javascript
{
  "appFamily": "parenting-pilot",
  "versions": [
    {
      "name": "parenting-pilot-v1",
      "path": "projects/APPS/reference/parenting-pilot-v1",
      "status": "reference",
      "supersededBy": "parenting-pilot-v2",
      "usefulPatterns": [
        "Voice recording implementation",
        "Calendar integration approach"
      ],
      "extracted": false  // Have you pulled out the useful code?
    },
    {
      "name": "parenting-pilot-v2",
      "path": "projects/APPS/reference/parenting-pilot-v2",
      "status": "reference",
      "supersededBy": "parenting-pilot-v3",
      "usefulPatterns": [
        "Authentication flow",
        "React Native setup"
      ],
      "extracted": false
    },
    {
      "name": "parenting-pilot-v3",
      "path": "projects/APPS/building/parenting-pilot",
      "status": "building",
      "startedOn": "2025-08-21",
      "daysBuilding": 78,
      "gettingThere": false,  // Stalled?
      "recommendation": "Consider starting v4 or pivoting to n8n"
    }
  ]
}
```

### Feature 3: "Rush to Using" Tracker

```bash
pm-status building/

Output:
🔨 Apps in BUILDING (trying to get to USING):

  scheduling-station
  ├─ Days building: 45
  ├─ Opens: 20 (increasing! ✅)
  ├─ Real data: Yes (15 appointments)
  ├─ Tests: Passing
  └─ 🎯 CLOSE! Almost ready to promote to using/

  medical-billing-optimizer
  ├─ Days building: 78
  ├─ Opens: 47 (high usage! ✅)
  ├─ Real data: Yes (200 records)
  ├─ Tests: Passing
  └─ 🎉 READY! Promote to using/?

  parenting-pilot-v3
  ├─ Days building: 78
  ├─ Opens: 2 (stalled ⚠️)
  ├─ Real data: No
  ├─ Tests: Failing
  └─ ⚠️  STALLED - Consider restarting as v4?

Recommendations:
  1. Promote medical-billing-optimizer to using/ (you're using it!)
  2. Keep pushing scheduling-station (almost there!)
  3. Decide on parenting-pilot-v3 (restart or pivot?)
```

### Feature 4: Reference Extraction Tracker

```bash
pm-reference-cleanup

Output:
📚 Old versions in reference/ (keeping for useful code):

  parenting-pilot-v1 (2.2GB)
  Useful patterns:
    • Voice recording implementation
    • Calendar integration

  Have you extracted these patterns? (y/n)
  > y

  Great! Mark as extracted and delete? (y/n)
  > y

  Deleted. Saved 2.2GB. ✅

  parenting-pilot-v2 (5.6GB)
  Useful patterns:
    • Authentication flow (Clerk integration)
    • React Native setup

  Have you extracted these patterns? (y/n)
  > n

  Keep for now. Reminder: Extract auth pattern before deleting.
```

### Feature 5: Starting Over Detection

```bash
# You create cannabis-codex-v2/

pm-detect-restart

Output:
🔍 Restart detected!

  New: cannabis-codex-v2
  Old: cannabis-codex (in using/)

  Is this a restart/replacement? (y/n)
  > y

  Should I:
  1. Move cannabis-codex to reference/
  2. Start tracking cannabis-codex-v2 as new version
  3. Link them as v1 → v2

  Continue? (y/n)
  > y

  Done! Old version in reference/, new version ready to build.
```

---

## 📊 Metrics That Matter (For Your Workflow)

### For USING Apps
```javascript
{
  "name": "cannabis-codex",
  "lifecycle": "using",
  "metrics": {
    "usageFrequency": "daily",        // How often opened
    "realDataVolume": "847 strains",  // Real usage proof
    "lastUsed": "2025-11-07",
    "daysUsing": 123,                 // How long you've been using it
    "iterationVelocity": "high",      // Still improving?
    "brokenDays": 0                   // Days it was broken
  },
  "value": "critical"                 // You'd notice if it broke
}
```

### For BUILDING Apps
```javascript
{
  "name": "scheduling-station",
  "lifecycle": "building",
  "metrics": {
    "daysBuilding": 45,
    "openFrequency": "weekly",
    "gettingThere": true,              // Usage increasing?
    "hasRealData": true,
    "dataVolume": "15 appointments",
    "testsPass": true,
    "blockers": [],
    "nextMilestone": "Deploy and start daily use"
  },
  "prediction": "Will reach 'using' in ~2 weeks"
}
```

### For REFERENCE Apps
```javascript
{
  "name": "parenting-pilot-v2",
  "lifecycle": "reference",
  "metrics": {
    "supersededBy": "parenting-pilot-v3",
    "usefulPatterns": ["Auth flow", "RN setup"],
    "patternsExtracted": false,
    "lastReferenced": "2025-10-15",   // When did you last look at it?
    "timesReferenced": 3,             // How valuable as reference?
    "safeToDelete": false             // Not until extracted
  }
}
```

---

## 🎯 Your Goal: Rush to USING

PM agent helps you focus on **getting apps to "using" stage fast**:

### Weekly Dashboard

```bash
pm-dashboard

Output:
📊 App Lifecycle Dashboard - Week of Nov 7, 2025

USING (5 apps) ✅
  • cannabis-codex (847 strains, daily use)
  • cursor-focus-ts (203 opens this week)
  • brain-garden-os (running 24/7)
  • medical-billing-optimizer (200 records)
  • parallel-claude (batch processing)

BUILDING (3 apps) 🔨
  • scheduling-station (45 days, getting close! ✅)
  • case-hero (client work, 15 days)
  • vanacore (stalled ⚠️ - 90 days, 2 opens)

REFERENCE (8 old versions) 📚
  • 3 ready to delete (patterns extracted)
  • 5 keeping (haven't extracted yet)
  • Total size: 18GB

ABANDONED (23 apps) 💀
  • Can delete: 15 apps (12GB)
  • Should review: 8 apps (might have value)

🎯 This Week's Goals:
  1. Promote medical-billing-optimizer to using/ (ready!)
  2. Push scheduling-station over the finish line
  3. Decide: Restart vanacore or abandon?
  4. Extract patterns from 2 reference apps, then delete
  5. Delete 15 abandoned apps → Save 12GB
```

---

## 🔄 Natural Workflow

### Starting New App

```bash
# You start building
mkdir cannabis-matcher-v2

# PM agent auto-detects
"New project detected: cannabis-matcher-v2

Is this:
  1. New app
  2. Restart of cannabis-matcher
  3. Tool/utility

> 2

Great! I'll:
  • Move cannabis-matcher to reference/
  • Track v2 as new version
  • Remind you to extract useful patterns from v1

Purpose of v2? (1 sentence)
> Complete rewrite with better matching algorithm

Building! Goal: Get to daily use. 🚀"
```

### Reaching "Using" State

```bash
# PM agent auto-detects usage
"🎉 cannabis-matcher-v2 milestone!

You've opened it 15 times in 10 days.
Has real data: 47 strains matched.
Tests passing.

You're using it! Move to using/? (y/n)
> y

Promoted! This is a winner. Keep iterating! 🎉"
```

### Extracting from Old Versions

```bash
pm-extract cannabis-matcher-v1

Output:
"What was useful about cannabis-matcher-v1?

1. Strain database structure? (y/n)
   > y

2. Matching algorithm? (y/n)
   > n (rewrote in v2)

3. UI components? (y/n)
   > y

Saved notes to .pm-agent/extractions/cannabis-matcher-v1.md

Safe to delete now? (y/n)
> y

Deleted. Saved 2.3GB. ✅"
```

---

## 🎯 This Matches Your Reality

**What you said:**
- ✅ Building real apps (not just experiments)
- ✅ Key is: which become useful fast enough
- ✅ Apps you keep iterating on
- ✅ Sometimes start over (new version)
- ✅ Old versions useful for reference
- ✅ Once solid + using it = winner
- ✅ Goal: Rush every app to "using it" stage

**What PM agent tracks:**
- ✅ Which apps are you USING?
- ✅ Which are you BUILDING? (getting there?)
- ✅ Which are REFERENCE? (old versions)
- ✅ Which ABANDONED? (never got there)
- ✅ Auto-detect progression through lifecycle
- ✅ Help you focus on getting to "using"

---

**This is it, right?** 🎯
