import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import type { ProjectRepo, Project } from '@pm-agent/core-db';
import { scanProjectDirectory, type ProjectMetadata } from './detector.util.js';

export interface ScannerConfig {
  basePath: string;
  excludePaths?: string[];
  maxDepth?: number;
  updateExisting?: boolean;
  detectOnly?: boolean; // If true, don't save to database
}

export interface ScanResult {
  found: number;
  new: number;
  updated: number;
  errors: string[];
  projects: ProjectMetadata[];
}

export interface ProjectScanner {
  scanDirectory: (config: ScannerConfig) => Promise<ScanResult>;
  scanSingleProject: (projectPath: string) => Promise<ProjectMetadata>;
  enrichProject: (projectPath: string) => Promise<Project | null>;
}

/**
 * Create a project scanner service
 * Pure factory function following functional DI pattern
 */
export const makeProjectScanner = (deps: { projectRepo?: ProjectRepo }): ProjectScanner => {
  const { projectRepo } = deps;

  /**
   * Recursively find all potential project directories
   */
  const findProjectDirectories = (
    basePath: string,
    excludePaths: string[] = [],
    maxDepth: number = 3,
    currentDepth: number = 0
  ): string[] => {
    const projects: string[] = [];

    if (currentDepth >= maxDepth) {
      return projects;
    }

    try {
      const entries = readdirSync(basePath);

      for (const entry of entries) {
        const fullPath = join(basePath, entry);

        // Skip excluded paths
        if (excludePaths.some(excluded => fullPath.includes(excluded))) {
          continue;
        }

        // Skip hidden directories (except .pm-agent itself)
        if (entry.startsWith('.') && entry !== '.pm-agent') {
          continue;
        }

        // Skip common non-project directories
        const skipDirs = ['node_modules', 'dist', 'build', '.next', 'coverage', 'tmp', 'temp', 'vendor'];
        if (skipDirs.includes(entry)) {
          continue;
        }

        try {
          const stat = statSync(fullPath);
          if (!stat.isDirectory()) {
            continue;
          }

          // Check if this is a project directory (has package.json, .git, or other indicators)
          const hasPackageJson = readdirSync(fullPath).includes('package.json');
          const hasGit = readdirSync(fullPath).includes('.git');
          const hasPomXml = readdirSync(fullPath).includes('pom.xml');
          const hasCargoToml = readdirSync(fullPath).includes('Cargo.toml');
          const hasGoMod = readdirSync(fullPath).includes('go.mod');
          const hasPyproject = readdirSync(fullPath).includes('pyproject.toml');
          const hasRequirements = readdirSync(fullPath).includes('requirements.txt');

          if (hasPackageJson || hasGit || hasPomXml || hasCargoToml || hasGoMod || hasPyproject || hasRequirements) {
            projects.push(fullPath);
          } else {
            // Recursively search subdirectories
            projects.push(...findProjectDirectories(fullPath, excludePaths, maxDepth, currentDepth + 1));
          }
        } catch {
          // Skip directories we can't read
        }
      }
    } catch {
      // Skip if we can't read the base path
    }

    return projects;
  };

  /**
   * Convert project metadata to database project format
   */
  const metadataToProject = (metadata: ProjectMetadata): Omit<Project, 'id' | 'created_at' | 'updated_at'> => {
    // Determine category based on path and indicators
    let category: Project['category'] = 'experimental';
    if (metadata.hasBrainGarden || metadata.testCount > 10) {
      category = 'active';
    } else if (metadata.path.includes('learning') || metadata.path.includes('tutorial')) {
      category = 'learning';
    } else if (metadata.path.includes('archive')) {
      category = 'archived';
    } else if (metadata.path.includes('template')) {
      category = 'template';
    }

    // Determine type
    let type: Project['type'] = 'personal';
    if (metadata.path.includes('work')) {
      type = 'work';
    } else if (metadata.path.includes('learning') || metadata.path.includes('tutorial')) {
      type = 'learning';
    } else if (metadata.hasBrainGarden) {
      type = 'ai-development';
    }

    // Calculate basic quality score
    let qualityScore = 50; // Base score
    if (metadata.hasBrainGarden) qualityScore += 20;
    if (metadata.hasTests) qualityScore += 15;
    if (metadata.isGitRepo) qualityScore += 10;
    if (metadata.isMonorepo) qualityScore += 5;
    qualityScore = Math.min(100, qualityScore);

    return {
      name: metadata.name,
      path: metadata.path,
      category,
      type,
      is_monorepo: metadata.isMonorepo ? 1 : 0,
      is_git_repo: metadata.isGitRepo ? 1 : 0,
      has_brain_garden: metadata.hasBrainGarden ? 1 : 0,
      git_remote_url: metadata.gitRemoteUrl,
      last_git_commit: metadata.lastGitCommit,
      lifecycle_state: 'discovery',
      quality_score: qualityScore,
      effort_invested: 0,
      test_coverage_percent: null,
      test_pass_rate: null,
      docs_completeness_percent: null,
      tech_debt_score: null,
      priority: 50,
      is_worth_resuming: qualityScore > 70 ? 1 : 0,
      abandonment_risk: null,
      motivation_level: null,
      progress_percentage: null,
      description: null,
      last_accessed: null,
      last_session_end: null,
      session_count: 0,
      dev_sessions_count: 0,
      active_hours_total: 0,
      loc_count: metadata.locCount,
      test_count: metadata.testCount,
      complexity_score: null,
      tags: null,
      notes: null,
    };
  };

  const scanDirectory = async (config: ScannerConfig): Promise<ScanResult> => {
    const result: ScanResult = {
      found: 0,
      new: 0,
      updated: 0,
      errors: [],
      projects: [],
    };

    // Find all project directories
    const projectPaths = findProjectDirectories(
      config.basePath,
      config.excludePaths,
      config.maxDepth
    );

    // Scan each project
    for (const projectPath of projectPaths) {
      try {
        const metadata = await scanProjectDirectory(projectPath);
        result.found++;
        result.projects.push(metadata);

        // Save to database if repo is provided and not in detect-only mode
        if (projectRepo && !config.detectOnly) {
          const projectData = metadataToProject(metadata);
          const existing = await projectRepo.findByPath(projectPath);

          if (existing) {
            if (config.updateExisting) {
              await projectRepo.update(existing.id, projectData);
              result.updated++;
            }
          } else {
            await projectRepo.create(projectData);
            result.new++;
          }
        }
      } catch (error) {
        result.errors.push(`Failed to scan ${projectPath}: ${error}`);
      }
    }

    return result;
  };

  const scanSingleProject = async (projectPath: string): Promise<ProjectMetadata> => {
    return await scanProjectDirectory(projectPath);
  };

  const enrichProject = async (projectPath: string): Promise<Project | null> => {
    if (!projectRepo) {
      throw new Error('Project repository not provided');
    }

    const metadata = await scanProjectDirectory(projectPath);
    const projectData = metadataToProject(metadata);

    // Update or create the project
    return await projectRepo.upsertByPath(projectData);
  };

  return {
    scanDirectory,
    scanSingleProject,
    enrichProject,
  };
};