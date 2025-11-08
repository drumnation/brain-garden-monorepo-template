#!/usr/bin/env tsx
/**
 * Build and Verify Consolidated Rules
 *
 * Wrapper script that runs both build and verification in sequence.
 * Used by rules:watch to ensure changes are validated automatically.
 *
 * Usage: tsx .cursor/sync/build-consolidated-rules-and-verify.ts
 */

import { spawnSync } from 'child_process';
import { join } from 'path';

const ROOT_DIR = join(__dirname, '..', '..');

function runCommand(command: string, args: string[]): boolean {
  const result = spawnSync(command, args, {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    shell: true
  });

  return result.status === 0;
}

function main() {
  console.log('🔨 Running build and verification...\n');

  // Step 1: Build
  const buildSuccess = runCommand('tsx', ['.cursor/sync/build-consolidated-rules.ts']);

  if (!buildSuccess) {
    console.error('\n❌ Build failed - skipping verification');
    process.exit(1);
  }

  // Step 2: Verify
  console.log('\n🔍 Running verification...\n');
  const verifySuccess = runCommand('tsx', ['scripts/verify-rule-distribution.ts']);

  if (!verifySuccess) {
    console.warn('\n⚠️  Verification detected issues (see output above)');
    // Don't exit with error in watch mode - just warn
  } else {
    console.log('\n✅ Build and verification completed successfully!');
  }
}

main();
