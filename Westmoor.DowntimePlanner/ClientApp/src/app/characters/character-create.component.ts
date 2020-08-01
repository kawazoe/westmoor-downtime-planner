import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalCreateComponentBase } from '../modal-edit/modal-create.component';
import { CreateCharacterRequest } from '../services/business/api.service';

@Component({
  selector: 'app-character-create',
  templateUrl: './character-create.component.html',
})
export class CharacterCreateComponent extends ModalCreateComponentBase<CreateCharacterRequest> implements OnInit {
  public FormArrayType = FormArray;

  constructor(
    public modalRef: BsModalRef
  ) {
    super(modalRef);
  }

  protected serialize(form: FormGroup): CreateCharacterRequest {
    return {
      playerFullName: form.controls.playerFullName.value,
      characterFullName: form.controls.characterFullName.value,
      sharedWith: (form.controls.sharedWith as FormArray).controls
        .map(ctrls => ctrls.value)
    };
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      playerFullName: new FormControl('', Validators.required),
      characterFullName: new FormControl('', Validators.required),
      sharedWith: new FormArray([])
    });
  }
}
