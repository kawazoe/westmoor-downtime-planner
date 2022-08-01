import { acceptHMRUpdate, defineStore } from 'pinia';

import type { PromiseStoreOptions } from '@/composables/promiseComposables';
import { usePromise } from '@/composables/promiseComposables';

export function definePromiseStore<P extends unknown[], V>(
  id: string,
  factory: (...args: P) => Promise<V>,
  options?: PromiseStoreOptions<P, V>,
) {
  const useStore = defineStore(id, () => usePromise(factory, options));

  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
  }

  return useStore;
}
