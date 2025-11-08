# Documentation - Development Rules

PM Agent documentation standards

**Generated:** 2025-11-08
**Source:** .cursor/rules-source/*.mdc (auto-generated from modular rules)
**Context:** monorepo, documentation, versioning, pm-agent

---

## Table of Contents

1. [Monorepo Documentation Strategy](#monorepo-documentation-strategy)
2. [Monorepo Node Electron Express Hexagonal Architecture](#monorepo-node-electron-express-hexagonal-architecture)
3. [Monorepo Package Docs Versioning](#monorepo-package-docs-versioning)
4. [Monorepo Structure And Configuration](#monorepo-structure-and-configuration)
5. [Pm Agent Domain Logic](#pm-agent-domain-logic)
6. [Pm Agent Motivation System](#pm-agent-motivation-system)
7. [Pm Agent Sqlite Patterns](#pm-agent-sqlite-patterns)
8. [Pm Agent Tdd Workflow](#pm-agent-tdd-workflow)
9. [Pr Creation Guidelines](#pr-creation-guidelines)

---

## Monorepo Documentation Strategy

> **When to apply:** Documentation strategy and hierarchy for the monorepo

> **Scopes:** documentation, monorepo

# Monorepo Documentation Strategy

<!-- ==================== METADATA ==================== -->
ruleType: always
description: >
  Comprehensive documentation strategy for monorepo projects covering location, format,
  maintenance, and cross-referencing standards.
whenToUse:
  - Creating new documentation
  - Updating existing documentation
  - After completing any feature or refactor
  - When adding new packages or apps to the monorepo
# =====================================================

## 📂 Documentation Location Hierarchy

The monorepo uses a hierarchical documentation approach to ensure domain knowledge is stored at the appropriate scope level.

### 1. Package/App-Level Documentation
- **Primary Location:** Inside each package or app in a `docs/` subfolder
  ```
  packages/ui/docs/            # UI package-specific docs
  apps/web/docs/               # Web app-specific docs
  ```
- **Purpose:** Package-specific implementation details, API usage, internal patterns

### 2. Feature-Level Documentation
- **Location:** `/docs/features/[feature-name]/`
- **Purpose:** Documentation for features that span multiple packages

### 3. Global Documentation
- **Location:**
  ```
  /docs/architecture/          # System-wide architecture
  /docs/concepts/              # Shared concepts and patterns
  /docs/architecture/adr/      # Architecture Decision Records
  ```
- **Purpose:** Project-wide knowledge and design decisions

### Documentation Placement Decision Matrix

| Documentation Type | Placement Location |
|--------------------|-------------------|
| Feature spanning multiple packages | `/docs/features/[feature-name]/` |
| Implementation in shared workspace package | `packages/[pkg]/docs/` |
| Package-level setup or design notes | `packages/[pkg]/README.md` or `packages/[pkg]/docs/` |
| App-specific implementation details | `apps/[app]/docs/` (if present) or `/docs/apps/[app]/` |
| Architectural decisions | `/docs/architecture/adr/` |

## 📄 Documentation Creation Standards

### File Naming
Use kebab-case filenames that reflect the topic clearly:
- `auth-token-refresh-flow.md`
- `data-fetching-patterns.md`
- `button-component-api.md`

### YAML Frontmatter (Required)

All documentation files must include YAML frontmatter with the following fields:

```yaml
---
title: "API Caching Pattern"
description: "Explains the custom caching strategy used in `@api` for SSR and client hydration."
keywords:
  - api
  - caching
  - SWR
  - react-query
  - ssr
  - hydration
related_features: ["dashboard-data-pipeline"]
related_concepts: ["react-query-vs-swr"]
related_adr: ["001-cache-layer-decision"]
last_updated: "YYYY-MM-DD"  # Always use ISO 8601 format
---
```

### Document Structure

1. **Introduction** (immediately after frontmatter)
   - 2-4 sentence summary of the document's purpose
   - Provides context for search and RAG indexing

2. **Content Sections**
   - Use clear H2/H3 headers with relevant keywords
   - Short, atomic sections are preferred over long narratives
   - Include code examples where appropriate
   - Use tables for comparisons or options

3. **Cross-References**
   - Link to related documentation as appropriate
   - Use standardized cross-linking (see section below)

4. **Conclusion**
   - Summary of key points
   - Next steps or related topics to explore

## 🔄 Documentation Maintenance

### Index File Updates

Update relevant `.index.md` files when creating or modifying documentation:

- `docs/features/features.index.md`
- `docs/concepts/concepts.index.md`
- `docs/architecture/adr.index.md`
- `docs/packages/[pkg]/[pkg].index.md` (if applicable)

For each document, add an entry with format:
```markdown
- [[Document Title]](./document-filename.md): Brief description.
```

### Avoiding Duplication

Before creating new documentation:
1. Check index files for similar topics
2. Search for existing documentation with similar keywords
3. If similar documentation exists, consider updating or expanding it instead

### Documentation Review

After significant changes:
1. Update the `last_updated` field in the frontmatter
2. Verify that all cross-links still work
3. Check that examples remain current
4. Ensure all index files are updated

## 🔗 Cross-Linking Standards

### Relative Path Links
Use relative paths when linking between documents in the same package or nearby:
```markdown
[Authentication Flow](mdc:../../shared/docs/auth-flow.md)
```

### Agent-Readable References
Use @ notation when referencing documentation for agent processing:
```markdown
@docs/packages/ui/index.md
```

### External Links
For external resources, include the full URL and consider adding a timestamp:
```markdown
[React Query Documentation](mdc:https:/tanstack.com/query/latest) (as of 2025-04)
```

## 📚 Documentation Types

### README.md Files
- **Purpose:** Quick start, installation, primary usage examples
- **Location:** Root of each package, app, and the monorepo

### API Documentation
- **Purpose:** Detailed interface specifications, usage guidelines
- **Location:** `packages/[pkg]/docs/api/`

### Architecture Decision Records (ADRs)
- **Purpose:** Document significant architectural decisions
- **Location:** `/docs/architecture/adr/`
- **Format:** Follow standard ADR template with:
  - Title and date
  - Status (proposed, accepted, superseded)
  - Context
  - Decision
  - Consequences

### Guides and Tutorials
- **Purpose:** Step-by-step instructions for common tasks
- **Location:** `packages/[pkg]/docs/guides/` or `/docs/guides/`

## 🔍 Documentation Lookup Priority

When searching for relevant documentation:

1. **First,** look for `docs/` within the current package or app
2. **Then,** check shared or global documentation areas
3. **Use** `.index.md` files to guide lookup
4. **Never** assume knowledge lives only in root-level documentation

## ✅ Documentation Completeness Checklist

- [ ] Appropriate location based on scope
- [ ] Complete YAML frontmatter
- [ ] Clear introduction and purpose statement
- [ ] Well-structured content with descriptive headings
- [ ] Code examples (if applicable)
- [ ] Cross-links to related documentation
- [ ] Updated index files
- [ ] Last updated timestamp is current

---

## Monorepo Node Electron Express Hexagonal Architecture

---
description: Electron + Express.js hexagonal architecture with functional DI patterns and modular structure
globs:
  - "apps/\*\*/\*"
  - "packages/\*\*/\*"
scopes:
  - monorepo
  - backend
  - electron
  - express
  - node
  - functional-di
  - tdd
alwaysApply: true
---

# **Cursor Agent Rule: Modular Core/Adapter Monorepo Architecture**

**Objective:** Maintain a highly modular, decoupled, and testable TypeScript monorepo. All platform-agnostic business logic ("Core") **must** be extracted into `packages/*`. All platform-specific entry points ("Adapters," e.g., `apps/api-server`, `apps/electron-main`) **must** be thin wrappers that consume the Core.

**Core Principle:** This architecture is a form of  Hexagonal (Ports & Adapters) Architecture.

* **The "Core" (`packages/core-*`):** This is your application's "engine." It contains all business logic, services, repositories, and domain types. It has **zero knowledge** of the outside world (i.e., no imports from `express` or `electron`).
* **The "Adapters" (`apps/*`):** These are the "delivery mechanisms." They are thin wrappers that translate platform-specific I/O (HTTP requests, Electron IPC calls) into method calls on the Core. They are responsible for DI, composition, and error translation.

## **1. Monorepo & Project Structure**

* **Layout:** Use pnpm workspaces.

    ```txt
    / (root)
    ├─ package.json        # defines workspaces: ["apps/*", "packages/*"]
    ├─ pnpm-workspace.yaml
    ├─ tsconfig.base.json  # Base TS config with path aliases
    ├─ apps/
    │   ├─ api-server/     # Express API Adapter
    │   ├─ electron-main/  # Electron Main Process Adapter
    │   └─ renderer/       # Electron Frontend (Client) Adapter
    │
    └─ packages/
        ├─ core-feature-users/ # Core: "Users" Bounded Context
        ├─ core-feature-posts/ # Core: "Posts" BoundedContext
        ├─ core-db/            # Core: Shared DB client/schema
        ├─ electron-preload/   # Adapter: Electron preload script
        └─ ipc-contract/       # Adapter: Shared types for Electron IPC
    ```

* **Package Decision:**
  * If code is platform-agnostic (business logic, data access, utilities), it **must** go in a `packages/core-*` library.
  * If code is platform-specific (HTTP routes, IPC handlers, window management), it **must** go in an `apps/*` application.

### **2. `packages/core-*` Rules (The "Core" Engine)**

* **File Naming:** Strictly use `<feature>.<role>.ts`.

* **Role Suffixes:**

  * `service.ts`: Core business logic, orchestration.
  * `repo.ts`: Abstract data persistence (database queries, `fs` access).
  * `schema.ts`: Validation schemas (Zod) for data shapes.
  * `types.ts`: TypeScript interfaces/types for the domain.
  * `util.ts`: Pure, domain-specific helper functions.
  * `test.ts`: Unit/integration tests for the corresponding files.

* **Firewall Rule:** Files within `packages/core-*` **must not** import from any file in `apps/*`. They also **must not** import `express`, `electron`, or any other platform-specific library.

* **Dependency Injection:** All services and repos **must** be *pure factory functions* that receive their dependencies.

    ```ts
    // packages/core-db/src/db.client.ts
    // This is the *only* place a concrete db client is defined.
    export const makeDbClient = (config: { connectionString: string }) => ({
      // ... returns a client (e.g., PrismaClient, node-postgres Pool)
    });

    // packages/core-feature-users/src/user.repo.ts
    export const makeUserRepo = (deps: { db: DbClient }) => ({
      list: () => deps.db.query<User[]>('SELECT * FROM users'),
    });

    // packages/core-feature-users/src/user.service.ts
    export const makeUserService = (deps: {
      userRepo: ReturnType<typeof makeUserRepo>;
    }) => ({
      getAllUsers: async () => {
        // ... business logic
        return deps.userRepo.list();
      },
    });
    ```

### **3. `apps/*` Rules (The "Adapters")**

