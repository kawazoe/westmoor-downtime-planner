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
