import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import glob from 'fast-glob';

export interface PackageAnalysis {
  description: string | null;
  techStack: string[];
  category: string | null;
  tags: string[];
  monorepoType: string | null;
  hasPackageJson: boolean;
  isPnpmMonorepo: boolean;
  isNpmMonorepo: boolean;
  isTurborepo: boolean;
  isNxMonorepo: boolean;
}

/**
 * Analyze package.json and project structure for metadata
 * Pure function following functional pattern
 */
export const analyzePackageJson = async (projectPath: string): Promise<PackageAnalysis> => {
  const result: PackageAnalysis = {
    description: null,
    techStack: [],
    category: null,
    tags: [],
    monorepoType: null,
    hasPackageJson: false,
    isPnpmMonorepo: false,
    isNpmMonorepo: false,
    isTurborepo: false,
    isNxMonorepo: false,
  };

  const packageJsonPath = join(projectPath, 'package.json');
  if (!existsSync(packageJsonPath)) {
    return result;
  }

  result.hasPackageJson = true;

  try {
    const content = await readFile(packageJsonPath, 'utf-8');
    const pkg = JSON.parse(content);

    // Extract description
    result.description = pkg.description || null;

    // Detect tech stack from dependencies
    result.techStack = await detectTechStack(pkg, projectPath);

    // Auto-categorize based on package content and name
    result.category = categorizeProject(pkg, projectPath);

    // Generate tags based on tech stack and structure
    result.tags = generateTags(pkg, result.techStack, projectPath);

    // Detect monorepo type
    const monorepoInfo = await detectMonorepoType(pkg, projectPath);
    result.monorepoType = monorepoInfo.type;
    result.isPnpmMonorepo = monorepoInfo.isPnpm;
    result.isNpmMonorepo = monorepoInfo.isNpm;
    result.isTurborepo = monorepoInfo.isTurbo;
    result.isNxMonorepo = monorepoInfo.isNx;

    return result;
  } catch (error) {
    console.error(`Error analyzing package.json at ${packageJsonPath}:`, error);
    return result;
  }
};

/**
 * Detect technology stack from dependencies
 */
const detectTechStack = async (pkg: any, projectPath: string): Promise<string[]> => {
  const stack: Set<string> = new Set();
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
  };

  // Frontend frameworks
  if (allDeps['react'] || allDeps['react-dom']) stack.add('React');
  if (allDeps['vue']) stack.add('Vue');
  if (allDeps['@angular/core']) stack.add('Angular');
  if (allDeps['svelte']) stack.add('Svelte');
  if (allDeps['solid-js']) stack.add('SolidJS');

  // Meta-frameworks
  if (allDeps['next']) stack.add('Next.js');
  if (allDeps['nuxt'] || allDeps['nuxt3']) stack.add('Nuxt');
  if (allDeps['gatsby']) stack.add('Gatsby');
  if (allDeps['@remix-run/react']) stack.add('Remix');
  if (allDeps['astro']) stack.add('Astro');

  // Backend frameworks
  if (allDeps['express']) stack.add('Express');
  if (allDeps['fastify']) stack.add('Fastify');
  if (allDeps['koa']) stack.add('Koa');
  if (allDeps['@nestjs/core']) stack.add('NestJS');
  if (allDeps['hapi'] || allDeps['@hapi/hapi']) stack.add('Hapi');

  // Desktop/Mobile
  if (allDeps['electron']) stack.add('Electron');
  if (allDeps['react-native']) stack.add('React Native');
  if (allDeps['@capacitor/core']) stack.add('Capacitor');
  if (allDeps['@tauri-apps/api']) stack.add('Tauri');

  // State management
  if (allDeps['redux'] || allDeps['@reduxjs/toolkit']) stack.add('Redux');
  if (allDeps['mobx']) stack.add('MobX');
  if (allDeps['zustand']) stack.add('Zustand');
  if (allDeps['recoil']) stack.add('Recoil');
  if (allDeps['valtio']) stack.add('Valtio');
  if (allDeps['jotai']) stack.add('Jotai');

  // UI libraries
  if (allDeps['@mui/material']) stack.add('Material-UI');
  if (allDeps['antd']) stack.add('Ant Design');
  if (allDeps['@chakra-ui/react']) stack.add('Chakra UI');
  if (allDeps['tailwindcss']) stack.add('Tailwind CSS');
  if (allDeps['bootstrap']) stack.add('Bootstrap');

  // Database/ORM
  if (allDeps['prisma'] || allDeps['@prisma/client']) stack.add('Prisma');
  if (allDeps['typeorm']) stack.add('TypeORM');
  if (allDeps['sequelize']) stack.add('Sequelize');
  if (allDeps['mongoose']) stack.add('Mongoose');
  if (allDeps['knex']) stack.add('Knex');
  if (allDeps['better-sqlite3'] || allDeps['sqlite3']) stack.add('SQLite');
  if (allDeps['pg']) stack.add('PostgreSQL');
  if (allDeps['mysql'] || allDeps['mysql2']) stack.add('MySQL');

  // Testing
  if (allDeps['jest']) stack.add('Jest');
  if (allDeps['vitest']) stack.add('Vitest');
  if (allDeps['mocha']) stack.add('Mocha');
  if (allDeps['@playwright/test']) stack.add('Playwright');
  if (allDeps['cypress']) stack.add('Cypress');

  // Build tools
  if (allDeps['vite']) stack.add('Vite');
  if (allDeps['webpack']) stack.add('Webpack');
  if (allDeps['esbuild']) stack.add('esbuild');
  if (allDeps['rollup']) stack.add('Rollup');
  if (allDeps['parcel']) stack.add('Parcel');

  // Languages/Runtimes
  if (allDeps['typescript']) stack.add('TypeScript');
  if (existsSync(join(projectPath, 'tsconfig.json'))) stack.add('TypeScript');

  // GraphQL
  if (allDeps['graphql']) stack.add('GraphQL');
  if (allDeps['apollo-server'] || allDeps['@apollo/client']) stack.add('Apollo');

  // AI/ML
  if (allDeps['openai']) stack.add('OpenAI');
  if (allDeps['langchain']) stack.add('LangChain');
  if (allDeps['@anthropic-ai/sdk']) stack.add('Claude');
  if (allDeps['@tensorflow/tfjs']) stack.add('TensorFlow.js');

  return Array.from(stack);
};

