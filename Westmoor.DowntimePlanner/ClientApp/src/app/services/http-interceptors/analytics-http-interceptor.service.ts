import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnalyticsService } from '../business/analytics.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsHttpInterceptorService implements HttpInterceptor {
  constructor(private analytics: AnalyticsService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const start = new Date();

    return next.handle(req)
      .pipe(
        tap(event => {
          if (event.type === HttpEventType.Response) {
            this.analytics.trackDependencyData({
              name: req.method,
              target: req.url,
              responseCode: event.status,
              success: event.ok,
              type: 'HTTP',
              data: req.urlWithParams,
              duration: new Date().getTime() - start.getTime(),
              properties: {
                HAS_AUTHORIZATION_HEADER: req.headers.has('Authorization')
              }
            });
          }
        })
      );
  }
}
