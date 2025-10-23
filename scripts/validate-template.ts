#!/usr/bin/env tsx

/**
 * Template Validation Script
 *
 * Validates that the mega template is complete and functional by checking:
 * 1. Directory structure exists
 * 2. Package.json files have required scripts
 * 3. No individual vitest.config.ts files (except in tooling/testing)
 * 4. All packages have @kit/testing in devDependencies
 * 5. Dependencies install successfully
 * 6. Type checking passes
 * 7. Linting passes
 * 8. Tests pass
 * 9. GitHub Actions workflow exists
 */

import { execa } from 'execa';
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

interface ValidationResult {
  name: string;
  passed: boolean;
  message: string;
  details?: string[];
}

const results: ValidationResult[] = [];

async function checkDirectoryStructure(): Promise<ValidationResult> {
  const requiredDirs = ['apps', 'tooling', 'docs', '.github'];
  const missing: string[] = [];

  for (const dir of requiredDirs) {
    try {
      await fs.access(dir);
    } catch {
      missing.push(dir);
    }
  }

  return {
    name: 'Directory Structure',
    passed: missing.length === 0,
    message: missing.length === 0
      ? 'All required directories exist'
      : `Missing directories: ${missing.join(', ')}`,
    details: missing,
  };
}

async function checkPackageScripts(): Promise<ValidationResult> {
  const requiredScripts = ['test', 'test:unit', 'lint', 'typecheck'];
  const issues: string[] = [];

  // Check all apps
  const appsDir = 'apps';
  try {
    const entries = await fs.readdir(appsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const pkgPath = path.join(appsDir, entry.name, 'package.json');
        try {
          const content = await fs.readFile(pkgPath, 'utf-8');
          const pkg = JSON.parse(content);

          for (const script of requiredScripts) {
            if (!pkg.scripts?.[script]) {
              issues.push(`${entry.name}: missing ${script} script`);
            }
          }
        } catch {
          issues.push(`${entry.name}: package.json not found or invalid`);
        }
      }
    }
  } catch {
    issues.push('Could not read apps directory');
  }

  return {
    name: 'Package Scripts',
    passed: issues.length === 0,
    message: issues.length === 0
      ? 'All packages have required scripts'
      : `Found ${issues.length} issue(s)`,
    details: issues,
  };
}

async function checkNoIndividualVitestConfigs(): Promise<ValidationResult> {
  const vitestConfigs = await glob('apps/*/vitest.config.{ts,js}');
  const packageVitestConfigs = await glob('packages/*/vitest.config.{ts,js}');
  const allConfigs = [...vitestConfigs, ...packageVitestConfigs];

  return {
    name: 'No Individual Vitest Configs',
    passed: allConfigs.length === 0,
    message: allConfigs.length === 0
      ? 'No individual vitest configs found (using centralized configs)'
      : `Found ${allConfigs.length} individual config(s) - should use centralized configs`,
    details: allConfigs,
  };
}

async function checkTestingDependency(): Promise<ValidationResult> {
  const missing: string[] = [];

  // Check all apps
  const appsDir = 'apps';
  try {
    const entries = await fs.readdir(appsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const pkgPath = path.join(appsDir, entry.name, 'package.json');
        try {
          const content = await fs.readFile(pkgPath, 'utf-8');
          const pkg = JSON.parse(content);

          if (!pkg.devDependencies?.['@kit/testing']) {
            missing.push(entry.name);
          }
        } catch {
          // Skip if package.json doesn't exist
        }
      }
    }
  } catch {
    // Apps directory may not exist yet
  }

  return {
    name: '@kit/testing Dependency',
    passed: missing.length === 0,
    message: missing.length === 0
      ? 'All packages have @kit/testing in devDependencies'
      : `Missing @kit/testing: ${missing.join(', ')}`,
    details: missing,
  };
}

async function checkInstall(): Promise<ValidationResult> {
  try {
    await execa('pnpm', ['install'], { stdio: 'pipe' });
    return {
      name: 'Dependency Installation',
      passed: true,
      message: 'Dependencies install successfully',
    };
  } catch (error) {
    return {
      name: 'Dependency Installation',
      passed: false,
      message: 'Failed to install dependencies',
      details: [error instanceof Error ? error.message : String(error)],
    };
  }
}

