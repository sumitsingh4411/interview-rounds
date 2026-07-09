import matter from 'gray-matter';
import {
  ROUND_LABELS,
  ROUND_DESCRIPTIONS,
  ROLE_LABELS,
  SOURCE_LABELS,
  type Round,
  type Role,
  type Level,
  type Outcome,
  type SourceType,
} from '../../src/lib/constants';
import type { ParsedRound } from '../../src/content/parse-rounds';
import { practiceLinks } from '../../src/lib/practice';

const ROLE_COLOR: Record<Role, string> = {
  frontend: '22d3ee',
  backend: '8b93ff',
  fullstack: 'a78bfa',
};
const OUTCOME_COLOR: Record<Outcome, string> = {
  offer: '34d399',
  rejected: 'f87171',
  no_offer: 'f87171',
  withdrew: 'fbbf24',
  unknown: '6b7280',
};
/** Compact labels — the long forms read badly in headings and table cells. */
const LEVEL_SHORT: Record<Level, string> = {
  intern: 'Intern',
  junior: 'Junior',
  mid: 'Mid',
  senior: 'Senior',
  staff: 'Staff',
};
const OUTCOME_SHORT: Record<Outcome, string> = {
  offer: 'Offer',
  rejected: 'Rejected',
  no_offer: 'No offer',
  withdrew: 'Withdrew',
  unknown: 'Unknown',
};
const DIFFICULTY_CELL: Record<string, string> = {
  easy: '🟢 Easy',
  medium: '🟡 Medium',
  hard: '🔴 Hard',
};

/** shields.io needs `-` and spaces escaped inside the label/message. */
function esc(s: string): string {
  return s.replace(/-/g, '--').replace(/_/g, '__').replace(/ /g, '%20');
}

function badge(label: string, message: string, color: string): string {
  return `![${label}](https://img.shields.io/badge/${esc(label)}-${esc(message)}-${color}?style=flat-square)`;
}

export type InterviewFrontmatter = {
  id: string;
  company: string;
  role: Role;
  level: Level;
  outcome: Outcome;
  year: number | null;
  source: SourceType;
  summary: string;
};

export type CompanyFrontmatter = {
  name: string;
  slug: string;
  featured?: boolean;
  industry: string | null;
  hq: string | null;
  description: string;
};

function roundTable(round: ParsedRound): string {
  // Behavioural / hiring-manager rounds have nothing to practise, so they get
  // a 3-column table. The parser reads the first three cells either way.
  const hasPractice = practiceLinks('probe', round.round).length > 0;

  const lines = hasPractice
    ? ['| Question | Difficulty | Tags | Practice |', '| --- | --- | --- | --- |']
    : ['| Question | Difficulty | Tags |', '| --- | --- | --- |'];

  for (const q of round.questions) {
    const diff = q.difficulty ? DIFFICULTY_CELL[q.difficulty] : '—';
    const tags = q.tags.length ? q.tags.map((t) => `\`${t}\``).join(' ') : '—';

    if (hasPractice) {
      const practice = practiceLinks(q.title, round.round)
        .map((l) => `[${l.short}](${l.href})`)
        .join(' · ');
      lines.push(`| ${q.title} | ${diff} | ${tags} | ${practice} |`);
    } else {
      lines.push(`| ${q.title} | ${diff} | ${tags} |`);
    }
  }
  return lines.join('\n');
}

