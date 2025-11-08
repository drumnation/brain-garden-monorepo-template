#!/usr/bin/env tsx
/**
 * pm-list command
 * Lists projects from the database with filtering options
 */

import { program } from 'commander';
import chalk from 'chalk';
import { table } from 'table';
import { makeDbClient, makeProjectRepo } from '@pm-agent/core-db';

const PM_AGENT_DB = '/Users/dmieloch/Dev/.pm-agent/db/pm-agent.db';

async function main() {
  program
    .name('pm-list')
    .description('List projects from the PM Agent database')
    .option('-l, --lifecycle <status>', 'Filter by lifecycle (discovered, building, using, paused, abandoned)')
    .option('-c, --category <category>', 'Filter by category (app, tool, learning, work, experimental)')
    .option('-o, --ownership <ownership>', 'Filter by ownership (mine, exploring, customized-fork)')
    .option('--brain', 'Only show projects with Brain Garden')
    .option('--claude', 'Only show projects with Claude rules')
    .option('--cursor', 'Only show projects with Cursor rules')
    .option('--monorepo', 'Only show monorepos')
    .option('--deployed', 'Only show deployed projects')
    .option('-n, --limit <number>', 'Limit results', '50')
    .option('--sort <field>', 'Sort by field (name, lifecycle, last_worked_on, discovered_at)', 'last_worked_on')
    .option('--asc', 'Sort ascending (default is descending)')
    .option('--full', 'Show full paths instead of names')
    .parse();

  const options = program.opts();

  try {
    // Initialize database client
    const db = await makeDbClient({ dbPath: PM_AGENT_DB, readonly: true });
    const projectRepo = makeProjectRepo({ db });

    // Build filter
    const filter: any = {
      limit: parseInt(options.limit),
      sortOrder: options.asc ? 'asc' : 'desc',
    };

    if (options.lifecycle) {
      filter.lifecycle = options.lifecycle;
    }

    if (options.category) {
      filter.category = options.category;
    }

    if (options.ownership) {
      filter.ownership = options.ownership;
    }

    if (options.brain) {
      filter.hasBrainFolder = true;
    }

    if (options.claude) {
      filter.hasClaudeMd = true;
    }

    if (options.cursor) {
      filter.hasCursorRules = true;
    }

    if (options.monorepo) {
      filter.isPnpmMonorepo = true;
    }

    if (options.deployed) {
      filter.deployed = true;
    }

    // Map sort field
    const sortMap: Record<string, string> = {
      name: 'name',
      lifecycle: 'lifecycle',
      activity: 'last_worked_on',
      last_worked_on: 'last_worked_on',
      discovered_at: 'discovered_at',
    };
    filter.sortBy = sortMap[options.sort] || 'last_worked_on';

    // Fetch projects
    const projects = await projectRepo.findAll(filter);
    const totalCount = await projectRepo.count();
    const filteredCount = await projectRepo.count({
      lifecycle: filter.lifecycle,
      category: filter.category,
      ownership: filter.ownership,
      hasBrainFolder: filter.hasBrainFolder,
      hasClaudeMd: filter.hasClaudeMd,
    });

    if (projects.length === 0) {
      console.log(chalk.yellow('No projects found matching criteria.'));
      db.close();
      return;
    }

    // Prepare table data
    const tableData: string[][] = [
      [
        chalk.bold('Name'),
        chalk.bold('Category'),
        chalk.bold('Lifecycle'),
        chalk.bold('Ownership'),
        chalk.bold('Last Worked'),
        chalk.bold('Features'),
      ],
    ];

    for (const project of projects) {
      const features = [];
      if (project.has_brain_folder) features.push('🧠');
      if (project.has_claude_md) features.push('🤖');
      if (project.has_cursor_rules) features.push('💻');
      if (project.deployed) features.push('🚀');
      if (project.is_turborepo) features.push('🔄');

      const name = options.full ? project.path : project.name;

      // Parse tags
      let techStack = '';
      try {
        if (project.tags) {
          const tags = JSON.parse(project.tags);
          techStack = Array.isArray(tags) ? tags.slice(0, 2).join(', ') : '';
        }
      } catch {
        // Invalid JSON
      }

      const lifecycle = project.lifecycle || 'unknown';
      const lifecycleColor =
        lifecycle === 'using' ? chalk.green(lifecycle) :
        lifecycle === 'building' ? chalk.yellow(lifecycle) :
        lifecycle === 'paused' ? chalk.gray(lifecycle) :
        lifecycle === 'abandoned' ? chalk.red(lifecycle) :
        chalk.white(lifecycle);

      const lastWorked = project.last_worked_on ?
        new Date(project.last_worked_on).toLocaleDateString() :
        '-';

      tableData.push([
        chalk.cyan(name),
        project.category || '-',
        lifecycleColor,
        project.ownership || '-',
        lastWorked,
        features.join(' '),
      ]);
    }

    // Display table
    console.log('\n' + chalk.blue('📋 PM Agent Projects'));
    console.log(chalk.gray(`Showing ${projects.length} of ${filteredCount} filtered (${totalCount} total)\n`));

    const output = table(tableData, {
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
        joinJoin: '┼'
      },
    });

    console.log(output);

    // Show stats
    const usingCount = projects.filter(p => p.lifecycle === 'using').length;
    const buildingCount = projects.filter(p => p.lifecycle === 'building').length;
    const withBrainGarden = projects.filter(p => p.has_brain_folder).length;
    const deployedCount = projects.filter(p => p.deployed).length;

    console.log(chalk.blue('📊 Summary:'));
    console.log(`  ${chalk.gray('Using:')} ${usingCount}/${projects.length}`);
    console.log(`  ${chalk.gray('Building:')} ${buildingCount}/${projects.length}`);
    console.log(`  ${chalk.gray('Deployed:')} ${deployedCount}/${projects.length}`);
    console.log(`  ${chalk.gray('With Brain Garden:')} ${withBrainGarden}/${projects.length}`);

    // Close database
    db.close();

    console.log('\n' + chalk.gray('Use "pm-view <project>" to see project details'));
  } catch (error) {
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

main();