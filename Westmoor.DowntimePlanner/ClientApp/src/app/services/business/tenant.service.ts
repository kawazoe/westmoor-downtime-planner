import { Injectable } from '@angular/core';
import { concat, of, ReplaySubject } from 'rxjs';
import { ApiService, CampaignResponse } from './api.service';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private readonly actives = new ReplaySubject<string[]>(1);

  public accessibleTenants$ = this.auth.user$
    .pipe(
      map(u => u && u['https://westmoor.rpg/campaigns'] || []),
      tap(ts => this.actives.next([])),
      shareReplay(1)
    );
  public accessibleCampaigns$ = this.accessibleTenants$
    .pipe(
      switchMap(ts => ts && this.api.getAllCampaigns() || of([])),
      take(1),
      shareReplay(1)
    );

  public actives$ = this.actives.asObservable();
  public activeCampaigns$ = this.actives$
    .pipe(
      switchMap(ts => concat(ts.map(t => this.api.getCampaignById(t)))),
      shareReplay(1)
    );

  constructor(
    private readonly auth: AuthService,
    private readonly api: ApiService
  ) {
  }

  public setActives(tenantIds: string[]) {
    this.actives.next(tenantIds);
  }
}