async function checkTypecheck(): Promise<ValidationResult> {
  try {
    await execa('pnpm', ['typecheck'], { stdio: 'pipe' });
    return {
      name: 'Type Checking',
      passed: true,
      message: 'No type errors found',
    };
  } catch (error) {
    return {
      name: 'Type Checking',
      passed: false,
      message: 'Type errors found',
      details: ['Run `pnpm typecheck` for details'],
    };
  }
}

async function checkLint(): Promise<ValidationResult> {
  try {
    await execa('pnpm', ['lint'], { stdio: 'pipe' });
    return {
      name: 'Linting',
      passed: true,
      message: 'No lint errors found',
    };
  } catch (error) {
    return {
      name: 'Linting',
      passed: false,
      message: 'Lint errors found',
      details: ['Run `pnpm lint` for details'],
    };
  }
}

async function checkTests(): Promise<ValidationResult> {
  try {
    await execa('pnpm', ['test'], { stdio: 'pipe' });
    return {
      name: 'Tests',
      passed: true,
      message: 'All tests passing',
    };
  } catch (error) {
    return {
      name: 'Tests',
      passed: false,
      message: 'Some tests failing',
      details: ['Run `pnpm test` for details'],
    };
  }
}

async function checkGitHubActions(): Promise<ValidationResult> {
  try {
    await fs.access('.github/workflows/validate.yml');
    return {
      name: 'GitHub Actions',
      passed: true,
      message: 'GitHub Actions workflow exists',
    };
  } catch {
    return {
      name: 'GitHub Actions',
      passed: false,
      message: 'GitHub Actions workflow not found',
      details: ['Run `pnpm ci:init` to create it'],
    };
  }
}

function printResults(results: ValidationResult[]) {
  console.log('\n📊 Validation Results\n');
  console.log('═'.repeat(70));

  let passedCount = 0;
  let failedCount = 0;

  for (const result of results) {
    const icon = result.passed ? '✅' : '❌';
    const status = result.passed ? 'PASS' : 'FAIL';

    console.log(`\n${icon} [${status}] ${result.name}`);
    console.log(`   ${result.message}`);

    if (result.details && result.details.length > 0) {
      console.log(`   Details:`);
      for (const detail of result.details.slice(0, 5)) {
        console.log(`     - ${detail}`);
      }
      if (result.details.length > 5) {
        console.log(`     ... and ${result.details.length - 5} more`);
      }
    }

    if (result.passed) {
      passedCount++;
    } else {
      failedCount++;
    }
  }

  console.log('\n' + '═'.repeat(70));
  console.log(`\n📈 Summary: ${passedCount}/${results.length} checks passed\n`);

  if (failedCount === 0) {
    console.log('🎉 Template validation complete! All checks passed.\n');
    return true;
  } else {
    console.log(`⚠️  ${failedCount} check(s) failed. Review the details above.\n`);
    return false;
  }
}

async function main() {
  console.log('\n🔍 Mega Template Validation\n');
  console.log('Running comprehensive validation checks...\n');

  // Run all checks
  results.push(await checkDirectoryStructure());
  results.push(await checkPackageScripts());
  results.push(await checkNoIndividualVitestConfigs());
  results.push(await checkTestingDependency());

  console.log('⏳ Running install, typecheck, lint, and test (this may take a while)...\n');

  results.push(await checkInstall());
  results.push(await checkTypecheck());
  results.push(await checkLint());
  results.push(await checkTests());
  results.push(await checkGitHubActions());

  // Print results
  const allPassed = printResults(results);

  // Write report
  const timestamp = new Date().toISOString();
  const report = `# Template Validation Report

**Generated:** ${timestamp}

## Results

${results.map(r => `- ${r.passed ? '✅' : '❌'} **${r.name}:** ${r.message}`).join('\n')}

## Summary

- **Passed:** ${results.filter(r => r.passed).length}/${results.length}
- **Failed:** ${results.filter(r => !r.passed).length}/${results.length}

${results.filter(r => !r.passed).length === 0
  ? '🎉 **All checks passed!** Template is production-ready.'
  : '⚠️ **Some checks failed.** Review the details above and address the issues.'}

## Failed Checks Details

${results
  .filter(r => !r.passed)
  .map(r => `### ${r.name}\n\n${r.message}\n\n${r.details ? r.details.map(d => `- ${d}`).join('\n') : ''}`)
  .join('\n\n')}
`;

  await fs.writeFile('VALIDATION_REPORT.md', report);
  console.log('📄 Full report written to VALIDATION_REPORT.md\n');

  process.exit(allPassed ? 0 : 1);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
