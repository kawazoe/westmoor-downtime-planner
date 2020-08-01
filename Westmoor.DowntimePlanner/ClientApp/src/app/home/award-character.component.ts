import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AwardCharacterRequest } from '../services/business/api.service';

@Component({
  selector: 'app-award-character',
  templateUrl: './award-character.component.html',
})
export class AwardCharacterComponent {
  public form = new FormGroup({
    downtimeDays: new FormControl('5', [Validators.required, Validators.min(1)])
  });
  public processing = false;
  public onAward = (result: AwardCharacterRequest) => of(null);

  constructor(
    public modalRef: BsModalRef
  ) {
  }

  public award() {
    this.processing = true;
    this.onAward({
        delta: parseInt(this.form.controls.downtimeDays.value, 10)
      })
      .pipe(
        tap(() => this.modalRef.hide(), () => { this.processing = false; })
      )
      .subscribe();
  }
}
