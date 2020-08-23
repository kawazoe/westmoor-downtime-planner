import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantService } from '../business/tenant.service';
import { switchMap } from 'rxjs/operators';

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

    return this.tenant.actives$
      .pipe(
        switchMap(tenants => next.handle(tenants
          ? req.clone({ headers: req.headers.set('X-Tenant-Id', tenants) })
          : req
        )
      )
    );
  }
}
