# Organizational Alternatives - Beyond A/B

**Date:** 2025-11-07
**User Feedback:** Leaning towards Option B (context-based), wants other possibilities

---

## 🎨 Option B (Baseline - What You're Leaning Toward)

```
Dev/
├── WORK/              # Day job (Scala)
├── LEGAL/             # Legal projects
├── SINGULARITY/       # Personal LLC (rename from singularityApps)
└── LEARNING/          # Experiments
```

**Pros:** Clear, simple, enforces context
**Cons:** Still pretty flat, doesn't handle sub-organization

---

## 🚀 Option C: Activity-Based (ADHD-Optimized)

**Philosophy:** Organize by what you're doing NOW vs LATER vs DONE

```
Dev/
├── NOW/                           # Currently working (max 5-8 projects)
│   ├── cannabiscodex/
│   ├── brain-garden-os/
│   ├── scheduling-station/
│   └── [current legal case]/
│
├── NEXT/                          # Queued up (on-deck)
│   ├── vanacore-monorepo/
│   ├── medical-supply/
│   └── [projects to work on soon]/
│
├── SOMEDAY/                       # Paused, might return
│   ├── parenting-pilot/
│   ├── evisum/
│   └── [on-hold projects]/
│
├── REFERENCE/                     # Done but keeping
│   ├── work/                      # Scala projects
│   ├── legal/                     # Completed cases
│   ├── products/                  # Shipped products
│   └── templates/                 # Reusable templates
│
├── TOOLS/                         # Internal tooling
│   ├── cursor-tools/
│   ├── mcp-servers/
│   ├── chrome-extensions/
│   └── parallel-claude/
│
└── SANDBOX/                       # Experiments, learning
    ├── experiments/
    ├── forks/
    └── tutorials/
```

