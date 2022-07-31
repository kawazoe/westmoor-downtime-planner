import { computed, shallowRef } from 'vue';

import { acceptHMRUpdate, defineStore } from 'pinia';

import { nanoid } from 'nanoid';

import { _never } from '@/lib/_never';

// eslint-disable-next-line @typescript-eslint/ban-types
export type CacheKey = {};

export type PromiseStoreOptions<P extends unknown[], V> = {
  keySelector?: (...args: P) => CacheKey,
  emptyPredicate?: (value: V) => boolean,
};
export function defaultKeySelector<P extends unknown[]>(...args: P): CacheKey {
  return args[0] as CacheKey ?? nanoid(16);
}
export function defaultEmptyPredicate(value: unknown): boolean {
  return value == null || value === '' || (Array.isArray(value) && value.length === 0);
}

export type AsyncStatus = 'initial' | 'loading' | 'content' | 'empty' | 'error' | 'refreshing' | 'retrying';
export interface AsyncValue<V> {
  status: AsyncStatus;
  cacheKey: CacheKey;
  value: V | undefined;
  error: unknown | undefined;
}

export function usePromise<P extends unknown[], V>(
  factory: (...args: P) => Promise<V>,
  options?: PromiseStoreOptions<P, V>,
) {
  function pickStateTransition(stateStatus: AsyncStatus, cacheKey: CacheKey): ((state: AsyncValue<V>) => AsyncValue<V>) | null {
    switch (stateStatus) {
      case 'initial':
      case 'empty':
        return () => ({ status: 'loading', cacheKey, value: undefined, error: undefined });
      case 'content':
        return s => ({ ...s, status: 'refreshing', cacheKey });
      case 'error':
        return s => ({ ...s, status: 'retrying', cacheKey });
      case 'loading':
      case 'refreshing':
      case 'retrying':
        console.info('[PromiseComposable] [state transition] Batching concurrent trigger.');
        return null;
      default:
        return _never(stateStatus);
    }
  }

  const state = shallowRef<AsyncValue<V>>({
    status: 'initial',
    cacheKey: '' as CacheKey,
    value: undefined,
    error: undefined,
  });

  function trigger(...args: P): unknown {
    const cacheKey = (options?.keySelector ?? defaultKeySelector)(...args);

    function cacheKeyMatches() {
      return state.value.cacheKey === cacheKey;
    }

    const processingState = cacheKeyMatches()
      ? pickStateTransition(state.value.status, cacheKey)
      : () => ({ status: 'loading', cacheKey, value: undefined, error: undefined });

    if (!processingState) {
      return Promise.resolve();
    }

    state.value = processingState(state.value as AsyncValue<V>) as AsyncValue<V>;

    return factory(...args)
      .then(value => {
        if (cacheKeyMatches()) {
          state.value = {
            status: (options?.emptyPredicate ?? defaultEmptyPredicate)(value)
              ? 'empty'
              : 'content',
            cacheKey,
            value,
            error: undefined,
          };
        }
      })
      .catch(error => {
        if (cacheKeyMatches()) {
          state.value = {
            status: 'error',
            cacheKey,
            value: undefined,
            error,
          };
        }
      });
  }

  return {
    state,
    status: computed(() => state.value.status),
    value: computed(() => state.value.value),
    error: computed(() => state.value.error),
    trigger,
  };
}

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
