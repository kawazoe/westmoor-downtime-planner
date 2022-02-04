import type { ActionContext, ActionHandler, Getter, Module } from 'vuex';
import { _throw } from '@/lib/_throw';

import * as A from 'fp-ts/Array';
import { flow, pipe } from 'fp-ts/function';

// Concepts
///////////////////////////////////////////////////////////////////////////////
function assertUndefined<T>(value: T | undefined): T {
  return value === undefined ? _throw(new Error('Unexpected undefined value')) : value;
}

function unwrapFunction<T>(value: T | (() => T)): T {
  return typeof value === 'function'
    ? (value as () => T)()
    : value;
}

const recordConcat = flow(
  A.map(Object.entries),
  A.flatten,
  Object.fromEntries,
);

export type AsyncStatus = 'initial' | 'loading' | 'success' | 'error' | 'refreshing' | 'retrying';

// State
///////////////////////////////////////////////////////////////////////////////
export type AsyncValueState<K extends string, V> =
  & { [P in `${K}_status`]: AsyncStatus; }
  & { [P in `${K}_value`]: V | undefined; }
  & { [P in `${K}_error`]: string | undefined; };

function createAsyncValueState<K extends string, V>(propName: K, status: AsyncStatus, value: V | undefined, error: string | undefined): AsyncValueState<K, V> {
  return {
    [`${propName}_status`]: status,
    [`${propName}_value`]: value,
    [`${propName}_error`]: error,
  } as AsyncValueState<K, V>;
}

interface AsyncValueStateLens<V> {
  status: {
    get(): AsyncStatus,
    set(v: AsyncStatus): void,
  };
  value: {
    get(): V | undefined,
    set(v: V | undefined): void,
  };
  error: {
    get(): string | undefined,
    set(v: string | undefined): void,
  };
}

function createAsyncValueStateLens<K extends string, V>(propName: K): (state: AsyncValueState<K, V>) => AsyncValueStateLens<V> {
  return (s: AsyncValueState<K, V>) => ({
    status: {
      get: () => s[`${propName}_status`] as unknown as AsyncStatus,
      set: (v: AsyncStatus) => {
        s[`${propName}_status`] = v as unknown as AsyncValueState<K, V>[`${K}_status`];
      },
    },
    value: {
      get: () => s[`${propName}_value`] as unknown as V | undefined,
      set: (v: V | undefined) => {
        s[`${propName}_value`] = v as unknown as AsyncValueState<K, V>[`${K}_value`];
      },
    },
    error: {
      get: () => s[`${propName}_error`] as unknown as string | undefined,
      set: (v: string | undefined) => {
        s[`${propName}_error`] = v as unknown as AsyncValueState<K, V>[`${K}_error`];
      },
    },
  }) as AsyncValueStateLens<V>;
}

// Getters
///////////////////////////////////////////////////////////////////////////////
export interface AsyncValueInitial {
  status: 'initial';
}
export interface AsyncValueLoading {
  status: 'loading';
}
export interface AsyncValueSuccess<V> {
  status: 'success';
  value: V;
}
export interface AsyncValueError {
  status: 'error';
  error: string;
}
export interface AsyncValueRefreshing<V> {
  status: 'refreshing';
  value: V;
}
export interface AsyncValueRetrying {
  status: 'retrying';
  error: string;
}

export type AsyncValue<V> = AsyncValueInitial | AsyncValueLoading | AsyncValueSuccess<V> | AsyncValueError | AsyncValueRefreshing<V> | AsyncValueRetrying;

function createAsyncValue<K extends string, V, S extends AsyncValueState<K, V>>(
  propName: K,
  state: S,
): AsyncValue<V> {
  const lens = createAsyncValueStateLens<K, V>(propName)(state);

  const status = lens.status.get();

  switch (status) {
    case 'initial':
    case 'loading':
      return { status };
    case 'success':
    case 'refreshing':
      return { status, value: assertUndefined(lens.value.get()) };
    case 'error':
    case 'retrying':
      return { status, error: assertUndefined(lens.error.get()) };
  }

  throw new Error(`Unsupported AsyncStatus: ${lens.status.get()}`);
}

type AsyncValueGetter<K extends string, V, R> = (...args: Parameters<Getter<AsyncValueState<K, V>, R>>) => AsyncValue<V>;

export type AsyncValueGetters<K extends string, V, R> =
  & { [P in K]: AsyncValueGetter<K, V, R>; };

