# Space Analysis Results - 2025-11-07

## 🚨 Critical Findings

Your Dev folder (446.8 GB) has **massive** cleanup opportunities!

## 📊 The Numbers

### Total Disk Usage
- **Total Dev folder:** 446.8 GB
- **Docker:** 101.6 GB
- **Total system:** 851.5 GB / 1 TB (85% full!)

### Project Distribution
```
singularityApps:    154 GB (34.5%)
singularity-core:   138 GB (30.9%)
scala:               67 GB (15.0%)
experiments:         39 GB  (8.7%)
other:               48 GB (10.7%)
```

## 💣 Biggest Issues

### 1. node_modules Explosion

**Total:** 1,100+ node_modules folders consuming ~100GB

Breakdown by folder:
- **singularityApps**: 840 node_modules
- **singularity-core**: 262 node_modules
- **Other projects**: 50+ node_modules

**Top space consumers:**
1. parenting-pilot-monorepo: 4.9 GB (just node_modules!)
2. cursor-remote: 2.7 GB
3. wlmt-saas-mono-repo: 2.1 GB
4. crystal fork: 2.0 GB
5. stacks-track-monorepo: 1.8 GB
6. medical-supply-monorepo: 1.8 GB

### 2. Worktree Duplication Nightmare

**Total:** 300+ worktrees with massive duplication

**Worst offenders:**
1. **parenting-pilot**: 205 worktrees 😱
   - Each worktree: full copy of dependencies
   - Estimated waste: ~30-40 GB

2. **crystal fork (two copies!)**:
   - singularityApps/forks/crystal: 19 worktrees
   - singularity-core/crystal-fork: 19 worktrees
   - **Same project duplicated!**
   - Each with 1.7GB node_modules

3. **plaid-datastore**: 7 worktrees
4. **muse-brain-controller**: 6 worktrees
5. **vanacore-monorepo**: 5 worktrees

**node_modules in worktrees alone:** 2,013 folders!

### 3. Stale Projects (6+ Months)

These haven't been touched in over half a year:

| Project | Days Idle | node_modules? | Action |
|---------|-----------|---------------|---------|
| vpn-monitoring | 211 days | ❌ (small) | Archive or delete |
| parenting-communication | 181 days | ✅ (large) | Remove node_modules |
| scala/[many projects] | 180+ days | ✅ | Audit entire folder |

## 💰 Recovery Opportunities

### Quick Wins (Safe & High Impact)

#### 1. Remove node_modules from Stale Projects
**Target:** Projects untouched 6+ months
**Estimated savings:** 40-50 GB
**Risk:** None (can reinstall anytime with `npm install`)

```bash
# Projects to clean:
- parenting-communication (181 days)
- scala/ subdirectories (many 6+ months old)
- experiments/ (various old projects)
```

#### 2. Clean Up Abandoned Worktrees
**Target:** Worktrees not in active use
**Estimated savings:** 50-70 GB

Priority targets:
```bash
# parenting-pilot: 205 worktrees (!!!)
cd singularity-core/parenting-pilot
git worktree list  # Review which are needed
# Clean up abandoned ones

# crystal fork: 38 total worktrees (DUPLICATED!)
# Question: Do you need both copies?
- singularityApps/forks/crystal
- singularity-core/crystal-fork

# Plaid and other monorepos
- Various projects with 5-7 worktrees each
```

#### 3. Docker Cleanup
**Target:** Unused images, build cache
**Estimated savings:** 40-50 GB
**Risk:** Low (preserves active containers)

```bash
# Safe Docker cleanup
docker system prune -a --volumes

# This removes:
- Unused images
- Build cache
- Dangling volumes
# But keeps running containers
```

### Total Potential Recovery: **130-170 GB** 🎉

## 🎯 Recommended Cleanup Strategy

### Phase 1: Low-Hanging Fruit (Safe, High Impact)

1. **Remove stale node_modules** (40-50 GB)
   - Only touches projects 6+ months old
   - Easy to reinstall if needed
   - Zero risk

