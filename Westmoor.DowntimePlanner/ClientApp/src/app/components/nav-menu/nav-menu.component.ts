import { Component } from '@angular/core';
import { AuthService } from '../../services/business/auth.service';
import { TenantService } from '../../services/business/tenant.service';
import { CampaignResponse } from '../../services/business/api.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;

  user$ = this.auth.user$;
  campaigns$ = this.tenant.accessibleCampaigns$;

  constructor(
    private auth: AuthService,
    private tenant: TenantService
  ) {
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  campaignName(campaign: CampaignResponse) {
    return campaign && campaign.name;
  }

  setCampaign(campaign: CampaignResponse) {
    this.tenant.setActives([campaign.id]);
  }
}
