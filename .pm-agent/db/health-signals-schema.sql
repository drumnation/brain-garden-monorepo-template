-- Health Signals Schema
-- Real-time CI/CD-like project health tracking

-- ============================================================
-- CLAUDE CODE SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS claude_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,

  -- Session info
  session_id TEXT UNIQUE,
  started_at DATETIME,
  ended_at DATETIME,
  duration_minutes INTEGER,

  -- Usage
  tokens_used INTEGER,
  messages_count INTEGER,
  tool_calls INTEGER,

  -- What was done
  session_summary TEXT,
  files_modified INTEGER,
  commits_made INTEGER,

  -- Session type
  session_type TEXT,  -- development, debugging, refactoring, documentation

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- ============================================================
-- PROJECT HEALTH STATUS (Real-time)
-- ============================================================
CREATE TABLE IF NOT EXISTS project_health (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,

  -- Last check
  last_checked DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Build Status
  builds BOOLEAN,
  build_error TEXT,
  build_time_seconds INTEGER,

  -- Test Status
  tests_run BOOLEAN,
  tests_passing INTEGER DEFAULT 0,
  tests_failing INTEGER DEFAULT 0,
  tests_skipped INTEGER DEFAULT 0,
  test_coverage DECIMAL(5,2),

  -- Git Status (main/default branch)
  git_status_clean BOOLEAN,
  uncommitted_changes INTEGER,
  unpushed_commits INTEGER,

  -- Error Tracking (on main branch)
  linter_errors INTEGER DEFAULT 0,
  linter_warnings INTEGER DEFAULT 0,
  type_errors INTEGER DEFAULT 0,

  -- Health Score (0-100)
  health_score INTEGER,

  FOREIGN KEY (project_id) REFERENCES projects(id),
  UNIQUE(project_id)
);

-- ============================================================
-- BUILD HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS build_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,

  -- Build info
  built_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  success BOOLEAN,
  duration_seconds INTEGER,

  -- Errors
  error_count INTEGER,
  warning_count INTEGER,
  error_message TEXT,

  -- Triggered by
  triggered_by TEXT,  -- manual, ci, auto-check

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- ============================================================
-- TEST RUNS
-- ============================================================
CREATE TABLE IF NOT EXISTS test_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,

  -- Run info
  ran_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  test_framework TEXT,

  -- Results
  total_tests INTEGER,
  passed INTEGER,
  failed INTEGER,
  skipped INTEGER,
  duration_seconds INTEGER,

  -- Coverage
  coverage_percentage DECIMAL(5,2),

  -- Environment
  branch TEXT,
  commit_sha TEXT,

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- ============================================================
-- DEVELOPER ACTIVITY SIGNALS
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_signals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,

  -- Computed signals (updated periodically)
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Claude Code usage
  total_claude_sessions INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  avg_session_duration_min INTEGER,
  last_claude_session DATETIME,

  -- Brain Garden usage
  memory_files_count INTEGER DEFAULT 0,
  last_memory_update DATETIME,

  -- Git activity
  total_branches INTEGER DEFAULT 0,
  active_branches INTEGER DEFAULT 0,  -- Not merged, recent activity
  worktrees_count INTEGER DEFAULT 0,

  -- Recent activity (last 30 days)
  commits_last_30d INTEGER DEFAULT 0,
  files_changed_last_30d INTEGER DEFAULT 0,

  -- Momentum
  momentum_score INTEGER,  -- 0-100 based on recent activity

  FOREIGN KEY (project_id) REFERENCES projects(id),
  UNIQUE(project_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_claude_sessions_project ON claude_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_claude_sessions_date ON claude_sessions(started_at);

CREATE INDEX IF NOT EXISTS idx_project_health_score ON project_health(health_score);
CREATE INDEX IF NOT EXISTS idx_project_health_builds ON project_health(builds);

CREATE INDEX IF NOT EXISTS idx_build_history_project ON build_history(project_id);
CREATE INDEX IF NOT EXISTS idx_build_history_date ON build_history(built_at);

CREATE INDEX IF NOT EXISTS idx_test_runs_project ON test_runs(project_id);
CREATE INDEX IF NOT EXISTS idx_test_runs_date ON test_runs(ran_at);

CREATE INDEX IF NOT EXISTS idx_activity_signals_project ON activity_signals(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_momentum ON activity_signals(momentum_score);

-- ============================================================
-- HEALTH SCORE CALCULATION VIEW
-- ============================================================
CREATE VIEW IF NOT EXISTS project_health_dashboard AS
SELECT
  p.name,
  p.ownership,
  p.lifecycle,

  -- Health indicators
  CASE WHEN ph.builds THEN '✅' ELSE '❌' END as builds,
  CASE WHEN ph.tests_passing > 0 AND ph.tests_failing = 0 THEN '✅' ELSE '⚠️' END as tests,
  CASE WHEN ph.git_status_clean THEN '✅' ELSE '⚠️' END as git,
  CASE WHEN ph.linter_errors = 0 THEN '✅' ELSE '⚠️' END as lint,

  -- Metrics
  ph.tests_passing || '/' || (ph.tests_passing + ph.tests_failing) as test_ratio,
  ph.test_coverage || '%' as coverage,
  ph.linter_errors as errors,
  ph.linter_warnings as warnings,

  -- Activity
  act.total_claude_sessions as sessions,
  act.total_tokens_used as tokens,
  act.commits_last_30d as recent_commits,
  act.momentum_score as momentum,

  -- Overall health
  ph.health_score as health,

  -- Last checked
  ph.last_checked

FROM projects p
LEFT JOIN project_health ph ON p.id = ph.project_id
LEFT JOIN activity_signals act ON p.id = act.project_id
WHERE p.ownership = 'mine'
ORDER BY ph.health_score DESC;
