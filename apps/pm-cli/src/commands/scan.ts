#!/usr/bin/env tsx
/**
 * pm-scan command
 * Scans the Dev directory for projects and populates the database
 */

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { makeDbClient, makeProjectRepo } from '@pm-agent/core-db';
import { makeScannerService } from '@pm-agent/core-scanner';

const PM_AGENT_DB = '/Users/dmieloch/Dev/.pm-agent/db/pm-agent.db';
const DEV_ROOT = '/Users/dmieloch/Dev';

async function main() {
  program
    .name('pm-scan')
    .description('Scan for projects and update the PM Agent database')
    .option('-p, --path <path>', 'Root path to scan', DEV_ROOT)
    .option('-d, --depth <number>', 'Maximum depth to scan', '3')
    .option('--dry-run', 'Scan without updating database')
    .parse();

  const options = program.opts();
  const spinner = ora();

  try {
    console.log(chalk.blue('🔍 PM Agent Scanner'));
    console.log(chalk.gray(`Database: ${PM_AGENT_DB}`));
    console.log(chalk.gray(`Scanning: ${options.path}\n`));

    // Initialize database client
    spinner.start('Connecting to database...');
    const db = await makeDbClient({ dbPath: PM_AGENT_DB });
    const projectRepo = makeProjectRepo({ db });
    const scannerService = makeScannerService({ projectRepo });
    spinner.succeed('Connected to database');

    // Perform scan
    spinner.start('Scanning for projects...');

    if (options.dryRun) {
      // Dry run - just scan without persisting
      const projects = await scannerService.scanDirectory({
        rootPath: options.path,
        maxDepth: parseInt(options.depth),
        ignorePatterns: [
          'legacy-projects',
          'archive',
          'backup',
          'temp',
          'tmp',
          '.Trash',
        ],
      });

      spinner.succeed(`Found ${projects.length} projects (dry run)`);

      console.log('\n' + chalk.yellow('Projects found:'));
      for (const project of projects) {
        const techStack = project.signals.techStack.join(', ') || 'unknown';
        console.log(`  ${chalk.green('•')} ${project.name}`);
        console.log(`    ${chalk.gray('Path:')} ${project.path}`);
        console.log(`    ${chalk.gray('Type:')} ${project.signals.projectType}`);
        console.log(`    ${chalk.gray('Stack:')} ${techStack}`);
        console.log(`    ${chalk.gray('Size:')} ${project.sizeMb}MB`);

        const features = [];
        if (project.signals.hasBrainGarden) features.push('🧠 Brain Garden');
        if (project.signals.hasClaudeRules) features.push('🤖 Claude Rules');
        if (project.signals.hasTests) features.push('🧪 Tests');
        if (project.signals.hasCI) features.push('⚡ CI/CD');
        if (features.length > 0) {
          console.log(`    ${chalk.gray('Features:')} ${features.join(', ')}`);
        }
        console.log();
      }
    } else {
      // Real scan with persistence
      const result = await scannerService.scanAndPersist({
        rootPath: options.path,
        maxDepth: parseInt(options.depth),
        ignorePatterns: [
          'legacy-projects',
          'archive',
          'backup',
          'temp',
          'tmp',
          '.Trash',
        ],
      });

      spinner.succeed('Scan complete');

      // Display results
      console.log('\n' + chalk.green('✅ Scan Results:'));
      console.log(`  ${chalk.blue('Projects found:')} ${result.projectsFound}`);
      console.log(`  ${chalk.green('New projects:')} ${result.projectsAdded}`);
      console.log(`  ${chalk.yellow('Updated projects:')} ${result.projectsUpdated}`);

      if (result.errors.length > 0) {
        console.log(`  ${chalk.red('Errors:')} ${result.errors.length}`);
        for (const error of result.errors) {
          console.log(`    ${chalk.red('•')} ${error}`);
        }
      }

      // Show summary stats
      const totalCount = await projectRepo.count();
      const activeCount = await projectRepo.count({ lifecycle: 'using' });
      const withBrainGarden = await projectRepo.count({ hasBrainFolder: true });

      console.log('\n' + chalk.blue('📊 Database Statistics:'));
      console.log(`  ${chalk.gray('Total projects:')} ${totalCount}`);
      console.log(`  ${chalk.gray('Active projects:')} ${activeCount}`);
      console.log(`  ${chalk.gray('With Brain Garden:')} ${withBrainGarden}`);
    }

    // Close database
    db.close();

    console.log('\n' + chalk.green('✨ Done!'));
    console.log(chalk.gray('Use "pm-list" to view projects'));
    console.log(chalk.gray('Use "pm-view <project>" to see project details'));
  } catch (error) {
    spinner.fail('Scan failed');
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

main();