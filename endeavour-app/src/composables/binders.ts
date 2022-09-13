import { computed, ref, shallowRef } from 'vue';

import { nanoid } from 'nanoid';

import { _never } from '@/lib/_never';
import { _throw } from '@/lib/_throw';

import * as B from '@/lib/bookmarks';

function insertAt<T>(array: T[], index: number, value: T): T[] {
  const result = [...array];
  result.splice(index, 0, value);
  return result;
}
function replaceAt<T>(array: T[], index: number, value: T): T[] {
  const result = [...array];
  result.splice(index, 1, value);
  return result;
}
function removeAt<T>(array: T[], index: number): T[] {
  const result = [...array];
  result.splice(index, 1);
  return result;
}

function isAfterEndOfRange<V>(pages: AsyncPage<V>[], bookmark: B.Bookmark): boolean {
  const endOfRange = pages.find(p => p.metadata.last)?.bookmark;
  return endOfRange === null //< Last page is known; but has null (first page) bookmark. This can only happen with progressive bookmarks.
    || (endOfRange && B.isAfterOrAt(B.indexOf(endOfRange))(bookmark)) //< Last page is known. Compare bookmarks together.
    || false; //< Last page is unknown. Cannot verify if the bookmark is after last page.
}

function findAssumedBookmarkIndex<V>(pages: AsyncPage<V>[], bookmark: B.Bookmark | null): number {
  if (!bookmark) {
    return 0;
  }

  const bookmarkIndex = B.indexOf(bookmark);
  const pageIndex = pages
    .findIndex(p => (p.bookmark == null ? 0 : B.indexOf(p.bookmark)) >= bookmarkIndex);
  return pageIndex === -1
    ? pages.length
    : pageIndex;
}

function assertValidBookmark(bookmark: B.Bookmark): void {
  if (!B.isAfterOrAt(0)(bookmark)) {
    throw new Error('Invalid bookmark. Bookmark attempts to index before first element.');
  }
}

