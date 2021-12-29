export function reverse<T>(source: T[]): T[] {
  return source.reduce((acc, cur) => [cur, ...acc], [] as T[]);
}
