import type { Role, Level, Round, Difficulty } from '../../src/lib/constants';

export type BankQ = { title: string; difficulty?: Difficulty; tags?: string[] };

// ---------------------------------------------------------------------------
// Curated question pools — commonly reported questions by round (and role).
// ---------------------------------------------------------------------------
const DSA: BankQ[] = [
  { title: 'Two Sum — return indices of numbers adding to a target.', difficulty: 'easy', tags: ['array', 'hashmap'] },
  { title: 'Valid Parentheses — check balanced brackets.', difficulty: 'easy', tags: ['stack', 'string'] },
  { title: 'Merge two sorted linked lists.', difficulty: 'easy', tags: ['linked-list'] },
  { title: 'Best time to buy and sell stock.', difficulty: 'easy', tags: ['array', 'greedy'] },
  { title: 'Group anagrams from a list of strings.', difficulty: 'medium', tags: ['hashmap', 'string'] },
  { title: 'Number of islands in a 2D grid.', difficulty: 'medium', tags: ['bfs', 'dfs', 'grid'] },
  { title: 'Longest substring without repeating characters.', difficulty: 'medium', tags: ['sliding-window', 'string'] },
  { title: 'Course Schedule — detect a cycle / topological sort.', difficulty: 'medium', tags: ['graph', 'topo-sort'] },
  { title: 'LRU cache with O(1) get and put.', difficulty: 'medium', tags: ['hashmap', 'linked-list'] },
  { title: 'Kth largest element in an array.', difficulty: 'medium', tags: ['heap', 'quickselect'] },
  { title: 'Word ladder — shortest transformation sequence.', difficulty: 'hard', tags: ['bfs', 'graph'] },
  { title: 'Merge k sorted lists.', difficulty: 'hard', tags: ['heap', 'linked-list'] },
  { title: 'Median of two sorted arrays.', difficulty: 'hard', tags: ['binary-search'] },
  { title: 'Serialize and deserialize a binary tree.', difficulty: 'hard', tags: ['tree', 'dfs'] },
  { title: 'Trapping rain water.', difficulty: 'hard', tags: ['two-pointers', 'array'] },
];

const OA: BankQ[] = [
  { title: 'Two timed medium array/string problems in 70 minutes.', difficulty: 'medium', tags: ['arrays', 'strings'] },
  { title: 'Implement a min-stack supporting getMin in O(1).', difficulty: 'medium', tags: ['stack'] },
  { title: 'Count pairs with a given sum in an array.', difficulty: 'easy', tags: ['hashmap'] },
  { title: 'Rotate a matrix 90 degrees in place.', difficulty: 'medium', tags: ['matrix'] },
  { title: 'Debugging + output-prediction multiple choice section.', difficulty: 'easy', tags: ['fundamentals'] },
  { title: 'Simulate a simple inventory system from a spec.', difficulty: 'medium', tags: ['simulation'] },
];

const BEHAVIORAL: BankQ[] = [
  { title: 'Tell me about a project you are most proud of.', tags: ['star'] },
  { title: 'Describe a time you disagreed with a teammate. How did it resolve?', tags: ['conflict', 'star'] },
  { title: 'Tell me about a time you failed and what you learned.', tags: ['growth', 'star'] },
  { title: 'When did you take ownership of something outside your scope?', tags: ['ownership', 'star'] },
  { title: 'Describe handling a tight deadline with competing priorities.', tags: ['prioritization', 'star'] },
  { title: 'Tell me about receiving hard feedback and acting on it.', tags: ['feedback', 'star'] },
  { title: 'A time you influenced a decision without authority.', tags: ['influence', 'star'] },
  { title: 'Describe mentoring or unblocking another engineer.', tags: ['mentorship', 'star'] },
  { title: 'A time you made a mistake in production — what happened next?', tags: ['ownership', 'star'] },
  { title: 'Why this company, and why this role?', tags: ['motivation'] },
  { title: 'Tell me about a time you simplified something overly complex.', tags: ['judgment', 'star'] },
  { title: 'Describe working with an ambiguous or shifting requirement.', tags: ['ambiguity', 'star'] },
];

