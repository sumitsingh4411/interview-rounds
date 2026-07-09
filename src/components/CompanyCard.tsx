import Link from 'next/link';
import type { CompanyWithStats } from '@/content/types';

// Cool-toned gradients; each company gets a stable one for a distinct monogram.
const GRADIENTS = [
  'linear-gradient(135deg, #22d3ee, #6366f1)',
  'linear-gradient(135deg, #818cf8, #c084fc)',
  'linear-gradient(135deg, #22d3ee, #a78bfa)',
  'linear-gradient(135deg, #60a5fa, #22d3ee)',
  'linear-gradient(135deg, #f472b6, #818cf8)',
  'linear-gradient(135deg, #34d399, #22d3ee)',
];

function gradientFor(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

export function CompanyCard({ company }: { company: CompanyWithStats }) {
  const gradient = gradientFor(company.slug);

  return (
    <Link
      href={`/companies/${company.slug}`}
      className="glass-card group relative flex flex-col overflow-hidden rounded-2xl p-5 hover:-translate-y-0.5"
    >
      {/* corner glow on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
        style={{ backgroundImage: gradient }}
      />

      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line-2 bg-gradient-to-br from-surface-2 to-elevated transition-transform duration-300 group-hover:scale-105"
        >
          <span
            className="font-display text-lg font-bold"
            style={{
              backgroundImage: gradient,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {company.name.charAt(0)}
          </span>
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-semibold text-fg">
            {company.name}
          </h3>
          {company.industry ? (
            <p className="truncate text-xs text-faint">{company.industry}</p>
          ) : null}
        </div>
      </div>

      {company.description ? (
        <p className="mt-3 line-clamp-2 text-sm text-muted">
          {company.description}
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <div className="flex items-center gap-2.5 font-mono text-xs text-faint">
          <span>
            <span className="text-muted">{company.interviewCount}</span>{' '}
            interview{company.interviewCount === 1 ? '' : 's'}
          </span>
          <span className="text-line-2">·</span>
          <span>
            <span className="text-muted">{company.questionCount}</span> Qs
          </span>
        </div>
        <span
          aria-hidden
          className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
        >
          →
        </span>
      </div>
    </Link>
  );
}
