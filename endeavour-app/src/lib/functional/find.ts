import type { Key } from '@/lib/generics';

export function find<K extends Key, T>(
  predicate: (value: T, key?: K) => boolean,
  obj: Record<K, T>,
): T | undefined {
  return (Object.entries(obj) as [K, T][]).find(([k, v]) => predicate(v, k))?.[1];
}
