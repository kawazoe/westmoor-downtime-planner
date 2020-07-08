import { Directive } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { UserResponse } from '../api.service';
import { tap } from 'rxjs/operators';

@Directive({
  selector: '[appModalEdit]'
})
export class ModalUpdateComponentBase<T> {
  public source: T;
  public form: FormGroup;
  public processing = false;
  public onSave = (form: FormGroup) => of(null);

  constructor(
    public modalRef: BsModalRef
  ) {
  }

  public confirm() {
    this.processing = true;
    this.onSave(this.form)
      .pipe(
        tap(() => this.modalRef.hide(), () => { this.processing = false; })
      )
      .subscribe();
  }
}
