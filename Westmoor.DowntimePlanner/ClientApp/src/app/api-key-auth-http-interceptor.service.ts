import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

function whitelist(url: string) {
  return url.startsWith('/api');
}

@Injectable({
  providedIn: 'root'
})
export class ApiKeyAuthHttpInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!whitelist(req.url)) {
      return next.handle(req);
    }

    return this.auth.user$
      .pipe(
        take(1),
        switchMap(user => next.handle(user
          ? req.clone({ headers: req.headers.set('X-Api-Key', user.key) })
          : req
        ))
      );
  }
}
