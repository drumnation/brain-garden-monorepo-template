# Recommended Rules for overseer-pm-agent

This file lists all recommended rules for this project based on its configuration.

## atomic-design-component-strategy

**Priority:** high
**Category:** frontend
**Reason:** Component organization best practices for React applications
**Source:** .cursor/rules-source/atomic-design-component-strategy.rules.mdc

---

## react-bulletproof-component-pattern

**Priority:** high
**Category:** frontend
**Reason:** React component standards and patterns
**Source:** .cursor/rules-source/react-bulletproof-component-pattern.rules.mdc

---

## monorepo-node-express-architecture

**Priority:** high
**Category:** backend
**Reason:** Express API architecture patterns and best practices
**Source:** .cursor/rules-source/monorepo-node-express-architecture.rules.mdc

---

## monorepo-documentation-strategy

**Priority:** medium
**Category:** documentation
**Reason:** Documentation standards and guidelines
**Source:** .cursor/rules-source/monorepo-documentation-strategy.rules.mdc


## How to Use

These rules are sourced from `.cursor/rules-source/` and should be applied via the rules build system:

```bash
pnpm rules:build
```

This will regenerate all platform-specific rule files (CLAUDE.md, GEMINI.md, etc.).
