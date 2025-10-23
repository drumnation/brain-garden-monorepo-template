import { createReactWebApp } from '../create-react-web/index.js';
import { createExpressApi } from '../create-express-api/index.js';
import { createReactNativeApp } from '../create-react-native/index.js';
import { createElectronApp } from '../create-electron/index.js';
import { createPackage } from '../create-library/index.js';
import type { ProjectConfig, GeneratedApp } from './types.js';

export async function runGenerators(
  config: ProjectConfig,
): Promise<GeneratedApp[]> {
  const generated: GeneratedApp[] = [];

  try {
    // Web app
    if (config.projectType.includes('web')) {
      console.log('  Creating web app...');
      await createReactWebApp({
        name: 'web',
        packageScope: config.packageScope,
        description: `${config.description} - Web`,
        features: {
          routing: true,
          stateManagement:
            config.techStack.frontend?.stateManagement === 'redux' ||
            config.techStack.frontend?.stateManagement === 'zustand'
              ? config.techStack.frontend.stateManagement
              : 'none',
          ui:
            config.techStack.frontend?.uiLibrary === 'mantine'
              ? 'mantine'
              : 'none',
          tailwind: config.techStack.frontend?.uiLibrary === 'tailwind',
        },
      });
      generated.push({
        name: 'web',
        type: 'web',
        path: 'apps/web',
        success: true,
      });
    }

    // API
    if (config.projectType.includes('api')) {
      console.log('  Creating API...');
      await createExpressApi({
        name: 'api',
        packageScope: config.packageScope,
        description: `${config.description} - API`,
        sampleModule: 'user',
        features: {
          database:
            config.techStack.backend?.database === 'prisma' ||
            config.techStack.backend?.database === 'mongoose'
              ? config.techStack.backend.database
              : 'none',
          validation:
            config.techStack.backend?.validation === 'zod' ||
            config.techStack.backend?.validation === 'yup'
              ? config.techStack.backend.validation
              : 'none',
          auth: config.features.authentication,
          cors: config.techStack.backend?.cors ?? true,
          logging: config.techStack.backend?.logging ?? true,
        },
      });
      generated.push({
        name: 'api',
        type: 'api',
        path: 'apps/api',
        success: true,
      });
    }

    // Mobile app
    if (config.projectType.includes('mobile')) {
      console.log('  Creating mobile app...');
      await createReactNativeApp({
        name: 'mobile',
        packageScope: config.packageScope,
        description: `${config.description} - Mobile`,
        template: 'expo-router',
        features: {
          navigation: true,
          stateManagement:
            config.techStack.frontend?.stateManagement === 'redux' ||
            config.techStack.frontend?.stateManagement === 'zustand'
              ? config.techStack.frontend.stateManagement
              : 'none',
          ui: 'react-native-paper',
        },
      });
      generated.push({
        name: 'mobile',
        type: 'mobile',
        path: 'apps/mobile',
        success: true,
      });
    }

    // Desktop app
    if (config.projectType.includes('desktop')) {
      console.log('  Creating desktop app...');
      await createElectronApp({
        name: 'desktop',
        packageScope: config.packageScope,
        description: `${config.description} - Desktop`,
        features: {
          stateManagement:
            config.techStack.frontend?.stateManagement === 'redux' ||
            config.techStack.frontend?.stateManagement === 'zustand'
              ? config.techStack.frontend.stateManagement
              : 'none',
          ui:
            config.techStack.frontend?.uiLibrary === 'mantine'
              ? 'mantine'
              : 'none',
          tailwind: config.techStack.frontend?.uiLibrary === 'tailwind',
          autoUpdater: false,
        },
      });
      generated.push({
        name: 'desktop',
        type: 'desktop',
        path: 'apps/desktop',
        success: true,
      });
    }

    // Shared packages
    console.log('  Creating shared packages...');

    // Shared utils package
    await createPackage({
      name: 'shared-utils',
      workspaceFolder: 'packages',
      dependencies: [],
      includeUIDeps: false,
      packageScope: config.packageScope,
    });
    generated.push({
      name: 'shared-utils',
      type: 'library',
      path: 'packages/shared-utils',
      success: true,
    });

    // If both frontend and backend, create shared types package
    const hasFrontend = config.projectType.some((t) =>
      ['web', 'mobile', 'desktop'].includes(t),
    );
    const hasBackend = config.projectType.includes('api');

    if (hasFrontend && hasBackend) {
      await createPackage({
        name: 'shared-types',
        workspaceFolder: 'packages',
        dependencies: [],
        includeUIDeps: false,
        packageScope: config.packageScope,
      });
      generated.push({
        name: 'shared-types',
        type: 'library',
        path: 'packages/shared-types',
        success: true,
      });
    }
  } catch (error) {
    console.error('  Error generating apps:', error);
    generated.push({
      name: 'error',
      type: 'library',
      path: '',
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return generated;
}
