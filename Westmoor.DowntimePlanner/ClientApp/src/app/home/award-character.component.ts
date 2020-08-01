import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AwardCharacterBatchRequest, CharacterResponse } from '../services/business/api.service';

@Component({
  selector: 'app-award-character',
  templateUrl: './award-character.component.html',
})
export class AwardCharacterComponent {
  public characters: CharacterResponse[];
  public form = new FormGroup({
    downtimeDays: new FormControl('5', [Validators.required, Validators.min(1)])
  });
  public processing = false;
  public onAward = (result: AwardCharacterBatchRequest) => of(null);

  constructor(
    public modalRef: BsModalRef
  ) {
  }

  public award() {
    this.processing = true;
    this.onAward({
        ids: this.characters.map(c => c.id),
        request: {
          delta: parseInt(this.form.controls.downtimeDays.value, 10)
        }
      })
      .pipe(
        tap(() => this.modalRef.hide(), () => { this.processing = false; })
      )
      .subscribe();
  }
}
