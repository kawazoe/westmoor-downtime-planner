import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { can, UserProfile } from '../auth.service';

@Pipe({
  name: 'can',
  pure: true
})
export class CanPipe implements PipeTransform {
  transform(value: Observable<UserProfile>, permission: string): Observable<boolean> {
    return can(permission)(value);
  }
}