const HIRING_MANAGER: BankQ[] = [
  { title: 'Walk me through the architecture of a system you owned end to end.', tags: ['ownership', 'architecture'] },
  { title: 'How do you scope and staff a multi-month project?', tags: ['planning', 'leadership'] },
  { title: 'How do you decide what to build vs. buy vs. defer?', tags: ['judgment'] },
  { title: 'Tell me about a technical bet that did not pay off.', tags: ['risk', 'judgment'] },
  { title: 'How do you handle disagreement with a product partner?', tags: ['collaboration'] },
  { title: 'What does a great engineering culture look like to you?', tags: ['values'] },
  { title: 'How do you keep a team unblocked and shipping?', tags: ['leadership'] },
  { title: 'Where do you want to grow in the next two years?', tags: ['growth'] },
];

const SYSTEM_DESIGN_GENERAL: BankQ[] = [
  { title: 'Design a URL shortener like TinyURL.', difficulty: 'medium', tags: ['hashing', 'cache', 'sharding'] },
  { title: 'Design a rate limiter for a public API.', difficulty: 'medium', tags: ['token-bucket', 'redis'] },
  { title: 'Design a distributed key-value store.', difficulty: 'hard', tags: ['replication', 'consistency'] },
  { title: 'Design a news feed / timeline.', difficulty: 'hard', tags: ['fanout', 'ranking', 'cache'] },
  { title: 'Design a notification system (push/email/SMS).', difficulty: 'medium', tags: ['queues', 'fanout'] },
  { title: 'Design a web crawler.', difficulty: 'hard', tags: ['queues', 'dedup', 'scale'] },
  { title: 'Design a pastebin with expiring links.', difficulty: 'medium', tags: ['storage', 'ttl'] },
  { title: 'Design a typeahead / autocomplete service.', difficulty: 'hard', tags: ['trie', 'cache', 'ranking'] },
];

const SYSTEM_DESIGN_FRONTEND: BankQ[] = [
  { title: 'Design a scalable frontend for an infinite feed (data, caching, rendering).', difficulty: 'hard', tags: ['frontend', 'virtualization', 'cache'] },
  { title: 'Design a component/design-system architecture for many teams.', difficulty: 'medium', tags: ['frontend', 'design-system'] },
  { title: 'Design client-side state and data-fetching for a large SPA.', difficulty: 'hard', tags: ['frontend', 'state', 'caching'] },
  { title: 'Design an offline-capable web app with sync.', difficulty: 'hard', tags: ['frontend', 'offline', 'sync'] },
];

const SYSTEM_DESIGN_BACKEND: BankQ[] = [
  { title: 'Design a ride-matching backend (riders ↔ nearby drivers).', difficulty: 'hard', tags: ['geospatial', 'matching', 'realtime'] },
  { title: 'Design a payment processing + idempotency system.', difficulty: 'hard', tags: ['idempotency', 'consistency'] },
  { title: 'Design a chat/messaging backend with delivery guarantees.', difficulty: 'hard', tags: ['websocket', 'queues'] },
  { title: 'Design a metrics/time-series ingestion pipeline.', difficulty: 'hard', tags: ['time-series', 'ingestion'] },
];