function createAsyncValueGetters<K extends string, V, R>(propName: K): AsyncValueGetters<K, V, R> {
  return { [propName]: ((state: AsyncValueState<K, V>) => createAsyncValue(propName, state)) as AsyncValueGetter<K, V, R> } as AsyncValueGetters<K, V, R>;
}

// Mutations
///////////////////////////////////////////////////////////////////////////////
type AsyncValueMutations<K extends string, V, S extends AsyncValueState<K, V>> =
  & { [P in `${K}_load`]: (state: S) => void; }
  & { [P in `${K}_resolve`]: (state: S, payload: V) => void; }
  & { [P in `${K}_reject`]: (state: S, payload: string) => void; };

function createAsyncValueMutations<K extends string, V, S extends AsyncValueState<K, V>>(propName: K): AsyncValueMutations<K, V, S> {
  const propLens = createAsyncValueStateLens(propName);

  return {
    [`${propName}_load`]: (s: AsyncValueState<K, V>) => {
      const stateLens = propLens(s);
      stateLens.status.set('loading');
      stateLens.value.set(undefined);
      stateLens.error.set(undefined);
    },
    [`${propName}_resolve`]: (s: AsyncValueState<K, V>, v: V) => {
      const l = propLens(s);
      l.status.set('success');
      l.value.set(v);
      l.error.set(undefined);
    },
    [`${propName}_reject`]: (s: AsyncValueState<K, V>, e: string) => {
      const l = propLens(s);
      l.status.set('error');
      l.value.set(undefined);
      l.error.set(e);
    },
    [`${propName}_refresh`]: (s: AsyncValueState<K, V>) => {
      const l = propLens(s);
      l.status.set('refreshing');
    },
    [`${propName}_retry`]: (s: AsyncValueState<K, V>) => {
      const l = propLens(s);
      l.status.set('retrying');
    },
  } as AsyncValueMutations<K, V, S>;
}

// Actions
///////////////////////////////////////////////////////////////////////////////
type AsyncValueActions<K extends string, V, S extends AsyncValueState<K, V>, R> =
  & { [P in `${K}_trigger`]: ActionHandler<S, R>; };

function triggerStrategy(status: AsyncStatus, force?: true): 'load' | 'refresh' | 'retry' | null {
  switch (true) {
    case status === 'initial':
    case status === 'loading' && force:
      return 'load';
    case status === 'success':
    case status === 'refreshing' && force:
      return 'refresh';
    case status === 'error':
    case status === 'retrying' && force:
      return 'retry';
    default:
      return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createAsyncValueActions<K extends string, V, S extends AsyncValueState<K, V>, R>(propName: K, trigger: (injectee: ActionContext<S, unknown>, payload?: any) => Promise<V>): AsyncValueActions<K, V, S, R> {
  const propLens = createAsyncValueStateLens(propName);

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [`${propName}_init`](ctx: ActionContext<S, R>, payload?: any) {
      const l = propLens(ctx.state);

      if (l.status.get() !== 'initial') {
        console.info(`[AsyncValueAction] [init] Trying to init ${propName} more than once.`);
        return Promise.resolve();
      }

      return ctx.dispatch(`${propName}_trigger`, payload);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [`${propName}_trigger`](ctx: ActionContext<S, R>, payload?: any) {
      const l = propLens(ctx.state);

      const mutation = triggerStrategy(l.status.get(), payload?.force);
      if (!mutation) {
        console.info(`[AsyncValueAction] [trigger] Trying to trigger ${propName} concurrently.`);
        return Promise.resolve();
      }

      ctx.commit(`${propName}_${mutation}`);

      return trigger(ctx, payload).then(
        v => ctx.commit(`${propName}_resolve`, v),
        e => ctx.commit(`${propName}_error`, e),
      );
    },
  } as AsyncValueActions<K, V, S, R>;
}

// Module
///////////////////////////////////////////////////////////////////////////////
export function fromPromise<K extends string, V>(
  propName: K,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger: (injectee: ActionContext<AsyncValueState<K, V>, unknown>, payload?: any) => Promise<V>,
): Module<AsyncValueState<K, V>, unknown> {
  return {
    state() {
      return createAsyncValueState(propName, 'initial', undefined, undefined);
    },
    getters: createAsyncValueGetters(propName),
    mutations: createAsyncValueMutations(propName),
    actions: createAsyncValueActions(propName, trigger),
  } as Module<AsyncValueState<K, V>, unknown>;
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
