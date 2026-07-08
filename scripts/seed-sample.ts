import { upsertCompany, upsertQuestion, type SeedCompany, type SeedQuestion } from './_shared';

const DATA: { company: SeedCompany; questions: SeedQuestion[] }[] = [
  {
    company: {
      name: 'Google',
      slug: 'google',
      description: 'Search, Ads, Cloud, Android and more. Known for a rigorous, algorithm-heavy loop.',
      industry: 'Big Tech',
      hq: 'Mountain View, CA',
    },
    questions: [
      { title: 'Given a stream of integers, return the median at any point.', role: 'backend', level: 'senior', round: 'dsa', difficulty: 'hard', tags: ['heap', 'streaming'], sourceType: 'ai' },
      { title: 'Implement an LRU cache with O(1) get and put.', role: 'fullstack', level: 'mid', round: 'dsa', difficulty: 'medium', tags: ['hashmap', 'linked-list'], sourceType: 'github', sourceUrl: 'https://github.com/topics/interview-questions' },
      { title: 'Design a URL shortener like TinyURL.', role: 'backend', level: 'senior', round: 'system_design', difficulty: 'hard', tags: ['hashing', 'sharding', 'cache'], sourceType: 'ai' },
      { title: 'Build a debounced autocomplete component in React.', role: 'frontend', level: 'mid', round: 'machine_coding', difficulty: 'medium', tags: ['react', 'debounce', 'a11y'], sourceType: 'community', sourceAuthor: 'anonymous' },
      { title: 'Explain how the JavaScript event loop handles microtasks vs macrotasks.', role: 'frontend', level: 'mid', round: 'tech_deep_dive', difficulty: 'medium', tags: ['javascript', 'event-loop'], sourceType: 'ai' },
      { title: 'Tell me about a time you disagreed with your manager. What happened?', role: 'fullstack', level: 'senior', round: 'behavioral', difficulty: 'medium', tags: ['leadership', 'star'], sourceType: 'ai' },
    ],
  },
  {
    company: {
      name: 'Meta',
      slug: 'meta',
      description: 'Facebook, Instagram, WhatsApp. Frontend loops lean heavily on React internals.',
      industry: 'Big Tech',
      hq: 'Menlo Park, CA',
    },
    questions: [
      { title: 'Implement a function to deep-clone a JS object with circular references.', role: 'frontend', level: 'senior', round: 'machine_coding', difficulty: 'hard', tags: ['javascript', 'recursion'], sourceType: 'ai' },
      { title: 'Design the Facebook News Feed backend.', role: 'backend', level: 'staff', round: 'system_design', difficulty: 'hard', tags: ['fanout', 'ranking', 'cache'], sourceType: 'ai' },
      { title: 'Build an infinite-scrolling image grid with virtualization.', role: 'frontend', level: 'senior', round: 'machine_coding', difficulty: 'hard', tags: ['react', 'virtualization', 'perf'], sourceType: 'community', sourceAuthor: 'anonymous' },
      { title: 'Merge k sorted linked lists.', role: 'fullstack', level: 'mid', round: 'dsa', difficulty: 'hard', tags: ['heap', 'linked-list'], sourceType: 'github', sourceUrl: 'https://github.com/topics/interview-questions' },
      { title: 'How does React reconciliation and the diffing algorithm work?', role: 'frontend', level: 'senior', round: 'tech_deep_dive', difficulty: 'medium', tags: ['react', 'fiber'], sourceType: 'ai' },
      { title: 'Timed online assessment: two medium DSA problems in 60 minutes.', role: 'fullstack', level: 'junior', round: 'oa', difficulty: 'medium', tags: ['arrays', 'strings'], sourceType: 'ai' },
    ],
  },
  {
    company: {
      name: 'Amazon',
      slug: 'amazon',
      description: 'E-commerce and AWS. Every loop weighs answers against the Leadership Principles.',
      industry: 'Big Tech',
      hq: 'Seattle, WA',
    },
    questions: [
      { title: 'Find the number of islands in a 2D grid.', role: 'backend', level: 'junior', round: 'dsa', difficulty: 'medium', tags: ['bfs', 'dfs', 'grid'], sourceType: 'github', sourceUrl: 'https://github.com/topics/interview-questions' },
      { title: 'Design a rate limiter for an API gateway.', role: 'backend', level: 'senior', round: 'system_design', difficulty: 'hard', tags: ['token-bucket', 'redis'], sourceType: 'ai' },
      { title: 'Design classes for a parking lot (LLD).', role: 'backend', level: 'mid', round: 'lld', difficulty: 'medium', tags: ['oop', 'design-patterns'], sourceType: 'ai' },
      { title: 'Tell me about a time you took ownership of a problem outside your scope.', role: 'fullstack', level: 'mid', round: 'behavioral', difficulty: 'medium', tags: ['ownership', 'star'], sourceType: 'ai' },
      { title: 'Build a REST endpoint with pagination, filtering and sorting.', role: 'backend', level: 'mid', round: 'machine_coding', difficulty: 'medium', tags: ['api', 'pagination'], sourceType: 'community', sourceAuthor: 'anonymous' },
    ],
  },
  {
    company: {
      name: 'Microsoft',
      slug: 'microsoft',
      description: 'Azure, Windows, Office, GitHub. Balanced loops across coding and design.',
      industry: 'Big Tech',
      hq: 'Redmond, WA',
    },
    questions: [
      { title: 'Reverse a linked list, both iteratively and recursively.', role: 'fullstack', level: 'junior', round: 'dsa', difficulty: 'easy', tags: ['linked-list'], sourceType: 'github', sourceUrl: 'https://github.com/topics/interview-questions' },
      { title: 'Design a distributed key-value store.', role: 'backend', level: 'staff', round: 'system_design', difficulty: 'hard', tags: ['consistency', 'replication'], sourceType: 'ai' },
      { title: 'What are the differences between CSS Grid and Flexbox, and when do you use each?', role: 'frontend', level: 'junior', round: 'tech_deep_dive', difficulty: 'easy', tags: ['css', 'layout'], sourceType: 'ai' },
      { title: 'How would you scope and staff a 6-month migration project?', role: 'fullstack', level: 'senior', round: 'hiring_manager', difficulty: 'medium', tags: ['planning', 'leadership'], sourceType: 'ai' },
    ],
  },
  {
    company: {
      name: 'Netflix',
      slug: 'netflix',
      description: 'Streaming at massive scale. Senior-heavy hiring bar with a strong culture focus.',
      industry: 'Streaming',
      hq: 'Los Gatos, CA',
    },
    questions: [
      { title: 'Design a video streaming service (CDN, encoding, adaptive bitrate).', role: 'backend', level: 'staff', round: 'system_design', difficulty: 'hard', tags: ['cdn', 'streaming', 'scale'], sourceType: 'ai' },
      { title: 'Build a performant, accessible video player controls bar.', role: 'frontend', level: 'senior', round: 'machine_coding', difficulty: 'hard', tags: ['a11y', 'media', 'perf'], sourceType: 'community', sourceAuthor: 'anonymous' },
      { title: 'How do you keep a large React app performant as it grows?', role: 'frontend', level: 'senior', round: 'tech_deep_dive', difficulty: 'hard', tags: ['react', 'perf', 'bundling'], sourceType: 'ai' },
      { title: 'Describe a time you made a high-impact decision with incomplete data.', role: 'fullstack', level: 'senior', round: 'behavioral', difficulty: 'hard', tags: ['judgment', 'star'], sourceType: 'ai' },
    ],
  },
  {
    company: {
      name: 'Stripe',
      slug: 'stripe',
      description: 'Payments infrastructure. Practical, real-world coding over pure algorithms.',
      industry: 'Fintech',
      hq: 'South San Francisco, CA',
    },
    questions: [
      { title: 'Implement an idempotent payment-charge function.', role: 'backend', level: 'senior', round: 'machine_coding', difficulty: 'hard', tags: ['idempotency', 'payments'], sourceType: 'ai' },
      { title: 'Parse and evaluate a simple currency-conversion expression.', role: 'fullstack', level: 'mid', round: 'machine_coding', difficulty: 'medium', tags: ['parsing', 'practical'], sourceType: 'community', sourceAuthor: 'anonymous' },
      { title: 'Design an idempotency and retry system for a payments API.', role: 'backend', level: 'staff', round: 'system_design', difficulty: 'hard', tags: ['idempotency', 'consistency'], sourceType: 'ai' },
      { title: 'How do you handle money precisely in JavaScript/TypeScript?', role: 'frontend', level: 'mid', round: 'tech_deep_dive', difficulty: 'medium', tags: ['numbers', 'money'], sourceType: 'ai' },
    ],
  },
  {
    company: {
      name: 'Uber',
      slug: 'uber',
      description: 'Ride-hailing and delivery. Real-time, geospatial systems feature heavily.',
      industry: 'Marketplace',
      hq: 'San Francisco, CA',
    },
    questions: [
      { title: 'Design the backend for matching riders to nearby drivers.', role: 'backend', level: 'senior', round: 'system_design', difficulty: 'hard', tags: ['geospatial', 'matching', 'realtime'], sourceType: 'ai' },
      { title: 'Find the shortest path in a weighted graph (Dijkstra).', role: 'backend', level: 'mid', round: 'dsa', difficulty: 'medium', tags: ['graph', 'dijkstra'], sourceType: 'github', sourceUrl: 'https://github.com/topics/interview-questions' },
      { title: 'Build a live-updating map marker list with WebSocket updates.', role: 'frontend', level: 'senior', round: 'machine_coding', difficulty: 'hard', tags: ['websocket', 'react', 'realtime'], sourceType: 'community', sourceAuthor: 'anonymous' },
      { title: 'Design classes for an elevator system (LLD).', role: 'fullstack', level: 'mid', round: 'lld', difficulty: 'medium', tags: ['oop', 'state-machine'], sourceType: 'ai' },
    ],
  },
  {
    company: {
      name: 'Atlassian',
      slug: 'atlassian',
      description: 'Jira, Confluence, Trello. Values-driven loop with strong frontend craft.',
      industry: 'SaaS',
      hq: 'Sydney, Australia',
    },
    questions: [
      { title: 'Build a nested, collapsible comment thread component.', role: 'frontend', level: 'mid', round: 'machine_coding', difficulty: 'medium', tags: ['react', 'recursion', 'a11y'], sourceType: 'community', sourceAuthor: 'anonymous' },
      { title: 'Group anagrams from a list of strings.', role: 'fullstack', level: 'junior', round: 'dsa', difficulty: 'easy', tags: ['hashmap', 'strings'], sourceType: 'github', sourceUrl: 'https://github.com/topics/interview-questions' },
      { title: 'Design a commenting and mentions system.', role: 'backend', level: 'senior', round: 'system_design', difficulty: 'medium', tags: ['notifications', 'search'], sourceType: 'ai' },
      { title: 'How do you approach making a component library accessible?', role: 'frontend', level: 'senior', round: 'tech_deep_dive', difficulty: 'medium', tags: ['a11y', 'design-system'], sourceType: 'ai' },
      { title: 'Tell us about a time you improved team collaboration.', role: 'fullstack', level: 'mid', round: 'behavioral', difficulty: 'easy', tags: ['teamwork', 'star'], sourceType: 'ai' },
    ],
  },
];

async function main() {
  let companiesUpserted = 0;
  let inserted = 0;
  let skipped = 0;

  for (const { company, questions } of DATA) {
    const companyId = await upsertCompany(company);
    companiesUpserted += 1;
    for (const q of questions) {
      const didInsert = await upsertQuestion(companyId, q);
      if (didInsert) inserted += 1;
      else skipped += 1;
    }
  }

  console.log(
    `\n✔ Seed complete: ${companiesUpserted} companies, ${inserted} questions inserted, ${skipped} already present.\n`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