**How It Works:**
- **NOW/** = Your active focus (strictly limited to 5-8)
- **NEXT/** = Committed to working on (not started yet)
- **SOMEDAY/** = Maybe later (guilt-free parking lot)
- **REFERENCE/** = Archive that you actually reference
- **TOOLS/** = Things you use to build other things
- **SANDBOX/** = Learning, trying things, no pressure

**Pros:**
- ✅ ADHD-friendly (NOW folder = laser focus)
- ✅ Guilt-free parking (SOMEDAY vs deleted)
- ✅ Clear action states
- ✅ Forces prioritization (max 5-8 in NOW)

**Cons:**
- Loses context (legal vs LLC vs work)
- Projects move folders frequently

---

## 🌳 Option D: Hybrid Context + Status

**Philosophy:** Best of both - context AND activity

```
Dev/
├── WORK/
│   ├── active/                    # Current work projects
│   ├── reference/                 # Keep for reference
│   └── archive/                   # Old work
│
├── LEGAL/
│   ├── active/                    # Active cases
│   ├── templates/                 # Reusable
│   └── closed/                    # Completed cases
│
├── SINGULARITY/
│   ├── NOW/                       # 🔥 Active focus (max 8)
│   │   ├── cannabiscodex/
│   │   ├── brain-garden-os/
│   │   └── scheduling-station/
│   │
│   ├── NEXT/                      # Queued up
│   │   ├── vanacore-monorepo/
│   │   └── medical-supply/
│   │
│   ├── PAUSED/                    # On hold
│   │   ├── parenting-pilot/
│   │   └── evisum/
│   │
│   ├── SHIPPED/                   # Launched products
│   │   └── [live products]/
│   │
│   ├── ARCHIVED/                  # Done, keeping code
│   │   ├── cheddar/
│   │   ├── wlmt/
│   │   └── gratitude/
│   │
│   ├── tools/                     # Internal tooling
│   │   ├── cursor-tools/
│   │   ├── mcp-servers/
│   │   └── parallel-claude/
│   │
│   └── templates/                 # Reusable starters
│       └── brain-garden-monorepo-template/
│
└── LEARNING/
    ├── active/                    # Currently learning
    ├── experiments/               # Trying things
    ├── forks/                     # Forked repos
    └── reference/                 # Keep for examples
```

**How It Works:**
- Top level = CONTEXT (who/what)
- Second level = STATUS (where in lifecycle)
- SINGULARITY gets activity-based organization (NOW/NEXT/PAUSED)
- Other contexts get simpler status (active/archive)

**Pros:**
- ✅ Best of both worlds
- ✅ Context preserved (legal vs work vs LLC)
- ✅ Activity states for LLC projects (your main work)
- ✅ ADHD-friendly focus (SINGULARITY/NOW/)
- ✅ Scales well (each context organized appropriately)

**Cons:**
- Slightly more complex
- Need discipline to move things between NOW/NEXT/PAUSED

---

## 🎯 Option E: Product-Centric

**Philosophy:** Organize by products/domains, not code

```
Dev/
├── WORK/                          # Day job
│   └── scala/
│
├── LEGAL/                         # Legal practice
│   └── legalDocumentsAI/
│
├── PRODUCTS/                      # Things customers use
│   ├── cannabis-codex/            # Cannabis matcher
│   ├── brain-garden/              # All Brain Garden products
│   │   ├── os/
│   │   ├── studio/
│   │   └── templates/
│   ├── scheduling-station/        # Appointment scheduling
│   ├── medical-supply/            # Medical supply chain
│   └── vanacore/                  # Audio tools
│
├── INFRASTRUCTURE/                # Things that support products
│   ├── mcp-servers/
│   ├── cursor-tools/
│   ├── parallel-claude/
│   └── knowledge/
│
├── EXPERIMENTS/                   # R&D
│   ├── active/
│   ├── paused/
│   └── forks/
│
└── ARCHIVE/                       # Sunset products
    ├── cheddar/
    ├── evisum/
    ├── wlmt/
    └── gratitude/
```

**How It Works:**
- Group by product/customer-facing thing
- Infrastructure separated
- No nested status folders (simpler)

**Pros:**
- ✅ Product-focused (business view)
- ✅ Easy to explain to others
- ✅ Natural grouping (brain-garden products together)
- ✅ Simpler (less nesting)

**Cons:**
- Harder to see "what's active"
- Need PM agent to track activity

---

## 🔬 Option F: Monorepo-First

**Philosophy:** Embrace monorepos, minimize top-level folders

```
Dev/
├── singularity-monorepo/          # THE monorepo
│   ├── products/
│   │   ├── brain-garden-os/
│   │   ├── cannabis-codex/
│   │   ├── scheduling-station/
│   │   ├── vanacore/
│   │   └── medical-supply/
│   │
│   ├── tools/
│   │   ├── cursor-tools/
│   │   ├── mcp-servers/
│   │   └── parallel-claude/
│   │
│   ├── experiments/
│   │   └── [trying things]/
│   │
│   └── archived/
│       ├── cheddar/
│       ├── evisum/
│       └── wlmt/
│
├── work/                          # Day job (separate)
│   └── scala/
│
├── legal/                         # Legal practice (separate)
│   └── legalDocumentsAI/
│
└── learning/                      # External projects
    ├── experiments/
    └── forks/
```

**How It Works:**
- ONE big monorepo for all LLC stuff
- Shared tooling, dependencies
- External stuff (work, legal, learning) separate

**Pros:**
- ✅ Shared dependencies (one node_modules!)
- ✅ Shared tooling
- ✅ Easy refactoring across projects
- ✅ Clear separation of LLC vs external

**Cons:**
- ⚠️ Huge monorepo (management overhead)
- ⚠️ Single point of failure
- ⚠️ Requires good tooling (Turborepo, etc.)

---

## 📊 Comparison Matrix

| Aspect | Option B | Option C | Option D | Option E | Option F |
|--------|----------|----------|----------|----------|----------|
| **Clarity** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **ADHD-Friendly** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Easy to Maintain** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Scales Well** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Business View** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Activity Focus** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

---

## 💡 My Recommendation: Option D (Hybrid)

**Why:**
1. **Keeps context** (WORK/LEGAL/SINGULARITY/LEARNING) - you think in these terms
2. **Adds activity** (NOW/NEXT/PAUSED for SINGULARITY) - ADHD-friendly focus
3. **Scales best** - can handle growth in any context
4. **Forces prioritization** - NOW folder limited to 8 projects max
5. **PM agent can enforce** - rules are clear

**Example in practice:**

When you start a new LLC project:
```bash
# PM agent asks:
"Where should brain-garden-v2 go?"
> SINGULARITY/NOW/      # If starting now
> SINGULARITY/NEXT/     # If queued up
> SINGULARITY/tools/    # If it's infrastructure
```

When you clone an experiment:
```bash
git clone some-repo
# PM agent automatically:
mv some-repo LEARNING/experiments/
```

When cannabiscodex ships:
```bash
# PM agent suggests:
"cannabiscodex is live! Move to SINGULARITY/SHIPPED/?"
```

---

## 🎯 Migration Complexity

**From Easiest to Hardest:**

1. **Option B** (Simple) - Rename singularityApps → SINGULARITY, done
2. **Option E** (Product-Centric) - Reorganize by product grouping
3. **Option D** (Hybrid) - Add activity folders, reorganize
4. **Option C** (Activity-Based) - Total reorganization by status
5. **Option F** (Monorepo) - Massive consolidation effort

---

## 🤔 Decision Questions

**To help you choose:**

1. **Do you think in context or activity?**
   - Context (legal vs LLC vs work) → Option D or E
   - Activity (what I'm doing now) → Option C or D

2. **How often do projects change status?**
   - Frequently → Option C or D (built for movement)
   - Rarely → Option B or E (simpler)

3. **Do you want one monorepo or many?**
   - One big monorepo → Option F
   - Many separate projects → B, C, D, or E

4. **What's your biggest pain point?**
   - "Too many projects active" → C or D (NOW folder enforces limit)
   - "Can't find things" → B or E (clear context)
   - "Dependencies everywhere" → F (monorepo)
   - "No clear status" → C or D (activity-based)

---

## 🚀 Next Steps

Once you pick an option, I'll:
1. Map EVERY current project to its new location
2. Generate migration scripts (with path fixes for Crystal, etc.)
3. Create PM agent rules to maintain it
4. Build safety checks (dry-run mode, backups, etc.)

**Which option resonates most?**

Or mix and match! We can take the best ideas from multiple options.
