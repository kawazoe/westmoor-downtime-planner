import { Component } from '@angular/core';
import { ApiService, CharacterResponse } from '../services/business/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalDeleteComponent } from '../components/modal-edit/modal-delete.component';
import { CharacterCreateComponent } from './character-create.component';
import { CharacterUpdateComponent } from './character-update.component';
import { AuthService } from '../services/business/auth.service';
import { RefreshService } from '../services/business/refresh.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
})
export class CharactersComponent {
  private modalRef: BsModalRef;

  public user$ = this.auth.user$;
  public characters$ = this.api.getAllCharacters().pipe(this.refresh.listen());

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private modal: BsModalService,
    private refresh: RefreshService
  ) {
  }

  public create() {
    this.modalRef = this.modal.show(CharacterCreateComponent);
    this.modalRef.content.onSave = request => this.api
      .createCharacter(request)
      .pipe(this.refresh.onNext());
  }

  public edit(character: CharacterResponse) {
    this.modalRef = this.modal.show(CharacterUpdateComponent, { initialState: { source: character } });
    this.modalRef.content.onSave = request => this.api
      .updateCharacter(character.id, request)
      .pipe(this.refresh.onNext());
  }

  public delete(character: CharacterResponse) {
    const id = `${character.characterFullName} (${character.playerFullName})`;
    this.modalRef = this.modal.show(ModalDeleteComponent, { initialState: { type: 'character', id } });
    this.modalRef.content.onConfirm = () => this.api
      .deleteCharacter(character.idp, character.id)
      .pipe(this.refresh.onNext());
  }
}
