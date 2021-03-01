import { Component } from '@angular/core';
import { ActivityResponse, ApiService } from '../services/business/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalDeleteComponent } from '../components/modal-edit/modal-delete.component';
import { ActivityCreateComponent } from './activity-create.component';
import { ActivityUpdateComponent } from './activity-update.component';
import { AuthService } from '../services/business/auth.service';
import { RefreshService } from '../services/business/refresh.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
})
export class ActivitiesComponent {
  private modalRef: BsModalRef;

  public user$ = this.auth.user$;
  public activities$ = this.api.getAllActivities().pipe(this.refresh.listen());

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private modal: BsModalService,
    private refresh: RefreshService
  ) {
  }

  public create() {
    this.modalRef = this.modal.show(ActivityCreateComponent);
    this.modalRef.content.onSave = request => this.api
      .createActivity(request)
      .pipe(this.refresh.onNext());
  }

  public edit(activity: ActivityResponse) {
    this.modalRef = this.modal.show(ActivityUpdateComponent, { initialState: { source: activity } });
    this.modalRef.content.onSave = request => this.api
      .updateActivity(activity.id, request)
      .pipe(this.refresh.onNext());
  }

  public delete(activity: ActivityResponse) {
    const id = activity.name;
    this.modalRef = this.modal.show(ModalDeleteComponent, { initialState: { type: 'activity', id } });
    this.modalRef.content.onConfirm = () => this.api
      .deleteActivity(activity.idp, activity.id)
      .pipe(this.refresh.onNext());
  }
}
