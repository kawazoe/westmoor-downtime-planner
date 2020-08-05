import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { defer, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
})
export class ModalDeleteComponent {
  public type: string;
  public id: string | string[];
  public processing = false;
  public onConfirm = () => of(null);

  constructor(
    public modalRef: BsModalRef
  ) {
  }

  public confirm() {
    this.processing = true;

    defer(() => this.onConfirm() ?? of(null))
      .pipe(
        tap(() => this.modalRef.hide(), () => { this.processing = false; })
      )
      .subscribe();
  }
}
