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
      className="glass flex items-center gap-2.5 rounded-xl px-4 py-2.5 transition-shadow focus-within:border-brand focus-within:shadow-[0_0_0_4px_rgb(var(--glow)/0.15)]"
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
