'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/companies', label: 'Companies' },
  { href: '/rounds/dsa', label: 'Rounds', match: '/rounds' },
  { href: '/search', label: 'Search' },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 sm:flex">
      {NAV.map((item) => {
        const base = item.match ?? item.href;
        const active = pathname === base || pathname.startsWith(`${base}/`);
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ' +
              (active
                ? 'bg-fg/[0.08] text-fg'
                : 'text-muted hover:bg-fg/[0.05] hover:text-fg')
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
