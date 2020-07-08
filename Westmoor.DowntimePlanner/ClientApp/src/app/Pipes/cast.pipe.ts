import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cast',
  pure: true
})
export class CastPipe implements PipeTransform {
  transform<TTarget>(value: any, targetType: TTarget): TTarget {
    return value;
  }
}
