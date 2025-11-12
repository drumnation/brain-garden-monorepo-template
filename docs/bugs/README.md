# Bug Tracking System

**Version**: 1.0
**Last Updated**: 2025-11-12

## Overview

This directory contains ALL bug tracking for the Brain Garden monorepo. Every bug MUST be tracked in GROVE system with complete lifecycle documentation.

## Bug Lifecycle (5 Phases)

```
/docs/bugs/active/BUG-{NNN}-{short-name}/
  ├── 00-investigation/     # Root cause analysis
  ├── 01-planning/          # Fix strategy
  ├── 02-implementation/    # Fix execution
  ├── 03-validation/        # Fix verification
  └── 04-post-mortem/       # Lessons learned
```

## Bug Workflow

### Phase 00: Investigation
**Purpose**: Understand the bug and identify root cause
**Deliverables**:
- Bug reproduction steps
- Environment details
- Stack traces and error logs
- Root cause analysis
- Impact assessment

### Phase 01: Planning
**Purpose**: Design fix strategy
**Deliverables**:
- Fix strategy document
- Risk assessment
- Testing plan
- Rollback plan

### Phase 02: Implementation
**Purpose**: Apply the fix
**Deliverables**:
- Code changes
- Unit tests
- Integration tests
- Code review

### Phase 03: Validation
**Purpose**: Verify fix works
**Deliverables**:
- Test results
- Regression testing
- QA signoff
- Production verification

### Phase 04: Post-Mortem
**Purpose**: Learn and prevent recurrence
**Deliverables**:
- Post-mortem report
- Prevention strategies
- Process improvements
- Documentation updates

## Bug Naming Convention

**Format**: `BUG-{NNN}-{short-descriptive-name}`

**Examples**:
- `BUG-001-login-failure`
- `BUG-023-memory-leak-dashboard`
- `BUG-047-api-timeout-users`

## Bug Severity Levels

| Severity | Description | Response Time | Example |
|----------|-------------|---------------|---------|
| **Critical** | System down, data loss | Immediate | Database corruption |
| **High** | Major feature broken | <4 hours | Login fails for all users |
| **Medium** | Feature degraded | <24 hours | Slow API responses |
| **Low** | Minor issue | <7 days | UI misalignment |
| **Trivial** | Cosmetic | Best effort | Typo in tooltip |

## Bug States

- **Active** (`/docs/bugs/active/`) - Currently being worked on
- **Resolved** (`/docs/bugs/resolved/`) - Fix deployed and verified

## Bug Metadata

Every bug must have a `metadata.json` file:

```json
{
  "bugId": "BUG-001",
  "title": "Login failure after password reset",
  "severity": "high",
  "status": "active",
  "reportedDate": "2025-11-12",
  "reportedBy": "user@example.com",
  "assignedTo": "agent-name",
  "affectedVersions": ["v1.2.0", "v1.2.1"],
  "fixedVersion": null,
  "relatedFeatures": ["authentication"],
  "rootCause": "Session token not invalidated on password change",
  "fixStrategy": "Invalidate all sessions on password reset",
  "estimatedEffort": "2 hours",
  "actualEffort": null,
  "tags": ["authentication", "security", "session-management"]
}
```

## Creating a New Bug

```bash
# 1. Create bug directory
mkdir -p /docs/bugs/active/BUG-{NNN}-{short-name}

# 2. Create phase folders
cd /docs/bugs/active/BUG-{NNN}-{short-name}
mkdir 00-investigation 01-planning 02-implementation 03-validation 04-post-mortem

# 3. Create metadata.json
cat > metadata.json << EOF
{
  "bugId": "BUG-{NNN}",
  "title": "Bug title",
  "severity": "medium",
  "status": "active",
  "reportedDate": "$(date +%Y-%m-%d)",
  ...
}
EOF

# 4. Begin investigation
# Create 00-investigation/investigation-report.md
```

## Bug Resolution Workflow

1. **Report** - Create bug in `active/`
2. **Investigate** - Complete Phase 00
3. **Plan Fix** - Complete Phase 01
4. **Implement** - Complete Phase 02
5. **Validate** - Complete Phase 03
6. **Post-Mortem** - Complete Phase 04
7. **Move to Resolved** - Move from `active/` to `resolved/`

## Integration with Arbor

**Arbor Skill**: `arbor-bug-planning`
**Quality Threshold**: ≥80/100 via `arbor-bug-verification`

**Auto-Triggering**: When bug detected → Invoke `arbor-bug-planning` → `arbor-bug-verification`

## Bug Templates

See `/docs/templates/bug/` for:
- Investigation report template
- Fix strategy template
- Post-mortem template
- Metadata template

## Quality Gates

**Severity-Based Blocking** (during feature MVP phase):
- **Critical**: Block phase progression immediately
- **High**: Must be resolved by Phase 05 (Testing)
- **Medium**: Must be resolved by Phase 07 (Deployment)
- **Low/Trivial**: Can be deferred to maturity phase

## Bug Tracking During Feature Development

**MVP Phase** (v0.x.x):
- Create bugs in current phase: `{feature}/{phase}/.issues/BUG-{NNN}-{name}.md`
- Bug collector runs at Phase 05: Moves to `{feature}/05-testing/issue-resolution/`
- Creates symlinks in original for context

**Maturity Phase** (v1.0.0+):
- Create bugs in: `{feature}/10-bugs/BUG-{NNN}-{name}/`
- Full 5-phase lifecycle per bug

## Examples

### Example Bug: Login Failure

```
/docs/bugs/active/BUG-001-login-failure/
├── metadata.json
├── 00-investigation/
│   ├── investigation-report.md
│   ├── reproduction-steps.md
│   └── error-logs.txt
├── 01-planning/
│   ├── fix-strategy.md
│   └── risk-assessment.md
├── 02-implementation/
│   ├── code-changes.md
│   └── test-plan.md
├── 03-validation/
│   ├── test-results.md
│   └── qa-signoff.md
└── 04-post-mortem/
    └── post-mortem-report.md
```

## Related Documentation

- **Feature Lifecycle**: `/FEATURE_LIFECYCLE.md`
- **Work Lifecycle**: `/docs/WORK_LIFECYCLE.md`
- **Arbor Workflows**: `/ARBOR_WORKFLOWS.md`

---

**Scope**: All bugs, mandatory compliance
