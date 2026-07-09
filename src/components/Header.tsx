import { Container } from './ui/Container';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { NavLinks } from './NavLinks';
import { SITE } from '@/lib/site';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/60 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-6">
        {/* Left: brand + nav, grouped so the bar has weight */}
        <div className="flex items-center gap-7">
          <Logo />
          <NavLinks />
        </div>

        {/* Right: repo + theme */}
        <div className="flex items-center gap-2">
          <a
            href={SITE.repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-line-2 hover:text-fg"
          >
            <svg width="17" height="17" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
          </a>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
