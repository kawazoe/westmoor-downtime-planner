import { toRaw } from 'vue';
import type { UnwrapRef } from 'vue';

import type { _DeepPartial, StoreDefinition } from 'pinia';
import { defineStore } from 'pinia';
import { nanoid } from 'nanoid';

import { _never } from '@/lib/_never';

// eslint-disable-next-line @typescript-eslint/ban-types
export type CacheKey = {};

export type PromiseStoreOptions<P extends unknown[], V> = {
  keySelector?: (...args: P) => CacheKey,
  emptyPredicate?: (value: V) => boolean,
};
export function defaultKeySelector<P extends unknown[]>(...args: P): CacheKey {
  // HACK: Temporary workaround since objects aren't stable in pinia: https://github.com/vuejs/pinia/discussions/1146
  return args[0] as CacheKey ?? /* {} */ nanoid(16);
}
export function defaultEmptyPredicate(value: unknown): boolean {
  return value == null || value === '' || (Array.isArray(value) && value.length === 0);
}

export type AsyncStatus = 'initial' | 'loading' | 'content' | 'empty' | 'error' | 'refreshing' | 'retrying';
export interface AsyncValueInitial {
  status: 'initial';
  cacheKey: CacheKey;
  value: undefined;
  error: undefined;
}
export interface AsyncValueLoading {
  status: 'loading';
  cacheKey: CacheKey;
  value: undefined;
  error: undefined;
}
export interface AsyncValueContent<V> {
  status: 'content';
  cacheKey: CacheKey;
  value: V;
}
export interface AsyncValueEmpty<V> {
  status: 'empty';
  cacheKey: CacheKey;
  value: V;
}
export interface AsyncValueError {
  status: 'error';
  cacheKey: CacheKey;
  error: unknown;
}
export interface AsyncValueRefreshing<V> {
  status: 'refreshing';
  cacheKey: CacheKey;
  value: V;
}
export interface AsyncValueRetrying {
  status: 'retrying';
  cacheKey: CacheKey;
  error: unknown;
}

export type AsyncValuePresenting<V> = AsyncValueContent<V> | AsyncValueEmpty<V> | AsyncValueRefreshing<V>;
export type AsyncValueFailed = AsyncValueError | AsyncValueRetrying;
export type AsyncValueInitialized<V> = AsyncValueLoading | AsyncValuePresenting<V> | AsyncValueFailed;
export type AsyncValue<V> = AsyncValueInitial | AsyncValueInitialized<V>;

type PromiseStoreActions<P extends unknown[]> = {
  trigger: (...args: P) => Promise<void>,
};
export function definePromiseStore<P extends unknown[], V>(
  id: string,
  trigger: (...args: P) => Promise<V>,
  options?: PromiseStoreOptions<P, V>,
): StoreDefinition<string, AsyncValue<V>, Record<string, string>, PromiseStoreActions<P>> {
  const pickProcessingState = (stateStatus: AsyncStatus, cacheKey: CacheKey): _DeepPartial<UnwrapRef<AsyncValue<V>>> | null => {
    switch (stateStatus) {
      case 'initial':
      case 'empty':
        return { status: 'loading', cacheKey, value: undefined, error: undefined };
      case 'content':
        return { status: 'refreshing', cacheKey };
      case 'error':
        return { status: 'retrying', cacheKey };
      case 'loading':
      case 'refreshing':
      case 'retrying':
        console.info(`[AsyncValueAction] [trigger] Batching ${id} concurrent trigger.`);
        return null;
      default:
        return _never(stateStatus);
    }
  };

  return defineStore({
    id,
    state: () => ({
      status: 'initial',
      cacheKey: '',
      value: undefined,
      error: undefined,
    } as AsyncValue<V>),
    actions: {
      trigger(...args: P) {
        const cacheKey = (options?.keySelector ?? defaultKeySelector)(...args);
        const cacheKeyMatches = (): boolean => toRaw(this.cacheKey) === cacheKey;

        const processingState: _DeepPartial<UnwrapRef<AsyncValue<V>>> | null = cacheKeyMatches()
          ? pickProcessingState(this.status, cacheKey)
          : ({ status: 'loading', cacheKey, value: undefined, error: undefined });

        if (!processingState) {
          return Promise.resolve();
        }
        this.$patch(processingState);

        return trigger(...args)
          .then(value => {
            if (cacheKeyMatches()) {
              this.$patch({
                status: (options?.emptyPredicate ?? defaultEmptyPredicate)(value)
                  ? 'empty'
                  : 'content',
                value,
              });
            }
          })
          .catch(error => {
            if (cacheKeyMatches()) {
              this.$patch({
                status: 'error',
                error,
              });
            }
          });
      },
    },
  });
}
