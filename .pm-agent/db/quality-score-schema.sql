-- Enhanced Quality Score System
-- Comprehensive "does it actually work?" tracking

-- ============================================================
-- SERVICE HEALTH (Required services for app to run)
-- ============================================================
CREATE TABLE IF NOT EXISTS required_services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,

  -- Service info
  service_name TEXT NOT NULL,
  service_type TEXT,  -- database, api, redis, backend, worker
  start_command TEXT,
  health_check_url TEXT,  -- http://localhost:3000/health
  expected_port INTEGER,

  -- Status
  required BOOLEAN DEFAULT 1,
  currently_running BOOLEAN DEFAULT 0,
  last_check DATETIME,

  -- Health
  last_start_success BOOLEAN,
  last_start_error TEXT,
  startup_time_seconds INTEGER,

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- ============================================================
-- APP SCREENSHOTS (Visual proof app works)
-- ============================================================
CREATE TABLE IF NOT EXISTS app_screenshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,

  -- Screenshot info
  screen_name TEXT NOT NULL,  -- "Dashboard", "Login", "Product Page"
  route_path TEXT,            -- "/dashboard", "/products/123"
  state_description TEXT,     -- "Logged in as admin", "Empty cart"

  -- File
  screenshot_path TEXT NOT NULL,
  captured_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Metadata
  viewport_width INTEGER DEFAULT 1920,
  viewport_height INTEGER DEFAULT 1080,
  is_mobile BOOLEAN DEFAULT 0,

  -- Value
  shows_real_data BOOLEAN DEFAULT 0,
  user_facing BOOLEAN DEFAULT 1,  -- vs admin/internal screen

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- ============================================================
-- ERROR TRACKING (All error types)
-- ============================================================
CREATE TABLE IF NOT EXISTS error_summary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,

  -- When checked
  checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Linting
  eslint_errors INTEGER DEFAULT 0,
  eslint_warnings INTEGER DEFAULT 0,
  prettier_errors INTEGER DEFAULT 0,

  -- Type checking
  typescript_errors INTEGER DEFAULT 0,

  -- Testing
  snapshot_failures INTEGER DEFAULT 0,
  visual_regression_failures INTEGER DEFAULT 0,

  -- Runtime (if captured)
  console_errors INTEGER DEFAULT 0,
  console_warnings INTEGER DEFAULT 0,

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- ============================================================
-- COMPREHENSIVE QUALITY SCORE
-- ============================================================
CREATE TABLE IF NOT EXISTS quality_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,

  -- When calculated
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Component scores (0-100 each)
  code_coverage_score INTEGER DEFAULT 0,      -- Based on test coverage %
  passing_tests_score INTEGER DEFAULT 0,      -- Based on pass rate
  zero_errors_score INTEGER DEFAULT 0,        -- All error types
  services_running_score INTEGER DEFAULT 0,   -- All services up?
  visual_proof_score INTEGER DEFAULT 0,       -- Has screenshots

  -- Overall quality (0-100)
  overall_quality INTEGER,

  -- Breakdown
  coverage_percentage DECIMAL(5,2),
  test_pass_rate DECIMAL(5,2),
  total_errors INTEGER,
  services_up INTEGER,
  services_required INTEGER,
  screenshots_count INTEGER,

  FOREIGN KEY (project_id) REFERENCES projects(id),
  UNIQUE(project_id)
);

-- ============================================================
-- QUALITY CALCULATION VIEW
-- ============================================================
CREATE VIEW IF NOT EXISTS project_quality_dashboard AS
SELECT
  p.name,
  p.ownership,
  p.lifecycle,

  -- Quality components
  q.code_coverage_score || '/100' as coverage,
  q.passing_tests_score || '/100' as tests,
  q.zero_errors_score || '/100' as errors,
  q.services_running_score || '/100' as services,
  q.visual_proof_score || '/100' as visual,

  -- Overall
  q.overall_quality || '/100' as quality,

  -- Details
  q.coverage_percentage || '%' as test_coverage,
  q.test_pass_rate || '%' as pass_rate,
  q.total_errors as error_count,
  q.services_up || '/' || q.services_required as services_status,
  q.screenshots_count as screenshots,

  -- Signals
  CASE WHEN q.overall_quality >= 90 THEN '🟢' WHEN q.overall_quality >= 70 THEN '🟡' ELSE '🔴' END as signal,

  q.calculated_at as last_checked

FROM projects p
LEFT JOIN quality_scores q ON p.id = q.project_id
WHERE p.ownership = 'mine'
ORDER BY q.overall_quality DESC;

-- ============================================================
-- QUALITY SCORE CALCULATION FUNCTION (via INSERT trigger)
-- ============================================================

