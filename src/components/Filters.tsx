'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  ROLE_LABELS,
  LEVEL_LABELS,
  ROUND_LABELS,
  type Role,
  type Level,
  type Round,
} from '@/lib/constants';
import type { Facets } from '@/lib/questions';

type Active = { role?: Role; level?: Level; round?: Round };

export function Filters({
  facets,
  active,
}: {
  facets: Facets;
  active: Active;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function toggle(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (next.get(key) === value) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clearAll() {
    router.push(pathname, { scroll: false });
  }

  const hasActive = Boolean(active.role || active.level || active.round);

  return (
    <div className="space-y-4">
      <FilterGroup
        label="Role"
        options={facets.roles.map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
        activeValue={active.role}
        onToggle={(v) => toggle('role', v)}
      />
      <FilterGroup
        label="Level"
        options={facets.levels.map((l) => ({
          value: l,
          label: LEVEL_LABELS[l],
        }))}
        activeValue={active.level}
        onToggle={(v) => toggle('level', v)}
      />
      <FilterGroup
        label="Round"
        options={facets.rounds.map((r) => ({
          value: r,
          label: ROUND_LABELS[r],
        }))}
        activeValue={active.round}
        onToggle={(v) => toggle('round', v)}
      />
      {hasActive ? (
        <button
          type="button"
          onClick={clearAll}
          className="font-mono text-xs text-brand hover:underline"
        >
          × Clear filters
        </button>
      ) : null}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  activeValue,
  onToggle,
}: {
  label: string;
  options: { value: string; label: string }[];
  activeValue?: string;
  onToggle: (value: string) => void;
}) {
  if (options.length === 0) return null;
  return (
    <fieldset>
      <legend className="eyebrow mb-2">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const isActive = o.value === activeValue;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onToggle(o.value)}
              className={
                'rounded-lg border px-2.5 py-1 text-sm transition-colors ' +
                (isActive
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-line text-muted hover:border-line-2 hover:text-fg')
              }
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
