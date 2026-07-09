import Link from 'next/link';
import { Container } from './ui/Container';
import { Logo } from './Logo';
import { SITE } from '@/lib/site';
import { ROUND_ORDER, ROUND_LABELS, ROUND_COLORS } from '@/lib/constants';

const BROWSE = [
  { href: '/companies', label: 'Companies' },
  { href: '/search', label: 'Search' },
  { href: '/rounds/dsa', label: 'All rounds' },
];

// The first four stages of a loop — enough to be useful without a wall of links.
const ROUNDS = ROUND_ORDER.slice(0, 4);

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div className="max-w-sm space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed text-muted">
            Interview questions from top companies, mapped to the exact round
            they show up in. Prep for what you will actually face.
          </p>
          <a
            href={SITE.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted hover:text-fg"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            View source
          </a>
        </div>

        {/* Browse */}
        <nav className="space-y-3 text-sm">
          <p className="eyebrow">Browse</p>
          {BROWSE.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-muted transition-colors hover:text-fg"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Rounds — each dot carries that round's colour */}
        <nav className="space-y-3 text-sm">
          <p className="eyebrow">Rounds</p>
          {ROUNDS.map((r) => (
            <Link
              key={r}
              href={`/rounds/${r}`}
              className="group flex items-center gap-2 text-muted transition-colors hover:text-fg"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full transition-transform group-hover:scale-125"
                style={{ backgroundColor: ROUND_COLORS[r].from }}
              />
              {ROUND_LABELS[r]}
            </Link>
          ))}
        </nav>

        {/* Contribute */}
        <nav className="space-y-3 text-sm">
          <p className="eyebrow">Contribute</p>
          <a
            href={`${SITE.repo}#-add-your-own-interview`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-muted transition-colors hover:text-fg"
          >
            Share an interview
          </a>
          <a
            href={`${SITE.repo}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-muted transition-colors hover:text-fg"
          >
            Report an issue
          </a>
          <a
            href={SITE.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-muted transition-colors hover:text-fg"
          >
            Star on GitHub
          </a>
        </nav>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <Container className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl text-xs leading-relaxed text-faint">
            {SITE.name} aggregates publicly shared interview experiences and
            curated commonly-asked questions, each labeled with its source. Not
            affiliated with any company listed.
          </p>
          <p className="shrink-0 font-mono text-xs text-faint">
            MIT · © {new Date().getFullYear()}
          </p>
        </Container>
      </div>
    </footer>
  );
}
