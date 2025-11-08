# Deep Analysis - Example Queries

Once deep analysis completes, you can run powerful queries to understand your projects at a granular level.

## Tech Stack Insights

### See all dependencies across all projects
```sql
SELECT
  package_name,
  COUNT(*) as project_count,
  GROUP_CONCAT(DISTINCT version) as versions
FROM stack_dependencies
GROUP BY package_name
ORDER BY project_count DESC
LIMIT 20;
```

### Find projects using specific technology
```sql
SELECT p.name, sd.version
FROM projects p
JOIN stack_dependencies sd ON p.id = sd.project_id
WHERE sd.package_name = 'react'
ORDER BY p.name;
```

### See project's full tech stack
```sql
SELECT
  pm.display_name || ' ' || pm.badge_emoji as tech,
  sd.version,
  sd.category,
  CASE WHEN sd.is_dev_dependency THEN 'dev' ELSE 'prod' END as type
FROM stack_dependencies sd
LEFT JOIN package_metadata pm ON sd.package_name = pm.package_name
WHERE sd.project_id = (SELECT id FROM projects WHERE name = 'cannabis-codex')
ORDER BY sd.category, sd.package_name;
```

Example output:
```
tech                    | version  | category   | type
-----------------------|----------|------------|------
React ⚛️               | 18.2.0   | frontend   | prod
Next.js ▲              | 14.0.0   | frontend   | prod
Tailwind CSS 🎨        | 3.3.0    | ui-library | dev
PostgreSQL 🐘          | (via pg) | database   | prod
Prisma 💎              | 5.0.0    | database   | prod
Jest 🃏                | 29.0.0   | testing    | dev
Playwright 🎭          | 1.40.0   | testing    | dev
```

## Testing Infrastructure

### Projects with/without tests
```sql
SELECT
  CASE
    WHEN tc.has_tests THEN 'Has Tests'
    ELSE 'No Tests'
  END as status,
  COUNT(*) as count
FROM projects p
LEFT JOIN testing_config tc ON p.id = tc.project_id
GROUP BY tc.has_tests;
```

### Projects by test framework
```sql
SELECT
  tc.test_framework,
  COUNT(*) as projects,
  ROUND(AVG(tc.total_tests), 0) as avg_tests
FROM testing_config tc
WHERE tc.test_framework IS NOT NULL
GROUP BY tc.test_framework
ORDER BY projects DESC;
```

### Projects missing tests (YOUR projects only)
```sql
SELECT p.name, p.path
FROM projects p
LEFT JOIN testing_config tc ON p.id = tc.project_id
WHERE p.ownership = 'mine'
  AND (tc.has_tests IS NULL OR tc.has_tests = 0)
ORDER BY p.last_worked_on DESC;
```

### Test coverage summary
```sql
SELECT
  p.name,
  tc.test_framework,
  tc.total_tests,
  tc.coverage_enabled,
  tc.coverage_percentage || '%' as coverage
FROM projects p
JOIN testing_config tc ON p.id = tc.project_id
WHERE tc.has_tests = 1
  AND tc.coverage_enabled = 1
ORDER BY tc.coverage_percentage DESC;
```

### Projects with E2E tests
```sql
SELECT p.name, tc.test_framework
FROM projects p
JOIN testing_config tc ON p.id = tc.project_id
WHERE tc.has_e2e_tests = 1;
```

## CI/CD & Validation

### Projects with CI/CD
```sql
SELECT
  vc.ci_platform,
  COUNT(*) as projects
FROM validation_config vc
WHERE vc.has_ci = 1
GROUP BY vc.ci_platform;
```

### Projects without CI (YOUR projects)
```sql
SELECT p.name, p.last_worked_on
FROM projects p
LEFT JOIN validation_config vc ON p.id = vc.project_id
WHERE p.ownership = 'mine'
  AND (vc.has_ci IS NULL OR vc.has_ci = 0)
ORDER BY p.last_worked_on DESC
LIMIT 20;
```

### Full validation setup per project
```sql
SELECT
  p.name,
  CASE WHEN vc.has_ci THEN '✅' ELSE '❌' END as ci,
  vc.ci_platform,
  CASE WHEN vc.runs_linter THEN '✅' ELSE '❌' END as linter,
  CASE WHEN vc.runs_type_check THEN '✅' ELSE '❌' END as types,
  CASE WHEN vc.runs_tests THEN '✅' ELSE '❌' END as tests,
  CASE WHEN vc.has_pre_commit THEN '✅' ELSE '❌' END as hooks
FROM projects p
LEFT JOIN validation_config vc ON p.id = vc.project_id
WHERE p.ownership = 'mine'
ORDER BY p.name;
```

## Agent Configurations

### Projects with agent configs
```sql
SELECT
  ac.agent_type,
  COUNT(DISTINCT ac.project_id) as projects
FROM agent_configs ac
GROUP BY ac.agent_type;
```

### See all agent configs for a project
```sql
SELECT
  ac.agent_type,
  ac.config_file,
  ac.total_rules
FROM agent_configs ac
WHERE ac.project_id = (SELECT id FROM projects WHERE name = 'cannabis-codex');
```

### Projects WITHOUT any agent configs (recommend adding)
```sql
SELECT p.name, p.path
FROM projects p
WHERE p.ownership = 'mine'
  AND p.id NOT IN (SELECT project_id FROM agent_configs)
ORDER BY p.last_worked_on DESC
LIMIT 20;
```

## Combined Insights

