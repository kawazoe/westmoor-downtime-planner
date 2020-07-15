import { Component } from '@angular/core';
import { AuthService, hasRole } from '../auth.service';
import { ApiService, CharacterResponse, DowntimeResponse, UserResponse } from '../api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AwardDowntimeComponent } from './award-downtime.component';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AwardProgressComponent } from './award-progress.component';
import { ScheduleDowntimeComponent } from './schedule-downtime.component';
import { BehaviorSubject, combineLatest, concat, of, OperatorFunction } from 'rxjs';
import { last, map, switchMap, take, tap } from 'rxjs/operators';
import { ModalDeleteComponent } from '../modal-edit/modal-delete.component';
import { groupBy, uniq } from '../../lib/functional';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public user$ = this.auth.user$;
  public isAdmin$ = hasRole('Admin')(this.auth.user$);

  private characters = new BehaviorSubject<CharacterResponse[]>([]);
  private downtimes = new BehaviorSubject<DowntimeResponse[]>([]);

  public characters$ = this.characters.asObservable();
  public downtimes$ = this.downtimes.asObservable();

  public selectedCharacters: CharacterResponse[] = [];
  public selectedDowntimes: DowntimeResponse[] = [];

  public impersonateForm = new FormGroup({
    playerName: new FormControl('', Validators.required)
  });
  public impersonatePlayerFullName: string;

  private modalRef: BsModalRef;

  public isCompleted = (v: DowntimeResponse) => v.progresses.every(p => p.value >= p.goal);
  public isScheduled = (v: DowntimeResponse) => !this.isCompleted(v);

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private modal: BsModalService
  ) {
    of(null).pipe(this.refreshCharacters(), this.refreshDowntimes()).subscribe();
  }

  public beginAwardDowntime() {
    this.modalRef = this.modal.show(AwardDowntimeComponent);
    this.modalRef.content.onAward = form => {
      const batch = this.selectedCharacters
        .map(character => ({
          characterId: character.id,
          playerFullName: character.playerFullName,
          characterFullName: character.characterFullName,
          accruedDowntimeDays: character.accruedDowntimeDays + parseInt(form.controls.downtimeDays.value, 10)
        }))
        .map(r => this.api.updateCharacter(r.characterId, r));

      return concat(...batch).pipe(last(), this.refreshCharacters());
    };
  }

  public toggleCharacter(character: CharacterResponse) {
    if (this.selectedCharacters.includes(character)) {
      this.selectedCharacters = this.selectedCharacters.filter(c => c !== character);
    } else {
      this.selectedCharacters = [...this.selectedCharacters, character];
    }
  }

  public beginScheduleDowntime() {
    this.modalRef = this.modal.show(ScheduleDowntimeComponent);
    this.modalRef.content.onSchedule = form => {
      const batch = this.selectedCharacters
        .map(character => ({
          characterId: character.id,
          activityId: form.controls.activityId.value,
          costs: (form.controls.costs as FormArray).controls
            .map(ctrl => ctrl as FormGroup)
            .map(cost => ({
              activityCostKind: cost.controls.activityCostKind.value,
              goal: cost.controls.goal.value
            }))
        }))
        .map(r => this.api.createDowntime(r));

      return concat(...batch).pipe(last(), this.refreshCharacters(), this.refreshDowntimes());
    };
  }

  public beginAwardProgress() {
    this.modalRef = this.modal.show(AwardProgressComponent);
    this.modalRef.content.onAward = form => {
      const batch = this.selectedDowntimes
        .map(downtime => {
          const downtimeId = downtime.id;
          const character = downtime.character;
          const progresses = (form.controls.costs as FormArray).controls
            .map(ctrl => ctrl as FormGroup)
            .map(cost => {
              const activityCostKind = cost.controls.activityCostKind.value;
              const delta = parseInt(cost.controls.delta.value, 10);
              const original = downtime.progresses
                .find(c => c.activityCostKind === activityCostKind);

              return {
                activityCostKind: activityCostKind,
                delta: delta,
                value: original.value + delta,
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
            costs: costs
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
                  accruedDowntimeDays: accruedDowntimeDays
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
          this.refreshDowntimes()
        );
    };
  }

  public toggleDowntime(downtime: DowntimeResponse) {
    if (this.selectedDowntimes.includes(downtime)) {
      this.selectedDowntimes = this.selectedDowntimes.filter(d => d !== downtime);
    } else {
      this.selectedDowntimes = [...this.selectedDowntimes, downtime];
    }
  }

  public cancelDowntimes() {
    const id = this.selectedDowntimes.length > 1
      ? 'multiple'
      : this.selectedDowntimes[0].id;

    this.modalRef = this.modal.show(ModalDeleteComponent, { initialState: { type: 'downtime', id } });
    this.modalRef.content.onConfirm = () => {
      const batch = this.selectedDowntimes
        .map(downtime => this.api.deleteDowntime(downtime.id));

      return concat(...batch).pipe(last(), this.refreshDowntimes());
    };
  }

  private refreshCharacters(): OperatorFunction<any, void> {
    return o => switchMap(() => combineLatest([this.api.getAllCharacters(), this.user$]))(o)
      .pipe(
        take(1),
        map(([cs, user]: [CharacterResponse[], UserResponse]) => {
          this.selectedCharacters = [];
          this.characters.next(cs.filter(c =>
            c.playerFullName === this.impersonatePlayerFullName ||
            user?.roles.includes('Admin')
          ));
        })
      );
  }

  private refreshDowntimes(): OperatorFunction<any, void> {
    return o => switchMap(() => combineLatest([this.api.getAllDowntimes(), this.user$]))(o)
      .pipe(
        take(1),
        map(([ds, user]: [DowntimeResponse[], UserResponse]) => {
          this.selectedDowntimes = [];
          this.downtimes.next(ds.filter(d =>
            d.character.playerFullName === this.impersonatePlayerFullName ||
            user?.roles.includes('Admin')
          ));
        })
      );
  }

  public impersonate() {
    this.impersonatePlayerFullName = this.impersonateForm.controls.playerName.value;

    of(null).pipe(this.refreshCharacters(), this.refreshDowntimes()).subscribe();
  }
}
