import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ActivityCostKinds =
  'days' |
  'gold';

@Component({
  selector: 'app-activity-cost-kind-picker',
  templateUrl: './activity-cost-kind-picker.component.html',
})
export class ActivityCostKindPickerComponent {
  @Input() public value: ActivityCostKinds;
  @Output() public change = new EventEmitter<ActivityCostKinds>();

  public select(value: ActivityCostKinds) {
    this.value = value;
    this.change.emit(value);
  }
}
