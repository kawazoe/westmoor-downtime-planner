export function parseIntSafe(value: unknown, defaultValue: number): number {
  const parsed = typeof value === 'number' ? value : parseInt(`${value}`, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}
