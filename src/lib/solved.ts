'use client';

import { useMemo, useSyncExternalStore } from 'react';

const KEY = 'theloop:solved';

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // `storage` fires in *other* tabs, keeping them in sync.
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

/**
 * Returns the raw serialized value, not a Set.
 * useSyncExternalStore compares snapshots with Object.is, so returning a fresh
 * Set on every call would loop forever. Strings compare by value.
 */
function getSnapshot(): string {
  try {
    return localStorage.getItem(KEY) ?? '[]';
  } catch {
    return '[]';
  }
}

function getServerSnapshot(): string {
  return '[]';
}

function parse(raw: string): Set<string> {
  try {
    const arr: unknown = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? (arr as string[]) : []);
  } catch {
    return new Set();
  }
}

function write(ids: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...ids]));
  } catch {
    /* private mode / quota — progress just won't persist */
  }
  emit();
}

export function toggleSolved(id: string) {
  const ids = parse(getSnapshot());
  if (ids.has(id)) ids.delete(id);
  else ids.add(id);
  write(ids);
}

export function clearSolved() {
  write(new Set());
}

/** Read outside React — used for exporting a backup. */
export function getSolvedIds(): string[] {
  return [...parse(getSnapshot())];
}

/** Merge a backup back in. Progress lives only in this browser, so this is
 *  the only way to move it to another device. */
export function importSolved(ids: string[]): number {
  const merged = parse(getSnapshot());
  const before = merged.size;
  for (const id of ids) if (typeof id === 'string') merged.add(id);
  write(merged);
  return merged.size - before;
}

/** The set of solved question ids. Empty during SSR and first hydration pass. */
export function useSolved(): Set<string> {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => parse(raw), [raw]);
}
