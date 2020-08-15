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
        .map(ctrls => ctrls.value)
    };
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.source.name, Validators.required),
      sharedWith: new FormArray(this.source.sharedWith.map(u => new FormControl(u.ownershipId)), Validators.required)
    });
  }
}
