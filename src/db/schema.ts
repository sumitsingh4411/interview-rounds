import {
  pgTable,
  pgEnum,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
  index,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';
import {
  ROLES,
  LEVELS,
  ROUNDS,
  DIFFICULTIES,
  SOURCE_TYPES,
  type Round,
} from '../lib/constants';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export const roleEnum = pgEnum('role', ROLES);
export const levelEnum = pgEnum('level', LEVELS);
export const roundEnum = pgEnum('round', ROUNDS);
export const difficultyEnum = pgEnum('difficulty', DIFFICULTIES);
export const sourceTypeEnum = pgEnum('source_type', SOURCE_TYPES);
export const questionStatusEnum = pgEnum('question_status', ['draft', 'published']);
export const userRoleEnum = pgEnum('user_role', ['user', 'moderator', 'admin']);
export const submissionStatusEnum = pgEnum('submission_status', [
  'pending',
  'approved',
  'rejected',
]);
export const progressStatusEnum = pgEnum('progress_status', [
  'todo',
  'practicing',
  'done',
]);

// ---------------------------------------------------------------------------
// Auth.js (next-auth) adapter tables
// ---------------------------------------------------------------------------
export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  role: userRoleEnum('role').default('user').notNull(),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ],
);

export const sessions = pgTable('session', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verification_token',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

// ---------------------------------------------------------------------------
// Domain tables
// ---------------------------------------------------------------------------
export const companies = pgTable(
  'companies',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    logoUrl: text('logo_url'),
    description: text('description'),
    industry: text('industry'),
    hq: text('hq'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('companies_slug_idx').on(t.slug)],
);

export const questions = pgTable(
  'questions',
  {
    id: serial('id').primaryKey(),
    companyId: integer('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    body: text('body'),
    role: roleEnum('role').notNull(),
    level: levelEnum('level').notNull(),
    round: roundEnum('round').notNull(),
    difficulty: difficultyEnum('difficulty'),
    tags: text('tags').array().notNull().default([]),
    sourceType: sourceTypeEnum('source_type').notNull(),
    sourceUrl: text('source_url'),
    sourceAuthor: text('source_author'),
    isVerified: boolean('is_verified').notNull().default(false),
    status: questionStatusEnum('status').notNull().default('published'),
    upvotes: integer('upvotes').notNull().default(0),
    // Stable hash of normalized content — enables idempotent seed upserts.
    contentHash: text('content_hash').unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('questions_company_idx').on(t.companyId),
    index('questions_filter_idx').on(
      t.companyId,
      t.role,
      t.level,
      t.round,
      t.status,
    ),
  ],
);

export type SubmissionRound = {
  round: Round;
  questions: string[];
  notes?: string;
};

export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  companyName: text('company_name').notNull(),
  companyId: integer('company_id').references(() => companies.id),
  role: roleEnum('role').notNull(),
  level: levelEnum('level').notNull(),
  roundsJson: jsonb('rounds_json').$type<SubmissionRound[]>().notNull(),
  rawText: text('raw_text'),
  status: submissionStatusEnum('status').notNull().default('pending'),
  moderatorNote: text('moderator_note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bookmarks = pgTable(
  'bookmarks',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    questionId: integer('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.questionId] })],
);

export const progress = pgTable(
  'progress',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    questionId: integer('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),
    status: progressStatusEnum('status').notNull().default('todo'),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.questionId] })],
);

// Inferred row types for use across the app.
export type Company = typeof companies.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type User = typeof users.$inferSelect;
