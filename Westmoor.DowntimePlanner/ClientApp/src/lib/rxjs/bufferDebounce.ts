import { OperatorFunction, race } from 'rxjs';
import { bufferWhen, debounceTime, delay, filter, first, share } from 'rxjs/operators';

export function bufferDebounce<T>(closingPredicate: (next: T) => boolean, closingDueTime: number): OperatorFunction<T, T[]> {
  return o => {
    const shared = share<T>()(o);
    return bufferWhen<T>(() => race(
      first()(filter(closingPredicate)(delay<T>(0)(shared))),
      first()(debounceTime(closingDueTime)(shared))
    ))(shared);
  };
}
