import type { Key } from '@/lib/generics';

export function _throw(error: unknown | (() => unknown)): never {
  throw typeof error === 'function' ? error() : error;
}

export function _with<T>(mutator: (v: T) => void): (v: T) => T {
  return v => {
    mutator(v);
    return v;
  };
}

export const _log: <T>(v: T) => T = _with(v => console.log(v));

export function find<K extends Key, T>(predicate: (value: T, key?: K) => boolean, obj: Record<K, T>): T | undefined {
  return (Object.entries(obj) as [K, T][]).find(([k, v]) => predicate(v, k))?.[1];
}

export function last<T>(source: T[]): T | undefined {
  return source[source.length - 1];
}

export function record<K extends Key, T>(keySelector: (val: T) => K): (source: T[]) => Record<K, T> {
  return s => s.reduce((acc, cur) => ({ ...acc, [keySelector(cur)]: cur }), {} as Record<K, T>);
}
