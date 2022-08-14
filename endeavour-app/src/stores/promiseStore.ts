import { acceptHMRUpdate, defineStore } from 'pinia';

import type { PromiseComposableOptions } from '@/composables/promiseComposables';
import { usePromise } from '@/composables/promiseComposables';

export type PromiseStoreDefinition<P extends unknown[], V> = ReturnType<typeof definePromiseStore<P, V>>;
export type PromiseStore<P extends unknown[], V> = ReturnType<PromiseStoreDefinition<P, V>>;
export function definePromiseStore<P extends unknown[], V>(
  id: string,
  factory: (...args: P) => Promise<V>,
  options?: PromiseComposableOptions<P, V>,
) {
  const useStore = defineStore(id, () => usePromise(factory, options));

  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
  }

  return useStore;
}
