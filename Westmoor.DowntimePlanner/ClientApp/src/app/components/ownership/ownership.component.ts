import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { combineLatest, defer, of } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService, CampaignResponse, SharedWithResponse, UserResponse } from '../../services/business/api.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { AuthService } from '../../services/business/auth.service';

@Component({
  selector: 'app-ownership',
  templateUrl: './ownership.component.html',
  styleUrls: ['./ownership.component.css']
})
export class OwnershipComponent {
  public FormGroupType = FormGroup;

  @Input() public formArray: FormArray;

  public user$ = this.auth.user$;

  public search: string;
  public usersByEmail$ = defer(() => of(this.search))
    .pipe(
      debounceTime(500),
      switchMap(query => {
        if (!query || query.length < 2) {
          return of([]);
        }

        const queryOrDefault = query.includes(':')
          ? query
          : `email:${query}* OR name:${query}*`;


        return combineLatest([
            this.api.searchCampaigns(queryOrDefault)
              .pipe(
                map(cs => cs.map(c => ({
                  kind: 'tenant',
                  ownershipId: c.id,
                  picture: null,
                  email: null,
                  username: null,
                  name: c.name
                }) as SharedWithResponse)),
                startWith([])
              ),
            this.api.searchUsers(queryOrDefault)
              .pipe(
                map(us => us.map(u => ({
                  kind: 'user',
                  ownershipId: u.userMetadata.ownershipId,
                  picture: u.picture,
                  email: u.email,
                  username: u.username,
                  name: u.name
                }) as SharedWithResponse)),
                startWith([])
              )
          ])
          .pipe(
            map(([campaigns, users]: [CampaignResponse[], UserResponse[]]) => [...campaigns, ...users])
          );
      })
    );

  constructor(
    private auth: AuthService,
    private api: ApiService
  ) {
  }

  public share(match: TypeaheadMatch) {
    const sharedWith = match.item as SharedWithResponse;

    this.search = '';

    const index = this.formArray.controls
      .map(ctrl => ctrl as FormGroup)
      .findIndex(c => c.controls.ownershipId.value === sharedWith.ownershipId);

    if (index !== -1) {
      return;
    }

    this.formArray.push(new FormGroup({
      kind: new FormControl(sharedWith.kind),
      ownershipId: new FormControl(sharedWith.ownershipId),
      picture: new FormControl(sharedWith.picture),
      email: new FormControl(sharedWith.email),
      username: new FormControl(sharedWith.username),
      name: new FormControl(sharedWith.name)
    }));
  }

  public delete(ownershipId: string) {
    const index = this.formArray.controls
      .map(ctrl => ctrl as FormGroup)
      .findIndex(c => c.controls.ownershipId.value === ownershipId);

    if (index === -1) {
      return;
    }

    this.formArray.removeAt(index);
  }
}
