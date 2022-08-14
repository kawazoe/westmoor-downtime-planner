import { acceptHMRUpdate, defineStore } from 'pinia';

import type { Bookmark } from '@/lib/bookmarks';

import type { BinderComposableOptions, Metadata, Page } from '@/composables/binders';
import { useBinder } from '@/composables/binders';


export type BinderStoreDefinition<P extends unknown[], V, Meta extends Metadata = Metadata> = ReturnType<typeof defineBinderStore<P, V, Meta>>;
export type BinderStore<P extends unknown[], V, Meta extends Metadata = Metadata> = ReturnType<BinderStoreDefinition<P, V, Meta>>;
export function defineBinderStore<P extends unknown[], V, Meta extends Metadata = Metadata>(
  id: string,
  trigger: (...args: P) => (bookmark: Bookmark | null) => Promise<Page<V, Meta>>,
  options?: BinderComposableOptions<P, V, Meta>,
) {
  const useStore = defineStore(id, () => useBinder(trigger, options));

  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
  }

  return useStore;
}
