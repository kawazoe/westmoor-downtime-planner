export function first<T>(source: T[]): T | undefined {
  return source[0];
}
export function last<T>(source: T[]): T | undefined {
  return source[source.length - 1];
}
export function map<T, R>(selector: (v: T, i?: number) => R): (source: T[]) => R[] {
  return source => source.map(selector);
}
export function mapValue<K, T, R>(selector: (v: T, i?: number) => R): (source: [K, T][]) => [K, R][] {
  return source => source.map(([k, v], i) => [k, selector(v, i)]);
}
export function filter<T>(predicate: (v: T, i?: number) => boolean): (source: T[]) => T[] {
  return source => source.filter(predicate);
}
