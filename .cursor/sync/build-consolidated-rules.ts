#!/usr/bin/env tsx
/**
 * Build Consolidated Rules for AI Platforms
 *
 * Converts Cursor's modular .mdc rule files into:
 * 1. Single-file formats for platforms that need them (.clinerules, .windsurfrules)
 * 2. Hierarchical CLAUDE.md files scoped to specific contexts (monorepo root, apps, packages)
 * 3. Platform-specific formats (GEMINI.md, AGENTS.md)
 *
 * Usage: pnpm tsx .cursor/rules/build-consolidated-rules.ts
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as YAML from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface RuleFrontmatter {
  description?: string;
  globs?: string[];
  alwaysApply?: boolean;
  scopes?: string[]; // NEW: Defines which CLAUDE.md files should include this rule
}

interface RuleFile {
  path: string;
  filename: string;
  frontmatter: RuleFrontmatter;
  content: string;
}

interface ClaudeContext {
  name: string;
  path: string;
  description: string;
  scopes: string[];
}

const RULES_DIR = join(__dirname, '..', 'rules');
const ROOT_DIR = join(__dirname, '..', '..');

// Define all hierarchical contexts (used for Claude, Gemini, and Agents)
const HIERARCHICAL_CONTEXTS: ClaudeContext[] = [
  {
    name: 'Monorepo Root',
    path: join(ROOT_DIR, 'docs/ai-platforms'),
    description: 'Complete development standards for the entire Cannabis Codex monorepo',
    scopes: ['*'] // Special: include ALL rules
  },
  {
    name: 'React/Frontend (Web)',
    path: join(ROOT_DIR, 'apps/web/'),
    description: 'React, Vite, Mantine UI components, and frontend development for Cannabis Codex',
    scopes: ['monorepo', 'global', 'react', 'frontend', 'ui', 'components', 'vite', 'mantine']
  },
  {
    name: 'Express/Backend (Server)',
    path: join(ROOT_DIR, 'apps/server/'),
    description: 'Express.js backend, Cannabis data retrieval and API development',
    scopes: ['monorepo', 'global', 'express', 'backend', 'api', 'node', 'mongodb']
  },
  {
    name: 'Universal Package',
    path: join(ROOT_DIR, 'packages/universal/'),
    description: 'Shared types, utilities, and API client development',
    scopes: ['monorepo', 'global', 'shared']
  },
  {
    name: 'Tooling Packages',
    path: join(ROOT_DIR, 'tooling/'),
    description: 'Shared configurations and build tools (ESLint, Prettier, TypeScript, Brain Monitor)',
    scopes: ['monorepo', 'global', 'tooling', 'node', 'backend']
  }
];

function extractFrontmatter(content: string): { frontmatter: RuleFrontmatter; body: string } {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    return { frontmatter: {}, body: content };
  }

  const [, yamlContent, body] = frontmatterMatch;

  try {
    const parsed = YAML.parse(yamlContent) as RuleFrontmatter;
    // Ensure globs and scopes are always arrays or undefined
    const frontmatter: RuleFrontmatter = {
      description: parsed.description,
      globs: Array.isArray(parsed.globs) ? parsed.globs : undefined,
      alwaysApply: parsed.alwaysApply,
      scopes: Array.isArray(parsed.scopes) ? parsed.scopes : undefined
    };
    return { frontmatter, body };
  } catch (error) {
    console.warn(`Warning: Failed to parse frontmatter, using defaults. Error: ${error}`);
    return { frontmatter: {}, body: content };
  }
}

function loadRuleFiles(): RuleFile[] {
  const files = readdirSync(RULES_DIR)
    .filter(f =>
      f.endsWith('.mdc') &&
      f !== 'master.rules.mdc' &&
      !f.startsWith('_') // Exclude _backup and other _ prefixed files
    )
    .sort();

  return files.map(filename => {
    const path = join(RULES_DIR, filename);
    const content = readFileSync(path, 'utf-8');
    const { frontmatter, body } = extractFrontmatter(content);

    return {
      path,
      filename,
      frontmatter,
      content: body
    };
  });
}

function ruleMatchesScopes(rule: RuleFile, targetScopes: string[]): boolean {
  // Special case: '*' means include ALL rules (for root context)
  if (targetScopes.includes('*')) {
    return true;
  }

  // If rule has no scopes defined, include it everywhere
  if (!rule.frontmatter.scopes || rule.frontmatter.scopes.length === 0) {
    return true;
  }

  // Include rule if it has 'global' scope (applies everywhere)
  if (rule.frontmatter.scopes.includes('global')) {
    return true;
  }

  // Include rule if ANY of its scopes match target scopes (specialized contexts)
  return rule.frontmatter.scopes.some(scope => targetScopes.includes(scope));
}

function buildClaudeMdForContext(context: ClaudeContext, allRules: RuleFile[]): string {
  // Filter rules that apply to this context
  const relevantRules = allRules.filter(rule => ruleMatchesScopes(rule, context.scopes));

  const header = `# ${context.name} - Development Rules

${context.description}

**Generated:** ${new Date().toISOString().split('T')[0]}
**Source:** .cursor/rules/*.mdc (auto-generated from modular rules)
**Context:** ${context.scopes.join(', ')}

---

## Table of Contents

${relevantRules.map((r, i) => {
  const title = r.filename
    .replace('.rules.mdc', '')
    .replace('.mdc', '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return `${i + 1}. [${title}](#${title.toLowerCase().replace(/\s+/g, '-')})`;
}).join('\n')}

---

`;

  const sections = relevantRules.map(rule => {
    const title = rule.filename
      .replace('.rules.mdc', '')
      .replace('.mdc', '')
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const description = rule.frontmatter.description
      ? `> **When to apply:** ${rule.frontmatter.description}\n\n`
      : '';

    const scopeInfo = rule.frontmatter.scopes && rule.frontmatter.scopes.length > 0
      ? `> **Scopes:** ${rule.frontmatter.scopes.join(', ')}\n\n`
      : '';

    return `## ${title}\n\n${description}${scopeInfo}${rule.content}`;
  });

  return header + sections.join('\n\n---\n\n');
}

function buildClinerules(rules: RuleFile[]): string {
  // Cline uses a simpler format - just concatenate with minimal structure
  const header = `Cannabis Codex Monorepo Development Rules
Generated: ${new Date().toISOString().split('T')[0]}
Auto-generated from .cursor/rules/*.mdc - Do not edit directly

`;

  const sections = rules.map(rule => {
    const title = rule.filename.replace('.rules.mdc', '').replace('.mdc', '');
    return `\n## ${title}\n\n${rule.content}`;
  });

  return header + sections.join('\n');
}

function buildWindsurfrules(rules: RuleFile[]): string {
  // Windsurf uses markdown format similar to Cline
  const header = `# Cannabis Codex Monorepo Development Rules

**Generated:** ${new Date().toISOString().split('T')[0]}
**Source:** .cursor/rules/*.mdc (auto-generated, do not edit directly)

---

`;

  const sections = rules.map(rule => {
    const title = rule.filename
      .replace('.rules.mdc', '')
      .replace('.mdc', '')
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return `## ${title}\n\n${rule.content}`;
  });

  return header + sections.join('\n\n---\n\n');
}

function buildGeminiMdForContext(context: ClaudeContext, allRules: RuleFile[]): string {
  // Filter rules that apply to this context
  const relevantRules = allRules.filter(rule => ruleMatchesScopes(rule, context.scopes));

  const header = `# ${context.name} - Development Rules

${context.description}

**Generated:** ${new Date().toISOString().split('T')[0]}
**Source:** .cursor/rules/*.mdc (auto-generated from modular rules)
**Context:** ${context.scopes.join(', ')}

---

`;

  const sections = relevantRules.map(rule => {
    const title = rule.filename
      .replace('.rules.mdc', '')
      .replace('.mdc', '')
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const scope = rule.frontmatter.globs && rule.frontmatter.globs.length > 0
      ? `**Applies to:** \`${rule.frontmatter.globs.join('`, `')}\`\n\n`
      : '';

    const description = rule.frontmatter.description
      ? `**Purpose:** ${rule.frontmatter.description}\n\n`
      : '';

    const scopeInfo = rule.frontmatter.scopes && rule.frontmatter.scopes.length > 0
      ? `**Scopes:** ${rule.frontmatter.scopes.join(', ')}\n\n`
      : '';

    return `## ${title}\n\n${description}${scope}${scopeInfo}${rule.content}`;
  });

  return header + sections.join('\n\n---\n\n');
}

function buildAgentsMdForContext(context: ClaudeContext, allRules: RuleFile[]): string {
  // Filter rules that apply to this context
  const relevantRules = allRules.filter(rule => ruleMatchesScopes(rule, context.scopes));

  const header = `# ${context.name} - Development Rules for AI Agents

${context.description}

**Generated:** ${new Date().toISOString().split('T')[0]}
**Source:** .cursor/rules/*.mdc (auto-generated from modular rules)
**Context:** ${context.scopes.join(', ')}

---

`;

  // Group rules by category
  const coreRules = relevantRules.filter(r => r.frontmatter.alwaysApply);
  const contextualRules = relevantRules.filter(r => !r.frontmatter.alwaysApply);

  const coreSection = coreRules.length > 0 ? `## Core Rules (Always Apply)

${coreRules.map(rule => {
  const title = rule.filename.replace('.rules.mdc', '').replace('.mdc', '');
  return `### ${title}\n\n${rule.content}`;
}).join('\n\n')}

---

` : '';

  const contextualSection = contextualRules.length > 0 ? `## Contextual Rules (Apply When Relevant)

${contextualRules.map(rule => {
  const title = rule.filename.replace('.rules.mdc', '').replace('.mdc', '');
  const globs = (rule.frontmatter.globs && rule.frontmatter.globs.length > 0)
    ? rule.frontmatter.globs.join(', ')
    : 'N/A';
  const scopes = (rule.frontmatter.scopes && rule.frontmatter.scopes.length > 0)
    ? rule.frontmatter.scopes.join(', ')
    : 'N/A';
  return `### ${title}\n**File Patterns:** ${globs}\n**Scopes:** ${scopes}\n\n${rule.content}`;
}).join('\n\n')}` : '';

  return header + coreSection + contextualSection;
}

function main() {
  console.log('🔨 Building consolidated rule files...\n');

  const rules = loadRuleFiles();
  console.log(`📚 Loaded ${rules.length} rule files:\n`);
  rules.forEach(r => console.log(`   - ${r.filename}`));

  // Note: We skip .cursorrules because Cursor reads the .mdc files directly.
  // .cursorrules should be reserved for agent correction instructions or supplemental rules.

  // Build hierarchical files for each context
  console.log('\n📝 Generating hierarchical context files...');
  HIERARCHICAL_CONTEXTS.forEach(context => {
    // Ensure directory exists
    const dir = context.path || ROOT_DIR;
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    // Generate CLAUDE.md
    const claudeMd = buildClaudeMdForContext(context, rules);
    const claudePath = join(context.path, 'CLAUDE.md');
    writeFileSync(claudePath, claudeMd, 'utf-8');

    // Generate GEMINI.md
    const geminiMd = buildGeminiMdForContext(context, rules);
    const geminiPath = join(context.path, 'GEMINI.md');
    writeFileSync(geminiPath, geminiMd, 'utf-8');

    // Generate AGENTS.md
    const agentsMd = buildAgentsMdForContext(context, rules);
    const agentsPath = join(context.path, 'AGENTS.md');
    writeFileSync(agentsPath, agentsMd, 'utf-8');

    const relPath = context.path.replace(ROOT_DIR + '/', '') || 'root';
    console.log(`   ✅ ${context.name}: ${relPath}/ (${claudeMd.length} + ${geminiMd.length} + ${agentsMd.length} chars)`);
  });

  // Build .clinerules (for Cline)
  console.log('\n📝 Generating .clinerules...');
  const clinerules = buildClinerules(rules);
  const aiPlatformsDir = join(ROOT_DIR, 'docs/ai-platforms');
  if (!existsSync(aiPlatformsDir)) {
    mkdirSync(aiPlatformsDir, { recursive: true });
  }
  writeFileSync(join(aiPlatformsDir, '.clinerules'), clinerules, 'utf-8');
  console.log(`   ✅ Written to docs/ai-platforms/.clinerules (${clinerules.length} chars)`);

  // Build .windsurfrules (for Windsurf)
  console.log('\n📝 Generating .windsurfrules...');
  const windsurfrules = buildWindsurfrules(rules);
  writeFileSync(join(aiPlatformsDir, '.windsurfrules'), windsurfrules, 'utf-8');
  console.log(`   ✅ Written to docs/ai-platforms/.windsurfrules (${windsurfrules.length} chars)`);

  // Note: GEMINI.md and AGENTS.md are now generated hierarchically above
  // No need for root-level versions anymore

  console.log('\n✨ Done! All consolidated rule files generated.\n');
  console.log('📄 Generated files:');
  console.log(`   - ${HIERARCHICAL_CONTEXTS.length * 3} hierarchical context files (CLAUDE.md, GEMINI.md, AGENTS.md)`);
  console.log('   - docs/ai-platforms/.clinerules (Cline)');
  console.log('   - docs/ai-platforms/.windsurfrules (Windsurf)\n');
  console.log('📁 Hierarchical structure:');
  HIERARCHICAL_CONTEXTS.forEach(context => {
    const relPath = context.path.replace(ROOT_DIR + '/', '');
    console.log(`   - ${relPath}: CLAUDE.md, GEMINI.md, AGENTS.md`);
  });
  console.log('\nℹ️  Note: .cursorrules is reserved for agent correction instructions.');
  console.log('   Cursor reads .mdc files directly from .cursor/rules/ for better context control.\n');
  console.log('💡 To regenerate after changes:');
  console.log('   pnpm tsx .cursor/sync/build-consolidated-rules.ts\n');
}

main();