const MACHINE_CODING_FRONTEND: BankQ[] = [
  { title: 'Build a debounced autocomplete/search box with keyboard nav.', difficulty: 'medium', tags: ['react', 'debounce', 'a11y'] },
  { title: 'Build a nested, collapsible comment thread.', difficulty: 'medium', tags: ['react', 'recursion'] },
  { title: 'Build an infinite-scrolling list with virtualization.', difficulty: 'hard', tags: ['react', 'virtualization', 'perf'] },
  { title: 'Build a star-rating component (controlled + accessible).', difficulty: 'easy', tags: ['react', 'a11y'] },
  { title: 'Build a multi-step form with validation.', difficulty: 'medium', tags: ['react', 'forms'] },
  { title: 'Build a tic-tac-toe game with win detection.', difficulty: 'easy', tags: ['react', 'state'] },
  { title: 'Build a data table with sorting, filtering and pagination.', difficulty: 'hard', tags: ['react', 'table'] },
  { title: 'Build a modal/dialog with focus trapping.', difficulty: 'medium', tags: ['react', 'a11y'] },
  { title: 'Build a carousel/image slider.', difficulty: 'medium', tags: ['react', 'ui'] },
  { title: 'Build a "polling" progress UI that updates from an API.', difficulty: 'medium', tags: ['react', 'async'] },
];

const MACHINE_CODING_BACKEND: BankQ[] = [
  { title: 'Build a REST endpoint with pagination, filtering and sorting.', difficulty: 'medium', tags: ['api', 'pagination'] },
  { title: 'Implement an idempotent "charge" endpoint.', difficulty: 'hard', tags: ['idempotency', 'payments'] },
  { title: 'Build an in-memory rate limiter as a middleware.', difficulty: 'medium', tags: ['rate-limit', 'middleware'] },
  { title: 'Parse and evaluate a simple expression/DSL.', difficulty: 'medium', tags: ['parsing'] },
  { title: 'Build a key-value store with TTL expiry.', difficulty: 'medium', tags: ['cache', 'ttl'] },
  { title: 'Implement a job queue with retries and backoff.', difficulty: 'hard', tags: ['queue', 'reliability'] },
  { title: 'Design and build a URL-shortener service (API + storage).', difficulty: 'medium', tags: ['api', 'hashing'] },
  { title: 'Build a CSV importer that streams and validates rows.', difficulty: 'medium', tags: ['streaming', 'validation'] },
];

const LLD_FRONTEND: BankQ[] = [
  { title: 'Design the component model for a rich text editor.', difficulty: 'hard', tags: ['oop', 'editor'] },
  { title: 'Design a reusable form-validation library API.', difficulty: 'medium', tags: ['oop', 'api-design'] },
  { title: 'Model the state machine for a checkout flow.', difficulty: 'medium', tags: ['state-machine'] },
  { title: 'Design a client-side event bus / pub-sub.', difficulty: 'medium', tags: ['pub-sub', 'oop'] },
];

const LLD_BACKEND: BankQ[] = [
  { title: 'Design classes for a parking lot.', difficulty: 'medium', tags: ['oop', 'design-patterns'] },
  { title: 'Design an elevator control system.', difficulty: 'medium', tags: ['oop', 'state-machine'] },
  { title: 'Design a deck of cards + a card game.', difficulty: 'easy', tags: ['oop'] },
  { title: 'Design a rate limiter (classes + interfaces).', difficulty: 'medium', tags: ['oop', 'rate-limit'] },
  { title: 'Design an in-memory file system.', difficulty: 'hard', tags: ['oop', 'trees'] },
  { title: 'Design a splitwise-style expense sharer.', difficulty: 'medium', tags: ['oop', 'graph'] },
  { title: 'Design a vending machine.', difficulty: 'easy', tags: ['oop', 'state-machine'] },
  { title: 'Design a booking/reservation system core.', difficulty: 'medium', tags: ['oop', 'concurrency'] },
];

