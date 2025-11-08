---
title: "Database Architecture"
description: "Database architecture and data persistence strategy for PM Agent"
keywords: [database, architecture, sqlite, electron, data-model, persistence, api]
last_updated: "2025-11-08"
status: "ACTIVE DOCUMENTATION - Reflects Actual Implementation"
---

# Database Architecture

## 1. Overview

The Dev Garden PM Agent uses SQLite as the primary database for tracking project metadata, quality metrics, development sessions, and motivation data. The database is actively used and contains comprehensive tracking for 177+ projects in the Dev workspace.

**Current State:**
- **Database:** ✅ **IMPLEMENTED** at `/Users/dmieloch/Dev/.pm-agent/db/pm-agent.db`
- **Size:** 1MB (active with project data)
- **Engine:** SQLite 3 with WAL mode enabled
- **Driver:** better-sqlite3 (Node.js)
- **Schema:** Comprehensive 37+ tables/views tracking all project aspects

**Architecture:**
- **Local Storage:** SQLite database in `.pm-agent/db/` directory
- **Data Model:** Relational model with 37+ tables, views, and triggers
- **Access Pattern:** Repository pattern with hexagonal architecture (planned)
- **Schema Files:** Multiple schema files for different subsystems

## 2. Technology Stack

### Planned Technologies

| Component | Technology | Purpose | Status |
|-----------|-----------|---------|---------|
| **Local Database** | SQLite | Development and desktop app | Planned |
| **Production Database** | PostgreSQL | Cloud deployment | Future |
| **ORM/Query Builder** | Prisma | Type-safe database access | Planned |
| **Migration Tool** | Prisma Migrate | Schema versioning | Planned |
| **Database Client** | better-sqlite3 | SQLite driver | Planned |

## 3. Planned Database Schema

### Core Tables Design

The database will track project management data with the following core entities:

#### Projects Table
```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  path TEXT NOT NULL UNIQUE,
  description TEXT,
  status TEXT CHECK(status IN ('active', 'on-hold', 'archived')),
  origin_type TEXT CHECK(origin_type IN ('created', 'forked', 'cloned')),
  ownership TEXT CHECK(ownership IN ('mine', 'customized-fork', 'exploring')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_worked_on DATETIME,
  repository_url TEXT,
  deployed_url TEXT
);
```

#### Quality Metrics Table
```sql
CREATE TABLE quality_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  quality_score INTEGER CHECK(quality_score BETWEEN 0 AND 100),
  test_coverage INTEGER CHECK(test_coverage BETWEEN 0 AND 100),
  has_tests BOOLEAN DEFAULT FALSE,
  has_ci_cd BOOLEAN DEFAULT FALSE,
  has_documentation BOOLEAN DEFAULT FALSE,
  documentation_score INTEGER CHECK(documentation_score BETWEEN 0 AND 100),
  linting_score INTEGER CHECK(linting_score BETWEEN 0 AND 100),
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### Sessions Table
```sql
CREATE TABLE development_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  session_id TEXT UNIQUE,
  started_at DATETIME NOT NULL,
  ended_at DATETIME,
  duration_minutes INTEGER,
  tokens_used INTEGER,
  goals TEXT, -- JSON array
  accomplishments TEXT, -- JSON array
  blockers TEXT, -- JSON array
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### Features Table
```sql
CREATE TABLE features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK(status IN ('planned', 'in_progress', 'completed', 'blocked')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### Todos Table
```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER,
  content TEXT NOT NULL,
  active_form TEXT,
  status TEXT CHECK(status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  session_id TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);
```

### Planned Indexes

```sql
-- Performance indexes
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_last_worked ON projects(last_worked_on DESC);
CREATE INDEX idx_quality_project ON quality_metrics(project_id);
CREATE INDEX idx_sessions_project ON development_sessions(project_id);
CREATE INDEX idx_features_project_status ON features(project_id, status);
CREATE INDEX idx_todos_status ON todos(status);
CREATE INDEX idx_todos_session ON todos(session_id);
```

## 4. Data Access Layer

### Repository Pattern Implementation

The data access layer will follow the repository pattern to abstract database operations:

```typescript
// packages/core-projects/src/project.repo.ts
export interface ProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: number): Promise<Project | null>;
  findByName(name: string): Promise<Project | null>;
  create(project: CreateProjectDto): Promise<Project>;
  update(id: number, updates: UpdateProjectDto): Promise<Project>;
  delete(id: number): Promise<boolean>;

  // Complex queries
  findActiveProjects(): Promise<Project[]>;
  findProjectsWithQuality(): Promise<ProjectWithQuality[]>;
  searchProjects(query: string): Promise<Project[]>;
}

