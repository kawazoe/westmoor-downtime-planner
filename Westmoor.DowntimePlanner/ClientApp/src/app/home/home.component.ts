import { Component } from '@angular/core';
import { AuthService, hasRole } from '../auth.service';
import { ApiService, CharacterResponse, DowntimeResponse } from '../api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AwardDowntimeComponent } from './award-downtime.component';
import { FormArray, FormGroup } from '@angular/forms';
import { AwardProgressComponent } from './award-progress.component';
import { ScheduleDowntimeComponent } from './schedule-downtime.component';
import { BehaviorSubject, concat, of, OperatorFunction } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ModalDeleteComponent } from '../modal-edit/modal-delete.component';

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

  private modalRef: BsModalRef;

  public isCompleted = (v: DowntimeResponse) => v.progresses.every(p => p.value >= p.goal);
  public isScheduled = (v: DowntimeResponse) => !this.isCompleted(v);

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private modal: BsModalService
  ) {
    of(null).pipe(this.refreshCharacters()).subscribe();
    of(null).pipe(this.refreshDowntimes()).subscribe();
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

      return concat(...batch).pipe(this.refreshCharacters());
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

      return concat(...batch).pipe(this.refreshCharacters(), this.refreshDowntimes());
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
        })
        .map(r => this.api
          .updateDowntime(r.downtimeId, r)
          .pipe(
            switchMap(() => {
              const costDays = r.costs.find(c => c.activityCostKind === 'days');
              const accruedDowntimeDays = r.character.accruedDowntimeDays - (costDays && costDays['delta'] || 0);

              return this.api.updateCharacter(r.character.id, {
                playerFullName: r.character.playerFullName,
                characterFullName: r.character.characterFullName,
                accruedDowntimeDays: accruedDowntimeDays
              });
            })
          )
        );

      return concat(...batch).pipe(this.refreshCharacters(), this.refreshDowntimes());
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

      return concat(...batch).pipe(this.refreshDowntimes());
    };
  }

  private refreshCharacters(): OperatorFunction<any, CharacterResponse[]> {
    return o => o.pipe(
      switchMap(() => this.api.getAllCharacters()),
      tap(cs => {
        this.selectedCharacters = [];
        this.characters.next(cs);
      })
    );
  }

  private refreshDowntimes(): OperatorFunction<any, DowntimeResponse[]> {
    return o => o.pipe(
      switchMap(() => this.api.getAllDowntimes()),
      tap(ds => {
        this.selectedDowntimes = [];
        this.downtimes.next(ds);
      })
    );
  }
}
