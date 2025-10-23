#!/usr/bin/env tsx
/**
 * Validate Root Documentation Placement
 *
 * Ensures no documentation files exist in the repository root except for:
 * - README.md
 * - CHANGELOG.md
 * - .env.example
 * - Configuration files
 *
 * All other documentation must be under /docs.
 *
 * Usage: pnpm rules:validate-docs
 * Exit codes:
 *   0 = All documentation properly placed
 *   1 = Found prohibited documentation in root
 */

import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = join(__dirname, '..', '..');

// Allowed files in root directory
const ALLOWED_FILES = new Set([
  'README.md',
  'CHANGELOG.md',
  '.env.example',
  'LICENSE',
  'LICENSE.md',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'SECURITY.md'
]);

// Configuration file extensions that are allowed
const CONFIG_EXTENSIONS = new Set([
  '.json',      // package.json, tsconfig.json, etc.
  '.js',        // JavaScript config files
  '.mjs',       // ES module config
  '.cjs',       // CommonJS config
  '.ts',        // TypeScript config
  '.yaml',      // YAML config
  '.yml',       // YAML config
  '.toml',      // TOML config
  '.ini',       // INI config
  '.rc',        // RC files
  ''            // Files with no extension (Dockerfile, Makefile, etc.)
]);

// Files that start with these prefixes are configuration files
const CONFIG_PREFIXES = [
  '.',          // dotfiles (.gitignore, .eslintrc, etc.)
  'Dockerfile',
  'Makefile',
  'turbo',
  'pnpm-',
  'vercel',
  'netlify'
];

// Directories that should be ignored
const IGNORED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '.git',
  '.next',
  '.turbo',
  'coverage',
  '.cache',
  'apps',
  'packages',
  'tooling',
  'docs',       // This is where docs SHOULD be
  '_errors',
  '_logs',
  'worktrees'
]);

interface ValidationResult {
  valid: boolean;
  prohibitedFiles: string[];
  suggestions: Map<string, string>;
}

function isConfigFile(filename: string): boolean {
  // Check if it's a hidden file (starts with .)
  if (filename.startsWith('.')) {
    return true;
  }

  // Check if it matches any config prefix
  if (CONFIG_PREFIXES.some(prefix => filename.startsWith(prefix))) {
    return true;
  }

  // Check if it has a config extension
  const ext = filename.includes('.')
    ? '.' + filename.split('.').pop()!
    : '';

  return CONFIG_EXTENSIONS.has(ext);
}

function isMarkdownFile(filename: string): boolean {
  return filename.endsWith('.md') || filename.endsWith('.markdown');
}

function suggestLocation(filename: string): string {
  const lower = filename.toLowerCase();

  // Common patterns for suggestions
  if (lower.includes('audit') || lower.includes('report')) {
    return '/docs/development/';
  }
  if (lower.includes('env') || lower.includes('setup') || lower.includes('install')) {
    return '/docs/development/';
  }
  if (lower.includes('architecture') || lower.includes('design') || lower.includes('adr')) {
    return '/docs/architecture/';
  }
  if (lower.includes('feature') || lower.includes('spec') || lower.includes('requirement')) {
    return '/docs/features/';
  }
  if (lower.includes('guide') || lower.includes('tutorial') || lower.includes('how-to')) {
    return '/docs/development/';
  }
  if (lower.includes('api') || lower.includes('reference')) {
    return '/docs/architecture/';
  }

  // Default suggestion
  return '/docs/development/';
}

function validateRootDirectory(): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    prohibitedFiles: [],
    suggestions: new Map()
  };

  try {
    const files = readdirSync(ROOT_DIR);

    for (const file of files) {
      const fullPath = join(ROOT_DIR, file);
      const stats = statSync(fullPath);

      // Skip directories
      if (stats.isDirectory()) {
        continue;
      }

      // Skip allowed files
      if (ALLOWED_FILES.has(file)) {
        continue;
      }

      // Skip configuration files
      if (isConfigFile(file)) {
        continue;
      }

      // Check for markdown files (documentation)
      if (isMarkdownFile(file)) {
        result.valid = false;
        result.prohibitedFiles.push(file);
        result.suggestions.set(file, suggestLocation(file));
      }
    }
  } catch (error) {
    console.error('Error reading root directory:', error);
    process.exit(2);
  }

  return result;
}

function printResults(result: ValidationResult): void {
  if (result.valid) {
    console.log('✅ Documentation placement validation passed!');
    console.log('   All documentation files are properly organized.\n');
    return;
  }

  console.error('❌ Documentation placement validation FAILED!\n');
  console.error(`Found ${result.prohibitedFiles.length} prohibited documentation file(s) in repository root:\n`);

  for (const file of result.prohibitedFiles) {
    const suggestion = result.suggestions.get(file) || '/docs/';
    console.error(`   ❌ ${file}`);
    console.error(`      → Move to: ${suggestion}\n`);
  }

  console.error('📖 Documentation Placement Policy:');
  console.error('   Only these files are allowed in the repository root:');
  console.error('   - README.md (project overview)');
  console.error('   - CHANGELOG.md (version history)');
  console.error('   - .env.example (environment template)');
  console.error('   - Configuration files (.gitignore, package.json, etc.)\n');
  console.error('   All other documentation must be placed under /docs:\n');
  console.error('   /docs/architecture/  - System architecture, design decisions');
  console.error('   /docs/features/      - Feature-specific documentation');
  console.error('   /docs/development/   - Development guides, workflows');
  console.error('   /docs/ai-platforms/  - AI platform rules\n');
  console.error('🔧 How to fix:');
  console.error('   1. Move the prohibited files to the suggested locations');
  console.error('   2. Update any references to the old file locations');
  console.error('   3. Run this validation again: pnpm rules:validate-docs\n');
  console.error('📚 See .cursor/rules/00-meta-rules-system.rules.mdc for complete policy.\n');
}

function main() {
  console.log('🔍 Validating documentation placement...\n');

  const result = validateRootDirectory();
  printResults(result);

  // Exit with appropriate code
  process.exit(result.valid ? 0 : 1);
}

main();
