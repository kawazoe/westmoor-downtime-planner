import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalCreateComponentBase } from '../modal-edit/modal-create.component';

@Component({
  selector: 'app-api-key-create',
  templateUrl: './api-key-create.component.html',
})
export class ApiKeyCreateComponent extends ModalCreateComponentBase implements OnInit {
  public FormArrayType = FormArray;

  constructor(
    public modalRef: BsModalRef
  ) {
    super(modalRef);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      owner: new FormControl('', Validators.required),
      isRoleAdmin: new FormControl(false),
      sharedWith: new FormArray([])
    });
  }
}
