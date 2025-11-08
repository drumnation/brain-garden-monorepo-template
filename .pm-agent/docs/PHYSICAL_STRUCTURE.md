# Physical Project Organization

## The Principle

**Projects stay where they are** - EXCEPT for the distinction between:
- **Your work** (original projects, customized forks) - **HIGH VALUE**
- **External exploration** (cloned repos, experiments) - **LOW VALUE**, can delete easily

## Proposed Structure

```
Dev/
├── _clones/              # 🗑️ GARBAGE DUMP (can delete anytime)
│   ├── n8n/             # Exploring n8n
│   ├── langchain/       # Checking out langchain
│   ├── some-tutorial/   # Following a tutorial
│   └── [any cloned repo for exploration]
│
├── [ALL YOUR ACTUAL PROJECTS stay wherever they are]
│   ├── cannabis-codex/           # YOURS (origin_type: created)
│   ├── scheduling-station-app/   # YOURS (origin_type: created)
│   ├── singularity-core/
│   │   └── crystal-fork/        # YOURS (origin_type: forked, ownership: customized-fork)
│   ├── singularityApps/          # YOURS
│   └── ...
```

## The Rules

### 1. Cloned Repos Start in `_clones/`
```bash
# When exploring something new
cd ~/Dev/_clones
git clone https://github.com/n8n-io/n8n.git

# Database tracks:
{
  "name": "n8n",
  "path": "_clones/n8n",
  "origin_type": "cloned",
  "ownership": "exploring",
  "contribution_level": 0,
  "original_repo_url": "https://github.com/n8n-io/n8n.git"
}
```

### 2. When You Fork/Customize, It Graduates
```bash
# You started modifying n8n heavily, it's now yours
mv ~/Dev/_clones/n8n ~/Dev/n8n-custom

# Database updates:
{
  "name": "n8n-custom",
  "path": "n8n-custom",
  "origin_type": "forked",
  "ownership": "customized-fork",
  "contribution_level": 45,  # ~45% your changes
  "forked_from": "n8n",
  "became_mine_date": "2025-11-07",
  "original_repo_url": "https://github.com/n8n-io/n8n.git"
}
```

### 3. Your Original Projects Stay Put
```
# These NEVER move
cannabis-codex/           # Created from scratch
scheduling-station-app/   # Created from scratch
parenting-pilot/          # Created from scratch

# Database:
{
  "origin_type": "created",
  "ownership": "mine",
  "contribution_level": 100
}
```

## Value Assessment (Auto-Calculated)

**High Value (Keep):**
- `ownership = 'mine'` + `contribution_level >= 80`
- `ownership = 'customized-fork'` + `contribution_level >= 50`
- `lifecycle = 'using'` (you're actively using it)

**Medium Value (Keep but Monitor):**
- `ownership = 'customized-fork'` + `contribution_level < 50`
- `lifecycle = 'building'` + high momentum

**Low Value (Can Delete):**
- `ownership = 'exploring'`
- In `_clones/` folder
- No commits from you
- Not opened in 60+ days

## Project Browser Views

### View 1: My Projects (High Value)
```sql
SELECT * FROM my_projects
ORDER BY last_worked_on DESC;
```
Shows only YOUR actual work.

### View 2: Exploring (Garbage Dump)
```sql
SELECT * FROM exploring_clones
WHERE last_opened < date('now', '-60 days');
```
Shows clones you haven't touched in 60+ days (candidates for deletion).

### View 3: By Value Score
```sql
SELECT * FROM projects_by_value
LIMIT 50;
```
Top 50 most valuable projects (weighted by ownership, contribution, lifecycle, momentum).

## Cleanup Strategy

### Weekly Cleanup:
```bash
pm-cleanup-suggestions

# Shows:
"🗑️ Safe to delete (in _clones/, not modified, 60+ days old):
  • _clones/langchain (120 days, 0 commits)
  • _clones/some-tutorial (90 days, 0 commits)

  Space to recover: 4.2GB

  Delete these? (y/n)"
```

### When `_clones/` Gets Big:
```bash
pm-list --clones --sort-by-size

# Shows:
"📦 Cloned repos (_clones/):
  • langchain (2.1GB, 120 days old)
  • n8n (1.8GB, 90 days old)
  • some-framework (400MB, 30 days old)

  Total: 4.3GB
  Candidates for deletion: 2 (3.9GB)"
```

## Migration Path

### Initial Setup:
1. Create `_clones/` folder
2. Scan all projects in Dev/
3. Identify clones vs original work (using git remotes)
4. Move obvious clones to `_clones/`
5. Everything else stays put

### Going Forward:
- Clone new repos into `_clones/` by default
- If you start customizing heavily, graduate out of `_clones/`
- Database tracks everything else

---

**Bottom Line:**
- `_clones/` = LOW value, can delete anytime
- Everything else = YOUR work, HIGH value, never moves
- Database knows the difference
- Project Browser shows you what matters