function assertBookmarkKindTransition(to: B.Bookmark | null | undefined, from: B.Bookmark | null): B.Bookmark {
  const toKind = to?.kind;
  if (to == null || toKind == null) {
    throw new Error('Invalid bookmark. Bookmark kind is undetectable.');
  }

  assertValidBookmark(to);

  const fromKind = from?.kind;
  if (fromKind != null && fromKind !== toKind) {
    throw new Error('Invalid operation. Bookmark kind cannot change once assigned in a given binder.');
  }

  return to;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type CacheKey = {};

export type Metadata = Record<string, unknown>;

export function defaultKeySelector<P extends unknown[]>(...args: P): CacheKey {
  return args[0] as CacheKey ?? nanoid(16);
}

export type Page<V, Meta extends Metadata = Metadata> = {
  bookmark: B.Bookmark,
  value: V[] | null | undefined,
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
  return page == null || page.bookmark == null || page.value == null || page.value.length === 0;
}

export type BinderStatus = 'initial' | 'nested' | 'error' | 'retrying';
export interface BinderState<V, Meta extends Metadata = Metadata> {
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
type NextFn<V, Meta extends Metadata> = (binder: BinderState<V, Meta>) => BinderState<V, Meta>;
type UpdateMiddleware<V, Meta extends Metadata> = (binder: BinderState<V, Meta>, ctx: UpdateContext<V, Meta>, next: NextFn<V, Meta>) => BinderState<V, Meta>;
type UpdateMiddlewareFn = <V, Meta extends Metadata>(binder: BinderState<V, Meta>, ctx: UpdateContext<V, Meta>, next: NextFn<V, Meta>) => BinderState<V, Meta>;

function useBinderFactory<P extends unknown[], V, Meta extends Metadata = Metadata>(
  trigger: (...args: P) => (bookmark: B.Bookmark | null) => Promise<Page<V, Meta>>,
  options?: BinderComposableOptions<P, V, Meta>,
) {
  function createBinder(): BinderState<V, Meta> {
    return {
      status: 'initial',
      cacheKey: '' as CacheKey,
      pages: [],
      error: undefined,
      metadata: { nullBookmark: null, nextBookmark: null } as BinderState<V, Meta>['metadata'],
    };
  }
  function createPage(bookmark: B.Bookmark | null): AsyncPage<V> {
    return {
      status: 'loading',
      key: Symbol('AsyncPage'),
      bookmark,
      value: [],
      error: undefined,
      metadata: {},
    };
  }

  const state = shallowRef(createBinder());

  function bindThen(...args: P) {
    const cacheKey = (options?.keySelector ?? defaultKeySelector)(...args);

    function prepareCurrentPage(
      binder: BinderState<V, Meta>,
      bookmark: B.Bookmark | null,
    ): { binder: BinderState<V, Meta>, currentPageKey: symbol } |
      { binder: undefined, currentPageKey: undefined } {
      if (binder.cacheKey !== cacheKey) {
        throw new Error('Expired BinderAdapter.');
      }
      switch (binder.status) {
        case 'initial':
        case 'nested': {
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

          const newPage = createPage(bookmark);
          return {
            binder: {
              ...binder,
              status: 'nested',
              pages: bookmark?.kind === 'progressive' ?
                [...binder.pages, newPage]
                : insertAt(binder.pages, findAssumedBookmarkIndex(binder.pages, bookmark), newPage),
              error: undefined,
            },
            currentPageKey: newPage.key,
          };
        }
        case 'error': {
          const newPage = createPage(bookmark);
          return {
            binder: {
              ...binder,
              status: 'retrying',
              pages: [newPage],
              error: undefined,
            },
            currentPageKey: newPage.key,
          };
        }
        case 'retrying':
          return { binder: undefined, currentPageKey: undefined };
        default:
          return _never(binder.status);
      }
    }

    function action(
      bookmark: B.Bookmark | null,
      then: (
        bookmark: B.Bookmark | null,
        currentPageKey: symbol,
        response: Page<V, Meta>,
        error?: unknown
      ) => BinderState<V, Meta>,
    ) {
      if (bookmark) {
        assertValidBookmark(bookmark);

        if (isAfterEndOfRange(state.value.pages, bookmark)) {
          console.info('[BinderComposable] [safety] Prevented loading a page past end of range.');
          return Promise.resolve();
        }
      }

      const { binder, currentPageKey } = prepareCurrentPage(state.value, bookmark);
      if (!binder) {
        console.info('[BinderComposable] [safety] Prevented concurrent requests.');
        return Promise.resolve();
      }
      state.value = binder;

      return accessor(bookmark)
        .then(response => (state.value.cacheKey === cacheKey
          ? state.value = then(bookmark, currentPageKey, response)
          : console.info('[BinderComposable] [safety] Prevented mutating obsolete data (on resolve).')
        ))
        .catch((error: unknown) => {
          if (state.value.cacheKey === cacheKey) {
            const errorBookmark = (error as Page<V, Meta>)?.bookmark ?? bookmark ?? null;
            if (!errorBookmark) {
              return Promise.reject(error);
            }

            state.value = then(
              bookmark,
              currentPageKey,
              {
                bookmark: errorBookmark,
                value: [],
                metadata: {} as Meta,
              },
              error,
            );
            return Promise.resolve();
          }

          console.info('[BinderComposable] [safety] Prevented mutating obsolete data (on reject).');
          return Promise.resolve();
        })
        .catch((error: unknown) => {
          state.value = {
            ...state.value,
            status: 'error',
            pages: [],
            error,
          };
        });
    }

    state.value = {
      ...createBinder(),
      cacheKey,
    };

    const accessor = trigger(...args);

    return action;
  }

  return {
    state,
    status: computed(() => state.value.status),
    pages: computed(() => state.value.pages),
    error: computed(() => state.value.error),
    metadata: computed(() => state.value.metadata),
    bindThen,
  };
}

/**
 * Server replied with a bookmark for a page past the end of the data.
 * Give up current operation and cleanup.
 */
const afterEndOfRangeMiddleware: UpdateMiddlewareFn = (binder, {
  effectiveBookmark,
  targetPage: { page },
}, next) => {
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
 * and reorder pages to ensure they match their position.
 */
const pageRebookmarkingMiddleware: UpdateMiddlewareFn = (binder, {
  requestBookmark,
  effectiveBookmark,
  targetPage,
}, next) => {
  // Does not apply to progressive bookmarks since the response will always be one bookmark ahead of the request.
  if (effectiveBookmark.kind === 'progressive') {
    return next(binder);
  }

  if (B.equals(requestBookmark, effectiveBookmark)) {
    return next(binder);
  }

  const pages = removeAt(binder.pages, targetPage.ind)
    .filter(p => !B.equals(p.bookmark, effectiveBookmark));

  return next({
    ...binder,
    pages: insertAt(pages, findAssumedBookmarkIndex(pages, effectiveBookmark), targetPage.page),
  });
};

/**
 * Binders are considered progressive when pages are enumerated by following a chain of bookmark.
 *
 * Bookmarks from responses will be used to produce the next request.
 */
const progressiveBookmarkBinderMiddleware: UpdateMiddlewareFn = (binder, {
  effectiveBookmark,
  targetPage: { page, ind },
}, next) => next({
  ...binder,
  pages: replaceAt(binder.pages, ind, {
    ...page,
    bookmark: binder.metadata.nextBookmark,
    metadata: B.isAtInfinity(effectiveBookmark)
      ? {
        ...page.metadata,
        last: true,
      }
      : page.metadata,
  }),
  metadata: {
    ...binder.metadata,
    nextBookmark: effectiveBookmark,
  },
});

/**
 * Binders are considered addressed when pages can be directly indexed by their bookmark.
 *
 * Bookmarks are stored as is in pages.
 * Assumes that the first request made without a bookmark returns a default bookmark.
 */
const addressedBookmarkBinderMiddleware: UpdateMiddlewareFn = (binder, {
  requestBookmark,
  effectiveBookmark,
  targetPage: { page, ind },
}, next) => next({
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
 * Enumerable binders uses either progressive bookmarks or emulates progressive bookmarks on top of addressed bookmarks.
 */
const enumerableBinderMiddleware: UpdateMiddlewareFn = (binder, ctx, next) => (
  ctx.effectiveBookmark.kind === 'progressive'
    ? progressiveBookmarkBinderMiddleware(binder, ctx, next)
    : addressedBookmarkBinderMiddleware(binder, ctx, next)
);

/**
 * Indexable binders uses addressable bookmarks only.
 */
const indexableBinderMiddleware: UpdateMiddlewareFn = (binder, ctx, next) => (
  ctx.effectiveBookmark.kind === 'progressive'
    ? _throw(new Error('Unsupported operation. Cannot index a progressive bookmark.'))
    : addressedBookmarkBinderMiddleware(binder, ctx, next)
);

/**
 * Update the current page and global metadata with the result of the request.
 */
const responseMiddleware = <P extends unknown[], V, Meta extends Metadata>(
  options: BinderComposableOptions<P, V, Meta> | undefined,
): UpdateMiddleware<V, Meta> => (binder, { targetPage: { page, ind }, response, error }, next) => {
  const { full, last, ...meta } = response.metadata;

  return next({
    ...binder,
    pages: replaceAt(binder.pages, ind, {
      ...page,
      value: response.value ?? [],
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

function chainMiddlewares<V, Meta extends Metadata>(
  middlewares: UpdateMiddleware<V, Meta>[],
  bookmark: B.Bookmark | null,
  currentPageKey: symbol,
  response: Page<V, Meta>,
  error?: unknown,
) {
  const ctxFactory = (binder: BinderState<V, Meta>) => {
    const effectiveBookmark = assertBookmarkKindTransition(
      response.bookmark ?? bookmark,
      binder.pages[0]?.bookmark ?? null,
    );

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

  return [...middlewares]
    .reverse()
    .reduce(
      (next: NextFn<V, Meta>, cur) => binder => cur(binder, ctxFactory(binder), next),
      b => b,
    );
}


export type EnumerableBinderAdapter<P extends unknown[], V, Meta extends Metadata = Metadata> = ReturnType<typeof useEnumerableBinder<P, V, Meta>>;
export function useEnumerableBinder<P extends unknown[], V, Meta extends Metadata = Metadata>(
  trigger: (...args: P) => (bookmark: B.Bookmark | null) => Promise<Page<V, Meta>>,
  options?: BinderComposableOptions<P, V, Meta>,
) {
  const { state, bindThen, ...rest } = useBinderFactory(trigger, options);

  const middlewares = [
    afterEndOfRangeMiddleware,
    pageRebookmarkingMiddleware,
    enumerableBinderMiddleware,
    responseMiddleware(options),
  ];

  const currentPage = computed(() => state.value.pages[state.value.pages.length - 1] ?? null);

  function computeNewBookmark(): B.Bookmark | null {
    const currentBookmark = currentPage.value?.bookmark ?? state.value.metadata.nextBookmark;
    switch (currentBookmark?.kind) {
      case undefined:
      case null:
        return null;
      case 'absolute':
        return { kind: 'absolute', offset: currentBookmark.offset + currentBookmark.limit, limit: currentBookmark.limit };
      case 'relative':
        return { kind: 'relative', page: currentBookmark.page + 1, pageSize: currentBookmark.pageSize };
      case 'progressive':
        return state.value.metadata.nextBookmark;
      default:
        return _never(currentBookmark);
    }
  }

  return {
    state,
    ...rest,
    currentPage,
    bind(...args: P) {
      const action = bindThen(...args);

      const load = (bookmark: B.Bookmark | null) => action(bookmark, (...ctx) => chainMiddlewares<V, Meta>(middlewares, ...ctx)(state.value));
      const next = () => load(computeNewBookmark());
      return { next };
    },
  };
}

export type IndexableBinderAdapter<P extends unknown[], V, Meta extends Metadata = Metadata> = ReturnType<typeof useIndexableBinder<P, V, Meta>>;
export function useIndexableBinder<P extends unknown[], V, Meta extends Metadata = Metadata>(
  trigger: (...args: P) => (bookmark: B.Bookmark | null) => Promise<Page<V, Meta>>,
  options?: BinderComposableOptions<P, V, Meta>,
) {
  const { state, bindThen, ...rest } = useBinderFactory(trigger, options);

  const middlewares = [
    afterEndOfRangeMiddleware,
    pageRebookmarkingMiddleware,
    indexableBinderMiddleware,
    responseMiddleware(options),
  ];

  const currentPageKey = ref<symbol | null>(null);
  const currentPage = computed(() => state.value.pages.find(p => p.key === currentPageKey.value) ?? null);

  function computeNewBookmark(op: (left: number, right: number) => number): B.Bookmark | null {
    const currentBookmark = currentPage.value?.bookmark;
    switch (currentBookmark?.kind) {
      case undefined:
      case null:
        return null;
      case 'absolute':
        return { kind: 'absolute', offset: op(currentBookmark.offset, currentBookmark.limit), limit: currentBookmark.limit };
      case 'relative':
        return { kind: 'relative', page: op(currentBookmark.page, 1), pageSize: currentBookmark.pageSize };
      case 'progressive':
        return _throw(new Error('Unsupported operation. Cannot index a progressive bookmark.'));
      default:
        return _never(currentBookmark);
    }
  }

  return {
    state,
    ...rest,
    currentPage,
    bind(...args: P) {
      const action = bindThen(...args);

      const bookmarkOrDefault = (bookmark: B.Bookmark | null) => bookmark ?? state.value.metadata.nullBookmark;

      const load = (bookmark: B.Bookmark | null) => action(bookmark, (...ctx) => chainMiddlewares<V, Meta>(middlewares, ...ctx)(state.value));
      const open = (bookmark: B.Bookmark | null) => {
        const loader = load(bookmark);

        currentPageKey.value = state.value.pages.find(p => B.equals(p.bookmark, bookmark))?.key ?? null;

        return loader;
      };
      const loadOrDefault = (bookmark: B.Bookmark | null) => load(bookmarkOrDefault(bookmark));
      const openOrDefault = (bookmark: B.Bookmark | null) => open(bookmarkOrDefault(bookmark));
      const previous = () => openOrDefault(computeNewBookmark((l, r) => l - r));
      const next = () => openOrDefault(computeNewBookmark((l, r) => l + r));
      const refresh = (index: number) => {
        const bookmark = state.value.pages[index]?.bookmark;
        return bookmark ? load(bookmark) : Promise.resolve();
      };
      return {
        load: loadOrDefault,
        open: openOrDefault,
        previous,
        next,
        refresh,
      };
    },
  };
}
