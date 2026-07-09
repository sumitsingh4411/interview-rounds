import type { Round, Difficulty } from '../lib/constants';

export type ParsedQuestion = {
  title: string;
  difficulty: Difficulty | null;
  tags: string[];
};

export type ParsedRound = {
  round: Round;
  questions: ParsedQuestion[];
};

/**
 * Rounds live in the Markdown *body* (not frontmatter) so the files render as
 * readable documents on GitHub. Each round section is anchored by an invisible
 * marker, followed by a table:
 *
 *   ## Round 1 · DSA / Coding
 *   <!-- round: dsa -->
 *
 *   | Question | Difficulty | Tags |
 *   | --- | --- | --- |
 *   | Trapping rain water. | 🔴 Hard | `two-pointers` `array` |
 *
 * The marker is what we parse against, so headings stay free-form.
 */
const ROUND_MARKER = /<!--\s*round:\s*([a-z_]+)\s*-->/gi;
const DIFFICULTY = /(easy|medium|hard)/i;
const TAG = /`([^`]+)`/g;

function parseTagCell(cell: string): string[] {
  const tags: string[] = [];
  for (const m of cell.matchAll(TAG)) tags.push(m[1].trim());
  return tags.filter(Boolean);
}

function parseTableRows(chunk: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  for (const rawLine of chunk.split('\n')) {
    const line = rawLine.trim();
    if (!line.startsWith('|') || !line.endsWith('|')) continue;

    // Strip the leading/trailing pipe, then split into cells.
    const cells = line.slice(1, -1).split('|').map((c) => c.trim());
    if (cells.length < 3) continue;

    const [title, difficultyCell, tagCell] = cells;

    // Skip the header row and the --- separator row.
    if (/^-{2,}$/.test(title.replace(/[\s:]/g, ''))) continue;
    if (title.toLowerCase() === 'question') continue;
    if (!title) continue;

    const diffMatch = difficultyCell.match(DIFFICULTY);
    questions.push({
      title,
      difficulty: diffMatch
        ? (diffMatch[1].toLowerCase() as Difficulty)
        : null,
      tags: parseTagCell(tagCell ?? ''),
    });
  }
  return questions;
}

/** Parse every round section out of an interview file's Markdown body. */
export function parseRounds(body: string): ParsedRound[] {
  const markers = [...body.matchAll(ROUND_MARKER)];
  const rounds: ParsedRound[] = [];

  markers.forEach((marker, i) => {
    const start = (marker.index ?? 0) + marker[0].length;
    const end = i + 1 < markers.length ? markers[i + 1].index : body.length;
    const chunk = body.slice(start, end);
    rounds.push({
      round: marker[1].toLowerCase() as Round,
      questions: parseTableRows(chunk),
    });
  });

  return rounds;
}

export function countQuestions(rounds: ParsedRound[]): number {
  return rounds.reduce((n, r) => n + r.questions.length, 0);
}
