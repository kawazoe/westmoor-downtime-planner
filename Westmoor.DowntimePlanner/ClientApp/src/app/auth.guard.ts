import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { map, switchMap, switchMapTo, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.restore()
      .pipe(
        map(user => {
          return next.data.role
            ? !!user && user.roles.includes(next.data.role) || this.router.parseUrl('')
            : true;
        })
      );
  }
}