const TECH_FRONTEND: BankQ[] = [
  { title: 'Explain the JS event loop: microtasks vs macrotasks.', difficulty: 'medium', tags: ['javascript', 'event-loop'] },
  { title: 'How does React reconciliation / the diffing algorithm work?', difficulty: 'medium', tags: ['react', 'fiber'] },
  { title: 'Closures and the module pattern — with an example.', difficulty: 'easy', tags: ['javascript', 'closures'] },
  { title: 'Difference between CSS Grid and Flexbox — when to use each.', difficulty: 'easy', tags: ['css', 'layout'] },
  { title: 'Explain `this` binding and the call/apply/bind trio.', difficulty: 'medium', tags: ['javascript'] },
  { title: 'Debounce vs throttle — implement one from scratch.', difficulty: 'medium', tags: ['javascript', 'perf'] },
  { title: 'How do you optimize a slow React app? (profiling → fixes)', difficulty: 'hard', tags: ['react', 'perf'] },
  { title: 'Explain hydration and the cost of client vs server rendering.', difficulty: 'hard', tags: ['ssr', 'perf'] },
  { title: 'Event delegation and how bubbling/capturing work.', difficulty: 'easy', tags: ['dom'] },
  { title: 'How does the browser critical rendering path work?', difficulty: 'medium', tags: ['browser', 'perf'] },
  { title: 'Accessibility: how do you make a custom widget usable?', difficulty: 'medium', tags: ['a11y'] },
  { title: 'Explain `useEffect` dependencies and common pitfalls.', difficulty: 'medium', tags: ['react', 'hooks'] },
];

const TECH_BACKEND: BankQ[] = [
  { title: 'SQL vs NoSQL — how do you choose for a given workload?', difficulty: 'medium', tags: ['databases'] },
  { title: 'Explain database indexing and when a query uses one.', difficulty: 'medium', tags: ['databases', 'indexing'] },
  { title: 'ACID vs BASE and transaction isolation levels.', difficulty: 'hard', tags: ['databases', 'transactions'] },
  { title: 'How would you design and version a public REST API?', difficulty: 'medium', tags: ['api-design'] },
  { title: 'Explain how you handle concurrency / race conditions.', difficulty: 'hard', tags: ['concurrency'] },
  { title: 'Caching strategies: cache-aside, write-through, TTLs.', difficulty: 'medium', tags: ['cache'] },
  { title: 'How does HTTPS/TLS establish a secure connection?', difficulty: 'medium', tags: ['networking', 'security'] },
  { title: 'Idempotency in APIs — why and how.', difficulty: 'medium', tags: ['api-design', 'idempotency'] },
  { title: 'Message queues vs pub/sub — when to use each.', difficulty: 'medium', tags: ['messaging'] },
  { title: 'How do you prevent and detect N+1 queries?', difficulty: 'medium', tags: ['databases', 'orm'] },
  { title: 'Explain eventual consistency with a real example.', difficulty: 'hard', tags: ['distributed'] },
  { title: 'How do you secure secrets and handle auth tokens?', difficulty: 'medium', tags: ['security'] },
];

function poolFor(role: Role, round: Round): BankQ[] {
  switch (round) {
    case 'oa':
      return OA;
    case 'dsa':
      return DSA;
    case 'behavioral':
      return BEHAVIORAL;
    case 'hiring_manager':
      return HIRING_MANAGER;
    case 'system_design':
      return role === 'frontend'
        ? [...SYSTEM_DESIGN_FRONTEND, ...SYSTEM_DESIGN_GENERAL]
        : role === 'backend'
          ? [...SYSTEM_DESIGN_BACKEND, ...SYSTEM_DESIGN_GENERAL]
          : [...SYSTEM_DESIGN_GENERAL, ...SYSTEM_DESIGN_FRONTEND, ...SYSTEM_DESIGN_BACKEND];
    case 'machine_coding':
      return role === 'frontend'
        ? MACHINE_CODING_FRONTEND
        : role === 'backend'
          ? MACHINE_CODING_BACKEND
          : [...MACHINE_CODING_FRONTEND, ...MACHINE_CODING_BACKEND];
    case 'lld':
      return role === 'frontend'
        ? LLD_FRONTEND
        : role === 'backend'
          ? LLD_BACKEND
          : [...LLD_FRONTEND, ...LLD_BACKEND];
    case 'tech_deep_dive':
      return role === 'frontend'
        ? TECH_FRONTEND
        : role === 'backend'
          ? TECH_BACKEND
          : [...TECH_FRONTEND, ...TECH_BACKEND];
    default:
      return [];
  }
}

