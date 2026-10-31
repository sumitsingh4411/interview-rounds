export const SITE = {
  name: 'The Loop',
  tagline: 'Know every round before you walk in.',
  description:
    'Real interview questions from top companies, organized by round, role, and level — so you prep for exactly what you will face.',
  url: 'https://interview-rounds.nextjoblist.com',
  repo: 'https://github.com/sumitsingh4411/interview-rounds',
};

/** UIRound: hands-on frontend interview practice. `placement` tags the visit in its analytics. */
export function uiRoundUrl(placement: string): string {
  return `https://uiround.com/?utm_source=interview-rounds&utm_medium=site&utm_campaign=${encodeURIComponent(placement)}`;
}
