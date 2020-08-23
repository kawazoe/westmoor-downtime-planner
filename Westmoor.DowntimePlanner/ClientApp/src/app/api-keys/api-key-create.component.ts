import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalCreateComponentBase } from '../components/modal-edit/modal-create.component';
import { CreateApiKeyRequest } from '../services/business/api.service';
import { Permissions, toHtmlId } from '../services/business/auth.service';

@Component({
  selector: 'app-api-key-create',
  templateUrl: './api-key-create.component.html',
})
export class ApiKeyCreateComponent extends ModalCreateComponentBase<CreateApiKeyRequest> implements OnInit {
  public FormArrayType = FormArray;
  public Permissions = Permissions
    .map(p => ({ scope: p, htmlEncoded: toHtmlId(p) }));

  constructor(
    public modalRef: BsModalRef
  ) {
    super(modalRef);
  }

  protected serialize(form: FormGroup): CreateApiKeyRequest {
    return {
      owner: form.controls.owner.value,
      permissions: Object.entries((form.controls.permissions as FormGroup).controls)
        .filter(([_, control]) => control.value)
        .map(([key, _]) => this.Permissions.find(p => p.htmlEncoded === key)?.scope)
        .filter(s => !!s),
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
      owner: new FormControl('', Validators.required),
      permissions: new FormGroup(Object.fromEntries(this.Permissions
        .map(p => [p.htmlEncoded, new FormControl(false)])
      )),
      sharedWith: new FormArray([])
    });
  }
}
