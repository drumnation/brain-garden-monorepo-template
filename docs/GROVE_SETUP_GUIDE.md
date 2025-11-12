# GROVE Planning Infrastructure Setup Guide

**Version**: 1.0
**Last Updated**: 2025-11-12

## Overview

This monorepo template includes the complete GROVE (Growth-Oriented Validation & Evolution) planning infrastructure from Brain Garden. This guide explains how to use the planning system for your projects.

## What is GROVE?

GROVE is a comprehensive planning and documentation system that ensures all work is properly tracked, documented, and quality-controlled. It supports 5 work types:

1. **Features** - New functionality (10-phase lifecycle)
2. **Bugs** - Fixing broken functionality (5-phase lifecycle)
3. **Enhancements** - Improvements to existing features (4-phase lifecycle)
4. **Maintenance** - Code health and infrastructure (type-specific lifecycles)
5. **Borg Assimilations** - Integrating external code (5-phase lifecycle)

## Directory Structure

```
/docs/
├── features/              # All features (10-phase structure)
├── bugs/                  # Bug tracking (5-phase structure)
│   ├── active/            # Currently being worked on
│   └── resolved/          # Fixed bugs
├── borg/                  # External code integrations
│   └── assimilations/
│       ├── active/        # Active assimilations
│       └── completed/     # Completed assimilations
├── project/               # Project-level configuration
│   ├── config/            # Master config and lane configs
│   │   ├── lanes/         # Multi-agent lane configurations
│   │   ├── .conflicts/    # Agent coordination conflicts
│   │   └── .swarm/        # Swarm messaging registry
│   ├── work-registry.json # Central work registry
│   └── work-registry-schema.json # Registry schema
├── templates/             # Templates for all work types
│   ├── feature/
│   ├── bug/
│   ├── enhancement/
│   ├── maintenance/
│   └── borg/
└── WORK_LIFECYCLE.md      # Work type classification guide
```

## Core Documentation Files

### Root Level
- `/FEATURE_LIFECYCLE.md` - Complete feature lifecycle documentation
- `/ARBOR_WORKFLOWS.md` - Automated planning workflows
- `/docs/WORK_LIFECYCLE.md` - All work types and classification

### System-Specific
- `/docs/bugs/README.md` - Bug tracking system
- `/docs/borg/README.md` - Borg assimilation system

## Quick Start: Creating Your First Feature

### 1. Create Feature Structure

```bash
# Create feature directory
mkdir -p docs/features/my-awesome-feature

# Create all phase folders
cd docs/features/my-awesome-feature
mkdir 00-research 01-planning 02-architecture 03-implementation-planning
mkdir 04-development 05-testing 06-documentation 07-deployment 08-post-launch
```

### 2. Write PRD

Copy the template and fill it out:

```bash
cp docs/templates/feature/PRD-template.md docs/features/my-awesome-feature/01-planning/PRD.md
# Edit the PRD with your feature requirements
```

### 3. Use Arbor for Planning (Optional)

If you have Arbor skills available:

```bash
# Generate phase overview
/skill arbor-phase-planning

# Generate detailed phase plans
/skill arbor-plan-generation

# Verify planning quality
/skill arbor-verification
```

**Quality Threshold**: ≥85/100 required before implementation

### 4. Begin Development

Once planning is complete:

```bash
# Start Phase 04: Development
cd docs/features/my-awesome-feature/04-development

# Create your code
# Document progress in this phase folder
```

## Quick Start: Tracking a Bug

### 1. Create Bug Directory

```bash
# Choose next bug number (e.g., BUG-001)
mkdir -p docs/bugs/active/BUG-001-login-failure

# Create phase folders
cd docs/bugs/active/BUG-001-login-failure
mkdir 00-investigation 01-planning 02-implementation 03-validation 04-post-mortem
```

### 2. Create Metadata

```bash
cp docs/templates/bug/metadata-template.json metadata.json
# Edit metadata with bug details
```

### 3. Investigate and Plan

```bash
# Document investigation in 00-investigation/
# Run arbor-bug-planning (if available)
# Verify with arbor-bug-verification (threshold: ≥80/100)
```

### 4. Fix and Validate

```bash
# Implement fix in 02-implementation/
# Validate in 03-validation/
# Document lessons in 04-post-mortem/
```

### 5. Resolve

```bash
# Move to resolved when complete
mv docs/bugs/active/BUG-001-login-failure docs/bugs/resolved/
```

## Work Registry

Track all work in the central registry:

```bash
# Location
docs/project/work-registry.json

# Schema
docs/project/work-registry-schema.json
```

**Example Entry**:
```json
{
  "features": [
    {
      "id": "my-awesome-feature",
      "name": "My Awesome Feature",
      "type": "feature",
      "status": "in-progress",
      "currentPhase": "04-development",
      "version": "v0.3.0",
      "path": "/docs/features/my-awesome-feature"
    }
  ]
}
```

## Quality Thresholds

All work types have minimum quality thresholds (via Arbor verification):

