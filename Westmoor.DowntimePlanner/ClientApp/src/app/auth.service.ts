import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService, UserResponse } from './api.service';

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
    this.user.next(null);
  }
}
