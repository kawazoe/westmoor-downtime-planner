import { Component } from '@angular/core';
import { AuthService, hasRole } from '../auth.service';
import { switchMapTo, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UserResponse } from '../api.service';

const apiKeyStorageId = 'wmdp.apiKey';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;

  user$: Observable<UserResponse>;
  isAdmin$ = hasRole('Admin')(this.auth.user$);

  constructor(private auth: AuthService) {
    const apiKey = sessionStorage.getItem(apiKeyStorageId);

    const initialAction = apiKey
      ? this.auth.signIn(apiKey)
      : of(null);

    this.user$ = initialAction
      .pipe(
        switchMapTo(this.auth.user$),
        tap(user => {
          if (user) {
            sessionStorage.setItem(apiKeyStorageId, user.key);
          } else {
            sessionStorage.removeItem(apiKeyStorageId);
          }
        })
      );
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
