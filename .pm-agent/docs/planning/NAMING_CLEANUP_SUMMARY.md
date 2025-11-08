# Naming Cleanup Summary - Let's Fix This Together!

**Date:** 2025-11-07
**Found:** 574 projects with naming inconsistencies
**Priority:** HIGH (this causes major cognitive friction!)

---

## 🎯 What We Found

Your Dev folder has **574 projects** where the folder name doesn't match the project name. This is exactly the problem you described - you start a project with one name, repurpose it, and now the folder is confusing.

### Common Patterns

1. **Worktree Explosion** (Most Common)
   - Multiple folders for same project (worktrees)
   - Names like "chore-setup-monorepo", "feature-brain-garden-command-center"
   - All point to same GitHub repo/package.json
   - Example: 5+ "content-manager-express" worktrees with different branch names

2. **Repurposed Projects** (Your Example!)
   - Folder: `scheduling-station`
   - package.json: `brain-garden-monorepo-template`
   - This is EXACTLY what you described - repurposed to be a template!

3. **Generic Folder Names**
   - Folders named: `typescript`, `client`, `server`, `hub`, `API`
   - Not descriptive at all
   - Multiple projects with same generic name

4. **GitHub ≠ Folder**
   - Folder: `tauri`
   - GitHub repo: `atom`
   - Completely different!

---

## 📋 Let's Categorize & Decide Together

I've organized the 574 issues into categories so we can tackle them systematically:

### Category 1: Worktrees (Probably Delete Most)
**~200+ projects**

These are worktrees (git branches as separate folders). Most can probably be deleted or consolidated.

**Examples:**
- `chore-setup-monorepo` → package.json says `brain-garden-monorepo-template`
- `chore-generate-storybook` → package.json says `content-manager-express`
- `feature-brain-garden-command-center` → package.json says `content-manager-express`

**Questions for you:**
- Do you still need these worktrees?
- Should we keep just main + 1-2 active branches?
- Can we delete old branch worktrees?

---

### Category 2: Repurposed Projects (Need Renaming)
**~50 projects**

These are projects where you changed direction but kept the old folder name.

**Your Example:**
```
📁 scheduling-station/
   package.json: "brain-garden-monorepo-template"
   GitHub: "brain-garden-monorepo-template"
```

**Other Examples:**
```
📁 parenting-communication/
   package.json: "brain-garden-client"

📁 ai-audiobook-creator/
   package.json: "mantine-next-template"
```

**Decision needed:**
- Rename folder to match new purpose?
- Update package.json to match folder?
- Archive if no longer active?

---

### Category 3: Generic Names (Need Better Names)
**~100 projects**

Folders with names like `client`, `server`, `typescript`, `API` that don't tell you what they are.

**Examples:**
```
📁 API/
   package.json: "typescript-nodejs"
   → Should be: typescript-nodejs/

📁 client/
   package.json: "scp-manager"
   GitHub: "SCP-MANAGER"
   → Should be: scp-manager-client/ or scp-manager/

📁 typescript/ (there are 15+ of these!)
   package.json: "@kit/tsconfig"
   → These are config packages, need context from parent
```

**Decision needed:**
- Rename to be descriptive?
- Or are these sub-packages that should stay as-is?

---

### Category 4: Exact Duplicates (Consolidate)
**~50 projects**

Multiple copies of the same project.

**Examples:**
```
📁 claudecodeui/
📁 claudecodeui-baseline/
📁 claudecodeui-intermediate/
📁 claudecodeui-original/
📁 claudecodeui-pristine/
   All have package.json: "claude-code-ui"

   → Which one is the real one? Archive the rest?
```

---

### Category 5: Monorepo Sub-Packages (Probably OK)
**~100+ projects**

These might be intentional - sub-packages in monorepos with generic names:
- `typescript/` → tsconfig package
- `client/` → client sub-package
- `server/` → server sub-package

**Decision needed:**
- Are these in monorepos where the parent name provides context?
- If so, they're probably fine as-is
- If standalone, need better names

---

## 🚀 Proposed Interactive Workflow

Let's work through these systematically:

### Step 1: Quick Wins (Automated)

