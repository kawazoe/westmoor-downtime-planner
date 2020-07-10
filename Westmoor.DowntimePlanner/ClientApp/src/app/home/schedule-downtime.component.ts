import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { defer, forkJoin, from, merge, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ActivityCostResponse, ActivityResponse, ApiService } from '../api.service';

import * as jexl from 'jexl';

@Component({
  selector: 'app-schedule-downtime',
  templateUrl: './schedule-downtime.component.html',
})
export class ScheduleDowntimeComponent {
  public FormArrayType = FormArray;

  public activities$ = this.api.getAllActivities();
  public selectedActivity: ActivityResponse;

  public form = new FormGroup({
    activityId: new FormControl('', [Validators.required]),
    costs: new FormArray([], Validators.required)
  });

  private formValueChanges$ = merge(of(null), this.form.controls.activityId.valueChanges)
    .pipe(
      switchMap(() => merge(of(null), (this.form.controls.costs as FormArray).valueChanges))
    );
  public goalCalculations$ = this.formValueChanges$
    .pipe(
      map(() => (this.form.controls.costs as FormArray).controls
        .map(ctrl => ctrl as FormGroup)
      ),
      map(costs => costs
        .map(cost => {
          const context = (cost.controls.parameters as FormArray).controls
            .map(ctrl => ctrl as FormGroup)
            .reduce(
              (acc, parameter) => ({
                ...acc,
                [parameter.controls.variableName.value]: parameter.controls.variableValue.value
              }),
              {} as { [key: string]: number }
            );

          return {
            activityCostKind: cost.controls.activityCostKind.value,
            context,
            jexlExpression: cost.controls.jexlExpression.value,
            goalSetter(result: number) {
              cost.controls.goal.setValue(result, { emitEvent: false });
            }
          };
        })
      ),
      switchMap(requests => {
        const processes: Observable<string|void>[] = requests
          .map(request =>
            defer(() =>
              from(jexl.eval(request.jexlExpression, request.context))
            )
            .pipe(
              map(result => typeof result !== 'number' || isNaN(result)
                ? 'Expression result is invalid.'
                : request.goalSetter(result)
              )
            )
          );

          return merge(of([]), forkJoin(...processes));
        }
      ),
      catchError(err => of(err)),
      map(results => Array.isArray(results)
        ? results.filter(r => !!r)
        : [results?.message]
      )
    );

  public processing = false;
  public onSchedule = (form: FormGroup) => of(null);

  constructor(
    public modalRef: BsModalRef,
    private api: ApiService
  ) {
  }

  public schedule() {
    this.processing = true;
    this.onSchedule(this.form)
      .pipe(
        tap(() => this.modalRef.hide(), () => { this.processing = false; })
      )
      .subscribe();
  }

  public selectActivity(activity: ActivityResponse) {
    this.selectedActivity = activity;
    this.form.controls.activityId.setValue(activity.id);
    this.form.controls.costs.reset();

    for (const cost of activity.costs) {
      this.addCost(this.form, cost);
    }
  }

  addCost(parentForm: FormGroup, cost: ActivityCostResponse) {
    const costForm = new FormGroup({
      activityCostKind: new FormControl(cost.kind, Validators.required),
      jexlExpression: new FormControl(cost.jexlExpression, Validators.required),
      goal: new FormControl(0, Validators.required),
      parameters: new FormArray(cost.parameters.map(p => new FormGroup({
        variableName: new FormControl(p.variableName, Validators.required),
        description: new FormControl(p.description, Validators.required),
        variableValue: new FormControl('', Validators.required)
      })))
    });

    (parentForm.controls.costs as FormArray).push(costForm);
  }
}
