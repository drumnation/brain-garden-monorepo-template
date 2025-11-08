---
title: Mega Setup Guide
description: Complete guide to using the mega setup system for rapid project initialization
keywords: [setup, guide, monorepo, initialization, scaffolding]
last_updated: 2025-10-23
---

# Mega Setup Guide

## Overview

The mega setup system provides a guided, automated way to initialize Brain Garden monorepo projects in minutes.

**What it does:**
- ⚡ Interactive discovery (BMAD-style questions)
- 📝 PRD generation from templates
- ⚙️ Automated code generation
- 📚 Complete documentation creation
- 🎯 Smart rules recommendation
- ✅ Quality validation
- 📊 Setup summary with next steps

## Quick Start

```bash
cd my-monorepo
pnpm setup:mega
```

Answer the questions, wait 3-5 minutes, and your project is ready!

## Prerequisites

- Node.js 18+
- pnpm 8+
- 4GB+ disk space

## Interactive Process

### Questions You'll Answer

**Basic Info:**
- Project name
- Description
- Package scope (@yourorg)

**Project Type (multi-select):**
- [ ] Web App (React)
- [ ] Mobile App (React Native)  
- [ ] Desktop App (Electron)
- [ ] API/Backend (Express)

**Tech Stack:**
- Frontend: React framework, UI library, state management
- Backend: Express/Fastify, database, auth method

**Features:**
- Authentication, database, file uploads, real-time, email, payments, admin, API docs

**Deployment:**
- Vercel, AWS, Heroku, self-hosted, or undecided

## What Gets Generated

```
my-monorepo/
├── apps/
│   ├── web/                 # If selected
│   ├── mobile/              # If selected
│   ├── desktop/             # If selected
│   └── api/                 # If selected
├── packages/
│   └── shared-utils/        # Always
├── docs/
│   ├── architecture/
│   │   ├── prd.md          # Generated PRD
│   │   └── system-overview.md
│   └── guides/
│       └── mega-setup-guide.md
├── README.md                # Updated
├── CHANGELOG.md             # Updated
└── SETUP_SUMMARY.md         # Created
```

## Project Type Examples

### Full-Stack Web App

**Select:** Web + API  
**Gets:** React app + Express backend + PostgreSQL  
**Use for:** SaaS, dashboards, web platforms

### Mobile-First

**Select:** Mobile + API  
**Gets:** React Native + Express + MongoDB  
**Use for:** Consumer apps, enterprise mobile

### Multi-Platform

**Select:** Web + Mobile + Desktop + API  
**Gets:** All platforms + shared packages  
**Use for:** Products with multiple clients

## After Setup

### 1. Review Documentation

- `SETUP_SUMMARY.md` - What was generated
- `docs/architecture/prd.md` - Requirements
- `docs/architecture/system-overview.md` - Architecture

### 2. Start Development

```bash
pnpm dev        # Start all apps
pnpm test       # Run tests
pnpm build      # Build for production
```

### 3. Customize

All generated code is fully editable:
- Modify components
- Add API endpoints
- Update documentation
- Add new features

## Validation

The setup runs `pnpm brain:validate` which checks:
- TypeScript compilation
- ESLint rules
- Prettier formatting
- Test execution

Auto-fixes are attempted for formatting and linting issues.

## Troubleshooting

**Generator fails:**
- Check Node.js version (18+)
- Ensure disk space available
- Review error messages

**Validation fails:**
- Review `_errors/validation-summary.md`
- Run `pnpm format --write`
- Run `pnpm lint --fix`
- Fix remaining issues manually

**Port conflicts:**
- Update port in app configuration
- Or stop conflicting services

## Best Practices

**Before setup:**
- Plan your architecture
- Know your tech preferences
- Understand requirements

**During setup:**
- Answer carefully
- Select only needed features
- Note validation issues

**After setup:**
- Review all generated files
- Read PRD and system overview
- Commit initial setup
- Start incremental development

## Need Help?

- This guide: `docs/guides/mega-setup-guide.md`
- Template usage: `docs/guides/TEMPLATE_USAGE.md`
- System overview: `docs/architecture/system-overview.md`

---

**Ready to start? Run `pnpm setup:mega` now!**