// Implementation with Prisma (planned)
export class PrismaProjectRepository implements ProjectRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Project[]> {
    return this.prisma.project.findMany({
      orderBy: { lastWorkedOn: 'desc' }
    });
  }

  async findProjectsWithQuality(): Promise<ProjectWithQuality[]> {
    return this.prisma.project.findMany({
      include: {
        qualityMetrics: {
          orderBy: { calculatedAt: 'desc' },
          take: 1
        }
      }
    });
  }
}
```

## 5. Migration Strategy

### Version Control for Schema

All database migrations will be tracked in version control:

```
db/migrations/
├── 001_initial_schema.sql
├── 002_add_sessions_table.sql
├── 003_add_features_table.sql
├── 004_add_todos_table.sql
└── 005_add_indexes.sql
```

### Migration Workflow

```typescript
// db/migrate.ts
export async function runMigrations() {
  const db = new Database('./pm-agent.db');
  const migrations = await loadMigrations('./db/migrations');

  for (const migration of migrations) {
    if (!await isApplied(db, migration.version)) {
      await applyMigration(db, migration);
      await recordMigration(db, migration.version);
    }
  }
}
```

## 6. Data Storage Strategy

### Local Database (.pm-agent/db/)

The local SQLite database will store:

1. **Project Metadata**
   - Basic project information
   - Status and lifecycle data
   - File system paths

2. **Quality Metrics**
   - Test coverage percentages
   - Documentation scores
   - Code quality metrics

3. **Development History**
   - Session tracking
   - Feature completion
   - Todo items

4. **Motivation Data**
   - Effort metrics
   - Progress tracking
   - Accomplishments

### File System Storage

Some data will remain in the file system for performance:

```
.pm-agent/
├── db/
│   └── pm-agent.db          # SQLite database
├── screenshots/             # Image files
│   └── [project-name]/
├── knowledge/              # Markdown files
│   ├── patterns/
│   └── insights/
└── cache/                  # Temporary data
    └── quality-checks/
```

## 7. Database Access Architecture

### Recommended: Electron-Owned Database with Local API

**PM Agent uses a desktop-first architecture** where Electron owns the database and exposes it via multiple interfaces:

```
┌─────────────────────────────────────────┐
│   Electron Main Process (DB Owner)     │
│   ┌───────────────────────────────┐   │
│   │   SQLite Database             │   │
│   │   .pm-agent/db/pm-agent.db    │   │
│   └───────────────────────────────┘   │
│              ▲                          │
│              │                          │
│   ┌──────────┴──────────┐              │
│   │                     │              │
│   │  IPC Handlers   Express Server    │
│   │  (Renderer)     (localhost:8080)   │
└───┼─────────────────────┼───────────────┘
    │                     │
    ▼                     ▼
Electron UI          Claude Scripts
(React App)         (CLI Tools)
```

**Why This Works:**
1. ✅ **Single DB Owner** - Electron has exclusive write access (no conflicts)
2. ✅ **Scripts Work** - HTTP API at `http://localhost:8080` for scripts
3. ✅ **Fast UI** - Electron renderer uses IPC (no HTTP overhead)
4. ✅ **No Remote DB Needed** - Everything runs locally
5. ✅ **Future-Proof** - Can add cloud sync later without architecture change

### Implementation

#### Electron Main Process (DB Owner)

