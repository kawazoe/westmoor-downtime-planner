import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import { from, Observable, of, OperatorFunction, ReplaySubject, throwError } from 'rxjs';
import { catchError, first, map, multicast, refCount, shareReplay, switchMap } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { ParamMap } from '@angular/router';

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
}

export function hasRole(role: string): OperatorFunction<UserProfile, boolean> {
  return map(user => true);
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
      map(c => { c.logout(this.logoutOptions); })
    );

  public user$ = this.auth0Client$
    .pipe(
      switchMap(c => from(c.getUser())),
      multicast(() => new ReplaySubject(1)),
      refCount()
    ) as Observable<UserProfile>;

  constructor() {
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
    const params = window.location.search;
    if (query.has('code') && query.has('state')) {
      return this.handleRedirectCallback$
        .pipe(
          map(cbRes => {
            return cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
          })
        );
    }

    return of(null);
  }

  private localAuthSetup() {
    // This should only be called on app initialization
    // Set up local authentication streams
    this.isAuthenticated$
      .pipe(
        switchMap(isAuthenticated => isAuthenticated
          ? this.user$
          : of(isAuthenticated)
        )
      )
      .subscribe();
  }
}
