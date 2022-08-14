import { computed, reactive } from 'vue';
import type { ComputedRef, UnwrapNestedRefs } from 'vue';

import type { Pinia, StoreGeneric } from 'pinia';

import { _never } from '@/lib/_never';

import type { AsyncPage, Metadata } from '@/composables/binders';
import type { BinderStore, BinderStoreDefinition } from '@/stores/binderStore';

export interface ProgressiveBinder<P extends unknown[], V, Meta extends Metadata = Metadata> {
  store: BinderStore<P, V, Meta>;
  currentPage: ComputedRef<AsyncPage<V> | undefined>;
  trigger: () => Promise<void>;
}
export function useProgressiveBinder<P extends unknown[], V, Meta extends Metadata = Metadata>(
  useStore: BinderStoreDefinition<P, V, Meta>,
  pinia?: Pinia | null,
  hot?: StoreGeneric,
): (...args: P) => UnwrapNestedRefs<ProgressiveBinder<P, V, Meta>> {
  const store: BinderStore<P, V, Meta> = useStore(pinia, hot);

  return (...args) => {
    const currentPage = computed(() => store.pages[store.pages.length - 1] as AsyncPage<V> | undefined);
    const trigger = store.bind(...args);

    return reactive({
      store,
      currentPage,
      trigger() {
        const bookmark = store.metadata.nextBookmark ?? currentPage.value?.bookmark;
        switch (bookmark?.kind) {
          case undefined:
          case null:
            // Unknown kind, assumes trigger will provide one through its results.
            return trigger();
          case 'absolute': {
            // Detected bookmark represents the existing page. Builds a "next" bookmark.
            return trigger({ kind: 'absolute', offset: bookmark.offset + bookmark.limit, limit: bookmark.limit });
          }
          case 'relative': {
            // Detected bookmark represents the existing page. Builds a "next" bookmark.
            return trigger({ kind: 'relative', page: bookmark.page + 1, pageSize: bookmark.pageSize });
          }
          case 'progressive': {
            // Detected bookmark represents the next page. Uses as is.
            return trigger(bookmark);
          }
          default:
            return _never(bookmark);
        }
      },
    } as ProgressiveBinder<P, V, Meta>);
  };
}
