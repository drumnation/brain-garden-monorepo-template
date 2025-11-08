import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import glob from 'fast-glob';
import simpleGit, { SimpleGit } from 'simple-git';

export interface ProjectMetadata {
  name: string;
  path: string;
  isMonorepo: boolean;
  isGitRepo: boolean;
  hasBrainGarden: boolean;
  gitRemoteUrl: string | null;
  lastGitCommit: string | null;
  hasTests: boolean;
  testCount: number;
  locCount: number;
  packageJsonData?: any;
}

/**
 * Detect if a directory is a monorepo
 */
export const detectMonorepo = async (projectPath: string): Promise<boolean> => {
  const indicators = [
    'pnpm-workspace.yaml',
    'lerna.json',
    'nx.json',
    'rush.json',
    '.yarnrc.yml', // Yarn Berry workspaces
    'turbo.json',
  ];

  for (const indicator of indicators) {
    if (existsSync(join(projectPath, indicator))) {
      return true;
    }
  }

  // Check package.json for workspaces field
  const packageJsonPath = join(projectPath, 'package.json');
  if (existsSync(packageJsonPath)) {
    try {
      const content = await readFile(packageJsonPath, 'utf-8');
      const pkg = JSON.parse(content);
      if (pkg.workspaces) {
        return true;
      }
    } catch {
      // Ignore JSON parsing errors
    }
  }

  return false;
};

/**
 * Detect if a directory has Brain Garden configuration
 */
export const detectBrainGarden = (projectPath: string): boolean => {
  const indicators = [
    '.claude',
    '.claude/CLAUDE.md',
    '.clinerules',
    '.cursorrules',
    '.windsurfrules',
    '.brain',
    'brain-monitor',
  ];

  for (const indicator of indicators) {
    if (existsSync(join(projectPath, indicator))) {
      return true;
    }
  }

  return false;
};

/**
 * Get Git repository information
 */
export const getGitInfo = async (projectPath: string): Promise<{
  isGitRepo: boolean;
  gitRemoteUrl: string | null;
  lastGitCommit: string | null;
}> => {
  if (!existsSync(join(projectPath, '.git'))) {
    return {
      isGitRepo: false,
      gitRemoteUrl: null,
      lastGitCommit: null,
    };
  }

  try {
    const git: SimpleGit = simpleGit(projectPath);

    // Get remote URL
    let gitRemoteUrl: string | null = null;
    try {
      const remotes = await git.getRemotes(true);
      if (remotes.length > 0) {
        gitRemoteUrl = remotes[0].refs.fetch || null;
      }
    } catch {
      // No remotes configured
    }

    // Get last commit hash
    let lastGitCommit: string | null = null;
    try {
      const log = await git.log({ maxCount: 1 });
      if (log.latest) {
        lastGitCommit = log.latest.hash;
      }
    } catch {
      // No commits yet
    }

    return {
      isGitRepo: true,
      gitRemoteUrl,
      lastGitCommit,
    };
  } catch {
    return {
      isGitRepo: false,
      gitRemoteUrl: null,
      lastGitCommit: null,
    };
  }
};

/**
 * Count test files in the project
 */
export const countTests = async (projectPath: string): Promise<{ hasTests: boolean; testCount: number }> => {
  try {
    const testPatterns = [
      '**/*.test.{ts,tsx,js,jsx}',
      '**/*.spec.{ts,tsx,js,jsx}',
      '**/__tests__/**/*.{ts,tsx,js,jsx}',
      '**/test/**/*.{ts,tsx,js,jsx}',
      '**/tests/**/*.{ts,tsx,js,jsx}',
    ];

    const testFiles = await glob(testPatterns, {
      cwd: projectPath,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**'],
      absolute: false,
    });

    return {
      hasTests: testFiles.length > 0,
      testCount: testFiles.length,
    };
  } catch {
    return {
      hasTests: false,
      testCount: 0,
    };
  }
};

/**
 * Count lines of code (rough estimate)
 */
export const countLinesOfCode = async (projectPath: string): Promise<number> => {
  try {
    const codePatterns = [
      '**/*.{ts,tsx,js,jsx,mjs,cjs}',
      '**/*.{py,rb,go,rs,java,kt,swift}',
      '**/*.{c,cpp,h,hpp,cs}',
      '**/*.{html,css,scss,sass,less}',
      '**/*.{json,yaml,yml,toml}',
      '**/*.{sql,sh,bash}',
    ];

    const codeFiles = await glob(codePatterns, {
      cwd: projectPath,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**', '**/vendor/**'],
      absolute: true,
    });

    let totalLines = 0;
    for (const file of codeFiles.slice(0, 1000)) { // Limit to first 1000 files for performance
      try {
        const content = await readFile(file, 'utf-8');
        totalLines += content.split('\n').length;
      } catch {
        // Skip files that can't be read
      }
    }

    return totalLines;
  } catch {
    return 0;
  }
};

/**
 * Extract project name from package.json or directory name
 */
export const extractProjectName = async (projectPath: string): Promise<string> => {
  const packageJsonPath = join(projectPath, 'package.json');
  if (existsSync(packageJsonPath)) {
    try {
      const content = await readFile(packageJsonPath, 'utf-8');
      const pkg = JSON.parse(content);
      if (pkg.name) {
        return pkg.name;
      }
    } catch {
      // Ignore JSON parsing errors
    }
  }

  // Fall back to directory name
  const parts = projectPath.split('/');
  return parts[parts.length - 1] || 'unknown';
};

/**
 * Scan a single project directory and extract metadata
 */
export const scanProjectDirectory = async (projectPath: string): Promise<ProjectMetadata> => {
  const [
    name,
    isMonorepo,
    hasBrainGarden,
    gitInfo,
    testInfo,
    locCount,
  ] = await Promise.all([
    extractProjectName(projectPath),
    detectMonorepo(projectPath),
    Promise.resolve(detectBrainGarden(projectPath)),
    getGitInfo(projectPath),
    countTests(projectPath),
    countLinesOfCode(projectPath),
  ]);

  return {
    name,
    path: projectPath,
    isMonorepo,
    isGitRepo: gitInfo.isGitRepo,
    hasBrainGarden,
    gitRemoteUrl: gitInfo.gitRemoteUrl,
    lastGitCommit: gitInfo.lastGitCommit,
    hasTests: testInfo.hasTests,
    testCount: testInfo.testCount,
    locCount,
  };
};