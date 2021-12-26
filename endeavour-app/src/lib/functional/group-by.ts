export function groupBy<T, TKey = T>(
  collection: T[],
  keySelector: (value: T) => TKey = v => v as unknown as TKey,
): {key: TKey, values: T[]}[] {
  return collection
    .reduce(
      (acc, cur) => {
        const key = keySelector(cur);
        const group = acc.find(g => g.key === key);
        if (group) {
          group.values.push(cur);
          return acc;
        }
        return [...acc, { key, values: [cur] }];
      },
      [] as {key: TKey, values: T[]}[],
    );
}
