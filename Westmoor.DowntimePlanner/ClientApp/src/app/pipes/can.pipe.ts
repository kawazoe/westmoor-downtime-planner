import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { can, Permissions, UserProfile } from '../services/business/auth.service';

@Pipe({
  name: 'can',
  pure: true
})
export class CanPipe implements PipeTransform {
  transform(value: UserProfile, permission: Permissions): boolean;
  transform(value: Observable<UserProfile>, permission: Permissions): Observable<boolean>;
  transform(value: any, permission: Permissions): boolean | Observable<boolean> {
    return can(permission)(value);
  }
}
