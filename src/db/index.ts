import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

type DB = NeonHttpDatabase<typeof schema>;

let cached: DB | null = null;

function getDb(): DB {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.example to .env.local and add your Neon connection string.',
    );
  }
  cached = drizzle(neon(url), { schema });
  return cached;
}

/**
 * Lazy Drizzle client. The connection is created on first query, not at import
 * time — so importing this module during `next build` never requires a live DB.
 */
export const db = new Proxy({} as DB, {
  get(_target, prop, receiver) {
    const real = getDb();
    const value = Reflect.get(real as object, prop, receiver);
    return typeof value === 'function' ? value.bind(real) : value;
  },
});

export { schema };
