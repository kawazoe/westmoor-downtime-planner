import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalUpdateComponentBase } from '../modal-edit/modal-update.component';
import { ApiKeyResponse, UpdateApiKeyRequest } from '../services/business/api.service';

@Component({
  selector: 'app-api-key-edit',
  templateUrl: './api-key-update.component.html',
})
export class ApiKeyUpdateComponent extends ModalUpdateComponentBase<ApiKeyResponse, UpdateApiKeyRequest> implements OnInit {
  public FormArrayType = FormArray;

  constructor(
    public modalRef: BsModalRef
  ) {
    super(modalRef);
  }

  protected serialize(form: FormGroup): UpdateApiKeyRequest {
    return {
      owner: form.controls.owner.value,
      roles: form.controls.isRoleAdmin.value ? ['Admin'] : [],
      sharedWith: (form.controls.sharedWith as FormArray).controls
        .map(ctrls => ctrls.value)
    };
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      owner: new FormControl(this.source.owner, Validators.required),
      isRoleAdmin: new FormControl(this.source.roles.includes('Admin')),
      sharedWith: new FormArray(this.source.sharedWith.map(id => new FormControl(id)), Validators.required)
    });
  }
}
