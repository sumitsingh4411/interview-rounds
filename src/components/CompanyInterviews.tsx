'use client';

import { useMemo, useState } from 'react';
import type { InterviewWithCounts } from '@/content/types';
import { ROLES, LEVELS } from '@/lib/constants';
import { Filters, type ActiveFilter } from './Filters';
import { InterviewCard } from './InterviewCard';

export function CompanyInterviews({
  interviews,
}: {
  interviews: InterviewWithCounts[];
}) {
  const [active, setActive] = useState<ActiveFilter>({});

  const facets = useMemo(
    () => ({
      roles: ROLES.filter((r) => interviews.some((i) => i.role === r)),
      levels: LEVELS.filter((l) => interviews.some((i) => i.level === l)),
      rounds: [],
    }),
    [interviews],
  );

  const filtered = interviews.filter(
    (i) =>
      (!active.role || i.role === active.role) &&
      (!active.level || i.level === active.level),
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-4 font-mono text-xs text-faint">
          {filtered.length} of {interviews.length} shown
        </p>
        <Filters facets={facets} active={active} onChange={setActive} />
      </aside>

      <div>
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-line bg-surface p-8 text-center">
            <p className="text-fg">No interviews match these filters.</p>
            <p className="mt-1 text-sm text-muted">
              Try clearing a filter to see more experiences.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
