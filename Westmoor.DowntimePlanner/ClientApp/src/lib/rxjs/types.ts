import { Observable } from 'rxjs';

/**
 * Defines a type similar to an OperatorFunction<TSource, TResult> that can be
 * executed on the fly as a TSource => TResult function.
 *
 * @example
 *  toBoolean(additionParams)(observable) // type of Observable<boolean>;
 *
 * @example
 *  toBoolean(additionParams)(value) // type of boolean;
 */
export type OperatorProjection<TSource, TResult> =
  ((value: TSource) => TResult) &
  ((observable: Observable<TSource>) => Observable<TResult>);