// ---------------------------------------------------------------------------
// Interview composition
// ---------------------------------------------------------------------------
const ROUND_PLANS: Record<Level, Round[]> = {
  intern: ['oa', 'dsa', 'tech_deep_dive', 'behavioral'],
  junior: ['oa', 'dsa', 'machine_coding', 'tech_deep_dive', 'behavioral'],
  mid: ['dsa', 'machine_coding', 'lld', 'tech_deep_dive', 'behavioral'],
  senior: ['dsa', 'machine_coding', 'system_design', 'tech_deep_dive', 'hiring_manager', 'behavioral'],
  staff: ['dsa', 'system_design', 'lld', 'hiring_manager', 'behavioral'],
};

// How many questions to draw per round.
const ROUND_QUOTA: Partial<Record<Round, number>> = {
  dsa: 2,
  system_design: 2,
  machine_coding: 2,
  tech_deep_dive: 2,
};

export const PROFILES: { role: Role; level: Level }[] = [
  { role: 'frontend', level: 'junior' },
  { role: 'backend', level: 'mid' },
  { role: 'fullstack', level: 'senior' },
  { role: 'frontend', level: 'senior' },
  { role: 'backend', level: 'staff' },
  { role: 'fullstack', level: 'junior' },
  { role: 'backend', level: 'senior' },
  { role: 'frontend', level: 'mid' },
];

const OUTCOMES_WEIGHTED = [
  'offer',
  'offer',
  'rejected',
  'no_offer',
  'unknown',
  'withdrew',
] as const;

const YEARS = [2023, 2024, 2025];

// Deterministic PRNG so a given company always produces the same interviews.
function hashStr(s: string): number {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i += 1) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickN<T>(pool: T[], n: number, rng: () => number): T[] {
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

export type ComposedRound = { round: Round; questions: BankQ[] };
export type ComposedInterview = {
  role: Role;
  level: Level;
  outcome: (typeof OUTCOMES_WEIGHTED)[number];
  year: number;
  summary: string;
  rounds: ComposedRound[];
};

function summaryFor(role: Role, level: Level, rounds: number, rng: () => number): string {
  const openers = [
    `A ${level} ${role} loop`,
    `${rounds}-round ${level} ${role} process`,
    `${level.charAt(0).toUpperCase()}${level.slice(1)} ${role} interview`,
  ];
  const flavors = [
    'Coding-heavy early, design and behavioral later.',
    'Pragmatic questions — more real-world than pure puzzles.',
    'Fast-paced; expect follow-ups that push on depth.',
    'Balanced across coding, design, and collaboration.',
    'Fundamentals mattered as much as getting to an answer.',
  ];
  return `${openers[Math.floor(rng() * openers.length)]}. ${flavors[Math.floor(rng() * flavors.length)]}`;
}

/** Build the interview experiences for a company (deterministic by slug). */
export function composeInterviews(
  slug: string,
  count = 4,
): ComposedInterview[] {
  const rng = mulberry32(hashStr(slug));
  const start = hashStr(slug) % PROFILES.length;

  const interviews: ComposedInterview[] = [];
  for (let i = 0; i < count; i += 1) {
    const { role, level } = PROFILES[(start + i) % PROFILES.length];
    const plan = ROUND_PLANS[level];
    const rounds: ComposedRound[] = plan
      .map((round) => {
        const quota = ROUND_QUOTA[round] ?? 1;
        const questions = pickN(poolFor(role, round), quota, rng);
        return { round, questions };
      })
      .filter((r) => r.questions.length > 0);

    interviews.push({
      role,
      level,
      outcome: OUTCOMES_WEIGHTED[Math.floor(rng() * OUTCOMES_WEIGHTED.length)],
      year: YEARS[Math.floor(rng() * YEARS.length)],
      summary: summaryFor(role, level, rounds.length, rng),
      rounds,
    });
  }
  return interviews;
}
