import { Component } from '@angular/core';
import { BehaviorSubject, of, OperatorFunction } from 'rxjs';
import { ApiService, CharacterResponse } from '../services/business/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { switchMap, tap } from 'rxjs/operators';
import { ModalDeleteComponent } from '../components/modal-edit/modal-delete.component';
import { CharacterCreateComponent } from './character-create.component';
import { CharacterUpdateComponent } from './character-update.component';

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
    this.modalRef.content.onSave = request => this.api
      .createCharacter(request)
      .pipe(this.refresh());
  }

  public edit(character: CharacterResponse) {
    this.modalRef = this.modal.show(CharacterUpdateComponent, { initialState: { source: character } });
    this.modalRef.content.onSave = request => this.api
      .updateCharacter(character.id, request)
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
