import { Pipe, PipeTransform } from '@angular/core';

type BaseTypes = 'undefined' | 'object' | 'boolean' | 'number' | 'string' | 'function' | 'symbol' | 'bigint';

@Pipe({
  name: 'typeof',
  pure: true
})
export class TypeofPipe implements PipeTransform {
  /**
   * Returns whether a property is in the piped object.
   * @param value
   * @param type
   */
  transform<T>(value: T, type: BaseTypes): boolean {
    return typeof value === type;
  }
}
