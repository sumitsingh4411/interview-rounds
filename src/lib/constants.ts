// Canonical taxonomy shared by the database schema and the UI.
// Kept free of any server-only imports so it is safe in client components.

export const ROLES = ['frontend', 'backend', 'fullstack'] as const;
export type Role = (typeof ROLES)[number];

export const LEVELS = ['intern', 'junior', 'mid', 'senior', 'staff'] as const;
export type Level = (typeof LEVELS)[number];

export const ROUNDS = [
  'oa',
  'dsa',
  'machine_coding',
  'lld',
  'system_design',
  'tech_deep_dive',
  'hiring_manager',
  'behavioral',
] as const;
export type Round = (typeof ROUNDS)[number];

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const SOURCE_TYPES = ['ai', 'github', 'community'] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  fullstack: 'Full-stack',
};

export const LEVEL_LABELS: Record<Level, string> = {
  intern: 'Intern',
  junior: 'New Grad / Junior',
  mid: 'Mid',
  senior: 'Senior',
  staff: 'Staff+',
};

export const ROUND_LABELS: Record<Round, string> = {
  oa: 'Online Assessment',
  dsa: 'DSA / Coding',
  machine_coding: 'Machine Coding',
  lld: 'Low-Level Design',
  system_design: 'System Design',
  tech_deep_dive: 'Tech Deep-Dive',
  hiring_manager: 'Hiring Manager',
  behavioral: 'Behavioral / HR',
};

export const ROUND_DESCRIPTIONS: Record<Round, string> = {
  oa: 'Timed online coding / aptitude screen, usually the first filter.',
  dsa: 'Data structures & algorithms on a whiteboard or shared editor.',
  machine_coding: 'Build a working component or service under time pressure.',
  lld: 'Object-oriented / low-level design of a focused module.',
  system_design: 'High-level architecture of a large-scale system.',
  tech_deep_dive: 'Deep questions on your core stack and fundamentals.',
  hiring_manager: 'Scope, ownership, and role-fit discussion with the manager.',
  behavioral: 'Values, collaboration, and past-experience (STAR) questions.',
};

// Canonical display order for interview rounds (earliest → latest stage).
export const ROUND_ORDER: readonly Round[] = ROUNDS;

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export const SOURCE_LABELS: Record<SourceType, string> = {
  ai: 'AI-generated (likely question)',
  github: 'GitHub',
  community: 'Community',
};

// Coerce untrusted URL params to a valid enum value (or undefined).
export function asRole(v?: string | null): Role | undefined {
  return ROLES.includes(v as Role) ? (v as Role) : undefined;
}
export function asLevel(v?: string | null): Level | undefined {
  return LEVELS.includes(v as Level) ? (v as Level) : undefined;
}
export function asRound(v?: string | null): Round | undefined {
  return ROUNDS.includes(v as Round) ? (v as Round) : undefined;
}
