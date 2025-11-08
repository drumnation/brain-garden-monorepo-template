-- PM Agent Enhanced Database Schema
-- Tracks EVERYTHING about projects for intelligent browsing/sorting

-- ============================================================
-- PROJECTS TABLE - Core project data
-- ============================================================
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  path TEXT NOT NULL,  -- Relative to Dev/ (NEVER moves!)

  -- State (changes freely)
  lifecycle TEXT DEFAULT 'discovered',  -- discovered, building, using, reference, paused, abandoned
  paused BOOLEAN DEFAULT 0,
  paused_reason TEXT,
  paused_at DATETIME,

  -- Categorization (flexible, can change)
  category TEXT,  -- app, tool, learning, work, experimental
  tags TEXT,      -- JSON array: ["cannabis", "production", "daily-use"]

  -- Ownership & Origin (CRITICAL for value assessment)
  origin_type TEXT DEFAULT 'created',  -- created, cloned, forked
  ownership TEXT DEFAULT 'mine',       -- mine, exploring, customized-fork, abandoned-clone
  contribution_level INTEGER DEFAULT 100,  -- 0-100: % of code that's yours
  original_repo_url TEXT,              -- If cloned/forked
  forked_from TEXT,                    -- Original project name if customized
  became_mine_date DATETIME,           -- When clone graduated to "mine"

  -- Timestamps
  discovered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME,  -- When project was actually created (from git)
  last_worked_on DATETIME,
  last_opened DATETIME,

  -- Git Configuration (for PM maintenance tasks)
  git_origin_url TEXT,
  git_upstream_url TEXT,
  git_default_branch TEXT DEFAULT 'main',

  -- Purpose & Understanding
  purpose TEXT,           -- One-line: what does it do?
  problem_solved TEXT,    -- What problem does it solve?
  gpt_summary TEXT,       -- AI-generated summary
  ai_summary_updated DATETIME,

  -- Real Usage
  has_real_data BOOLEAN DEFAULT 0,
  data_volume TEXT,       -- "847 strains", "200 records"
  deployed BOOLEAN DEFAULT 0,
  deployed_url TEXT,
  last_deployed_state TEXT,  -- Screenshot path or iframe capture

  -- Version tracking
  is_current_version BOOLEAN DEFAULT 1,
  version_number INTEGER DEFAULT 1,
  app_family TEXT,        -- Groups versions together
  superseded_by TEXT,     -- Points to newer version

  -- Architecture Indicators (for badges/icons)
  has_brain_folder BOOLEAN DEFAULT 0,
  has_tooling_folder BOOLEAN DEFAULT 0,
  is_pnpm_monorepo BOOLEAN DEFAULT 0,
  is_npm_monorepo BOOLEAN DEFAULT 0,
  is_turborepo BOOLEAN DEFAULT 0,
  is_nx_monorepo BOOLEAN DEFAULT 0,
  monorepo_type TEXT,     -- pnpm, npm, turborepo, nx, lerna, rush

  -- Documentation Status (BMAD-style)
  has_prd BOOLEAN DEFAULT 0,
  has_project_overview BOOLEAN DEFAULT 0,
  has_architecture_docs BOOLEAN DEFAULT 0,
  has_bmad_docs BOOLEAN DEFAULT 0,
  has_cursor_rules BOOLEAN DEFAULT 0,
  has_claude_md BOOLEAN DEFAULT 0,

  FOREIGN KEY (superseded_by) REFERENCES projects(name)
);

-- ============================================================
-- ACTIVITY TRACKING - Every time project is opened/worked on
-- ============================================================
CREATE TABLE activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  activity_type TEXT NOT NULL,  -- opened, worked_on, committed, deployed, paused, resumed
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  duration_minutes INTEGER,     -- For 'worked_on' activities
  context TEXT,                 -- What was done? Claude session notes

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- ============================================================
-- PROGRESS METRICS - Stats that change over time
-- ============================================================
CREATE TABLE progress_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  captured_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Git metrics
  total_commits INTEGER DEFAULT 0,
  commits_this_week INTEGER DEFAULT 0,
  commits_this_month INTEGER DEFAULT 0,

  -- Code metrics
  lines_of_code INTEGER DEFAULT 0,
  lines_added_this_week INTEGER DEFAULT 0,
  lines_removed_this_week INTEGER DEFAULT 0,

  -- Time investment
  rescue_time_hours DECIMAL(10,2) DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_opens INTEGER DEFAULT 0,

  -- Momentum (calculated)
  momentum TEXT,  -- high, medium, low, stalled
  momentum_score DECIMAL(5,2),  -- 0-100

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- ============================================================
-- VISUAL MEMORY - Screenshots, UI captures
-- ============================================================
CREATE TABLE screenshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  captured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  file_path TEXT NOT NULL,  -- Relative to .pm-agent/screenshots/
  caption TEXT,
  screenshot_type TEXT,  -- dashboard, feature, deployed-state, error
  is_deployed_state BOOLEAN DEFAULT 0,

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- ============================================================
-- LIFECYCLE HISTORY - Track state changes
-- ============================================================
CREATE TABLE lifecycle_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  from_state TEXT,
  to_state TEXT NOT NULL,
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reason TEXT,
  auto_detected BOOLEAN DEFAULT 0,  -- Was this auto-detected or manual?

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- ============================================================
-- USEFUL PATTERNS - For reference projects
-- ============================================================
CREATE TABLE useful_patterns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  pattern_name TEXT NOT NULL,
  description TEXT,
  file_paths TEXT,  -- JSON array of files where pattern lives
  extracted BOOLEAN DEFAULT 0,
  extraction_location TEXT,  -- Where was it extracted to?

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- ============================================================
-- APP FAMILIES - Version grouping
-- ============================================================
CREATE TABLE app_families (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  family_name TEXT NOT NULL UNIQUE,
  current_version TEXT NOT NULL,  -- Points to current project name
  total_versions INTEGER DEFAULT 1,

  FOREIGN KEY (current_version) REFERENCES projects(name)
);

