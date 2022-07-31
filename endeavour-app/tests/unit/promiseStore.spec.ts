import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import { _throw } from '@/lib/_throw';
import { stall } from '../lib/mockPromise';

import { definePromiseStore } from '@/stores/promiseStore';

const mockKeySelector = vi.fn(() => 'test');
const mockEmptyPredicate = vi.fn(v => v === 'success');

describe('Promise Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  describe('State machine (base states)', () => {
    it('should be created in a neutral state', () => {
      const trigger = vi.fn(async () => 'success');
      const sut = definePromiseStore('test', trigger)();

      expect(trigger).not.toHaveBeenCalled();

      expect(sut.status).toBe('initial');
      expect(sut.state.cacheKey).toBe('');
      expect(sut.value).toBeUndefined();
      expect(sut.error).toBeUndefined();
    });

    it('should enter a loading state while waiting for the trigger', () => {
      const trigger = vi.fn(() => stall());
      const sut = definePromiseStore('test', trigger)();

      sut.trigger();

      expect(trigger).toHaveBeenCalledOnce();

      expect(sut.status).toBe('loading');
      expect(sut.value).toBeUndefined();
      expect(sut.error).toBeUndefined();
    });

    it('should enter a content state when the trigger returns a value', async () => {
      const trigger = vi.fn(async () => 'success');
      const sut = definePromiseStore('test', trigger)();

      await sut.trigger();

      expect(trigger).toHaveBeenCalledOnce();

      expect(sut.status).toBe('content');
      expect(sut.value).toBe('success');
      expect(sut.error).toBeUndefined();
    });

    describe('default empty predicate', () => {
      for (const emptyValue of [null, '', []]) {
        it(`should enter an empty state when the trigger returns "${JSON.stringify(emptyValue)}"`, async () => {
          const trigger = vi.fn(async () => emptyValue);
          const sut = definePromiseStore('test', trigger)();

          await sut.trigger();

          expect(sut.status).toBe('empty');
          expect(sut.value).toStrictEqual(emptyValue);
          expect(sut.error).toBeUndefined();
        });
      }
    });

    it('should enter an empty state when the content matches the empty predicate', async () => {
      const trigger = vi.fn(async () => 'success');
      const sut = definePromiseStore('test', trigger, { emptyPredicate: mockEmptyPredicate })();

      await sut.trigger();

      expect(mockEmptyPredicate).toHaveBeenCalledOnce();

      expect(sut.status).toBe('empty');
      expect(sut.value).toBe('success');
      expect(sut.error).toBeUndefined();
    });

    it('should enter an error state when the trigger throws', async () => {
      const trigger = vi.fn(async () => _throw('failure'));
      const sut = definePromiseStore('test', trigger)();

      await sut.trigger();

      expect(trigger).toHaveBeenCalledOnce();

      expect(sut.status).toBe('error');
      expect(sut.value).toBeUndefined();
      expect(sut.error).toBe('failure');
    });
  });

  describe('State machine (advanced states)', () => {
    it('should enter a refreshing state while waiting for a re-trigger from content', async () => {
      const trigger = vi.fn(() => stall());
      const sut = definePromiseStore('test', trigger, { keySelector: mockKeySelector })();

      const call = sut.trigger();
      trigger.mock.results[0]?.value.resolve('success');
      await call;

      expect(sut.status).toBe('content');

      // noinspection ES6MissingAwait
      sut.trigger();

      expect(trigger).toHaveBeenCalledTimes(2);
      expect(sut.status).toBe('refreshing');
      expect(sut.value).toBe('success');
      expect(sut.error).toBeUndefined();
    });

    it('should enter a loading state while waiting for a re-trigger from empty', async () => {
      const trigger = vi.fn(() => stall());
      const sut = definePromiseStore('test', trigger, { keySelector: mockKeySelector })();

      const call = sut.trigger();
      trigger.mock.results[0]?.value.resolve(null);
      await call;

      // noinspection ES6MissingAwait
      sut.trigger();

      expect(trigger).toHaveBeenCalledTimes(2);

      expect(sut.status).toBe('loading');
      expect(sut.value).toBeUndefined();
      expect(sut.error).toBeUndefined();
    });

    it('should enter a retrying state while waiting for a re-trigger from error', async () => {
      const trigger = vi.fn(() => stall());
      const sut = definePromiseStore('test', trigger, { keySelector: mockKeySelector })();

      const call = sut.trigger();
      trigger.mock.results[0]?.value.reject('failure');
      await call;

      // noinspection ES6MissingAwait
      sut.trigger();

      expect(trigger).toHaveBeenCalledTimes(2);

      expect(sut.status).toBe('retrying');
      expect(sut.value).toBeUndefined();
      expect(sut.error).toBe('failure');
    });
  });

  describe('Caching', () => {
    it('should set a cache key when the trigger is called', () => {
      const trigger = vi.fn(() => stall());
      const sut = definePromiseStore('test', trigger)();

      const previousKey = sut.state.cacheKey;
      sut.trigger();

      expect(sut.state.cacheKey).not.toBe(previousKey);
    });

    it('should not change the cache key on resolve', async () => {
      const trigger = vi.fn(async () => 'success');
      const sut = definePromiseStore('test', trigger, { keySelector: mockKeySelector })();

      const call = sut.trigger();
      const previousKey = sut.state.cacheKey;
      await call;

      expect(mockKeySelector).toHaveBeenCalledOnce();
      expect(sut.state.cacheKey).toBe(previousKey);
    });

    it('should not change the cache key on reject', async () => {
      const trigger = vi.fn(async () => _throw('failure'));
      const sut = definePromiseStore('test', trigger, { keySelector: mockKeySelector })();

      const call = sut.trigger();
      const previousKey = sut.state.cacheKey;
      await call;

      expect(mockKeySelector).toHaveBeenCalledOnce();
      expect(sut.state.cacheKey).toBe(previousKey);
    });

    it('should clear cache on re-trigger when key changes', async () => {
      const trigger = vi.fn(async () => 'success');
      const sut = definePromiseStore('test', trigger)();

      await sut.trigger();
      const previousKey = sut.state.cacheKey;
      // noinspection ES6MissingAwait
      sut.trigger();

      expect(sut.state.cacheKey).not.toBe(previousKey);
      expect(sut.status).toBe('loading');
      expect(sut.value).toBeUndefined();
      expect(sut.error).toBeUndefined();
    });

    it('should use first param as cache key by default', async () => {
      const trigger = vi.fn(async (arg1: string) => arg1);
      const sut = definePromiseStore('test', trigger)();

      await sut.trigger('key');
      const previousKey = sut.state.cacheKey;
      // noinspection ES6MissingAwait
      sut.trigger('key');

      expect(sut.state.cacheKey).toBe(previousKey);
      expect(sut.state.cacheKey).toBe('key');
    });
  });

  describe('Safeties', () => {
    it('should not re-trigger while loading for the same key', async () => {
      const trigger = vi.fn(() => stall());
      const sut = definePromiseStore('test', trigger, { keySelector: mockKeySelector })();

      // noinspection ES6MissingAwait
      sut.trigger();
      // noinspection ES6MissingAwait
      sut.trigger();

      expect(trigger).toHaveBeenCalledOnce();

      expect(sut.status).toBe('loading');
    });

    it('should not re-trigger while refreshing for the same key', async () => {
      const trigger = vi.fn(() => stall());
      const sut = definePromiseStore('test', trigger, { keySelector: mockKeySelector })();

      const call = sut.trigger();
      trigger.mock.results[0]?.value.resolve('success');
      await call;
      trigger.mockRestore();

      // noinspection ES6MissingAwait
      sut.trigger();
      // noinspection ES6MissingAwait
      sut.trigger();

      expect(trigger).toHaveBeenCalledOnce();

      expect(sut.status).toBe('refreshing');
    });

    it('should not re-trigger while retrying for the same key', async () => {
      const trigger = vi.fn(() => stall());
      const sut = definePromiseStore('test', trigger, { keySelector: mockKeySelector })();

      const call = sut.trigger();
      trigger.mock.results[0]?.value.reject('failure');
      await call;
      trigger.mockRestore();

      // noinspection ES6MissingAwait
      sut.trigger();
      // noinspection ES6MissingAwait
      sut.trigger();

      expect(trigger).toHaveBeenCalledOnce();

      expect(sut.status).toBe('retrying');
    });

    it('should not update when trigger resolves out of turn', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const trigger = vi.fn((_: string) => stall());
      const sut = definePromiseStore('test', trigger)();

      const call1 = sut.trigger('key1');
      const call2 = sut.trigger('key2');

      trigger.mock.results[1]?.value.resolve('success2');
      trigger.mock.results[0]?.value.resolve('success1');

      await call1;
      await call2;

      expect(sut.status).toBe('content');
      expect(sut.state.cacheKey).toBe('key2');
      expect(sut.value).toBe('success2');
    });

    it('should not update when trigger rejects out of turn', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const trigger = vi.fn((_: string) => stall());
      const sut = definePromiseStore('test', trigger)();

      const call1 = sut.trigger('key1');
      const call2 = sut.trigger('key2');

      trigger.mock.results[1]?.value.reject('failure2');
      trigger.mock.results[0]?.value.reject('failure1');

      await call1;
      await call2;

      expect(sut.status).toBe('error');
      expect(sut.state.cacheKey).toBe('key2');
      expect(sut.error).toBe('failure2');
    });
  });
});
