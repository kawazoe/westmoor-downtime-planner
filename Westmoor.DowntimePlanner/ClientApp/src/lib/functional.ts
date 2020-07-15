const uniqSkip = Symbol.for('uniqSkip');

export function uniq<T>(collection: T[], keySelector: (value: T) => any = v => v): T[] {
  const presence = [];

  return collection
    .map(value => {
      const key = keySelector(value);

      if (presence.includes(key)) {
        return uniqSkip;
      }

      presence.push(key);
      return value;
    })
    .filter(r => r !== uniqSkip) as T[];
}

export function groupBy<T, TKey = T>(
  collection: T[],
  keySelector: (value: T) => TKey = v => v as unknown as TKey
): {key: TKey, values: T[]}[] {
  return collection
    .reduce(
      (acc, cur) => {
        const key = keySelector(cur);
        const group = acc.find(g => g.key === key);
        if (group) {
          group.values.push(cur);
          return acc;
        } else {
          return [...acc, {key, values: [cur]}];
        }
      },
      [] as {key: TKey, values: T[]}[]
    );
}
