import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../business/auth.service';
import { switchMap } from 'rxjs/operators';
import { NEVER } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignInGuard implements CanActivate {
  constructor(
    private auth: AuthService
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.signIn()
      .pipe(
        switchMap(() => NEVER)
      );
  }
}
