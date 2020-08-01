import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AwardDowntimeAction {
  downtimeDays: number;
}

@Component({
  selector: 'app-award-downtime',
  templateUrl: './award-downtime.component.html',
})
export class AwardDowntimeComponent {
  public form = new FormGroup({
    downtimeDays: new FormControl('5', [Validators.required, Validators.min(1)])
  });
  public processing = false;
  public onAward = (result: AwardDowntimeAction) => of(null);

  constructor(
    public modalRef: BsModalRef
  ) {
  }

  public award() {
    this.processing = true;
    this.onAward({
        downtimeDays: parseInt(this.form.controls.downtimeDays.value, 10)
      })
      .pipe(
        tap(() => this.modalRef.hide(), () => { this.processing = false; })
      )
      .subscribe();
  }
}
