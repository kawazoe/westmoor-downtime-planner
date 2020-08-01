import { Component } from '@angular/core';
import { AuthService } from '../services/business/auth.service';
import {
  AdvanceDowntimeRequest,
  ApiService,
  AwardCharacterRequest,
  CharacterResponse,
  CreateDowntimeRequest, DowntimeCostResponse,
  DowntimeResponse
} from '../services/business/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AwardCharacterComponent } from './award-character.component';
import { AdvanceDowntimeComponent } from './advance-downtime.component';
import { ScheduleDowntimeComponent } from './schedule-downtime.component';
import { BehaviorSubject, concat, of, OperatorFunction } from 'rxjs';
import { last, map, switchMap, take } from 'rxjs/operators';
import { ModalDeleteComponent } from '../components/modal-edit/modal-delete.component';
import { groupBy, uniq } from '../../lib/functional';

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

  public beginAdvanceDowntime() {
    this.modalRef = this.modal.show(AdvanceDowntimeComponent);
    this.modalRef.content.onAward = r => this.endAdvanceDowntime(r);
  }

  private endAwardCharacter(request: AwardCharacterRequest) {
    const batch = this.selectedCharacters
      .map(c => this.api.awardCharacter(c.id, request));

    return concat(...batch)
      .pipe(
        last(),
        this.refreshCharacters()
      );
  }

  private endScheduleDowntime(request: Omit<CreateDowntimeRequest, 'characterId'>) {
    const batch = this.selectedCharacters
      .map(c => this.api.createDowntime({ ...request, characterId: c.id }));

    return concat(...batch)
      .pipe(
        last(),
        this.refreshCharacters(),
        this.refreshCurrentDowntimes()
      );
  }

  private endAdvanceDowntime(request: AdvanceDowntimeRequest) {
    const downtimeBatch = this.selectedDowntimes
      .map(d => this.api.advanceDowntime(d.id, request));

    const deltasByKindByCharacter = groupBy(this.selectedDowntimes, d => d.character.id)
      .map(g => {
        const progresses = g.values
          .reduce((acc, cur) => [...acc, ...cur.progresses], [] as DowntimeCostResponse[]);

        return ({
          characterId: g.key,
          activityCostKinds: groupBy(progresses, p => p.activityCostKind)
            .map(progress => {
              const advanceRequest = request.costs
                .find(c => c.activityCostKind === progress.key);

              return advanceRequest
                ? ({
                  activityCostKind: progress.key,
                  delta: advanceRequest.delta * progress.values.length
                })
                : null;
            })
            .filter(req => req && req.delta)
        });
      });

    const characterBatch = deltasByKindByCharacter
      .map(character => ({
        characterId: character.characterId,
        // Limit requests to days as it is the only supported kind by the character api.
        request: {
          delta: character.activityCostKinds.find(p => p.activityCostKind === 'days').delta
        }
      }))
      .map(character => this.api.awardCharacter(character.characterId, character.request));

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
