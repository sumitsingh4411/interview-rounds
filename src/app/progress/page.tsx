import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { ProgressView } from '@/components/progress/ProgressView';

export const metadata: Metadata = {
  title: 'Your progress',
  description:
    'Track which interview questions you have solved — by round, role, level and company. Stored in your browser, no account needed.',
};

export default function ProgressPage() {
  return (
    <Container className="py-12">
      <p className="eyebrow">Dashboard</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-fg sm:text-4xl">
        Your progress
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Everything you have ticked off, broken down by round, role, level and
        company. Progress lives in this browser only — no account, no server.
        Export a backup if you want it on another device.
      </p>

      <div className="mt-10">
        <ProgressView />
      </div>
    </Container>
  );
}
