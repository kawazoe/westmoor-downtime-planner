import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { can, Permissions, UserProfile } from '../services/business/auth.service';

@Pipe({
  name: 'can',
  pure: true
})
export class CanPipe implements PipeTransform {
  /**
   * Returns whether a user has a given permission.
   * @param value
   * @param permission
   */
  transform(value: UserProfile, permission: Permissions): boolean;
  /**
   * Returns whether a user has a given permission.
   * @param value
   * @param permission
   */
  transform(value: Observable<UserProfile>, permission: Permissions): Observable<boolean>;
  transform(value: any, permission: Permissions): boolean | Observable<boolean> {
    return can(permission)(value);
  }
}
