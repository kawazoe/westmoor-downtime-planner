import { Component, Input } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-ownership',
  templateUrl: './ownership.component.html',
  styleUrls: ['./ownership.component.css']
})
export class OwnershipComponent {
  @Input() public sharedWith: FormArray;

  public sharedWithId = '';

  public share(id: string) {
    if (!id) {
      return;
    }

    const index = this.sharedWith.controls.findIndex(c => c.value === id);

    if (index !== -1) {
      return;
    }

    this.sharedWith.push(new FormControl(id));
  }

  public delete(id: string) {
    const index = this.sharedWith.controls.findIndex(c => c.value === id);

    if (index === -1) {
      return;
    }

    this.sharedWith.removeAt(index);
  }
}
