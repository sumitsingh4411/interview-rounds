'use client';

import { useState } from 'react';
import type { CompanyWithStats } from '@/content/types';
import { CompanyCard } from './CompanyCard';

export function CompanyBrowser({
  companies,
}: {
  companies: CompanyWithStats[];
}) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const filtered = q
    ? companies.filter((c) => c.name.toLowerCase().includes(q))
    : companies;

  return (
    <>
      <div className="mt-6 max-w-md">
        <div className="flex items-center gap-2 rounded-xl border border-line-2 bg-surface px-3.5 py-2.5 focus-within:border-brand">
          <span aria-hidden className="font-mono text-brand">
            /
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter companies…"
            aria-label="Filter companies by name"
            className="min-w-0 flex-1 bg-transparent font-mono text-sm text-fg placeholder:text-faint focus:outline-none"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-xl border border-line bg-surface p-6 text-muted">
          No companies match “{query}”.
        </p>
      )}
    </>
  );
}
