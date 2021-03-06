import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalUpdateComponentBase } from '../components/modal-edit/modal-update.component';
import { CharacterResponse, UpdateCharacterRequest } from '../services/business/api.service';

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
        .map(ctrl => ctrl as FormGroup)
        .map(c => ({
          kind: c.controls.kind.value,
          ownershipId: c.controls.ownershipId.value
        }))
    };
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      playerFullName: new FormControl(this.source.playerFullName, Validators.required),
      characterFullName: new FormControl(this.source.characterFullName, Validators.required),
      accruedDowntimeDays: new FormControl(this.source.accruedDowntimeDays, [Validators.required, Validators.min(0)]),
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
