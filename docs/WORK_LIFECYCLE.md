# Work Lifecycle Documentation

**Version**: 2.0
**Last Updated**: 2025-11-12

## Overview

This document defines ALL work types and their lifecycles in the Brain Garden monorepo. Every piece of work MUST be tracked in the GROVE system with complete documentation.

## Work Type Classification

```
┌─────────────────────────────────────────────────────────────┐
│                     Work Type Decision Tree                  │
└─────────────────────────────────────────────────────────────┘

Is it NEW functionality?
├─ YES → Is it a NEW feature (multiple components, significant scope)?
│  ├─ YES → FEATURE (10-phase lifecycle, /docs/features/)
│  └─ NO → Is it an ADDITION to existing feature (post-launch)?
│     ├─ YES → ENHANCEMENT (4-phase, /docs/features/{feature}/09-enhancements/)
│     └─ NO → Re-evaluate (might be MAINTENANCE)
│
└─ NO → Is it FIXING something broken?
   ├─ YES → BUG (5-phase, /docs/bugs/)
   │
   └─ NO → Is it INTEGRATING external code?
      ├─ YES → BORG (5-phase, /docs/borg/)
      │
      └─ NO → MAINTENANCE (type-specific lifecycle, /docs/maintenance/)
          ├─ Refactoring
          ├─ Dependencies
          ├─ Performance
          ├─ Documentation
          ├─ Security
          └─ Testing
```

## Work Types Summary

| Work Type | Location | Lifecycle Phases | Quality Threshold | Example |
|-----------|----------|------------------|-------------------|---------|
| **FEATURE** | `/docs/features/` | 10 phases (00-09) | ≥85/100 | User authentication system |
| **BUG** | `/docs/bugs/` | 5 phases (00-04) | ≥80/100 | Login failure after password reset |
| **ENHANCEMENT** | `/docs/features/{feature}/09-enhancements/` | 4 phases (00-03) | ≥75/100 | Add dark mode to dashboard |
| **MAINTENANCE** | `/docs/maintenance/{type}/` | Type-specific (4-5 phases) | 75-90/100 | Refactor auth service |
| **BORG** | `/docs/borg/` | 5 phases (00-04) | ≥80/100 | Integrate Express framework |

## Feature Lifecycle

**Full Documentation**: `/FEATURE_LIFECYCLE.md`

**Structure**: 10-phase lifecycle (00-research → 09-enhancements)
**Quality Threshold**: ≥85/100 (arbor-verification)
**Two Phases**: MVP (v0.x.x → v1.0.0) → Maturity (v1.0.0+)

**Example**:
```
/docs/features/user-authentication/
├── 00-research/
├── 01-planning/         # PRD, design, stories (GROVE artifacts)
├── 02-architecture/
├── 03-implementation-planning/
├── 04-development/
├── 05-testing/
├── 06-documentation/
├── 07-deployment/
├── 08-post-launch/
└── 09-enhancements/     # Maturity phase only
```

## Bug Lifecycle

**Full Documentation**: `/docs/bugs/README.md`

**Structure**: 5-phase lifecycle (00-investigation → 04-post-mortem)
**Quality Threshold**: ≥80/100 (arbor-bug-verification)
**States**: Active vs. Resolved

**Example**:
```
/docs/bugs/active/BUG-001-login-failure/
├── 00-investigation/    # Root cause analysis
├── 01-planning/         # Fix strategy
├── 02-implementation/   # Fix execution
├── 03-validation/       # Fix verification
└── 04-post-mortem/      # Lessons learned
```

## Enhancement Lifecycle

**Structure**: 4-phase lifecycle (00-request → 03-validation)
**Quality Threshold**: ≥75/100 (arbor-enhancement-verification)
**Placement**: ALWAYS feature-scoped (within parent feature)

**Requirements**:
- Parent feature MUST be post-launch (Phase 06+)
- If feature still in development → Add to current scope, NOT enhancement

**Example**:
```
/docs/features/dashboard/09-enhancements/ENH-001-dark-mode/
├── 00-request/          # Enhancement request
├── 01-planning/         # Enhancement plan
├── 02-implementation/   # Development
└── 03-validation/       # Verification
```

## Maintenance Lifecycle

**Structure**: Type-specific lifecycles (4-5 phases)
**Quality Thresholds**:
- Refactoring: ≥80/100
- Dependencies: ≥75/100
- Performance: ≥85/100
- Documentation: ≥75/100
- Security: ≥90/100
- Testing: ≥80/100

**Placement**: Project-level OR feature-scoped

**6 Maintenance Types**:

### 1. Refactoring
**Example**: `/docs/maintenance/refactoring/active/MAINT-REFACTOR-001-auth-service/`
**Phases**: 00-analysis → 01-planning → 02-refactoring → 03-validation → 04-documentation

### 2. Dependencies
**Example**: `/docs/maintenance/dependencies/active/MAINT-DEP-001-express-upgrade/`
**Phases**: 00-audit → 01-planning → 02-upgrade → 03-validation

### 3. Performance
**Example**: `/docs/maintenance/performance/active/MAINT-PERF-001-api-optimization/`
**Phases**: 00-profiling → 01-planning → 02-optimization → 03-validation → 04-monitoring

