import Link from 'next/link';

/**
 * Placeholder auth control. Task 8 (auth) replaces this with real
 * session-aware sign-in / avatar UI.
 */
export function AuthNav() {
  return (
    <Link
      href="/api/auth/signin"
      className="rounded-lg border border-line px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:border-line-2 hover:text-fg"
    >
      Sign in
    </Link>
  );
}
