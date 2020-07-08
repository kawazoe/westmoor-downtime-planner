import { Component } from '@angular/core';
import { BehaviorSubject, of, OperatorFunction } from 'rxjs';
import { ActivityResponse, ApiService } from '../api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalDeleteComponent } from '../modal-edit/modal-delete.component';
import { switchMap, tap } from 'rxjs/operators';
import { ActivityCreateComponent } from './activity-create.component';
import { ActivityUpdateComponent } from './activity-update.component';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
})
export class ActivitiesComponent {
  private activities = new BehaviorSubject<ActivityResponse[]>([]);

  private modalRef: BsModalRef;

  public activities$ = this.activities.asObservable();

  constructor(
    private api: ApiService,
    private modal: BsModalService
  ) {
    of(null).pipe(this.refresh()).subscribe();
  }

  public create() {
    this.modalRef = this.modal.show(ActivityCreateComponent);
    this.modalRef.content.onSave = form => this.api
      .createActivity({
        name: form.controls.name.value,
        descriptionMarkdown: form.controls.descriptionMarkdown.value,
        complicationMarkdown: form.controls.complicationMarkdown.value,
        costs: (form.controls.costs as FormArray).controls
          .map(ctrls => (ctrls as FormGroup).controls)
          .map(cost => ({
            kind: cost.kind.value,
            jexlExpression: cost.jexlExpression.value,
            parameters: (cost.parameters as FormArray).controls
              .map(ctrls => (ctrls as FormGroup).controls)
              .map(parameter => ({
                variableName: parameter.variableName.value,
                description: parameter.description.value
              }))
          }))
      })
      .pipe(this.refresh());
  }

  public edit(activity: ActivityResponse) {
    this.modalRef = this.modal.show(ActivityUpdateComponent, { initialState: { source: activity } });
    this.modalRef.content.onSave = form => this.api
      .updateActivity(activity.id, {
        name: form.controls.name.value,
        descriptionMarkdown: form.controls.descriptionMarkdown.value,
        complicationMarkdown: form.controls.complicationMarkdown.value,
        costs: (form.controls.costs as FormArray).controls
          .map(ctrls => (ctrls as FormGroup).controls)
          .map(cost => ({
            kind: cost.kind.value,
            jexlExpression: cost.jexlExpression.value,
            parameters: (cost.parameters as FormArray).controls
              .map(ctrls => (ctrls as FormGroup).controls)
              .map(parameter => ({
                variableName: parameter.variableName.value,
                description: parameter.description.value
              }))
          }))
      })
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
