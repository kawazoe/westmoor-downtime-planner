import { beforeEach, describe, expect, it, vi } from 'vitest';

import { _throw } from '@/lib/_throw';
import type { Bookmark } from '@/lib/bookmarks';

import { stall } from '../lib/mockPromise';

import type { Metadata, Page } from '@/composables/binders';
import { useEnumerableBinder, useIndexableBinder } from '@/composables/binders';

function makePage<V, Meta extends Metadata>(defaultBookmark: Bookmark) {
  return (source: Partial<Page<V, Meta>>) => {
    const { full, last, ...rest } = source.metadata ?? {};
    return {
      bookmark: source.bookmark ?? defaultBookmark,
      value: source.value,
      metadata: {
        full: full || source.value?.length === 3 || undefined,
        last: last || undefined,
        ...rest as Meta,
      },
    } as Page<V, Meta>;
  };
}

const makeAbsolute = makePage({ kind: 'absolute', offset: 0, limit: 3 });
const makeRelative = makePage({ kind: 'relative', page: 0, pageSize: 3 });
const makeProgressive = makePage({ kind: 'progressive', token: 'mock' });

const mockEmptyPredicate = vi.fn(v => Array.isArray(v.value) && v.value[0] === 'success');

function describeBinders(callback: (binderFn: typeof useEnumerableBinder | typeof useIndexableBinder) => void) {
  const wrapper: typeof callback = binderFn => describe(binderFn.name, () => callback(binderFn));

  wrapper(useEnumerableBinder);
  wrapper(useIndexableBinder);
}

function describeEnumerablePagers(callback: (pagerFn: ReturnType<typeof makePage>) => void) {
  const wrapper: typeof callback = pagerFn => describe(`${pagerFn({}).bookmark.kind}`, () => callback(pagerFn));

  wrapper(makeAbsolute);
  wrapper(makeRelative);
  wrapper(makeProgressive);
}

function describeIndexablePagers(callback: (pagerFn: ReturnType<typeof makePage>) => void) {
  const wrapper: typeof callback = pagerFn => describe(`${pagerFn({}).bookmark.kind}`, () => callback(pagerFn));

  wrapper(makeAbsolute);
  wrapper(makeRelative);
}

function describeValidSetups(callback: (binderFn: typeof useEnumerableBinder | typeof useIndexableBinder, pagerFn: ReturnType<typeof makePage>) => void) {
  const wrapper: typeof callback = (binderFn, pagerFn) => describe(`${pagerFn({}).bookmark.kind}`, () => callback(binderFn, pagerFn));

  describe(useEnumerableBinder.name, () => {
    wrapper(useEnumerableBinder, makeAbsolute);
    wrapper(useEnumerableBinder, makeRelative);
    wrapper(useEnumerableBinder, makeProgressive);
  });

  describe(useEnumerableBinder.name, () => {
    wrapper(useIndexableBinder, makeAbsolute);
    wrapper(useIndexableBinder, makeRelative);
    // While it is possible to emulate a progressive pager from an indexable source,
    // it is not possible to have an indexable binder with a progressive source.
  });
}

