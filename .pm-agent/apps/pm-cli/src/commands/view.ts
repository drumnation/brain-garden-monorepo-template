import chalk from 'chalk';
import type { ProjectRepo } from '@pm-agent/core-db';

export const makeViewCommand = (deps: { projectRepo: ProjectRepo }) => {
  const { projectRepo } = deps;

  return async (projectId: string) => {
    try {
      // Try to parse as number for ID lookup, otherwise search by name/path
      let project;
      const id = parseInt(projectId);
      if (!isNaN(id)) {
        project = await projectRepo.findById(id);
      }

      // If not found by ID, search by path or name
      if (!project) {
        const projects = await projectRepo.list({ search: projectId, limit: 1 });
        if (projects.length > 0) {
          project = projects[0];
        }
      }

      if (!project) {
        console.log(chalk.red(`\n❌ Project not found: ${projectId}`));
        process.exit(1);
      }

      // Display project details
      console.log(chalk.cyan(`\n📁 Project Details: ${chalk.bold(project.name)}`));
      console.log(chalk.gray('─'.repeat(60)));

      // Basic info
      console.log(chalk.white('\n📋 Basic Information:'));
      console.log(`  ID: ${project.id}`);
      console.log(`  Path: ${chalk.gray(project.path)}`);
      console.log(`  Category: ${chalk.blue(project.category || 'none')}`);
      console.log(`  Lifecycle: ${chalk.yellow(project.lifecycle)}`);
      console.log(`  Ownership: ${chalk.magenta(project.ownership)}`);
      console.log(`  Origin: ${project.origin_type}`);
      if (project.paused) {
        console.log(`  Status: ${chalk.red('PAUSED')}`);
        if (project.paused_reason) {
          console.log(`  Paused Reason: ${project.paused_reason}`);
        }
      }

      // Architecture
      console.log(chalk.white('\n🏗️  Architecture:'));
      console.log(`  Brain Folder: ${project.has_brain_folder ? chalk.green('✓') : chalk.gray('✗')}`);
      console.log(`  Tooling Folder: ${project.has_tooling_folder ? chalk.green('✓') : chalk.gray('✗')}`);
      console.log(`  PNPM Monorepo: ${project.is_pnpm_monorepo ? chalk.green('✓') : chalk.gray('✗')}`);
      console.log(`  NPM Monorepo: ${project.is_npm_monorepo ? chalk.green('✓') : chalk.gray('✗')}`);
      console.log(`  Turborepo: ${project.is_turborepo ? chalk.green('✓') : chalk.gray('✗')}`);
      console.log(`  NX Monorepo: ${project.is_nx_monorepo ? chalk.green('✓') : chalk.gray('✗')}`);
      if (project.monorepo_type) {
        console.log(`  Monorepo Type: ${chalk.cyan(project.monorepo_type)}`);
      }

      // Documentation
      console.log(chalk.white('\n📚 Documentation:'));
      console.log(`  PRD: ${project.has_prd ? chalk.green('✓') : chalk.gray('✗')}`);
      console.log(`  Project Overview: ${project.has_project_overview ? chalk.green('✓') : chalk.gray('✗')}`);
      console.log(`  Architecture Docs: ${project.has_architecture_docs ? chalk.green('✓') : chalk.gray('✗')}`);
      console.log(`  BMAD Docs: ${project.has_bmad_docs ? chalk.green('✓') : chalk.gray('✗')}`);
      console.log(`  Cursor Rules: ${project.has_cursor_rules ? chalk.green('✓') : chalk.gray('✗')}`);
      console.log(`  Claude MD: ${project.has_claude_md ? chalk.green('✓') : chalk.gray('✗')}`);

      // Purpose
      if (project.purpose || project.problem_solved) {
        console.log(chalk.white('\n🎯 Purpose:'));
        if (project.purpose) {
          console.log(`  Purpose: ${project.purpose}`);
        }
        if (project.problem_solved) {
          console.log(`  Problem Solved: ${project.problem_solved}`);
        }
      }

      // Real Usage
      console.log(chalk.white('\n📊 Real Usage:'));
      console.log(`  Has Real Data: ${project.has_real_data ? chalk.green('YES') : chalk.gray('NO')}`);
      if (project.data_volume) {
        console.log(`  Data Volume: ${project.data_volume}`);
      }
      console.log(`  Deployed: ${project.deployed ? chalk.green('YES') : chalk.gray('NO')}`);
      if (project.deployed_url) {
        console.log(`  Deployed URL: ${chalk.cyan(project.deployed_url)}`);
      }

      // Version tracking
      console.log(chalk.white('\n🔢 Version:'));
      console.log(`  Current Version: ${project.is_current_version ? chalk.green('YES') : chalk.gray('NO')}`);
      console.log(`  Version Number: ${project.version_number}`);
      if (project.app_family) {
        console.log(`  App Family: ${project.app_family}`);
      }
      if (project.superseded_by) {
        console.log(`  Superseded By: ${chalk.yellow(project.superseded_by)}`);
      }

      // Git Configuration
      if (project.git_origin_url || project.git_upstream_url) {
        console.log(chalk.white('\n🔗 Git Configuration:'));
        if (project.git_origin_url) {
          console.log(`  Origin: ${chalk.gray(project.git_origin_url)}`);
        }
        if (project.git_upstream_url) {
          console.log(`  Upstream: ${chalk.gray(project.git_upstream_url)}`);
        }
        console.log(`  Default Branch: ${project.git_default_branch}`);
      }

      // Timestamps
      console.log(chalk.white('\n📅 Timestamps:'));
      console.log(`  Discovered: ${new Date(project.discovered_at).toLocaleDateString()}`);
      if (project.created_at) {
        console.log(`  Created: ${new Date(project.created_at).toLocaleDateString()}`);
      }
      if (project.last_worked_on) {
        console.log(`  Last Worked On: ${new Date(project.last_worked_on).toLocaleDateString()}`);
      }
      if (project.last_opened) {
        console.log(`  Last Opened: ${new Date(project.last_opened).toLocaleDateString()}`);
      }

      // Contribution info
      if (project.origin_type !== 'created' || project.contribution_level < 100) {
        console.log(chalk.white('\n🤝 Contribution:'));
        console.log(`  Contribution Level: ${project.contribution_level}%`);
        if (project.original_repo_url) {
          console.log(`  Original Repo: ${chalk.gray(project.original_repo_url)}`);
        }
        if (project.forked_from) {
          console.log(`  Forked From: ${project.forked_from}`);
        }
        if (project.became_mine_date) {
          console.log(`  Became Mine: ${new Date(project.became_mine_date).toLocaleDateString()}`);
        }
      }

      // Tags
      if (project.tags) {
        console.log(chalk.white('\n🏷️  Tags:'));
        console.log(`  ${project.tags}`);
      }

      // AI Summary
      if (project.gpt_summary) {
        console.log(chalk.white('\n🤖 AI Summary:'));
        console.log(`  ${project.gpt_summary}`);
        if (project.ai_summary_updated) {
          console.log(chalk.gray(`  Updated: ${new Date(project.ai_summary_updated).toLocaleDateString()}`));
        }
      }

      console.log(chalk.gray('\n' + '─'.repeat(60)));

    } catch (error) {
      console.error(chalk.red('\n❌ Error viewing project:'), error);
      process.exit(1);
    }
  };
};