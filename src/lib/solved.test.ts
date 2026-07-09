import { describe, it, expect, beforeEach } from 'vitest';
import { toggleSolved, clearSolved } from './solved';

const KEY = 'theloop:solved';

// Minimal localStorage stand-in — the store must survive a missing/corrupt value.
function fakeStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
    key: () => null,
    length: 0,
  } as unknown as Storage;
}

function read(): string[] {
  return JSON.parse(globalThis.localStorage.getItem(KEY) ?? '[]');
}

describe('solved store', () => {
  beforeEach(() => {
    globalThis.localStorage = fakeStorage();
  });

  it('starts empty', () => {
    expect(read()).toEqual([]);
  });

  it('marks a question solved', () => {
    toggleSolved('google-1-q0');
    expect(read()).toEqual(['google-1-q0']);
  });

  it('toggles the same question back off', () => {
    toggleSolved('google-1-q0');
    toggleSolved('google-1-q0');
    expect(read()).toEqual([]);
  });

  it('tracks several questions independently', () => {
    toggleSolved('a');
    toggleSolved('b');
    toggleSolved('a');
    expect(read()).toEqual(['b']);
  });

  it('clears all progress', () => {
    toggleSolved('a');
    toggleSolved('b');
    clearSolved();
    expect(read()).toEqual([]);
  });

  it('recovers from a corrupt stored value instead of throwing', () => {
    globalThis.localStorage.setItem(KEY, 'not json{{');
    expect(() => toggleSolved('a')).not.toThrow();
    expect(read()).toEqual(['a']);
  });
});
