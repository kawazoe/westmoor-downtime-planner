import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ModalDeleteComponent } from '../components/modal-edit/modal-delete.component';
import {
  ActivityCostKinds,
  AdvanceDowntimeBatchRequest,
  DowntimeResponse
} from '../services/business/api.service';

@Component({
  selector: 'app-advance-downtime',
  templateUrl: './advance-downtime.component.html',
})
export class AdvanceDowntimeComponent {
  public FormArrayType = FormArray;
  public FormGroupType = FormGroup;
  public ActivityCostKinds = ActivityCostKinds;

  public downtimes: DowntimeResponse[];
  public form = new FormGroup({
    costs: new FormArray([], Validators.required)
  });
  public processing = false;
  public onAward = (result: AdvanceDowntimeBatchRequest) => of(null);

  constructor(
    public modalRef: BsModalRef,
    private modal: BsModalService
  ) {
  }

  public award() {
    this.processing = true;
    this.onAward({
        ids: this.downtimes.map(d => d.id),
        request: {
          costs: (this.form.controls.costs as FormArray).controls
            .map(ctrl => ctrl as FormGroup)
            .map(cost => ({
              activityCostKind: cost.controls.activityCostKind.value,
              delta: parseInt(cost.controls.delta.value, 10)
            }))
        }
      })
      .pipe(
        tap(() => this.modalRef.hide(), () => { this.processing = false; })
      )
      .subscribe();
  }

  addCost(parentForm: FormGroup) {
    const costForm = new FormGroup({
      activityCostKind: new FormControl('', Validators.required),
      delta: new FormControl('', Validators.required)
    });

    (parentForm.controls.costs as FormArray).push(costForm);
  }

  removeCost(parentForm: FormGroup, costForm: FormGroup) {
    const id = costForm.controls.activityCostKind.value;
    this.modalRef = this.modal.show(ModalDeleteComponent, { initialState: { type: 'cost', id } });
    this.modalRef.content.onConfirm = () => {
      const collection = (parentForm.controls.costs as FormArray);
      collection.removeAt(collection.controls.indexOf(costForm));
    };
  }
}