describe('Binder Composable', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('State machine (base states)', () => {
    describeBinders(binderFn => {
      it('should be created in a neutral state', () => {
        const pager = vi.fn(async () => stall<Page<unknown>>());
        const trigger = vi.fn(() => pager);
        const sut = binderFn(trigger);

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
        const sut = binderFn(trigger);

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
        const sut = binderFn(trigger);

        sut.bind().next();

        expect(trigger).toHaveBeenCalled();
        expect(pager).toHaveBeenCalled();

        expect(sut.status.value).toBe('nested');
        expect(sut.error.value).toBeUndefined();

        const page = sut.pages.value[0];

        expect(sut.currentPage.value).toBe(sut.pages.value[0]);

        expect(page?.status).toBe('loading');
        expect(page?.key).toBeTruthy();
        expect(page?.bookmark).toBeNull();
        expect(page?.value).toEqual([]);
        expect(page?.error).toBeUndefined();
      });

      describe('Caching', () => {
        it('should set a cache key on bind', () => {
          const sut = binderFn(() => async () => stall<Page<unknown>>());

          const previousKey = sut.state.value.cacheKey;
          sut.bind();

          expect(sut.state.value.cacheKey).not.toBe(previousKey);
        });
      });
    });

    describeValidSetups((binderFn, pagerFn) => {
      it('should enter a nested content state while waiting after the trigger', async () => {
        const sut = binderFn(() => async () => pagerFn({ value: [1, 2, 3] }));

        await sut.bind().next();

        expect(sut.status.value).toBe('nested');
        expect(sut.error.value).toBeUndefined();

        const page = sut.pages.value[0];

        expect(page?.status).toBe('content');
        expect(page?.value).toStrictEqual([1, 2, 3]);
        expect(page?.error).toBeUndefined();
      });

      describe('Default empty predicate', () => {
        for (const emptyValue of [undefined, []]) {
          it(`should enter an empty state when the trigger returns "${JSON.stringify(emptyValue)}"`, async () => {
            const sut = binderFn(() => async () => pagerFn({ value: emptyValue }));

            await sut.bind().next();

            expect(sut.status.value).toBe('nested');
            expect(sut.error.value).toBeUndefined();

            const page = sut.pages.value[0];

            expect(page?.status).toBe('empty');
            expect(page?.value).toStrictEqual(emptyValue);
            expect(page?.error).toBeUndefined();
          });
        }
      });

      it('should enter a nested empty state when the content matches the empty predicate', async () => {
        const sut = binderFn(
          () => async () => pagerFn({ value: ['success'] }),
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
        const sut = binderFn(() => async () => ({ value: [] } as unknown as Page<unknown>));

        await sut.bind().next();

        expect(sut.status.value).toBe('error');
        expect(sut.pages.value).toStrictEqual([]);
        expect(sut.error.value).toBeInstanceOf(Error);
        expect((sut.error.value as Error).message).toEqual('Invalid bookmark. Bookmark kind is undetectable.');
      });

      it('should enter a nested error state when the pager throws a bookmarked error', async () => {
        const error = pagerFn({});
        const sut = binderFn(() => async () => _throw(error));

        await sut.bind().next();

        expect(sut.status.value).toBe('nested');
        expect(sut.error.value).toBeUndefined();

        const page = sut.pages.value[0];

        expect(page?.status).toBe('error');
        expect(page?.value).toStrictEqual([]);
        expect(page?.error).toBe(error);
      });

      it('should enter an error state when the pager throws a generic error', async () => {
        const sut = binderFn(() => async () => _throw('failure'));

        await sut.bind().next();

        expect(sut.status.value).toBe('error');
        expect(sut.pages.value).toStrictEqual([]);
        expect(sut.error.value).toEqual('failure');
      });
    });
  });

  describe('Caching', () => {
    describeValidSetups((binderFn, pagerFn) => {
      it('should not change the cache key on resolve', async () => {
        const sut = binderFn(() => async () => pagerFn({ value: [1, 2, 3] }));

        const binder = sut.bind();
        const previousKey = sut.state.value.cacheKey;

        await binder.next();

        expect(sut.state.value.cacheKey).toBe(previousKey);
      });

      it('should not change the cache key on reject', async () => {
        const sut = binderFn(() => async () => _throw(pagerFn({})));

        const binder = sut.bind();
        const previousKey = sut.state.value.cacheKey;

        await binder.next();

        expect(sut.state.value.cacheKey).toBe(previousKey);
      });

      it('should clear the cache on re-bind when key changes', async () => {
        const sut = binderFn(() => async () => pagerFn({ value: [1, 2, 3] }));

        await sut.bind().next();
        const previousKey = sut.state.value.cacheKey;
        sut.bind();

        expect(sut.state.value.cacheKey).not.toBe(previousKey);
        expect(sut.status.value).toBe('initial');
        expect(sut.pages.value).toEqual([]);
        expect(sut.error.value).toBeUndefined();
      });

      it('should use first param as cache key if available by default', async () => {
        const sut = binderFn((arg1: string) => async () => pagerFn({ value: [arg1] }));

        await sut.bind('key');

        expect(sut.state.value.cacheKey).toBe('key');
      });
    });
  });

  describe('useEnumerableBinder', () => {
    describe('State machine (advanced states)', () => {
      describeEnumerablePagers(pagerFn => {
        it('should create a new page as loading on next', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should enter a refreshing state for the page associated to the provided index on refresh', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should keep the currentPage as the furthest page', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should maintain the order of pages to keep them in continuation order', () => {
          expect(true, 'TODO').toBe(false);
        });
      });
    });

    describe('Safeties', () => {
      describeEnumerablePagers(pagerFn => {
        it('should fail when reusing an expired adapter', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should not load pages past the last page', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should not load pages if there is no next bookmark', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should revert the currently loading page if the results are empty', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should not re-trigger while refreshing for the same page', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should not have more than 1 loading page in flight', () => {
          // parallel refresh + attempt parallel loading
          expect(true, 'TODO').toBe(false);
        });

        it('should not update when trigger resolves after rebind', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should not update when trigger rejects after rebind', () => {
          expect(true, 'TODO').toBe(false);
        });
      });
    });
  });

  describe('useIndexableBinder', () => {
    describe('State machine (advanced states)', () => {
      describeIndexablePagers(pagerFn => {
        it('should create a new page as loading with the next unloaded bookmark on next', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should create a new page as loading with the previous unloaded bookmark on previous', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should create a new page as loading for the page matching the provided bookmark on load', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should create a new page as loading for the page matching the provided bookmark and mark it as current on open', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should enter a refreshing state for the page associated to the provided index on refresh', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should enter a refreshing state for the page matching the provided bookmark on load', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should maintain the order of pages to keep them in bookmark order', () => {
          expect(true, 'TODO').toBe(false);
        });
      });
    });

    describe('Safeties', () => {
      describeEnumerablePagers(pagerFn => {
        it('should fail when reusing an expired adapter', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should not load pages before the first page', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should not load pages after the last page', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should keep empty pages', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should not re-trigger while refreshing for the same page', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should not re-trigger while loading the same page', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should not update when trigger resolves after rebind', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should not update when trigger rejects after rebind', () => {
          expect(true, 'TODO').toBe(false);
        });

        it('should deduplicate overlapping bookmarks', () => {
          expect(true, 'TODO').toBe(false);
        });
      });
    });
  });
});
