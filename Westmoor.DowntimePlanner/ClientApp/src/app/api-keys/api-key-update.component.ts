import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalUpdateComponentBase } from '../components/modal-edit/modal-update.component';
import { ApiKeyResponse, UpdateApiKeyRequest } from '../services/business/api.service';
import { Permissions, toHtmlId } from '../services/business/auth.service';

@Component({
  selector: 'app-api-key-edit',
  templateUrl: './api-key-update.component.html',
})
export class ApiKeyUpdateComponent extends ModalUpdateComponentBase<ApiKeyResponse, UpdateApiKeyRequest> implements OnInit {
  public FormArrayType = FormArray;
  public Permissions = Permissions
    .map(p => ({ scope: p, htmlEncoded: toHtmlId(p) }));

  constructor(
    public modalRef: BsModalRef
  ) {
    super(modalRef);
  }

  protected serialize(form: FormGroup): UpdateApiKeyRequest {
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
      owner: new FormControl(this.source.owner, Validators.required),
      permissions: new FormGroup(Object.fromEntries(this.Permissions
        .map(p => [p.htmlEncoded, new FormControl(this.source.permissions.includes(p.scope))])
      )),
      sharedWith: new FormArray(
        this.source.sharedWith
          .map(u => new FormGroup({
            kind: new FormControl(u.kind),
            ownershipId: new FormControl(u.ownershipId)
          })),
        Validators.required
      )
    });
  }
}
