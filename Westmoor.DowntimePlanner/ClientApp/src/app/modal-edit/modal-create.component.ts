import { Directive } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Directive({
  selector: '[appModalCreate]'
})
export class ModalCreateComponentBase<TRequest> {
  public form: FormGroup;
  public processing = false;
  public onSave: (request: TRequest) => Observable<void>;
  protected serialize(form: FormGroup): TRequest { return null; }

  constructor(
    public modalRef: BsModalRef
  ) {
  }

  public confirm() {
    this.processing = true;
    this.onSave(this.serialize(this.form))
      .pipe(
        tap(() => this.modalRef.hide(), () => { this.processing = false; })
      )
      .subscribe();
  }
}
