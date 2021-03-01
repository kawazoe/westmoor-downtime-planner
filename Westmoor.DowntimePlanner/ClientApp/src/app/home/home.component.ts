import { Component } from '@angular/core';
import { AuthService } from '../services/business/auth.service';
import {
  AdvanceDowntimeBatchRequest,
  ApiService,
  AwardCharacterBatchRequest,
  CharacterResponse,
  CreateDowntimeBatchRequest,
  DowntimeResponse
} from '../services/business/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AwardCharacterComponent } from './award-character.component';
import { AdvanceDowntimeComponent } from './advance-downtime.component';
import { ScheduleDowntimeComponent } from './schedule-downtime.component';
import { concat} from 'rxjs';
import { last, map, tap } from 'rxjs/operators';
import { ModalDeleteComponent } from '../components/modal-edit/modal-delete.component';
import { RefreshService } from '../services/business/refresh.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public user$ = this.auth.user$;
  public userFullName$ = this.auth.user$.pipe(map(u => u?.name));

  public characters$ = this.api.getAllCharacters()
    .pipe(
      tap(() => { this.selectedCharacters = []; }),
      this.refresh.listen(t => [undefined, 'characters'].includes(t))
    );
  public currentDowntimes$ = this.api.getCurrentDowntimes()
    .pipe(
      tap(() => { this.selectedDowntimes = []; }),
      this.refresh.listen(t => [undefined, 'currentDowntimes'].includes(t))
    );
  public completedDowntimes$ = this.api.getCompletedDowntimes()
    .pipe(
      tap(() => { this.selectedDowntimes = []; }),
      this.refresh.listen(t => [undefined, 'completedDowntimes'].includes(t))
    );

  public selectedCharacters: CharacterResponse[] = [];
  public selectedDowntimes: DowntimeResponse[] = [];

  private modalRef: BsModalRef;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private modal: BsModalService,
    private refresh: RefreshService
  ) {
  }

  public toggleCharacter(character: CharacterResponse) {
    if (this.selectedCharacters.includes(character)) {
      this.selectedCharacters = this.selectedCharacters.filter(c => c !== character);
    } else {
      this.selectedCharacters = [...this.selectedCharacters, character];
    }
  }

  public toggleDowntime(downtime: DowntimeResponse) {
    if (this.selectedDowntimes.includes(downtime)) {
      this.selectedDowntimes = this.selectedDowntimes.filter(d => d !== downtime);
    } else {
      this.selectedDowntimes = [...this.selectedDowntimes, downtime];
    }
  }

  public beginAwardCharacter() {
    this.modalRef = this.modal.show(AwardCharacterComponent, { initialState: { characters: this.selectedCharacters } });
    this.modalRef.content.onAward = r => this.endAwardCharacter(r);
  }

  public beginScheduleDowntime() {
    this.modalRef = this.modal.show(ScheduleDowntimeComponent, { initialState: { characters: this.selectedCharacters } });
    this.modalRef.content.onSchedule = r => this.endScheduleDowntime(r);
  }

  public beginAdvanceDowntime() {
    this.modalRef = this.modal.show(AdvanceDowntimeComponent, { initialState: { downtimes: this.selectedDowntimes } });
    this.modalRef.content.onAward = r => this.endAdvanceDowntime(r);
  }

  private endAwardCharacter(request: AwardCharacterBatchRequest) {
    return this.api.awardCharacterBatch(request)
      .pipe(
        this.refresh.onNext(() => 'characters')
      );
  }

  private endScheduleDowntime(request: CreateDowntimeBatchRequest) {
    return this.api.createDowntimeBatch(request)
      .pipe(
        this.refresh.onNext(() => 'characters'),
        this.refresh.onNext(() => 'currentDowntimes')
      );
  }

  private endAdvanceDowntime(request: AdvanceDowntimeBatchRequest) {
    return this.api.advanceDowntimeBatch(request)
      .pipe(
        this.refresh.onNext(() => 'characters'),
        this.refresh.onNext(() => 'currentDowntimes'),
        this.refresh.onNext(() => 'completedDowntimes'),
      );
  }

  public beginCancelDowntimes() {
    const ids = this.selectedDowntimes
      .map(d => `${d.character.characterFullName} (${d.character.playerFullName}) - ${d.activity.name}`);

    this.modalRef = this.modal.show(ModalDeleteComponent, { initialState: { type: 'downtime', id: ids } });
    this.modalRef.content.onConfirm = () => this.endCancelDowntimes();
  }

  private endCancelDowntimes() {
    const batch = this.selectedDowntimes
      .map(downtime => this.api.deleteDowntime(downtime.idp, downtime.id));

    return concat(...batch)
      .pipe(
        last(),
        this.refresh.onNext(() => 'currentDowntimes')
      );
  }
}
