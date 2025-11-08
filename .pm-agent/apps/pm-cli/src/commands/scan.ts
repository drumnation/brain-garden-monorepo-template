import chalk from 'chalk';
import ora from 'ora';
import type { ProjectRepo } from '@pm-agent/core-db';
import type { ProjectScanner } from '@pm-agent/core-scanner';
import { homedir } from 'os';
import { join } from 'path';

export interface ScanOptions {
  path?: string;
  update?: boolean;
  depth?: number;
  dryRun?: boolean;
}

export const makeScanCommand = (deps: { projectRepo: ProjectRepo; scanner: ProjectScanner }) => {
  const { projectRepo, scanner } = deps;

  return async (options: ScanOptions) => {
    try {
      const basePath = options.path || join(homedir(), 'Dev');
      const spinner = ora(`Scanning for projects in ${chalk.blue(basePath)}...`).start();

      // Common paths to exclude from scanning
      const excludePaths = [
        'node_modules',
        '.Trash',
        'Library',
        'Applications',
        'Downloads',
        '.cache',
        '.npm',
        '.pnpm-store',
      ];

      const result = await scanner.scanDirectory({
        basePath,
        excludePaths,
        maxDepth: options.depth || 3,
        updateExisting: options.update || false,
        detectOnly: options.dryRun || false,
      });

      spinner.succeed(`Scan complete! Found ${chalk.green(result.found)} projects`);

      // Display results
      console.log(chalk.cyan('\n📊 Scan Results:'));
      console.log(`  Projects found: ${chalk.bold(result.found)}`);
      if (!options.dryRun) {
        console.log(`  New projects added: ${chalk.green(result.new)}`);
        console.log(`  Existing updated: ${chalk.yellow(result.updated)}`);
      }

      if (result.errors.length > 0) {
        console.log(chalk.red(`\n⚠️  Errors (${result.errors.length}):`));
        result.errors.slice(0, 5).forEach(err => {
          console.log(`  - ${err}`);
        });
        if (result.errors.length > 5) {
          console.log(chalk.gray(`  ... and ${result.errors.length - 5} more`));
        }
      }

      // Show summary of found projects
      if (options.dryRun) {
        console.log(chalk.cyan('\n🔍 Projects Found (dry run - not saved):'));

        const withBrainGarden = result.projects.filter(p => p.hasBrainGarden);
        const monorepos = result.projects.filter(p => p.isMonorepo);
        const withTests = result.projects.filter(p => p.hasTests);

        console.log(`  With Brain Garden: ${chalk.green(withBrainGarden.length)}`);
        console.log(`  Monorepos: ${chalk.blue(monorepos.length)}`);
        console.log(`  With Tests: ${chalk.yellow(withTests.length)}`);

        // List top projects
        console.log(chalk.cyan('\n📁 Sample Projects:'));
        result.projects.slice(0, 10).forEach(project => {
          const badges = [];
          if (project.hasBrainGarden) badges.push(chalk.green('🧠'));
          if (project.isMonorepo) badges.push(chalk.blue('📦'));
          if (project.hasTests) badges.push(chalk.yellow('🧪'));
          if (project.isGitRepo) badges.push(chalk.gray('git'));

          console.log(`  - ${project.name} ${badges.join(' ')}`);
          console.log(chalk.gray(`    ${project.path}`));
        });

        if (result.projects.length > 10) {
          console.log(chalk.gray(`\n  ... and ${result.projects.length - 10} more`));
        }
      } else {
        // Show database stats after update
        const stats = await projectRepo.getStats();
        console.log(chalk.cyan('\n📈 Database Updated:'));
        console.log(`  Total projects: ${chalk.bold(stats.totalProjects)}`);
        console.log(`  With Brain Garden: ${chalk.green(stats.withBrainGarden)}`);
        console.log(`  Monorepos: ${chalk.blue(stats.monorepos)}`);
        console.log(`  Average quality: ${chalk.yellow(stats.averageQuality.toFixed(1))}/100`);
      }

      console.log(chalk.gray(`\nScan completed in ${basePath}`));

    } catch (error) {
      console.error(chalk.red('\n❌ Error scanning projects:'), error);
      process.exit(1);
    }
  };
};