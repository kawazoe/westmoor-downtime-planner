import type { Key } from '@/lib/generics';

export function record<K extends Key, T>(keySelector: (val: T) => K): (source: T[]) => Record<K, T> {
  return s => s.reduce((acc, cur) => ({ ...acc, [keySelector(cur)]: cur }), {} as Record<K, T>);
}
