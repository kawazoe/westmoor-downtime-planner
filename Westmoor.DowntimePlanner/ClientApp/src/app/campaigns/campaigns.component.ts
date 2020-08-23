import { Component } from '@angular/core';
import { BehaviorSubject, of, OperatorFunction } from 'rxjs';
import { CampaignResponse, ApiService } from '../services/business/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalDeleteComponent } from '../components/modal-edit/modal-delete.component';
import { switchMap, tap } from 'rxjs/operators';
import { CampaignCreateComponent } from './campaign-create.component';
import { CampaignUpdateComponent } from './campaign-update.component';
import { AuthService } from '../services/business/auth.service';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
})
export class CampaignsComponent {
  private campaigns = new BehaviorSubject<CampaignResponse[]>([]);

  private modalRef: BsModalRef;

  public user$ = this.auth.user$;
  public campaigns$ = this.campaigns.asObservable();

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private modal: BsModalService
  ) {
    of(null).pipe(this.refresh()).subscribe();
  }

  public create() {
    this.modalRef = this.modal.show(CampaignCreateComponent);
    this.modalRef.content.onSave = request => this.api
      .createCampaign(request)
      .pipe(this.refresh());
  }

  public edit(campaign: CampaignResponse) {
    this.modalRef = this.modal.show(CampaignUpdateComponent, { initialState: { source: campaign } });
    this.modalRef.content.onSave = request => this.api
      .updateCampaign(campaign.id, request)
      .pipe(this.refresh());
  }

  public delete(campaign: CampaignResponse) {
    const id = campaign.name;
    this.modalRef = this.modal.show(ModalDeleteComponent, { initialState: { type: 'campaign', id } });
    this.modalRef.content.onConfirm = () => this.api
      .deleteCampaign(campaign.idp, campaign.id)
      .pipe(this.refresh());
  }

  private refresh(): OperatorFunction<void, CampaignResponse[]> {
    return o => o.pipe(
      switchMap(() => this.api.getAllCampaigns()),
      tap(as => this.campaigns.next(as))
    );
  }
}
