import './env';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { db } from '../src/db';

async function main() {
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('\n✔ Migrations applied to Neon.\n');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
