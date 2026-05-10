import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './client';
import path from 'path';

import { fileURLToPath } from 'url';

export async function runMigrations() {
  console.log('Running migrations...');
  try {
    await migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') });
    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Migrations failed:', error);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations();
}
