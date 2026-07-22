import type { Archetype } from './bank';

export type SeedCompany = {
  name: string;
  slug: string;
  description?: string;
  industry?: string;
  hq?: string;
  /** Surfaced first on the home page. */
  featured?: boolean;
  /**
   * Which interview shape this company actually runs. Defaults to `product`.
   * Mass recruiters (TCS, Infosys, Capgemini, banks…) run an aptitude →
   * fundamentals → HR loop, not a DSA/system-design loop.
   */
  archetype?: Archetype;
};

/**
 * Companies whose loop is an aptitude screen + CS-fundamentals technical round
 * + managerial/HR, rather than DSA and system design. Applied below so the
 * question set matches what candidates are actually asked.
 */
const SERVICES_SLUGS = new Set<string>([
  // Indian and global IT services / BPO
  'tcs', 'infosys', 'wipro', 'cognizant', 'accenture', 'capgemini', 'hcltech',
  'tech-mahindra', 'ltimindtree', 'mphasis', 'persistent', 'coforge',
  'hexaware', 'virtusa', 'ust', 'zensar', 'birlasoft', 'cyient', 'kpit',
  'sonata', 'happiest-minds', 'tata-elxsi', 'ltts', 'amdocs', 'ntt-data',
  'synechron', 'genpact', 'wns', 'nagarro', 'deloitte',
  // Banks and financial-services IT, which interview the same way
  'hdfc-bank', 'icici-bank', 'axis-bank', 'kotak', 'bajaj-finserv',
  'fis', 'fiserv', 'broadridge',
]);

