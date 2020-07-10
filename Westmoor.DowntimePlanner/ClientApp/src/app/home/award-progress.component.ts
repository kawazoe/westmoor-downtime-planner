import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ModalDeleteComponent } from '../modal-edit/modal-delete.component';
import { ActivityCostKinds } from '../activity-cost-kind-picker/activity-cost-kind-picker.component';

@Component({
  selector: 'app-award-progress',
  templateUrl: './award-progress.component.html',
})
export class AwardProgressComponent {
  public FormArrayType = FormArray;
  public FormGroupType = FormGroup;

  public form = new FormGroup({
    costs: new FormArray([], Validators.required)
  });
  public processing = false;
  public onAward = (form: FormGroup) => of(null);

  constructor(
    public modalRef: BsModalRef,
    private modal: BsModalService
  ) {
  }

  public award() {
    this.processing = true;
    this.onAward(this.form)
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