-- Calculate comprehensive quality score
-- Called after updating health/testing data
CREATE TRIGGER IF NOT EXISTS calculate_quality_score
AFTER INSERT ON project_health
BEGIN
  INSERT OR REPLACE INTO quality_scores (
    project_id,
    code_coverage_score,
    passing_tests_score,
    zero_errors_score,
    services_running_score,
    visual_proof_score,
    overall_quality,
    coverage_percentage,
    test_pass_rate,
    total_errors,
    services_up,
    services_required,
    screenshots_count
  )
  SELECT
    NEW.project_id,

    -- 1. Code Coverage Score (25%)
    CAST(COALESCE(NEW.test_coverage, 0) AS INTEGER),

    -- 2. Passing Tests Score (20%)
    CAST(
      CASE
        WHEN (NEW.tests_passing + NEW.tests_failing) = 0 THEN 0
        ELSE (NEW.tests_passing * 100.0 / (NEW.tests_passing + NEW.tests_failing))
      END AS INTEGER
    ),

    -- 3. Zero Errors Score (20%)
    CAST(
      CASE
        WHEN (COALESCE(NEW.linter_errors, 0) + COALESCE(NEW.type_errors, 0)) = 0 THEN 100
        WHEN (COALESCE(NEW.linter_errors, 0) + COALESCE(NEW.type_errors, 0)) <= 5 THEN 75
        WHEN (COALESCE(NEW.linter_errors, 0) + COALESCE(NEW.type_errors, 0)) <= 10 THEN 50
        WHEN (COALESCE(NEW.linter_errors, 0) + COALESCE(NEW.type_errors, 0)) <= 20 THEN 25
        ELSE 0
      END AS INTEGER
    ),

    -- 4. Services Running Score (20%)
    CAST(
      CASE
        WHEN (SELECT COUNT(*) FROM required_services WHERE project_id = NEW.project_id AND required = 1) = 0 THEN 100
        ELSE (
          (SELECT COUNT(*) FROM required_services WHERE project_id = NEW.project_id AND currently_running = 1) * 100.0 /
          (SELECT COUNT(*) FROM required_services WHERE project_id = NEW.project_id AND required = 1)
        )
      END AS INTEGER
    ),

    -- 5. Visual Proof Score (15%)
    CAST(
      CASE
        WHEN (SELECT COUNT(*) FROM app_screenshots WHERE project_id = NEW.project_id) = 0 THEN 0
        WHEN (SELECT COUNT(*) FROM app_screenshots WHERE project_id = NEW.project_id) >= 10 THEN 100
        ELSE (SELECT COUNT(*) FROM app_screenshots WHERE project_id = NEW.project_id) * 10
      END AS INTEGER
    ),

    -- Overall Quality (weighted average)
    CAST(
      (
        COALESCE(NEW.test_coverage, 0) * 0.25 +
        (CASE
          WHEN (NEW.tests_passing + NEW.tests_failing) = 0 THEN 0
          ELSE (NEW.tests_passing * 100.0 / (NEW.tests_passing + NEW.tests_failing)) * 0.20
        END) +
        (CASE
          WHEN (COALESCE(NEW.linter_errors, 0) + COALESCE(NEW.type_errors, 0)) = 0 THEN 100
          WHEN (COALESCE(NEW.linter_errors, 0) + COALESCE(NEW.type_errors, 0)) <= 5 THEN 75
          WHEN (COALESCE(NEW.linter_errors, 0) + COALESCE(NEW.type_errors, 0)) <= 10 THEN 50
          WHEN (COALESCE(NEW.linter_errors, 0) + COALESCE(NEW.type_errors, 0)) <= 20 THEN 25
          ELSE 0
        END) * 0.20 +
        (CASE
          WHEN (SELECT COUNT(*) FROM required_services WHERE project_id = NEW.project_id AND required = 1) = 0 THEN 100
          ELSE (
            (SELECT COUNT(*) FROM required_services WHERE project_id = NEW.project_id AND currently_running = 1) * 100.0 /
            (SELECT COUNT(*) FROM required_services WHERE project_id = NEW.project_id AND required = 1)
          )
        END) * 0.20 +
        (CASE
          WHEN (SELECT COUNT(*) FROM app_screenshots WHERE project_id = NEW.project_id) = 0 THEN 0
          WHEN (SELECT COUNT(*) FROM app_screenshots WHERE project_id = NEW.project_id) >= 10 THEN 100
          ELSE (SELECT COUNT(*) FROM app_screenshots WHERE project_id = NEW.project_id) * 10
        END) * 0.15
      ) AS INTEGER
    ),

    -- Breakdown values
    NEW.test_coverage,
    CASE
      WHEN (NEW.tests_passing + NEW.tests_failing) = 0 THEN 0
      ELSE (NEW.tests_passing * 100.0 / (NEW.tests_passing + NEW.tests_failing))
    END,
    COALESCE(NEW.linter_errors, 0) + COALESCE(NEW.type_errors, 0),
    (SELECT COUNT(*) FROM required_services WHERE project_id = NEW.project_id AND currently_running = 1),
    (SELECT COUNT(*) FROM required_services WHERE project_id = NEW.project_id AND required = 1),
    (SELECT COUNT(*) FROM app_screenshots WHERE project_id = NEW.project_id);
END;