* **Core Principle:** All `apps/*` are **Composition Roots**. Their `main.ts` is responsible for:
    1. Creating concrete dependencies (e.g., `makeDbClient` with a platform-specific path/URL).
    2. Assembling the *entire* dependency graph by calling the `make...` factories from `packages/core-*`.
    3. Injecting the final, wired-up services into its own platform-specific "controllers."
* **No Business Logic:** Adapters **must not** contain any business logic. Their "controllers" are thin "Translator" layers.

#### **3.1 `apps/api-server` (Express Adapter)**

* **Structure:**
    `apps/api-server/src/`
    `├─ modules/<feature>/<feature>.controller.ts`
    `├─ infra/http/`
    `│   ├─ server.ts`
    `│   └─ routes.ts`
    `└─ main.ts` (Composition Root)
* **Controller (`<feature>.controller.ts`):** This is a "Translator" from HTTP to the Core Service. It **must not** contain business logic.

    ```ts
    // Translates (req, res) to a service call
    export const makeGetUsersHttp =
      (userService: ReturnType<typeof makeUserService>) =>
      async (_req, res, next) => {
        try {
          const users = await userService.getAllUsers();
          return res.json(users);
        } catch (e) {
          return next(e); // Pass to error middleware
        }
      };
    ```

#### **3.2 `apps/electron-main` (Electron Adapter)**

* **Structure:**
    `apps/electron-main/src/`
    `├─ modules/<feature>/<feature>.controller.ts`
    `├─ infra/electron/`
    `│   ├─ ipc.ts`
    `│   └─ windows.ts`
    `└─ main.ts` (Composition Root)
* **Controller (`<feature>.controller.ts`):** This is a "Translator" from IPC to the *exact same* Core Service. It **must not** contain business logic.

    ```ts
    // Translates (event, args) to a service call
    export const makeGetUsersIpc =
      (userService: ReturnType<typeof makeUserService>) =>
      async (_event: IpcMainInvokeEvent) => {
        // NOTE: No try/catch needed if using the error wrapper (Section 5)
        const users = await userService.getAllUsers();
        return users;
      };
    ```

#### **3.3 `packages/electron-preload` (Secure Bridge Adapter)**

* Its sole purpose is to be the `contextBridge` API. It defines the API contract for the `renderer`.

    ```ts
    // packages/electron-preload/src/index.ts
    import { contextBridge, ipcRenderer } from 'electron';
    import { IpcContract } from '@pkg/ipc-contract'; // Shared types

    const api: IpcContract = {
      getUsers: () => ipcRenderer.invoke('users:get'),
    };

    contextBridge.exposeInMainWorld('electronAPI', api);
    ```

### **4. Size & Complexity Limits (Enforced via Linting)**

* **Max File Length:** 500 lines (`eslint: max-lines-per-file`).
* **Max Function Length:** 75 lines (`eslint: max-lines-per-function`).
* **Cyclomatic Complexity:** ≤ 10 (`eslint: complexity`).
* **Nesting Depth:** ≤ 4 (`eslint: max-depth`).
* **Action:** If limits are exceeded, refactor immediately by extracting logic into smaller, focused functions.

### **5. Error Handling**

* **Core (`packages/core-*`):** Services/Repos **should** throw custom, structured errors (e.g., `NotFoundError`, `ValidationError`) defined in a shared utility.
* **Adapters (`apps/*`):** Adapters **must** catch these errors and translate them into platform-specific responses.
  * **`apps/api-server`:** Use a single, global error handling middleware in `infra/http/server.ts` that catches errors, logs them, and sends a standardized JSON error response (e.g., `res.status(404).json({ message: 'Not Found' })`).
  * **`apps/electron-main`:** Use a shared `handleIpc` wrapper in `infra/electron/ipc.ts` that wraps *every* registered handler.

      ```ts
        // infra/electron/ipc.ts
        export const handleIpc = (handler) => async (event, ...args) => {
          try {
            const data = await handler(event, ...args);
            return { ok: true, data };
          } catch (error) {
            log.error('IPC Error:', error); // Structured logging
            return {
              ok: false,
              error: { message: error.message, name: error.name },
            };
          }
        };

        // ...in your ipc registration
        ipcMain.handle(
          'users:get',
          handleIpc(wiredControllers.userController.getUsersHandler),
        );
        ```

### **6. Path Aliases & Imports**

* Use `tsconfig.base.json` to define shared path aliases. This is mandatory.

    ```json
    {
      "compilerOptions": {
        "baseUrl": ".",
        "paths": {
          "@app/api-server/*": ["apps/api-server/src/*"],
          "@app/electron-main/*": ["apps/electron-main/src/*"],
          "@pkg/core-users/*": ["packages/core-feature-users/src/*"],
          "@pkg/core-db/*": ["packages/core-db/src/*"],
          "@pkg/ipc-contract": ["packages/ipc-contract/src/index.ts"]
        }
      }
    }
    ```

* **Rule:** `packages/*` **must never** use an `@app/*` alias.

### **7. Workflow: TDD for Core Logic & Adapters**

This workflow is **mandatory** for new features to ensure decoupling.

**Goal:** Implement a new feature, `getPostById(id)`.

* **Step 1: Define the Contract.**

  * In `packages/core-feature-posts/src/post.types.ts`, define the `Post` type.
  * In `packages/ipc-contract/src/index.ts`, add `getPost: (id: string) => Promise<{ ok: true, data: Post } | { ok: false, error: any }>` to the contract.

* **Step 2: Write Failing Adapter Tests (The "Outside-In").**

  * **Test 1 (Express):** In `apps/api-server`, write an integration test using `supertest`.

      ```ts
        it('should return 404 for a missing post', async () => {
          // Wire up a test server with a *mock* postService
          const mockService = { getPostById: async ()_ => { throw new NotFoundError(); } };
          const app = createTestServer({ postService: mockService });
          await request(app).get('/api/posts/123').expect(404);
        });
        ```

  * **Test 2 (Electron):** In `apps/electron-main`, write a unit test for the controller.

      ```ts
        it('should return a not-found error object', async () => {
          // Wire up the controller with a *mock* postService
          const mockService = { getPostById: async ()_ => { throw new NotFoundError(); } };
          const controller = makeGetPostIpc(mockService);
          const result = await handleIpc(controller)(null, '123'); // Call wrapped handler
          expect(result.ok).toBe(false);
          expect(result.error.name).toBe('NotFoundError');
        });
        ```

* **Step 3: Write Failing Core Logic Test (The "Inside").**

  * In `packages/core-feature-posts/src/post.service.test.ts`:

      ```ts
        it('should throw NotFoundError if repo returns null', async () => {
          const mockRepo = { getById: async () => null };
          const service = makePostService({ postRepo: mockRepo });
          await expect(service.getPostById('123')).rejects.toThrow(NotFoundError);
        });
        ```

* **Step 4: Implement the Core Logic.**

  * Write the code in `post.service.ts` and `post.repo.ts` until the test in **Step 3** passes.

* **Step 5: Pass the Adapter Tests.**

  * Implement the thin controllers in `api-server` and `electron-main`.
  * Wire the *real* `makePostService` (from **Step 4**) into the DI container for both `api-server` and `electron-main`.
  * The tests from **Step 2** should now pass, proving the *entire* stack works for *both* platforms.

### **8. Duplication & Orphan Prevention**

* **DRY Principle:** Before writing new code, **always** search `packages/core-*` for existing logic.
* **CI Checks:**
  * `depcheck`: Fail build on unused dependencies.
  * `eslint-plugin-unused-imports`: Fail build on unused imports.
  * `pnpm list -r --depth -1`: (In CI script) Check for unexpected cross-dependencies (e.g., a `core` package depending on an `app`).

### **9. Code Generation & Scaffolding**

* **Mandatory Scaffolding:** Use a scaffolding tool (e.g., Plop.js, Hygen) to generate new `core-feature-*` packages or new modules within adapters.
* **Templates:** The templates **must** create the standard file structure (`<feature>.service.ts`, `<feature>.repo.ts`, `<feature>.service.test.ts`, etc.) and their corresponding test files.
* **PR Enforcement:** Pull requests adding new features manually (without using the generator) **should** be rejected.


---

## Monorepo Package Docs Versioning

> **When to apply:** Package documentation and versioning standards

> **Scopes:** documentation, versioning, packages

# Monorepo README & Changelog Management

<!-- ==================== METADATA ==================== -->
whenToUse:
  - Creating a new package or app in the monorepo
  - Making changes to any existing package
  - Releasing a new version of any package
  - Adding features, fixing bugs, or making breaking changes
  - Updating workspace configuration or dependencies
description: >
  Comprehensive standards for monorepo documentation lifecycle: package READMEs, changelogs, 
  and versioning. Ensures consistent documentation and versioning across all workspace packages.
# =====================================================

## Related Rules:
# - Required foundation: monorepo-library-setup.rules.mdc (base monorepo structure)
# - Broader documentation: monorepo-documentation-strategy.rules.mdc (general docs)
# - Consider with: monorepo-contributing.rules.mdc (for open source projects)

## 1. Documentation File Validation (MANDATORY)

Every package in the monorepo MUST maintain these fundamental files:

| File | Purpose | Required Sections |
|------|---------|-------------------|
| `README.md` | Package description, installation, usage | Overview, Installation, Usage, API (if applicable) |
| `CHANGELOG.md` | Version history, release notes | Unreleased, Previous Versions |
| `package.json` | Package metadata, dependencies | name, version (must follow SemVer) |

### Automated Validation

When working with any package, the agent MUST:

1. Check for the existence of all required files
2. If any file is missing, automatically create it using the templates in section 6
3. Report the creation: "Created missing [filename] for [package]"
4. Never consider a task complete until all packages modified have valid documentation

## 2. README.md Requirements

### Content Structure

Every package README must include:

1. **Title and Description** - Clear explanation of package purpose
2. **Installation** - How to install/use within the monorepo
3. **Usage Examples** - Code snippets showing common use cases
4. **API Documentation** - For libraries/shared components
5. **Dependencies** - Key external or internal dependencies

### README Update Triggers

Update the README whenever:

- Adding new features or API methods
- Changing usage patterns or requirements
- Modifying supported options/configuration
- Revising dependencies
- Making breaking changes

## 3. CHANGELOG.md Requirements

### Format Standard

Follow the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format:

```md
# Changelog

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New feature X

### Changed
- Updated dependency Y

## [1.0.0] - YYYY-MM-DD

### Added
- Initial release
```

### Entry Categories

Group changes into these categories:

- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Features that will be removed
- **Removed** - Features that were removed
- **Fixed** - Bug fixes
- **Security** - Vulnerability fixes

### Changelog Update Process

1. Always add changes to `[Unreleased]` section first
2. When releasing a version, rename `[Unreleased]` to `[x.y.z] - YYYY-MM-DD`
3. Add a new empty `[Unreleased]` section at the top
4. Include links to version comparison when possible

## 4. Versioning Standards

### Semantic Versioning