/**
 * Categorize project based on indicators
 */
const categorizeProject = (pkg: any, projectPath: string): string | null => {
  const name = pkg.name || '';
  const path = projectPath.toLowerCase();

  // Check path-based categories
  if (path.includes('/experiments/') || path.includes('/playground/')) return 'experimental';
  if (path.includes('/learning/') || path.includes('/tutorial/')) return 'learning';
  if (path.includes('/work/') || path.includes('/client/')) return 'work';
  if (path.includes('/template/') || path.includes('/boilerplate/')) return 'tool';
  if (path.includes('/archive/')) return 'archived';

  // Check name-based categories
  if (name.includes('template') || name.includes('boilerplate')) return 'tool';
  if (name.includes('cli') || name.includes('tool') || name.includes('util')) return 'tool';
  if (name.includes('app') || name.includes('web')) return 'app';
  if (name.includes('api') || name.includes('server')) return 'app';
  if (name.includes('lib') || name.includes('package')) return 'tool';

  // Check by scripts
  const scripts = pkg.scripts || {};
  if (scripts.start || scripts.dev || scripts.serve) return 'app';
  if (scripts.build && !scripts.start) return 'tool';

  // Check by dependencies
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  if (deps['express'] || deps['fastify'] || deps['koa']) return 'app';
  if (deps['next'] || deps['react'] || deps['vue']) return 'app';
  if (deps['electron']) return 'app';

  return 'experimental'; // Default category
};

/**
 * Generate tags based on project characteristics
 */
const generateTags = (pkg: any, techStack: string[], projectPath: string): string[] => {
  const tags = new Set<string>();

  // Add main framework tags
  if (techStack.includes('React')) tags.add('react');
  if (techStack.includes('Next.js')) tags.add('nextjs');
  if (techStack.includes('Vue')) tags.add('vue');
  if (techStack.includes('Angular')) tags.add('angular');
  if (techStack.includes('Express')) tags.add('express');
  if (techStack.includes('NestJS')) tags.add('nestjs');
  if (techStack.includes('Electron')) tags.add('electron');

  // Add language tags
  if (techStack.includes('TypeScript')) tags.add('typescript');
  else tags.add('javascript');

  // Add category tags
  if (techStack.includes('GraphQL')) tags.add('graphql');
  if (techStack.includes('Prisma') || techStack.includes('TypeORM')) tags.add('database');
  if (techStack.includes('Jest') || techStack.includes('Vitest')) tags.add('tested');

  // Add AI tags
  if (techStack.includes('OpenAI') || techStack.includes('Claude') || techStack.includes('LangChain')) {
    tags.add('ai');
  }

  // Check for Brain Garden
  if (existsSync(join(projectPath, '.claude')) || existsSync(join(projectPath, '.brain'))) {
    tags.add('brain-garden');
  }

  // Check for monorepo
  if (pkg.workspaces) tags.add('monorepo');
  if (existsSync(join(projectPath, 'pnpm-workspace.yaml'))) tags.add('pnpm');

  // Check for full-stack
  const hasBackend = techStack.some(t => ['Express', 'Fastify', 'NestJS', 'Koa'].includes(t));
  const hasFrontend = techStack.some(t => ['React', 'Vue', 'Angular', 'Next.js'].includes(t));
  if (hasBackend && hasFrontend) tags.add('fullstack');

  return Array.from(tags);
};

/**
 * Detect monorepo type and configuration
 */
const detectMonorepoType = async (
  pkg: any,
  projectPath: string
): Promise<{
  type: string | null;
  isPnpm: boolean;
  isNpm: boolean;
  isTurbo: boolean;
  isNx: boolean;
}> => {
  const result = {
    type: null as string | null,
    isPnpm: false,
    isNpm: false,
    isTurbo: false,
    isNx: false,
  };

  // Check for pnpm workspace
  if (existsSync(join(projectPath, 'pnpm-workspace.yaml'))) {
    result.isPnpm = true;
    result.type = 'pnpm';
  }

  // Check for npm/yarn workspaces
  if (pkg.workspaces) {
    result.isNpm = true;
    if (!result.type) result.type = 'npm';
  }

  // Check for Turborepo
  if (existsSync(join(projectPath, 'turbo.json'))) {
    result.isTurbo = true;
    result.type = result.type ? `${result.type}+turbo` : 'turbo';
  }

  // Check for Nx
  if (existsSync(join(projectPath, 'nx.json'))) {
    result.isNx = true;
    result.type = 'nx';
  }

  // Check for Lerna
  if (existsSync(join(projectPath, 'lerna.json'))) {
    result.type = 'lerna';
  }

  // Check for Rush
  if (existsSync(join(projectPath, 'rush.json'))) {
    result.type = 'rush';
  }

  return result;
};