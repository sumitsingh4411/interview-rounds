import Link from 'next/link';
import { Container } from './ui/Container';
import { Logo } from './Logo';
import { SITE } from '@/lib/site';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm space-y-3">
          <Logo />
          <p className="text-sm text-muted">
            Interview questions from top companies, mapped to the exact round
            they show up in. Prep for what you will actually face.
          </p>
        </div>
        <nav className="flex gap-12 text-sm">
          <div className="space-y-2">
            <p className="eyebrow">Browse</p>
            <Link href="/companies" className="block text-muted hover:text-fg">
              Companies
            </Link>
            <Link href="/search" className="block text-muted hover:text-fg">
              Search
            </Link>
          </div>
          <div className="space-y-2">
            <p className="eyebrow">Contribute</p>
            <Link href="/submit" className="block text-muted hover:text-fg">
              Share an interview
            </Link>
          </div>
        </nav>
      </Container>
      <Container className="border-t border-line py-5">
        <p className="text-xs text-faint">
          {SITE.name} aggregates publicly shared interview experiences and
          AI-generated likely questions (clearly labeled). Questions link back to
          their source where available. Not affiliated with any company listed.
        </p>
      </Container>
    </footer>
  );
}