All packages MUST follow [SemVer 2.0.0](https://semver.org/):

- **MAJOR** (`x.0.0`) - Incompatible API changes
- **MINOR** (`0.x.0`) - Backwards-compatible functionality
- **PATCH** (`0.0.x`) - Backwards-compatible bug fixes

### Version Synchronization

Ensure version numbers are synchronized between:
- CHANGELOG.md entries
- package.json "version" field
- Any version references in README.md

## 5. Automated Documentation Workflow

### When Making Package Changes

1. **Detect Modified Packages** - Identify which workspace packages were modified
2. **Update Changelogs** - Add entries to `[Unreleased]` in each modified package
3. **Check READMEs** - Update if the changes affect usage, API, or behavior
4. **Ensure Consistency** - Verify all documentation is aligned with changes

### When Releasing Versions

1. **Prepare Version** - Move `[Unreleased]` changes to new version section
2. **Update package.json** - Bump version field according to SemVer rules
3. **Update README** - Update any version references or version-specific docs
4. **Commit Format** - `chore(package-name): release x.y.z`

## 6. File Templates for New Packages

### README.md Template

```md
# Package Name

Brief description of what this package does and its purpose in the monorepo.

## Installation

This package is part of the monorepo and can be used by adding it to your project dependencies:

```json
"dependencies": {
  "@project/package-name": "workspace:*"
}
```

## Usage

```typescript
import { Something } from '@project/package-name';

// Usage example
const result = Something.doThing();
```

## API

### `functionName(param1, param2)`

Description of what the function does.

**Parameters:**
- `param1` (type): Description
- `param2` (type): Description

**Returns:**
- (returnType): Description

## Dependencies

- List key dependencies here
```

### CHANGELOG.md Template

```md
# Changelog

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial implementation
```

## 7. Root README.md Management

The root-level README.md serves as the entry point to the entire monorepo and must be updated whenever:

1. **New Package Added** - Add to workspace package list with description
2. **Architecture Changes** - Update diagrams or descriptions of project structure
3. **Dev Workflow Changes** - Update commands or procedures for development
4. **Dependency Updates** - Document major dependency version changes

### Root README Structure

```md
# Project Name

Brief project overview and purpose.

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| [@project/package-a](./packages/package-a) | Description of package A | 1.2.0 |
| [@project/package-b](./packages/package-b) | Description of package B | 0.5.1 |

## Development

Installation and development workflow instructions.

## Architecture

High-level architecture description or diagrams.
```

## 8. Pre-Completion Checklist

Before marking any task complete, verify:

- [ ] All modified packages have updated changelog entries
- [ ] Version numbers are consistent across changelog and package.json
- [ ] READMEs reflect any API or usage changes
- [ ] Root README is updated if new packages were added

---

## Monorepo Structure And Configuration

> **When to apply:** Core monorepo structure, ESM-only, no-build libraries, shared config, agent coordination

> **Scopes:** monorepo, global


# Monorepo Structure and Configuration (v4)

## ⚠️ CRITICAL STRUCTURAL UNDERSTANDING

This document contains ESSENTIAL information about how the monorepo is structured and the development philosophy behind it. It must be understood for ALL operations in the codebase.

### Core Principles

1.  **ESM-Only:** We exclusively use ES Modules. CommonJS (`require`, `module.exports`) is not used. This simplifies our tooling and aligns with the modern JavaScript ecosystem.
2.  **No Build Step for Libraries:** Packages in `/packages` are not "built" into a `dist` folder. We export TypeScript source files (`.ts`, `.tsx`) directly. A runtime transpiler (like `tsx`) handles this for us, enabling instantaneous hot-reloading and simpler debugging.
3.  **Configuration is SHARED:** All tooling configuration (ESLint, Prettier, TypeScript, Testing) is centralized in the `/tooling` directory and consumed by all other workspaces. **DO NOT** create duplicate or one-off configurations.
4.  **Strict Naming & Structure:** Packages and folder structures follow a strict, predictable pattern. **DO NOT** deviate from it.
5.  **Agent Coordination First:** Before running any command, always check the `_errors/` and `_logs/` directories managed by `@kit/brain-monitor` to prevent redundant work.

### Devil's Advocate: Why No CommonJS?

You're right to want to keep things simple with ESM-only. But for the sake of completeness, here's the trade-off:

  * **Pros (Our Approach):** Massively simplified build process (or lack thereof), single module system to reason about, aligns with web standards, and enables cleaner, more modern syntax like top-level `await`.
  * **Cons:** Dropping CJS means older Node.js environments or tools that *only* support `require()` cannot consume our packages natively. Since we control the entire stack within this monorepo and all our applications are ESM-compatible, this is a trade-off we gladly accept for the significant boost in developer experience and simplicity.

-----

## 📂 Monorepo Layout

```txt
/apps          Executable applications (e.g., servers, web frontends)
/packages      Shared libraries consumed by apps or other packages
/tooling        Shared tooling and configuration (`@kit/*`)
/_errors        Real-time validation failure reports (via @kit/brain-monitor)
/_logs          Real-time server logs (via @kit/brain-monitor)
```

### 🏷 Naming Patterns

Packages must be scoped to align with their location and purpose.

```txt
/apps          @[app-name]
/packages      @[app-name]/[package-name]
/tooling       @kit/*
```

-----

## 📦 Package Configuration (The "No Build" Way)

This is the most critical change from `v3`. Library packages in `/packages` **do not have a build step**.

### `package.json` Template for a Library

This is the standard template for any new or converted library in `/packages`.

```json
{
  "name": "@[app-name]/[package-name]",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "exports": {
    // Points directly to the TypeScript source file
    ".": "./src/index.ts",
    // Allows importing sub-modules directly
    "./*": "./src/*.ts"
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "src"
  ],
  "scripts": {
    "clean": "rimraf node_modules .turbo",
    "format": "prettier --check \"**/*.{ts,tsx,md}\"",
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "@kit/env-loader": "workspace:*"
  },
  "devDependencies": {
    "@kit/eslint-config": "workspace:*",
    "@kit/prettier-config": "workspace:*",
    "@kit/testing": "workspace:*",
    "@kit/tsconfig": "workspace:*"
  },
  "eslintConfig": {
    "root": true,
    "extends": [
      "@kit/eslint-config/base"
    ]
  },
  "prettier": "@kit/prettier-config"
}
```

### `tsconfig.json` for a Library

Note the absence of `"outDir"` and `"declaration"`. We are not compiling to a separate directory.

```json
{
  "extends": "@kit/tsconfig/node", // or "@kit/tsconfig/react"
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

-----

## 🚀 Root `package.json` & Turbo Pipeline

The root `package.json` contains scripts that run across the entire monorepo using Turborepo. The `turbo.json` file configures the dependency graph and caching for these tasks.

### Root `package.json`

```json
{
  "name": "your-monorepo-name",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "clean": "turbo run clean",
    "format": "turbo run format",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",

    "test": "turbo run test",
    "test:watch": "turbo run test:watch",
    "test:unit": "turbo run test:unit",
    "test:integration": "turbo run test:integration",
    "test:e2e": "turbo run test:e2e",
    "test:storybook": "turbo run test:storybook",
    "test:e2e:browser": "turbo run test:e2e:browser",

    "brain:validate": "turbo run validate",
    "brain:logs": "pnpm --filter=@kit/brain-monitor run logs",
    "brain:typecheck-failures": "pnpm --filter=@kit/brain-monitor run typecheck-failures",
    "brain:test-failures": "pnpm --filter=@kit/brain-monitor run test-failures",
    "brain:lint-failures": "pnpm --filter=@kit/brain-monitor run lint-failures",
    "brain:format-failures": "pnpm --filter=@kit/brain-monitor run format-failures"
  },
  "devDependencies": {
    "turbo": "latest",
    "tsx": "latest",
    "typescript": "latest"
  },
  "packageManager": "pnpm@9.x.x"
}
```

### Root `turbo.json`

This pipeline is configured for our "no-build" library strategy and includes the agentic validation tasks.

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "cache": true
    },
    "typecheck": {
      "cache": true
    },
    "test": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "test:watch": {
      "cache": false,
      "persistent": true
    },
    "validate": {
      "dependsOn": ["lint", "typecheck", "test"],
      "cache": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

  * **`build`**: Only applies to `apps`. `dist/**` and `.next/**` are specified as outputs for caching. Libraries have no `build` script, so Turbo ignores them for this task.
  * **`dev` / `test:watch`**: Marked as non-cacheable and persistent for long-running processes.
  * **`lint` / `typecheck` / `test`**: These tasks are fully cacheable. If the source files haven't changed, the results are pulled from the cache instantly.
  * **`validate`**: This is the master task for `@kit/brain-monitor`. It depends on all other validation tasks completing first.

-----

## 🧪 Unified Testing – `@kit/testing`

The `@kit/testing` package provides a unified, modern, and highly modular testing framework for the entire monorepo. It uses a lazy-loaded API to improve performance.

### Available Configurations & Modern API

Instead of importing a static config object, you now call an async function that returns a configuration. This is faster and more flexible.

| Legacy Export (v3)                | Modern API (v4)                               | Purpose                               |
| --------------------------------- | --------------------------------------------- | ------------------------------------- |
| `unitConfig`                      | `await configs.vitest.unit()`                 | Unit tests (Vitest + JSDOM)           |
| `integrationConfig`               | `await configs.vitest.integration()`          | Integration tests (Vitest + Node)     |
| `e2eConfig`                       | `await configs.vitest.e2e()`                  | Backend/API E2E tests (Vitest)        |
| `storybookConfig`                 | `await configs.vitest.storybook()`            | Storybook component tests (Vitest)    |
| `playwrightConfig`                | `await configs.playwright.browser()`          | Browser E2E tests (Playwright)        |
| `playwrightBackendConfig`         | `await configs.playwright.api()`              | Backend/API tests (Playwright)        |
| `storybookE2EConfig`              | `await configs.playwright.storybook()`        | Storybook E2E tests (Playwright)      |
| `testRunnerConfig`                | `await configs.storybook.testRunner()`        | For `@storybook/test-runner`          |

### Example `vitest.config.ts` (Modern API)

```typescript
// vitest.config.ts
import { mergeConfig } from 'vitest/config';
import { configs, presets } from '@kit/testing';

// Load the base configuration asynchronously
const baseConfig = await configs.vitest.unit();

// Merge with custom overrides using presets
export default mergeConfig(baseConfig, {
  test: {
    // Use a stricter coverage preset
    coverage: presets.coverage.strict,
    // Use a longer timeout preset
    ...presets.timeouts.medium,
  }
});
```

For the full API, migration steps, and available presets, see the detailed README in `tooling/testing/README.md`.

-----

## 🧠 Agent Coordination – `@kit/brain-monitor`

To prevent multiple AI agents from performing the same time-consuming tasks (like running tests or type-checking) and to provide a centralized place for debugging, we use `@kit/brain-monitor`.

**MANDATORY BEHAVIOR:** Before running any validation or server command, **ALWAYS check the `_errors/` and `_logs/` directories first.**

### Workflow

1.  **Check for Existing Errors:**

    ```bash
    # See if type-checking has already failed
    cat _errors/errors.typecheck-failures.md

    # See if any tests are failing
    cat _errors/errors.test-failures.md
    ```

2.  **Run Validation (Only if Needed):** If the reports are stale or empty, run the validation.

    ```bash
    # Run all validations and generate reports
    pnpm brain:validate

    # Or run just one
    pnpm brain:test-failures
    ```

3.  **Debug Servers:** Check logs before restarting a server.

    ```bash
    # Watch the API server log in real-time
    tail -f _logs/financial-api.log

    # Or start all dev servers with logging enabled
    pnpm dev
    ```

This workflow saves time and compute resources, and provides a clear task list for fixing issues. For full CLI details, see the README in `tooling/brain-monitor/README.md`.

-----

## 🔑 Environment Variables – `@kit/env-loader`

The `@kit/env-loader` package provides a standardized way to load and access environment variables across all applications and packages.

### Installation & Setup

It should be added as a dependency to any package that needs access to environment variables.

```bash
pnpm add @kit/env-loader
```

### Loading Order

The loader searches for `.env` files in a hierarchical order, with earlier locations taking precedence:

1.  **`monorepo-root/.env`**: Global variables shared across all apps.
2.  **`apps/my-app/.env`**: Local variables that override the global ones for a specific app.
3.  `process.env`: System-level environment variables (highest priority).

### Usage Example (Node.js Backend)

At the entry point of your application (`server.ts`, `index.ts`), load the environment.

```typescript
// In apps/backend/src/server.ts
import { loadEnvironment, requireEnv, getIntEnv } from '@kit/env-loader/node';

const result = loadEnvironment({
  appName: 'backend-api',
  required: ['DATABASE_URL', 'API_KEY']
});

if (!result.success) {
  console.error('FATAL: Missing required environment variables:', result.missingRequired);
  process.exit(1);
}

const PORT = getIntEnv('PORT', 8080);
const API_KEY = requireEnv('API_KEY'); // Throws an error if not found
```

### Usage Example (Browser Frontend)

In browser-based apps (e.g., Vite/React), the bundler exposes the variables. You only need the helper functions. **Remember to prefix public variables** (e.g., `VITE_`).

```typescript
// In apps/frontend/src/api/client.ts
import { getEnv, requireEnv } from '@kit/env-loader/browser';

const API_URL = getEnv('VITE_API_URL', 'http://localhost:8080');
const PUBLIC_KEY = requireEnv('VITE_STRIPE_PUBLIC_KEY');
```

This package does not require any `turbo.json` configuration as it runs at runtime within your application code. For more details, see `tooling/env-loader/README.md`.

---

## 🔗 Related Rules

### Backend Development Patterns

**For Express.js Applications:**
See `monorepo-node-express-architecture.rules.mdc` for:
- HTTP API server architecture
- File naming: `<feature>.<role>.ts`
- Routes, controllers, middleware patterns
- Express-specific DI with Effect/fp-ts

**For Scripts, CLIs, and Standalone Programs:**
See `node.functional-isolated-concerns.rules.mdc` for:
- Functional programming patterns (no classes)
- File organization: `feature/<name>.<purpose>.ts`
- Background workers and batch processors
- Pure functions and isolated concerns

**Decision Guide:**
- Building HTTP API? → Use Express Architecture
- Building script/CLI/worker? → Use Functional Isolated Concerns
- Both in same app? → Express for HTTP layer, Functional for utilities


---

## Pm Agent Domain Logic

> **When to apply:** PM Agent domain logic for motivation metrics, quality scoring, and project value calculation

> **Scopes:** pm-agent, domain, motivation, business-logic


# PM Agent Domain Logic

## 🎯 Core Mission

**PM Agent solves the AI development motivation crisis** by making invisible progress visible through data-driven motivation metrics.

**The Problem:**
- AI-assisted development is 10x faster
- Less hands-on time = Less domain recall
- Developers forget project value after short periods
- Memory distortions cause valuable work to be abandoned
- Restart spiral instead of resuming nearly-finished projects

**The Solution:**
PM Agent tracks and calculates motivation metrics that prove project value:
1. 💪 **Effort Invested** - Sessions, tokens, commits, hours
2. 🏗️ **Infrastructure Depth** - Tests, coverage, CI/CD, zero errors
3. ✨ **Working Features** - Mapped to user stories, proven by tests
4. 📚 **Documentation Quality** - README scores, changelog, docs/
5. 🎯 **Progress Tracking** - % complete, proximity to milestones
6. 🖼️ **Visual Memory** - Screenshots to refresh recall

---

## 📐 Domain Model

### Core Entities

```typescript
// Project (root aggregate)
interface Project {
  id: number;
  name: string;
  path: string;
  originType: 'created' | 'forked' | 'cloned';
  ownership: 'mine' | 'customized-fork' | 'exploring';
  lifecycle: 'using' | 'building' | 'paused' | 'reference';
  purpose: string;
  lastWorkedOn: Date;
  deployedUrl?: string;
}

// Quality Metrics (value object)
interface QualityMetrics {
  qualityScore: number;  // 0-100
  testCoverage: number;  // 0-100
  hasTests: boolean;
  hasCICD: boolean;
  hasBrainGarden: boolean;
  hasPRD: boolean;
  hasArchitectureDocs: boolean;
  documentationScore: number;  // 0-100
}

// Motivation Verdict (value object)
interface MotivationVerdict {
  decision: 'ABSOLUTELY WORTH RESUMING' | 'WORTH RESUMING' | 'RECONSIDER' | 'CONSIDER ARCHIVING';
  effortInvested: EffortMetrics;
  infrastructureDepth: InfrastructureMetrics;
  workingFeatures: number;
  docsQuality: number;
  progress: ProgressMetrics;
  reasoning: string;
}

// Effort Metrics (value object)
interface EffortMetrics {
  sessionCount: number;
  tokensUsed: number;
  commitCount: number;
  estimatedHours: number;
}

// Progress Metrics (value object)
interface ProgressMetrics {
  percentComplete: number;
  featuresPlanned: number;
  featuresCompleted: number;
  proximity: string;  // "85% to v1.0"
}
```

---

## 💡 Business Logic Rules

### 1. Quality Score Calculation

**Algorithm:**
```typescript
// packages/core-quality/src/quality.service.ts
export const makeQualityService = (deps: {
  projectRepo: ReturnType<typeof makeProjectRepo>;
  fsClient: FsClient;
}) => ({
  calculateQualityScore: async (projectPath: string): Promise<number> => {
    const checks = {
      // Testing (40 points max)
      hasTests: await deps.fsClient.exists(`${projectPath}/**/*.test.ts`),
      testCoverage: await getTestCoverage(projectPath),
      hasCICD: await hasCIConfig(projectPath),

      // Documentation (30 points max)
      hasREADME: await deps.fsClient.exists(`${projectPath}/README.md`),
      hasChangelog: await deps.fsClient.exists(`${projectPath}/CHANGELOG.md`),
      hasDocsFolder: await deps.fsClient.exists(`${projectPath}/docs`),
      hasPRD: await deps.fsClient.exists(`${projectPath}/docs/PRD.md`),

      // Architecture (30 points max)
      hasBrainGarden: await deps.fsClient.exists(`${projectPath}/.brain`),
      hasArchDocs: await deps.fsClient.exists(`${projectPath}/ARCHITECTURE.md`),
      hasTooling: await deps.fsClient.exists(`${projectPath}/tooling`),
    };

    // Score calculation
    let score = 0;

    // Testing (40 points)
    if (checks.hasTests) score += 10;
    if (checks.testCoverage >= 80) score += 20;
    else if (checks.testCoverage >= 50) score += 10;
    if (checks.hasCICD) score += 10;

    // Documentation (30 points)
    if (checks.hasREADME) score += 10;
    if (checks.hasChangelog) score += 5;
    if (checks.hasDocsFolder) score += 10;
    if (checks.hasPRD) score += 5;

    // Architecture (30 points)
    if (checks.hasBrainGarden) score += 15;
    if (checks.hasArchDocs) score += 10;
    if (checks.hasTooling) score += 5;

    return Math.min(score, 100);
  },
});
```

**Rules:**
- ✅ Quality score is **0-100**
- ✅ **Testing counts most** (40 points)
- ✅ **Brain Garden integration** is highly valued (15 points)
- ✅ **Documented architecture** proves maintainability (10 points)
- ✅ Score updated on each scan (not cached forever)

### 2. Motivation Verdict Calculation

**Algorithm:**
```typescript
// packages/core-motivation/src/motivation.service.ts
export const makeMotivationService = (deps: {
  motivationRepo: ReturnType<typeof makeMotivationRepo>;
}) => ({
  getVerdict: async (projectId: number): Promise<MotivationVerdict> => {
    const metrics = await deps.motivationRepo.getProjectMetrics(projectId);

    // Calculate verdict based on multiple factors
    const verdictScore = calculateVerdictScore(metrics);

    if (verdictScore >= 80) {
      return {
        decision: 'ABSOLUTELY WORTH RESUMING',
        effortInvested: metrics.effort,
        infrastructureDepth: metrics.infrastructure,
        workingFeatures: metrics.featuresCompleted,
        docsQuality: metrics.docsScore,
        progress: metrics.progress,
        reasoning: `
You invested significant effort (${metrics.effort.sessionCount} sessions, ${metrics.effort.estimatedHours}hrs).
The infrastructure is solid (${metrics.infrastructure.testsPassing}/${metrics.infrastructure.testsTotal} tests passing, ${metrics.infrastructure.coverage}% coverage).
Most features work and are tested.
You're ${metrics.progress.percentComplete}% to v1.0 release.

DON'T START OVER. FINISH THIS.
        `.trim(),
      };
    }

    if (verdictScore >= 60) {
      return {
        decision: 'WORTH RESUMING',
        // ...
        reasoning: `
You've made good progress (${metrics.progress.percentComplete}% complete).
${metrics.effort.sessionCount} sessions invested shows commitment.
Quality could improve (${metrics.quality.qualityScore}/100).

Consider finishing this before starting something new.
        `.trim(),
      };
    }

    if (verdictScore >= 30) {
      return {
        decision: 'RECONSIDER',
        // ...
        reasoning: `
Low quality score (${metrics.quality.qualityScore}/100).
Only ${metrics.progress.percentComplete}% complete.
Consider: Is this still valuable? Or should you archive and start fresh?
        `.trim(),
      };
    }

    return {
      decision: 'CONSIDER ARCHIVING',
      // ...
      reasoning: `
Very low investment (${metrics.effort.sessionCount} sessions).
Poor quality (${metrics.quality.qualityScore}/100).
Minimal progress (${metrics.progress.percentComplete}%).

This might not be worth continuing. Consider archiving.
      `.trim(),
    };
  },
});

// Verdict scoring algorithm
function calculateVerdictScore(metrics: ProjectMetrics): number {
  let score = 0;

  // Quality (30 points)
  score += (metrics.quality.qualityScore / 100) * 30;

  // Effort (20 points)
  if (metrics.effort.sessionCount >= 40) score += 20;
  else if (metrics.effort.sessionCount >= 20) score += 15;
  else if (metrics.effort.sessionCount >= 10) score += 10;
  else if (metrics.effort.sessionCount >= 5) score += 5;

  // Progress (25 points)
  score += (metrics.progress.percentComplete / 100) * 25;

  // Infrastructure (15 points)
  if (metrics.infrastructure.testsPassing === metrics.infrastructure.testsTotal) score += 10;
  if (metrics.infrastructure.coverage >= 80) score += 5;

  // Documentation (10 points)
  score += (metrics.docsScore / 100) * 10;

  return Math.min(score, 100);
}
```

**Rules:**
- ✅ Verdict is data-driven (not subjective)
- ✅ **Quality + Progress matter most** (55 points combined)
- ✅ **Effort prevents false archiving** (don't throw away high-effort projects)
- ✅ Reasoning explains the verdict (not just a score)

### 3. Progress Calculation

**Algorithm:**
```typescript
// packages/core-progress/src/progress.service.ts
export const makeProgressService = (deps: {
  featureRepo: ReturnType<typeof makeFeatureRepo>;
}) => ({
  calculateProgress: async (projectId: number): Promise<ProgressMetrics> => {
    const features = await deps.featureRepo.listByProject(projectId);

    const planned = features.length;
    const completed = features.filter((f) => f.status === 'completed').length;
    const inProgress = features.filter((f) => f.status === 'in_progress').length;

    const percentComplete = planned > 0 ? (completed / planned) * 100 : 0;

    // Proximity calculation
    let proximity = '';
    if (percentComplete >= 85) {
      proximity = `${percentComplete.toFixed(0)}% to v1.0 release - SO CLOSE!`;
    } else if (percentComplete >= 70) {
      proximity = `${percentComplete.toFixed(0)}% to v1.0 release`;
    } else if (percentComplete >= 50) {
      proximity = `${percentComplete.toFixed(0)}% complete`;
    } else {
      proximity = `${completed}/${planned} features complete`;
    }

    return {
      percentComplete: Math.round(percentComplete),
      featuresPlanned: planned,
      featuresCompleted: completed,
      featuresInProgress: inProgress,
      proximity,
    };
  },
});
```

**Rules:**
- ✅ Progress based on **completed features** (not time)
- ✅ **85%+ completion** triggers "SO CLOSE" messaging (motivation!)
- ✅ Features must be tracked (not assumed)

### 4. Effort Tracking

**Algorithm:**
```typescript
// packages/core-effort/src/effort.service.ts
export const makeEffortService = (deps: {
  sessionRepo: ReturnType<typeof makeSessionRepo>;
  gitClient: GitClient;
}) => ({
  calculateEffort: async (projectId: number): Promise<EffortMetrics> => {
    const sessions = await deps.sessionRepo.listByProject(projectId);
    const commits = await deps.gitClient.getCommitCount(projectPath);

    const sessionCount = sessions.length;
    const tokensUsed = sessions.reduce((sum, s) => sum + s.tokensUsed, 0);

    // Estimate hours (rough: 1 session = ~1.5 hours)
    const estimatedHours = Math.round(sessionCount * 1.5);

    return {
      sessionCount,
      tokensUsed,
      commitCount: commits,
      estimatedHours,
    };
  },
});
```

**Rules:**
- ✅ **Session count** is primary effort metric
- ✅ Tokens track AI assistance usage
- ✅ Commits prove tangible progress
- ✅ Hours are estimated (not exact)

---

## 🧮 Calculation Priorities

### Must Calculate Accurately:
1. ✅ **Quality Score** - Drives all other decisions
2. ✅ **Motivation Verdict** - Core feature of PM Agent
3. ✅ **Progress %** - Shows completion proximity

### Should Calculate:
4. Effort metrics (sessions, tokens, hours)
5. Documentation scores
6. Infrastructure depth

### Can Calculate Later:
7. Value score (composite metric)
8. Momentum score (velocity trends)

---

## 🔒 Domain Rules (Invariants)

### Rule 1: Quality Score is Always 0-100
```typescript
// Enforce invariant
if (qualityScore < 0 || qualityScore > 100) {
  throw new DomainError('Quality score must be between 0 and 100');
}
```

### Rule 2: Projects Must Have Origin Type
```typescript
// Can't create project without origin
if (!project.originType) {
  throw new DomainError('Project must have originType: created, forked, or cloned');
}
```

### Rule 3: Lifecycle Transitions are Restricted
```typescript
// Valid transitions
const VALID_TRANSITIONS = {
  'using': ['paused', 'reference'],
  'building': ['using', 'paused'],
  'paused': ['using', 'building', 'reference'],
  'reference': [],  // Terminal state
};

// Enforce transition rules
if (!VALID_TRANSITIONS[currentLifecycle].includes(newLifecycle)) {
  throw new DomainError(`Cannot transition from ${currentLifecycle} to ${newLifecycle}`);
}
```

### Rule 4: Can't Delete Project with Active Sessions
```typescript
// Business rule
if (await hasActiveSessions(projectId)) {
  throw new DomainError('Cannot delete project with active sessions. Complete or cancel sessions first.');
}
```

---

## 💼 Service Composition

```typescript
// Compose services from smaller units
export const makeProjectManagementService = (deps: {
  projectRepo: ReturnType<typeof makeProjectRepo>;
  qualityService: ReturnType<typeof makeQualityService>;
  motivationService: ReturnType<typeof makeMotivationService>;
  progressService: ReturnType<typeof makeProgressService>;
  effortService: ReturnType<typeof makeEffortService>;
}) => ({
  getProjectWithMotivation: async (projectId: number) => {
    const project = await deps.projectRepo.getById(projectId);
    if (!project) throw new NotFoundError('Project not found');

    // Compose from multiple services
    const [quality, verdict, progress, effort] = await Promise.all([
      deps.qualityService.getQualityMetrics(projectId),
      deps.motivationService.getVerdict(projectId),
      deps.progressService.calculateProgress(projectId),
      deps.effortService.calculateEffort(projectId),
    ]);

    return {
      project,
      quality,
      verdict,
      progress,
      effort,
    };
  },
});
```

---

## 🧪 Testing Domain Logic

### Unit Test Pure Calculations
```typescript
describe('calculateVerdictScore', () => {
  it('should return 100 for perfect project', () => {
    const score = calculateVerdictScore({
      quality: { qualityScore: 100 },
      effort: { sessionCount: 50 },
      progress: { percentComplete: 100 },
      infrastructure: { testsPassing: 247, testsTotal: 247, coverage: 95 },
      docsScore: 100,
    });

    expect(score).toBe(100);
  });

  it('should return low score for minimal project', () => {
    const score = calculateVerdictScore({
      quality: { qualityScore: 20 },
      effort: { sessionCount: 2 },
      progress: { percentComplete: 10 },
      infrastructure: { testsPassing: 0, testsTotal: 0, coverage: 0 },
      docsScore: 10,
    });

    expect(score).toBeLessThan(30);
  });
});
```

### Integration Test Full Service
```typescript
describe('MotivationService Integration', () => {
  it('should calculate correct verdict for high-quality project', async () => {
    // Setup: Real database with test data
    const projectId = await seedProject({
      qualityScore: 94,
      sessionCount: 47,
      featuresCompleted: 12,
      featuresPlanned: 15,
    });

    const service = makeMotivationService({ motivationRepo });
    const verdict = await service.getVerdict(projectId);

    expect(verdict.decision).toBe('ABSOLUTELY WORTH RESUMING');
    expect(verdict.reasoning).toContain('85% to v1.0');
  });
});
```

---

## 🎯 PM Agent Domain Priorities

### Must Implement Correctly:
1. ✅ Quality score calculation
2. ✅ Motivation verdict generation
3. ✅ Progress tracking
4. ✅ Lifecycle transitions

### Should Implement:
5. Effort tracking
6. Documentation scoring
7. Infrastructure metrics

### Can Implement Later:
8. Value prediction
9. Momentum trending
10. AI-powered recommendations

---

## 🔗 Related Rules

- `monorepo-node-electron-express-hexagonal-architecture.rules.mdc` - Service layer patterns
- `pm-agent-sqlite-patterns.rules.mdc` - Repository patterns for data access
- `pm-agent-tdd-workflow.rules.mdc` - Testing domain logic
- `pm-agent-motivation-system.rules.mdc` - Motivation philosophy

---

**Remember:** Domain logic is pure business rules. Keep it framework-agnostic (no Electron, Express, React). Test it thoroughly with unit tests.

**The PM Agent's mission lives in this domain layer.**


---

## Pm Agent Motivation System

> **When to apply:** PM Agent motivation system - Track effort, quality, features, and progress to combat AI development memory loss

> **Scopes:** pm-agent, motivation, tracking, database, todos


# PM Agent Motivation System Rules

## Core Mission

**PM Agent solves the AI development motivation crisis:**
- AI development is 10x faster, but less hands-on time = less domain recall
- Developers forget project value after short breaks
- Memory distortions lead to abandoning nearly-finished valuable work
- PM Agent proves project worth with data-driven motivation metrics

## Motivation Metrics (MANDATORY)

Every feature MUST contribute to at least one motivation metric:

### 1. 💪 Effort Invested
- Session count and duration
- Token usage (Claude sessions)
- Commit history and frequency
- Lines of code (context, not vanity)

### 2. 🏗️ Infrastructure Depth
- Test coverage percentage
- Tests passing/failing
- CI/CD pipeline status
- Build health
- Documentation score

### 3. ✨ Working Features
- Feature completion percentage
- User stories completed
- Working demos/screenshots
- Integration status

### 4. 📚 Documentation Quality
- README completeness (0-100)
- Changelog maintenance
- API documentation
- Architecture docs

### 5. 🎯 Progress Tracking
- Distance to goals (percentage)
- Blocked vs unblocked items
- Velocity trends
- Time since last activity

## Todo Tracking (MANDATORY)

**NEVER work without tracking:**

```javascript
// BEFORE starting ANY task
const todo = todoManager.createSessionTodo({
  content: "Task description",
  activeForm: "Doing task",
  project: "project-name"
});

// Mark in_progress when starting
todoManager.updateSessionTodo(todo.id, { status: 'in_progress' });

// MANDATORY: Record accomplishments when completing
todoManager.completeSessionTodo(todo.id, {
  what: "What was accomplished",
  how: "How it was done",
  impact: "What changed",
  filesChanged: ["file1.ts", "file2.ts"],
  learnings: ["Key insight 1", "Pattern discovered"]
});
```

**Why This Matters:**
- Creates permanent record of effort
- Captures learnings for future sessions
- Enables pattern detection across projects
- Makes invisible progress visible
- Provides accomplishment dopamine hits

## Database State Management

**Projects NEVER physically move.** All state is tracked in the database:

```sql
-- Quality scores table tracks motivation metrics
quality_scores (
  infrastructure_score,  -- Build, test, CI/CD health
  documentation_score,   -- README, changelog, docs
  maintenance_score,     -- Dependencies, security
  momentum_score        -- Activity, velocity
)

-- Session tracking for effort metrics
claude_sessions (
  session_id,
  tokens_used,
  duration_minutes,
  goals,
  accomplished
)
```

## Feature Development Rules

### Every feature must answer: "How does this help motivation?"

**Good Features:**
- ✅ Screenshot gallery showing working features
- ✅ Progress bars showing completion percentage
- ✅ Effort timeline showing work invested
- ✅ Quality dashboard with test coverage
- ✅ "You were so close!" proximity indicators

**Bad Features:**
- ❌ Complex workflows without clear value
- ❌ Features that don't surface accomplishments
- ❌ Metrics that shame rather than motivate
- ❌ Vanity metrics without substance

## Testing Priority

**E2E and Integration tests are MOST IMPORTANT:**
- They prove features actually work
- They prevent regression of motivation features
- They validate the complete user experience

```javascript
// PRIORITY 1: E2E test for motivation viewer
describe('Motivation Dashboard', () => {
  it('displays effort metrics for active projects', async () => {
    // Test that proves effort is visible
  });

  it('shows progress toward goals', async () => {
    // Test that proves progress tracking works
  });
});

// PRIORITY 2: Integration tests
describe('Database to UI flow', () => {
  it('quality scores update dashboard in real-time', async () => {
    // Test the complete data flow
  });
});

// PRIORITY 3: Unit tests (supplementary)
```

## Visual Memory Requirements

**Screenshots are GOLD for ADHD brains:**

```javascript
// Capture visual proof of working features
pmAgent.captureScreenshot({
  project: 'project-name',
  caption: 'Dashboard working with real data',
  feature: 'motivation-dashboard'
});

// Store in organized structure
.pm-agent/screenshots/
  {project-name}/
    {date}-{feature}-{caption}.png
```

## Session Continuity

**Every session must:**
1. Load previous session context
2. Show what was accomplished last time
3. Track current session todos
4. Capture session summary at end
5. Move incomplete todos to backlog

```javascript
// Session start
const context = todoManager.getSessionContext({
  project: getCurrentProject(),
  lastNSessions: 3
});

console.log(`Last session: ${context.lastSession.completed} tasks completed`);

// Session end
const summary = todoManager.captureSessionSummary();
console.log(`You accomplished ${summary.completed} tasks!`);
```

## Documentation Standards

**All documentation serves motivation:**

```markdown
## What This Does (Impact)
[Clear description of value provided]

## Effort Invested
- Sessions: X
- Commits: Y
- Tests: Z passing

## Current Status
[Visual indicator of health/progress]

## Quick Start
[Immediate path to see it working]
```

## Brain Garden Integration

**Capture all insights in memory:**

```bash
# Store project insights
sage-memory store "Project X authentication uses JWT with 1-hour expiry"

# Store session accomplishments
sage-memory store "Fixed Docker networking - port 8090 conflicts with AirPlay"

# Query for patterns
sage-memory search "motivation patterns"
```

## Anti-Patterns to Avoid

**DON'T:**
- ❌ Work without todo tracking (loses effort history)
- ❌ Skip recording accomplishments (loses learning)
- ❌ Move projects physically (breaks references)
- ❌ Create features without clear motivation purpose
- ❌ Prioritize unit tests over E2E tests
- ❌ Forget visual documentation (screenshots)

## Success Metrics

A successful PM Agent implementation will:
- Show effort invested at a glance
- Prove infrastructure quality with numbers
- Display working features visually
- Track progress toward goals
- Remind developers why projects matter
- Turn "should I continue?" into "I'm so close!"

## Remember

> "When you can't remember why a project matters, PM Agent shows you the data that proves its worth."

Every line of code, every test, every feature should serve this mission.

---

## Pm Agent Sqlite Patterns

> **When to apply:** SQLite database patterns and repository design for PM Agent

> **Scopes:** database, sqlite, repository, pm-agent


# PM Agent SQLite Patterns

## 🎯 Database Architecture

PM Agent uses **SQLite** as the primary database for:
- **177 tracked projects** across Dev workspace
- **Motivation metrics** (quality scores, effort, features)
- **Session history** (todo tracking, accomplishments)
- **Health monitoring** (build status, test results)

**Location:** `/Users/dmieloch/Dev/.pm-agent/db/pm-agent.db`

**Why SQLite:**
- ✅ Single-file database (easy backup/restore)
- ✅ No server required (embedded)
- ✅ Fast for read-heavy workloads
- ✅ Perfect for desktop Electron apps
- ✅ ACID compliant (data integrity)

---

## 📐 Schema Structure (20+ Tables)

### Core Tables

```sql
-- Projects being tracked
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  path TEXT NOT NULL UNIQUE,
  origin_type TEXT CHECK(origin_type IN ('created', 'forked', 'cloned')),
  ownership TEXT CHECK(ownership IN ('mine', 'customized-fork', 'exploring')),
  lifecycle TEXT CHECK(lifecycle IN ('using', 'building', 'paused', 'reference')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_worked_on DATETIME,
  purpose TEXT,
  deployed_url TEXT
);

-- Quality and motivation metrics
CREATE TABLE quality_scores (
  project_id INTEGER PRIMARY KEY,
  quality_score INTEGER CHECK(quality_score BETWEEN 0 AND 100),
  test_coverage INTEGER,
  has_tests BOOLEAN,
  has_ci_cd BOOLEAN,
  has_brain_garden BOOLEAN,
  has_prd BOOLEAN,
  has_architecture_docs BOOLEAN,
  documentation_score INTEGER,
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Session tracking
CREATE TABLE claude_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER,
  session_id TEXT UNIQUE,
  started_at DATETIME,
  ended_at DATETIME,
  tokens_used INTEGER,
  goals TEXT,  -- JSON array
  accomplished TEXT,  -- JSON array
  blockers TEXT,  -- JSON array
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Features tracking
CREATE TABLE features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER,
  feature_name TEXT NOT NULL,
  status TEXT CHECK(status IN ('planned', 'in_progress', 'completed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

### Key Views

```sql
-- Dashboard view (CI/CD-like health)
CREATE VIEW project_quality_dashboard AS
SELECT
  p.name,
  p.path,
  p.lifecycle,
  q.quality_score,
  q.test_coverage,
  q.has_ci_cd,
  q.has_brain_garden,
  q.documentation_score,
  COUNT(DISTINCT cs.id) as session_count,
  MAX(cs.ended_at) as last_session
FROM projects p
LEFT JOIN quality_scores q ON p.id = q.project_id
LEFT JOIN claude_sessions cs ON p.id = cs.project_id
GROUP BY p.id
ORDER BY q.quality_score DESC;

-- User's original work only
CREATE VIEW my_projects AS
SELECT * FROM projects
WHERE ownership = 'mine' AND origin_type = 'created';

-- Projects by calculated value
CREATE VIEW projects_by_value AS
SELECT
  p.*,
  q.quality_score,
  (
    CASE p.lifecycle
      WHEN 'using' THEN 100
      WHEN 'building' THEN 80
      WHEN 'paused' THEN 40
      ELSE 20
    END +
    COALESCE(q.quality_score, 0) +
    (CASE WHEN q.has_ci_cd THEN 20 ELSE 0 END) +
    (CASE WHEN q.has_brain_garden THEN 20 ELSE 0 END)
  ) AS calculated_value
FROM projects p
LEFT JOIN quality_scores q ON p.id = q.project_id
ORDER BY calculated_value DESC;
```

---

## 🏗️ Repository Pattern (Hexagonal Architecture)

### Repository Structure

```typescript
// packages/core-db/src/db.client.ts
import Database from 'better-sqlite3';

export interface DbClient {
  query<T = any>(sql: string, params?: any[]): T[];
  queryOne<T = any>(sql: string, params?: any[]): T | null;
  execute(sql: string, params?: any[]): { changes: number };
  transaction<T>(fn: () => T): T;
}

export const makeDbClient = (config: { dbPath: string }): DbClient => {
  const db = new Database(config.dbPath);
  db.pragma('journal_mode = WAL');  // Better concurrency
  db.pragma('foreign_keys = ON');   // Enforce FK constraints

  return {
    query: <T = any>(sql: string, params: any[] = []): T[] => {
      return db.prepare(sql).all(...params) as T[];
    },

    queryOne: <T = any>(sql: string, params: any[] = []): T | null => {
      return (db.prepare(sql).get(...params) as T) || null;
    },

    execute: (sql: string, params: any[] = []) => {
      const result = db.prepare(sql).run(...params);
      return { changes: result.changes };
    },

    transaction: <T>(fn: () => T): T => {
      return db.transaction(fn)();
    },
  };
};
```

### Repository Example

```typescript
// packages/core-projects/src/project.repo.ts
import type { DbClient } from '@pkg/core-db';
import type { Project } from './project.types';

export const makeProjectRepo = (deps: { db: DbClient }) => ({
  // Get project by ID
  getById: (id: number): Project | null => {
    return deps.db.queryOne<Project>(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );
  },

  // Get project by name
  getByName: (name: string): Project | null => {
    return deps.db.queryOne<Project>(
      'SELECT * FROM projects WHERE name = ?',
      [name]
    );
  },

  // List all projects
  list: (): Project[] => {
    return deps.db.query<Project>('SELECT * FROM projects ORDER BY name');
  },

  // Get projects with quality scores (join)
  listWithQuality: () => {
    return deps.db.query<Project & { quality_score: number }>(
      `SELECT p.*, q.quality_score
       FROM projects p
       LEFT JOIN quality_scores q ON p.id = q.project_id
       ORDER BY q.quality_score DESC`
    );
  },

  // Insert new project
  create: (project: Omit<Project, 'id'>): number => {
    const result = deps.db.execute(
      `INSERT INTO projects (name, path, origin_type, ownership, purpose)
       VALUES (?, ?, ?, ?, ?)`,
      [project.name, project.path, project.origin_type, project.ownership, project.purpose]
    );
    return result.lastInsertRowid as number;
  },

  // Update project
  update: (id: number, updates: Partial<Project>): boolean => {
    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(updates);

    const result = deps.db.execute(
      `UPDATE projects SET ${fields} WHERE id = ?`,
      [...values, id]
    );

    return result.changes > 0;
  },

  // Delete project
  delete: (id: number): boolean => {
    const result = deps.db.execute('DELETE FROM projects WHERE id = ?', [id]);
    return result.changes > 0;
  },
});
```

---

## 🔒 Best Practices

### 1. Always Use Parameterized Queries
**✅ CORRECT:**
```typescript
deps.db.query('SELECT * FROM projects WHERE name = ?', [projectName]);
```

**❌ WRONG (SQL injection risk):**
```typescript
deps.db.query(`SELECT * FROM projects WHERE name = '${projectName}'`);
```

### 2. Use Transactions for Multi-Step Operations
```typescript
export const makeProjectService = (deps: {
  db: DbClient;
  projectRepo: ReturnType<typeof makeProjectRepo>;
}) => ({
  createProjectWithMetrics: (project: Project, quality: QualityMetrics) => {
    return deps.db.transaction(() => {
      const projectId = deps.projectRepo.create(project);
      deps.qualityRepo.create(projectId, quality);
      return projectId;
    });
  },
});
```

### 3. Enforce Foreign Key Constraints
```sql
-- Always use ON DELETE CASCADE for dependent data
CREATE TABLE quality_scores (
  project_id INTEGER PRIMARY KEY,
  -- ...
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

### 4. Use Indexes for Frequently Queried Columns
```sql
-- Index on name for fast lookups
CREATE INDEX idx_projects_name ON projects(name);

-- Index on last_worked_on for sorting
CREATE INDEX idx_projects_last_worked ON projects(last_worked_on DESC);

-- Composite index for common queries
CREATE INDEX idx_projects_ownership_lifecycle
ON projects(ownership, lifecycle);
```

### 5. Store JSON for Flexible Data
```typescript
// Store arrays/objects as JSON text
deps.db.execute(
  'INSERT INTO claude_sessions (goals, accomplished) VALUES (?, ?)',
  [
    JSON.stringify(['Fix Docker', 'Add tests']),
    JSON.stringify(['Fixed Docker networking']),
  ]
);

// Retrieve and parse
const session = deps.db.queryOne<{ goals: string }>(
  'SELECT goals FROM claude_sessions WHERE id = ?',
  [sessionId]
);
const goals = JSON.parse(session.goals);
```

---

## 📊 Query Optimization

### Use EXPLAIN QUERY PLAN
```sql
EXPLAIN QUERY PLAN
SELECT * FROM projects
WHERE ownership = 'mine'
ORDER BY last_worked_on DESC;

-- Check if index is used
-- Look for "USING INDEX" in output
```

### Avoid N+1 Queries
**❌ WRONG (N+1 problem):**
```typescript
const projects = await projectRepo.list();
for (const project of projects) {
  const quality = await qualityRepo.getByProjectId(project.id);  // N queries!
}
```

**✅ CORRECT (single JOIN):**
```typescript
const projectsWithQuality = deps.db.query(`
  SELECT p.*, q.quality_score
  FROM projects p
  LEFT JOIN quality_scores q ON p.id = q.project_id
`);
```

### Use Prepared Statements for Repeated Queries
```typescript
// In repository, prepare once
const getProjectStmt = db.prepare('SELECT * FROM projects WHERE id = ?');

// Execute many times (cached compilation)
const project1 = getProjectStmt.get(1);
const project2 = getProjectStmt.get(2);
```

---

## 🗄️ Migration Strategy

### Schema Migrations
```typescript
// db/migrations/001-initial-schema.sql
CREATE TABLE projects (...);
CREATE TABLE quality_scores (...);

// db/migrations/002-add-sessions.sql
CREATE TABLE claude_sessions (...);

// Apply migrations
const migrations = fs.readdirSync('./db/migrations').sort();
for (const migration of migrations) {
  const sql = fs.readFileSync(`./db/migrations/${migration}`, 'utf-8');
  db.exec(sql);
}
```

### Backup Before Migration
```bash
# Backup database
cp .pm-agent/db/pm-agent.db .pm-agent/db/pm-agent.db.backup

# Run migration
node packages/pm-scripts/run-migration.js

# If failed, restore backup
cp .pm-agent/db/pm-agent.db.backup .pm-agent/db/pm-agent.db
```

---

## 🧪 Testing with SQLite

### In-Memory Test Database
```typescript
// Use :memory: for fast tests
const testDb = makeDbClient({ dbPath: ':memory:' });

// Seed test data
testDb.execute(`
  INSERT INTO projects (name, path, origin_type)
  VALUES ('test-project', '/test/path', 'created')
`);

// Run tests
const result = await service.getProject('test-project');
expect(result).toBeDefined();
```

### Test Fixtures
```typescript
// Test with real database file (for integration tests)
const fixtureDb = makeDbClient({
  dbPath: './__tests__/fixtures/test-pm-agent.db',
});

beforeEach(() => {
  // Reset database to known state
  fixtureDb.execute('DELETE FROM projects');
  fixtureDb.execute('DELETE FROM quality_scores');

  // Seed fixture data
  seedDatabase(fixtureDb);
});
```

---

## 🔗 Integration with Hexagonal Architecture

```typescript
// Composition Root (apps/electron-main/src/main.ts)
const dbClient = makeDbClient({ dbPath: './db/pm-agent.db' });

// Repos (dependencies)
const projectRepo = makeProjectRepo({ db: dbClient });
const qualityRepo = makeQualityRepo({ db: dbClient });

// Services (business logic)
const projectService = makeProjectService({ projectRepo, qualityRepo });

// Controllers (adapters)
const projectController = makeProjectController({ projectService });

// Wire to IPC
ipcMain.handle('project:get', projectController.getProjectHandler);
```

---

## 🎯 PM Agent Database Priorities

### Must Optimize:
1. ✅ Dashboard queries (project_quality_dashboard view)
2. ✅ Project lookups by name (frequent)
3. ✅ Session history queries (for context loading)

### Should Optimize:
4. Quality score calculations
5. Feature tracking queries
6. Health monitoring queries

### Can Optimize Later:
7. Screenshot metadata queries
8. Cleanup queries (rarely run)

---

## 🔗 Related Rules

- `monorepo-node-electron-express-hexagonal-architecture.rules.mdc` - Repository pattern
- `pm-agent-tdd-workflow.rules.mdc` - Integration testing with real database
- `pm-agent-domain-logic.rules.mdc` - Domain logic using repositories

---

**Remember:** SQLite is PM Agent's source of truth. All motivation metrics flow through the database. Optimize queries, use indexes, and always test with real data.


---

## Pm Agent Tdd Workflow

> **When to apply:** Test-Driven Development workflow for PM Agent with Brain Garden integration

> **Scopes:** testing, tdd, brain-garden, pm-agent


# PM Agent TDD Workflow

## 🎯 Core Principle

**PM Agent solves the motivation crisis in AI-assisted development.**

Therefore, **E2E and Integration tests are MOST IMPORTANT** because they:
- ✅ Prove features actually work (AI-detectable signals)
- ✅ Prevent regressions when AI makes changes
- ✅ Validate the entire motivation system end-to-end
- ✅ Give confidence that "motivation metrics" are accurate

**Unit tests are supplementary** - they test isolated logic but don't prove the feature delivers value.

---

## 📐 Test Hierarchy (Priority Order)

### 1. **E2E Tests** (Highest Priority)
**Purpose:** Prove entire user workflows work in Electron app

**Test these flows:**
```typescript
// E2E: Motivation Dashboard displays correct metrics
describe('Motivation Dashboard E2E', () => {
  it('should display project quality score from database', async () => {
    // 1. Setup: Insert test project with quality_score = 94
    // 2. Launch Electron app
    // 3. Navigate to project
    // 4. Assert: Quality score 94/100 is visible
    // 5. Assert: Motivation message "ABSOLUTELY WORTH RESUMING" appears
  });

  it('should refresh metrics when project is rescanned', async () => {
    // Test that scanning updates UI in real-time
  });
});
```

**Tools:**
- Playwright for Electron
- Real SQLite database (test fixtures)
- Full Electron main + renderer interaction

### 2. **Integration Tests** (High Priority)
**Purpose:** Prove adapters → Core → Database flows work

**Test these integrations:**
```typescript
// Integration: Quality checker correctly calculates scores
describe('Quality Checker Integration', () => {
  it('should calculate correct quality score for project', async () => {
    const projectPath = '/test/fixtures/cannabis-codex';
    const qualityChecker = makeQualityChecker({ db, fs });

    const score = await qualityChecker.calculateScore(projectPath);

    expect(score).toBeGreaterThan(80);
    expect(score.metrics.testCoverage).toBe(82);
    expect(score.metrics.hasBrainGarden).toBe(true);
  });
});

// Integration: Express API returns project data correctly
describe('Express API Integration', () => {
  it('GET /api/projects/:id should return full project with metrics', async () => {
    const response = await request(app).get('/api/projects/1');

    expect(response.status).toBe(200);
    expect(response.body.qualityScore).toBeDefined();
    expect(response.body.motivationMetrics).toBeDefined();
  });
});

// Integration: Electron IPC returns motivation data
describe('Electron IPC Integration', () => {
  it('should return motivation verdict for project', async () => {
    const result = await ipcRenderer.invoke('project:getMotivationVerdict', projectId);

    expect(result.ok).toBe(true);
    expect(result.data.verdict).toMatch(/WORTH RESUMING/);
    expect(result.data.effortInvested).toBeDefined();
  });
});
```

### 3. **Unit Tests** (Supplementary)
**Purpose:** Test isolated business logic

**Only write unit tests for:**
- Pure calculation functions
- Complex algorithms
- Edge cases in utilities

**Example:**
```typescript
// Unit: Test motivation verdict calculation logic
describe('calculateMotivationVerdict', () => {
  it('should return "WORTH RESUMING" for high-quality projects', () => {
    const verdict = calculateMotivationVerdict({
      qualityScore: 94,
      sessionCount: 47,
      testsPassing: true,
      docsComplete: true,
      progressPercent: 85,
    });

    expect(verdict).toBe('ABSOLUTELY WORTH RESUMING');
  });

  it('should return "CONSIDER ARCHIVING" for abandoned low-quality projects', () => {
    const verdict = calculateMotivationVerdict({
      qualityScore: 23,
      sessionCount: 2,
      testsPassing: false,
      docsComplete: false,
      progressPercent: 5,
    });

    expect(verdict).toBe('CONSIDER ARCHIVING');
  });
});
```

---

## 🔄 TDD Workflow (RED → GREEN → REFACTOR)

### Step 1: RED - Write Failing E2E Test First
```typescript
// apps/viewer-app/__tests__/e2e/motivation-dashboard.spec.ts
describe('Motivation Dashboard', () => {
  it('should display "WORTH RESUMING" verdict for high-quality project', async () => {
    // Setup test database with high-quality project
    await seedDatabase({
      project: {
        name: 'cannabis-codex',
        qualityScore: 94,
        sessionCount: 47,
      },
    });

    // Launch app
    const app = await launchElectronApp();

    // Navigate to project
    await app.click('[data-testid="project-cannabis-codex"]');

    // Assert verdict appears
    const verdict = await app.locator('[data-testid="motivation-verdict"]');
    await expect(verdict).toHaveText(/ABSOLUTELY WORTH RESUMING/);
  });
});
```

**Run test:** `npm run test:e2e`
**Expected:** ❌ FAIL (feature doesn't exist yet)

### Step 2: RED - Write Failing Integration Test
```typescript
// packages/core-motivation/src/motivation.service.test.ts
describe('MotivationService', () => {
  it('should calculate verdict from project metrics', async () => {
    const mockRepo = {
      getProjectMetrics: async () => ({
        qualityScore: 94,
        sessionCount: 47,
        testsPassing: 247,
        docsScore: 94,
        progressPercent: 85,
      }),
    };

    const service = makeMotivationService({ motivationRepo: mockRepo });
    const verdict = await service.getVerdict('cannabis-codex');

    expect(verdict.decision).toBe('ABSOLUTELY WORTH RESUMING');
    expect(verdict.reasoning).toContain('85% to v1.0');
  });
});
```

**Run test:** `npm run test:integration`
**Expected:** ❌ FAIL (service doesn't exist yet)

### Step 3: GREEN - Implement Core Logic
```typescript
// packages/core-motivation/src/motivation.service.ts
export const makeMotivationService = (deps: {
  motivationRepo: ReturnType<typeof makeMotivationRepo>;
}) => ({
  getVerdict: async (projectId: string) => {
    const metrics = await deps.motivationRepo.getProjectMetrics(projectId);

    // Business logic: Calculate verdict
    if (metrics.qualityScore >= 80 && metrics.progressPercent >= 70) {
      return {
        decision: 'ABSOLUTELY WORTH RESUMING',
        reasoning: `You're ${metrics.progressPercent}% to v1.0 release`,
        metrics,
      };
    }

    // ... other conditions
  },
});
```

**Run test:** `npm run test:integration`
**Expected:** ✅ PASS (integration test passes)

### Step 4: GREEN - Wire Adapters
```typescript
// apps/electron-main/src/modules/motivation/motivation.controller.ts
export const makeGetMotivationVerdictIpc =
  (motivationService: ReturnType<typeof makeMotivationService>) =>
  async (_event: IpcMainInvokeEvent, projectId: string) => {
    const verdict = await motivationService.getVerdict(projectId);
    return verdict;
  };

