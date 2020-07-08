import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
})
export class ModalDeleteComponent {
  public type: string;
  public id: string;
  public processing = false;
  public onConfirm = () => of(null);

  constructor(
    public modalRef: BsModalRef
  ) {
  }

  public confirm() {
    this.processing = true;
    this.onConfirm()
      .pipe(
        tap(() => this.modalRef.hide(), () => { this.processing = false; })
      )
      .subscribe();
  }
}
