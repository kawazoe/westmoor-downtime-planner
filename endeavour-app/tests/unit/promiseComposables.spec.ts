import { beforeEach, describe, expect, it, vi } from 'vitest';

import { _throw } from '@/lib/_throw';
import { stall } from '../lib/mockPromise';

import { usePromise } from '@/composables/promises';

const mockKeySelector = vi.fn(() => 'test');
const mockEmptyPredicate = vi.fn(v => v === 'success');

describe('Promise Composable', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('State machine (base states)', () => {
    it('should be created in a neutral state', () => {
      const trigger = vi.fn(async () => 'success');
      const sut = usePromise(trigger);

      expect(trigger).not.toHaveBeenCalled();

      expect(sut.status.value).toBe('initial');
      expect(sut.state.value.cacheKey).toBe('');
      expect(sut.value.value).toBeUndefined();
      expect(sut.error.value).toBeUndefined();
    });

    it('should enter a loading state while waiting for the trigger', () => {
      const trigger = vi.fn(() => stall());
      const sut = usePromise(trigger);

      sut.trigger();

      expect(trigger).toHaveBeenCalledOnce();

      expect(sut.status.value).toBe('loading');
      expect(sut.value.value).toBeUndefined();
      expect(sut.error.value).toBeUndefined();
    });

    it('should enter a content state when the trigger returns a value', async () => {
      const trigger = vi.fn(async () => 'success');
      const sut = usePromise(trigger);

      await sut.trigger();

      expect(trigger).toHaveBeenCalledOnce();

      expect(sut.status.value).toBe('content');
      expect(sut.value.value).toBe('success');
      expect(sut.error.value).toBeUndefined();
    });

    describe('default empty predicate', () => {
      for (const emptyValue of [null, '', []]) {
        it(`should enter an empty state when the trigger returns "${JSON.stringify(emptyValue)}"`, async () => {
          const sut = usePromise(async () => emptyValue);

          await sut.trigger();

          expect(sut.status.value).toBe('empty');
          expect(sut.value.value).toStrictEqual(emptyValue);
          expect(sut.error.value).toBeUndefined();
        });
      }
    });

    it('should enter an empty state when the content matches the empty predicate', async () => {
      const sut = usePromise(
        async () => 'success',
        { emptyPredicate: mockEmptyPredicate },
      );

      await sut.trigger();

      expect(mockEmptyPredicate).toHaveBeenCalledOnce();

      expect(sut.status.value).toBe('empty');
      expect(sut.value.value).toBe('success');
      expect(sut.error.value).toBeUndefined();
    });

    it('should enter an error state when the trigger throws', async () => {
      const trigger = vi.fn(async () => _throw('failure'));
      const sut = usePromise(trigger);

      await sut.trigger();

      expect(trigger).toHaveBeenCalledOnce();

      expect(sut.status.value).toBe('error');
      expect(sut.value.value).toBeUndefined();
      expect(sut.error.value).toBe('failure');
    });
  });

  describe('State machine (advanced states)', () => {
    it('should enter a refreshing state while waiting for a re-trigger from content', async () => {
      const trigger = vi.fn(() => stall());
      const sut = usePromise(trigger, { keySelector: mockKeySelector });

      const call = sut.trigger();
      trigger.mock.results[0]?.value.resolve('success');
      await call;

      expect(sut.status.value).toBe('content');

      // noinspection ES6MissingAwait
      sut.trigger();

      expect(trigger).toHaveBeenCalledTimes(2);
      expect(sut.status.value).toBe('refreshing');
      expect(sut.value.value).toBe('success');
      expect(sut.error.value).toBeUndefined();
    });

    it('should enter a loading state while waiting for a re-trigger from empty', async () => {
      const trigger = vi.fn(() => stall());
      const sut = usePromise(trigger, { keySelector: mockKeySelector });

      const call = sut.trigger();
      trigger.mock.results[0]?.value.resolve(null);
      await call;

      // noinspection ES6MissingAwait
      sut.trigger();

      expect(trigger).toHaveBeenCalledTimes(2);

      expect(sut.status.value).toBe('loading');
      expect(sut.value.value).toBeUndefined();
      expect(sut.error.value).toBeUndefined();
    });

    it('should enter a retrying state while waiting for a re-trigger from error', async () => {
      const trigger = vi.fn(() => stall());
      const sut = usePromise(trigger, { keySelector: mockKeySelector });

      const call = sut.trigger();
      trigger.mock.results[0]?.value.reject('failure');
      await call;

      // noinspection ES6MissingAwait
      sut.trigger();

      expect(trigger).toHaveBeenCalledTimes(2);

      expect(sut.status.value).toBe('retrying');
      expect(sut.value.value).toBeUndefined();
      expect(sut.error.value).toBe('failure');
    });
  });

  describe('Caching', () => {
    it('should set a cache key when the trigger is called', () => {
      const sut = usePromise(() => stall());

      const previousKey = sut.state.value.cacheKey;
      sut.trigger();

      expect(sut.state.value.cacheKey).not.toBe(previousKey);
    });

    it('should not change the cache key on resolve', async () => {
      const sut = usePromise(
        async () => 'success',
        { keySelector: mockKeySelector },
      );

      const call = sut.trigger();
      const previousKey = sut.state.value.cacheKey;
      await call;

      expect(mockKeySelector).toHaveBeenCalledOnce();
      expect(sut.state.value.cacheKey).toBe(previousKey);
    });

    it('should not change the cache key on reject', async () => {
      const sut = usePromise(
        async () => _throw('failure'),
        { keySelector: mockKeySelector },
      );

      const call = sut.trigger();
      const previousKey = sut.state.value.cacheKey;
      await call;

      expect(mockKeySelector).toHaveBeenCalledOnce();
      expect(sut.state.value.cacheKey).toBe(previousKey);
    });

    it('should clear the cache on re-trigger when key changes', async () => {
      const sut = usePromise(async () => 'success');

      await sut.trigger();
      const previousKey = sut.state.value.cacheKey;
      // noinspection ES6MissingAwait
      sut.trigger();

      expect(sut.state.value.cacheKey).not.toBe(previousKey);
      expect(sut.status.value).toBe('loading');
      expect(sut.value.value).toBeUndefined();
      expect(sut.error.value).toBeUndefined();
    });

    it('should use first param as cache key if available by default', async () => {
      const sut = usePromise(async (arg1: string) => arg1);

      await sut.trigger('key');

      expect(sut.state.value.cacheKey).toBe('key');
    });
  });

  describe('Safeties', () => {
    it('should not re-trigger while loading for the same key', async () => {
      const trigger = vi.fn(() => stall());
      const sut = usePromise(trigger, { keySelector: mockKeySelector });

      // noinspection ES6MissingAwait
      sut.trigger();
      // noinspection ES6MissingAwait
      sut.trigger();

      expect(trigger).toHaveBeenCalledOnce();

      expect(sut.status.value).toBe('loading');
    });

    it('should not re-trigger while refreshing for the same key', async () => {
      const trigger = vi.fn(() => stall());
      const sut = usePromise(trigger, { keySelector: mockKeySelector });

      const call = sut.trigger();
      trigger.mock.results[0]?.value.resolve('success');
      await call;
      trigger.mockRestore();

      // noinspection ES6MissingAwait
      sut.trigger();
      // noinspection ES6MissingAwait
      sut.trigger();

      expect(trigger).toHaveBeenCalledOnce();

      expect(sut.status.value).toBe('refreshing');
    });

    it('should not re-trigger while retrying for the same key', async () => {
      const trigger = vi.fn(() => stall());
      const sut = usePromise(trigger, { keySelector: mockKeySelector });

      const call = sut.trigger();
      trigger.mock.results[0]?.value.reject('failure');
      await call;
      trigger.mockRestore();

      // noinspection ES6MissingAwait
      sut.trigger();
      // noinspection ES6MissingAwait
      sut.trigger();

      expect(trigger).toHaveBeenCalledOnce();

      expect(sut.status.value).toBe('retrying');
    });

    it('should not update when trigger resolves out of turn', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const trigger = vi.fn((_: string) => stall());
      const sut = usePromise(trigger);

      const call1 = sut.trigger('key1');
      const call2 = sut.trigger('key2');

      trigger.mock.results[1]?.value.resolve('success2');
      trigger.mock.results[0]?.value.resolve('success1');

      await call1;
      await call2;

      expect(sut.status.value).toBe('content');
      expect(sut.state.value.cacheKey).toBe('key2');
      expect(sut.value.value).toBe('success2');
    });

    it('should not update when trigger rejects out of turn', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const trigger = vi.fn((_: string) => stall());
      const sut = usePromise(trigger);

      const call1 = sut.trigger('key1');
      const call2 = sut.trigger('key2');

      trigger.mock.results[1]?.value.reject('failure2');
      trigger.mock.results[0]?.value.reject('failure1');

      await call1;
      await call2;

      expect(sut.status.value).toBe('error');
      expect(sut.state.value.cacheKey).toBe('key2');
      expect(sut.error.value).toBe('failure2');
    });
  });
});
