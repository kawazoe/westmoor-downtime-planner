import { Component, EventEmitter, Input, Output } from '@angular/core';
import { uniq } from '../../../lib/functional';

@Component({
  selector: 'app-multi-picker',
  templateUrl: './multi-picker.component.html',
  styleUrls: ['./multi-picker.component.css']
})
export class MultiPickerComponent<T> {
  private _choices: T[];
  @Input() public set choices(values: T[]) {
    this._choices = values;
    this.unselectedChoices = values;
  }
  public get choices() {
    return this._choices;
  }
  @Input() public mainLabelSelector: (vals: T[]) => string = vs => vs.map(this.listLabelSelector).join(', ');
  @Input() public listLabelSelector: (val: T) => string = v => `${v}`;

  @Input() public values: T[] = [];
  @Output() public change = new EventEmitter<T[]>();

  public unselectedChoices: T[];

  public select(value: T) {
    this.values = uniq([...this.values, value]);
    this.unselectedChoices = this.unselectedChoices.filter(v => v !== value);
    this.change.emit(this.values);
  }

  public unselect(value: T) {
    this.values = this.values.filter(v => v !== value);
    this.unselectedChoices = this.choices.filter(v => !this.values.includes(v));
    this.change.emit(this.values);
  }
}
