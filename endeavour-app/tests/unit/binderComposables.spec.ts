import { beforeEach, describe, expect, it, vi } from 'vitest';

import { _never } from '@/lib/_never';
import { _throw } from '@/lib/_throw';

import { stall } from '../lib/mockPromise';

import * as B from '@/lib/bookmarks';
import type { Metadata, Page } from '@/composables/binders';
import { useEnumerableBinder, useIndexableBinder } from '@/composables/binders';

const mockEmptyPredicate = vi.fn(v => Array.isArray(v.value) && v.value[0] === 'success');

function describeBinders(callback: (binderKind: 'enumerable' | 'indexable') => void) {
  describe('enumerable', () => callback('enumerable'));
  describe('indexable', () => callback('indexable'));
}

function describeEnumerablePagers(callback: (pagerKind: B.BookmarkKind) => void) {
  describe('absolute', () => callback('absolute'));
  describe('relative', () => callback('relative'));
  describe('progressive', () => callback('progressive'));
}

function describeIndexablePagers(callback: (pagerKind: Exclude<B.BookmarkKind, 'progressive'>) => void) {
  describe('absolute', () => callback('absolute'));
  describe('relative', () => callback('relative'));
}

function describeValidSetups(callback: (binderKind: 'enumerable' | 'indexable', pagerKind: B.BookmarkKind) => void) {
  describe('enumerable', () => {
    describe('absolute', () => callback('enumerable', 'absolute'));
    describe('relative', () => callback('enumerable', 'relative'));
    describe('progressive', () => callback('enumerable', 'progressive'));
  });

  describe('indexable', () => {
    describe('absolute', () => callback('indexable', 'absolute'));
    describe('relative', () => callback('indexable', 'relative'));
    // While it is possible to emulate a progressive pager from an indexable source,
    // it is not possible to have an indexable binder with a progressive source.
  });
}

function autoBinder(kind: 'enumerable' | 'indexable') {
  switch (kind) {
    case 'enumerable':
      return useEnumerableBinder;
    case 'indexable':
      return useIndexableBinder;
    default:
      return _never(kind);
  }
}

function autoBookmarker(kind: B.BookmarkKind, maxPageSize: number) {
  return function autoBookmark(page: number, last = false) {
    switch (kind) {
      case 'absolute':
        return B.toBookmark({ offset: page * maxPageSize, limit: maxPageSize });
      case 'relative':
        return B.toBookmark({ page, pageSize: maxPageSize });
      case 'progressive':
        if (last) {
          // Progressive APIs returns an empty token on their last page
          return B.toBookmark({ token: '' });
        }
        // Progressive APIs returns the bookmark for the next page instead of the current page.
        return B.toBookmark({ token: `mock${page + 1}x${maxPageSize}` });
      default:
        return _never(kind);
    }
  };
}

function autoPager<V, Meta extends Metadata>(
  kind: B.BookmarkKind,
  values: (V[] | null | undefined)[],
  metaFactory: (bookmark: B.Bookmark, value: V[] | null | undefined) => Page<V, Meta>['metadata'] = () => ({} as Meta),
) {
  const maxPageSize = values
    .map(p => p?.length ?? 0)
    .reduce((acc, cur) => (cur > acc ? cur : acc), 0);

  const autoBookmark = autoBookmarker(kind, maxPageSize);

  function toPage({ bookmark, page }: {
    bookmark: Page<V, Meta>['bookmark'],
    page: Page<V, Meta>['value'] | null | undefined,
  }): Page<V, Meta> {
    const meta: Page<V, Meta>['metadata'] = {} as Meta;

    if (values[values.length - 1] === page) {
      meta.last = true;
    }
    if (page?.length === maxPageSize) {
      meta.full = true;
    }

    return { bookmark, value: page, metadata: { ...meta, ...metaFactory(bookmark, page) } };
  }

  const data = values
    .map((p, i) => ({
      bookmark: autoBookmark(i, values.length - 1 === i),
      page: p,
    }));

  return (bookmark: B.Bookmark | null) => {
    if (!bookmark) {
      const first = data[0];
      if (!first) {
        throw new Error('Invalid test configuration. Using autoPager without any configured pages.');
      }
      return Promise.resolve(toPage(first));
    }

    const datumIndex = data.findIndex(p => B.equals(p.bookmark, bookmark));
    const datum = bookmark.kind === 'progressive'
      ? data[datumIndex + 1]
      : data[datumIndex];
    if (!datum) {
      throw new Error('Invalid test configuration. AutoPager received an un-mappable bookmark.');
    }
    return Promise.resolve(toPage(datum));
  };
}

