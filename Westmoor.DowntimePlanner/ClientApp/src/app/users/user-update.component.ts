import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalUpdateComponentBase } from '../modal-edit/modal-update.component';
import { UserResponse } from '../api.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-update.component.html',
})
export class UserUpdateComponent extends ModalUpdateComponentBase<UserResponse> implements OnInit {
  constructor(
    public modalRef: BsModalRef
  ) {
    super(modalRef);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      owner: new FormControl(this.source.owner, Validators.required),
      isRoleAdmin: new FormControl(this.source.roles.includes('Admin'))
    });
  }
}
