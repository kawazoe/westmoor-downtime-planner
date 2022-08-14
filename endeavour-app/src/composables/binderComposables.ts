import { computed, shallowRef } from 'vue';

import { nanoid } from 'nanoid';

import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';

import { _never } from '@/lib/_never';
import { _throw } from '@/lib/_throw';

import * as B from '@/stores/bookmarks';

function replaceAt<T>(array: T[], index: number, value: T): T[] {
  return O.getOrElseW(() => _throw(new Error('Index out of range')))(A.modifyAt(index, () => value)(array));
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type CacheKey = {};

export type Metadata = Record<string, unknown>;

export function defaultKeySelector<P extends unknown[]>(...args: P): CacheKey {
  return args[0] as CacheKey ?? nanoid(16);
}

export type Page<V, Meta extends Metadata = Metadata> = {
  bookmark: B.Bookmark,
  value: V[],
  metadata: {
    full?: true,
    last?: true,
  } & Meta,
};

export type AsyncPageStatus = 'loading' | 'content' | 'empty' | 'error' | 'refreshing' | 'retrying';
export type AsyncPage<V> = {
  status: AsyncPageStatus,
  key: symbol,
  bookmark: B.Bookmark | null,
  error: unknown,
  value: V[],
  metadata: {
    full?: true,
    last?: true,
  },
};

export type BinderComposableOptions<P extends unknown[], V, Meta extends Metadata = Metadata> = {
  keySelector?: (...args: P) => CacheKey,
  emptyPredicate?: (page: Page<V, Meta>) => boolean,
};

export function defaultEmptyPredicate(page: Page<unknown>): boolean {
  return page == null || page.bookmark == null || page.value.length === 0;
}

export type BinderStatus = 'initial' | 'nested' | 'error' | 'retrying';
export interface Binder<V, Meta extends Metadata = Metadata> {
  status: BinderStatus;
  cacheKey: CacheKey;
  pages: AsyncPage<V>[];
  error: unknown;
  metadata: {
    nullBookmark: B.Bookmark | null,
    nextBookmark: B.Bookmark | null,
  } & Meta;
}

type PageCursor<V> = { page: AsyncPage<V>, ind: number };
type UpdateContext<V, Meta extends Metadata> = {
  requestBookmark: B.Bookmark | null,
  effectiveBookmark: B.Bookmark,
  response: Page<V, Meta>,
  error?: unknown,
  targetPage: PageCursor<V>,
};
type NextFn<V, Meta extends Metadata> = (binder: Binder<V, Meta>) => Binder<V, Meta>;
type UpdateMiddleware<V, Meta extends Metadata> = (binder: Binder<V, Meta>, ctx: UpdateContext<V, Meta>, next: NextFn<V, Meta>) => Binder<V, Meta>;

export function useBinder<P extends unknown[], V, Meta extends Metadata = Metadata>(
  trigger: (...args: P) => (bookmark: B.Bookmark | null) => Promise<Page<V, Meta>>,
  options?: BinderComposableOptions<P, V, Meta>,
) {
  const state = shallowRef<Binder<V, Meta>>({
    status: 'initial',
    cacheKey: '' as CacheKey,
    pages: [],
    error: undefined,
    metadata: { nullBookmark: null, nextBookmark: null } as Binder<V, Meta>['metadata'],
  });

  function bind(...args: P) {
    const cacheKey = (options?.keySelector ?? defaultKeySelector)(...args);

    function cacheCheck<T>(match: () => T): T | undefined;
    function cacheCheck<T>(match: () => T, miss: () => T): T;
    function cacheCheck<T>(match: () => T, miss?: () => T): T | undefined {
      return state.value.cacheKey === cacheKey ? match() : miss ? miss() : undefined;
    }

    const assertValidBookmark = (bookmark: B.Bookmark): void => {
      if (!B.isAfterOrAt(0)(bookmark)) {
        throw new Error('Invalid bookmark. Bookmark attempts to index before first element.');
      }
    };
    const assertBookmarkKindTransition = (to: B.Bookmark | null | undefined): B.Bookmark => {
      const toKind = to?.kind;
      if (to == null || toKind == null) {
        throw new Error('Invalid bookmark. Bookmark kind is undetectable.');
      }

      assertValidBookmark(to);

      const fromKind = state.value.pages[0]?.bookmark?.kind ?? null;
      if (fromKind != null && fromKind !== toKind) {
        throw new Error('Invalid operation. Bookmark kind cannot change once assigned in a given binder.');
      }

      return to;
    };

    const isAfterEndOfRange = (pages: AsyncPage<V>[], bookmark: B.Bookmark): boolean => {
      const endOfRange = pages.find(p => p.metadata.last)?.bookmark;
      return endOfRange && B.isAfterOrAt(B.indexOf(endOfRange))(bookmark) || false;
    };

    const pickProcessingStatus = (): 'nested' | 'retrying' | null => cacheCheck<'nested' | 'retrying' | null>(
      () => {
        switch (state.value.status) {
          case 'initial':
          case 'nested':
            return 'nested';
          case 'error':
            return 'retrying';
          case 'retrying':
            console.info('[BinderComposable] [state transition] Batching concurrent trigger.');
            return null;
          default:
            return _never(state.value.status);
        }
      },
      () => 'nested',
    );

    /**
     * Prepare an AsyncPage for use by a given bookmark. Attempts to reuse existing pages when the bookmark matches.
     */
    const prepareCurrentPage = (binder: Binder<V, Meta>, bookmark: B.Bookmark | null) => {
      const createPage = (): AsyncPage<V> => ({
        status: 'loading',
        key: Symbol('AsyncPage'),
        bookmark,
        value: [],
        error: undefined,
        metadata: {},
      });

      return cacheCheck<{ binder: Binder<V, Meta>, currentPageKey: symbol }>(() => {
        const ind = binder.pages.findIndex(p => B.equals(p.bookmark, bookmark));
        if (ind >= 0) {
          const page = binder.pages[ind] ?? _throw(new Error('Invalid page index'));
          return {
            binder: {
              ...binder,
              status: 'nested',
              pages: replaceAt(binder.pages, ind, {
                ...(page),
                status: 'refreshing' as AsyncPageStatus,
              }),
              error: undefined,
            },
            currentPageKey: page.key,
          };
        }

        const newPage = createPage();
        return {
          binder: {
            ...binder,
            status: 'nested',
            pages: [...binder.pages, newPage],
            error: undefined,
          },
          currentPageKey: newPage.key,
        };
      }, () => {
        const newPage = createPage();
        return {
          binder: {
            ...binder,
            status: 'nested',
            cacheKey,
            pages: [newPage],
            error: undefined,
          },
          currentPageKey: newPage.key,
        };
      });
    };

    /**
     * Server replied with a bookmark for a page past the end of the data.
     * Give up current operation and cleanup.
     * TODO: Scan existing data and figure out if the cache is out of date.
     */
    const afterEndOfRangeMiddleware: UpdateMiddleware<V, Meta> = (binder, { effectiveBookmark, targetPage: { page } }, next) => {
      if (isAfterEndOfRange(binder.pages, effectiveBookmark)) {
        return {
          ...binder,
          pages: binder.pages.filter(p => p !== page),
        };
      }

      return next(binder);
    };

    /**
     * Server replied with a bookmark for a different page than requested; such as requests made without a bookmark.
     * Remove existing pages using the effective bookmark from the binder to avoid duplicates,
     * and reassign the current target page to that bookmark.
     */
    const pageRebookmarkingMiddleware: UpdateMiddleware<V, Meta> = (binder, { requestBookmark, effectiveBookmark }, next) => {
      if (!B.equals(requestBookmark, effectiveBookmark)) {
        return next({
          ...binder,
          pages: binder.pages.filter(p => !B.equals(p.bookmark, effectiveBookmark)),
        });
      }

      return next(binder);
    };

    /**
     * Binders are considered indexable when pages can be directly indexed by their bookmark.
     *
     * Bookmarks are stored ass is in pages.
     * Assumes that the first request made without a bookmark returns a default bookmark.
     */
    const indexableBinderMiddleware: UpdateMiddleware<V, Meta> = (binder, { requestBookmark, effectiveBookmark, targetPage: { page, ind } }, next) => next({
      ...binder,
      pages: replaceAt(binder.pages, ind, {
        ...page,
        bookmark: effectiveBookmark,
      }),
      metadata: {
        ...binder.metadata,
        nullBookmark: !requestBookmark && !binder.metadata.nullBookmark
          ? effectiveBookmark
          : binder.metadata.nullBookmark,
      },
    });

    /**
     * Binders are considered enumerable when pages are enumerated by following a chain of bookmark.
     *
     * Bookmarks from responses will be used to produce the next request.
     */
    const enumerableBinderMiddleware: UpdateMiddleware<V, Meta> = (binder, { effectiveBookmark, targetPage: { page, ind } }, next) => next({
      ...binder,
      pages: replaceAt(binder.pages, ind, {
        ...page,
        bookmark: binder.metadata.nextBookmark,
      }),
      metadata: {
        ...binder.metadata,
        nextBookmark: effectiveBookmark,
      },
    });

    /**
     * Update the current page and global metadata with the result of the request.
     */
    const responseMiddleware: UpdateMiddleware<V, Meta> = (binder, {  targetPage: { page, ind }, response, error }, next) => {
      const { full, last, ...meta } = response.metadata;

      return next({
        ...binder,
        pages: replaceAt(binder.pages, ind, {
          ...page,
          value: response.value,
          error,
          metadata: { full, last },
          status: error
            ? 'error'
            : (options?.emptyPredicate ?? defaultEmptyPredicate)(response)
              ? 'empty'
              : 'content',
        }),
        metadata: Object.keys(meta).length !== 0
          ? { ...binder.metadata, ...meta }
          : binder.metadata,
      });
    };

    const applyMiddlewares = (bookmark: B.Bookmark | null, currentPageKey: symbol, response: Page<V, Meta>, error?: unknown) => {
      const effectiveBookmark = assertBookmarkKindTransition(response.bookmark ?? bookmark);

      const ctxFactory = (binder: Binder<V, Meta>) => {
        // ind and page cannot be cached. Individual middlewares might modify the pages array and de-sync the values.
        // TODO: use properties and make a getter instead?
        const ind = binder.pages.findIndex(p => p.key === currentPageKey);
        const page = binder.pages[ind] ?? _throw(new Error('Invalid page index'));

        return {
          requestBookmark: bookmark,
          effectiveBookmark,
          response,
          error,
          targetPage: { page, ind },
        };
      };

      const middlewares = [
        afterEndOfRangeMiddleware,
        pageRebookmarkingMiddleware,
        effectiveBookmark.kind === 'progressive'
          ? enumerableBinderMiddleware
          : indexableBinderMiddleware,
        responseMiddleware,
      ];

      const chain = middlewares
        .reverse()
        .reduce(
          (next: NextFn<V, Meta>, cur) => binder => cur(binder, ctxFactory(binder), next),
          b => b,
        );

      return chain(state.value);
    };

    const accessor = trigger(...args);

    return (bookmark: B.Bookmark | null = state.value.metadata.nullBookmark) => {
      if (bookmark) {
        assertValidBookmark(bookmark);

        if (isAfterEndOfRange(state.value.pages, bookmark)) {
          return Promise.resolve();
        }
      }

      const processingStatus = pickProcessingStatus();
      if (!processingStatus) {
        return Promise.resolve();
      }

      const { binder, currentPageKey } = prepareCurrentPage(state.value, bookmark);
      state.value = binder;

      return accessor(bookmark)
        .then(response => cacheCheck(() => {
          state.value = applyMiddlewares(bookmark, currentPageKey, response);
        }))
        .catch((error: unknown) => cacheCheck(() => {
          const fakeResponse = {
            bookmark: (error as Page<V, Meta>)?.bookmark ?? bookmark ?? null,
            value: [],
            metadata: {} as Meta,
          };

          state.value = applyMiddlewares(bookmark, currentPageKey, fakeResponse, error);
        }))
        .catch((error: unknown) => {
          state.value = {
            ...state.value,
            status: 'error',
            pages: [],
            error,
          };
        });
    };
  }

  return {
    state,
    status: computed(() => state.value.status),
    pages: computed(() => state.value.pages),
    error: computed(() => state.value.error),
    metadata: computed(() => state.value.metadata),
    bind,
  };
}
