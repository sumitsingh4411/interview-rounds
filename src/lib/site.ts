export const SITE = {
  name: 'The Loop',
  tagline: 'Know every round before you walk in.',
  description:
    'Real interview questions from top companies, organized by round, role, and level — so you prep for exactly what you will face.',
  url: 'https://interview-rounds.nextjoblist.com',
  repo: 'https://github.com/sumitsingh4411/interview-rounds',
};

/** FrontendPro: hands-on frontend interview practice. `placement` tags the visit in its analytics. */
export function frontendProUrl(placement: string): string {
  return `https://frontend.nextjoblist.com/?utm_source=interview-rounds&utm_medium=site&utm_campaign=${encodeURIComponent(placement)}`;
}
