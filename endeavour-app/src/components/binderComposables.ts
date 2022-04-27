import { computed, reactive } from 'vue';
import type { ComputedRef, UnwrapNestedRefs } from 'vue';

import type { Pinia, StoreGeneric } from 'pinia';

import { _never } from '@/lib/_never';

import type { AsyncPage, BinderStore, BinderStoreDefinition } from '@/stores/binderStore';

export interface ProgressiveBinder<P extends unknown[], V> {
  store: BinderStore<P, V>;
  currentPage: ComputedRef<AsyncPage<V> | undefined>;
  trigger: () => Promise<void>;
}
export function useProgressiveBinder<P extends unknown[], V>(
  useStore: BinderStoreDefinition<P, V>,
  pinia?: Pinia | null,
  hot?: StoreGeneric,
): (...args: P) => UnwrapNestedRefs<ProgressiveBinder<P, V>> {
  const store = useStore(pinia, hot);

  return (...args) => {
    const currentPage = computed(() => store.pages[store.pages.length - 1] as AsyncPage<V> | undefined);
    const trigger = store.bind(...args);

    return reactive({
      store,
      currentPage,
      trigger() {
        const lastBookmark = currentPage.value?.bookmark;
        switch (lastBookmark?.kind) {
          case undefined:
          case null:
            return trigger();
          case 'absolute': {
            return trigger({ kind: 'absolute', offset: lastBookmark.offset + lastBookmark.limit, limit: lastBookmark.limit });
          }
          case 'relative': {
            return trigger({ kind: 'relative', page: lastBookmark.page + 1, pageSize: lastBookmark.pageSize });
          }
          case 'progressive': {
            return trigger({ kind: 'progressive', token: lastBookmark.token });
          }
          default:
            return _never(lastBookmark);
        }
      },
    } as ProgressiveBinder<P, V>);
  };
}