### "Production Ready" projects
Projects with: tests, CI, TypeScript, deployed
```sql
SELECT
  p.name,
  p.deployed_url,
  tc.test_framework,
  tc.total_tests,
  vc.ci_platform
FROM projects p
JOIN testing_config tc ON p.id = tc.project_id
JOIN validation_config vc ON p.id = vc.project_id
WHERE p.ownership = 'mine'
  AND tc.has_tests = 1
  AND vc.has_ci = 1
  AND p.deployed = 1
ORDER BY p.name;
```

### "Needs Work" projects
YOUR projects missing tests OR CI OR agent configs
```sql
SELECT
  p.name,
  CASE WHEN tc.has_tests THEN '✅' ELSE '❌' END as tests,
  CASE WHEN vc.has_ci THEN '✅' ELSE '❌' END as ci,
  CASE WHEN ac.cnt > 0 THEN '✅' ELSE '❌' END as agent_config
FROM projects p
LEFT JOIN testing_config tc ON p.id = tc.project_id
LEFT JOIN validation_config vc ON p.id = vc.project_id
LEFT JOIN (
  SELECT project_id, COUNT(*) as cnt
  FROM agent_configs
  GROUP BY project_id
) ac ON p.id = ac.project_id
WHERE p.ownership = 'mine'
  AND (
    tc.has_tests IS NULL OR tc.has_tests = 0 OR
    vc.has_ci IS NULL OR vc.has_ci = 0 OR
    ac.cnt IS NULL OR ac.cnt = 0
  )
ORDER BY p.last_worked_on DESC;
```

### Tech stack overlap
Find projects using similar tech
```sql
SELECT
  p1.name as project1,
  p2.name as project2,
  COUNT(*) as shared_deps
FROM stack_dependencies sd1
JOIN stack_dependencies sd2
  ON sd1.package_name = sd2.package_name
  AND sd1.project_id < sd2.project_id
JOIN projects p1 ON sd1.project_id = p1.id
JOIN projects p2 ON sd2.project_id = p2.id
WHERE p1.ownership = 'mine'
  AND p2.ownership = 'mine'
GROUP BY p1.id, p2.id
HAVING COUNT(*) > 10
ORDER BY shared_deps DESC
LIMIT 20;
```

---

## Project Viewer Enhancements

With this data, the Project Viewer can show:

### Enhanced Project Card
```
┌─────────────────────────────────────────────────────────────┐
│ ✨ cannabis-codex                            [USING] 🟢    │
│ 🏷️  pnpm monorepo • turborepo • brain-garden • typescript  │
├─────────────────────────────────────────────────────────────┤
│ 🎯 Cannabis strain tracking and discovery                  │
│ 📊 847 strains • 247 commits • 127hrs • Last: Today 2:30pm│
│ 🚀 Deployed: https://cannabiscodex.app ✅                  │
│                                                             │
│ 📦 Stack:                                                   │
│   ⚛️ React 18.2.0 • ▲ Next.js 14.0.0 • 🔷 TypeScript     │
│   🐘 PostgreSQL • 💎 Prisma 5.0.0 • 🎨 Tailwind CSS       │
│                                                             │
│ 🧪 Testing:                                                │
│   🃏 Jest (247 tests) • 🎭 Playwright (15 E2E tests)      │
│   Coverage: 82% ✅ (threshold: 80%)                        │
│                                                             │
│ 🔄 Validation:                                             │
│   ✅ CI: GitHub Actions                                    │
│   ✅ Linter: ESLint                                        │
│   ✅ Type Check: TypeScript                                │
│   ✅ Pre-commit: Husky                                     │
│                                                             │
│ 🤖 Agent Config:                                           │
│   ✅ Cursor (.cursorrules)                                 │
│   ✅ Claude Code (CLAUDE.md)                               │
│   ✅ Brain Garden (.brain/)                                │
│                                                             │
│ 📋 Documentation:                                          │
│   ✅ PRD  ✅ Overview  ✅ Architecture  ✅ BMAD           │
│                                                             │
│ ⚡ Quick Actions:                                          │
│ [💻 Cursor] [💎 Crystal] [🧪 Run Tests] [🚀 Deploy]      │
└─────────────────────────────────────────────────────────────┘
```

### Warning Card (Missing Tests)
```
┌─────────────────────────────────────────────────────────────┐
│ ✨ scheduling-station                       [BUILDING] 🟡   │
├─────────────────────────────────────────────────────────────┤
│ ⚠️  Quality Issues:                                        │
│   ❌ No tests configured                                   │
│   ❌ No CI/CD setup                                        │
│   ❌ No type checking                                      │
│                                                             │
│ 🎯 Recommended:                                            │
│ [🧪 Setup Jest] [🔄 Add GitHub Actions] [🔷 Add TypeScript]│
└─────────────────────────────────────────────────────────────┘
```

---

## Next: Features & User Stories

The **features** and **user_stories** tables are designed for manual input or parsing from PRD/BMAD docs.

### Example workflow:
1. Parse PRD/BMAD docs for features
2. Extract user stories from documentation
3. Link user stories to test files
4. Track which features work vs which are broken

This creates a complete picture:
- Tech stack ✅ (automated)
- Testing ✅ (automated)
- CI/CD ✅ (automated)
- Agent configs ✅ (automated)
- Features ⏳ (needs doc parsing or manual input)
- User stories ⏳ (needs doc parsing or manual input)

Would you like me to create a feature/story importer that parses BMAD/PRD docs?