Things we can handle automatically:

1. **Delete obvious old worktrees**
   - Last commit > 6 months ago
   - Branch merged or abandoned
   - No uncommitted changes

2. **Archive duplicate claudecodeui folders**
   - Keep the newest one
   - Archive the rest to `archive/2024/claudecodeui-variants/`

### Step 2: Interactive Review (Top 20 Priority)

I'll show you the top 20 most confusing ones and you decide:
- Rename?
- Keep as-is?
- Archive?
- Delete?

### Step 3: Bulk Decisions

For patterns (like "all worktrees older than 6 months"):
- I'll suggest a rule
- You approve/reject
- I'll apply to all matching

---

## 💡 Your Example Case Study

```
📁 scheduling-station/
   package.json: "brain-garden-monorepo-template"
   GitHub: "brain-garden-monorepo-template"
   Last commit: 2025-11-02 (recent!)
```

**The Story:**
- Started as scheduling-station app
- Repurposed to be a monorepo template
- Changed GitHub origin
- Updated package.json
- But folder name stuck as "scheduling-station"

**Options:**
1. **Rename folder** → `brain-garden-monorepo-template/`
   - Pro: Everything matches!
   - Con: Need to update any scripts/references

2. **Update package.json back** → Keep folder as `scheduling-station/`
   - Pro: No moving files
   - Con: GitHub still says "brain-garden-monorepo-template"

3. **Archive old, start fresh** → New folder with correct name
   - Pro: Clean start
   - Con: Lose git history (unless you move .git)

**What would you like to do with this one?**

---

## 📊 Full Audit Results

The complete scan found:

```json
{
  "totalMismatches": 574,
  "summary": {
    "high": 148,    // Folder ≠ package.json
    "medium": 426,  // Folder ≠ GitHub repo
    "low": 0        // package.json ≠ repo (minor)
  }
}
```

**Saved to:** `.pm-agent/name-mismatch-audit.json`

You can view specific projects:
```bash
cat .pm-agent/name-mismatch-audit.json | jq '.mismatches[] | select(.folderName == "scheduling-station")'
```

---

## 🎮 Next Steps - Let's Do This Together!

### Option A: Start Small (Recommended)
Let's tackle the top 20 most confusing ones together:

1. I'll show you each one
2. You tell me what to do
3. I'll generate rename scripts
4. Review & execute

**Time:** ~30 minutes for top 20

### Option B: Bulk Operations
Let's handle the big patterns:

1. Delete old worktrees (200+ projects)
2. Archive duplicates (50 projects)
3. Rename obvious mismatches (100 projects)

**Time:** ~1 hour, mostly automated

### Option C: Full Interactive Review
Go through all 574 one by one:

**Time:** Multiple sessions (don't recommend - overwhelming!)

---

## 💬 Let's Start!

**Tell me:**
1. Which option do you want? (A, B, or C)
2. Any specific projects you want to tackle first?
3. Any rules you want to set? (Like "delete all worktrees older than X months")

I'll create an interactive script that walks through them step by step, showing you:
- Current name
- What package.json says
- What GitHub says
- Last commit date
- Size on disk

Then you decide, and I'll generate safe rename/delete scripts.

**The goal:** Clean, consistent naming so you never have to wonder "what is this folder?" again!

---

## 🧠 PM Agent Integration

Once we clean this up, PM agent will:

1. **Prevent future mismatches**
   ```javascript
   // On git clone or project creation
   if (folderName !== packageName) {
     suggest(`Folder "${folderName}" doesn't match package.json "${packageName}". Rename?`);
   }
   ```

2. **Monitor for repurposing**
   ```javascript
   // Detect when package.json or GitHub origin changes
   if (packageNameChanged || originChanged) {
     alert(`Project "${folderName}" might need renaming. Check it?`);
   }
   ```

3. **Worktree cleanup reminders**
   ```javascript
   // Weekly check
   if (worktreeCount > 10 || oldWorktrees.length > 5) {
     suggest(`Clean up ${oldWorktrees.length} old worktrees?`);
   }
   ```

**Result:** This never happens again! 🎉

---

Ready to clean this up together? Let me know where you want to start!