### 4. Documentation
**Example**: `/docs/maintenance/documentation/active/MAINT-DOC-001-api-guide/`
**Phases**: 00-audit → 01-planning → 02-writing → 03-review

### 5. Security
**Example**: `/docs/maintenance/security/active/MAINT-SEC-001-vulnerability-patch/`
**Phases**: 00-assessment → 01-planning → 02-remediation → 03-validation → 04-monitoring

### 6. Testing
**Example**: `/docs/maintenance/testing/active/MAINT-TEST-001-e2e-coverage/`
**Phases**: 00-audit → 01-planning → 02-implementation → 03-validation

## Borg Assimilation Lifecycle

**Full Documentation**: `/docs/borg/README.md`

**Structure**: 5-phase lifecycle (00-assessment → 04-upstream-tracking)
**Quality Threshold**: ≥80/100 (arbor-borg-verification)
**Integration Strategies**: Library, Fork, Copy-Adapt

**Example**:
```
/docs/borg/assimilations/active/BORG-001-express/
├── 00-assessment/       # Analysis and TCO
├── 01-planning/         # Integration strategy
├── 02-integration/      # Implementation
├── 03-validation/       # Verification
└── 04-upstream-tracking/ # Ongoing monitoring
```

## Arbor Integration

ALL work types use Arbor skills for automated planning:

| Work Type | Planning Skill | Verification Skill | Threshold |
|-----------|---------------|-------------------|-----------|
| Feature | `arbor-phase-planning` + `arbor-plan-generation` | `arbor-verification` | ≥85/100 |
| Bug | `arbor-bug-planning` | `arbor-bug-verification` | ≥80/100 |
| Enhancement | `arbor-enhancement-planning` | `arbor-enhancement-verification` | ≥75/100 |
| Maintenance | `arbor-maintenance-planning` | `arbor-maintenance-verification` | 75-90/100 |
| Borg | `arbor-borg-planning` | `arbor-borg-verification` | ≥80/100 |

## Naming Conventions

| Work Type | Format | Example |
|-----------|--------|---------|
| Feature | `{kebab-case-name}` | `user-authentication` |
| Bug | `BUG-{NNN}-{short-name}` | `BUG-001-login-failure` |
| Enhancement | `ENH-{NNN}-{short-name}` | `ENH-001-dark-mode` |
| Maintenance | `MAINT-{TYPE}-{NNN}` | `MAINT-REFACTOR-001` |
| Borg | `BORG-{NNN}-{repo-name}` | `BORG-001-express` |

## Work Registry

**Location**: `/docs/project/work-registry.json`

**Purpose**: Central registry of all active and completed work
**Schema**: Defined in `/docs/project/work-registry-schema.json`

**Example**:
```json
{
  "features": [
    {
      "id": "user-authentication",
      "type": "feature",
      "status": "in-progress",
      "currentPhase": "04-development",
      "version": "v0.3.0",
      "startDate": "2025-10-01",
      "targetDate": "2025-12-01"
    }
  ],
  "bugs": [
    {
      "id": "BUG-001",
      "type": "bug",
      "status": "active",
      "severity": "high",
      "assignedTo": "agent-name"
    }
  ],
  // ... enhancements, maintenance, borg
}
```

## Quality Gate Enforcement

**Arbor Planning Mandatory** (RULES.md Directive 7):
- ALL planning uses Arbor workflows
- NO manual planning without Arbor verification
- NO implementation before quality threshold met
- Emergency bypass requires documentation

**Implementation Blocking**:
```
Before Phase 04 (Development):
1. Read verification report
2. Extract quality score
3. IF score < threshold:
   - ❌ BLOCK implementation
   - Display score and recommendations
   - Request planning improvements
4. IF score ≥ threshold:
   - ✅ ALLOW implementation
```

## Work State Transitions

```
Feature: 00-research → 01-planning → ... → 08-post-launch → (Maturity: 09-enhancements)
Bug: 00-investigation → 01-planning → 02-implementation → 03-validation → 04-post-mortem
Enhancement: 00-request → 01-planning → 02-implementation → 03-validation
Maintenance: (Type-specific) → active → completed
Borg: 00-assessment → 01-planning → 02-integration → 03-validation → 04-upstream-tracking
```

## Completion Criteria

**Feature Complete**:
- All phases 00-08 complete
- Quality score ≥85/100
- All critical/high bugs resolved
- Documentation complete
- Deployment successful

**Bug Resolved**:
- Fix implemented and deployed
- Validation tests passing
- Post-mortem completed
- Moved to `/docs/bugs/resolved/`

**Enhancement Complete**:
- Implementation merged
- Validation passing
- Parent feature updated

**Maintenance Complete**:
- Work executed
- Validation passing
- Documentation updated
- Moved to `completed/`

**Borg Complete**:
- Integration successful
- Validation passing
- Upstream tracking active

## Related Documentation

- **Feature Lifecycle**: `/FEATURE_LIFECYCLE.md`
- **Bug System**: `/docs/bugs/README.md`
- **Borg System**: `/docs/borg/README.md`
- **Arbor Workflows**: `/ARBOR_WORKFLOWS.md`
- **Work Registry Schema**: `/docs/project/work-registry-schema.json`

---

**Scope**: All work types, comprehensive reference
