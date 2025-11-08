#!/usr/bin/env tsx
/**
 * pm-view command
 * Shows detailed information about a specific project
 */

import { program } from 'commander';
import chalk from 'chalk';
import { makeDbClient, makeProjectRepo } from '@pm-agent/core-db';

const PM_AGENT_DB = '/Users/dmieloch/Dev/.pm-agent/db/pm-agent.db';

async function main() {
  program
    .name('pm-view')
    .description('View detailed information about a project')
    .argument('<project>', 'Project name or path')
    .parse();

  const projectQuery = program.args[0];

  if (!projectQuery) {
    console.error(chalk.red('Error: Project name or path is required'));
    process.exit(1);
  }

  try {
    // Initialize database client
    const db = await makeDbClient({ dbPath: PM_AGENT_DB, readonly: true });
    const projectRepo = makeProjectRepo({ db });

    // Search for project by name or path
    let project = await projectRepo.findByPath(projectQuery);

    if (!project) {
      // Try searching by path suffix or name
      const allProjects = await projectRepo.findAll();
      project = allProjects.find(p =>
        p.path.endsWith(projectQuery) ||
        p.name.toLowerCase() === projectQuery.toLowerCase()
      );
    }

    if (!project) {
      console.log(chalk.red(`Project "${projectQuery}" not found.`));
      console.log(chalk.gray('\nTip: Use "pm-list" to see all projects'));
      db.close();
      process.exit(1);
    }

    // Display project details
    console.log('\n' + chalk.blue('📦 Project Details'));
    console.log(chalk.gray('─'.repeat(60)));

    // Basic info
    console.log(chalk.cyan('Basic Information:'));
    console.log(`  ${chalk.gray('Name:')} ${chalk.white(project.name)}`);
    console.log(`  ${chalk.gray('Path:')} ${chalk.white(project.path)}`);
    console.log(`  ${chalk.gray('Category:')} ${project.category || 'unknown'}`);

    const lifecycleColor =
      project.lifecycle === 'using' ? chalk.green :
      project.lifecycle === 'building' ? chalk.yellow :
      project.lifecycle === 'paused' ? chalk.gray :
      project.lifecycle === 'abandoned' ? chalk.red :
      chalk.white;
    console.log(`  ${chalk.gray('Lifecycle:')} ${lifecycleColor(project.lifecycle || 'unknown')}`);

    console.log(`  ${chalk.gray('Ownership:')} ${project.ownership || 'unknown'}`);
    console.log(`  ${chalk.gray('Origin Type:')} ${project.origin_type || 'unknown'}`);

    if (project.purpose) {
      console.log(`  ${chalk.gray('Purpose:')} ${project.purpose}`);
    }

    if (project.problem_solved) {
      console.log(`  ${chalk.gray('Problem Solved:')} ${project.problem_solved}`);
    }

    // Git information
    if (project.git_origin_url || project.git_upstream_url) {
      console.log('\n' + chalk.cyan('Git Information:'));
      if (project.git_origin_url) {
        console.log(`  ${chalk.gray('Origin:')} ${project.git_origin_url}`);
      }
      if (project.git_upstream_url) {
        console.log(`  ${chalk.gray('Upstream:')} ${project.git_upstream_url}`);
      }
      console.log(`  ${chalk.gray('Default Branch:')} ${project.git_default_branch || 'main'}`);
    }

    // Tech stack
    if (project.tags) {
      try {
        const tags = JSON.parse(project.tags);
        if (Array.isArray(tags) && tags.length > 0) {
          console.log('\n' + chalk.cyan('Technology Stack:'));
          for (const tech of tags) {
            console.log(`  ${chalk.green('•')} ${tech}`);
          }
        }
      } catch {
        // Invalid JSON
      }
    }

    // Monorepo info
    if (project.is_pnpm_monorepo || project.is_turborepo || project.is_nx_monorepo) {
      console.log('\n' + chalk.cyan('Monorepo Configuration:'));
      if (project.is_pnpm_monorepo) console.log(`  ${chalk.green('✓')} pnpm workspace`);
      if (project.is_turborepo) console.log(`  ${chalk.green('✓')} Turborepo`);
      if (project.is_nx_monorepo) console.log(`  ${chalk.green('✓')} Nx`);
      if (project.monorepo_type) {
        console.log(`  ${chalk.gray('Type:')} ${project.monorepo_type}`);
      }
    }

    // Deployment
    if (project.deployed) {
      console.log('\n' + chalk.cyan('Deployment:'));
      console.log(`  ${chalk.green('✓')} Deployed`);
      if (project.deployed_url) {
        console.log(`  ${chalk.gray('URL:')} ${project.deployed_url}`);
      }
      if (project.last_deployed_state) {
        console.log(`  ${chalk.gray('State:')} ${project.last_deployed_state}`);
      }
    }

    // Features
    console.log('\n' + chalk.cyan('Features:'));
    const features = [
      { flag: project.has_brain_folder, label: '🧠 Brain Garden', name: 'Brain Garden AI integration' },
      { flag: project.has_claude_md, label: '🤖 Claude.md', name: 'Claude instructions' },
      { flag: project.has_cursor_rules, label: '💻 Cursor Rules', name: '.cursorrules configuration' },
      { flag: project.has_prd, label: '📋 PRD', name: 'Product Requirements Document' },
      { flag: project.has_project_overview, label: '📖 README', name: 'Project overview' },
      { flag: project.has_architecture_docs, label: '🏗️ Architecture', name: 'Architecture documentation' },
      { flag: project.has_bmad_docs, label: '📊 BMAD', name: 'Business Model documentation' },
    ];

    let hasFeatures = false;
    for (const feature of features) {
      if (feature.flag) {
        console.log(`  ${feature.label} ${chalk.green('✓')} ${feature.name}`);
        hasFeatures = true;
      }
    }

    if (!hasFeatures) {
      console.log(`  ${chalk.gray('No special features detected')}`);
    }

    // Versioning
    if (project.version_number || project.app_family) {
      console.log('\n' + chalk.cyan('Versioning:'));
      if (project.version_number) {
        console.log(`  ${chalk.gray('Version:')} v${project.version_number}`);
      }
      if (project.is_current_version) {
        console.log(`  ${chalk.green('✓')} Current version`);
      }
      if (project.app_family) {
        console.log(`  ${chalk.gray('Family:')} ${project.app_family}`);
      }
      if (project.superseded_by) {
        console.log(`  ${chalk.yellow('Superseded by:')} ${project.superseded_by}`);
      }
    }

    // Timestamps
    console.log('\n' + chalk.cyan('Timeline:'));
    if (project.discovered_at) {
      console.log(`  ${chalk.gray('Discovered:')} ${new Date(project.discovered_at).toLocaleString()}`);
    }
    if (project.created_at) {
      console.log(`  ${chalk.gray('Created:')} ${new Date(project.created_at).toLocaleString()}`);
    }
    if (project.last_worked_on) {
      const lastWorked = new Date(project.last_worked_on);
      const daysAgo = Math.floor((Date.now() - lastWorked.getTime()) / (1000 * 60 * 60 * 24));
      console.log(`  ${chalk.gray('Last Worked:')} ${lastWorked.toLocaleString()} (${daysAgo} days ago)`);
    }
    if (project.last_opened) {
      console.log(`  ${chalk.gray('Last Opened:')} ${new Date(project.last_opened).toLocaleString()}`);
    }

    // Ownership & Contribution
    if (project.contribution_level !== null && project.contribution_level !== undefined) {
      console.log('\n' + chalk.cyan('Contribution:'));
      const level = project.contribution_level;
      const levelColor = level >= 80 ? chalk.green :
                        level >= 50 ? chalk.yellow :
                        chalk.red;
      console.log(`  ${chalk.gray('Your Code:')} ${levelColor(level + '%')}`);

      if (project.original_repo_url) {
        console.log(`  ${chalk.gray('Original:')} ${project.original_repo_url}`);
      }
      if (project.forked_from) {
        console.log(`  ${chalk.gray('Forked From:')} ${project.forked_from}`);
      }
    }

    // Quick actions
    console.log('\n' + chalk.cyan('Quick Actions:'));
    console.log(`  ${chalk.gray('Open in terminal:')} cd "${project.path}"`);
    console.log(`  ${chalk.gray('Open in VS Code:')} code "${project.path}"`);
    console.log(`  ${chalk.gray('Open in Cursor:')} cursor "${project.path}"`);

    if (project.git_origin_url) {
      const repoUrl = project.git_origin_url.replace('.git', '');
      console.log(`  ${chalk.gray('View on GitHub:')} open ${repoUrl}`);
    }

    if (project.deployed_url) {
      console.log(`  ${chalk.gray('View Deployment:')} open ${project.deployed_url}`);
    }

    console.log(chalk.gray('─'.repeat(60)));

    // Close database
    db.close();
  } catch (error) {
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

main();