```typescript
// apps/desktop/src/main/database.ts
import Database from 'better-sqlite3';
import express from 'express';

export class DatabaseService {
  private db: Database.Database;
  private apiServer: express.Application;

  constructor() {
    this.db = this.initializeDatabase();
    this.startLocalAPI();
  }

  private initializeDatabase(): Database.Database {
    const dbPath = '/Users/dmieloch/Dev/.pm-agent/db/pm-agent.db';

    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL'); // Better concurrency
    db.pragma('foreign_keys = ON');

    return db;
  }

  // Expose via IPC for Electron renderer
  registerIpcHandlers() {
    ipcMain.handle('db:getProjects', () => {
      return this.db.prepare('SELECT * FROM projects').all();
    });

    ipcMain.handle('db:updateProject', (event, id, data) => {
      return this.db.prepare(
        'UPDATE projects SET name = ?, purpose = ? WHERE id = ?'
      ).run(data.name, data.purpose, id);
    });
  }

  // Expose via HTTP for scripts
  private startLocalAPI() {
    this.apiServer = express();
    this.apiServer.use(express.json());

    // GET /api/projects
    this.apiServer.get('/api/projects', (req, res) => {
      const projects = this.db.prepare('SELECT * FROM projects').all();
      res.json(projects);
    });

    // POST /api/projects/scan
    this.apiServer.post('/api/projects/scan', async (req, res) => {
      // Run project scan logic
      const result = await scanDevFolder(this.db);
      res.json(result);
    });

    // Start server on localhost only
    this.apiServer.listen(8080, 'localhost', () => {
      console.log('PM Agent API running at http://localhost:8080');
    });
  }

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    return this.db.prepare(sql).all(params);
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    this.db.prepare(sql).run(params);
  }

  transaction<T>(fn: () => T): T {
    return this.db.transaction(fn)();
  }
}
```

#### Scripts Access via HTTP

```typescript
// packages/pm-scripts/src/scan-projects.ts
import fetch from 'node-fetch';

const PM_AGENT_API = 'http://localhost:8080';

async function scanProjects() {
  const response = await fetch(`${PM_AGENT_API}/api/projects/scan`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Electron app must be running to scan projects');
  }

  const result = await response.json();
  console.log(`Scanned ${result.projectsFound} projects`);
}
```

#### Manual Claude Code Updates

```bash
# Option 1: Use the HTTP API (when Electron is running)
curl -X POST http://localhost:8080/api/projects/scan

# Option 2: Direct SQLite access (when Electron is NOT running)
sqlite3 /Users/dmieloch/Dev/.pm-agent/db/pm-agent.db \
  "UPDATE projects SET lifecycle='paused' WHERE name='old-project'"
```

### Connection Management

**SQLite WAL Mode** allows:
- ✅ Multiple readers simultaneously
- ✅ One writer at a time
- ✅ Readers don't block writer
- ✅ Writer doesn't block readers (mostly)

**Rules:**
1. **When Electron is running** - Use HTTP API for all script updates
2. **When Electron is NOT running** - Direct SQLite access is safe
3. **Never** - Have both Electron AND scripts write simultaneously
```

## 8. Caching Strategy

### Query Result Caching

Frequently accessed data will be cached in memory:

```typescript
// packages/core-cache/src/cache.service.ts
export class CacheService {
  private cache: Map<string, CacheEntry>;
  private ttl: number = 5 * 60 * 1000; // 5 minutes default

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttl?: number): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + (ttl || this.ttl)
    });
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    // Invalidate keys matching pattern
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}
```

## 9. Backup & Recovery

### Automated Backups

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR=".pm-agent/backups"
DB_FILE=".pm-agent/db/pm-agent.db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup
sqlite3 $DB_FILE ".backup $BACKUP_DIR/pm-agent_$TIMESTAMP.db"

# Keep only last 7 backups
find $BACKUP_DIR -name "pm-agent_*.db" -mtime +7 -delete
```

### Recovery Process

```typescript
// Restore from backup
export async function restoreDatabase(backupPath: string): Promise<void> {
  const currentDb = '.pm-agent/db/pm-agent.db';
  const backupDb = `.pm-agent/db/pm-agent.db.backup-${Date.now()}`;

  // Backup current database
  await copyFile(currentDb, backupDb);

  try {
    // Restore from backup
    await copyFile(backupPath, currentDb);

    // Verify integrity
    const db = new Database(currentDb);
    db.pragma('integrity_check');

  } catch (error) {
    // Rollback on failure
    await copyFile(backupDb, currentDb);
    throw error;
  }
}
```

## 10. Performance Considerations

### Optimization Strategies

