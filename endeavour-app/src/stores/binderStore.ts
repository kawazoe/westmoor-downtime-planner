import { reactive, toRaw } from 'vue';
import type { UnwrapNestedRefs } from 'vue';

import { acceptHMRUpdate, defineStore } from 'pinia';
import type { StoreDefinition } from 'pinia';

import { nanoid } from 'nanoid';

import { _never } from '@/lib/_never';

import * as B from '@/stores/bookmarks';

// eslint-disable-next-line @typescript-eslint/ban-types
export type CacheKey = {};

export type Metadata = Record<string, unknown>;

export function defaultKeySelector<P extends unknown[]>(...args: P): CacheKey {
  // HACK: Temporary workaround since objects aren't stable in pinia: https://github.com/vuejs/pinia/discussions/1146
  return args[0] as CacheKey ?? /* {} */ nanoid(16);
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

export type BinderStoreOptions<P extends unknown[], V, Meta extends Metadata = Metadata> = {
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

export type BinderStoreDefinition<P extends unknown[], V, Meta extends Metadata = Metadata> = StoreDefinition<string, Binder<V, Meta>, Record<string, never>, { bind: (...args: P) => (bookmark?: B.Bookmark) => Promise<void> }>;
export type BinderStore<P extends unknown[], V, Meta extends Metadata = Metadata> = ReturnType<BinderStoreDefinition<P, V, Meta>>;
export function defineBinderStore<P extends unknown[], V, Meta extends Metadata = Metadata>(
  id: string,
  trigger: (...args: P) => (bookmark?: B.Bookmark) => Promise<Page<V, Meta>>,
  options?: BinderStoreOptions<P, V, Meta>,
): BinderStoreDefinition<P, V, Meta> {
  const useStore = defineStore({
    id,
    state: () => ({
      status: 'initial',
      cacheKey: {},
      pages: [],
      error: undefined,
      metadata: { nullBookmark: null, nextBookmark: null } as Binder<V, Meta>['metadata'],
    } as Binder<V, Meta>),
    actions: {
      bind(...args: P) {
        const cacheKey = (options?.keySelector ?? defaultKeySelector)(...args);
        // TODO: Test cacheKey with markRaw instead of toRaw
        const cacheCheck = (match: () => void, miss?: () => void): void => (toRaw(this.cacheKey) === cacheKey ? match() : miss ? miss() : undefined);

        const getBookmarkKind = (): B.BookmarkKind | null => this.pages[0]?.bookmark?.kind ?? null;
        const isAfterLastPage = (bookmark: B.Bookmark): boolean => {
          const lastBookmark = this.pages.find(p => p.metadata.last)?.bookmark;
          return lastBookmark && B.isAfterOrAt(bookmark, B.indexOf(lastBookmark)) || false;
        };
        const pageWithBookmark = (bookmark: B.Bookmark | null) => (p: UnwrapNestedRefs<AsyncPage<V>>) => B.equals(p.bookmark, bookmark ?? this.metadata.nullBookmark);
        const assertValidBookmark = (bookmark: B.Bookmark): void => {
          if (!B.isAfterOrAt(bookmark, 0)) {
            throw new Error('Invalid bookmark. Bookmark attempts to index before first element.');
          }
        };
        const assertBookmarkKindTransition = (to: B.Bookmark | null | undefined): void => {
          const toKind = to?.kind;
          if (to == null || toKind == null) {
            throw new Error('Invalid bookmark. Bookmark kind is undetectable.');
          }

          assertValidBookmark(to);

          const fromKind = getBookmarkKind();
          if (fromKind != null && fromKind !== toKind) {
            throw new Error('Invalid operation. Bookmark kind cannot change once assigned in a given binder.');
          }
        };
        const pickProcessingStatus = (): 'nested' | 'retrying' | null => {
          if (toRaw(this.cacheKey) !== cacheKey) {
            return 'nested';
          }

          switch (this.status) {
            case 'initial':
            case 'nested':
              return 'nested';
            case 'error':
              return 'retrying';
            case 'retrying':
              console.info(`[AsyncValueAction] [trigger] Batching ${id} concurrent trigger.`);
              return null;
            default:
              return _never(this.status);
          }
        };
        const createPage = (bookmark?: B.Bookmark): UnwrapNestedRefs<AsyncPage<V>> => reactive({
          status: 'loading',
          key: Symbol('AsyncPage'),
          bookmark: bookmark ?? this.metadata.nullBookmark,
          value: [],
          error: undefined,
          metadata: {},
        } as AsyncPage<V>);
        const removePage = (predicate: (p: UnwrapNestedRefs<AsyncPage<V>>) => boolean): void => {
          const currentPageIndex = this.pages.findIndex(predicate);
          if (currentPageIndex >= 0) {
            this.pages.splice(currentPageIndex, 1);
          }
        };

        const accessor = trigger(...args);

        return (bookmark?: B.Bookmark) => {
          if (bookmark) {
            assertValidBookmark(bookmark);
          }

          if (this.metadata.nullBookmark && isAfterLastPage(bookmark ?? this.metadata.nullBookmark)) {
            return Promise.resolve();
          }

          const processingStatus = pickProcessingStatus();
          if (!processingStatus) {
            return Promise.resolve();
          }

          let currentPage: UnwrapNestedRefs<AsyncPage<V>>;
          cacheCheck(() => {
            const existingPage = this.pages.find(pageWithBookmark(bookmark ?? null));

            if (existingPage) {
              currentPage = existingPage;
              this.$patch(() => {
                currentPage.status = 'refreshing';
                this.error = undefined;
                this.status = 'nested';
              });
            } else {
              currentPage = createPage(bookmark);
              this.$patch(() => {
                this.pages.push(currentPage);
                this.error = undefined;
                this.status = 'nested';
              });
            }
          }, () => {
            currentPage = createPage(bookmark);

            this.$patch(() => {
              this.cacheKey = cacheKey;
              this.pages = [currentPage];
              this.error = undefined;
              this.status = 'nested';
            });
          });
          const updateCurrentPage = (effectiveBookmark: B.Bookmark, page: Page<V, Meta>, error?: unknown): void => {
            if (effectiveBookmark.kind === 'progressive') {
              // Progressive bookmarks represents the next page.
              // We use the previous bookmark for this page...
              currentPage.bookmark = this.metadata.nextBookmark;

              // ...and stores the current one for the next call.
              this.metadata.nextBookmark = effectiveBookmark;
            } else {
              // Other bookmarks represents the current page.
              // We store the current one for this page...
              currentPage.bookmark = effectiveBookmark;

              // ...and assume the first one as "zeroth" page when previously unknown.
              if (this.metadata.nullBookmark == null) {
                this.metadata.nullBookmark = effectiveBookmark;
              }
            }

            const { full, last, ...meta } = page.metadata;

            currentPage.value = reactive(page.value);
            currentPage.error = error;
            currentPage.metadata = { full, last };
            currentPage.status = error
              ? 'error'
              : (options?.emptyPredicate ?? defaultEmptyPredicate)(page)
                ? 'empty'
                : 'content';

            // Extract and update global metadata
            if (Object.keys(meta).length !== 0) {
              this.metadata = { ...this.metadata, ...meta };
            }
          };

          return accessor(bookmark)
            .then(page => cacheCheck(() => {
              const effectiveBookmark = page.bookmark ?? bookmark;
              assertBookmarkKindTransition(effectiveBookmark);

              this.$patch(() => {
                if (isAfterLastPage(effectiveBookmark)){
                  // Server replied with a bookmark for a page past the end of the data.
                  // Give up current operation and cleanup.
                  removePage(p => p.key === currentPage.key);
                  return;
                }

                if (!pageWithBookmark(effectiveBookmark)(currentPage)) {
                  // Server replied with a bookmark for a different page than expected.
                  // Assume currentPage as the new source of truth for that page.
                  removePage(pageWithBookmark(effectiveBookmark));
                }

                updateCurrentPage(effectiveBookmark, page);
              });
            }))
            .catch((error: unknown) => cacheCheck(() => {
              const effectiveBookmark = (error as Page<V>).bookmark ?? bookmark;
              assertBookmarkKindTransition(effectiveBookmark);

              this.$patch(() => {
                const errorPage = { bookmark: effectiveBookmark, value: [], metadata: {} as Meta };
                updateCurrentPage(effectiveBookmark, errorPage, error);
              });
            }))
            .catch((error: unknown) => this.$patch(() => {
              this.pages = [];
              this.error = error;
              this.status = 'error';
            }));
        };
      },
    },
  });

  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
  }

  return useStore;
}
