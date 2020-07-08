import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, OperatorFunction } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService, UserResponse } from './api.service';

export type Roles =
  'Admin';

export function hasRole(role: Roles): OperatorFunction<UserResponse, boolean> {
  return o => o.pipe(map(u => u && u.roles.includes(role)));
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

  public signIn(key: string): Observable<UserResponse> {
    return this.api.getUserByKey(key)
      .pipe(
        tap(u => this.user.next(u))
      );
  }

  public signOut(): void {
    if (this.user.getValue()) {
      this.user.next(null);
    }
  }
}
