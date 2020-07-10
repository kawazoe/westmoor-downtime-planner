import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: true
})
export class FilterPipe implements PipeTransform {
  transform<T>(collection: T[], predicate: (value: T) => boolean): T[] {
    return collection.filter(predicate);
  }
}