// apps/viewer-app/src/features/MotivationDashboard/MotivationDashboard.tsx
export const MotivationDashboard = ({ projectId }) => {
  const { data: verdict } = useQuery({
    queryKey: ['motivation', projectId],
    queryFn: () => window.electronAPI.getMotivationVerdict(projectId),
  });

  return (
    <div>
      <h2 data-testid="motivation-verdict">{verdict.decision}</h2>
      <p>{verdict.reasoning}</p>
    </div>
  );
};
```

**Run test:** `npm run test:e2e`
**Expected:** ✅ PASS (E2E test passes - feature works end-to-end!)

### Step 5: REFACTOR - Clean Up
- Extract repeated logic
- Improve naming
- Add error handling
- Optimize queries

**All tests still pass after refactoring** ✅

---

## 🧠 Brain Garden Integration

### Continuous Validation
PM Agent uses Brain Garden's `brain-monitor` for continuous validation:

```bash
# Start brain monitor (watches for issues)
pnpm brain:watch

# Validate entire codebase
pnpm brain:validate

# View validation errors
pnpm monitor:errors
```

**Brain Monitor checks:**
- ✅ All tests pass before commits
- ✅ No TypeScript errors
- ✅ No ESLint warnings
- ✅ Build succeeds
- ✅ E2E tests pass in CI

### Test Coverage Requirements
- **E2E Tests:** Cover all motivation features
- **Integration Tests:** Cover all Core → Database flows
- **Unit Tests:** Cover complex calculations only

**No Coverage % Target** - Focus on testing what matters (features that deliver motivation).

---

## 🚨 Mandatory Rules

### Rule 1: Test-First for All Features
**Before writing ANY feature code:**
1. Write failing E2E test
2. Write failing integration test
3. Implement Core logic
4. Wire adapters
5. All tests pass

**No exceptions.** This is PM Agent's discipline.

### Rule 2: E2E Tests Prove Motivation Features
Every motivation feature must have an E2E test:
- "Display quality score" → E2E test that verifies score appears in UI
- "Calculate motivation verdict" → E2E test that verifies verdict appears
- "Show accomplishment feed" → E2E test that verifies feed loads

**If there's no E2E test, the feature doesn't exist.**

### Rule 3: Integration Tests Prove Hexagonal Architecture
Every Core service must have integration tests:
- Core service with real repository
- Real database (test fixtures)
- Real file system access (if needed)

**This proves the architecture works.**

### Rule 4: Todo Tracking for Test Work
Use the todo system to track test work:
```typescript
todoManager.createSessionTodo({
  content: 'Write E2E test for motivation dashboard',
  activeForm: 'Writing E2E test for motivation dashboard',
});

