import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { NEVER, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap, switchMapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean|UrlTree> | boolean {
    return this.auth.isAuthenticated$.pipe(
      switchMap(loggedIn => {
        if (!loggedIn) {
          return this.auth.signIn()
            .pipe(switchMapTo(NEVER));
        } else {
          return of(true);
        }
      })
    );
  }
}