| Work Type | Threshold | Tool |
|-----------|-----------|------|
| Feature | ≥85/100 | `arbor-verification` |
| Bug | ≥80/100 | `arbor-bug-verification` |
| Enhancement | ≥75/100 | `arbor-enhancement-verification` |
| Maintenance | 75-90/100 | `arbor-maintenance-verification` |
| Borg | ≥80/100 | `arbor-borg-verification` |

**Quality gates BLOCK implementation** until threshold met.

## Feature Versioning

Features follow semantic versioning:

### MVP Phase (v0.x.x → v1.0.0)
- **v0.1.0**: Initial prototype
- **v0.2.0**: Alpha (Phase 04 complete)
- **v0.3.0**: Beta (Phase 05 complete)
- **v1.0.0**: Launch (Phase 08 complete)

### Maturity Phase (v1.0.0+)
- **MAJOR** (v2.0.0): Breaking changes
- **MINOR** (v1.1.0): New features, enhancements
- **PATCH** (v1.0.1): Bug fixes

## Multi-Agent Coordination

The GROVE system supports multiple agents working in parallel:

### Lane System
- **4 Lanes Available**: Foundation, Integration, Testing, Ad-Hoc
- **Lane Configs**: `/docs/project/config/lanes/lane-{n}-{name}.json`
- **Master Config**: `/docs/project/config/config.json`

### Swarm Messaging
- **Registry**: `/docs/project/config/.swarm/`
- **Purpose**: Real-time agent coordination
- **Capabilities**: File locks, dependency signaling, peer discovery

### Conflict Detection
- **Registry**: `/docs/project/config/.conflicts/`
- **Purpose**: Prevent duplicate work
- **Detection**: File overlaps, feature dependencies, shared components

## Planning Audit

Run periodic audits to ensure compliance:

```bash
# Full audit
/planning-audit

# Audit-only (no changes)
/planning-audit --audit-only

# Features only
/planning-audit --scope features

# Aggressive cleanup
/planning-audit --aggressive
```

**Configuration**: `/docs/project/config/planning-audit-config.json`

## Templates

Use templates for consistency:

### Feature Templates
- `PRD-template.md` - Product Requirements Document
- `design-template.md` - Technical Design
- `user-story-template.md` - User Stories

### Bug Templates
- `metadata-template.json` - Bug Metadata
- `investigation-template.md` - Investigation Report
- `post-mortem-template.md` - Post-Mortem Report

### Borg Templates
- `metadata-template.json` - Borg Metadata
- `integration-plan-template.md` - Integration Plan

## Best Practices

### 1. Always Use GROVE
- **NO work outside GROVE system** - Prevents lost documentation
- **ALL work types tracked** - Ensures complete audit trail
- **Quality gates enforced** - Maintains high standards

### 2. Follow Lifecycles
- **Features**: 10-phase structure (00-09)
- **Bugs**: 5-phase structure (00-04)
- **Enhancements**: 4-phase structure (00-03)
- **Maintenance**: Type-specific structure
- **Borg**: 5-phase structure (00-04)

### 3. Quality First
- **Never bypass quality gates** without emergency justification
- **Document all emergency bypasses** in `.ephemeral/quality-gate-bypass.log`
- **Require retroactive improvement** within 24 hours

### 4. Use Arbor
- **Automated planning** saves time and improves quality
- **Consistent structure** across all work types
- **Verification reports** provide actionable feedback

### 5. Coordinate with Agents
- **Check master config** before starting work
- **Register in swarm** for peer-to-peer coordination
- **Use lane configs** for multi-agent workflows

## Troubleshooting

### Q: Where do I put my code?
**A**: In the feature's `04-development/` folder or app-specific `src/` folder, depending on whether it's feature documentation or actual implementation.

### Q: Do I really need all these folders?
**A**: Yes, for comprehensive documentation. But you can start minimal and expand as needed.

### Q: What if I don't have Arbor skills?
**A**: You can create planning artifacts manually using templates, but Arbor provides automated quality verification.

### Q: Can I skip quality gates?
**A**: Only in documented emergencies. Always require retroactive improvement within 24 hours.

### Q: How do I know which work type to use?
**A**: See `/docs/WORK_LIFECYCLE.md` decision tree.

## Integration with Existing Workflows

GROVE complements your existing monorepo setup:

- **Does NOT replace** your code organization (`/apps`, `/packages`)
- **DOES add** comprehensive planning and documentation
- **Works alongside** your existing tools (Turbo, pnpm, TypeScript)
- **Enhances** multi-agent collaboration and quality control

## Next Steps

1. **Read Core Documentation**:
   - `/FEATURE_LIFECYCLE.md`
   - `/docs/WORK_LIFECYCLE.md`
   - `/ARBOR_WORKFLOWS.md`

2. **Create Your First Feature**:
   - Follow the Quick Start above
   - Use templates from `/docs/templates/`

3. **Set Up Multi-Agent Coordination** (if needed):
   - Configure master config
   - Create lane configs
   - Enable swarm messaging

4. **Run Planning Audit**:
   - Weekly audits recommended
   - Maintains compliance
   - Catches issues early

---

**For Questions**: See documentation in `/docs/` or consult `/docs/WORK_LIFECYCLE.md`

**Template Version**: 1.0 (Brain Garden GROVE System)
