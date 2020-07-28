import { Type } from '@angular/core';
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

/**
 * Returns all elements in a source collection that are instances of the
 * provided constructor function.
 * @param constructor
 */
export function ofType<T>(
  constructor: Type<T>
): (source: any[]) => T[] {
  return source => source.filter(e => e instanceof constructor);
}

/**
 * Return the name, usually the class name, of the constructor function
 * used to create the provided instance.
 * @param instance
 */
export function constructorName<T>(instance: T): string {
  return (instance as any).prototype.constructor.name;
}
