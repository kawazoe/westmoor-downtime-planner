import { Component, Input } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ApiService, UserResponse } from '../api.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-ownership',
  templateUrl: './ownership.component.html',
  styleUrls: ['./ownership.component.css']
})
export class OwnershipComponent {
  @Input() public sharedWith: FormArray;

  public search: string;
  usersByEmail$ = new Observable((o: Observer<string>) => {
      o.next(this.search);
    })
    .pipe(
      debounceTime(500),
      switchMap(query => {
        if (!query || query.length < 2) {
          return of([]);
        }

        return this.api.searchUsers( query.includes(':')
          ? query
          : `email:${query}* OR name:${query}*`
        );
      })
    );

  constructor(
    private api: ApiService
  ) {
  }

  public share(match: TypeaheadMatch) {
    const user = match.item as UserResponse;

    this.search = '';

    const ownershipId = user.userMetadata.ownershipId;
    if (!ownershipId) {
      return;
    }

    const index = this.sharedWith.controls.findIndex(c => c.value === ownershipId);

    if (index !== -1) {
      return;
    }

    this.sharedWith.push(new FormControl(ownershipId));
  }

  public delete(id: string) {
    const index = this.sharedWith.controls.findIndex(c => c.value === id);

    if (index === -1) {
      return;
    }

    this.sharedWith.removeAt(index);
  }
}
