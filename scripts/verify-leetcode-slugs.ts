/**
 * Checks every slug in src/lib/leetcode.ts against LeetCode's public problem
 * list. A wrong slug is worse than no link — it sends a reader to a 404.
 *
 * Network-dependent, so this is a script rather than a unit test.
 */
import { ALL_SLUGS } from '../src/lib/leetcode';

const API = 'https://leetcode.com/api/problems/all/';
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36';

type Pair = { stat: { question__title_slug: string; question__title: string } };

async function main() {
  const res = await fetch(API, { headers: { 'User-Agent': UA } });
  if (!res.ok) {
    console.error(`✖ Could not fetch the LeetCode problem list (HTTP ${res.status}).`);
    process.exit(1);
  }

  const data = (await res.json()) as { stat_status_pairs: Pair[] };
  const real = new Set(data.stat_status_pairs.map((p) => p.stat.question__title_slug));
  console.log(`Fetched ${real.size} LeetCode problems.`);

  const missing = ALL_SLUGS.filter((s) => !real.has(s));
  const duplicates = ALL_SLUGS.filter((s, i) => ALL_SLUGS.indexOf(s) !== i);

  if (duplicates.length) {
    console.error(`✖ Duplicate slugs: ${[...new Set(duplicates)].join(', ')}`);
  }
  if (missing.length) {
    console.error(`✖ ${missing.length} slug(s) do not exist on LeetCode:`);
    missing.forEach((s) => console.error(`    ${s}`));
  }
  if (missing.length || duplicates.length) process.exit(1);

  console.log(`✔ All ${ALL_SLUGS.length} LeetCode slugs verified.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
