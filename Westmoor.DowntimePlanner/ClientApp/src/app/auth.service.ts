import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, OperatorFunction } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { ApiService, UserResponse } from './api.service';

export type Roles =
  'Admin';

export function hasRole(role: Roles): OperatorFunction<UserResponse, boolean> {
  return o => o.pipe(map(u => u && u.roles.includes(role)));
}

const apiKeyStorageId = 'wmdp.apiKey';

function loadFromStorage(key: string) {
  return sessionStorage.getItem(key);
}
function storeInStorage(key: string, value?: string) {
  if (value) {
    sessionStorage.setItem(key, value);
  } else {
    sessionStorage.removeItem(key);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly user = new BehaviorSubject<UserResponse>(null);

  public readonly user$ = this.user.asObservable();

  constructor(
    private api: ApiService
  ) {
  }

  public restore(): Observable<UserResponse> {
    const apiKey = loadFromStorage(apiKeyStorageId);

    if (!apiKey) {
      return of(null);
    }

    return this.user
      .pipe(
        take(1),
        switchMap(user => user?.key === apiKey
          ? of(user)
          : this.signIn(apiKey)
        ),
        catchError(() => {
          storeInStorage(apiKeyStorageId);
          return of(null);
        })
      );
  }

  public signIn(key: string): Observable<UserResponse> {
    return this.api.getUserByKey(key)
      .pipe(
        tap(u => storeInStorage(apiKeyStorageId, u?.key)),
        tap(u => this.user.next(u))
      );
  }

  public signOut(): void {
    if (this.user.getValue()) {
      storeInStorage(apiKeyStorageId);
      this.user.next(null);
    }
  }
}