-- ============================================================
-- TECH STACK - What's the project built with?
-- ============================================================
CREATE TABLE tech_stack (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  technology TEXT NOT NULL,
  category TEXT,  -- frontend, backend, database, deployment, testing
  version TEXT,

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- ============================================================
-- DEPENDENCIES - Track what depends on what
-- ============================================================
CREATE TABLE dependencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  depends_on_project_id INTEGER,  -- Another project it depends on
  dependency_type TEXT,  -- code, data, deployment, pattern
  description TEXT,

  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (depends_on_project_id) REFERENCES projects(id)
);

-- ============================================================
-- SPACE USAGE - Track disk usage for cleanup
-- ============================================================
CREATE TABLE space_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  measured_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  total_size_mb INTEGER,
  node_modules_size_mb INTEGER,
  git_size_mb INTEGER,
  worktrees_count INTEGER,
  worktrees_size_mb INTEGER,

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- ============================================================
-- QUICK ACTIONS - Configured actions for project viewer
-- ============================================================
CREATE TABLE quick_actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER,  -- NULL for global actions
  action_type TEXT NOT NULL,  -- claude_workflow, open_tool, generate_docs, launch_script
  label TEXT NOT NULL,
  icon TEXT,  -- Emoji or icon name
  command TEXT NOT NULL,  -- Shell command or workflow ID
  enabled BOOLEAN DEFAULT 1,
  display_order INTEGER DEFAULT 0,

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Default global quick actions
INSERT INTO quick_actions (action_type, label, icon, command, display_order) VALUES
  ('open_tool', 'Open in Cursor', '💻', 'cursor .', 1),
  ('open_tool', 'Open in Crystal', '💎', 'crystal .', 2),
  ('open_tool', 'Open in Nimbalist', '📋', 'nimbalist .', 3),
  ('claude_workflow', 'Generate PRD', '📋', 'generate-prd', 10),
  ('claude_workflow', 'Generate Architecture Docs', '🏗️', 'generate-architecture', 11),
  ('claude_workflow', 'Setup Brain Garden', '🧠', 'setup-brain-garden', 12);

-- ============================================================
-- INDEXES - Make queries fast
-- ============================================================
CREATE INDEX idx_lifecycle ON projects(lifecycle);
CREATE INDEX idx_last_worked_on ON projects(last_worked_on);
CREATE INDEX idx_last_opened ON projects(last_opened);
CREATE INDEX idx_category ON projects(category);
CREATE INDEX idx_paused ON projects(paused);
CREATE INDEX idx_deployed ON projects(deployed);
CREATE INDEX idx_current_version ON projects(is_current_version);

CREATE INDEX idx_activity_timestamp ON activity_log(timestamp);
CREATE INDEX idx_activity_type ON activity_log(activity_type);

CREATE INDEX idx_metrics_captured ON progress_metrics(captured_at);
CREATE INDEX idx_momentum ON progress_metrics(momentum);

CREATE INDEX idx_screenshot_type ON screenshots(screenshot_type);
CREATE INDEX idx_screenshot_deployed ON screenshots(is_deployed_state);

CREATE INDEX idx_ownership ON projects(ownership);
CREATE INDEX idx_origin_type ON projects(origin_type);
CREATE INDEX idx_contribution ON projects(contribution_level);

-- ============================================================
-- HELPFUL VIEWS - Common queries
-- ============================================================

-- View: My actual projects (high value)
CREATE VIEW my_projects AS
SELECT * FROM projects
WHERE ownership IN ('mine', 'customized-fork')
  AND contribution_level >= 50;

-- View: Just exploring (can delete easily)
CREATE VIEW exploring_clones AS
SELECT * FROM projects
WHERE ownership = 'exploring'
  AND origin_type = 'cloned';

-- View: Projects sorted by value
CREATE VIEW projects_by_value AS
SELECT
  p.*,
  pm.momentum,
  pm.total_commits,
  pm.lines_of_code,
  pm.rescue_time_hours,
  -- Value score (weighted)
  (
    (CASE
      WHEN p.ownership = 'mine' THEN 100
      WHEN p.ownership = 'customized-fork' THEN 80
      WHEN p.ownership = 'exploring' THEN 10
      ELSE 50
    END) * 0.4 +  -- 40% weight on ownership
    (p.contribution_level * 0.3) +  -- 30% weight on contribution
    (CASE p.lifecycle
      WHEN 'using' THEN 100
      WHEN 'building' THEN 70
      WHEN 'reference' THEN 40
      WHEN 'paused' THEN 30
      ELSE 10
    END) * 0.2 +  -- 20% weight on lifecycle
    (CASE
      WHEN pm.momentum = 'high' THEN 100
      WHEN pm.momentum = 'medium' THEN 60
      WHEN pm.momentum = 'low' THEN 30
      ELSE 0
    END) * 0.1  -- 10% weight on momentum
  ) AS value_score
FROM projects p
LEFT JOIN (
  SELECT project_id, momentum, total_commits, lines_of_code, rescue_time_hours
  FROM progress_metrics
  WHERE id IN (
    SELECT MAX(id) FROM progress_metrics GROUP BY project_id
  )
) pm ON p.id = pm.project_id
ORDER BY value_score DESC;