2. **Clean up obvious worktree duplicates** (20-30 GB)
   - parenting-pilot: keep recent 10, remove 195
   - crystal fork: pick ONE location, remove other
   - Other monorepos: audit and clean

3. **Docker system prune** (40-50 GB)
   - One command
   - Preserves active containers
   - Instant space recovery

**Phase 1 Total: 100-130 GB recovered**

### Phase 2: Deep Cleaning (Requires Review)

1. **Audit scala folder** (67 GB total)
   - Many learning projects?
   - Which are worth keeping?
   - Archive vs delete decision

2. **Consolidate Brain Garden projects**
   - Currently scattered across:
     - singularityApps/core/
     - experiments/
     - Multiple locations
   - Move to centralized brain-garden/

3. **Review experiments folder** (39 GB)
   - Keep learning projects?
   - Archive old experiments?
   - Preserve code, remove dependencies

**Phase 2 Total: 30-50 GB additional**

### Phase 3: Organization (Not space, but sanity!)

1. **Create new folder structure:**
   ```
   ~/Dev/
   ├── active/           (5-10 projects max)
   ├── brain-garden/     (ecosystem hub)
   ├── on-hold/          (might return to)
   ├── experiments/      (learning & prototypes)
   └── archive/
       ├── 2024/
       └── 2025/
   ```

2. **Move projects to appropriate locations**
   - Based on last activity
   - Based on status (active/on-hold/archived)
   - Makes finding projects easy

3. **ADHD-friendly organization**
   - Maximum 10 active projects visible
   - Clear separation
   - Guilt-free "on-hold" status

## 🚦 Action Items

### Immediate (Do Today)

- [ ] Install claude-mem plugin (persistent memory)
- [ ] Wait for project scanner to complete
- [ ] Review project registry results

### Next Session (With PM Agent)

- [ ] Interactive project categorization
- [ ] Generate cleanup scripts
- [ ] Execute Phase 1 cleanup (100+ GB)
- [ ] Verify space recovery

### Ongoing (PM Agent Maintains)

- [ ] Monitor project activity
- [ ] Suggest cleanups proactively
- [ ] Track space usage over time
- [ ] Prevent future bloat

## 📈 Before & After

### Current State
```
Dev folder: 446.8 GB (chaotic)
- 190+ git repositories
- 1,100+ node_modules
- 300+ worktrees
- Projects scattered
- Hard to find things
- ADHD nightmare
```

### Target State (After Cleanup)
```
Dev folder: ~300 GB (organized)
- Same 190 repos
- ~200 node_modules (only active projects)
- ~50 worktrees (only needed ones)
- Clear folder structure
- Easy to navigate
- ADHD-friendly
- 150GB recovered! 🎉
```

## 🎓 Lessons Learned

### Worktree Best Practices
- **Don't create worktrees carelessly**
- **Clean up after feature completion**
- **Use `git worktree list` regularly**
- **Max 5-10 worktrees per project**
- **205 worktrees is NEVER necessary!**

### Dependency Management
- **Remove node_modules from inactive projects**
- **Use `npm ci` in CI/CD (not in development)**
- **Consider pnpm** (uses symlinks, saves space)
- **Audit dependencies regularly**

### Organization Principles
- **Active folder = current work only**
- **On-hold folder = might return**
- **Archive folder = done but keep code**
- **Max 10 active projects** (ADHD rule!)

## 🤖 PM Agent Integration

The PM agent will help prevent this in the future by:

1. **Proactive monitoring**
   - "You have 15 worktrees in project X. Want to clean up?"
   - "project Y hasn't been touched in 7 months. Archive?"

2. **Space alerts**
   - "node_modules detected in stale project. Remove to save 3GB?"
   - "Duplicate crystal fork detected. Which one to keep?"

3. **Organization suggestions**
   - "You have 15 active projects. Consider moving some to on-hold?"
   - "Brain Garden projects scattered. Consolidate?"

4. **Weekly reports**
   - Space usage trends
   - Projects worked on
   - Cleanup opportunities

---

**Next:** Wait for project scanner to complete, then we'll interactively categorize projects and execute cleanup! 🚀
