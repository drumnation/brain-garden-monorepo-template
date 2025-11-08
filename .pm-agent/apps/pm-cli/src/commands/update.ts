import chalk from 'chalk';
import ora from 'ora';
import type { ProjectRepo, Project } from '@pm-agent/core-db';
import type { ProjectScanner } from '@pm-agent/core-scanner';

export interface UpdateOptions {
  category?: string;
  type?: string;
  lifecycle?: string;
  priority?: string;
  worthResuming?: boolean;
  notes?: string;
  tags?: string;
  rescan?: boolean;
}

export const makeUpdateCommand = (deps: { projectRepo: ProjectRepo; scanner: ProjectScanner }) => {
  const { projectRepo, scanner } = deps;

  return async (projectId: string, options: UpdateOptions) => {
    try {
      // Find the project
      let project;
      const id = parseInt(projectId);
      if (!isNaN(id)) {
        project = await projectRepo.findById(id);
      }

      // If not found by ID, search by name/path
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

      console.log(chalk.cyan(`\n📝 Updating project: ${chalk.bold(project.name)}`));

      // Rescan if requested
      if (options.rescan) {
        const spinner = ora('Rescanning project directory...').start();
        const enriched = await scanner.enrichProject(project.path);
        if (enriched) {
          project = enriched;
          spinner.succeed('Project rescanned and updated');
        } else {
          spinner.fail('Failed to rescan project');
        }
      }

      // Build update object
      const updates: Partial<Project> = {};

      if (options.category) {
        updates.category = options.category as Project['category'];
      }

      if (options.type) {
        updates.type = options.type as Project['type'];
      }

      if (options.lifecycle) {
        updates.lifecycle_state = options.lifecycle as Project['lifecycle_state'];
      }

      if (options.priority) {
        updates.priority = parseInt(options.priority);
      }

      if (options.worthResuming !== undefined) {
        updates.is_worth_resuming = options.worthResuming ? 1 : 0;
      }

      if (options.notes) {
        updates.notes = options.notes;
      }

      if (options.tags) {
        updates.tags = options.tags;
      }

      // Apply updates
      if (Object.keys(updates).length > 0) {
        const spinner = ora('Applying updates...').start();
        const updated = await projectRepo.update(project.id, updates);

        if (updated) {
          spinner.succeed('Project updated successfully');

          // Show what was updated
          console.log(chalk.green('\n✅ Updates applied:'));
          Object.entries(updates).forEach(([key, value]) => {
            console.log(`  ${key}: ${chalk.yellow(value)}`);
          });

          // Show new status
          console.log(chalk.cyan('\n📊 New Status:'));
          console.log(`  Category: ${chalk.blue(updated.category)}`);
          console.log(`  Type: ${chalk.magenta(updated.type)}`);
          console.log(`  Lifecycle: ${chalk.yellow(updated.lifecycle_state)}`);
          console.log(`  Priority: ${updated.priority}/100`);
          console.log(`  Worth Resuming: ${updated.is_worth_resuming ? chalk.green('YES') : chalk.red('NO')}`);

          if (updated.quality_score) {
            const qualityColor =
              updated.quality_score >= 80 ? chalk.green :
              updated.quality_score >= 60 ? chalk.yellow :
              chalk.red;
            console.log(`  Quality Score: ${qualityColor(`${updated.quality_score.toFixed(1)}/100`)}`);
          }

          if (updated.notes) {
            console.log(`  Notes: ${chalk.gray(updated.notes.substring(0, 50))}...`);
          }

          if (updated.tags) {
            console.log(`  Tags: ${chalk.cyan(updated.tags)}`);
          }
        } else {
          spinner.fail('Failed to update project');
        }
      } else {
        console.log(chalk.yellow('\n⚠️  No updates to apply'));
      }

    } catch (error) {
      console.error(chalk.red('\n❌ Error updating project:'), error);
      process.exit(1);
    }
  };
};