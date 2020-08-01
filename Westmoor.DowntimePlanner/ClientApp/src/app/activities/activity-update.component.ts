import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalUpdateComponentBase } from '../modal-edit/modal-update.component';
import {
  ActivityCostResponse,
  ActivityParameterResponse,
  ActivityResponse,
  UpdateActivityRequest
} from '../services/business/api.service';
import { ModalDeleteComponent } from '../modal-edit/modal-delete.component';

@Component({
  selector: 'app-activity-edit',
  templateUrl: './activity-update.component.html',
})
export class ActivityUpdateComponent extends ModalUpdateComponentBase<ActivityResponse, UpdateActivityRequest> implements OnInit {
  public FormGroupType = FormGroup;
  public FormArrayType = FormArray;

  constructor(
    public modalRef: BsModalRef,
    private modal: BsModalService
  ) {
    super(modalRef);
  }

  protected serialize(form: FormGroup): UpdateActivityRequest {
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
        .map(ctrls => ctrls.value)
    };
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.source.name, Validators.required),
      descriptionMarkdown: new FormControl(this.source.descriptionMarkdown),
      complicationMarkdown: new FormControl(this.source.complicationMarkdown),
      costs: new FormArray([]),
      sharedWith: new FormArray(this.source.sharedWith.map(id => new FormControl(id)), Validators.required)
    });

    for (const cost of this.source.costs) {
      this.addCost(this.form, cost);
    }
  }

  public addCost(parentForm: FormGroup, cost?: ActivityCostResponse) {
    const costForm = new FormGroup({
      kind: new FormControl(cost?.kind || '', Validators.required),
      jexlExpression: new FormControl(cost?.jexlExpression || '', Validators.required),
      parameters: new FormArray([])
    });

    for (const parameter of cost?.parameters || []) {
      this.addParameter(costForm, parameter);
    }

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

  public addParameter(parentForm: FormGroup, parameter?: ActivityParameterResponse) {
    const parameterForm = new FormGroup({
      variableName: new FormControl(parameter?.variableName || '', Validators.required),
      description: new FormControl(parameter?.description || '')
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