// Mark complete with learnings
todoManager.completeSessionTodo(todoId, {
  what: 'E2E test for motivation verdict display',
  how: 'Used Playwright to test Electron app',
  learnings: ['Playwright can test Electron main + renderer together'],
});
```

---

## 🎯 PM Agent Test Priorities

### Must Test (E2E + Integration):
1. ✅ Quality score calculation and display
2. ✅ Motivation verdict generation
3. ✅ Project scanning and enrichment
4. ✅ Todo tracking workflows
5. ✅ Screenshot capture and display
6. ✅ Accomplishment feed
7. ✅ Health monitoring

### Should Test (Integration):
8. Database queries (repositories)
9. IPC communication (Electron)
10. API endpoints (Express)

### Can Test (Unit):
11. Complex calculations (if pure functions)
12. Edge cases in utilities

---

## 💡 Test Structure

```
apps/viewer-app/
├── __tests__/
│   └── e2e/
│       ├── motivation-dashboard.spec.ts
│       ├── project-viewer.spec.ts
│       └── quality-score.spec.ts

packages/core-motivation/
├── src/
│   ├── motivation.service.ts
│   ├── motivation.service.test.ts    # Integration
│   ├── motivation.repo.ts
│   └── motivation.repo.test.ts        # Integration

packages/core-quality/
├── src/
│   ├── quality.service.ts
│   ├── quality.service.test.ts        # Integration
│   └── calculations.test.ts           # Unit (pure functions)
```

---

## 🔗 Related Rules

- `monorepo-node-electron-express-hexagonal-architecture.rules.mdc` - TDD workflow for adapters
- `brain-monitor-validation.rules.mdc` - Continuous validation
- `pm-agent-motivation-system.rules.mdc` - Motivation metrics being tested

---

**Remember:** Tests prove features work. Without E2E tests proving motivation metrics display correctly, the PM Agent's core mission fails.

**Test-first. Always.**


---

## Pr Creation Guidelines

> **When to apply:** Pull request creation guidelines and workflow

> **Scopes:** git, workflow, documentation


# PR Creation and Management Guidelines

## Overview
This document outlines the standardized process for creating and managing pull requests, including hotfix workflows, PR description formatting, and cleanup procedures.

## 🔄 Workflow Steps

### 1. Branch Creation
```bash
# For hotfixes
git checkout qa
git pull origin qa
git checkout -b hotfix/descriptive-name

