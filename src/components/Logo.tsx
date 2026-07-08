import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="The Loop — home"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        className="shrink-0"
        aria-hidden
      >
        {/* A loop: open ring + node, echoing the interview "loop". */}
        <path
          d="M13 3.5a9.5 9.5 0 1 1-7.6 3.8"
          stroke="var(--brand)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="5.4" cy="7.3" r="2.6" fill="var(--brand)" />
      </svg>
      <span className="font-display text-[1.05rem] font-semibold tracking-tight text-fg">
        the<span className="text-brand">loop</span>
      </span>
    </Link>
  );
}
