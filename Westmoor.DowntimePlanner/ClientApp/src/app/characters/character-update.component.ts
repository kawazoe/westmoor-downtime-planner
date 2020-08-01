import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalUpdateComponentBase } from '../modal-edit/modal-update.component';
import { CharacterResponse, UpdateCharacterRequest } from '../api.service';

@Component({
  selector: 'app-character-edit',
  templateUrl: './character-update.component.html',
})
export class CharacterUpdateComponent extends ModalUpdateComponentBase<CharacterResponse, UpdateCharacterRequest> implements OnInit {
  public FormArrayType = FormArray;

  constructor(
    public modalRef: BsModalRef
  ) {
    super(modalRef);
  }

  protected serialize(form: FormGroup): UpdateCharacterRequest {
    return {
      playerFullName: form.controls.playerFullName.value,
      characterFullName: form.controls.characterFullName.value,
      accruedDowntimeDays: parseInt(form.controls.accruedDowntimeDays.value, 10),
      sharedWith: (form.controls.sharedWith as FormArray).controls
        .map(ctrls => ctrls.value)
    };
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      playerFullName: new FormControl(this.source.playerFullName, Validators.required),
      characterFullName: new FormControl(this.source.characterFullName, Validators.required),
      accruedDowntimeDays: new FormControl(this.source.accruedDowntimeDays, [Validators.required, Validators.min(0)]),
      sharedWith: new FormArray(this.source.sharedWith.map(id => new FormControl(id)), Validators.required)
    });
  }
}