# For features
git checkout main
git pull origin main
git checkout -b feature/descriptive-name
```

### 2. PR Description Creation
```bash
# Create temporary description file
printf '# 🚑 [PR Type]: Brief Title\n\n## 🔍 Issue\n[Issue description]\n\n## 🛠 Fix\n[Fix description]\n\n## 📋 Changes\n- [Change 1]\n- [Change 2]\n\n## 🧪 Testing\n- [ ] [Test item 1]\n- [ ] [Test item 2]\n\n## ⏰ Created\n%s\n\n#Tags #MoreTags' "$(date +'%A, %B %d, %Y at %I:%M:%S %p')" > /tmp/pr_description.md
```

### 3. PR Creation Using GitHub CLI
```bash
# Create new PR
gh pr create --base [target_branch] --head [source_branch] --title "[PR Title]" --body-file /tmp/pr_description.md

# Update existing PR
gh pr edit [PR_NUMBER] --body-file /tmp/pr_description.md
```

### 4. Cleanup
```bash
# Remove temporary files
rm /tmp/pr_description.md
```

## 📝 PR Description Templates

<!-- markdownlint-disable MD025 -->
<!-- Note: H1 headings in templates below are intentional examples for PR descriptions -->

### Hotfix Template
\`\`\`markdown
# 🚑 Hotfix: [Brief Description]

## 🔍 Issue
[Describe the issue being fixed]

## 🛠 Fix
[Describe the fix implemented]

## 📋 Changes
- [Change 1]
- [Change 2]

## 🧪 Testing
- [ ] [Test step 1]
- [ ] [Test step 2]

## ⏰ Created
[DATE]

#Hotfix #[AdditionalTags]
\`\`\`

### Feature Template
\`\`\`markdown
# ✨ Feature: [Brief Description]

## 🎯 Purpose
[Describe the feature's purpose]

## 📋 Changes
- [Change 1]
- [Change 2]

## 🧪 Testing
- [ ] [Test step 1]
- [ ] [Test step 2]

## 📚 Documentation
- [ ] Updated relevant docs
- [ ] Added comments where needed

## ⏰ Created
[DATE]

#Feature #[AdditionalTags]
\`\`\`

## 🎨 Formatting Guidelines

1. **Emojis**
   - Use relevant emojis at section headers
   - Keep emoji usage consistent within templates
   - Common emojis:
     - 🚑 Hotfix
     - ✨ Feature
     - 🐛 Bug fix
     - 📚 Documentation
     - 🧪 Testing
     - ⚡ Performance
     - 🔒 Security

2. **Markdown Best Practices**
   - Use backticks (\`) for code, commands, and technical terms
   - Use bullet points (-) for lists
   - Use checkboxes (- [ ]) for testing items
   - Use headers (##) for clear section separation
   - Add blank lines between sections

3. **Content Structure**
   - Keep titles concise and descriptive
   - Use active voice in descriptions
   - List changes in bullet points
   - Include specific testing steps
   - Add relevant tags

## 🔄 Post-PR Workflow

1. **For Hotfixes**
   ```bash
   # After QA approval
   git checkout main
   git pull origin main
   git merge hotfix/[branch-name]
   git push origin main
   ```

2. **Branch Cleanup**
   ```bash
   # After successful merge
   git branch -d [branch-name]
   git push origin --delete [branch-name]
   ```

## 🚫 Common Pitfalls to Avoid

1. Don't include sensitive information in PR descriptions
2. Don't leave testing steps vague or incomplete
3. Don't forget to clean up temporary files
4. Don't merge without required approvals
5. Don't leave outdated branches lingering

## 🔍 PR Review Guidelines

1. **Before Requesting Review**
   - [ ] All tests pass
   - [ ] Code follows style guidelines
   - [ ] PR description is complete and formatted
   - [ ] Changes are properly scoped
   - [ ] Temporary files are cleaned up

2. **After Review**
   - [ ] Address all comments
   - [ ] Update PR description if needed
   - [ ] Re-request review if necessary
   - [ ] Clean up feature branches after merge

---

## 🔗 Related Rules

### Validation Before PR Creation
**IMPORTANT:** Before creating a PR, check validation reports to ensure quality:

- **`brain-monitor-validation.rules.mdc`** - Check `_errors/validation-summary.md` first
  - Prevents pushing code with known issues
  - Provides clear task list of what needs fixing
  - Saves CI/CD time and reviewer effort

- **`tests.continuous-validation.rules.mdc`** - Auto-test execution
  - Tests run automatically after changes
  - Results appear in `_errors/` reports
  - Part of the Testing Trio workflow

- **`tests.unified-testing.rules.mdc`** - Test quality standards
  - Ensures tests follow TDD principles
  - Provides testing patterns and best practices
  - Part of the Testing Trio workflow

### Monorepo Context
- **`monorepo-structure-and-configuration.rules.mdc`** - Monorepo conventions
- **`monorepo-package-docs-versioning.rules.mdc`** - Package versioning in PRs

### Best Practice Integration
**Before marking PR ready for review:**
1. Run `cat _errors/validation-summary.md` to check status
2. Fix any failing tests/lints shown in reports
3. Update CHANGELOG.md for affected packages
4. Ensure PR description reflects actual changes