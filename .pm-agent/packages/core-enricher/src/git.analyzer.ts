import { existsSync } from 'fs';
import { join } from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

export interface GitAnalysis {
  gitOriginUrl: string | null;
  gitUpstreamUrl: string | null;
  gitDefaultBranch: string | null;
  originType: 'created' | 'cloned' | 'forked';
  ownership: 'mine' | 'exploring' | 'customized-fork' | 'abandoned-clone';
  originalRepoUrl: string | null;
  forkedFrom: string | null;
  contributionLevel: number; // 0-100 based on commit analysis
  lastWorkedOn: string | null;
  isGitRepo: boolean;
}

/**
 * Analyze Git repository information
 * Pure function following functional pattern
 */
export const analyzeGit = async (projectPath: string): Promise<GitAnalysis> => {
  const result: GitAnalysis = {
    gitOriginUrl: null,
    gitUpstreamUrl: null,
    gitDefaultBranch: null,
    originType: 'created',
    ownership: 'mine',
    originalRepoUrl: null,
    forkedFrom: null,
    contributionLevel: 0,
    lastWorkedOn: null,
    isGitRepo: false,
  };

  // Check if .git directory exists
  if (!existsSync(join(projectPath, '.git'))) {
    return result;
  }

  result.isGitRepo = true;

  try {
    const git: SimpleGit = simpleGit(projectPath);

    // Get remote URLs
    const remotes = await git.getRemotes(true);

    // Find origin remote
    const origin = remotes.find(r => r.name === 'origin');
    if (origin && origin.refs.fetch) {
      result.gitOriginUrl = origin.refs.fetch;
    }

    // Find upstream remote (for forks)
    const upstream = remotes.find(r => r.name === 'upstream');
    if (upstream && upstream.refs.fetch) {
      result.gitUpstreamUrl = upstream.refs.fetch;
      result.forkedFrom = upstream.refs.fetch;
      result.originType = 'forked';
    }

    // Get default branch
    try {
      // Try to get the symbolic-ref for HEAD
      const branches = await git.branch();
      result.gitDefaultBranch = branches.current || 'main';
    } catch {
      result.gitDefaultBranch = 'main'; // Default fallback
    }

    // Analyze commit history for ownership and contribution
    const ownershipInfo = await analyzeOwnership(git);
    result.ownership = ownershipInfo.ownership;
    result.contributionLevel = ownershipInfo.contributionLevel;
    result.lastWorkedOn = ownershipInfo.lastCommitDate;

    // Determine origin type based on commit analysis
    if (!result.gitUpstreamUrl) {
      // No upstream, check if it's a clone or created
      if (ownershipInfo.isOriginalWork) {
        result.originType = 'created';
      } else {
        result.originType = 'cloned';
        result.originalRepoUrl = result.gitOriginUrl;
      }
    }

    return result;
  } catch (error) {
    console.error(`Error analyzing Git repository at ${projectPath}:`, error);
    return result;
  }
};

/**
 * Analyze Git commit history to determine ownership and contribution
 */
const analyzeOwnership = async (
  git: SimpleGit
): Promise<{
  ownership: 'mine' | 'exploring' | 'customized-fork' | 'abandoned-clone';
  contributionLevel: number;
  lastCommitDate: string | null;
  isOriginalWork: boolean;
}> => {
  try {
    // Get commit log
    const log = await git.log(['--all', '--max-count=100']);

    if (!log.total) {
      return {
        ownership: 'mine',
        contributionLevel: 0,
        lastCommitDate: null,
        isOriginalWork: true,
      };
    }

    // Get current user config
    const userEmail = await git.raw(['config', 'user.email']).catch(() => '');
    const userName = await git.raw(['config', 'user.name']).catch(() => '');

    // Analyze commits
    let myCommits = 0;
    let totalCommits = log.total;
    let lastMyCommitDate: string | null = null;
    let firstCommitAuthor = '';
    let uniqueAuthors = new Set<string>();

    for (const commit of log.all) {
      const authorEmail = commit.author_email?.toLowerCase() || '';
      const authorName = commit.author_name?.toLowerCase() || '';

      uniqueAuthors.add(authorEmail || authorName);

      // Track first commit author
      if (!firstCommitAuthor) {
        firstCommitAuthor = authorEmail || authorName;
      }

      // Check if this is my commit
      if (
        (userEmail && authorEmail === userEmail.toLowerCase().trim()) ||
        (userName && authorName === userName.toLowerCase().trim()) ||
        // Common patterns for personal commits
        authorEmail.includes('dmieloch') ||
        authorName.includes('dmieloch')
      ) {
        myCommits++;
        if (!lastMyCommitDate) {
          lastMyCommitDate = commit.date;
        }
      }
    }

    // Calculate contribution level (0-100)
    const contributionLevel = totalCommits > 0 ? Math.round((myCommits / totalCommits) * 100) : 0;

    // Determine if this is original work
    const isOriginalWork =
      firstCommitAuthor === userEmail.toLowerCase().trim() ||
      firstCommitAuthor === userName.toLowerCase().trim() ||
      firstCommitAuthor.includes('dmieloch');

    // Determine ownership based on contribution
    let ownership: 'mine' | 'exploring' | 'customized-fork' | 'abandoned-clone';

    if (contributionLevel >= 80 || isOriginalWork) {
      ownership = 'mine';
    } else if (contributionLevel >= 30) {
      ownership = 'customized-fork';
    } else if (contributionLevel > 0) {
      ownership = 'exploring';
    } else {
      ownership = 'abandoned-clone';
    }

    return {
      ownership,
      contributionLevel,
      lastCommitDate: lastMyCommitDate,
      isOriginalWork,
    };
  } catch (error) {
    console.error('Error analyzing Git ownership:', error);
    return {
      ownership: 'mine',
      contributionLevel: 50,
      lastCommitDate: null,
      isOriginalWork: false,
    };
  }
};