# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Mega Template Transformation
- Generated React web app scaffold with Vite, Mantine UI, and Zustand state management
- Generated React Native mobile app scaffold with Expo Router and React Native Paper
- Generated Electron desktop app scaffold with auto-updater support
- Generated Express API scaffold with Prisma, Zod validation, and JWT authentication
- Created `packages/shared-utils` library with date utility functions and comprehensive tests
- Created `packages/shared-ui` library with Button component, unit tests, and Storybook stories
- Comprehensive smoke tests for all apps covering unit, integration, and E2E test types
- GitHub Actions workflow (`.github/workflows/validate.yml`) for automated CI/CD validation
- Problem matchers (`.github/problem-matchers.json`) for TypeScript and ESLint annotations
- Centralized testing configuration via `@kit/testing` with no per-package vitest configs
- Brain-monitor convenience scripts in root package.json (`brain:validate`, `brain:watch`, etc.)
- Post-generation setup script (`scripts/post-generate-setup.ts`) for automated initialization
- Template validation script (`scripts/validate-template.ts`) for comprehensive quality checks
- Comprehensive mega template documentation (`docs/MEGA_TEMPLATE_SETUP.md`)
- Testing strategy guide (`docs/guides/testing-strategy.md`)
- Generator usage guide (`docs/guides/generator-usage.md`)
- Template usage guide (`docs/TEMPLATE_USAGE.md`)
- Customization guide (`docs/guides/customization-guide.md`)
- Quick start guide (`docs/guides/quick-start.md`)
- Testing architecture documentation (`docs/architecture/testing-architecture.md`)
- Template validation checklist (`TEMPLATE_VALIDATION_CHECKLIST.md`)
- Test files for web app (unit and browser E2E)
- Test files for api app (integration and backend E2E)
- Button component in `packages/shared-ui` with variants, sizes, states, and comprehensive tests
- Root package.json `gen:library` script for creating new packages
- Brain-monitor `ci:init` script for initializing GitHub Actions
- `test:storybook` and `test:e2e:browser` configurations in turbo.json

### Removed
- Removed `apps/scheduling-api` directory and all references to simplify the template. Backend servers should now be generated using `pnpm gen:express-api` instead of modifying a pre-existing app.
- Removed `@scheduling-api/*` TypeScript path mapping from `tsconfig.base.json`
- Removed `_errors/` and `_logs/` from `.gitignore` - now tracked for multi-agent coordination
- Integration tests for scheduling-api (removed with app deletion)
- Backend E2E tests for scheduling-api (removed with app deletion)

### Changed
- Removed individual `vitest.config.ts` files in favor of centralized testing configuration
- Updated all app package.json test scripts to use centralized `@kit/testing` configs via `--config` flags
- Renamed `server.test.ts` to `server.unit.test.ts` following unified naming conventions
- Updated all generators (react-web, react-native, electron, express-api, library) to use centralized testing
- Transformed README.md from project-specific to mega template overview
- Enhanced root package.json with comprehensive brain-monitor and generator scripts
- All documentation updated to reference generated apps instead of pre-existing examples
- Environment variable management now uses centralized `@kit/env-loader` (single root `.env` file)
- All packages must use `@kit/logger` for structured logging

### Infrastructure
- Testing directory structure: `testing/integration/` and `testing/e2e/` for all apps
- Centralized Vitest configs: `unit.ts`, `integration.ts`, `e2e.ts` in `tooling/testing/src/configs/vitest/`
- Playwright config for browser E2E tests
- Automated validation pipeline with Brain Monitor integration