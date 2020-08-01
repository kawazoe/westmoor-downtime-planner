import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { defer, forkJoin, from, merge, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  ActivityCostKinds,
  ActivityCostResponse,
  ActivityResponse,
  ApiService
} from '../services/business/api.service';

import * as jexl from 'jexl';

const dispatchNoMatch = Symbol.for('dispatchNoMatch');

const equalExpression = jexl.compile('left == right');

jexl.addTransform('min', (value: number, min: number) => Math.min(value, min));
jexl.addTransform('max', (value: number, max: number) => Math.max(value, max));
jexl.addTransform('between', (value: number, min: number, max: number) => Math.max(Math.min(value, max), min));
jexl.addTransform('eval', (expression: string, ctx: any) => jexl.eval(expression, ctx));
jexl.addTransform('dispatch', (value: any, ...targets: [any, any][]) => {
  const evalTarget = (predicate, selector) => {
    if (typeof predicate === 'string') {
      return jexl.eval(predicate, {v: value})
        .then(success => success ? selector : dispatchNoMatch);
    } else if (predicate === true) {
      return Promise.resolve(selector);
    } else {
      return equalExpression.eval({left: predicate, right: value})
        .then(r => r ? selector : dispatchNoMatch);
    }
  };

  const evalSelector = (selector) => {
    if (selector === dispatchNoMatch) {
      return dispatchNoMatch;
    } else if (typeof selector === 'string') {
      return jexl.eval(selector, {v: value});
    } else {
      return selector;
    }
  };

  const iteration = (predicate, selector, accumulator) => accumulator === dispatchNoMatch
    ? evalTarget(predicate, selector).then(s => evalSelector(s))
    : accumulator;

  let result = Promise.resolve(dispatchNoMatch);

  for (const target of targets) {
    const [predicate, selector] = target;

    result = result.then(acc => iteration(predicate, selector, acc));
  }

  return result;
});

export interface ScheduleDowntimeAction {
  activityId: string;
  costs: ScheduleDowntimeCostAction[];
}

export interface ScheduleDowntimeCostAction {
  activityCostKind: ActivityCostKinds;
  goal: number;
}

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
  public onSchedule = (result: ScheduleDowntimeAction) => of(null);

  constructor(
    public modalRef: BsModalRef,
    private api: ApiService
  ) {
  }

  public schedule() {
    this.processing = true;
    this.onSchedule({
        activityId: this.form.controls.activityId.value,
        costs: (this.form.controls.costs as FormArray).controls
          .map(ctrl => ctrl as FormGroup)
          .map(cost => ({
            activityCostKind: cost.controls.activityCostKind.value,
            goal: cost.controls.goal.value,
          }))
      })
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
