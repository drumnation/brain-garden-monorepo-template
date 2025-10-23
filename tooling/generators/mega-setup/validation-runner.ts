import { execa } from 'execa';
import { readFile, access } from 'fs/promises';
import type { ValidationResult } from './types.js';

export async function validateSetup(): Promise<ValidationResult> {
  console.log('  Running pnpm install...');

  try {
    await execa('pnpm', ['install'], { stdio: 'inherit' });
  } catch (error) {
    console.warn('  Warning: pnpm install had issues');
  }

  console.log('  Running brain:validate...');

  try {
    await execa('pnpm', ['brain:validate'], { stdio: 'inherit' });

    return {
      success: true,
      errors: [],
      warnings: [],
      autoFixed: [],
      summary: 'All validations passed',
    };
  } catch (error) {
    // Validation failed - read summary and attempt fixes
    const summary = await readValidationSummary();

    console.log('  Attempting auto-fixes...');
    const fixed = await attemptAutoFix();

    // Re-run validation
    console.log('  Re-running validation after fixes...');
    try {
      await execa('pnpm', ['brain:validate'], { stdio: 'inherit' });

      return {
        success: true,
        errors: [],
        warnings: summary.warnings || [],
        autoFixed: fixed,
        summary: 'Validation passed after auto-fix',
      };
    } catch {
      return {
        success: false,
        errors: summary.errors || [],
        warnings: summary.warnings || [],
        autoFixed: fixed,
        summary: 'Some validation errors remain - see _errors/ for details',
      };
    }
  }
}

async function readValidationSummary(): Promise<{
  errors: any[];
  warnings: any[];
}> {
  try {
    await access('_errors/validation-summary.md');
    const content = await readFile('_errors/validation-summary.md', 'utf-8');

    // Parse markdown to extract errors (simplified)
    const errors: any[] = [];
    const warnings: any[] = [];

    // Look for error patterns
    const errorMatches = content.match(/❌.*$/gm);
    if (errorMatches) {
      errorMatches.forEach((match) => {
        errors.push({
          type: 'unknown',
          file: '',
          message: match,
        });
      });
    }

    // Look for warning patterns
    const warningMatches = content.match(/⚠️.*$/gm);
    if (warningMatches) {
      warningMatches.forEach((match) => {
        warnings.push({
          type: 'unknown',
          message: match,
        });
      });
    }

    return { errors, warnings };
  } catch {
    return { errors: [], warnings: [] };
  }
}

async function attemptAutoFix(): Promise<string[]> {
  const fixed: string[] = [];

  // Try formatting
  try {
    console.log('    Attempting format fix...');
    await execa('pnpm', ['format', '--write'], { stdio: 'pipe' });
    fixed.push('format');
  } catch {
    // Format fix failed or not needed
  }

  // Try linting with auto-fix
  try {
    console.log('    Attempting lint fix...');
    await execa('pnpm', ['lint', '--fix'], { stdio: 'pipe' });
    fixed.push('lint');
  } catch {
    // Lint fix failed or not needed
  }

  if (fixed.length > 0) {
    console.log(`    ✓ Auto-fixed: ${fixed.join(', ')}`);
  }

  return fixed;
}
