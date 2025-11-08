#!/usr/bin/env tsx

import { Command } from 'commander';
import chalk from 'chalk';
import { join } from 'path';
import { homedir } from 'os';
import { makeDbClient, makeProjectRepo } from '@pm-agent/core-db';
import { makeProjectScanner } from '@pm-agent/core-scanner';
import { makeListCommand } from './commands/list.js';
import { makeViewCommand } from './commands/view.js';
import { makeScanCommand } from './commands/scan.js';
import { makeUpdateCommand } from './commands/update.js';

// Database path
const DB_PATH = join(homedir(), 'Dev', '.pm-agent', 'db', 'pm-agent.db');

async function main() {
  const program = new Command();

  // Create dependencies (Composition Root)
  const dbClient = await makeDbClient({ dbPath: DB_PATH });
  const projectRepo = makeProjectRepo({ db: dbClient });
  const scanner = makeProjectScanner({ projectRepo });

  // Wire up commands with dependencies
  const listCommand = makeListCommand({ projectRepo });
  const viewCommand = makeViewCommand({ projectRepo });
  const scanCommand = makeScanCommand({ projectRepo, scanner });
  const updateCommand = makeUpdateCommand({ projectRepo, scanner });

  // Configure CLI
  program
    .name('pm')
    .description('PM Agent - Project Motivation System CLI')
    .version('1.0.0');

  // List command
  program
    .command('list')
    .alias('ls')
    .description('List projects with filters')
    .option('-c, --category <category>', 'Filter by category (app, tool, learning, work, experimental)')
    .option('-l, --lifecycle <state>', 'Filter by lifecycle (discovered, building, using, reference, paused, abandoned)')
    .option('-o, --ownership <type>', 'Filter by ownership (mine, exploring, customized-fork, abandoned-clone)')
    .option('-b, --brain-folder', 'Show only projects with Brain folder')
    .option('--pnpm-monorepo', 'Show only PNPM monorepo projects')
    .option('--npm-monorepo', 'Show only NPM monorepo projects')
    .option('-p, --paused', 'Show only paused projects')
    .option('-d, --deployed', 'Show only deployed projects')
    .option('--current-version', 'Show only current version projects')
    .option('-s, --search <term>', 'Search in name, path, purpose, problem_solved, tags')
    .option('--sort <field:order>', 'Sort by field:order (e.g., last_worked_on:desc)')
    .option('--limit <n>', 'Limit results', parseInt)
    .option('--stats', 'Show statistics instead of list')
    .action(async (options) => {
      await listCommand(options);
      dbClient.close();
    });

  // View command
  program
    .command('view <projectId>')
    .alias('show')
    .description('View detailed project information')
    .action(async (projectId) => {
      await viewCommand(projectId);
      dbClient.close();
    });

  // Scan command
  program
    .command('scan')
    .description('Scan for projects and update database')
    .option('-p, --path <path>', 'Base path to scan (default: ~/Dev)')
    .option('-u, --update', 'Update existing projects')
    .option('-d, --depth <n>', 'Max directory depth to scan', parseInt)
    .option('--dry-run', 'Show what would be found without saving')
    .action(async (options) => {
      await scanCommand(options);
      dbClient.close();
    });

  // Update command
  program
    .command('update <projectId>')
    .description('Update project metadata')
    .option('-c, --category <category>', 'Set category')
    .option('-t, --type <type>', 'Set type')
    .option('-l, --lifecycle <state>', 'Set lifecycle state')
    .option('-p, --priority <n>', 'Set priority (0-100)')
    .option('-w, --worth-resuming', 'Mark as worth resuming')
    .option('--not-worth-resuming', 'Mark as not worth resuming')
    .option('-n, --notes <text>', 'Add/update notes')
    .option('--tags <tags>', 'Set tags (comma-separated)')
    .option('-r, --rescan', 'Rescan project directory first')
    .action(async (projectId, options) => {
      // Handle the worth-resuming boolean logic
      if (options.notWorthResuming) {
        options.worthResuming = false;
      }
      await updateCommand(projectId, options);
      dbClient.close();
    });

  // Stats command (alias for list --stats)
  program
    .command('stats')
    .description('Show project statistics')
    .action(async () => {
      await listCommand({ stats: true });
      dbClient.close();
    });

  // Parse arguments
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    console.error(chalk.red('Error:'), error);
    dbClient.close();
    process.exit(1);
  }
}

// Run the CLI
main().catch(error => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});