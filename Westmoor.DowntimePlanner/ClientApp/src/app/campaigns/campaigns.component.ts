import { Component } from '@angular/core';
import { CampaignResponse, ApiService } from '../services/business/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalDeleteComponent } from '../components/modal-edit/modal-delete.component';
import { CampaignCreateComponent } from './campaign-create.component';
import { CampaignUpdateComponent } from './campaign-update.component';
import { AuthService } from '../services/business/auth.service';
import { RefreshService } from '../services/business/refresh.service';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
})
export class CampaignsComponent {
  private modalRef: BsModalRef;

  public user$ = this.auth.user$;
  public campaigns$ = this.api.getAllCampaigns().pipe(this.refresh.listen());

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private modal: BsModalService,
    private refresh: RefreshService
  ) {
  }

  public create() {
    this.modalRef = this.modal.show(CampaignCreateComponent);
    this.modalRef.content.onSave = request => this.api
      .createCampaign(request)
      .pipe(this.refresh.onNext());
  }

  public edit(campaign: CampaignResponse) {
    this.modalRef = this.modal.show(CampaignUpdateComponent, { initialState: { source: campaign } });
    this.modalRef.content.onSave = request => this.api
      .updateCampaign(campaign.id, request)
      .pipe(this.refresh.onNext());
  }

  public delete(campaign: CampaignResponse) {
    const id = campaign.name;
    this.modalRef = this.modal.show(ModalDeleteComponent, { initialState: { type: 'campaign', id } });
    this.modalRef.content.onConfirm = () => this.api
      .deleteCampaign(campaign.idp, campaign.id)
      .pipe(this.refresh.onNext());
  }
}
