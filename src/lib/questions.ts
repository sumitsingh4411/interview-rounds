import { ROUND_ORDER, type Role, type Level, type Round } from './constants';
import type { Question } from '@/content/types';

export type QuestionFilter = {
  role?: Role;
  level?: Level;
  round?: Round;
};

export type RoundGroup = {
  round: Round;
  questions: Question[];
};

export type Facets = {
  roles: Role[];
  levels: Level[];
  rounds: Round[];
};

/**
 * Group questions by their interview round, returning only rounds that have at
 * least one question, in canonical stage order (OA → … → behavioral).
 */
export function groupQuestionsByRound(questions: Question[]): RoundGroup[] {
  const byRound = new Map<Round, Question[]>();
  for (const q of questions) {
    const round = q.round as Round;
    const bucket = byRound.get(round);
    if (bucket) bucket.push(q);
    else byRound.set(round, [q]);
  }
  return ROUND_ORDER.filter((r) => byRound.has(r)).map((r) => ({
    round: r,
    questions: byRound.get(r)!,
  }));
}

/** Apply role/level/round filters. An unset filter matches everything. */
export function filterQuestions(
  questions: Question[],
  filter: QuestionFilter,
): Question[] {
  return questions.filter(
    (q) =>
      (!filter.role || q.role === filter.role) &&
      (!filter.level || q.level === filter.level) &&
      (!filter.round || q.round === filter.round),
  );
}

/** Distinct roles/levels/rounds present in a set of questions, in canonical order. */
export function facetsOf(questions: Question[]): Facets {
  const roles = new Set<Role>();
  const levels = new Set<Level>();
  const rounds = new Set<Round>();
  for (const q of questions) {
    roles.add(q.role as Role);
    levels.add(q.level as Level);
    rounds.add(q.round as Round);
  }
  return {
    roles: (['frontend', 'backend', 'fullstack'] as Role[]).filter((r) =>
      roles.has(r),
    ),
    levels: (['intern', 'junior', 'mid', 'senior', 'staff'] as Level[]).filter(
      (l) => levels.has(l),
    ),
    rounds: ROUND_ORDER.filter((r) => rounds.has(r)),
  };
}
