// Import this FIRST in every script (before importing the db module), so
// DATABASE_URL is loaded before src/db/index.ts reads it at module-eval time.
import { config } from 'dotenv';

config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.error(
    '\n✖ DATABASE_URL is not set. Copy .env.example to .env.local and add your Neon connection string.\n',
  );
  process.exit(1);
}
