import type { ActionContext, ActionHandler, Module } from 'vuex';

import * as A from 'fp-ts/Array';
import { flow, pipe } from 'fp-ts/function';
import { _never } from '@/lib/_never';
import { Uuid } from '@/store/core-types';

export type AbsoluteBookmark = { offset: number, limit: number };
export type RelativeBookmark = { page: number, pageSize: number };
export type ProgressiveBookmark = { token: Uuid };
export type Bookmark = AbsoluteBookmark | RelativeBookmark | ProgressiveBookmark;

export const NullBookmark = { token: Uuid.cast('null') };
Object.freeze(NullBookmark);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isAbsoluteBookmark(value: any): value is AbsoluteBookmark {
  return value != null && typeof value.offset === 'number' && typeof value.limit === 'number';
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRelativeBookmark(value: any): value is RelativeBookmark {
  return value != null && typeof value.page === 'number' && typeof value.pageSize === 'number';
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isProgressiveBookmark(value: any): value is ProgressiveBookmark {
  return value != null && typeof value.token === 'string';
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isBookmark(value: any): value is Bookmark {
  return isAbsoluteBookmark(value) || isRelativeBookmark(value) || isProgressiveBookmark(value);
}

export type PageStatus = 'initial' | 'loading' | 'content' | 'empty' | 'error' | 'refreshing' | 'retrying';
export type Page<V> = {
  status: PageStatus,
  bookmark: Bookmark | null,
  value: V[],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPage<V>(value: any): value is Page<V> {
  return value != null && 'status' in value && 'bookmark' in value;
}

export type BinderStatus = 'initial' | 'loading' | 'nested';
export type Binder<V> = {
  status: BinderStatus,
  queryKey: unknown,
  pages: Page<V>[],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isBinder<V>(value: any): value is Binder<V> {
  return value != null && 'status' in value && Array.isArray(value.pages);
}

// Concepts
///////////////////////////////////////////////////////////////////////////////
function unwrapFunction<T, TR = T>(value: T | (() => TR), argsSelector?: () => unknown[]): T | TR {
  return typeof value === 'function'
    ? (value as (...arg: unknown[]) => TR)(...argsSelector?.() ?? [])
    : value;
}

const recordConcat = flow(
  A.map(Object.entries),
  A.flatten,
  Object.fromEntries,
);

/**
 * This type uses any to respect the vuex philosophy of using the any type for action payloads.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionPayload = { bookmark?: Bookmark } & any;
type MutationPayload = { queryKey: unknown | undefined };
type TriggerPayload = MutationPayload & ActionPayload;

export type BinderOptions<V> = {
  keySelector?: (payload?: ActionPayload) => unknown,
  emptyPredicate?: (value: Binder<V>) => boolean,
};

function defaultEmptyPredicate(value: Binder<unknown> | null | undefined): boolean {
  return value == null || value.status === 'nested' && value.pages.length === 0;
}

// State
///////////////////////////////////////////////////////////////////////////////
interface KeyedStatus {
  queryKey: unknown;
}
export interface AsyncValueInitial {
  status: 'initial';
}
export interface AsyncValueLoading extends KeyedStatus{
  status: 'loading';
}
export interface AsyncValueContent<V> extends KeyedStatus {
  status: 'content';
  value: V;
}
export interface AsyncValueEmpty<V> extends KeyedStatus {
  status: 'empty';
  value: V;
}
export interface AsyncValueError extends KeyedStatus {
  status: 'error';
  error: string;
}
export interface AsyncValueRefreshing<V> extends KeyedStatus {
  status: 'refreshing';
  value: V;
}
export interface AsyncValueRetrying extends KeyedStatus {
  status: 'retrying';
  error: string;
}

export type AsyncValuePresenting<V> = AsyncValueContent<V> | AsyncValueEmpty<V> | AsyncValueRefreshing<V>;
export type AsyncValueFailed = AsyncValueError | AsyncValueRetrying;
export type AsyncValueInitialized<V> = AsyncValueLoading | AsyncValuePresenting<V> | AsyncValueFailed;
export type AsyncValue<V> = AsyncValueInitial | AsyncValueInitialized<V>;

// Mutations
///////////////////////////////////////////////////////////////////////////////
type AsyncValueMutations<K extends string, V, S extends { [P in K]: AsyncValue<V> }> =
  & { [P in `${K}_load`]: (state: S) => void; }
  & { [P in `${K}_resolve`]: (state: S, payload: V) => void; }
  & { [P in `${K}_reject`]: (state: S, payload: string) => void; };

function createAsyncValueMutations<K extends string, V, S extends { [P in K]: AsyncValue<V> }>(
  propName: K,
  options?: BinderOptions<V>,
): AsyncValueMutations<K, V, S> {
  return {
    [`${propName}_load`]: (s: { [P in K]: AsyncValue<V> }, { queryKey }: { queryKey: unknown }) => {
      s[propName] = {
        queryKey,
        status: 'loading',
      };
    },
    [`${propName}_resolve`]: (s: { [P in K]: AsyncValueInitialized<V> }, v: V) => {
      s[propName] = {
        status: (options?.emptyPredicate || defaultEmptyPredicate)(v) && 'empty' || 'content',
        queryKey: s[`${propName}`].queryKey,
        value: v,
      };
    },
    [`${propName}_reject`]: (s: { [P in K]: AsyncValueInitialized<V> }, e: string) => {
      s[propName] = {
        status: 'error',
        queryKey: s[`${propName}`].queryKey,
        error: e,
      };
    },
    [`${propName}_refresh`]: (s: { [P in K]: AsyncValuePresenting<V> }, { queryKey }: { queryKey: unknown }) => {
      s[propName].status = 'refreshing';
      s[propName].queryKey = queryKey;
    },
    [`${propName}_retry`]: (s: { [P in K]: AsyncValueFailed }, { queryKey }: { queryKey: unknown }) => {
      s[propName].status = 'retrying';
      s[propName].queryKey = queryKey;
    },
  } as AsyncValueMutations<K, V, S>;
}

// Actions
///////////////////////////////////////////////////////////////////////////////
type AsyncValueActions<K extends string, V, S extends { [P in K]: AsyncValue<V> }, R> =
  & { [P in `${K}_trigger`]: ActionHandler<S, R>; };

function createAsyncValueActions<K extends string, V, S extends { [P in K]: AsyncValue<V> }, R>(
  propName: K,
  trigger: (injectee: ActionContext<S, unknown>, payload: TriggerPayload) => Promise<V>,
  options?: BinderOptions<V>,
): AsyncValueActions<K, V, S, R> {
  function pickMutation(
    s: { [P in K]: AsyncValue<V> },
    payload: MutationPayload,
  ): 'load' | 'refresh' | 'retry' | null {
    const state = s[propName];
    if (state.status === 'initial' || state.queryKey === payload.queryKey) {
      return 'load';
    }

    switch (state.status) {
      case 'empty':
        return 'load';
      case 'content':
        return 'refresh';
      case 'error':
        return 'retry';
      case 'loading':
      case 'refreshing':
      case 'retrying':
        console.info(`[AsyncValueAction] [trigger] Batching ${propName} concurrent trigger.`);
        return null;
      default:
        return _never(state);
    }
  }

  return {
    [`${propName}_trigger`](ctx: ActionContext<S, R>, payload?: ActionPayload): Promise<void> {
      const queryKey = options?.keySelector?.(payload) || undefined;
      const mutationPayload = { queryKey };

      const mutation = pickMutation(ctx.state, mutationPayload);
      if (!mutation) {
        return Promise.resolve();
      }

      ctx.commit(`${propName}_${mutation}`, mutationPayload);

      function isResultRelevant(): boolean {
        return (ctx.state[propName] as KeyedStatus).queryKey === queryKey;
      }

      return trigger(ctx, { ...payload, queryKey }).then(
        v => isResultRelevant() && ctx.commit(`${propName}_resolve`, v) || undefined,
        e => isResultRelevant() && ctx.commit(`${propName}_error`, e) || undefined,
      );
    },
  } as AsyncValueActions<K, V, S, R>;
}

// Module
///////////////////////////////////////////////////////////////////////////////
export function fromPromise<K extends string, V>(
  propName: K,
  trigger: (injectee: ActionContext<{ [P in K]: AsyncValue<V> }, unknown>, payload: TriggerPayload) => Promise<V>,
  options?: BinderOptions<V>,
): Module<{ [P in K]: AsyncValue<V> }, unknown> {
  return {
    state() {
      return {
        [propName]: {
          status: 'initial',
          queryKey: {},
        },
      } as { [P in K]: AsyncValue<V> };
    },
    getters: { [propName]: ((state: { [P in K]: AsyncValue<V> }) => state[propName]) },
    mutations: createAsyncValueMutations(propName, options),
    actions: createAsyncValueActions(propName, trigger, options),
  } as Module<{ [P in K]: AsyncValue<V> }, unknown>;
}

export function merge<S1, R>(m1: Module<S1, R>): Module<S1, R>;
export function merge<S1, S2, R>(m1: Module<S1, R>, m2: Module<S2, R>): Module<S1 & S2, R>;
export function merge<S1, S2, S3, R>(m1: Module<S1, R>, m2: Module<S2, R>, m3: Module<S3, R>): Module<S1 & S2 & S3, R>;
export function merge<S1, S2, S3, S4, R>(m1: Module<S1, R>, m2: Module<S2, R>, m3: Module<S3, R>, m4: Module<S4, R>): Module<S1 & S2 & S3 & S4, R>;
export function merge<S1, S2, S3, S4, S5, R>(m1: Module<S1, R>, m2: Module<S2, R>, m3: Module<S3, R>, m4: Module<S4, R>, m5: Module<S5, R>): Module<S1 & S2 & S3 & S4 & S5, R>;
export function merge<S1, S2, S3, S4, S5, S6, R>(m1: Module<S1, R>, m2: Module<S2, R>, m3: Module<S3, R>, m4: Module<S4, R>, m5: Module<S5, R>, m6: Module<S6, R>): Module<S1 & S2 & S3 & S4 & S5 & S6, R>;
export function merge<S1, S2, S3, S4, S5, S6, S7, R>(m1: Module<S1, R>, m2: Module<S2, R>, m3: Module<S3, R>, m4: Module<S4, R>, m5: Module<S5, R>, m6: Module<S6, R>, m7: Module<S7, R>): Module<S1 & S2 & S3 & S4 & S5 & S6 & S7, R>;
export function merge<S, R>(...modules: Module<Partial<S>, R>[]): Module<S, R> {
  return {
    namespaced: modules.some(m => m.namespaced),
    state() {
      return pipe(
        modules,
        A.map(m => m.state || {}),
        A.map(unwrapFunction),
        recordConcat,
      );
    },
    getters: pipe(
      modules,
      A.map(m => m.getters || {}),
      recordConcat,
    ),
    mutations: pipe(
      modules,
      A.map(m => m.mutations || {}),
      recordConcat,
    ),
    actions: pipe(
      modules,
      A.map(m => m.actions || {}),
      recordConcat,
    ),
    modules: pipe(
      modules,
      A.map(m => m.modules || {}),
      recordConcat,
    ),
  };
}
