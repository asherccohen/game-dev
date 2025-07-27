import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

const sqlite = new Database('sqlite.db');

const db = drizzle(sqlite, { logger: true });

export default db;
export * from './schema';
