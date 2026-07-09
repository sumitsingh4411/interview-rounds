// Builds public/search-index.json from the content/*.md files (the source of
// truth). Safe to run on every build — it only reads content, never writes it.
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const COMPANIES_DIR = join(ROOT, 'content', 'companies');
const INTERVIEWS_DIR = join(ROOT, 'content', 'interviews');
const OUT = join(ROOT, 'public', 'search-index.json');

type Entry = {
  id: string;
  title: string;
  company: string;
  companySlug: string;
  interviewId: string;
  role: string;
  level: string;
  round: string;
  difficulty: string | null;
  tags: string[];
};

function mdFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.md'));
}

function main() {
  const nameBySlug = new Map<string, string>();
  for (const file of mdFiles(COMPANIES_DIR)) {
    const { data } = matter(readFileSync(join(COMPANIES_DIR, file), 'utf8'));
    nameBySlug.set(data.slug, data.name);
  }

  const entries: Entry[] = [];
  for (const file of mdFiles(INTERVIEWS_DIR)) {
    const { data } = matter(readFileSync(join(INTERVIEWS_DIR, file), 'utf8'));
    const interviewId: string = data.id;
    const companySlug: string = data.company;
    const rounds: {
      round: string;
      questions: { title: string; difficulty: string | null; tags: string[] }[];
    }[] = data.rounds ?? [];

    let qi = 0;
    for (const r of rounds) {
      for (const q of r.questions) {
        entries.push({
          id: `${interviewId}-q${qi}`,
          title: q.title,
          company: nameBySlug.get(companySlug) ?? companySlug,
          companySlug,
          interviewId,
          role: data.role,
          level: data.level,
          round: r.round,
          difficulty: q.difficulty ?? null,
          tags: q.tags ?? [],
        });
        qi += 1;
      }
    }
  }

  mkdirSync(join(ROOT, 'public'), { recursive: true });
  writeFileSync(OUT, JSON.stringify(entries));
  console.log(`✔ Built search index: ${entries.length} entries → public/search-index.json`);
}

main();