describe('Binder Composable', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('State machine (base states)', () => {
    describeBinders(binderKind => {
      it('should be created in a neutral state', () => {
        const pager = vi.fn(async () => stall<Page<unknown>>());
        const trigger = vi.fn(() => pager);
        const sut = autoBinder(binderKind)(trigger);

        expect(trigger).not.toHaveBeenCalled();
        expect(pager).not.toHaveBeenCalled();

        expect(sut.status.value).toBe('initial');
        expect(sut.state.value.cacheKey).toBe('');
        expect(sut.pages.value).toEqual([]);
        expect(sut.error.value).toBeUndefined();
      });

      it('should not change state on bind', () => {
        const pager = vi.fn(async () => stall<Page<unknown>>());
        const trigger = vi.fn(() => pager);
        const sut = autoBinder(binderKind)(trigger);

        sut.bind();

        expect(trigger).toHaveBeenCalled();
        expect(pager).not.toHaveBeenCalled();

        expect(sut.status.value).toBe('initial');
        expect(sut.pages.value).toEqual([]);
        expect(sut.error.value).toBeUndefined();
      });

      it('should enter a nested loading state while waiting after the trigger', () => {
        const pager = vi.fn(async () => stall<Page<unknown>>());
        const trigger = vi.fn(() => pager);
        const sut = autoBinder(binderKind)(trigger);

        sut.bind().next();

        expect(trigger).toHaveBeenCalled();
        expect(pager).toHaveBeenCalled();

        expect(sut.status.value).toBe('nested');
        expect(sut.error.value).toBeUndefined();

        const page = sut.pages.value[0];

        expect(sut.currentPage.value).toBe(page);

        expect(page?.status).toBe('loading');
        expect(page?.key).toBeTruthy();
        expect(page?.bookmark).toBeNull();
        expect(page?.value).toEqual([]);
        expect(page?.error).toBeUndefined();
      });

      describe('Caching', () => {
        it('should set a cache key on bind', () => {
          const sut = autoBinder(binderKind)(() => async () => stall<Page<unknown>>());

          const previousKey = sut.state.value.cacheKey;
          sut.bind();

          expect(sut.state.value.cacheKey).not.toBe(previousKey);
        });
      });
    });

    describeValidSetups((binderKind, pagerKind) => {
      it('should enter a nested content state while waiting after the trigger', async () => {
        const sut = autoBinder(binderKind)(() => autoPager(pagerKind, [[1, 2, 3]]));

        await sut.bind().next();

        expect(sut.status.value).toBe('nested');
        expect(sut.error.value).toBeUndefined();

        const page = sut.pages.value[0];

        expect(page?.status).toBe('content');
        expect(page?.value).toStrictEqual([1, 2, 3]);
        expect(page?.error).toBeUndefined();
      });

      describe('Default empty predicate', () => {
        for (const emptyValue of [undefined, null, []]) {
          it(`should enter an empty state when the trigger returns "${JSON.stringify(emptyValue)}"`, async () => {
            const sut = autoBinder(binderKind)(() => autoPager(pagerKind, [emptyValue]));

            await sut.bind().next();

            expect(sut.status.value).toBe('nested');
            expect(sut.error.value).toBeUndefined();

            const page = sut.pages.value[0];

            expect(page?.status).toBe('empty');
            expect(page?.value).toStrictEqual([]);
            expect(page?.error).toBeUndefined();
          });
        }
      });

      it('should enter a nested empty state when the content matches the empty predicate', async () => {
        const sut = autoBinder(binderKind)(
          () => autoPager(pagerKind, [['success']]),
          { emptyPredicate: mockEmptyPredicate },
        );

        await sut.bind().next();

        expect(mockEmptyPredicate).toHaveBeenCalledOnce();

        expect(sut.status.value).toBe('nested');
        expect(sut.error.value).toBeUndefined();

        const page = sut.pages.value[0];

        expect(page?.status).toBe('empty');
        expect(page?.value).toStrictEqual(['success']);
        expect(page?.error).toBeUndefined();
      });

      it('should enter an error state when the pager fails to resolve a bookmark', async () => {
        const sut = autoBinder(binderKind)(() => async () => ({ value: [] } as unknown as Page<unknown>));

        await sut.bind().next();

        expect(sut.status.value).toBe('error');
        expect(sut.pages.value).toStrictEqual([]);
        expect(sut.error.value).toBeInstanceOf(Error);
        expect((sut.error.value as Error).message).toEqual('Invalid bookmark. Bookmark kind is undetectable.');
      });

      it('should enter a nested error state when the pager throws a bookmarked error', async () => {
        const error = await autoPager(pagerKind, [[1, 2, 3]])(null);
        const sut = autoBinder(binderKind)(() => async () => _throw(error));

        await sut.bind().next();

        expect(sut.status.value).toBe('nested');
        expect(sut.error.value).toBeUndefined();

        const page = sut.pages.value[0];

        expect(page?.status).toBe('error');
        expect(page?.value).toStrictEqual([]);
        expect(page?.error).toBe(error);
      });

      it('should enter an error state when the pager throws a generic error', async () => {
        const sut = autoBinder(binderKind)(() => async () => _throw('failure'));

        await sut.bind().next();

        expect(sut.status.value).toBe('error');
        expect(sut.pages.value).toStrictEqual([]);
        expect(sut.error.value).toEqual('failure');
      });
    });
  });

  describe('Caching', () => {
    describeValidSetups((binderKind, pagerKind) => {
      it('should not change the cache key on resolve', async () => {
        const sut = autoBinder(binderKind)(() => autoPager(pagerKind, [[1, 2, 3]]));

        const binder = sut.bind();
        const previousKey = sut.state.value.cacheKey;

        await binder.next();

        expect(sut.state.value.cacheKey).toBe(previousKey);
      });

      it('should not change the cache key on reject', async () => {
        const error = await autoPager(pagerKind, [[1, 2, 3]])(null);
        const sut = autoBinder(binderKind)(() => async () => _throw(error));

        const binder = sut.bind();
        const previousKey = sut.state.value.cacheKey;

        await binder.next();

        expect(sut.state.value.cacheKey).toBe(previousKey);
      });

      it('should clear the cache on re-bind when key changes', async () => {
        const sut = autoBinder(binderKind)(() => autoPager(pagerKind, [[1, 2, 3]]));

        await sut.bind().next();
        const previousKey = sut.state.value.cacheKey;
        sut.bind();

        expect(sut.state.value.cacheKey).not.toBe(previousKey);
        expect(sut.status.value).toBe('initial');
        expect(sut.pages.value).toEqual([]);
        expect(sut.error.value).toBeUndefined();
      });

      it('should use first param as cache key if available by default', async () => {
        const sut = autoBinder(binderKind)((arg1: string) => autoPager(pagerKind, [[arg1]]));

        await sut.bind('key');

        expect(sut.state.value.cacheKey).toBe('key');
      });
    });
  });

  describe('useEnumerableBinder', () => {
    describe('State machine (advanced states)', () => {
      describeEnumerablePagers(pagerKind => {
        it('should create a new page as loading on next', async () => {
          const sut = useEnumerableBinder(() => autoPager(pagerKind, [[1, 2, 3], [4, 5, 6]]));

          const binder = sut.bind();
          await binder.next();

          // noinspection ES6MissingAwait
          binder.next();

          const page0 = sut.pages.value[0];
          const page1 = sut.pages.value[1];

          expect(page1).not.toBe(page0);

          expect(page1?.status).toBe('loading');
          expect(page1?.value).toStrictEqual([]);
          expect(page1?.error).toBeUndefined();
        });

        it('should use cleanup temporary states on next', async () => {
          const bookmarker = autoBookmarker(pagerKind, 3);
          const pager = vi.fn<[], Promise<Page<number>>>();
          const sut = useEnumerableBinder(() => pager);

          const binder = sut.bind();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(0), value: [1, 2, 3], metadata: {} });
          await binder.next();

          // Intentional gap in bookmarks

          pager.mockResolvedValueOnce({ bookmark: bookmarker(2), value: [4, 5, 6], metadata: {} });
          await binder.next();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(3), value: [7, 8, 9], metadata: {} });
          await binder.next();

          expect(sut.pages.value).toHaveLength(3);

          const page1 = sut.pages.value[1];
          const page2 = sut.pages.value[2];

          expect(page1?.value).toStrictEqual([4, 5, 6]);
          expect(page1?.status).toBe('content');
          expect(page2?.value).toStrictEqual([7, 8, 9]);
          expect(page2?.status).toBe('content');
        });

        it('should keep the currentPage as the last added page', async () => {
          const sut = useEnumerableBinder(() => autoPager(pagerKind, [[1, 2, 3], [4, 5, 6], [7, 8, 9]]));

          const binder = sut.bind();
          expect(sut.currentPage.value).toBeNull();

          await binder.next();
          expect(sut.currentPage.value).toBe(sut.pages.value[0]);

          await binder.next();
          expect(sut.currentPage.value).toBe(sut.pages.value[1]);

          await binder.next();
          expect(sut.currentPage.value).toBe(sut.pages.value[2]);
        });
      });
    });

    describe('Bookmarking', () => {
      it('should do the initial call without a bookmark', () => {
        const pager = vi.fn(async () => stall<Page<unknown>>());
        const sut = useEnumerableBinder(() => pager);

        sut.bind().next();

        expect(pager).toHaveBeenCalledWith(null);
      });

      it('should do following absolute calls by building the next bookmark', async () => {
        const pager = vi.fn(autoPager('absolute', [[1, 2, 3], [4, 5, 6]]));
        const sut = useEnumerableBinder(() => pager);

        const binder = sut.bind();

        await binder.next();
        // noinspection ES6MissingAwait
        binder.next();

        expect(pager).toHaveBeenLastCalledWith({ kind: 'absolute', offset: 3, limit: 3 });
      });

      it('should do following relative calls by building the next bookmark', async () => {
        const pager = vi.fn(autoPager('relative', [[1, 2, 3], [4, 5, 6]]));
        const sut = useEnumerableBinder(() => pager);

        const binder = sut.bind();

        await binder.next();
        // noinspection ES6MissingAwait
        binder.next();

        expect(pager).toHaveBeenLastCalledWith({ kind: 'relative', page: 1, pageSize: 3 });
      });

      it('should do following progressive calls using the previously resolved bookmark', async () => {
        const pager = vi.fn(autoPager('progressive', [[1, 2, 3], [4, 5, 6]]));
        const sut = useEnumerableBinder(() => pager);

        const binder = sut.bind();

        await binder.next();
        // noinspection ES6MissingAwait
        binder.next();

        // mock1x3 is the token autogenerated to request the second (index 1) page of 3 items
        expect(pager).toHaveBeenLastCalledWith({ kind: 'progressive', token: 'mock1x3' });
      });

      describeIndexablePagers(pagerKind => {
        it('should use the response bookmark as priority', async () => {
          const bookmarker = autoBookmarker(pagerKind, 3);
          const pager = vi.fn<[], Promise<Page<number>>>();
          const sut = useEnumerableBinder(() => pager);

          const binder = sut.bind();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(0), value: [1, 2, 3], metadata: {} });
          await binder.next();

          // Intentional gap in bookmarks

          pager.mockResolvedValueOnce({ bookmark: bookmarker(2), value: [4, 5, 6], metadata: {} });
          await binder.next();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(3), value: [7, 8, 9], metadata: {} });
          await binder.next();

          const page1 = sut.pages.value[1];
          const page2 = sut.pages.value[2];

          expect(page1?.bookmark).toStrictEqual(bookmarker(2));
          expect(page2?.bookmark).toStrictEqual(bookmarker(3));
        });
      });

      describe('progressive', () => {
        it('should use the response bookmark as next bookmark', async () => {
          const bookmarker = autoBookmarker('progressive', 3);
          const pager = vi.fn<[], Promise<Page<number>>>();
          const sut = useEnumerableBinder(() => pager);

          const binder = sut.bind();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(0), value: [1, 2, 3], metadata: {} });
          await binder.next();

          // Intentional gap in bookmarks

          pager.mockResolvedValueOnce({ bookmark: bookmarker(2), value: [4, 5, 6], metadata: {} });
          await binder.next();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(3), value: [7, 8, 9], metadata: {} });
          await binder.next();

          const page1 = sut.pages.value[1];
          const page2 = sut.pages.value[2];

          expect(page1?.bookmark).toStrictEqual(bookmarker(0));
          expect(page2?.bookmark).toStrictEqual(bookmarker(2));
        });
      });

      for (const { f: firstKind, s: secondKind } of [
        { f: 'absolute', s: 'relative' },
        { f: 'absolute', s: 'progressive' },
        { f: 'relative', s: 'absolute' },
        { f: 'relative', s: 'progressive' },
        { f: 'progressive', s: 'absolute' },
        { f: 'progressive', s: 'relative' },
      ] as {f: B.BookmarkKind, s: B.BookmarkKind}[]) {
        it(`should fail when the type of bookmark changes from ${firstKind} to ${secondKind} between pages`, async () => {
          const pager = vi.fn<[], Promise<Page<number>>>();
          const sut = useEnumerableBinder(() => pager);

          const binder = sut.bind();

          pager.mockResolvedValueOnce({ bookmark: autoBookmarker(firstKind, 3)(0), value: [1, 2, 3], metadata: {} });
          await binder.next();

          pager.mockResolvedValueOnce({ bookmark: autoBookmarker(secondKind, 3)(1), value: [4, 5, 6], metadata: {} });
          await binder.next();

          const page1 = sut.pages.value[1];
          expect(page1?.status).toBe('error');
          expect(page1?.error).toBeInstanceOf(Error);
          expect((page1?.error as Error).message).toContain('Bookmark kind cannot change');
        });
      }
    });

    describe('Safeties', () => {
      describeEnumerablePagers(pagerKind => {
        it('should fail when reusing an expired adapter', () => {
          const sut = useEnumerableBinder(() => autoPager(pagerKind, [[1, 2, 3]]));

          const binder = sut.bind();
          sut.bind();

          expect(() => binder.next()).toThrowError('Expired BinderAdapter.');
        });

        it('should not attempt to load pages after the last page', async () => {
          const sut = useEnumerableBinder(() => autoPager(pagerKind, [[1, 2, 3]]));

          const binder = sut.bind();
          await binder.next();
          binder.next();

          expect(sut.pages.value).toHaveLength(1);
        });

        it.skip('should revert the currently loading page if the results are empty', () => {
        });

        it.skip('should not have more than 1 loading page in flight', () => {
          // parallel refresh + attempt parallel loading
        });

        it('should not update when trigger resolves after rebind', async () => {
          const bookmarker = autoBookmarker(pagerKind, 3);
          const pager = vi.fn<[], Promise<Page<number>>>();
          const sut = useEnumerableBinder(() => pager);

          const binder = sut.bind();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(0), value: [1, 2, 3], metadata: {} });
          await binder.next();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(1), value: [4, 5, 6], metadata: {} });
          const awaiter = binder.next();

          sut.bind();

          await awaiter;

          expect(sut.pages.value).toHaveLength(0);
        });

        it('should not update when trigger rejects after rebind', async () => {
          const bookmarker = autoBookmarker(pagerKind, 3);
          const pager = vi.fn<[], Promise<Page<number>>>();
          const sut = useEnumerableBinder(() => pager);

          const binder = sut.bind();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(0), value: [1, 2, 3], metadata: {} });
          await binder.next();

          pager.mockRejectedValueOnce({ bookmark: bookmarker(1), value: [4, 5, 6], metadata: {} });
          const awaiter = binder.next();

          sut.bind();

          await awaiter;

          expect(sut.pages.value).toHaveLength(0);
        });
      });
    });
  });

  describe('useIndexableBinder', () => {
    describe('State machine (advanced states)', () => {
      describeIndexablePagers(pagerKind => {
        it('should create a new page as loading on next', async () => {
          const sut = useIndexableBinder(() => autoPager(pagerKind, [[1, 2, 3], [4, 5, 6]]));

          const binder = sut.bind();
          await binder.next();

          // noinspection ES6MissingAwait
          binder.next();

          const page0 = sut.pages.value[0];
          const page1 = sut.pages.value[1];

          expect(page1).not.toBe(page0);

          expect(page1?.status).toBe('loading');
          expect(page1?.value).toStrictEqual([]);
          expect(page1?.error).toBeUndefined();
        });

        it('should create a new page as loading on previous', async () => {
          const bookmarker = autoBookmarker(pagerKind, 3);
          const pager = vi.fn<[], Promise<Page<number>>>();
          const sut = useIndexableBinder(() => pager);

          const binder = sut.bind();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(-1), value: [-2, -1, 0], metadata: {} });
          // noinspection ES6MissingAwait
          binder.previous();

          const page1 = sut.pages.value[0];

          expect(page1?.status).toBe('loading');
          expect(page1?.value).toStrictEqual([]);
          expect(page1?.error).toBeUndefined();
        });

        it('should create a new page as loading on load', async () => {
          const bookmarker = autoBookmarker(pagerKind, 3);
          const pager = vi.fn<[], Promise<Page<number>>>();
          const sut = useIndexableBinder(() => pager);

          const binder = sut.bind();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(0), value: [1, 2, 3], metadata: {} });
          await binder.next();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(2), value: [6, 7, 9], metadata: {} });
          // noinspection ES6MissingAwait
          binder.load(bookmarker(2));

          const page0 = sut.pages.value[0];
          const page2 = sut.pages.value[1];

          expect(page2).not.toBe(page0);
          expect(sut.currentPage.value).toBe(page0);

          expect(page2?.status).toBe('loading');
          expect(page2?.value).toStrictEqual([]);
          expect(page2?.error).toBeUndefined();
        });

        it('should create a new page as loading and mark it as current on open', async () => {
          const bookmarker = autoBookmarker(pagerKind, 3);
          const pager = vi.fn<[], Promise<Page<number>>>();
          const sut = useIndexableBinder(() => pager);

          const binder = sut.bind();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(0), value: [1, 2, 3], metadata: {} });
          await binder.next();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(2), value: [7, 8, 9], metadata: {} });
          // noinspection ES6MissingAwait
          binder.open(bookmarker(2));

          expect(sut.currentPage.value).toBe(sut.pages.value[1]);
        });

        it('should cleanup temporary states', async () => {
          const bookmarker = autoBookmarker(pagerKind, 3);
          const pager = vi.fn<[], Promise<Page<number>>>();
          const sut = useIndexableBinder(() => pager);

          const binder = sut.bind();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(0), value: [1, 2, 3], metadata: {} });
          await binder.next();

          // Intentional gap in bookmarks

          pager.mockResolvedValueOnce({ bookmark: bookmarker(2), value: [4, 5, 6], metadata: {} });
          await binder.next();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(3), value: [7, 8, 9], metadata: {} });
          await binder.next();

          expect(sut.pages.value).toHaveLength(3);

          const page1 = sut.pages.value[1];
          const page2 = sut.pages.value[2];

          expect(page1?.value).toStrictEqual([4, 5, 6]);
          expect(page1?.status).toBe('content');
          expect(page2?.value).toStrictEqual([7, 8, 9]);
          expect(page2?.status).toBe('content');
        });

        it('should enter a refreshing state for the page associated with the provided index on refresh', async () => {
          const sut = useIndexableBinder(() => autoPager(pagerKind, [[1, 2, 3], [4, 5, 6], [7, 8, 9]]));

          const binder = sut.bind();
          await binder.next();
          await binder.next();
          await binder.next();

          binder.refresh(1);

          const page = sut.pages.value[1];

          expect(page?.status).toBe('refreshing');
          expect(page?.value).toStrictEqual([4, 5, 6]);
          expect(page?.error).toBeUndefined();
        });

        it('should enter a refreshing state for the page matching the provided bookmark on load', async () => {
          const bookmarker = autoBookmarker(pagerKind, 3);
          const pager = vi.fn<[], Promise<Page<number>>>();
          const sut = useIndexableBinder(() => pager);

          const binder = sut.bind();
          pager.mockResolvedValueOnce({ bookmark: bookmarker(0), value: [1, 2, 3], metadata: {} });
          await binder.next();
          pager.mockResolvedValueOnce({ bookmark: bookmarker(1), value: [4, 5, 6], metadata: {} });
          await binder.next();
          pager.mockResolvedValueOnce({ bookmark: bookmarker(2), value: [7, 8, 9], metadata: {} });
          await binder.next();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(1), value: [4, 5, 6], metadata: {} });
          binder.load(bookmarker(1));

          const page = sut.pages.value[1];

          expect(page?.status).toBe('refreshing');
          expect(page?.value).toStrictEqual([4, 5, 6]);
          expect(page?.error).toBeUndefined();
        });

        it('should keep pages in bookmark order when requested', async () => {
          const bookmarker = autoBookmarker(pagerKind, 3);
          const pager = vi.fn<[], Promise<Page<number>>>();
          const sut = useIndexableBinder(() => pager);

          const binder = sut.bind();
          pager.mockResolvedValueOnce({ bookmark: bookmarker(3), value: [], metadata: {} });
          binder.load(bookmarker(3));
          pager.mockResolvedValueOnce({ bookmark: bookmarker(1), value: [], metadata: {} });
          binder.load(bookmarker(1));
          pager.mockResolvedValueOnce({ bookmark: bookmarker(2), value: [], metadata: {} });
          binder.load(bookmarker(2));
          pager.mockResolvedValueOnce({ bookmark: bookmarker(-1), value: [], metadata: {} });
          binder.load(bookmarker(-1));

          expect(sut.pages.value[0]?.bookmark).toStrictEqual(bookmarker(-1));
          expect(sut.pages.value[1]?.bookmark).toStrictEqual(bookmarker(1));
          expect(sut.pages.value[2]?.bookmark).toStrictEqual(bookmarker(2));
          expect(sut.pages.value[3]?.bookmark).toStrictEqual(bookmarker(3));
        });

        it('should keep pages in returned bookmark order', async () => {
          const bookmarker = autoBookmarker(pagerKind, 3);
          const pager = vi.fn<[], Promise<Page<number>>>();
          const sut = useIndexableBinder(() => pager);

          const binder = sut.bind();
          pager.mockResolvedValueOnce({ bookmark: bookmarker(3), value: [7, 8, 9], metadata: {} });
          await binder.load(bookmarker(42));
          pager.mockResolvedValueOnce({ bookmark: bookmarker(1), value: [1, 2, 3], metadata: {} });
          await binder.load(bookmarker(42));
          pager.mockRejectedValueOnce({ bookmark: bookmarker(2), message: 'mock error' });
          await binder.load(bookmarker(42));
          pager.mockResolvedValueOnce({ bookmark: bookmarker(-1), value: [-2, -1, 0], metadata: {} });
          await binder.load(bookmarker(42));

          expect(sut.pages.value[0]?.bookmark).toStrictEqual(bookmarker(-1));
          expect(sut.pages.value[0]?.value).toStrictEqual([-2, -1, 0]);
          expect(sut.pages.value[1]?.bookmark).toStrictEqual(bookmarker(1));
          expect(sut.pages.value[1]?.value).toStrictEqual([1, 2, 3]);
          expect(sut.pages.value[2]?.bookmark).toStrictEqual(bookmarker(2));
          expect((sut.pages.value[2]?.error as Error)?.message).toStrictEqual('mock error');
          expect(sut.pages.value[3]?.bookmark).toStrictEqual(bookmarker(3));
          expect(sut.pages.value[3]?.value).toStrictEqual([7, 8, 9]);
        });
      });
    });

    describe('Bookmarking', () => {
      it('should do the initial call without a bookmark', () => {
        const pager = vi.fn(async () => stall<Page<unknown>>());
        const sut = useIndexableBinder(() => pager);

        sut.bind().next();

        expect(pager).toHaveBeenCalledWith(null);
      });

      it('should do following absolute calls by building the next bookmark', async () => {
        const pager = vi.fn(autoPager('absolute', [[1, 2, 3], [4, 5, 6]]));
        const sut = useEnumerableBinder(() => pager);

        const binder = sut.bind();

        await binder.next();
        // noinspection ES6MissingAwait
        binder.next();

        expect(pager).toHaveBeenLastCalledWith({ kind: 'absolute', offset: 3, limit: 3 });
      });

      it('should do following relative calls by building the next bookmark', async () => {
        const pager = vi.fn(autoPager('relative', [[1, 2, 3], [4, 5, 6]]));
        const sut = useEnumerableBinder(() => pager);

        const binder = sut.bind();

        await binder.next();
        // noinspection ES6MissingAwait
        binder.next();

        expect(pager).toHaveBeenLastCalledWith({ kind: 'relative', page: 1, pageSize: 3 });
      });

      it.skip('should do following absolute calls by building the previous bookmark', () => {
      });

      it.skip('should do following relative calls by building the previous bookmark', () => {
      });

      it.skip('should forward provided bookmarks to the pager when loading', () => {
      });

      it.skip('should forward provided bookmarks to the pager when opening', () => {
      });

      it.skip('should fail when using progressive bookmarks', () => {
      });

      it.skip('should fail when the pager resolves a progressive bookmark', () => {
      });

      it.skip('should fail when the pager rejects a progressive bookmark', () => {
      });

      for (const { f: firstKind, s: secondKind } of [
        { f: 'absolute', s: 'relative' },
        { f: 'absolute', s: 'progressive' },
        { f: 'relative', s: 'absolute' },
        { f: 'relative', s: 'progressive' },
        // Another test already validates the use of progressive bookmarks. These tests focus on the transition between kinds.
      ] as {f: B.BookmarkKind, s: B.BookmarkKind}[]) {
        it(`should fail when the type of bookmark changes from ${firstKind} to ${secondKind} between pages`, async () => {
          const pager = vi.fn<[], Promise<Page<number>>>();
          const sut = useIndexableBinder(() => pager);

          const binder = sut.bind();

          pager.mockResolvedValueOnce({ bookmark: autoBookmarker(firstKind, 3)(0), value: [1, 2, 3], metadata: {} });
          await binder.next();

          pager.mockResolvedValueOnce({ bookmark: autoBookmarker(secondKind, 3)(1), value: [4, 5, 6], metadata: {} });
          await binder.next();

          const page1 = sut.pages.value[1];
          expect(page1?.status).toBe('error');
          expect(page1?.error).toBeInstanceOf(Error);
          expect((page1?.error as Error).message).toContain('Bookmark kind cannot change');
        });
      }
    });

    describe('Safeties', () => {
      describeEnumerablePagers(pagerKind => {
        it('should fail when reusing an expired adapter', () => {
          const sut = useIndexableBinder(() => autoPager(pagerKind, [[1, 2, 3]]));

          const binder = sut.bind();
          sut.bind();

          expect(() => binder.next()).toThrowError('Expired BinderAdapter.');
        });

        it.skip('should not load pages before the first page', () => {
        });

        it('should not load pages after the last page', async () => {
          const sut = useIndexableBinder(() => autoPager(pagerKind, [[1, 2, 3]]));

          const binder = sut.bind();
          await binder.next();
          binder.next();

          expect(sut.pages.value).toHaveLength(1);
        });

        it.skip('should not re-trigger while refreshing for the same page', () => {
        });

        it.skip('should not re-trigger while loading the same page', () => {
        });

        it('should not update when trigger resolves after rebind', async () => {
          const bookmarker = autoBookmarker(pagerKind, 3);
          const pager = vi.fn<[], Promise<Page<number>>>();
          const sut = useIndexableBinder(() => pager);

          const binder = sut.bind();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(0), value: [1, 2, 3], metadata: {} });
          await binder.next();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(1), value: [4, 5, 6], metadata: {} });
          const awaiter = binder.next();

          sut.bind();

          await awaiter;

          expect(sut.pages.value).toHaveLength(0);
        });

        it('should not update when trigger rejects after rebind', async () => {
          const bookmarker = autoBookmarker(pagerKind, 3);
          const pager = vi.fn<[], Promise<Page<number>>>();
          const sut = useIndexableBinder(() => pager);

          const binder = sut.bind();

          pager.mockResolvedValueOnce({ bookmark: bookmarker(0), value: [1, 2, 3], metadata: {} });
          await binder.next();

          pager.mockRejectedValueOnce({ bookmark: bookmarker(1), value: [4, 5, 6], metadata: {} });
          const awaiter = binder.next();

          sut.bind();

          await awaiter;

          expect(sut.pages.value).toHaveLength(0);
        });

        it.skip('should deduplicate overlapping bookmarks', () => {
        });
      });
    });
  });
});
