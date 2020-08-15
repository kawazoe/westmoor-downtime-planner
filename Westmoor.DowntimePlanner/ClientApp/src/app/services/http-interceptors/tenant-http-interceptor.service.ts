import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantService } from '../business/tenant.service';
import { switchMap, take } from 'rxjs/operators';

function whitelist(url: string) {
  return url.startsWith('/api');
}

@Injectable({
  providedIn: 'root'
})
export class TenantHttpInterceptorService implements HttpInterceptor {
  constructor(
    private readonly tenant: TenantService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!whitelist(req.url)) {
      return next.handle(req);
    }

    return this.tenant.current
      .pipe(
        take(1),
        switchMap(tenant => next.handle(tenant
          ? req.clone({ headers: req.headers.set('X-Tenant-Id', tenant) })
          : req
        )
      )
    );
  }
}
