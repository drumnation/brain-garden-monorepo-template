# Rules Analysis for PM Agent Project

## Current Rules Assessment (15 files)

### ✅ **KEEP - Core PM Agent Requirements** (5 files)

1. **monorepo-structure-and-configuration.rules.mdc**
   - Essential for PM Agent monorepo structure
   - Defines ESM-only approach, shared configs
   - Agent coordination patterns

2. **brain-monitor-validation.rules.mdc**
   - Critical for Brain Garden TDD workflow
   - Error management and validation

3. **monorepo-documentation-strategy.rules.mdc**
   - PM Agent needs comprehensive docs
   - Hierarchy for monorepo documentation

4. **node.functional-isolated-concerns.rules.mdc**
   - PM Agent scripts use functional patterns
   - CLI tools and standalone Node programs

5. **pr-creation-guidelines.mdc**
   - Git workflow for PM Agent development
   - Steve needs to track PRs

### ⚠️ **CUSTOMIZE - Partial Relevance** (3 files)

6. **monorepo-package-docs-versioning.rules.mdc**
   - Keep versioning standards
   - Customize for PM Agent packages

7. **monorepo-node-express-architecture.rules.mdc**
   - May need API for viewer app
   - Customize to remove complex Express patterns

8. **component-design-decision-tree.rules.mdc**
   - Useful for viewer app React components
   - Simplify for PM Agent specific UI needs

### ❌ **REMOVE - Not Relevant to PM Agent** (7 files)

9. **react-bulletproof-component-pattern.rules.mdc**
   - Too complex for PM Agent viewer needs
   - PM Agent uses simple React components

10. **mobile-first-design.rules.mdc**
    - PM Agent is desktop-only (Electron app)
    - No mobile requirements

11. **atomic-design-component-strategy.rules.mdc**
    - Overkill for PM Agent's simple UI
    - Not using third-party UI libraries

12. **platform-pathways-pattern.rules.mdc**
    - Desktop-only, no platform variations

13. **project-wide-proxy-rules.mdc**
    - PM Agent doesn't proxy external APIs

14. **cm-proxy-rules.mdc**
    - Content Manager specific, not applicable

15. **10-forge-ssh-deployment.rules.mdc**
    - VPS deployment not needed for PM Agent

## New Rules Needed for PM Agent

### 📝 **CREATE - PM Agent Specific Rules**

1. **pm-agent-motivation-system.rules.mdc**
   - Focus on motivation metrics
   - Todo tracking requirements
   - Session continuity patterns

2. **pm-agent-database-patterns.rules.mdc**
   - SQLite patterns for 20+ tables
   - Quality scores calculation
   - Project state management

3. **pm-agent-brain-garden-integration.rules.mdc**
   - Integration with Brain Garden memory
   - Claude Code session tracking
   - Multi-agent communication

4. **pm-agent-tdd-workflow.rules.mdc**
   - TDD with Brain Garden tooling
   - E2E and integration test priority
   - Test-first development for all features

## Implementation Strategy

### Phase 1: Cleanup (Immediate)
- Remove 7 irrelevant rules
- Keep rules-source structure for maintainability

### Phase 2: Customization (Next)
- Modify 3 partially relevant rules
- Add PM Agent specific scopes

### Phase 3: Creation (Following)
- Create 4 new PM Agent specific rules
- Focus on motivation and TDD

### Phase 4: Build & Verify
- Run `npm run rules:build:verify`
- Ensure all CLI formats generated correctly
- Test with Brain Garden tooling