import { Component } from '@angular/core';
import { BehaviorSubject, of, OperatorFunction } from 'rxjs';
import { ActivityResponse, ApiService } from '../services/business/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalDeleteComponent } from '../components/modal-edit/modal-delete.component';
import { switchMap, tap } from 'rxjs/operators';
import { ActivityCreateComponent } from './activity-create.component';
import { ActivityUpdateComponent } from './activity-update.component';
import { AuthService } from '../services/business/auth.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
})
export class ActivitiesComponent {
  private activities = new BehaviorSubject<ActivityResponse[]>([]);

  private modalRef: BsModalRef;

  public user$ = this.auth.user$;
  public activities$ = this.activities.asObservable();

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private modal: BsModalService
  ) {
    of(null).pipe(this.refresh()).subscribe();
  }

  public create() {
    this.modalRef = this.modal.show(ActivityCreateComponent);
    this.modalRef.content.onSave = request => this.api
      .createActivity(request)
      .pipe(this.refresh());
  }

  public edit(activity: ActivityResponse) {
    this.modalRef = this.modal.show(ActivityUpdateComponent, { initialState: { source: activity } });
    this.modalRef.content.onSave = request => this.api
      .updateActivity(activity.id, request)
      .pipe(this.refresh());
  }

  public delete(activity: ActivityResponse) {
    this.modalRef = this.modal.show(ModalDeleteComponent, { initialState: { type: 'activity', id: activity.id } });
    this.modalRef.content.onConfirm = () => this.api
      .deleteActivity(activity.id)
      .pipe(this.refresh());
  }

  private refresh(): OperatorFunction<void, ActivityResponse[]> {
    return o => o.pipe(
      switchMap(() => this.api.getAllActivities()),
      tap(as => this.activities.next(as))
    );
  }
}
