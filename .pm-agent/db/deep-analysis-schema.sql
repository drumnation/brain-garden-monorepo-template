-- Deep Analysis Schema Extension
-- Adds detailed tracking for features, testing, stack, and validation

-- ============================================================
-- TECH STACK (Real dependencies with versions)
-- ============================================================
CREATE TABLE IF NOT EXISTS stack_dependencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,

  -- Dependency info
  package_name TEXT NOT NULL,
  version TEXT,
  category TEXT,  -- frontend, backend, database, testing, devops, ui-library
  is_dev_dependency BOOLEAN DEFAULT 0,

  -- Logo/branding
  logo_url TEXT,
  badge_emoji TEXT,

  -- Usage
  first_detected DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_verified DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (project_id) REFERENCES projects(id),
  UNIQUE(project_id, package_name)
);

-- Popular package logos/emojis
CREATE TABLE IF NOT EXISTS package_metadata (
  package_name TEXT PRIMARY KEY,
  display_name TEXT,
  category TEXT,
  logo_url TEXT,
  badge_emoji TEXT,
  official_site TEXT
);

-- Seed common packages
INSERT OR IGNORE INTO package_metadata VALUES
  ('react', 'React', 'frontend', 'https://reactjs.org/logo.svg', '⚛️', 'https://reactjs.org'),
  ('next', 'Next.js', 'frontend', 'https://nextjs.org/static/favicon/favicon.ico', '▲', 'https://nextjs.org'),
  ('vue', 'Vue', 'frontend', 'https://vuejs.org/logo.svg', '💚', 'https://vuejs.org'),
  ('typescript', 'TypeScript', 'language', 'https://www.typescriptlang.org/favicon.ico', '🔷', 'https://www.typescriptlang.org'),
  ('express', 'Express', 'backend', NULL, '🚂', 'https://expressjs.com'),
  ('fastify', 'Fastify', 'backend', NULL, '⚡', 'https://www.fastify.io'),
  ('postgres', 'PostgreSQL', 'database', NULL, '🐘', 'https://www.postgresql.org'),
  ('mongodb', 'MongoDB', 'database', NULL, '🍃', 'https://www.mongodb.com'),
  ('redis', 'Redis', 'database', NULL, '🔴', 'https://redis.io'),
  ('prisma', 'Prisma', 'database', NULL, '💎', 'https://www.prisma.io'),
  ('jest', 'Jest', 'testing', NULL, '🃏', 'https://jestjs.io'),
  ('vitest', 'Vitest', 'testing', NULL, '⚡', 'https://vitest.dev'),
  ('playwright', 'Playwright', 'testing', NULL, '🎭', 'https://playwright.dev'),
  ('cypress', 'Cypress', 'testing', NULL, '🌲', 'https://www.cypress.io'),
  ('tailwindcss', 'Tailwind CSS', 'ui-library', NULL, '🎨', 'https://tailwindcss.com'),
  ('shadcn', 'shadcn/ui', 'ui-library', NULL, '🎭', 'https://ui.shadcn.com'),
  ('mantine', 'Mantine', 'ui-library', NULL, '🎨', 'https://mantine.dev'),
  ('docker', 'Docker', 'devops', NULL, '🐳', 'https://www.docker.com'),
  ('turborepo', 'Turborepo', 'devops', NULL, '🔥', 'https://turbo.build/repo'),
  ('pnpm', 'pnpm', 'devops', NULL, '📦', 'https://pnpm.io');

-- ============================================================
-- FEATURES & USER STORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,

  -- Feature info
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,  -- auth, data, ui, api, integration

  -- Status
  status TEXT DEFAULT 'planned',  -- planned, in_progress, working, broken, deprecated
  priority TEXT DEFAULT 'medium',  -- low, medium, high, critical

  -- Tracking
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  last_tested DATETIME,

  -- Relationships
  depends_on TEXT,  -- JSON array of feature IDs

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS user_stories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  feature_id INTEGER NOT NULL,

  -- Story
  as_a TEXT NOT NULL,       -- "As a user"
  i_want TEXT NOT NULL,      -- "I want to login"
  so_that TEXT,              -- "So that I can access my data"

  -- Acceptance criteria
  given TEXT,
  when_action TEXT,
  then_result TEXT,

  -- Status
  status TEXT DEFAULT 'pending',  -- pending, passing, failing, manual
  last_validated DATETIME,

  -- Test mapping
  test_file TEXT,
  test_name TEXT,

  FOREIGN KEY (feature_id) REFERENCES features(id)
);

