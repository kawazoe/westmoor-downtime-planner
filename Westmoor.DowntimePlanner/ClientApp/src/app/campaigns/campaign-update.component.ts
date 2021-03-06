import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalUpdateComponentBase } from '../components/modal-edit/modal-update.component';
import { CampaignResponse, UpdateCampaignRequest } from '../services/business/api.service';

@Component({
  selector: 'app-campaign-edit',
  templateUrl: './campaign-update.component.html',
})
export class CampaignUpdateComponent extends ModalUpdateComponentBase<CampaignResponse, UpdateCampaignRequest> implements OnInit {
  public FormGroupType = FormGroup;
  public FormArrayType = FormArray;

  constructor(
    public modalRef: BsModalRef
  ) {
    super(modalRef);
  }

  protected serialize(form: FormGroup): UpdateCampaignRequest {
    return {
      name: form.controls.name.value,
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
      name: new FormControl(this.source.name, Validators.required),
      sharedWith: new FormArray(
        this.source.sharedWith
          .map(u => new FormGroup({
            kind: new FormControl(u.kind),
            ownershipId: new FormControl(u.ownershipId),
            picture: new FormControl(u.picture),
            email: new FormControl(u.email),
            username: new FormControl(u.username),
            name: new FormControl(u.name)
          })),
        Validators.required
      )
    });
  }
}
