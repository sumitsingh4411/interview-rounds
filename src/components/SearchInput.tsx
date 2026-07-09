'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchInput({
  placeholder = 'Search questions or companies…',
  initialValue = '',
  autoFocus = false,
}: {
  placeholder?: string;
  initialValue?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 rounded-xl border border-line-2 bg-surface px-3.5 py-2.5 focus-within:border-brand"
    >
      <span aria-hidden className="font-mono text-brand">
        $
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search"
        className="min-w-0 flex-1 bg-transparent font-mono text-sm text-fg placeholder:text-faint focus:outline-none"
      />
      <button
        type="submit"
        className="btn-brand rounded-lg px-3.5 py-1.5 text-sm font-medium"
      >
        Search
      </button>
    </form>
  );
}
