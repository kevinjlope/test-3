import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('sqlite.db');

// Enable Write-Ahead Logging for better performance
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
