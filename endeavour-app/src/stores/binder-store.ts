import { Uuid } from '@/stores/core-types';

export type AbsoluteBookmark = { offset: number, limit: number };
export type RelativeBookmark = { page: number, pageSize: number };
export type ProgressiveBookmark = { token: Uuid };
export type Bookmark = AbsoluteBookmark | RelativeBookmark | ProgressiveBookmark;

export const NullBookmark = { token: Uuid.cast('null') };
Object.freeze(NullBookmark);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isAbsoluteBookmark(value: any): value is AbsoluteBookmark {
  return value != null && typeof value.offset === 'number' && typeof value.limit === 'number';
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRelativeBookmark(value: any): value is RelativeBookmark {
  return value != null && typeof value.page === 'number' && typeof value.pageSize === 'number';
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isProgressiveBookmark(value: any): value is ProgressiveBookmark {
  return value != null && typeof value.token === 'string';
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isBookmark(value: any): value is Bookmark {
  return isAbsoluteBookmark(value) || isRelativeBookmark(value) || isProgressiveBookmark(value);
}

export type PageStatus = 'initial' | 'loading' | 'content' | 'empty' | 'error' | 'refreshing' | 'retrying';
export type Page<V> = {
  status: PageStatus,
  bookmark: Bookmark | null,
  value: V[],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPage<V>(value: any): value is Page<V> {
  return value != null && 'status' in value && 'bookmark' in value;
}

export type BinderStatus = 'initial' | 'loading' | 'nested';
export type Binder<V> = {
  status: BinderStatus,
  queryKey: unknown,
  pages: Page<V>[],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isBinder<V>(value: any): value is Binder<V> {
  return value != null && 'status' in value && Array.isArray(value.pages);
}
