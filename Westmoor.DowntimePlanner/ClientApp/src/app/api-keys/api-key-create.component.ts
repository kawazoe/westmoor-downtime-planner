import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalCreateComponentBase } from '../modal-edit/modal-create.component';
import { CreateApiKeyRequest } from '../services/business/api.service';

@Component({
  selector: 'app-api-key-create',
  templateUrl: './api-key-create.component.html',
})
export class ApiKeyCreateComponent extends ModalCreateComponentBase<CreateApiKeyRequest> implements OnInit {
  public FormArrayType = FormArray;

  constructor(
    public modalRef: BsModalRef
  ) {
    super(modalRef);
  }

  protected serialize(form: FormGroup): CreateApiKeyRequest {
    return {
      owner: form.controls.owner.value,
      roles: form.controls.isRoleAdmin.value ? ['Admin'] : [],
      sharedWith: (form.controls.sharedWith as FormArray).controls
        .map(ctrls => ctrls.value)
    };
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      owner: new FormControl('', Validators.required),
      isRoleAdmin: new FormControl(false),
      sharedWith: new FormArray([])
    });
  }
}
