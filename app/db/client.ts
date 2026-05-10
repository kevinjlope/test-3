import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const dbPath = process.env.DATABASE_URL || 'sqlite.db';
const sqlite = new Database(dbPath);

// Enable Write-Ahead Logging for better performance
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
