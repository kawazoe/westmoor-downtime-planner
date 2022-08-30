import { acceptHMRUpdate, defineStore } from 'pinia';

import type { Bookmark } from '@/lib/bookmarks';

import type { BinderComposableOptions, Metadata, Page } from '@/composables/binders';
import { useEnumerableBinder, useIndexableBinder } from '@/composables/binders';

export type EnumerableBinderStoreDefinition<P extends unknown[], V, Meta extends Metadata = Metadata> = ReturnType<typeof defineEnumerableBinderStore<P, V, Meta>>;
export type EnumerableBinderStore<P extends unknown[], V, Meta extends Metadata = Metadata> = ReturnType<EnumerableBinderStoreDefinition<P, V, Meta>>;
export function defineEnumerableBinderStore<P extends unknown[], V, Meta extends Metadata = Metadata>(
  id: string,
  trigger: (...args: P) => (bookmark: Bookmark | null) => Promise<Page<V, Meta>>,
  options?: BinderComposableOptions<P, V, Meta>,
) {
  const useStore = defineStore(id, () => useEnumerableBinder(trigger, options));

  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
  }

  return useStore;
}

export type IndexableBinderStoreDefinition<P extends unknown[], V, Meta extends Metadata = Metadata> = ReturnType<typeof defineIndexableBinderStore<P, V, Meta>>;
export type IndexableBinderStore<P extends unknown[], V, Meta extends Metadata = Metadata> = ReturnType<IndexableBinderStoreDefinition<P, V, Meta>>;
export function defineIndexableBinderStore<P extends unknown[], V, Meta extends Metadata = Metadata>(
  id: string,
  trigger: (...args: P) => (bookmark: Bookmark | null) => Promise<Page<V, Meta>>,
  options?: BinderComposableOptions<P, V, Meta>,
) {
  const useStore = defineStore(id, () => useIndexableBinder(trigger, options));

  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
  }

  return useStore;
}
