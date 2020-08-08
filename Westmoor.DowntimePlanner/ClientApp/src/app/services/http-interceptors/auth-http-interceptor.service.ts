import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from '../business/auth.service';
import { AnalyticsService } from '../business/analytics.service';

function whitelist(url: string) {
  return url.startsWith('/api');
}

@Injectable({
  providedIn: 'root'
})
export class AuthHttpInterceptorService implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private analytics: AnalyticsService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!whitelist(req.url)) {
      return next.handle(req);
    }

    return this.auth.user$
      .pipe(
        switchMap((u, i) => {
          if (u) {
            return this.auth.accessToken$;
          }

          this.analytics.trackTrace({
            message: `[AuthHttpInterceptorService] Skipping request to "${req.url}" requiring Authorization header.`,
            properties: {
              AUTHENTICATED: false,
              ATTEMPT: i + 1
            }
          });
          return EMPTY;
        }),
        take(1),
        switchMap(token => next.handle(token && token
          ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
          : req
        ))
      );
  }
}
