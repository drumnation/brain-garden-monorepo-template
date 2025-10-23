import { readdir, access } from 'fs/promises';
import { join } from 'path';
import type { ProjectConfig, RuleRecommendation } from './types.js';

export async function recommendRules(
  config: ProjectConfig,
): Promise<RuleRecommendation[]> {
  const recommendations: RuleRecommendation[] = [];
  const rulesPath = '.cursor/rules';

  // Check if rules directory exists
  try {
    await access(rulesPath);
  } catch {
    console.warn('  Warning: .cursor/rules directory not found');
    return recommendations;
  }

  // Frontend rules
  if (
    config.projectType.includes('web') ||
    config.projectType.includes('mobile') ||
    config.projectType.includes('desktop')
  ) {
    recommendations.push({
      ruleName: 'atomic-design-component-strategy',
      filePath: '.cursor/rules/atomic-design-component-strategy.rules.mdc',
      reason: 'Component organization best practices for React applications',
      priority: 'high',
      category: 'frontend',
    });

    recommendations.push({
      ruleName: 'react-bulletproof-component-pattern',
      filePath: '.cursor/rules/react-bulletproof-component-pattern.rules.mdc',
      reason: 'React component standards and patterns',
      priority: 'high',
      category: 'frontend',
    });

    recommendations.push({
      ruleName: 'react-component-standards',
      filePath: '.cursor/rules/react-component-standards.rules.mdc',
      reason: 'Consistent React component development',
      priority: 'high',
      category: 'frontend',
    });
  }

  // Backend rules
  if (config.projectType.includes('api')) {
    recommendations.push({
      ruleName: 'monorepo-node-express-architecture',
      filePath: '.cursor/rules/monorepo-node-express-architecture.rules.mdc',
      reason: 'Express API architecture patterns and best practices',
      priority: 'high',
      category: 'backend',
    });

    recommendations.push({
      ruleName: 'backend-functional-patterns',
      filePath: '.cursor/rules/backend-functional-patterns.rules.mdc',
      reason: 'Functional programming patterns for backend',
      priority: 'medium',
      category: 'backend',
    });
  }

  // Testing rules (always recommended)
  recommendations.push({
    ruleName: 'tests.tdd-workflow',
    filePath: '.cursor/rules/tests.tdd-workflow.rules.mdc',
    reason: 'Test-driven development workflow',
    priority: 'high',
    category: 'testing',
  });

  recommendations.push({
    ruleName: 'testing-strategy',
    filePath: '.cursor/rules/testing-strategy.rules.mdc',
    reason: 'Comprehensive testing strategy',
    priority: 'high',
    category: 'testing',
  });

  // Documentation rules (always recommended)
  recommendations.push({
    ruleName: 'monorepo-documentation-strategy',
    filePath: '.cursor/rules/monorepo-documentation-strategy.rules.mdc',
    reason: 'Documentation standards and guidelines',
    priority: 'medium',
    category: 'documentation',
  });

  recommendations.push({
    ruleName: 'ai-documentation-maintenance',
    filePath: '.cursor/rules/ai-documentation-maintenance.rules.mdc',
    reason: 'AI-assisted documentation maintenance',
    priority: 'medium',
    category: 'documentation',
  });

  // Monorepo rules (always recommended)
  recommendations.push({
    ruleName: 'monorepo-foundation',
    filePath: '.cursor/rules/monorepo-foundation.rules.mdc',
    reason: 'Core monorepo structure and conventions',
    priority: 'high',
    category: 'monorepo',
  });

  // Database rules
  if (config.features.database) {
    if (config.techStack.backend?.database === 'prisma') {
      recommendations.push({
        ruleName: 'prisma-best-practices',
        filePath: '.cursor/rules/prisma-best-practices.rules.mdc',
        reason: 'Prisma ORM best practices',
        priority: 'medium',
        category: 'backend',
      });
    } else if (config.techStack.backend?.database === 'mongoose') {
      recommendations.push({
        ruleName: 'mongoose-patterns',
        filePath: '.cursor/rules/mongoose-patterns.rules.mdc',
        reason: 'Mongoose ODM patterns',
        priority: 'medium',
        category: 'backend',
      });
    }
  }

  // State management rules
  if (config.techStack.frontend?.stateManagement === 'redux') {
    recommendations.push({
      ruleName: 'redux-toolkit-patterns',
      filePath: '.cursor/rules/redux-toolkit-patterns.rules.mdc',
      reason: 'Redux Toolkit state management patterns',
      priority: 'medium',
      category: 'frontend',
    });
  } else if (config.techStack.frontend?.stateManagement === 'zustand') {
    recommendations.push({
      ruleName: 'zustand-patterns',
      filePath: '.cursor/rules/zustand-patterns.rules.mdc',
      reason: 'Zustand state management patterns',
      priority: 'medium',
      category: 'frontend',
    });
  }

  // Verify rules exist and filter out missing ones
  const verifiedRecommendations = await verifyRules(recommendations);

  console.log(
    `  ✓ Recommended ${verifiedRecommendations.length} rules (${verifiedRecommendations.filter((r) => r.priority === 'high').length} high priority)`,
  );

  return verifiedRecommendations;
}

async function verifyRules(
  recommendations: RuleRecommendation[],
): Promise<RuleRecommendation[]> {
  const verified: RuleRecommendation[] = [];

  for (const rec of recommendations) {
    try {
      await access(rec.filePath);
      verified.push(rec);
    } catch {
      // Rule file doesn't exist, skip it
      console.warn(
        `  Warning: Recommended rule not found: ${rec.filePath}`,
      );
    }
  }

  return verified;
}
