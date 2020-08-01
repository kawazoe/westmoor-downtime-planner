import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../business/auth.service';

function whitelist(url: string) {
  return url.startsWith('/api');
}

@Injectable({
  providedIn: 'root'
})
export class AuthHttpInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!whitelist(req.url)) {
      return next.handle(req);
    }

    return this.auth.accessToken$
      .pipe(
        catchError(() => of(null)),
        take(1),
        switchMap(token => next.handle(token && token
          ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
          : req
        ))
      );
  }
}
