import { Component, Input } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ApiService, SharedWithResponse, UserResponse } from '../../services/business/api.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { AuthService } from '../../services/business/auth.service';

@Component({
  selector: 'app-ownership',
  templateUrl: './ownership.component.html',
  styleUrls: ['./ownership.component.css']
})
export class OwnershipComponent {
  @Input() public formArray: FormArray;
  @Input() public sharedWith: SharedWithResponse[];

  public user$ = this.auth.user$;

  public search: string;
  public usersByEmail$ = new Observable((o: Observer<string>) => {
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
    private auth: AuthService,
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

    const index = this.formArray.controls.findIndex(c => c.value === ownershipId);

    if (index !== -1) {
      return;
    }

    this.sharedWith = [
      ...this.sharedWith,
      {
        ownershipId,
        picture: user.picture,
        email: user.email,
        username: user.username,
        name: user.name
      }
    ];
    this.formArray.push(new FormControl(ownershipId));
  }

  public delete(id: string) {
    const index = this.formArray.controls.findIndex(c => c.value === id);

    if (index === -1) {
      return;
    }

    this.formArray.removeAt(index);
  }

  getOwnershipId(ownershipId: string) {
    return (sharedWith: SharedWithResponse) => sharedWith.ownershipId === ownershipId;
  }
}
