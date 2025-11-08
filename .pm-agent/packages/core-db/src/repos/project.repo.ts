import type { DbClient } from '../db.client.js';
import type { Project, ProjectListFilters, ProjectStats } from '../types.js';

export interface ProjectRepo {
  findById: (id: number) => Promise<Project | null>;
  findByPath: (path: string) => Promise<Project | null>;
  list: (filters?: ProjectListFilters) => Promise<Project[]>;
  create: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<Project>;
  update: (id: number, updates: Partial<Project>) => Promise<Project | null>;
  delete: (id: number) => Promise<boolean>;
  getStats: () => Promise<ProjectStats>;
  upsertByPath: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<Project>;
}

/**
 * Create a project repository with all CRUD operations
 * Pure factory function following functional DI pattern
 */
export const makeProjectRepo = (deps: { db: DbClient }): ProjectRepo => {
  const { db } = deps.db;

  const findById = async (id: number): Promise<Project | null> => {
    const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
    return stmt.get(id) as Project | null;
  };

  const findByPath = async (path: string): Promise<Project | null> => {
    const stmt = db.prepare('SELECT * FROM projects WHERE path = ?');
    return stmt.get(path) as Project | null;
  };

  const list = async (filters: ProjectListFilters = {}): Promise<Project[]> => {
    let query = 'SELECT * FROM projects WHERE 1=1';
    const params: any[] = [];

    // Build dynamic query based on filters
    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.lifecycle) {
      query += ' AND lifecycle = ?';
      params.push(filters.lifecycle);
    }

    if (filters.ownership) {
      query += ' AND ownership = ?';
      params.push(filters.ownership);
    }

    if (filters.originType) {
      query += ' AND origin_type = ?';
      params.push(filters.originType);
    }

    if (filters.paused !== undefined) {
      query += ' AND paused = ?';
      params.push(filters.paused ? 1 : 0);
    }

    if (filters.deployed !== undefined) {
      query += ' AND deployed = ?';
      params.push(filters.deployed ? 1 : 0);
    }

    if (filters.hasRealData !== undefined) {
      query += ' AND has_real_data = ?';
      params.push(filters.hasRealData ? 1 : 0);
    }

    if (filters.isCurrentVersion !== undefined) {
      query += ' AND is_current_version = ?';
      params.push(filters.isCurrentVersion ? 1 : 0);
    }

    if (filters.hasBrainFolder !== undefined) {
      query += ' AND has_brain_folder = ?';
      params.push(filters.hasBrainFolder ? 1 : 0);
    }

    if (filters.isPnpmMonorepo !== undefined) {
      query += ' AND is_pnpm_monorepo = ?';
      params.push(filters.isPnpmMonorepo ? 1 : 0);
    }

    if (filters.isNpmMonorepo !== undefined) {
      query += ' AND is_npm_monorepo = ?';
      params.push(filters.isNpmMonorepo ? 1 : 0);
    }

    if (filters.hasCursorRules !== undefined) {
      query += ' AND has_cursor_rules = ?';
      params.push(filters.hasCursorRules ? 1 : 0);
    }

    if (filters.hasClaudeMd !== undefined) {
      query += ' AND has_claude_md = ?';
      params.push(filters.hasClaudeMd ? 1 : 0);
    }

    if (filters.search) {
      query += ' AND (name LIKE ? OR path LIKE ? OR purpose LIKE ? OR problem_solved LIKE ? OR tags LIKE ?)';
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    // Sorting
    const sortBy = filters.sortBy || 'last_worked_on';
    const sortOrder = filters.sortOrder || 'desc';
    query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

    // Pagination
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }

    const stmt = db.prepare(query);
    return stmt.all(...params) as Project[];
  };

  const create = async (project: Omit<Project, 'id' | 'discovered_at'>): Promise<Project> => {
    const columns = Object.keys(project).join(', ');
    const placeholders = Object.keys(project).map(() => '?').join(', ');
    const values = Object.values(project);

    const query = `
      INSERT INTO projects (${columns})
      VALUES (${placeholders})
    `;

    const stmt = db.prepare(query);
    const result = stmt.run(...values);

    // Return the newly created project
    return (await findById(result.lastInsertRowid as number))!;
  };

  const update = async (id: number, updates: Partial<Project>): Promise<Project | null> => {
    // Remove id and discovered_at from updates if present
    const { id: _id, discovered_at, ...updateData } = updates;

    if (Object.keys(updateData).length === 0) {
      return await findById(id);
    }

    const sets = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(id);

    const query = `
      UPDATE projects
      SET ${sets}
      WHERE id = ?
    `;

    const stmt = db.prepare(query);
    const result = stmt.run(...values);

    if (result.changes === 0) {
      return null;
    }

    return await findById(id);
  };

  const deleteProject = async (id: number): Promise<boolean> => {
    const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  };

  const getStats = async (): Promise<ProjectStats> => {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM projects');
    const totalResult = totalStmt.get() as { count: number };

    const activeStmt = db.prepare("SELECT COUNT(*) as count FROM projects WHERE lifecycle = 'using' OR lifecycle = 'building'");
    const activeResult = activeStmt.get() as { count: number };

    const brainFolderStmt = db.prepare('SELECT COUNT(*) as count FROM projects WHERE has_brain_folder = 1');
    const brainFolderResult = brainFolderStmt.get() as { count: number };

    const pnpmMonorepoStmt = db.prepare('SELECT COUNT(*) as count FROM projects WHERE is_pnpm_monorepo = 1');
    const pnpmMonorepoResult = pnpmMonorepoStmt.get() as { count: number };

    const npmMonorepoStmt = db.prepare('SELECT COUNT(*) as count FROM projects WHERE is_npm_monorepo = 1');
    const npmMonorepoResult = npmMonorepoStmt.get() as { count: number };

    const deployedStmt = db.prepare('SELECT COUNT(*) as count FROM projects WHERE deployed = 1');
    const deployedResult = deployedStmt.get() as { count: number };

    const pausedStmt = db.prepare('SELECT COUNT(*) as count FROM projects WHERE paused = 1');
    const pausedResult = pausedStmt.get() as { count: number };

    const categoryStmt = db.prepare('SELECT category, COUNT(*) as count FROM projects WHERE category IS NOT NULL GROUP BY category');
    const categoryResults = categoryStmt.all() as { category: string; count: number }[];

    const lifecycleStmt = db.prepare('SELECT lifecycle, COUNT(*) as count FROM projects GROUP BY lifecycle');
    const lifecycleResults = lifecycleStmt.all() as { lifecycle: string; count: number }[];

    const ownershipStmt = db.prepare('SELECT ownership, COUNT(*) as count FROM projects GROUP BY ownership');
    const ownershipResults = ownershipStmt.all() as { ownership: string; count: number }[];

    const projectsByCategory: Record<string, number> = {};
    categoryResults.forEach(row => {
      projectsByCategory[row.category] = row.count;
    });

    const projectsByLifecycle: Record<string, number> = {};
    lifecycleResults.forEach(row => {
      projectsByLifecycle[row.lifecycle] = row.count;
    });

    const projectsByOwnership: Record<string, number> = {};
    ownershipResults.forEach(row => {
      projectsByOwnership[row.ownership] = row.count;
    });

    return {
      totalProjects: totalResult.count,
      activeProjects: activeResult.count,
      withBrainFolder: brainFolderResult.count,
      pnpmMonorepos: pnpmMonorepoResult.count,
      npmMonorepos: npmMonorepoResult.count,
      deployed: deployedResult.count,
      paused: pausedResult.count,
      projectsByCategory,
      projectsByLifecycle,
      projectsByOwnership,
    };
  };

  const upsertByPath = async (project: Omit<Project, 'id' | 'discovered_at'>): Promise<Project> => {
    const existing = await findByPath(project.path);

    if (existing) {
      // Update existing project
      return (await update(existing.id, project))!;
    } else {
      // Create new project
      return await create(project);
    }
  };

  return {
    findById,
    findByPath,
    list,
    create,
    update,
    delete: deleteProject,
    getStats,
    upsertByPath,
  };
};