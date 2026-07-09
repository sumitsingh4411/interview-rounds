import Link from 'next/link';
import type { CompanyWithStats } from '@/db/queries';

export function CompanyCard({ company }: { company: CompanyWithStats }) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="surface-card group flex flex-col rounded-2xl border border-line bg-surface p-5 hover:-translate-y-0.5 hover:border-line-2 hover:bg-surface-2"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line-2 bg-elevated font-display text-lg font-semibold text-brand"
        >
          {company.name.charAt(0)}
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
        <span className="eyebrow">
          {company.questionCount} question{company.questionCount === 1 ? '' : 's'}
        </span>
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
