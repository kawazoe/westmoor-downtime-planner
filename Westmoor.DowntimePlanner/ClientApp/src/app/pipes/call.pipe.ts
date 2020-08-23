import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'call',
  pure: true
})
export class CallPipe implements PipeTransform {
  /**
   * Enables call to functions in bindings without making the expression
   * un-cachable. The function is not watched for changes.
   * @param value
   * @param func
   */
  transform<T, TResult>(value: T, func: (val: T) => TResult): TResult {
    return func(value);
  }
}
