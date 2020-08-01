import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'includes',
  pure: true
})
export class IncludesPipe implements PipeTransform {
  transform<T>(collection: T[], candidate: T): boolean {
    return collection.includes(candidate);
  }
}
