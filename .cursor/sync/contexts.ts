/**
 * Context Configurations for Rule Generation
 *
 * Defines which scopes map to which output files, allowing
 * the build script to generate multiple context-specific files
 * from the same rule source.
 */

export interface Context {
  name: string;
  outputPath: string;
  scopes: string[];
  description: string;
}

export const contexts: Context[] = [
  {
    name: 'Monorepo Root (Claude)',
    outputPath: 'CLAUDE.md',
    scopes: ['monorepo', 'global'],
    description: 'Monorepo-wide rules and global standards for Claude',
  },
  {
    name: 'Monorepo Root (Agents)',
    outputPath: 'AGENTS.md',
    scopes: ['monorepo', 'global'],
    description: 'Concise, action-oriented format for autonomous agents',
  },
  {
    name: 'Monorepo Root (Gemini)',
    outputPath: 'GEMINI.md',
    scopes: ['monorepo', 'global'],
    description: 'Structured format with decision points for Google Gemini',
  },
  {
    name: 'Monorepo Root (Cline)',
    outputPath: 'CLINE_RULES.md',
    scopes: ['monorepo', 'global'],
    description: 'Single-file format for Cline',
  },
  {
    name: 'Monorepo Root (Windsurf)',
    outputPath: '.windsurfrules',
    scopes: ['monorepo', 'global'],
    description: 'Single-file format for Windsurf',
  },
  // Additional contexts can be added here for apps/packages/tooling
  // Example:
  // {
  //   name: 'Frontend App',
  //   outputPath: 'apps/frontend/CLAUDE.md',
  //   scopes: ['react', 'frontend', 'ui', 'components', 'global'],
  //   description: 'Frontend-specific rules including React and UI patterns',
  // },
];
