import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: true
})
export class FilterPipe implements PipeTransform {
  /**
   * Apply a filter predicate on a collection. The predicate is not watched for changes.
   * @param collection
   * @param predicate
   */
  transform<T>(collection: T[], predicate: (value: T) => boolean): T[] {
    return collection.filter(predicate);
  }
}
