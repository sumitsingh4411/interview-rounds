'use client';

import type { ReactNode } from 'react';

export type Segment = { label: string; value: number; color: string };

/**
 * A donut/ring chart. Segments are drawn as arcs of one circle with a small gap
 * between them. `children` renders centred (for a headline number).
 */
export function Donut({
  segments,
  size = 168,
  thickness = 20,
  children,
}: {
  segments: Segment[];
  size?: number;
  thickness?: number;
  children?: ReactNode;
}) {
  const total = segments.reduce((n, s) => n + s.value, 0);
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const gap = total > 0 && segments.filter((s) => s.value > 0).length > 1 ? 5 : 0;
  let offset = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth={thickness}
        />
        {total > 0 &&
          segments.map((s) => {
            const frac = s.value / total;
            const len = Math.max(circ * frac - gap, 0);
            const node = (
              <circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                strokeWidth={thickness}
                strokeLinecap="round"
                strokeDasharray={`${len} ${circ - len}`}
                strokeDashoffset={-offset}
                style={{ stroke: s.color }}
                className="transition-[stroke-dasharray] duration-700 ease-out"
              />
            );
            offset += circ * frac;
            return s.value > 0 ? node : null;
          })}
      </svg>
      {children ? (
        <div className="absolute inset-0 grid place-items-center text-center leading-none">
          {children}
        </div>
      ) : null}
  </div>
  );
}

export type Column = {
  key: string;
  label: string;
  full: string;
  total: number;
  solved: number;
  color: string;
};

/**
 * A vertical column chart. Each column's height encodes `total` (relative to the
 * tallest), and a brighter fill rises from the bottom to show `solved`.
 */
export function Columns({ data, height = 176 }: { data: Column[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="flex items-end gap-1.5 sm:gap-2.5" style={{ height }}>
      {data.map((d) => {
        const pct = d.total > 0 ? Math.round((d.solved / d.total) * 100) : 0;
        return (
          <div
            key={d.key}
            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
          >
            <span className="font-mono text-[0.6rem] text-faint">{d.total}</span>
            <div
              className="relative w-full max-w-[2.5rem] overflow-hidden rounded-md bg-surface-2"
              style={{ height: `${Math.max((d.total / max) * 100, 3)}%` }}
              title={`${d.full}: ${d.solved} / ${d.total} solved`}
            >
              <div
                className="absolute inset-x-0 bottom-0 rounded-md transition-[height] duration-700 ease-out"
                style={{
                  height: `${pct}%`,
                  // Guarantee a visible sliver once anything is solved, even
                  // when the true percentage rounds down to nothing.
                  minHeight: d.solved > 0 ? '0.3rem' : undefined,
                  backgroundColor: d.color,
                }}
              />
            </div>
            <span className="w-full truncate text-center font-mono text-[0.6rem] text-muted">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** A single 100%-width bar split into proportional, coloured segments. */
export function StackedBar({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((n, s) => n + s.value, 0) || 1;
  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-2">
      {segments.map((s) => (
        <div
          key={s.label}
          style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }}
          title={`${s.label}: ${s.value}`}
        />
      ))}
    </div>
  );
}
