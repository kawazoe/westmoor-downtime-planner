import { Injectable } from '@angular/core';
import { identity, OperatorFunction, Subject } from 'rxjs';
import { filter, repeatWhen, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  private _refreshSubject = new Subject<string | undefined>();

  public trigger(theme?: string) {
    this._refreshSubject.next(theme);
  }

  public onNext<T>(themeSelector?: (v: T) => string): OperatorFunction<T, T> {
    return tap(v => this.trigger(themeSelector?.(v)));
  }

  public listen<T>(themeSelector?: (t: string) => boolean): OperatorFunction<T, T> {
    const notifier = this._refreshSubject.pipe(
      themeSelector ? filter(themeSelector) : identity
    );
    return repeatWhen(() => notifier);
  }
}
