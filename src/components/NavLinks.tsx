'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** Office block — a company. */
function CompaniesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 21h18" {...stroke} />
      <path d="M5 21V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v15" {...stroke} />
      <path d="M14 10h3a2 2 0 0 1 2 2v9" {...stroke} />
      <path d="M8.5 8.5h2M8.5 12.5h2M8.5 16.5h2" {...stroke} />
    </svg>
  );
}

/** The Round Rail itself: a spine with nodes and branches. */
function RoundsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path d="M6 4.5v15" {...stroke} />
      <circle cx="6" cy="7.5" r="2.2" {...stroke} />
      <circle cx="6" cy="16.5" r="2.2" {...stroke} />
      <path d="M10 7.5h9M10 16.5h6" {...stroke} />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <circle cx="11" cy="11" r="6.5" {...stroke} />
      <path d="m19.5 19.5-3.8-3.8" {...stroke} />
    </svg>
  );
}

/**
 * Ascending bars, echoing the breakdown bars on /progress.
 * Deliberately not a ring — that would collide with the logo mark sitting a
 * few pixels to the left.
 */
function ProgressIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 20h16" {...stroke} opacity={0.35} />
      <path d="M6.5 20v-5" {...stroke} />
      <path d="M12 20V8" {...stroke} />
      <path d="M17.5 20v-8" {...stroke} />
    </svg>
  );
}

const NAV: {
  href: string;
  label: string;
  match?: string;
  icon: ReactNode;
}[] = [
  { href: '/companies', label: 'Companies', icon: <CompaniesIcon /> },
  { href: '/rounds/dsa', label: 'Rounds', match: '/rounds', icon: <RoundsIcon /> },
  { href: '/search', label: 'Search', icon: <SearchIcon /> },
  { href: '/progress', label: 'Progress', icon: <ProgressIcon /> },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="nav-shell hidden items-center gap-1.5 sm:flex">
      {NAV.map((item) => {
        const base = item.match ?? item.href;
        const active = pathname === base || pathname.startsWith(`${base}/`);
        return (
          <Link
            key={item.label}
            href={item.href}
            data-active={active}
            aria-current={active ? 'page' : undefined}
            className="nav-item group"
          >
            <span
              className={
                'transition-colors ' +
                (active ? 'text-brand' : 'text-faint group-hover:text-muted')
              }
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