1. **Indexing**
   - Index frequently queried columns
   - Composite indexes for common join patterns

2. **Query Optimization**
   - Use prepared statements
   - Batch operations where possible
   - Limit result sets with pagination

3. **Connection Pooling**
   - Reuse database connections
   - Configure appropriate pool size

4. **Data Archival**
   - Archive old sessions periodically
   - Compress historical data

## 11. Common Questions & Decisions

### Q: Can Claude Code update the database manually?
**A: Yes, two ways:**
1. **When Electron is running**: Use HTTP API
   ```bash
   curl -X POST http://localhost:8080/api/projects/scan
   ```
2. **When Electron is NOT running**: Direct SQLite access
   ```bash
   sqlite3 .pm-agent/db/pm-agent.db "UPDATE projects SET ..."
   ```

### Q: Can scripts update the database?
**A: Yes, via HTTP API (preferred) or direct SQLite (fallback)**
```typescript
// Preferred: Use HTTP API
await fetch('http://localhost:8080/api/projects/scan', { method: 'POST' });

// Fallback: Direct DB (only when Electron not running)
const db = new Database('.pm-agent/db/pm-agent.db');
db.prepare('UPDATE projects SET ...').run();
```

### Q: Does Electron need access to the database?
**A: Yes, and it OWNS the database!**
- Electron main process has exclusive write access
- Renderer gets data via IPC (fast, no HTTP overhead)
- This prevents conflicts and corruption

### Q: Should we use a seed file instead?
**A: No - Database is better because:**
- ❌ Seed file = static snapshot (stale immediately)
- ❌ Need to regenerate constantly
- ❌ Loses relationships, triggers, views
- ✅ Database = live, relational, with triggers
- ✅ Can query/filter/aggregate
- ✅ Supports 177+ projects efficiently

### Q: Does database need to be outside Electron to serve an API?
**A: No! Electron CAN run Express internally**
```typescript
// In Electron main process
import express from 'express';

const app = express();
app.listen(8080, 'localhost'); // ← Electron runs this!
```
Many Electron apps do this (VS Code, Postman, etc.)

### Q: Do we need a remote database?
**A: Not yet - local SQLite is perfect for PM Agent**

**Current (Local-First):**
```
Electron ──> SQLite DB (1MB, fast, 177 projects) ✅
```

**Future (Optional Cloud Sync):**
```
Electron ──> SQLite DB ──┐
                         ├──> Cloud Sync Service
Web App ──> PostgreSQL ──┘
```

**When to add remote DB:**
- ❌ Not needed now (SQLite handles 177 projects easily)
- ✅ Add later when you want:
  - Multi-device sync
  - Web-only access (no Electron)
  - Team collaboration

### Q: What if Electron and a script write simultaneously?
**A: SQLite WAL mode handles this gracefully**
- One writer succeeds
- Other writer gets "SQLITE_BUSY" error
- Solution: Script should check if Electron is running:
  ```typescript
  // Try HTTP API first
  try {
    await fetch('http://localhost:8080/api/projects');
  } catch {
    // Electron not running, safe for direct DB access
    const db = new Database('.pm-agent/db/pm-agent.db');
  }
  ```

## 12. Future Enhancements

### Planned Features

1. **Cloud Sync (Optional)**
   - Sync local SQLite to PostgreSQL
   - Conflict resolution for multi-device
   - Background sync worker

2. **Real-time Updates**
   - WebSocket updates for live data
   - Optimistic UI updates in Electron
   - Event-driven refresh

3. **Advanced Analytics**
   - Time-series data for metrics
   - Aggregated project insights
   - Trend analysis dashboard

4. **Data Export/Import**
   - JSON export for backup
   - CSV export for analysis
   - Project template import/export

## Related Documentation

- [System Overview](./system-overview.md) - High-level architecture
- [Backend Architecture](./backend.md) - API server and data access
- [PM Agent SQLite Patterns](../../.cursor/rules-source-builder/pm-agent-sqlite-patterns.rules.mdc) - Detailed patterns
- [Three Phase Roadmap](../goals/THREE_PHASE_ROADMAP.md) - Implementation timeline

---

**Last Updated:** 2025-11-08
**Status:** Active Documentation (Planning Phase)