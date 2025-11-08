import chalk from 'chalk';
import { table } from 'table';
import type { ProjectRepo, ProjectListFilters } from '@pm-agent/core-db';

export interface ListOptions {
  category?: string;
  lifecycle?: string;
  ownership?: string;
  brainFolder?: boolean;
  pnpmMonorepo?: boolean;
  npmMonorepo?: boolean;
  paused?: boolean;
  deployed?: boolean;
  currentVersion?: boolean;
  search?: string;
  limit?: number;
  sort?: string;
  stats?: boolean;
}

export const makeListCommand = (deps: { projectRepo: ProjectRepo }) => {
  const { projectRepo } = deps;

  return async (options: ListOptions) => {
    try {
      // Show stats if requested
      if (options.stats) {
        const stats = await projectRepo.getStats();
        console.log(chalk.cyan('\n📊 Project Statistics:'));
        console.log(chalk.white(`  Total Projects: ${chalk.bold(stats.totalProjects)}`));
        console.log(chalk.white(`  Active Projects: ${chalk.bold(stats.activeProjects)}`));
        console.log(chalk.white(`  With Brain Folder: ${chalk.bold(stats.withBrainFolder)}`));
        console.log(chalk.white(`  PNPM Monorepos: ${chalk.bold(stats.pnpmMonorepos)}`));
        console.log(chalk.white(`  NPM Monorepos: ${chalk.bold(stats.npmMonorepos)}`));
        console.log(chalk.white(`  Deployed: ${chalk.bold(stats.deployed)}`));
        console.log(chalk.white(`  Paused: ${chalk.bold(stats.paused)}`));

        console.log(chalk.cyan('\n  By Category:'));
        Object.entries(stats.projectsByCategory).forEach(([cat, count]) => {
          console.log(`    ${cat}: ${count}`);
        });

        console.log(chalk.cyan('\n  By Lifecycle:'));
        Object.entries(stats.projectsByLifecycle).forEach(([state, count]) => {
          console.log(`    ${state}: ${count}`);
        });

        console.log(chalk.cyan('\n  By Ownership:'));
        Object.entries(stats.projectsByOwnership).forEach(([ownership, count]) => {
          console.log(`    ${ownership}: ${count}`);
        });

        return;
      }

      // Build filters
      const filters: ProjectListFilters = {
        category: options.category,
        lifecycle: options.lifecycle,
        ownership: options.ownership,
        hasBrainFolder: options.brainFolder,
        isPnpmMonorepo: options.pnpmMonorepo,
        isNpmMonorepo: options.npmMonorepo,
        paused: options.paused,
        deployed: options.deployed,
        isCurrentVersion: options.currentVersion,
        search: options.search,
        limit: options.limit || 50,
      };

      // Parse sort option
      if (options.sort) {
        const [field, order] = options.sort.split(':');
        filters.sortBy = field as any;
        filters.sortOrder = (order as 'asc' | 'desc') || 'desc';
      }

      // Fetch projects
      const projects = await projectRepo.list(filters);

      if (projects.length === 0) {
        console.log(chalk.yellow('\n⚠️  No projects found matching your criteria.'));
        return;
      }

      // Format for table display
      const tableData = [
        [
          chalk.cyan('ID'),
          chalk.cyan('Name'),
          chalk.cyan('Category'),
          chalk.cyan('Lifecycle'),
          chalk.cyan('Ownership'),
          chalk.cyan('Brain'),
          chalk.cyan('Mono'),
          chalk.cyan('Deploy'),
        ],
      ];

      projects.forEach(project => {
        const lifecycleColor =
          project.lifecycle === 'using' ? chalk.green :
          project.lifecycle === 'building' ? chalk.yellow :
          project.lifecycle === 'paused' ? chalk.gray :
          project.lifecycle === 'abandoned' ? chalk.red :
          chalk.white;

        const monoType = project.is_pnpm_monorepo ? 'pnpm' :
                        project.is_npm_monorepo ? 'npm' :
                        project.is_turborepo ? 'turbo' :
                        project.is_nx_monorepo ? 'nx' :
                        '-';

        tableData.push([
          chalk.gray(project.id.toString()),
          chalk.white(project.name.substring(0, 30)),
          chalk.blue(project.category || '-'),
          lifecycleColor(project.lifecycle),
          chalk.magenta(project.ownership),
          project.has_brain_folder ? chalk.green('✓') : chalk.gray('-'),
          monoType !== '-' ? chalk.cyan(monoType) : chalk.gray('-'),
          project.deployed ? chalk.green('✓') : chalk.gray('-'),
        ]);
      });

      const tableOutput = table(tableData, {
        border: {
          topBody: '─',
          topJoin: '┬',
          topLeft: '┌',
          topRight: '┐',
          bottomBody: '─',
          bottomJoin: '┴',
          bottomLeft: '└',
          bottomRight: '┘',
          bodyLeft: '│',
          bodyRight: '│',
          bodyJoin: '│',
          joinBody: '─',
          joinLeft: '├',
          joinRight: '┤',
          joinJoin: '┼',
        },
      });

      console.log('\n' + tableOutput);
      console.log(chalk.gray(`\n  Showing ${projects.length} projects`));

    } catch (error) {
      console.error(chalk.red('\n❌ Error listing projects:'), error);
      process.exit(1);
    }
  };
};