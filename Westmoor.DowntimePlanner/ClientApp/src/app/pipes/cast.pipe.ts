import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cast',
  pure: true
})
export class CastPipe implements PipeTransform {
  /**
   * Forces the input value to a target type. Equivalent to "value as TTarget" or "<TTarget>value".
   * @param value
   * @param targetType
   */
  transform<TTarget>(value: any, targetType: TTarget): TTarget {
    return value;
  }
}
