import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalUpdateComponentBase } from '../modal-edit/modal-update.component';
import { CharacterResponse } from '../api.service';

@Component({
  selector: 'app-character-edit',
  templateUrl: './character-update.component.html',
})
export class CharacterUpdateComponent extends ModalUpdateComponentBase<CharacterResponse> implements OnInit {
  constructor(
    public modalRef: BsModalRef
  ) {
    super(modalRef);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      playerFullName: new FormControl(this.source.playerFullName, Validators.required),
      characterFullName: new FormControl(this.source.characterFullName, Validators.required),
      accruedDowntimeDays: new FormControl(this.source.accruedDowntimeDays, [Validators.required, Validators.min(0)])
    });
  }
}
