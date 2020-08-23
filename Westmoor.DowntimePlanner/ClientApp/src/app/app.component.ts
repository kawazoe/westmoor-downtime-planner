import { Component, Type } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ChildActivationEnd,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterEvent
} from '@angular/router';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { AnalyticsService } from './services/business/analytics.service';
import { bufferDebounce } from '../lib/rxjs/bufferDebounce';
import { AuthService } from './services/business/auth.service';
import { ofType } from '../lib/rxjs/types';
import { first, last, pipe } from '../lib/functional/';
import { IPageViewTelemetry } from '@microsoft/applicationinsights-web';
import { chain } from '../lib/functional/chain';
import { TenantService } from './services/business/tenant.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    private readonly router: Router,
    private readonly analytics: AnalyticsService,
    private readonly auth: AuthService,
    private readonly tenant: TenantService
  ) {
    this.initAnalyticsContext();
    this.initRouterAnalytics();
  }

  private initAnalyticsContext() {
    combineLatest([
        this.auth.user$,
        this.tenant.actives$
      ])
      .pipe(
        tap(([user, tenantIds]) => {
          if (!user) {
            this.analytics.clearUserContext();
          } else {
            this.analytics.setUserContext(user['https://westmoor.rpg/ownership_id'], tenantIds);
          }
        })
      )
      .subscribe();
  }

  private initRouterAnalytics() {
    this.router.events
      .pipe(
        map(e => {
          if (e instanceof NavigationStart) {
            (e as any).sourceUrl = this.router.url;
          }

          return e;
        }),
        bufferDebounce(e => e instanceof NavigationEnd, 1500),
        filter(events => events && !!events.length),
        switchMap(events => map(isAuthenticated => [events, isAuthenticated])(take(1)(this.auth.isAuthenticated$))),
        map(([events, isAuthenticated]: [RouterEvent[], boolean]) => {
          const navigationStart = firstNavigationStart(events);
          const activationEnd = lastChildActivationEnd(events);
          const navigationEnd = lastNavigationEnd(events);

          return ({
            name: activationEnd ? routeComponentName(activationEnd) : 'missing',
            uri: navigationEnd?.urlAfterRedirects || 'missing',
            refUri: (navigationStart as any)?.sourceUrl || 'missing',
            pageType: 'angularRoute',
            isLoggedIn: isAuthenticated
          }) as IPageViewTelemetry;
        }),
        tap(e => this.analytics.trackPageView(e))
      )
      .subscribe();
  }
}

function getRouteComponent(event: ChildActivationEnd): Type<Component> {
  const recurseSnapshot = (snapshot: ActivatedRouteSnapshot) => {
    if (!snapshot) {
      return null;
    }

    if (snapshot.children.length === 0) {
      return snapshot.component;
    }

    for (const child of snapshot.children) {
      const component = recurseSnapshot(child);

      if (component) {
        return component;
      }
    }

    return null;
  };

  return recurseSnapshot(event.snapshot);
}

const routeComponentName = pipe(
  getRouteComponent,
  c => c['decorators'] as {args: Component[]}[],
  first,
  d => d.args,
  first,
  c => c.selector
);
const firstNavigationStart = chain(first, ofType(NavigationStart));
const lastChildActivationEnd = chain(last, ofType(ChildActivationEnd));
const lastNavigationEnd = chain(last, ofType(NavigationEnd));
