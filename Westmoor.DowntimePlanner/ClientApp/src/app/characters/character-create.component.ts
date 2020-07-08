import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalCreateComponentBase } from '../modal-edit/modal-create.component';

@Component({
  selector: 'app-character-create',
  templateUrl: './character-create.component.html',
})
export class CharacterCreateComponent extends ModalCreateComponentBase implements OnInit {
  constructor(
    public modalRef: BsModalRef
  ) {
    super(modalRef);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      playerFullName: new FormControl('', Validators.required),
      characterFullName: new FormControl('', Validators.required)
    });
  }
}
