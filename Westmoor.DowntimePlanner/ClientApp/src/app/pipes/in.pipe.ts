import { Pipe, PipeTransform } from '@angular/core';

type DistributeKeyOf<TUnion> = TUnion extends any ? keyof TUnion : never;

@Pipe({
  name: 'in',
  pure: true
})
export class InPipe implements PipeTransform {
  /**
   * Returns whether a property is in the piped object.
   * @param value
   * @param propertyName HACK: need the string type since JetBrains IDEs
   *                     doesn't handle conditional union type expansion.
   */
  transform<T>(value: T, propertyName: DistributeKeyOf<T> | string): boolean {
    return propertyName in value;
  }
}
