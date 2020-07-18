import { Component } from '@angular/core';
import { BehaviorSubject, of, OperatorFunction } from 'rxjs';
import { ApiService, CharacterResponse } from '../api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { switchMap, tap } from 'rxjs/operators';
import { ModalDeleteComponent } from '../modal-edit/modal-delete.component';
import { CharacterCreateComponent } from './character-create.component';
import { CharacterUpdateComponent } from './character-update.component';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
})
export class CharactersComponent {
  private characters = new BehaviorSubject<CharacterResponse[]>([]);

  private modalRef: BsModalRef;

  public characters$ = this.characters.asObservable();

  constructor(
    private api: ApiService,
    private modal: BsModalService
  ) {
    of(null).pipe(this.refresh()).subscribe();
  }

  public create() {
    this.modalRef = this.modal.show(CharacterCreateComponent);
    this.modalRef.content.onSave = form => this.api
      .createCharacter({
        playerFullName: form.controls.playerFullName.value,
        characterFullName: form.controls.characterFullName.value,
        sharedWith: (form.controls.sharedWith as FormArray).controls
          .map(ctrls => ctrls.value)
      })
      .pipe(this.refresh());
  }

  public edit(character: CharacterResponse) {
    this.modalRef = this.modal.show(CharacterUpdateComponent, { initialState: { source: character } });
    this.modalRef.content.onSave = form => this.api
      .updateCharacter(character.id, {
        playerFullName: form.controls.playerFullName.value,
        characterFullName: form.controls.characterFullName.value,
        accruedDowntimeDays: parseInt(form.controls.accruedDowntimeDays.value, 10),
        sharedWith: (form.controls.sharedWith as FormArray).controls
          .map(ctrls => ctrls.value)
      })
      .pipe(this.refresh());
  }

  public delete(character: CharacterResponse) {
    this.modalRef = this.modal.show(ModalDeleteComponent, { initialState: { type: 'character', id: character.id } });
    this.modalRef.content.onConfirm = () => this.api
      .deleteCharacter(character.id)
      .pipe(this.refresh());
  }

  private refresh(): OperatorFunction<void, CharacterResponse[]> {
    return o => o.pipe(
      switchMap(() => this.api.getAllCharacters()),
      tap(cs => this.characters.next(cs))
    );
  }
}
