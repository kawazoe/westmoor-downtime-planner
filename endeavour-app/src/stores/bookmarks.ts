import { _never } from '@/lib/_never';
import { parseIntSafe } from '@/lib/parsing';

export type BookmarkKind = 'absolute' | 'relative' | 'progressive';

export type AbsoluteBookmark = { kind: 'absolute', offset: number, limit: number };
export type RelativeBookmark = { kind: 'relative', page: number, pageSize: number };
export type ProgressiveBookmark = { kind: 'progressive', token: string };
export type Bookmark = AbsoluteBookmark | RelativeBookmark | ProgressiveBookmark;

function parsePositiveSafe(value: unknown, defaultValue: number): number {
  const parsed = parseIntSafe(value, defaultValue);
  return parsed <= 0 ? defaultValue : parsed;
}

export function toBookmark(candidate: { offset?: unknown, limit?: unknown }): AbsoluteBookmark;
export function toBookmark(candidate: { page?: unknown, pageSize?: unknown }): RelativeBookmark;
export function toBookmark(candidate: { token?: unknown }): ProgressiveBookmark;
export function toBookmark(candidate: Record<string, unknown>): Bookmark {
  if ('offset' in candidate || 'limit' in candidate) {
    return { kind: 'absolute', offset: parsePositiveSafe(candidate.offset, 0), limit: parsePositiveSafe(candidate.limit, 25) };
  }
  if ('page' in candidate || 'pageSize' in candidate) {
    return { kind: 'relative', page: parsePositiveSafe(candidate.page, 0), pageSize: parsePositiveSafe(candidate.pageSize, 25) };
  }
  if ('token' in candidate) {
    return { kind: 'progressive', token: `${candidate.token}` };
  }

  throw new Error('Unsupported bookmark type.');
}

export function equalsAbsolute(left: AbsoluteBookmark, right: AbsoluteBookmark): boolean {
  return left.offset === right.offset && left.limit === right.limit;
}
export function equalsRelative(left: RelativeBookmark, right: RelativeBookmark): boolean {
  return left.page === right.page && left.pageSize === right.pageSize;
}
export function equalsProgressive(left: ProgressiveBookmark, right: ProgressiveBookmark): boolean {
  return left.token === right.token;
}

export function equals(left: Bookmark, right: Bookmark): boolean {
  return (
    (left.kind === 'absolute' && right.kind === 'absolute' && equalsAbsolute(left, right)) ||
    (left.kind === 'relative' && right.kind === 'relative' && equalsRelative(left, right)) ||
    (left.kind === 'progressive' && right.kind === 'progressive' && equalsProgressive(left, right))
  );
}

export type Comparator<T> = (left: T, right: T) => boolean;
export function skipNull<T>(comparator: Comparator<T>): Comparator<T | null | undefined> {
  return (l, r) => l === r || (l != null && r != null && comparator(l, r));
}

const nullComparator = skipNull(equals);
const absoluteComparator = skipNull((l: Bookmark, r: Bookmark) => equalsAbsolute(l as AbsoluteBookmark, r as AbsoluteBookmark));
const relativeComparator = skipNull((l: Bookmark, r: Bookmark) => equalsRelative(l as RelativeBookmark, r as RelativeBookmark));
const progressiveComparator = skipNull((l: Bookmark, r: Bookmark) => equalsProgressive(l as ProgressiveBookmark, r as ProgressiveBookmark));
export function getComparator(kind: BookmarkKind | null): Comparator<Bookmark | null | undefined> {
  switch (kind) {
    case null:
      return nullComparator;
    case 'absolute':
      return absoluteComparator;
    case 'relative':
      return relativeComparator;
    case 'progressive':
      return progressiveComparator;
    default:
      return _never(kind);
  }
}

export function indexOfAbsolute(value: AbsoluteBookmark): number {
  return value.offset;
}
export function indexOfRelative(value: RelativeBookmark): number {
  return value.page * value.pageSize;
}
export function indexOfProgressive(): 0 {
  return 0;
}
export function indexOf(value: ProgressiveBookmark): 0;
export function indexOf(value: Bookmark): number;
export function indexOf(value: Bookmark): number {
  switch (value.kind) {
    case 'absolute':
      return indexOfAbsolute(value);
    case 'relative':
      return indexOfRelative(value);
    case 'progressive':
      return indexOfProgressive();
    default:
      return _never(value);
  }
}

export function isAfterOrAtAbsolute(value: AbsoluteBookmark, index: number): boolean {
  return indexOfAbsolute(value) >= index && value.limit > 0;
}
export function isAfterOrAtRelative(value: RelativeBookmark, index: number): boolean {
  return indexOfRelative(value) >= index && value.pageSize > 0;
}
export function isAfterOrAtProgressive(value: ProgressiveBookmark, index: number): boolean {
  return indexOfProgressive() >= index;
}
export function isAfterOrAt(value: Bookmark, index: number): boolean {
  switch (value.kind) {
    case 'absolute':
      return isAfterOrAtAbsolute(value, index);
    case 'relative':
      return isAfterOrAtRelative(value, index);
    case 'progressive':
      return isAfterOrAtProgressive(value, index);
    default:
      return _never(value);
  }
}
