import { ImageResponse } from 'next/og';
import { getTotals } from '@/content/loader';
import { SITE } from '@/lib/site';

export const alt =
  'The Loop — real interview questions from top companies, mapped to every round';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// A branded social-share card, generated at build time. Numbers stay in sync
// with the content because they come from getTotals().
export default function OpengraphImage() {
  const t = getTotals();

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          background: '#0b0e14',
          backgroundImage:
            'radial-gradient(1000px 500px at 85% -10%, rgba(129,140,248,0.25), transparent)',
          color: '#ffffff',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              width: 40,
              height: 40,
              borderRadius: 999,
              border: '5px solid #818cf8',
              borderRightColor: 'transparent',
            }}
          />
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 700 }}>
            {SITE.name}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 74, fontWeight: 700, letterSpacing: -2 }}>
            Know every round before you walk in.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              color: '#9aa4b2',
              marginTop: 26,
              maxWidth: 900,
            }}
          >
            Real interview questions from {t.companies} top tech companies —
            mapped to the exact round, role and level.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 52, fontSize: 30 }}>
          {[
            [String(t.companies), 'companies'],
            [t.questions.toLocaleString(), 'questions'],
            [String(t.interviews), 'experiences'],
          ].map(([n, label]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>{n}</span>
              <span style={{ color: '#9aa4b2' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
