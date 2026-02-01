import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Handle missing DATABASE_URL during build time
const connectionString = process.env.DATABASE_URL;

// Create a dummy neon function for build time
const sql = connectionString
    ? neon(connectionString)
    : ((() => { throw new Error('DATABASE_URL is not set'); }) as any);

export const db = drizzle(sql, { schema });
export type Database = typeof db;
