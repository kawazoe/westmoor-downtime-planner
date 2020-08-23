import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalCreateComponentBase } from '../components/modal-edit/modal-create.component';
import { ModalDeleteComponent } from '../components/modal-edit/modal-delete.component';
import { ActivityCostKinds, CreateActivityRequest } from '../services/business/api.service';

@Component({
  selector: 'app-activity-create',
  templateUrl: './activity-create.component.html',
})
export class ActivityCreateComponent extends ModalCreateComponentBase<CreateActivityRequest> implements OnInit {
  public FormGroupType = FormGroup;
  public FormArrayType = FormArray;
  public ActivityCostKinds = ActivityCostKinds;

  constructor(
    public modalRef: BsModalRef,
    private modal: BsModalService
  ) {
    super(modalRef);
  }

  protected serialize(form: FormGroup): CreateActivityRequest {
    return {
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
        })),
      sharedWith: (form.controls.sharedWith as FormArray).controls
        .map(ctrl => ctrl as FormGroup)
        .map(c => ({
          kind: c.controls.kind.value,
          ownershipId: c.controls.ownershipId.value
        }))
    };
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      descriptionMarkdown: new FormControl(''),
      complicationMarkdown: new FormControl(''),
      costs: new FormArray([], Validators.required),
      sharedWith: new FormArray([])
    });

    this.addCost(this.form);
  }

  public addCost(parentForm: FormGroup) {
    const costForm = new FormGroup({
      kind: new FormControl('', Validators.required),
      jexlExpression: new FormControl('', Validators.required),
      parameters: new FormArray([])
    });

    (parentForm.controls.costs as FormArray).push(costForm);
  }

  public removeCost(parentForm: FormGroup, costForm: FormGroup) {
    const id = costForm.controls.kind.value;
    this.modalRef = this.modal.show(ModalDeleteComponent, { initialState: { type: 'cost', id } });
    this.modalRef.content.onConfirm = () => {
      const collection = (parentForm.controls.costs as FormArray);
      collection.removeAt(collection.controls.indexOf(costForm));
    };
  }

  public addParameter(parentForm: FormGroup) {
    const parameterForm = new FormGroup({
      variableName: new FormControl('', Validators.required),
      description: new FormControl('')
    });

    (parentForm.controls.parameters as FormArray).push(parameterForm);
  }

  public removeParameter(parentForm: FormGroup, parameterForm: FormGroup) {
    const id = parameterForm.controls.variableName.value;
    this.modalRef = this.modal.show(ModalDeleteComponent, { initialState: { type: 'parameter', id } });
    this.modalRef.content.onConfirm = () => {
      const collection = (parentForm.controls.parameters as FormArray);
      collection.removeAt(collection.controls.indexOf(parameterForm));
    };
  }
}
