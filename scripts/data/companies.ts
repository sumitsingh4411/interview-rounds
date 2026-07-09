export type SeedCompany = {
  name: string;
  slug: string;
  description?: string;
  industry?: string;
  hq?: string;
  /** Surfaced first on the home page. */
  featured?: boolean;
};

// Top companies commonly targeted for frontend / backend / full-stack roles.
export const COMPANIES: SeedCompany[] = [
  { name: 'Google', slug: 'google', featured: true, industry: 'Big Tech', hq: 'Mountain View, CA', description: 'Search, Ads, Cloud, Android. A rigorous, algorithm-heavy loop with a high bar.' },
  { name: 'Meta', slug: 'meta', featured: true, industry: 'Big Tech', hq: 'Menlo Park, CA', description: 'Facebook, Instagram, WhatsApp. Frontend loops lean hard on React and JS internals.' },
  { name: 'Amazon', slug: 'amazon', featured: true, industry: 'Big Tech', hq: 'Seattle, WA', description: 'E-commerce and AWS. Every round is weighed against the Leadership Principles.' },
  { name: 'Apple', slug: 'apple', featured: true, industry: 'Big Tech', hq: 'Cupertino, CA', description: 'Hardware and software at scale. Deep, team-specific technical rounds.' },
  { name: 'Microsoft', slug: 'microsoft', industry: 'Big Tech', hq: 'Redmond, WA', description: 'Azure, Windows, Office, GitHub. Balanced loops across coding and design.' },
  { name: 'Netflix', slug: 'netflix', featured: true, industry: 'Streaming', hq: 'Los Gatos, CA', description: 'Streaming at massive scale. Senior-heavy bar with a strong culture focus.' },
  { name: 'Nvidia', slug: 'nvidia', industry: 'Semiconductors', hq: 'Santa Clara, CA', description: 'GPUs and AI infrastructure. Performance-minded systems and coding rounds.' },
  { name: 'Adobe', slug: 'adobe', industry: 'Creative Software', hq: 'San Jose, CA', description: 'Creative Cloud and document tools. Practical coding plus product sense.' },
  { name: 'Salesforce', slug: 'salesforce', industry: 'Enterprise SaaS', hq: 'San Francisco, CA', description: 'The CRM platform. Loops mix DSA, design, and values-based rounds.' },
  { name: 'Oracle', slug: 'oracle', industry: 'Enterprise Software', hq: 'Austin, TX', description: 'Databases and cloud. Fundamentals-heavy coding and systems questions.' },
  { name: 'Uber', slug: 'uber', industry: 'Marketplace', hq: 'San Francisco, CA', description: 'Ride-hailing and delivery. Real-time, geospatial systems feature heavily.' },
  { name: 'Lyft', slug: 'lyft', industry: 'Marketplace', hq: 'San Francisco, CA', description: 'Ride-share platform. Practical coding and pragmatic system design.' },
  { name: 'Airbnb', slug: 'airbnb', industry: 'Marketplace', hq: 'San Francisco, CA', description: 'Travel marketplace with a famously strong frontend and design culture.' },
  { name: 'DoorDash', slug: 'doordash', industry: 'Marketplace', hq: 'San Francisco, CA', description: 'Delivery logistics. Emphasis on real-world coding and dispatch systems.' },
  { name: 'Instacart', slug: 'instacart', industry: 'Marketplace', hq: 'San Francisco, CA', description: 'Grocery delivery. Product-focused coding and data-heavy design.' },
  { name: 'Pinterest', slug: 'pinterest', industry: 'Consumer Internet', hq: 'San Francisco, CA', description: 'Visual discovery. Frontend craft and recommendation-system design.' },
  { name: 'Snap', slug: 'snap', industry: 'Consumer Internet', hq: 'Santa Monica, CA', description: 'Snapchat and AR. Media-heavy frontend and large-scale backends.' },
  { name: 'Reddit', slug: 'reddit', industry: 'Consumer Internet', hq: 'San Francisco, CA', description: 'The front page of the internet. Feed, ranking, and moderation systems.' },
  { name: 'Spotify', slug: 'spotify', industry: 'Streaming', hq: 'Stockholm, Sweden', description: 'Audio streaming. Playback, recommendations, and clean frontend rounds.' },
  { name: 'Dropbox', slug: 'dropbox', industry: 'Cloud Storage', hq: 'San Francisco, CA', description: 'File sync and storage. Strong systems design and practical coding.' },
  { name: 'Stripe', slug: 'stripe', featured: true, industry: 'Fintech', hq: 'South San Francisco, CA', description: 'Payments infrastructure. Practical, real-world coding over pure algorithms.' },
  { name: 'PayPal', slug: 'paypal', industry: 'Fintech', hq: 'San Jose, CA', description: 'Digital payments. Fundamentals, APIs, and reliability-focused design.' },
  { name: 'Block', slug: 'block', industry: 'Fintech', hq: 'Oakland, CA', description: 'Square and Cash App. Payments coding and pragmatic system design.' },
  { name: 'Coinbase', slug: 'coinbase', industry: 'Fintech', hq: 'Remote-first', description: 'Crypto exchange. Correctness, security, and high-throughput systems.' },
  { name: 'Robinhood', slug: 'robinhood', industry: 'Fintech', hq: 'Menlo Park, CA', description: 'Investing app. Real-time data, correctness, and clean frontends.' },
  { name: 'Plaid', slug: 'plaid', industry: 'Fintech', hq: 'San Francisco, CA', description: 'Financial data APIs. Integration-heavy backend and API design.' },
  { name: 'Brex', slug: 'brex', industry: 'Fintech', hq: 'San Francisco, CA', description: 'Corporate cards and spend. Product-minded full-stack rounds.' },
  { name: 'Ramp', slug: 'ramp', industry: 'Fintech', hq: 'New York, NY', description: 'Finance automation. Fast, practical full-stack interviews.' },
  { name: 'Shopify', slug: 'shopify', industry: 'E-commerce', hq: 'Ottawa, Canada', description: 'Commerce platform. Real-world coding and a life-story/values round.' },
  { name: 'Twilio', slug: 'twilio', industry: 'Developer Platform', hq: 'San Francisco, CA', description: 'Communications APIs. API design and reliable backend systems.' },
  { name: 'Atlassian', slug: 'atlassian', industry: 'SaaS', hq: 'Sydney, Australia', description: 'Jira, Confluence, Trello. Values-driven loop with strong frontend craft.' },
  { name: 'Slack', slug: 'slack', industry: 'SaaS', hq: 'San Francisco, CA', description: 'Team messaging. Real-time systems and thoughtful frontend rounds.' },
  { name: 'Zoom', slug: 'zoom', industry: 'SaaS', hq: 'San Jose, CA', description: 'Video communications. Media systems and fundamentals-focused coding.' },
  { name: 'GitHub', slug: 'github', industry: 'Developer Platform', hq: 'Remote-first', description: 'Where the world builds software. Practical coding and collaboration focus.' },
  { name: 'GitLab', slug: 'gitlab', industry: 'Developer Platform', hq: 'All-remote', description: 'DevOps platform. Async-friendly, practical, values-based interviews.' },
  { name: 'Figma', slug: 'figma', industry: 'Design Software', hq: 'San Francisco, CA', description: 'Collaborative design. Deep frontend, canvas, and CRDT-style systems.' },
  { name: 'Notion', slug: 'notion', industry: 'Productivity', hq: 'San Francisco, CA', description: 'Connected workspace. Frontend depth and data-model design.' },
  { name: 'Asana', slug: 'asana', industry: 'Productivity', hq: 'San Francisco, CA', description: 'Work management. Clean coding and product-oriented design rounds.' },
  { name: 'Databricks', slug: 'databricks', industry: 'Data & AI', hq: 'San Francisco, CA', description: 'Data and AI platform. Strong DSA and large-scale data systems.' },
  { name: 'Snowflake', slug: 'snowflake', industry: 'Data', hq: 'Bozeman, MT', description: 'Cloud data platform. Systems-heavy design and solid coding.' },
  { name: 'Datadog', slug: 'datadog', industry: 'Observability', hq: 'New York, NY', description: 'Monitoring at scale. Time-series systems and pragmatic coding.' },
  { name: 'MongoDB', slug: 'mongodb', industry: 'Databases', hq: 'New York, NY', description: 'The document database. Data modeling and distributed-systems design.' },
  { name: 'Confluent', slug: 'confluent', industry: 'Data Streaming', hq: 'Mountain View, CA', description: 'Kafka and streaming. Distributed systems and backend depth.' },
  { name: 'HashiCorp', slug: 'hashicorp', industry: 'Infrastructure', hq: 'San Francisco, CA', description: 'Terraform and infra tooling. Systems coding and API design.' },
  { name: 'Palantir', slug: 'palantir', industry: 'Enterprise Software', hq: 'Denver, CO', description: 'Data platforms. Applied problem-solving and product engineering.' },
  { name: 'Roblox', slug: 'roblox', industry: 'Gaming', hq: 'San Mateo, CA', description: 'Gaming platform. Performance systems and engine-adjacent coding.' },
  { name: 'Unity', slug: 'unity', industry: 'Gaming', hq: 'San Francisco, CA', description: 'Real-time 3D engine. Performance, graphics, and systems questions.' },
  { name: 'OpenAI', slug: 'openai', industry: 'AI', hq: 'San Francisco, CA', description: 'AI research and products. Strong coding and applied systems design.' },
  { name: 'Anthropic', slug: 'anthropic', industry: 'AI', hq: 'San Francisco, CA', description: 'AI safety and Claude. Thoughtful coding and product engineering.' },
  { name: 'ByteDance', slug: 'bytedance', industry: 'Consumer Internet', hq: 'Singapore', description: 'TikTok and more. Fast, DSA-heavy loops with large-scale systems.' },
];
