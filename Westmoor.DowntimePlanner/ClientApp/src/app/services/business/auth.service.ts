import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';
import createAuth0Client from '@auth0/auth0-spa-js';
import { BehaviorSubject, combineLatest, from, isObservable, Observable, of, throwError } from 'rxjs';
import { catchError, first, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { capitalize } from '../../../lib/string';
import { OperatorProjection } from '../../../lib/rxjs/types';
import { environment } from '../../../environments/environment';
import { AnalyticsService } from './analytics.service';

export interface UserProfile {
  sub: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;

  'https://westmoor.rpg/ownership_id': string;
  'https://westmoor.rpg/permissions': string[];
}

export const Permissions = [
  'read:activities',
  'read:characters',
  'read:downtimes',
  'read:users',
  'write:activities',
  'write:characters',
  'write:downtimes',
  'write:apikeys',
] as const;
export type Permissions = typeof Permissions[number];

export function toHtmlId(permission: Permissions) {
  return 'is' + permission
    .split(':')
    .map(v => capitalize(v))
    .join('_');
}

export function can(permission: Permissions): OperatorProjection<UserProfile, boolean> {
  const selector = user => user && user['https://westmoor.rpg/permissions']?.includes(permission);

  function _can(user: UserProfile): boolean;
  function _can(observable: Observable<UserProfile>): Observable<boolean>;
  function _can(userOrObservable) {
    if (isObservable<UserProfile>(userOrObservable)) {
      return map(selector)(userOrObservable);
    }

    return selector(userOrObservable);
  }

  return _can;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clientOptions = {
    domain: environment.oidc.authority,
    client_id: environment.oidc.client_id,
    redirect_uri: `${window.location.origin}${environment.oidc.redirect_url}`,
    audience: environment.oidc.audience
  };
  private logoutOptions = {
    client_id: environment.oidc.client_id,
    returnTo: `${window.location.origin}`
  };

  public auth0Client$ = from(createAuth0Client(this.clientOptions))
    .pipe(
      shareReplay(1),
      catchError(err => throwError(err))
    );

  public isAuthenticated$ = this.auth0Client$
    .pipe(
      switchMap(c => from(c.isAuthenticated()))
    );

  public handleRedirectCallback$ = this.auth0Client$
    .pipe(
      switchMap(c => from(c.handleRedirectCallback()))
    );

  public accessToken$ = this.auth0Client$
    .pipe(
      switchMap(c => from(c.getTokenSilently()))
    ) as Observable<string>;

  public signOut$ = this.auth0Client$
    .pipe(
      first(),
      map(c => {
        this.analytics.clearUserContext();
        c.logout(this.logoutOptions);
      })
    );

  public getUser$ = this.auth0Client$
    .pipe(
      switchMap(c => from(c.getUser())),
      tap(u => {
        this.analytics.setUserContext(u['https://westmoor.rpg/ownership_id'] || u.sub);
        this.userSubject.next(u);
      })
    ) as Observable<UserProfile>;

  private userSubject = new BehaviorSubject<UserProfile>(null);

  public user$ = this.userSubject.asObservable();

  constructor(
    private readonly analytics: AnalyticsService
  ) {
    // Set up local auth streams
    this.localAuthSetup();
  }

  public signIn(redirectPath: string = '/') {
    // A desired redirect path can be passed to login method
    // (e.g., from a route guard)
    // Ensure Auth0 client instance exists
    return this.auth0Client$
      .pipe(
        map(client => {
          // Call method to log in
          client.loginWithRedirect({
            redirect_uri: `${window.location.origin}${environment.oidc.redirect_url}`,
            appState: { target: redirectPath }
          });
        })
      );
  }

  public handleAuthCallback(query: ParamMap) {
    // Call when app reloads after user logs in with Auth0
    if (query.has('code') && query.has('state')) {
      return this.handleRedirectCallback$
        .pipe(
          switchMap(cbRes => combineLatest([
            this.getUser$,
            of(cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/')
          ]))
        );
    }

    return of([]);
  }

  private localAuthSetup() {
    // This should only be called on app initialization
    // Set up local authentication streams
    this.isAuthenticated$
      .pipe(
        switchMap(isAuthenticated => isAuthenticated
          ? this.getUser$
          : of(isAuthenticated)
        )
      )
      .subscribe();
  }
}
