import {
  ROLE_LABELS,
  LEVEL_LABELS,
  DIFFICULTY_LABELS,
  SOURCE_LABELS,
  OUTCOME_LABELS,
  type Role,
  type Level,
  type Difficulty,
  type SourceType,
  type Outcome,
} from '@/lib/constants';

const baseChip =
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs leading-5 whitespace-nowrap';

/**
 * Role badge. Full-stack renders a cyan→violet gradient text — a small nod to
 * "frontend + backend", so the union is legible without a third clashing hue.
 */
export function RoleBadge({ role }: { role: Role }) {
  if (role === 'fullstack') {
    return (
      <span
        className={`${baseChip} border-line-2`}
        style={{ color: 'transparent' }}
      >
        <span
          className="bg-clip-text"
          style={{
            backgroundImage:
              'linear-gradient(90deg, var(--frontend), var(--backend))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {ROLE_LABELS.fullstack}
        </span>
      </span>
    );
  }
  const color = role === 'frontend' ? 'var(--frontend)' : 'var(--backend)';
  return (
    <span
      className={baseChip}
      style={{ color, borderColor: color, backgroundColor: `${color}14` }}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

export function LevelBadge({ level }: { level: Level }) {
  return (
    <span className={`${baseChip} border-line text-muted`}>
      {LEVEL_LABELS[level]}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const color =
    difficulty === 'easy'
      ? 'var(--easy)'
      : difficulty === 'medium'
        ? 'var(--medium)'
        : 'var(--hard)';
  return (
    <span
      className={baseChip}
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}14` }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}

export function SourceBadge({
  sourceType,
  sourceUrl,
}: {
  sourceType: SourceType;
  sourceUrl?: string | null;
}) {
  const label = SOURCE_LABELS[sourceType];
  const glyph =
    sourceType === 'ai'
      ? '✦ '
      : sourceType === 'github'
        ? '⎇ '
        : sourceType === 'curated'
          ? '◆ '
          : '❝ ';
  const inner = (
    <span className={`${baseChip} border-line text-faint`}>
      {glyph}
      {label}
    </span>
  );
  if (sourceUrl) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors hover:[&>span]:text-fg"
      >
        {inner}
      </a>
    );
  }
  return inner;
}

export function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  if (outcome === 'unknown') {
    return (
      <span className={`${baseChip} border-line text-faint`}>
        {OUTCOME_LABELS.unknown}
      </span>
    );
  }
  const color =
    outcome === 'offer'
      ? 'var(--easy)'
      : outcome === 'rejected' || outcome === 'no_offer'
        ? 'var(--hard)'
        : 'var(--medium)';
  return (
    <span
      className={baseChip}
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}14` }}
    >
      {OUTCOME_LABELS[outcome]}
    </span>
  );
}

export function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-xs text-muted">
      #{children}
    </span>
  );
}