// Top companies commonly targeted for frontend / backend / full-stack roles.
const RAW_COMPANIES: SeedCompany[] = [
  { name: 'Google', slug: 'google', featured: true, industry: 'Big Tech', hq: 'Mountain View, CA', description: 'Search, Ads, Cloud, Android. A rigorous, algorithm-heavy loop with a high bar.' },
  { name: 'Meta', slug: 'meta', featured: true, industry: 'Big Tech', hq: 'Menlo Park, CA', description: 'Facebook, Instagram, WhatsApp. Frontend loops lean hard on React and JS internals.' },
  { name: 'Amazon', slug: 'amazon', featured: true, industry: 'Big Tech', hq: 'Seattle, WA', description: 'E-commerce and AWS. Every round is weighed against the Leadership Principles.' },
  { name: 'Apple', slug: 'apple', featured: true, industry: 'Big Tech', hq: 'Cupertino, CA', description: 'Hardware and software at scale. Deep, team-specific technical rounds.' },
  { name: 'Microsoft', slug: 'microsoft', featured: true, industry: 'Big Tech', hq: 'Redmond, WA', description: 'Azure, Windows, Office, GitHub. Balanced loops across coding and design.' },
  { name: 'Netflix', slug: 'netflix', featured: true, industry: 'Streaming', hq: 'Los Gatos, CA', description: 'Streaming at massive scale. Senior-heavy bar with a strong culture focus.' },
  { name: 'Nvidia', slug: 'nvidia', industry: 'Semiconductors', hq: 'Santa Clara, CA', description: 'GPUs and AI infrastructure. Performance-minded systems and coding rounds.' },
  { name: 'Adobe', slug: 'adobe', industry: 'Creative Software', hq: 'San Jose, CA', description: 'Creative Cloud and document tools. Practical coding plus product sense.' },
  { name: 'Salesforce', slug: 'salesforce', industry: 'Enterprise SaaS', hq: 'San Francisco, CA', description: 'The CRM platform. Loops mix DSA, design, and values-based rounds.' },
  { name: 'Oracle', slug: 'oracle', industry: 'Enterprise Software', hq: 'Austin, TX', description: 'Databases and cloud. Fundamentals-heavy coding and systems questions.' },
  { name: 'Uber', slug: 'uber', featured: true, industry: 'Marketplace', hq: 'San Francisco, CA', description: 'Ride-hailing and delivery. Real-time, geospatial systems feature heavily.' },
  { name: 'Lyft', slug: 'lyft', industry: 'Marketplace', hq: 'San Francisco, CA', description: 'Ride-share platform. Practical coding and pragmatic system design.' },
  { name: 'Airbnb', slug: 'airbnb', featured: true, industry: 'Marketplace', hq: 'San Francisco, CA', description: 'Travel marketplace with a famously strong frontend and design culture.' },
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
  { name: 'LinkedIn', slug: 'linkedin', featured: true, industry: 'Consumer Internet', hq: 'Sunnyvale, CA', description: 'Professional network. Feed, graph, and scalable backends with a values round.' },
  { name: 'X', slug: 'x', industry: 'Consumer Internet', hq: 'San Francisco, CA', description: 'Formerly Twitter. Real-time timelines, ranking, and high-throughput systems.' },
  { name: 'Discord', slug: 'discord', industry: 'Consumer Internet', hq: 'San Francisco, CA', description: 'Chat for communities. Real-time messaging, voice, and scalable backends.' },
  { name: 'Twitch', slug: 'twitch', industry: 'Streaming', hq: 'San Francisco, CA', description: 'Live streaming. Low-latency video, chat systems, and frontend craft.' },
  { name: 'Cloudflare', slug: 'cloudflare', featured: true, industry: 'Infrastructure', hq: 'San Francisco, CA', description: 'Edge network and security. Systems-heavy coding and networking depth.' },
  { name: 'Yelp', slug: 'yelp', industry: 'Consumer Internet', hq: 'San Francisco, CA', description: 'Local reviews and search. Practical coding and data-heavy design.' },
  { name: 'eBay', slug: 'ebay', industry: 'E-commerce', hq: 'San Jose, CA', description: 'Online marketplace. Search, listings, and large-scale commerce systems.' },
  { name: 'Etsy', slug: 'etsy', industry: 'E-commerce', hq: 'Brooklyn, NY', description: 'Handmade marketplace. Product-focused coding and thoughtful frontend rounds.' },
  { name: 'Wayfair', slug: 'wayfair', industry: 'E-commerce', hq: 'Boston, MA', description: 'Home-goods commerce. Practical full-stack and catalog-scale systems.' },
  { name: 'Coursera', slug: 'coursera', industry: 'EdTech', hq: 'Mountain View, CA', description: 'Online learning. Product engineering and content-delivery systems.' },
  { name: 'Grammarly', slug: 'grammarly', industry: 'Productivity', hq: 'San Francisco, CA', description: 'Writing assistant. NLP-adjacent backends and polished frontend rounds.' },
  { name: 'Affirm', slug: 'affirm', industry: 'Fintech', hq: 'San Francisco, CA', description: 'Buy-now-pay-later. Correctness, money handling, and reliable APIs.' },
  { name: 'Chime', slug: 'chime', industry: 'Fintech', hq: 'San Francisco, CA', description: 'Consumer banking. Practical coding and secure, reliable systems.' },
  { name: 'Gusto', slug: 'gusto', industry: 'Fintech', hq: 'San Francisco, CA', description: 'Payroll and HR. Product-minded full-stack with a correctness focus.' },
  { name: 'Rippling', slug: 'rippling', industry: 'SaaS', hq: 'San Francisco, CA', description: 'Workforce platform. Fast, practical full-stack interviews.' },
  { name: 'Canva', slug: 'canva', industry: 'Design Software', hq: 'Sydney, Australia', description: 'Design for everyone. Canvas rendering, editor systems, and frontend depth.' },
  { name: 'Vercel', slug: 'vercel', industry: 'Developer Platform', hq: 'San Francisco, CA', description: 'Frontend cloud and Next.js. Deep frontend and edge-systems rounds.' },
  { name: 'Retool', slug: 'retool', industry: 'Developer Platform', hq: 'San Francisco, CA', description: 'Internal-tool builder. Practical full-stack and product engineering.' },
  { name: 'Airtable', slug: 'airtable', industry: 'Productivity', hq: 'San Francisco, CA', description: 'Database-spreadsheet hybrid. Data-model design and frontend depth.' },
  { name: 'Zapier', slug: 'zapier', industry: 'Automation', hq: 'All-remote', description: 'Workflow automation. API integrations and pragmatic backend design.' },
  { name: 'Miro', slug: 'miro', industry: 'Productivity', hq: 'Amsterdam, Netherlands', description: 'Collaborative whiteboard. Real-time canvas and CRDT-style systems.' },
  { name: 'Toast', slug: 'toast', industry: 'Fintech', hq: 'Boston, MA', description: 'Restaurant tech. Payments, offline-first, and practical full-stack.' },
  { name: 'Flexport', slug: 'flexport', industry: 'Logistics', hq: 'San Francisco, CA', description: 'Freight and logistics. Domain modeling and reliable backend systems.' },
  { name: 'Carta', slug: 'carta', industry: 'Fintech', hq: 'San Francisco, CA', description: 'Equity management. Correctness-critical modeling and full-stack rounds.' },
  { name: 'Scale AI', slug: 'scale-ai', industry: 'AI', hq: 'San Francisco, CA', description: 'Data for AI. Strong coding and large-scale data-pipeline design.' },
  { name: 'Nubank', slug: 'nubank', industry: 'Fintech', hq: 'São Paulo, Brazil', description: 'Digital bank. Functional-leaning backends and a reliability focus.' },
  { name: 'Cisco', slug: 'cisco', industry: 'Networking', hq: 'San Jose, CA', description: 'Enterprise networking. Systems and fundamentals-heavy coding rounds.' },
  { name: 'Intuit', slug: 'intuit', industry: 'Fintech', hq: 'Mountain View, CA', description: 'TurboTax and QuickBooks. Product engineering and data-correctness rounds.' },
  { name: 'IBM', slug: 'ibm', industry: 'Enterprise Software', hq: 'Armonk, NY', description: 'Enterprise and cloud. Fundamentals-focused coding and systems design.' },
  { name: 'VMware', slug: 'vmware', industry: 'Infrastructure', hq: 'Palo Alto, CA', description: 'Virtualization and cloud infra. Systems-heavy coding and design.' },
  { name: 'Qualcomm', slug: 'qualcomm', industry: 'Semiconductors', hq: 'San Diego, CA', description: 'Mobile chips and modems. Performance and systems-oriented rounds.' },
  { name: 'Tesla', slug: 'tesla', featured: true, industry: 'Automotive', hq: 'Austin, TX', description: 'EVs and energy. Practical, fast-paced coding and real-world systems.' },
  { name: 'Cruise', slug: 'cruise', industry: 'Autonomous Vehicles', hq: 'San Francisco, CA', description: 'Self-driving. Performance systems and robotics-adjacent coding.' },
  { name: 'Waymo', slug: 'waymo', industry: 'Autonomous Vehicles', hq: 'Mountain View, CA', description: 'Autonomous driving. Strong DSA and large-scale systems design.' },
  { name: 'Samsara', slug: 'samsara', industry: 'IoT', hq: 'San Francisco, CA', description: 'Connected operations. IoT data pipelines and practical full-stack.' },

  // High-compensation startups and scale-ups.
  { name: 'Anduril', slug: 'anduril', industry: 'Defense Tech', hq: 'Costa Mesa, CA', description: 'Autonomy and defense systems. Systems-heavy coding with a high bar.' },
  { name: 'SpaceX', slug: 'spacex', industry: 'Aerospace', hq: 'Hawthorne, CA', description: 'Rockets and Starlink. Fast, pragmatic coding and real-time systems.' },
  { name: 'Cursor', slug: 'cursor', industry: 'AI', hq: 'San Francisco, CA', description: 'The AI code editor. Deep frontend, editor internals, and applied AI.' },
  { name: 'Perplexity', slug: 'perplexity', industry: 'AI', hq: 'San Francisco, CA', description: 'AI answer engine. Search systems, ranking, and product engineering.' },
  { name: 'Cohere', slug: 'cohere', industry: 'AI', hq: 'Toronto, Canada', description: 'Enterprise LLMs. Strong coding plus large-scale inference systems.' },
  { name: 'Hugging Face', slug: 'hugging-face', industry: 'AI', hq: 'Remote-first', description: 'The open ML hub. Practical coding and developer-platform design.' },
  { name: 'ElevenLabs', slug: 'elevenlabs', industry: 'AI', hq: 'London, UK', description: 'Generative voice. Low-latency audio pipelines and product engineering.' },
  { name: 'Runway', slug: 'runway', industry: 'AI', hq: 'New York, NY', description: 'Generative video. Heavy frontend craft and media-processing backends.' },
  { name: 'Glean', slug: 'glean', industry: 'AI', hq: 'Palo Alto, CA', description: 'Enterprise search. Ranking, indexing, and large-scale retrieval.' },
  { name: 'Linear', slug: 'linear', industry: 'Productivity', hq: 'Remote-first', description: 'Issue tracking with famous craft. Deep frontend and sync-engine design.' },
  { name: 'Supabase', slug: 'supabase', industry: 'Developer Platform', hq: 'All-remote', description: 'The open Firebase alternative. Postgres depth and API design.' },
  { name: 'PlanetScale', slug: 'planetscale', industry: 'Databases', hq: 'Remote-first', description: 'Serverless MySQL. Distributed databases and systems-heavy rounds.' },
  { name: 'Grafana Labs', slug: 'grafana', industry: 'Observability', hq: 'All-remote', description: 'Dashboards and observability. Time-series systems and strong frontend.' },
  { name: 'Sentry', slug: 'sentry', industry: 'Observability', hq: 'San Francisco, CA', description: 'Error monitoring. High-throughput ingestion and pragmatic full-stack.' },
  { name: 'LaunchDarkly', slug: 'launchdarkly', industry: 'Developer Platform', hq: 'Oakland, CA', description: 'Feature flags at scale. SDK design and low-latency delivery.' },
  { name: 'Postman', slug: 'postman', industry: 'Developer Platform', hq: 'San Francisco, CA', description: 'The API platform. API design, tooling, and desktop-grade frontend.' },
  { name: 'Temporal', slug: 'temporal', industry: 'Developer Platform', hq: 'Seattle, WA', description: 'Durable execution. Distributed systems and correctness-focused rounds.' },
  { name: 'dbt Labs', slug: 'dbt-labs', industry: 'Data', hq: 'Philadelphia, PA', description: 'Analytics engineering. SQL depth and data-pipeline design.' },
  { name: 'Fivetran', slug: 'fivetran', industry: 'Data', hq: 'Oakland, CA', description: 'Automated data movement. Connectors, reliability, and backend depth.' },
  { name: 'Amplitude', slug: 'amplitude', industry: 'Analytics', hq: 'San Francisco, CA', description: 'Product analytics. Event pipelines and query-heavy backends.' },
  { name: 'Deel', slug: 'deel', industry: 'HR Tech', hq: 'All-remote', description: 'Global payroll and hiring. Fast, product-minded full-stack rounds.' },
  { name: 'Revolut', slug: 'revolut', industry: 'Fintech', hq: 'London, UK', description: 'Global neobank. Correctness, scale, and a demanding interview bar.' },
  { name: 'Wise', slug: 'wise', industry: 'Fintech', hq: 'London, UK', description: 'Cross-border payments. Money correctness and reliable backends.' },
  { name: 'Klarna', slug: 'klarna', industry: 'Fintech', hq: 'Stockholm, Sweden', description: 'Payments and BNPL. Practical coding and large-scale commerce systems.' },
  { name: 'Monzo', slug: 'monzo', industry: 'Fintech', hq: 'London, UK', description: 'UK digital bank. Microservices, reliability, and clear communication.' },
  { name: 'Mercury', slug: 'mercury', industry: 'Fintech', hq: 'San Francisco, CA', description: 'Banking for startups. Correctness-critical full-stack engineering.' },
  { name: 'Modern Treasury', slug: 'modern-treasury', industry: 'Fintech', hq: 'San Francisco, CA', description: 'Payment operations. Ledgers, idempotency, and API design.' },
  { name: 'Vanta', slug: 'vanta', industry: 'Security', hq: 'San Francisco, CA', description: 'Automated compliance. Practical full-stack and integrations depth.' },
  { name: 'Wiz', slug: 'wiz', industry: 'Security', hq: 'New York, NY', description: 'Cloud security. Graph systems, scanning pipelines, and strong coding.' },
  { name: 'Snyk', slug: 'snyk', industry: 'Security', hq: 'Boston, MA', description: 'Developer security. Static analysis, tooling, and pragmatic backends.' },
  { name: '1Password', slug: '1password', industry: 'Security', hq: 'Toronto, Canada', description: 'Password management. Cryptography-adjacent work and careful clients.' },
  { name: 'Okta', slug: 'okta', industry: 'Security', hq: 'San Francisco, CA', description: 'Identity and access. Auth protocols, OAuth/OIDC, and reliable APIs.' },
  { name: 'Clerk', slug: 'clerk', industry: 'Developer Platform', hq: 'San Francisco, CA', description: 'Auth for modern apps. Deep frontend, SDKs, and session design.' },
  { name: 'WorkOS', slug: 'workos', industry: 'Developer Platform', hq: 'San Francisco, CA', description: 'Enterprise-ready SSO and SCIM. API design and integration-heavy backends.' },

  // Investment banks and quant/trading firms — heavily searched SWE loops.
  { name: 'Goldman Sachs', slug: 'goldman-sachs', industry: 'Finance', hq: 'New York, NY', description: 'Global investment bank. Strong DSA, probability, and low-latency systems rounds.' },
  { name: 'JPMorgan Chase', slug: 'jpmorgan', industry: 'Finance', hq: 'New York, NY', description: 'Banking at scale. Fundamentals-heavy coding and reliability-focused design.' },
  { name: 'Morgan Stanley', slug: 'morgan-stanley', industry: 'Finance', hq: 'New York, NY', description: 'Wealth and investment banking. Core DSA, OOP, and system design rounds.' },
  { name: 'Bloomberg', slug: 'bloomberg', industry: 'Finance', hq: 'New York, NY', description: 'The financial data terminal. Famous for DSA and data-structure depth.' },
  { name: 'Citadel', slug: 'citadel', industry: 'Trading', hq: 'Miami, FL', description: 'Hedge fund and market maker. Brainteasers, probability, and high-performance coding.' },
  { name: 'Jane Street', slug: 'jane-street', industry: 'Trading', hq: 'New York, NY', description: 'Quant trading in OCaml. Probability, mental math, and deep problem-solving.' },
  { name: 'Two Sigma', slug: 'two-sigma', industry: 'Trading', hq: 'New York, NY', description: 'Quant investment firm. Strong DSA, statistics, and large-scale data systems.' },
  { name: 'Capital One', slug: 'capital-one', industry: 'Finance', hq: 'McLean, VA', description: 'A bank built like a tech company. Known coding assessments and case-style design.' },

  // Payment networks — high-volume, correctness-critical loops.
  { name: 'Visa', slug: 'visa', industry: 'Fintech', hq: 'Foster City, CA', description: 'Global payments network. Reliability, transaction systems, and solid coding.' },
  { name: 'Mastercard', slug: 'mastercard', industry: 'Fintech', hq: 'Purchase, NY', description: 'Payments technology. Secure, high-throughput systems and fundamentals.' },
  { name: 'American Express', slug: 'amex', industry: 'Fintech', hq: 'New York, NY', description: 'Cards and travel. Practical coding, APIs, and correctness-focused rounds.' },

  // Enterprise software and SaaS with very high hiring volume.
  { name: 'SAP', slug: 'sap', industry: 'Enterprise Software', hq: 'Walldorf, Germany', description: 'Enterprise resource planning. Fundamentals-heavy coding and systems design.' },
  { name: 'ServiceNow', slug: 'servicenow', industry: 'Enterprise SaaS', hq: 'Santa Clara, CA', description: 'Enterprise workflow platform. Practical coding and platform-scale design.' },
  { name: 'Workday', slug: 'workday', industry: 'Enterprise SaaS', hq: 'Pleasanton, CA', description: 'HR and finance software. Product engineering and data-model design.' },
  { name: 'Zoho', slug: 'zoho', industry: 'SaaS', hq: 'Chennai, India', description: 'Bootstrapped SaaS suite. Fundamentals, aptitude, and practical coding rounds.' },
  { name: 'Freshworks', slug: 'freshworks', industry: 'SaaS', hq: 'San Mateo, CA', description: 'Customer-engagement SaaS. Product-minded full-stack and clean coding.' },

  // Infrastructure, observability, and networking.
  { name: 'Splunk', slug: 'splunk', industry: 'Observability', hq: 'San Francisco, CA', description: 'Machine data and observability. Search systems and pragmatic coding.' },
  { name: 'Nutanix', slug: 'nutanix', industry: 'Infrastructure', hq: 'San Jose, CA', description: 'Hyperconverged infrastructure. Systems-heavy coding and distributed design.' },
  { name: 'Akamai', slug: 'akamai', industry: 'Infrastructure', hq: 'Cambridge, MA', description: 'The edge and CDN pioneer. Networking depth and systems-oriented coding.' },
  { name: 'Arista Networks', slug: 'arista', industry: 'Networking', hq: 'Santa Clara, CA', description: 'Cloud networking. Systems, protocols, and performance-minded coding.' },

  // Semiconductors and hardware — fundamentals-heavy loops.
  { name: 'Intel', slug: 'intel', industry: 'Semiconductors', hq: 'Santa Clara, CA', description: 'Chips and platforms. Systems, C/C++ depth, and fundamentals-heavy rounds.' },
  { name: 'AMD', slug: 'amd', industry: 'Semiconductors', hq: 'Santa Clara, CA', description: 'CPUs and GPUs. Performance systems, architecture, and coding fundamentals.' },
  { name: 'Samsung', slug: 'samsung', industry: 'Semiconductors', hq: 'Suwon, South Korea', description: 'Electronics and chips. Systems, embedded-adjacent coding, and DSA.' },
  { name: 'Broadcom', slug: 'broadcom', industry: 'Semiconductors', hq: 'Palo Alto, CA', description: 'Semiconductors and software. Fundamentals, systems, and design rounds.' },
  { name: 'Micron', slug: 'micron', industry: 'Semiconductors', hq: 'Boise, ID', description: 'Memory and storage. Systems, firmware-adjacent coding, and fundamentals.' },

  // Retail, travel, and consumer marketplaces with huge candidate volume.
  { name: 'Walmart Global Tech', slug: 'walmart', industry: 'E-commerce', hq: 'Bentonville, AR', description: 'Retail at massive scale. DSA, system design, and real-world commerce systems.' },
  { name: 'Flipkart', slug: 'flipkart', industry: 'E-commerce', hq: 'Bangalore, India', description: "India's commerce leader. Strong DSA, machine coding, and scale-focused design." },
  { name: 'Swiggy', slug: 'swiggy', industry: 'Marketplace', hq: 'Bangalore, India', description: 'Food and quick delivery. Real-time dispatch systems and practical coding.' },
  { name: 'Zomato', slug: 'zomato', industry: 'Marketplace', hq: 'Gurugram, India', description: 'Food delivery and dining. Product-minded coding and logistics-scale design.' },
  { name: 'Booking.com', slug: 'booking', industry: 'Marketplace', hq: 'Amsterdam, Netherlands', description: 'Travel booking at scale. Practical coding, experimentation, and design.' },
  { name: 'Expedia', slug: 'expedia', industry: 'Marketplace', hq: 'Seattle, WA', description: 'Online travel. Search, pricing, and large-scale booking systems.' },

  // India fintech — very high search volume.
  { name: 'Paytm', slug: 'paytm', industry: 'Fintech', hq: 'Noida, India', description: 'Payments and financial services. High-throughput systems and practical coding.' },
  { name: 'PhonePe', slug: 'phonepe', industry: 'Fintech', hq: 'Bangalore, India', description: 'UPI payments at scale. Reliability, low-latency systems, and strong DSA.' },
  { name: 'Razorpay', slug: 'razorpay', industry: 'Fintech', hq: 'Bangalore, India', description: 'Payments infrastructure. API design, correctness, and full-stack rounds.' },

  // IT services and consulting — the highest-volume "interview questions" searches.
  { name: 'TCS', slug: 'tcs', industry: 'IT Services', hq: 'Mumbai, India', description: "India's largest IT services firm. Aptitude, core DSA, and fundamentals rounds." },
  { name: 'Infosys', slug: 'infosys', industry: 'IT Services', hq: 'Bangalore, India', description: 'Global IT services. Aptitude, coding basics, and technical-plus-HR rounds.' },
  { name: 'Wipro', slug: 'wipro', industry: 'IT Services', hq: 'Bangalore, India', description: 'IT services and consulting. Aptitude, fundamentals, and practical coding.' },
  { name: 'Cognizant', slug: 'cognizant', industry: 'IT Services', hq: 'Teaneck, NJ', description: 'Digital and IT services. Aptitude, core coding, and communication rounds.' },
  { name: 'Accenture', slug: 'accenture', industry: 'IT Services', hq: 'Dublin, Ireland', description: 'Global consulting and tech. Cognitive and technical assessment plus coding basics.' },
  { name: 'Capgemini', slug: 'capgemini', industry: 'IT Services', hq: 'Paris, France', description: 'IT consulting and services. Aptitude, pseudocode, and fundamentals rounds.' },
  { name: 'HCLTech', slug: 'hcltech', industry: 'IT Services', hq: 'Noida, India', description: 'Global tech services. Aptitude, core coding, and technical-plus-HR rounds.' },
  { name: 'Tech Mahindra', slug: 'tech-mahindra', industry: 'IT Services', hq: 'Pune, India', description: 'IT and digital services. Aptitude, fundamentals, and communication rounds.' },
  { name: 'Deloitte', slug: 'deloitte', industry: 'Consulting', hq: 'London, UK', description: 'Consulting and technology. Case-style problem-solving and coding fundamentals.' },

  // Frontier AI labs and AI-native startups — the most-searched new names.
  { name: 'xAI', slug: 'xai', industry: 'AI', hq: 'Palo Alto, CA', description: 'Grok and frontier models. Strong coding, ML systems, and fast-paced rounds.' },
  { name: 'Mistral AI', slug: 'mistral', industry: 'AI', hq: 'Paris, France', description: 'Open-weight LLMs. Research-adjacent coding and inference-systems depth.' },
  { name: 'Groq', slug: 'groq', industry: 'AI', hq: 'Mountain View, CA', description: 'LPU inference hardware. Low-level performance, compilers, and systems coding.' },
  { name: 'Cerebras', slug: 'cerebras', industry: 'AI', hq: 'Sunnyvale, CA', description: 'Wafer-scale AI chips. Systems, parallelism, and performance-heavy rounds.' },
  { name: 'Character.AI', slug: 'character-ai', industry: 'AI', hq: 'Menlo Park, CA', description: 'Conversational AI companions. Serving at scale and product engineering.' },
  { name: 'Together AI', slug: 'together-ai', industry: 'AI', hq: 'San Francisco, CA', description: 'Open-model cloud. Inference optimization and distributed-systems coding.' },
  { name: 'Pinecone', slug: 'pinecone', industry: 'AI', hq: 'New York, NY', description: 'Vector database for AI. Retrieval systems, indexing, and backend depth.' },
  { name: 'Weights & Biases', slug: 'weights-and-biases', industry: 'AI', hq: 'San Francisco, CA', description: 'ML experiment tracking. Developer tooling and data-pipeline design.' },
  { name: 'Harvey', slug: 'harvey', industry: 'AI', hq: 'San Francisco, CA', description: 'AI for legal work. Applied LLM engineering and product-minded coding.' },
  { name: 'Sierra', slug: 'sierra', industry: 'AI', hq: 'San Francisco, CA', description: 'AI customer agents. Applied LLM systems and pragmatic full-stack.' },
  { name: 'Figure AI', slug: 'figure-ai', industry: 'AI', hq: 'Sunnyvale, CA', description: 'Humanoid robotics. Real-time control, perception, and systems coding.' },
  { name: 'Synthesia', slug: 'synthesia', industry: 'AI', hq: 'London, UK', description: 'AI video generation. Media pipelines and product engineering.' },
  { name: 'Deepgram', slug: 'deepgram', industry: 'AI', hq: 'San Francisco, CA', description: 'Speech-to-text APIs. Low-latency audio inference and API design.' },
  { name: 'Replit', slug: 'replit', industry: 'Developer Platform', hq: 'San Francisco, CA', description: 'Browser IDE and coding agents. Deep frontend, sandboxing, and infra rounds.' },

  // Gaming — consistently high-volume interview searches.
  { name: 'Riot Games', slug: 'riot-games', industry: 'Gaming', hq: 'Los Angeles, CA', description: 'League of Legends and Valorant. Gameplay systems and live-service backends.' },
  { name: 'Epic Games', slug: 'epic-games', industry: 'Gaming', hq: 'Cary, NC', description: 'Fortnite and Unreal Engine. Engine internals and large-scale multiplayer.' },
  { name: 'Electronic Arts', slug: 'ea', industry: 'Gaming', hq: 'Redwood City, CA', description: 'EA Sports and studios. Gameplay coding, engines, and live services.' },
  { name: 'Activision Blizzard', slug: 'activision-blizzard', industry: 'Gaming', hq: 'Santa Monica, CA', description: 'Call of Duty and Blizzard titles. Engine, tools, and backend systems.' },
  { name: 'Ubisoft', slug: 'ubisoft', industry: 'Gaming', hq: 'Montreal, Canada', description: "Assassin's Creed and more. Engine programming and gameplay systems." },
  { name: 'Niantic', slug: 'niantic', industry: 'Gaming', hq: 'San Francisco, CA', description: 'Pokémon GO and AR. Geospatial systems and mobile-scale backends.' },

  // Developer tools, databases, and infrastructure.
  { name: 'Docker', slug: 'docker', industry: 'Developer Platform', hq: 'Palo Alto, CA', description: 'Containers everywhere. Systems internals, Linux, and tooling design.' },
  { name: 'Red Hat', slug: 'red-hat', industry: 'Infrastructure', hq: 'Raleigh, NC', description: 'Enterprise Linux and OpenShift. Systems depth and open-source practice.' },
  { name: 'JetBrains', slug: 'jetbrains', industry: 'Developer Platform', hq: 'Prague, Czechia', description: 'IDEs and Kotlin. Compilers, tooling, and algorithm-heavy rounds.' },
  { name: 'Elastic', slug: 'elastic', industry: 'Databases', hq: 'Amsterdam, Netherlands', description: 'Elasticsearch and observability. Search internals and distributed systems.' },
  { name: 'Redis', slug: 'redis', industry: 'Databases', hq: 'Mountain View, CA', description: 'The in-memory data store. Data structures, C depth, and systems design.' },
  { name: 'Cockroach Labs', slug: 'cockroach-labs', industry: 'Databases', hq: 'New York, NY', description: 'Distributed SQL. Consensus, transactions, and deep systems rounds.' },
  { name: 'Neo4j', slug: 'neo4j', industry: 'Databases', hq: 'San Mateo, CA', description: 'The graph database. Graph algorithms, query engines, and data modeling.' },
  { name: 'DigitalOcean', slug: 'digitalocean', industry: 'Infrastructure', hq: 'New York, NY', description: 'Cloud for developers. Systems coding and pragmatic platform design.' },
  { name: 'Netlify', slug: 'netlify', industry: 'Developer Platform', hq: 'San Francisco, CA', description: 'Frontend cloud. Edge delivery, build systems, and strong frontend rounds.' },
  { name: 'Fastly', slug: 'fastly', industry: 'Infrastructure', hq: 'San Francisco, CA', description: 'Edge cloud and CDN. Networking, caching, and performance systems.' },
  { name: 'Algolia', slug: 'algolia', industry: 'Developer Platform', hq: 'Paris, France', description: 'Search as an API. Ranking, indexing, and low-latency systems.' },
  { name: 'New Relic', slug: 'new-relic', industry: 'Observability', hq: 'San Francisco, CA', description: 'Application monitoring. Telemetry pipelines and backend depth.' },
  { name: 'PagerDuty', slug: 'pagerduty', industry: 'Observability', hq: 'San Francisco, CA', description: 'Incident response. Event pipelines and reliability-focused design.' },
  { name: 'BrowserStack', slug: 'browserstack', industry: 'Developer Platform', hq: 'Mumbai, India', description: 'Cross-browser testing cloud. Infrastructure, device farms, and tooling.' },

  // Enterprise SaaS and productivity with high hiring volume.
  { name: 'Zendesk', slug: 'zendesk', industry: 'SaaS', hq: 'San Francisco, CA', description: 'Customer service software. Practical full-stack and platform design.' },
  { name: 'HubSpot', slug: 'hubspot', industry: 'SaaS', hq: 'Cambridge, MA', description: 'CRM and marketing. Product engineering and pragmatic coding rounds.' },
  { name: 'Docusign', slug: 'docusign', industry: 'SaaS', hq: 'San Francisco, CA', description: 'E-signature at scale. Security, workflows, and reliable backends.' },
  { name: 'Box', slug: 'box', industry: 'Cloud Storage', hq: 'Redwood City, CA', description: 'Enterprise content cloud. Storage systems and API-heavy design.' },
  { name: 'monday.com', slug: 'monday', industry: 'Productivity', hq: 'Tel Aviv, Israel', description: 'Work OS platform. Frontend depth and flexible data-model design.' },
  { name: 'Intercom', slug: 'intercom', industry: 'SaaS', hq: 'San Francisco, CA', description: 'Customer messaging. Real-time systems and product-minded full-stack.' },
  { name: 'Qualtrics', slug: 'qualtrics', industry: 'Enterprise SaaS', hq: 'Provo, UT', description: 'Experience management. Data pipelines and strong coding fundamentals.' },
  { name: 'Mixpanel', slug: 'mixpanel', industry: 'Analytics', hq: 'San Francisco, CA', description: 'Product analytics. Event ingestion and query-heavy backends.' },
  { name: 'Calendly', slug: 'calendly', industry: 'Productivity', hq: 'Atlanta, GA', description: 'Scheduling automation. Calendar systems and practical full-stack.' },

  // Consumer internet and marketplaces.
  { name: 'Duolingo', slug: 'duolingo', industry: 'EdTech', hq: 'Pittsburgh, PA', description: 'Language learning. Gamification systems, A/B testing, and clean coding.' },
  { name: 'Bumble', slug: 'bumble', industry: 'Consumer Internet', hq: 'Austin, TX', description: 'Dating and connections. Matching systems and mobile-scale backends.' },
  { name: 'Match Group', slug: 'match-group', industry: 'Consumer Internet', hq: 'Dallas, TX', description: 'Tinder and Hinge. Recommendation systems and high-scale services.' },
  { name: 'Zillow', slug: 'zillow', industry: 'Marketplace', hq: 'Seattle, WA', description: 'Real-estate marketplace. Search, pricing models, and full-stack rounds.' },
  { name: 'Indeed', slug: 'indeed', industry: 'Marketplace', hq: 'Austin, TX', description: 'Job search at scale. Search ranking, matching, and practical coding.' },
  { name: 'Grubhub', slug: 'grubhub', industry: 'Marketplace', hq: 'Chicago, IL', description: 'Food delivery. Logistics systems and pragmatic backend design.' },
  { name: 'Deliveroo', slug: 'deliveroo', industry: 'Marketplace', hq: 'London, UK', description: 'Food delivery in Europe. Dispatch algorithms and real-time systems.' },
  { name: 'Grab', slug: 'grab', industry: 'Marketplace', hq: 'Singapore', description: 'Southeast Asia super-app. Real-time geospatial systems and strong DSA.' },
  { name: 'Peloton', slug: 'peloton', industry: 'Consumer Internet', hq: 'New York, NY', description: 'Connected fitness. Streaming, device software, and full-stack rounds.' },
  { name: 'Strava', slug: 'strava', industry: 'Consumer Internet', hq: 'San Francisco, CA', description: 'Fitness social network. Geospatial data and mobile-scale backends.' },
  { name: 'Eventbrite', slug: 'eventbrite', industry: 'Marketplace', hq: 'San Francisco, CA', description: 'Event ticketing. Inventory correctness and high-traffic systems.' },

  // Health tech — large engineering orgs, frequently searched loops.
  { name: 'Epic Systems', slug: 'epic-systems', industry: 'Health Tech', hq: 'Verona, WI', description: 'Healthcare records software. Fundamentals-heavy coding and a logic-test stage.' },
  { name: 'Oscar Health', slug: 'oscar-health', industry: 'Health Tech', hq: 'New York, NY', description: 'Tech-driven health insurance. Data modeling and practical full-stack.' },
  { name: 'Komodo Health', slug: 'komodo-health', industry: 'Health Tech', hq: 'San Francisco, CA', description: 'Healthcare data platform. Large-scale data pipelines and backend depth.' },

  // Global consumer tech outside the US.
  { name: 'Alibaba', slug: 'alibaba', industry: 'E-commerce', hq: 'Hangzhou, China', description: 'Commerce and cloud at scale. Heavy DSA and large-scale system design.' },
  { name: 'Tencent', slug: 'tencent', industry: 'Consumer Internet', hq: 'Shenzhen, China', description: 'WeChat and games. Strong algorithms and high-concurrency systems.' },
  { name: 'Shein', slug: 'shein', industry: 'E-commerce', hq: 'Singapore', description: 'Fast-fashion commerce. Supply-chain systems and high-traffic backends.' },
  { name: 'Mercado Libre', slug: 'mercado-libre', industry: 'E-commerce', hq: 'Buenos Aires, Argentina', description: "Latin America's commerce leader. Scale-focused design and solid coding." },
  { name: 'Rakuten', slug: 'rakuten', industry: 'E-commerce', hq: 'Tokyo, Japan', description: 'Commerce, fintech, and media. Practical coding and platform design.' },

  // India's most-searched startups.
  { name: 'Zerodha', slug: 'zerodha', industry: 'Fintech', hq: 'Bangalore, India', description: "India's largest broker. Low-latency trading systems and lean engineering." },
  { name: 'Groww', slug: 'groww', industry: 'Fintech', hq: 'Bangalore, India', description: 'Investing for India. High-traffic systems and product-minded full-stack.' },
  { name: 'CRED', slug: 'cred', industry: 'Fintech', hq: 'Bangalore, India', description: 'Credit-card payments and rewards. Strong craft, DSA, and design rounds.' },
  { name: 'PolicyBazaar', slug: 'policybazaar', industry: 'Fintech', hq: 'Gurugram, India', description: 'Insurance marketplace. Data-heavy backends and practical coding.' },
  { name: 'Meesho', slug: 'meesho', industry: 'E-commerce', hq: 'Bangalore, India', description: 'Social commerce at scale. DSA, machine coding, and scale-focused design.' },
  { name: 'Zepto', slug: 'zepto', industry: 'Marketplace', hq: 'Mumbai, India', description: '10-minute grocery delivery. Real-time dispatch and high-throughput systems.' },
  { name: 'Nykaa', slug: 'nykaa', industry: 'E-commerce', hq: 'Mumbai, India', description: 'Beauty and fashion commerce. Practical full-stack and catalog systems.' },
  { name: 'Lenskart', slug: 'lenskart', industry: 'E-commerce', hq: 'Gurugram, India', description: 'Eyewear commerce and retail tech. Full-stack and supply-chain systems.' },
  { name: 'Delhivery', slug: 'delhivery', industry: 'Logistics', hq: 'Gurugram, India', description: 'Logistics and supply chain. Routing systems and scale-focused backends.' },
  { name: 'Dream11', slug: 'dream11', industry: 'Gaming', hq: 'Mumbai, India', description: 'Fantasy sports at massive concurrency. Real-time systems and strong DSA.' },
  { name: 'Unacademy', slug: 'unacademy', industry: 'EdTech', hq: 'Bangalore, India', description: 'Online learning platform. Streaming, scale, and product engineering.' },
  { name: 'Urban Company', slug: 'urban-company', industry: 'Marketplace', hq: 'Gurugram, India', description: 'Home-services marketplace. Matching systems and practical full-stack.' },
  { name: 'MakeMyTrip', slug: 'makemytrip', industry: 'Marketplace', hq: 'Gurugram, India', description: "India's travel platform. Search, pricing, and booking-system design." },

  // More US fintech.
  { name: 'SoFi', slug: 'sofi', industry: 'Fintech', hq: 'San Francisco, CA', description: 'Digital personal finance. Money correctness and practical full-stack.' },
  { name: 'Kraken', slug: 'kraken', industry: 'Fintech', hq: 'San Francisco, CA', description: 'Crypto exchange. Security, matching engines, and high-throughput systems.' },
  { name: 'Marqeta', slug: 'marqeta', industry: 'Fintech', hq: 'Oakland, CA', description: 'Card issuing APIs. Payments correctness and reliable backend design.' },

  // Engineering services and consultancies.
  { name: 'EPAM Systems', slug: 'epam', industry: 'IT Services', hq: 'Newtown, PA', description: 'Global engineering services. Solid DSA, design, and client-facing rounds.' },
  { name: 'Thoughtworks', slug: 'thoughtworks', industry: 'Consulting', hq: 'Chicago, IL', description: 'Software consultancy. TDD, refactoring, and pairing-style interviews.' },
  { name: 'Globant', slug: 'globant', industry: 'IT Services', hq: 'Buenos Aires, Argentina', description: 'Digital engineering services. Practical coding and design rounds.' },
  { name: 'LTIMindtree', slug: 'ltimindtree', industry: 'IT Services', hq: 'Mumbai, India', description: 'IT services and consulting. Aptitude, fundamentals, and technical rounds.' },
  { name: 'Mphasis', slug: 'mphasis', industry: 'IT Services', hq: 'Bangalore, India', description: 'Applied technology services. Aptitude, core coding, and HR rounds.' },
  { name: 'Persistent Systems', slug: 'persistent', industry: 'IT Services', hq: 'Pune, India', description: 'Digital engineering services. Fundamentals, coding, and technical rounds.' },

  // ── India-focused additions ────────────────────────────────────────────────
  // India consumer, travel, and telecom.
  { name: 'Ola', slug: 'ola', industry: 'Marketplace', hq: 'Bangalore, India', description: 'Ride-hailing and mobility. Real-time dispatch systems and strong DSA rounds.' },
  { name: 'Myntra', slug: 'myntra', industry: 'E-commerce', hq: 'Bangalore, India', description: 'Fashion e-commerce. Catalog scale, search, and machine-coding rounds.' },
  { name: 'BigBasket', slug: 'bigbasket', industry: 'Marketplace', hq: 'Bangalore, India', description: 'Online grocery. Inventory systems, logistics, and practical full-stack.' },
  { name: 'Blinkit', slug: 'blinkit', industry: 'Marketplace', hq: 'Gurugram, India', description: 'Quick commerce. Real-time inventory, dispatch, and high-throughput backends.' },
  { name: 'OYO', slug: 'oyo', industry: 'Marketplace', hq: 'Gurugram, India', description: 'Hospitality platform. Pricing, availability systems, and full-stack rounds.' },
  { name: 'Naukri', slug: 'naukri', industry: 'Marketplace', hq: 'Noida, India', description: "India's job portal (Info Edge). Search, matching, and practical coding." },
  { name: 'NoBroker', slug: 'nobroker', industry: 'Marketplace', hq: 'Bangalore, India', description: 'Brokerage-free real estate. Search, matching, and product-minded full-stack.' },
  { name: 'Rapido', slug: 'rapido', industry: 'Marketplace', hq: 'Bangalore, India', description: 'Bike taxis and mobility. Geospatial matching and real-time systems.' },
  { name: 'redBus', slug: 'redbus', industry: 'Marketplace', hq: 'Bangalore, India', description: 'Bus ticketing platform. Inventory correctness and booking-system design.' },
  { name: 'ixigo', slug: 'ixigo', industry: 'Marketplace', hq: 'Gurugram, India', description: 'Travel search and booking. Aggregation, pricing, and practical coding.' },
  { name: 'Cleartrip', slug: 'cleartrip', industry: 'Marketplace', hq: 'Bangalore, India', description: 'Online travel. Search, booking flows, and reliable backend systems.' },
  { name: 'Snapdeal', slug: 'snapdeal', industry: 'E-commerce', hq: 'Gurugram, India', description: 'Value e-commerce. Catalog systems, DSA, and pragmatic full-stack rounds.' },
  { name: 'FirstCry', slug: 'firstcry', industry: 'E-commerce', hq: 'Pune, India', description: 'Baby and kids commerce. Catalog, supply chain, and full-stack rounds.' },
  { name: 'ShareChat', slug: 'sharechat', industry: 'Consumer Internet', hq: 'Bangalore, India', description: 'Regional social media. Feed ranking, recommendations, and scale-heavy design.' },
  { name: 'Jio', slug: 'jio', industry: 'Telecom', hq: 'Mumbai, India', description: 'India-scale telecom and digital services. High-concurrency systems and DSA.' },
  { name: 'Airtel', slug: 'airtel', industry: 'Telecom', hq: 'New Delhi, India', description: 'Telecom and digital services. Networking depth and large-scale backends.' },
  { name: 'JioHotstar', slug: 'jiohotstar', industry: 'Streaming', hq: 'Mumbai, India', description: 'Streaming at record concurrency. Video delivery and live-scale systems.' },

  // India health tech.
  { name: 'Practo', slug: 'practo', industry: 'Health Tech', hq: 'Bangalore, India', description: 'Healthcare discovery and records. Search, scheduling, and full-stack rounds.' },
  { name: 'Tata 1mg', slug: 'tata-1mg', industry: 'Health Tech', hq: 'Gurugram, India', description: 'Online pharmacy and diagnostics. Catalog, logistics, and practical coding.' },
  { name: 'PharmEasy', slug: 'pharmeasy', industry: 'Health Tech', hq: 'Mumbai, India', description: 'E-pharmacy platform. Inventory systems and product-minded full-stack.' },
  { name: 'Cult.fit', slug: 'cultfit', industry: 'Health Tech', hq: 'Bangalore, India', description: 'Fitness and wellness platform. Booking systems and consumer-scale backends.' },

  // India edtech — very high fresher search volume.
  { name: "Byju's", slug: 'byjus', industry: 'EdTech', hq: 'Bangalore, India', description: 'Learning app at scale. Content delivery, DSA, and product engineering.' },
  { name: 'PhysicsWallah', slug: 'physicswallah', industry: 'EdTech', hq: 'Noida, India', description: 'Affordable online learning. Streaming, scale, and practical full-stack.' },
  { name: 'Vedantu', slug: 'vedantu', industry: 'EdTech', hq: 'Bangalore, India', description: 'Live online tutoring. Real-time classrooms and product engineering.' },
  { name: 'upGrad', slug: 'upgrad', industry: 'EdTech', hq: 'Mumbai, India', description: 'Higher edtech platform. Content systems and practical full-stack rounds.' },
  { name: 'Scaler', slug: 'scaler', industry: 'EdTech', hq: 'Bangalore, India', description: 'Tech upskilling and InterviewBit. Strong DSA and product engineering.' },
  { name: 'Simplilearn', slug: 'simplilearn', industry: 'EdTech', hq: 'Bangalore, India', description: 'Professional certification training. Practical coding and platform design.' },

  // India fintech and banking.
  { name: 'BharatPe', slug: 'bharatpe', industry: 'Fintech', hq: 'New Delhi, India', description: 'Merchant payments and lending. Transaction systems and practical coding.' },
  { name: 'Pine Labs', slug: 'pine-labs', industry: 'Fintech', hq: 'Noida, India', description: 'Merchant commerce and POS. Payments correctness and reliable backends.' },
  { name: 'MobiKwik', slug: 'mobikwik', industry: 'Fintech', hq: 'Gurugram, India', description: 'Digital wallet and lending. High-volume transactions and practical coding.' },
  { name: 'Juspay', slug: 'juspay', industry: 'Fintech', hq: 'Bangalore, India', description: 'Payments orchestration. Functional programming, correctness, and systems depth.' },
  { name: 'Navi', slug: 'navi', industry: 'Fintech', hq: 'Bangalore, India', description: 'Lending and insurance. Strong DSA and correctness-focused backend rounds.' },
  { name: 'slice', slug: 'slice', industry: 'Fintech', hq: 'Bangalore, India', description: 'Cards and consumer credit. Product-minded full-stack and payments systems.' },
  { name: 'Cashfree Payments', slug: 'cashfree', industry: 'Fintech', hq: 'Bangalore, India', description: 'Payment gateway and payouts. API design and reliable transaction systems.' },
  { name: 'Zeta', slug: 'zeta', industry: 'Fintech', hq: 'Bangalore, India', description: 'Modern banking tech stack. Ledgers, correctness, and distributed systems.' },
  { name: 'HDFC Bank', slug: 'hdfc-bank', industry: 'Finance', hq: 'Mumbai, India', description: "India's largest private bank. Fundamentals-heavy coding and systems rounds." },
  { name: 'ICICI Bank', slug: 'icici-bank', industry: 'Finance', hq: 'Mumbai, India', description: 'Banking and digital services. Core coding, SQL, and technical-plus-HR rounds.' },
  { name: 'Axis Bank', slug: 'axis-bank', industry: 'Finance', hq: 'Mumbai, India', description: 'Private-sector banking. Fundamentals, data handling, and practical coding.' },
  { name: 'Kotak Mahindra Bank', slug: 'kotak', industry: 'Finance', hq: 'Mumbai, India', description: 'Banking and financial services. Core coding and reliability-focused design.' },
  { name: 'Bajaj Finserv', slug: 'bajaj-finserv', industry: 'Finance', hq: 'Pune, India', description: 'Lending and insurance tech. Practical coding and data-heavy backends.' },

  // India SaaS and product companies.
  { name: 'InMobi', slug: 'inmobi', industry: 'SaaS', hq: 'Bangalore, India', description: 'Mobile advertising platform. Real-time bidding and large-scale data systems.' },
  { name: 'Druva', slug: 'druva', industry: 'Infrastructure', hq: 'Pune, India', description: 'Cloud data protection. Distributed storage systems and strong backend rounds.' },
  { name: 'Chargebee', slug: 'chargebee', industry: 'SaaS', hq: 'Chennai, India', description: 'Subscription billing. Money correctness, APIs, and pragmatic full-stack.' },
  { name: 'HighRadius', slug: 'highradius', industry: 'SaaS', hq: 'Hyderabad, India', description: 'Fintech automation for enterprises. Coding fundamentals and applied AI.' },
  { name: 'Innovaccer', slug: 'innovaccer', industry: 'Health Tech', hq: 'Noida, India', description: 'Healthcare data platform. Data pipelines and practical full-stack rounds.' },
  { name: 'Darwinbox', slug: 'darwinbox', industry: 'HR Tech', hq: 'Hyderabad, India', description: 'HR tech platform. Product engineering and flexible data-model design.' },
  { name: 'Whatfix', slug: 'whatfix', industry: 'SaaS', hq: 'Bangalore, India', description: 'Digital adoption platform. Deep frontend, browser internals, and full-stack.' },
  { name: 'Hasura', slug: 'hasura', industry: 'Developer Platform', hq: 'Bangalore, India', description: 'Instant GraphQL APIs. Query engines, Postgres depth, and API design.' },
  { name: 'Icertis', slug: 'icertis', industry: 'Enterprise SaaS', hq: 'Pune, India', description: 'Contract lifecycle management. Enterprise workflows and solid coding rounds.' },
  { name: 'MPL', slug: 'mpl', industry: 'Gaming', hq: 'Bangalore, India', description: 'Mobile esports platform. Real-time systems, concurrency, and strong DSA.' },

  // India IT services and engineering R&D — high fresher search volume.
  { name: 'Nagarro', slug: 'nagarro', industry: 'IT Services', hq: 'Munich, Germany', description: 'Digital engineering. Practical coding and problem-solving rounds.' },
  { name: 'Coforge', slug: 'coforge', industry: 'IT Services', hq: 'Noida, India', description: 'IT services and consulting. Aptitude, core coding, and technical-plus-HR rounds.' },
  { name: 'Hexaware', slug: 'hexaware', industry: 'IT Services', hq: 'Mumbai, India', description: 'IT and BPO services. Aptitude, fundamentals, and communication rounds.' },
  { name: 'Virtusa', slug: 'virtusa', industry: 'IT Services', hq: 'Southborough, MA', description: 'Digital engineering services. Core coding, SQL, and technical rounds.' },
  { name: 'UST', slug: 'ust', industry: 'IT Services', hq: 'Aliso Viejo, CA', description: 'Digital transformation services. Fundamentals-focused coding and HR rounds.' },
  { name: 'Zensar', slug: 'zensar', industry: 'IT Services', hq: 'Pune, India', description: 'Digital solutions and services. Aptitude, coding basics, and technical rounds.' },
  { name: 'Birlasoft', slug: 'birlasoft', industry: 'IT Services', hq: 'Noida, India', description: 'Enterprise IT services. Aptitude, fundamentals, and technical-plus-HR rounds.' },
  { name: 'Cyient', slug: 'cyient', industry: 'IT Services', hq: 'Hyderabad, India', description: 'Engineering and technology services. Fundamentals and domain-focused rounds.' },
  { name: 'KPIT Technologies', slug: 'kpit', industry: 'IT Services', hq: 'Pune, India', description: 'Automotive software engineering. Embedded-adjacent coding and fundamentals.' },
  { name: 'Sonata Software', slug: 'sonata', industry: 'IT Services', hq: 'Bangalore, India', description: 'IT services and platform engineering. Core coding and technical rounds.' },
  { name: 'Happiest Minds', slug: 'happiest-minds', industry: 'IT Services', hq: 'Bangalore, India', description: 'Digital transformation services. Fundamentals, coding, and HR rounds.' },
  { name: 'Tata Elxsi', slug: 'tata-elxsi', industry: 'IT Services', hq: 'Bangalore, India', description: 'Design and engineering services. Embedded, media, and fundamentals-heavy rounds.' },
  { name: 'L&T Technology Services', slug: 'ltts', industry: 'IT Services', hq: 'Vadodara, India', description: 'Engineering R&D services. Embedded systems, C/C++, and fundamentals.' },
  { name: 'Amdocs', slug: 'amdocs', industry: 'IT Services', hq: "Ra'anana, Israel", description: 'Telecom software and services. Core coding, SQL, and technical-plus-HR rounds.' },
  { name: 'NTT Data', slug: 'ntt-data', industry: 'IT Services', hq: 'Tokyo, Japan', description: 'Global IT services. Aptitude, fundamentals, and technical interview rounds.' },
  { name: 'Publicis Sapient', slug: 'publicis-sapient', industry: 'Consulting', hq: 'Boston, MA', description: 'Digital business transformation. Strong DSA, design, and client-facing rounds.' },
  { name: 'Synechron', slug: 'synechron', industry: 'IT Services', hq: 'New York, NY', description: 'Financial-services tech consulting. Core coding and domain-focused rounds.' },
  { name: 'Genpact', slug: 'genpact', industry: 'Consulting', hq: 'New York, NY', description: 'Professional services and digital operations. Aptitude and coding fundamentals.' },
  { name: 'WNS', slug: 'wns', industry: 'Consulting', hq: 'Mumbai, India', description: 'Business process management. Aptitude, analytics, and communication rounds.' },

  // Global firms with very large India engineering centres.
  { name: 'Optum', slug: 'optum', industry: 'Health Tech', hq: 'Eden Prairie, MN', description: 'Health services and technology. Strong DSA, SQL, and system design rounds.' },
  { name: 'Texas Instruments', slug: 'texas-instruments', industry: 'Semiconductors', hq: 'Dallas, TX', description: 'Analog and embedded chips. C/C++ depth, microcontrollers, and fundamentals.' },
  { name: 'Synopsys', slug: 'synopsys', industry: 'Semiconductors', hq: 'Sunnyvale, CA', description: 'EDA and chip design software. Algorithms, C++, and systems-heavy rounds.' },
  { name: 'Cadence', slug: 'cadence', industry: 'Semiconductors', hq: 'San Jose, CA', description: 'EDA software for chip design. Strong DSA, C++, and algorithmic depth.' },
  { name: 'MathWorks', slug: 'mathworks', industry: 'Enterprise Software', hq: 'Natick, MA', description: 'MATLAB and Simulink. Algorithms, numerical computing, and deep problem-solving.' },
  { name: 'Western Digital', slug: 'western-digital', industry: 'Semiconductors', hq: 'San Jose, CA', description: 'Storage and flash. Firmware-adjacent coding, C, and systems fundamentals.' },
  { name: 'Pegasystems', slug: 'pega', industry: 'Enterprise Software', hq: 'Cambridge, MA', description: 'Low-code process automation. Java depth, design, and enterprise workflows.' },
  { name: 'FIS', slug: 'fis', industry: 'Fintech', hq: 'Jacksonville, FL', description: 'Banking and payments technology. Core coding, SQL, and reliability focus.' },
  { name: 'Fiserv', slug: 'fiserv', industry: 'Fintech', hq: 'Milwaukee, WI', description: 'Payments and financial technology. Fundamentals-heavy coding and design.' },
  { name: 'Broadridge', slug: 'broadridge', industry: 'Fintech', hq: 'New York, NY', description: 'Investor communications and fintech. Core coding, SQL, and domain rounds.' },
  { name: 'Bosch', slug: 'bosch', industry: 'Automotive', hq: 'Gerlingen, Germany', description: 'Mobility and industrial tech. Embedded C, automotive software, and fundamentals.' },
  { name: 'Siemens', slug: 'siemens', industry: 'Enterprise Software', hq: 'Munich, Germany', description: 'Industrial software and automation. Systems coding and engineering fundamentals.' },
  { name: 'Honeywell', slug: 'honeywell', industry: 'IoT', hq: 'Charlotte, NC', description: 'Industrial and building tech. Embedded-adjacent coding and systems rounds.' },
];

export const COMPANIES: SeedCompany[] = RAW_COMPANIES.map((c) => ({
  ...c,
  archetype: c.archetype ?? (SERVICES_SLUGS.has(c.slug) ? 'services' : 'product'),
}));

// A typo in SERVICES_SLUGS would silently leave a company on the wrong bank.
{
  const slugs = new Set(RAW_COMPANIES.map((c) => c.slug));
  const unknown = [...SERVICES_SLUGS].filter((s) => !slugs.has(s));
  if (unknown.length > 0) {
    throw new Error(`SERVICES_SLUGS references unknown slugs: ${unknown.join(', ')}`);
  }
}
