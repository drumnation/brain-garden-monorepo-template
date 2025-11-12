# Borg Assimilation System

**Version**: 1.0
**Last Updated**: 2025-11-12

## Overview

The Borg Assimilation System handles integration of external code, libraries, and repositories into the monorepo. Every external code integration MUST be documented and tracked through the Borg workflow.

## Borg Lifecycle (5 Phases)

```
/docs/borg/assimilations/active/BORG-{NNN}-{repo-name}/
  ├── 00-assessment/          # Analysis and decision
  ├── 01-planning/            # Integration strategy
  ├── 02-integration/         # Implementation
  ├── 03-validation/          # Verification
  └── 04-upstream-tracking/   # Ongoing monitoring
```

## Integration Strategies

### 1. Library (NPM Install)
**When**: Stable, well-maintained packages
**Approach**: Standard dependency installation
**Example**: `pnpm add express`

### 2. Fork (Git Fork + Customize)
**When**: Need modifications but want upstream updates
**Approach**: Fork repository, apply customizations
**Example**: Forking UI library for branding

### 3. Copy-Adapt (Copy Source + Modify)
**When**: Small utilities, one-time integration
**Approach**: Copy source files, adapt to our patterns
**Example**: Single utility function from StackOverflow

## Borg Workflow

### Phase 00: Assessment
**Purpose**: Analyze external code and decide integration strategy
**Deliverables**:
- Repository analysis
- License compliance check
- Security audit (CVE scan)
- Build vs. Adopt recommendation
- Integration strategy decision

**Assessment Artifacts** (from `/borg` command):
1. `profile.md` - Project overview and metadata
2. `architecture.md` - Technical architecture analysis
3. `quality.md` - Code quality assessment
4. `integration.md` - Integration complexity analysis
5. `recommendation.md` - Build vs. Adopt decision

### Phase 01: Planning
**Purpose**: Design integration approach
**Deliverables**:
- Integration plan
- Dependency mapping
- Customization requirements
- Migration strategy
- Risk mitigation

**Planning Artifacts** (from `arbor-borg-planning`):
1. `integration-plan.md` - Complete integration strategy
2. `dependency-mapping.md` - External dependencies analysis
3. `customization-requirements.md` - Modifications needed
4. `migration-strategy.md` - Step-by-step migration
5. `risk-mitigation.md` - Risk assessment and mitigation

**Quality Verification**: `arbor-borg-verification` (≥80/100 threshold)

### Phase 02: Integration
**Purpose**: Execute integration
**Deliverables**:
- Installed/forked/copied code
- Configuration changes
- Adapter code for our patterns
- Documentation updates

### Phase 03: Validation
**Purpose**: Verify integration
**Deliverables**:
- Integration tests
- Security validation
- License compliance verification
- Performance benchmarks

### Phase 04: Upstream Tracking
**Purpose**: Monitor upstream changes
**Deliverables**:
- Upstream monitoring setup
- Security alert subscription
- Update strategy
- Deprecation tracking

## Borg Naming Convention

**Format**: `BORG-{NNN}-{repo-name}`

**Examples**:
- `BORG-001-express`
- `BORG-023-react-query`
- `BORG-047-utility-helpers`

## Borg Metadata

Every assimilation must have a `metadata.json` file:

```json
{
  "borgId": "BORG-001",
  "repositoryName": "express",
  "repositoryUrl": "https://github.com/expressjs/express",
  "license": "MIT",
  "version": "4.18.2",
  "integrationStrategy": "library",
  "status": "active",
  "assessmentDate": "2025-11-12",
  "integrationDate": null,
  "assignedTo": "agent-name",
  "upstreamMonitoring": {
    "enabled": true,
    "lastChecked": null,
    "securityAlerts": []
  },
  "customizations": [],
  "dependencies": ["body-parser", "cookie-parser"],
  "tags": ["backend", "framework", "express"]
}
```

## Creating a New Borg Assimilation

```bash
# 1. Run Borg assessment
/borg {repository-url}

# 2. Create Borg directory
mkdir -p /docs/borg/assimilations/active/BORG-{NNN}-{repo-name}

# 3. Create phase folders
cd /docs/borg/assimilations/active/BORG-{NNN}-{repo-name}
mkdir 00-assessment 01-planning 02-integration 03-validation 04-upstream-tracking

# 4. Move assessment artifacts to 00-assessment/
mv /docs/borg/.borg-analyses/BORG-{NNN}-{repo-name}/*.md 00-assessment/

# 5. Run Borg planning
# Invoke arbor-borg-planning skill

# 6. Verify planning quality
# Invoke arbor-borg-verification skill (must be ≥80/100)
```

## Integration with Arbor

**Arbor Skills**:
- `arbor-borg-planning` - Generate integration planning
- `arbor-borg-verification` - Validate planning quality (≥80/100)

**Auto-Triggering**: `/borg` command → assessment → `arbor-borg-planning` → `arbor-borg-verification`

## License Compliance

**Permitted Licenses** (for library/fork strategies):
- MIT
- Apache 2.0
- BSD (2-clause, 3-clause)
- ISC

**Restricted Licenses** (require legal review):
- GPL (any version) - Copyleft implications
- AGPL - Network copyleft
- Custom licenses - Legal review needed

**Forbidden Licenses**:
- Proprietary without permission
- No license specified

## Security Audit

**CVE Scanning**: All external code scanned for known vulnerabilities
**Dependency Audit**: Check transitive dependencies
**Code Review**: Manual review of critical paths
**Ongoing Monitoring**: Subscribe to security advisories

## Upstream Tracking Strategy

**For Library Integrations**:
- Subscribe to repository releases
- Monitor security advisories
- Track deprecation notices
- Plan update cycles

**For Forks**:
- Track upstream commits
- Merge upstream updates regularly
- Document customizations
- Maintain update strategy

**For Copy-Adapt**:
- Document source origin
- Monitor original for updates
- Consider migration path to library

## Borg States

- **Active** (`/docs/borg/assimilations/active/`) - Currently integrated and maintained
- **Completed** (`/docs/borg/assimilations/completed/`) - Integration finished, archived

## Examples

### Example: Express Integration

```
/docs/borg/assimilations/active/BORG-001-express/
├── metadata.json
├── 00-assessment/
│   ├── profile.md
│   ├── architecture.md
│   ├── quality.md
│   ├── integration.md
│   └── recommendation.md
├── 01-planning/
│   ├── integration-plan.md
│   ├── dependency-mapping.md
│   ├── customization-requirements.md
│   ├── migration-strategy.md
│   └── risk-mitigation.md
├── 02-integration/
│   ├── installation.md
│   ├── configuration.md
│   └── adapter-code.md
├── 03-validation/
│   ├── integration-tests.md
│   ├── security-validation.md
│   └── performance-benchmarks.md
└── 04-upstream-tracking/
    ├── monitoring-setup.md
    └── update-strategy.md
```

## Build vs. Adopt Decision Framework

**Adopt** (integrate external code) when:
- Mature, well-maintained project
- Active community and support
- Meets our quality standards
- License compatible
- Integration cost < build cost

**Build** (create ourselves) when:
- Specific requirements not met
- Security concerns
- License incompatibility
- High integration complexity
- Core business logic

## Related Documentation

- **Feature Lifecycle**: `/FEATURE_LIFECYCLE.md`
- **Work Lifecycle**: `/docs/WORK_LIFECYCLE.md`
- **Arbor Workflows**: `/ARBOR_WORKFLOWS.md`
- **Borg Command**: `/.claude/COMMANDS.md#borg`

---

**Scope**: All external code integrations, mandatory compliance
