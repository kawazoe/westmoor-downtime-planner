import { Component } from '@angular/core';
import { AuthService } from '../services/business/auth.service';
import {
  ApiService,
  AwardCharacterRequest,
  CharacterResponse, CreateDowntimeRequest,
  DowntimeResponse
} from '../services/business/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AwardCharacterComponent } from './award-character.component';
import { AwardProgressAction, AwardProgressComponent } from './award-progress.component';
import { ScheduleDowntimeComponent } from './schedule-downtime.component';
import { BehaviorSubject, concat, of, OperatorFunction } from 'rxjs';
import { last, map, switchMap, take } from 'rxjs/operators';
import { ModalDeleteComponent } from '../components/modal-edit/modal-delete.component';
import { groupBy } from '../../lib/functional';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public userFullName$ = this.auth.user$.pipe(map(u => u?.name));
  public user$ = this.auth.user$;

  private characters = new BehaviorSubject<CharacterResponse[]>([]);
  private currentDowntimes = new BehaviorSubject<DowntimeResponse[]>([]);
  private completedDowntimes = new BehaviorSubject<DowntimeResponse[]>([]);

  public characters$ = this.characters.asObservable();
  public currentDowntimes$ = this.currentDowntimes.asObservable();
  public completedDowntimes$ = this.completedDowntimes.asObservable();

  public selectedCharacters: CharacterResponse[] = [];
  public selectedDowntimes: DowntimeResponse[] = [];

  private modalRef: BsModalRef;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private modal: BsModalService
  ) {
    of(null)
      .pipe(
        this.refreshCharacters(),
        this.refreshCurrentDowntimes(),
        this.refreshCompletedDowntimes()
      )
      .subscribe();
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

  private refreshCharacters(): OperatorFunction<any, void> {
    return o => o
      .pipe(
        switchMap(() => this.api.getAllCharacters()),
        take(1),
        map(cs => {
          this.selectedCharacters = [];
          this.characters.next(cs);
        })
      );
  }

  private refreshCurrentDowntimes(): OperatorFunction<any, void> {
    return o => o
      .pipe(
        switchMap(() => this.api.getCurrentDowntimes()),
        take(1),
        map(ds => {
          this.selectedDowntimes = [];
          this.currentDowntimes.next(ds);
        })
      );
  }

  private refreshCompletedDowntimes(): OperatorFunction<any, void> {
    return o => o
      .pipe(
        switchMap(() => this.api.getCompletedDowntimes()),
        take(1),
        map(ds => {
          this.selectedDowntimes = [];
          this.completedDowntimes.next(ds);
        })
      );
  }

  public beginAwardCharacter() {
    this.modalRef = this.modal.show(AwardCharacterComponent);
    this.modalRef.content.onAward = r => this.endAwardCharacter(r);
  }

  public beginScheduleDowntime() {
    this.modalRef = this.modal.show(ScheduleDowntimeComponent);
    this.modalRef.content.onSchedule = r => this.endScheduleDowntime(r);
  }

  public beginAwardProgress() {
    this.modalRef = this.modal.show(AwardProgressComponent);
    this.modalRef.content.onAward = r => this.endAwardProgress(r);
  }

  private endAwardCharacter(result: AwardCharacterRequest) {
    const batch = this.selectedCharacters
      .map(c => this.api.awardCharacter(c.id, result));

    return concat(...batch)
      .pipe(
        last(),
        this.refreshCharacters()
      );
  }

  private endScheduleDowntime(result: Omit<CreateDowntimeRequest, 'characterId'>) {
    const batch = this.selectedCharacters
      .map(c => this.api.createDowntime({ ...result, characterId: c.id }));

    return concat(...batch)
      .pipe(
        last(),
        this.refreshCharacters(),
        this.refreshCurrentDowntimes()
      );
  }

  private endAwardProgress(result: AwardProgressAction) {
    const batch = this.selectedDowntimes
      .map(downtime => {
        const downtimeId = downtime.id;
        const character = downtime.character;
        const progresses = result.costs
          .map(cost => {
            const original = downtime.progresses
              .find(c => c.activityCostKind === cost.activityCostKind);

            return {
              activityCostKind: cost.activityCostKind,
              delta: cost.delta,
              value: original.value + cost.delta,
              goal: original.goal
            };
          });

        const costs = downtime.progresses
          .map(original => progresses
            .find(p => p.activityCostKind === original.activityCostKind)
            || original
          );

        return {
          downtimeId: downtimeId,
          character: character,
          costs: costs,
          sharedWith: downtime.sharedWith
        };
      });

    const downtimeBatch = batch.map(r => this.api.updateDowntime(r.downtimeId, r));

    const characterBatch = groupBy(batch, d => d.character.id)
      .map(group => {
        const costDays = group.values
          .map(d => d.costs.find(c => c.activityCostKind === 'days'))
          .map(c => c && c['delta'] || 0)
          .reduce((acc, cur) => acc + cur, 0);

        return this.api.getCharacterById(group.key)
          .pipe(
            switchMap(character => {
              const accruedDowntimeDays = character.accruedDowntimeDays - costDays;

              return this.api.updateCharacter(character.id, {
                playerFullName: character.playerFullName,
                characterFullName: character.characterFullName,
                accruedDowntimeDays: accruedDowntimeDays,
                sharedWith: character.sharedWith
              });
            })
          );
      });

    return concat(...downtimeBatch)
      .pipe(
        last(),
        switchMap(() => concat(...characterBatch)),
        last(),
        this.refreshCharacters(),
        this.refreshCurrentDowntimes(),
        this.refreshCompletedDowntimes()
      );
  }

  public beginCancelDowntimes() {
    const id = this.selectedDowntimes.length > 1
      ? 'multiple'
      : this.selectedDowntimes[0].id;

    this.modalRef = this.modal.show(ModalDeleteComponent, { initialState: { type: 'downtime', id } });
    this.modalRef.content.onConfirm = () => this.endCancelDowntimes();
  }

  private endCancelDowntimes() {
    const batch = this.selectedDowntimes
      .map(downtime => this.api.deleteDowntime(downtime.id));

    return concat(...batch)
      .pipe(
        last(),
        this.refreshCompletedDowntimes()
      );
  }
}
