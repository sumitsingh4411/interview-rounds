import Link from 'next/link';
import { Container } from './ui/Container';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { AuthNav } from './AuthNav';

const NAV = [
  { href: '/companies', label: 'Companies' },
  { href: '/search', label: 'Search' },
  { href: '/submit', label: 'Share yours' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 sm:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AuthNav />
        </div>
      </Container>
    </header>
  );
}
