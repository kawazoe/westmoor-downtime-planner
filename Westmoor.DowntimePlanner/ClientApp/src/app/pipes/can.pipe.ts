import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { can, UserProfile } from '../services/business/auth.service';

@Pipe({
  name: 'can',
  pure: true
})
export class CanPipe implements PipeTransform {
  transform(value: UserProfile, permission: string): boolean;
  transform(value: Observable<UserProfile>, permission: string): Observable<boolean>;
  transform(value: any, permission: string): boolean | Observable<boolean> {
    return can(permission)(value);
  }
}
