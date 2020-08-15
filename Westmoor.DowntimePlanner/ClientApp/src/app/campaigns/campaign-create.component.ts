import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalCreateComponentBase } from '../components/modal-edit/modal-create.component';
import { CreateCampaignRequest } from '../services/business/api.service';

@Component({
  selector: 'app-campaign-create',
  templateUrl: './campaign-create.component.html',
})
export class CampaignCreateComponent extends ModalCreateComponentBase<CreateCampaignRequest> implements OnInit {
  public FormGroupType = FormGroup;
  public FormArrayType = FormArray;

  constructor(
    public modalRef: BsModalRef
  ) {
    super(modalRef);
  }

  protected serialize(form: FormGroup): CreateCampaignRequest {
    return {
      name: form.controls.name.value,
      sharedWith: (form.controls.sharedWith as FormArray).controls
        .map(ctrls => ctrls.value)
    };
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      sharedWith: new FormArray([])
    });
  }
}
