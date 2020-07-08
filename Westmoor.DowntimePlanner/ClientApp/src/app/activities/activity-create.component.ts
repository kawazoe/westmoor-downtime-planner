import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalCreateComponentBase } from '../modal-edit/modal-create.component';
import { ModalDeleteComponent } from '../modal-edit/modal-delete.component';

@Component({
  selector: 'app-activity-create',
  templateUrl: './activity-create.component.html',
})
export class ActivityCreateComponent extends ModalCreateComponentBase implements OnInit {
  public FormGroupType = FormGroup;
  public FormArrayType = FormArray;

  constructor(
    public modalRef: BsModalRef,
    private modal: BsModalService
  ) {
    super(modalRef);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      descriptionMarkdown: new FormControl(''),
      complicationMarkdown: new FormControl(''),
      costs: new FormArray([])
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