/** Full Markdown file for one interview: frontmatter + a readable body. */
export function renderInterview(
  fm: InterviewFrontmatter,
  companyName: string,
  rounds: ParsedRound[],
): string {
  const questionCount = rounds.reduce((n, r) => n + r.questions.length, 0);

  const parts: string[] = [];
  parts.push(`# ${LEVEL_SHORT[fm.level]} ${ROLE_LABELS[fm.role]} — ${companyName}`);
  parts.push('');
  parts.push(
    [
      badge('role', ROLE_LABELS[fm.role], ROLE_COLOR[fm.role]),
      badge('level', LEVEL_SHORT[fm.level], '818cf8'),
      badge('outcome', OUTCOME_SHORT[fm.outcome], OUTCOME_COLOR[fm.outcome]),
      fm.year ? badge('year', String(fm.year), '6b7280') : '',
      badge('source', SOURCE_LABELS[fm.source], '2dd4bf'),
    ]
      .filter(Boolean)
      .join('\n'),
  );
  parts.push('');
  if (fm.summary) {
    parts.push(`> ${fm.summary}`);
    parts.push('');
  }
  parts.push(
    `**${rounds.length} round${rounds.length === 1 ? '' : 's'} · ${questionCount} question${questionCount === 1 ? '' : 's'}**`,
  );
  parts.push('');
  parts.push('---');
  parts.push('');

  rounds.forEach((round, i) => {
    parts.push(`## Round ${i + 1} · ${ROUND_LABELS[round.round as Round]}`);
    parts.push(`<!-- round: ${round.round} -->`);
    parts.push('');
    parts.push(`_${ROUND_DESCRIPTIONS[round.round as Round]}_`);
    parts.push('');
    parts.push(roundTable(round));
    parts.push('');
  });

  parts.push('---');
  parts.push('');
  parts.push(
    `<sub>📚 [All interviews](../../README.md#browse-every-interview) · 🏢 [More ${companyName} interviews](../companies/${fm.company}.md)</sub>`,
  );
  parts.push('');

  return matter.stringify(parts.join('\n'), {
    id: fm.id,
    company: fm.company,
    role: fm.role,
    level: fm.level,
    outcome: fm.outcome,
    year: fm.year,
    source: fm.source,
    summary: fm.summary,
  });
}

export type CompanyInterviewRow = {
  id: string;
  role: Role;
  level: Level;
  outcome: Outcome;
  roundCount: number;
  questionCount: number;
};

/** Full Markdown file for one company: frontmatter + blurb + interview table. */
export function renderCompany(
  fm: CompanyFrontmatter,
  interviews: CompanyInterviewRow[],
): string {
  const totalQuestions = interviews.reduce((n, i) => n + i.questionCount, 0);

  const parts: string[] = [];
  parts.push(`# ${fm.name}`);
  parts.push('');
  parts.push(
    [
      fm.industry ? badge('industry', fm.industry, '8b93ff') : '',
      fm.hq ? badge('hq', fm.hq, '6b7280') : '',
      badge('interviews', String(interviews.length), '22d3ee'),
      badge('questions', String(totalQuestions), 'a78bfa'),
    ]
      .filter(Boolean)
      .join('\n'),
  );
  parts.push('');
  if (fm.description) {
    parts.push(`> ${fm.description}`);
    parts.push('');
  }
  parts.push('---');
  parts.push('');
  parts.push('## Interview experiences');
  parts.push('');

  if (interviews.length === 0) {
    parts.push('_No interviews shared yet._');
  } else {
    parts.push('| Interview | Outcome | Rounds | Questions |');
    parts.push('| --- | --- | --- | --- |');
    for (const iv of interviews) {
      const label = `${LEVEL_SHORT[iv.level]} · ${ROLE_LABELS[iv.role]}`;
      parts.push(
        `| [${label}](../interviews/${iv.id}.md) | ${OUTCOME_SHORT[iv.outcome]} | ${iv.roundCount} | ${iv.questionCount} |`,
      );
    }
  }

  parts.push('');
  parts.push('---');
  parts.push('');
  parts.push(
    '<sub>📚 [Back to the full index](../../README.md#browse-every-interview)</sub>',
  );
  parts.push('');

  const data: Record<string, unknown> = {
    name: fm.name,
    slug: fm.slug,
  };
  if (fm.featured) data.featured = true;
  data.industry = fm.industry;
  data.hq = fm.hq;
  data.description = fm.description;

  return matter.stringify(parts.join('\n'), data);
}
