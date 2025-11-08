import Database from 'better-sqlite3';
import { existsSync } from 'fs';
import { dirname } from 'path';
import { mkdir } from 'fs/promises';

export interface DbConfig {
  dbPath: string;
  readonly?: boolean;
}

export interface DbClient {
  db: Database.Database;
  close: () => void;
}

/**
 * Create a database client using better-sqlite3
 * Pure factory function following functional DI pattern
 */
export const makeDbClient = async (config: DbConfig): Promise<DbClient> => {
  // Ensure the directory exists
  const dir = dirname(config.dbPath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  // Open or create the database
  const db = new Database(config.dbPath, {
    readonly: config.readonly || false,
    fileMustExist: false,
  });

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Optimize for performance
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');

  // Don't create tables - we're using an existing database
  // The database already has the projects table with the correct schema

  return {
    db,
    close: () => db.close(),
  };
};