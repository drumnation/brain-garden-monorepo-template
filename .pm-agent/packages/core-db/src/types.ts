// Database schema types matching the existing SQLite database

export interface Project {
  id: number;
  name: string;
  path: string;

  // State
  lifecycle: 'discovered' | 'building' | 'using' | 'reference' | 'paused' | 'abandoned';
  paused: 0 | 1;
  paused_reason: string | null;
  paused_at: string | null;

  // Categorization
  category: string | null; // app, tool, learning, work, experimental
  tags: string | null; // JSON array as string

  // Ownership & Origin
  origin_type: 'created' | 'cloned' | 'forked';
  ownership: 'mine' | 'exploring' | 'customized-fork' | 'abandoned-clone';
  contribution_level: number; // 0-100
  original_repo_url: string | null;
  forked_from: string | null;
  became_mine_date: string | null;

  // Timestamps
  discovered_at: string;
  created_at: string | null;
  last_worked_on: string | null;
  last_opened: string | null;

  // Git Configuration
  git_origin_url: string | null;
  git_upstream_url: string | null;
  git_default_branch: string;

  // Purpose & Understanding
  purpose: string | null;
  problem_solved: string | null;
  gpt_summary: string | null;
  ai_summary_updated: string | null;

  // Real Usage
  has_real_data: 0 | 1;
  data_volume: string | null;
  deployed: 0 | 1;
  deployed_url: string | null;
  last_deployed_state: string | null;

  // Version tracking
  is_current_version: 0 | 1;
  version_number: number;
  app_family: string | null;
  superseded_by: string | null;

  // Architecture Indicators
  has_brain_folder: 0 | 1;
  has_tooling_folder: 0 | 1;
  is_pnpm_monorepo: 0 | 1;
  is_npm_monorepo: 0 | 1;
  is_turborepo: 0 | 1;
  is_nx_monorepo: 0 | 1;
  monorepo_type: string | null;

  // Documentation Status
  has_prd: 0 | 1;
  has_project_overview: 0 | 1;
  has_architecture_docs: 0 | 1;
  has_bmad_docs: 0 | 1;
  has_cursor_rules: 0 | 1;
  has_claude_md: 0 | 1;
}

export interface ProjectListFilters {
  category?: string;
  lifecycle?: string;
  ownership?: string;
  originType?: string;
  paused?: boolean;
  deployed?: boolean;
  hasRealData?: boolean;
  isCurrentVersion?: boolean;
  hasBrainFolder?: boolean;
  isPnpmMonorepo?: boolean;
  isNpmMonorepo?: boolean;
  hasCursorRules?: boolean;
  hasClaudeMd?: boolean;
  search?: string;
  sortBy?: keyof Project;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  withBrainFolder: number;
  pnpmMonorepos: number;
  npmMonorepos: number;
  deployed: number;
  paused: number;
  projectsByCategory: Record<string, number>;
  projectsByLifecycle: Record<string, number>;
  projectsByOwnership: Record<string, number>;
}