-- ============================================================
-- TESTING INFRASTRUCTURE
-- ============================================================
CREATE TABLE IF NOT EXISTS testing_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,

  -- Testing setup
  has_tests BOOLEAN DEFAULT 0,
  test_framework TEXT,  -- jest, vitest, mocha, pytest, etc.

  -- Test types
  has_unit_tests BOOLEAN DEFAULT 0,
  has_integration_tests BOOLEAN DEFAULT 0,
  has_e2e_tests BOOLEAN DEFAULT 0,
  has_visual_tests BOOLEAN DEFAULT 0,

  -- Coverage
  coverage_enabled BOOLEAN DEFAULT 0,
  coverage_tool TEXT,
  coverage_percentage DECIMAL(5,2),
  coverage_threshold DECIMAL(5,2),

  -- Counts
  total_tests INTEGER DEFAULT 0,
  unit_tests INTEGER DEFAULT 0,
  integration_tests INTEGER DEFAULT 0,
  e2e_tests INTEGER DEFAULT 0,

  -- Status
  last_test_run DATETIME,
  tests_passing INTEGER,
  tests_failing INTEGER,
  tests_skipped INTEGER,

  -- Config files
  test_config_file TEXT,  -- jest.config.js, vitest.config.ts, etc.
  coverage_config_file TEXT,

  -- CI
  runs_in_ci BOOLEAN DEFAULT 0,

  FOREIGN KEY (project_id) REFERENCES projects(id),
  UNIQUE(project_id)
);

-- ============================================================
-- VALIDATION / CI/CD
-- ============================================================
CREATE TABLE IF NOT EXISTS validation_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,

  -- CI/CD Platform
  has_ci BOOLEAN DEFAULT 0,
  ci_platform TEXT,  -- github-actions, gitlab-ci, circle-ci, jenkins
  ci_config_file TEXT,  -- .github/workflows/ci.yml

  -- Validation steps
  runs_linter BOOLEAN DEFAULT 0,
  linter_tool TEXT,  -- eslint, prettier, ruff

  runs_type_check BOOLEAN DEFAULT 0,
  type_checker TEXT,  -- typescript, mypy, flow

  runs_tests BOOLEAN DEFAULT 0,
  runs_build BOOLEAN DEFAULT 0,
  runs_security_scan BOOLEAN DEFAULT 0,

  -- Pre-commit hooks
  has_pre_commit BOOLEAN DEFAULT 0,
  pre_commit_config TEXT,  -- .husky/, .pre-commit-config.yaml

  -- Deployment
  has_deployment BOOLEAN DEFAULT 0,
  deployment_platform TEXT,  -- vercel, netlify, aws, railway
  deployment_config TEXT,

  -- Status
  last_ci_run DATETIME,
  last_ci_status TEXT,  -- success, failure, pending

  FOREIGN KEY (project_id) REFERENCES projects(id),
  UNIQUE(project_id)
);

-- ============================================================
-- AGENT CONFIGURATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS agent_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,

  -- Agent system
  agent_type TEXT NOT NULL,  -- cursor, claude-code, brain-garden, copilot
  config_file TEXT NOT NULL,

  -- Status
  active BOOLEAN DEFAULT 1,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Content summary
  has_project_context BOOLEAN DEFAULT 0,
  has_coding_standards BOOLEAN DEFAULT 0,
  has_test_requirements BOOLEAN DEFAULT 0,
  has_architecture_rules BOOLEAN DEFAULT 0,

  -- Rules count
  total_rules INTEGER DEFAULT 0,

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS agent_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_config_id INTEGER NOT NULL,

  -- Rule
  rule_type TEXT,  -- coding-standard, architecture, testing, documentation
  rule_text TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',

  FOREIGN KEY (agent_config_id) REFERENCES agent_configs(id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_stack_deps_project ON stack_dependencies(project_id);
CREATE INDEX IF NOT EXISTS idx_stack_deps_category ON stack_dependencies(category);

CREATE INDEX IF NOT EXISTS idx_features_project ON features(project_id);
CREATE INDEX IF NOT EXISTS idx_features_status ON features(status);

CREATE INDEX IF NOT EXISTS idx_user_stories_feature ON user_stories(feature_id);
CREATE INDEX IF NOT EXISTS idx_user_stories_status ON user_stories(status);

CREATE INDEX IF NOT EXISTS idx_testing_project ON testing_config(project_id);
CREATE INDEX IF NOT EXISTS idx_validation_project ON validation_config(project_id);
CREATE INDEX IF NOT EXISTS idx_agent_configs_project ON agent_configs(project_id);
