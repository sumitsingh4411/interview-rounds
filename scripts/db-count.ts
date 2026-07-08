import './env';
import { sql } from 'drizzle-orm';
import { db, companies, interviews, questions } from './_shared';

async function main() {
  const [c] = await db.select({ n: sql<number>`count(*)::int` }).from(companies);
  const [i] = await db.select({ n: sql<number>`count(*)::int` }).from(interviews);
  const [q] = await db.select({ n: sql<number>`count(*)::int` }).from(questions);
  process.stdout.write(
    `companies=${c.n} interviews=${i.n} questions=${q.n}\n`,
  );
  await new Promise((r) => setTimeout(r, 50));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
