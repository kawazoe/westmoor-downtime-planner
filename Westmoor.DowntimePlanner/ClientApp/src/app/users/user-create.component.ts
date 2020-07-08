import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalCreateComponentBase } from '../modal-edit/modal-create.component';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
})
export class UserCreateComponent extends ModalCreateComponentBase implements OnInit {
  constructor(
    public modalRef: BsModalRef
  ) {
    super(modalRef);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      owner: new FormControl('', Validators.required),
      isRoleAdmin: new FormControl(false)
    });
  }
}
