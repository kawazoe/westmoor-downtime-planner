import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
})
export class PickerComponent<T> {
  @Input() public choices: T[];
  @Input() public value: T;
  @Output() public change = new EventEmitter<T>();

  public select(value: T) {
    this.value = value;
    this.change.emit(value);
  }
}
