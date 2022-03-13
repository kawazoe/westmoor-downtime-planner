import { toRaw } from 'vue';

import { defineStore } from 'pinia';
import { nanoid } from 'nanoid';
import type { StoreDefinition } from 'pinia';

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
  cacheKey: undefined;
}
export interface AsyncValueLoading {
  status: 'loading';
  cacheKey: CacheKey;
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
  _pickProcessingStatus(cacheKey: CacheKey): 'loading' | 'refreshing' | 'retrying' | null,
  trigger: (...args: P) => Promise<void>,
};
export function definePromiseStore<P extends unknown[], V>(
  id: string,
  trigger: (...args: P) => Promise<V>,
  options?: PromiseStoreOptions<P, V>,
): StoreDefinition<string, AsyncValue<V>, Record<string, string>, PromiseStoreActions<P>> {
  return defineStore({
    id,
    state: () => ({
      status: 'initial',
      cacheKey: undefined,
      value: undefined,
      error: undefined,
    } as AsyncValue<V>),
    actions: {
      _pickProcessingStatus(cacheKey: CacheKey): 'loading' | 'refreshing' | 'retrying' | null {
        if (toRaw(this.cacheKey) != null && toRaw(this.cacheKey) !== cacheKey) {
          return 'loading';
        }

        switch (this.status) {
          case 'initial':
          case 'empty':
            return 'loading';
          case 'content':
            return 'refreshing';
          case 'error':
            return 'retrying';
          case 'loading':
          case 'refreshing':
          case 'retrying':
            console.info(`[AsyncValueAction] [trigger] Batching ${id} concurrent trigger.`);
            return null;
          default:
            return _never(this);
        }
      },
      trigger(...args: P) {
        const cacheKey = (options?.keySelector ?? defaultKeySelector)(...args);
        const processingStatus = this._pickProcessingStatus(cacheKey);
        if (!processingStatus) {
          return Promise.resolve();
        }

        this.$patch({ status: processingStatus, cacheKey });

        const whenRelevant = (callback: () => void): void => (toRaw(this.cacheKey) === cacheKey ? callback() : undefined);

        return trigger(...args)
          .then(
            value => whenRelevant(() => this.$patch({
              status: (options?.emptyPredicate ?? defaultEmptyPredicate)(value)
                ? 'empty'
                : 'content',
              value,
            })),
            error => whenRelevant(() => this.$patch({
              status: 'error',
              error,
            })),
          );
      },
    },
  });
}
